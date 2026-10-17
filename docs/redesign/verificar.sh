#!/usr/bin/env bash
# Verificação repetível do redesign.
#
#   bash docs/redesign/verificar.sh baseline   # grava o estado de referência
#   bash docs/redesign/verificar.sh comparar   # compara o estado atual com ele
#
# Prova que a camada protegida não mudou: hash dos arquivos de lógica, eventos e
# payloads dos quatro formulários, e a impressão digital do playbook em desktop
# e celular, com as mesmas fontes, estados e viewport.
#
# Nenhuma chamada real sai durante os testes: os scripts de captura bloqueiam
# tudo que não for o host local e respondem as rotas /api/* por mock. Pipedrive,
# Meta CAPI, GA4, GTM e a telemetria interna não recebem nada.
set -uo pipefail

MODO="${1:-comparar}"
RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DOCS="$RAIZ/docs/redesign"
PORTA="${PORTA:-3100}"
BASE="http://127.0.0.1:$PORTA"
TMP="${TMPDIR:-/tmp}/verificar-redesign"
mkdir -p "$TMP"
cd "$RAIZ"

falhas=0
ok()    { printf "  ok    %s\n" "$1"; }
falha() { printf "  FALHA %s\n" "$1"; falhas=$((falhas+1)); }
titulo(){ printf "\n== %s\n" "$1"; }

echo "Verificação do redesign — modo: $MODO"
echo "commit: $(git rev-parse --short HEAD)  branch: $(git branch --show-current)"

# ── 1. Hash dos arquivos protegidos ─────────────────────────────────────────
titulo "1. Camada protegida (src/lib e src/app/api)"
find src/lib src/app/api -type f \( -name '*.ts' -o -name '*.tsx' \) \
  | sort | xargs sha256sum | sed 's|  | |' > "$TMP/hashes-atual.txt"
if [ "$MODO" = "baseline" ]; then
  cp "$TMP/hashes-atual.txt" "$DOCS/hashes-protegidos.txt"
  ok "$(wc -l < "$TMP/hashes-atual.txt") arquivos registrados"
else
  if diff -u "$DOCS/hashes-protegidos.txt" "$TMP/hashes-atual.txt" > "$TMP/hashes.diff"; then
    ok "$(wc -l < "$TMP/hashes-atual.txt") arquivos, nenhum alterado"
  else
    falha "arquivos protegidos mudaram:"; sed -n '4,30p' "$TMP/hashes.diff"
  fi
fi

# ── 2. Typecheck e lint ─────────────────────────────────────────────────────
titulo "2. Typecheck e lint"
if npx tsc --noEmit > "$TMP/tsc.log" 2>&1; then ok "typecheck limpo"; else falha "typecheck com erros"; head -5 "$TMP/tsc.log"; fi
# Comparação por ARQUIVO e REGRA, não por contagem: um erro novo em um
# arquivo não é mascarado por outro corrigido em outro lugar.
npx eslint src -f json 2>/dev/null | node -e "
let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{
  const r=JSON.parse(s), linhas=[];
  for(const f of r) for(const m of f.messages) if(m.severity===2)
    linhas.push(f.filePath.replace(process.cwd()+'/','')+'|'+(m.ruleId||'sem-regra'));
  linhas.sort(); console.log(linhas.join('\n'));
})" > "$TMP/lint-atual.txt"
erros=$(grep -c . "$TMP/lint-atual.txt" || true)
if [ "$MODO" = "baseline" ]; then
  cp "$TMP/lint-atual.txt" "$DOCS/lint-erros-baseline.txt"
  ok "$erros erros de lint registrados por arquivo e regra"
else
  if diff -u "$DOCS/lint-erros-baseline.txt" "$TMP/lint-atual.txt" > "$TMP/lint.diff"; then
    ok "lint idêntico ao baseline ($erros erros, mesmos arquivos e regras)"
  else
    novos=$(grep -c "^+[^+]" "$TMP/lint.diff" || true)
    sumidos=$(grep -c "^-[^-]" "$TMP/lint.diff" || true)
    if [ "$novos" -gt 0 ]; then
      falha "$novos erro(s) NOVO(S) de lint:"; grep "^+[^+]" "$TMP/lint.diff" | sed 's/^+/      /'
    else
      ok "lint sem erro novo ($sumidos corrigido(s) em relação ao baseline)"
    fi
  fi
fi

# ── 3. Build ────────────────────────────────────────────────────────────────
titulo "3. Build"
if NEXT_PUBLIC_LINKEDIN_ENABLED=1 npm run build > "$TMP/build.log" 2>&1; then
  ok "build verde ($(grep -oE 'Generating static pages using [0-9]+ workers \(0/[0-9]+\)' "$TMP/build.log" | grep -oE '[0-9]+\)$' | tr -d ')' | tail -1) páginas)"
else
  falha "build quebrou"; tail -15 "$TMP/build.log"
fi

# ── 4. Servidor e rotas ─────────────────────────────────────────────────────
titulo "4. Rotas"
pkill -f "next-server" 2>/dev/null; sleep 2
(PORT=$PORTA HOSTNAME=127.0.0.1 nohup node .next/standalone/server.js > "$TMP/server.log" 2>&1 &)
sleep 9
ROTAS="/ /blog /blog/advantage-shopping-guia /servicos/meta-ads /solucoes/geracao-de-demanda
/consultoria-para-e-commerce /consultoria-ecom-shift /ofatorm /depoimentos /ecomshift
/tiktok-shop /aplicacao /link-bio /obrigado /politica-de-privacidade /mapa-do-site
/playbook-social-commerce"
for r in $ROTAS; do
  c=$(curl -s -o /dev/null -w '%{http_code}' "$BASE$r")
  [ "$c" = "200" ] && ok "$r" || falha "$r respondeu $c"
done

# ── 5. Playbook: fontes, estados e estilo, desktop e celular ────────────────
titulo "5. Playbook intacto"
cd "$TMP"
[ -d node_modules/playwright-core ] || npm install playwright-core --silent > /dev/null 2>&1
cp "$DOCS/playbook-fingerprint.mjs" "$DOCS/medicao-fingerprint.mjs" .
if [ "$MODO" = "baseline" ]; then
  node playbook-fingerprint.mjs antes "$BASE" > "$TMP/pb.log" 2>&1 && cp playbook-antes.json "$DOCS/" && ok "baseline do playbook gravado" || { falha "captura do playbook falhou"; tail -5 "$TMP/pb.log"; }
else
  if node playbook-fingerprint.mjs depois "$BASE" > "$TMP/pb.log" 2>&1; then
    cp playbook-depois.json "$DOCS/"
    if diff -u "$DOCS/playbook-antes.json" "$DOCS/playbook-depois.json" | grep -vE '^[+-]\s*"(capturadoEm|tag)"' | grep -qE '^[+-][^+-]'; then
      falha "playbook mudou:"; diff -u "$DOCS/playbook-antes.json" "$DOCS/playbook-depois.json" | grep -E '^[+-][^+-]' | grep -vE '"(capturadoEm|tag)"' | head -20
    else ok "playbook idêntico em desktop e celular"; fi
  else falha "captura do playbook falhou"; tail -5 "$TMP/pb.log"; fi
fi

# ── 6. Mensuração: eventos e payloads dos 4 formulários ─────────────────────
titulo "6. Mensuração"
if [ "$MODO" = "baseline" ]; then
  node medicao-fingerprint.mjs antes "$BASE" > "$TMP/med.log" 2>&1 && cp medicao-antes.json "$DOCS/" && ok "baseline de medição gravado" || { falha "captura de medição falhou"; tail -5 "$TMP/med.log"; }
else
  if node medicao-fingerprint.mjs depois "$BASE" > "$TMP/med.log" 2>&1; then
    cp medicao-depois.json "$DOCS/"
    if diff -u "$DOCS/medicao-antes.json" "$DOCS/medicao-depois.json" | grep -vE '^[+-]\s*"(capturadoEm|tag)"' | grep -qE '^[+-][^+-]'; then
      falha "eventos ou payloads mudaram:"; diff -u "$DOCS/medicao-antes.json" "$DOCS/medicao-depois.json" | grep -E '^[+-][^+-]' | grep -vE '"(capturadoEm|tag)"' | head -25
    else ok "eventos e payloads idênticos nos 4 formulários"; fi
  else falha "captura de medição falhou"; tail -5 "$TMP/med.log"; fi
fi

pkill -f "next-server" 2>/dev/null
printf "\n%s\n" "────────────────────────────────"
if [ "$falhas" -eq 0 ]; then echo "TUDO OK"; else echo "$falhas FALHA(S)"; fi
exit "$falhas"
