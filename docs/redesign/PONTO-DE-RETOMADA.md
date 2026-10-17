# Ponto de retomada — redesign da Ciclo

Para quem continuar este trabalho, inclusive eu mesmo em outra sessão.
Atualizado em 17/10/2026.

---

## Onde estamos

**Concluído:** auditoria, baseline, ferramental de verificação, o grupo 1 —
base visual com escopo, cabeçalho, rodapé e home — e o grupo 2, as 19 páginas
de serviço e as 4 de solução.
**Próximo:** grupo 3, o blog.

O pacote `ciclo-layouts-para-claude.zip` chegou e é a referência autorizada.
Os cinco documentos dele foram lidos na ordem pedida: `LEIA-PRIMEIRO.md`,
`docs/GUIA-PARA-CLAUDE.md`, `docs/SISTEMA-VISUAL.md`, `docs/LAYOUTS-E-CAMPOS.md`
e `docs/INTEGRACOES-E-PENDENCIAS.md`.

| Item | Valor |
|---|---|
| Branch de trabalho | `claude/redesign-ciclo-2026-HVyvT` |
| Base | produção `claude/elegant-darwin-HVyvT` no commit `7ae962b` |
| Commit da auditoria | `e608981` |
| Grupo 1, entrega | `9fd52eb` |
| Grupo 1, correção do player | `2007992` |
| Grupo 2, serviços e soluções | `05a241d` |
| Build, typecheck, rotas | Verdes. 884 páginas, 17 rotas em 200 |
| Lint | 8 erros preexistentes, registrados como teto |

---

## Auditorias independentes

Conferências feitas fora desta sessão, em navegador real. Valem mais que as
capturas locais, porque aqui a rede externa é cortada.

| Data | Commit | O que foi conferido |
|---|---|---|
| 17/10 | `9fd52eb` | Home no Preview: 20 logos e 4 miniaturas carregaram; menu móvel abre e fecha ao navegar; sem estouro horizontal em 390 px; formulário centralizado e bandeira BR carregada; frase editorial em Playfair Display itálico. Achado: aviso do Pixel por domínio de Preview. |
| 17/10 | `2007992` | Player dos depoimentos no Preview: o vídeo da Mamô tocou no modal real do YouTube, o Escape fechou e devolveu o foco ao cartão, sem sair da URL. |
| 17/10 | — | Painel da Vercel lido sem alterar nada. Ver a seção do painel. |

---

## Limitações conhecidas da validação

O que **não** dá para provar daqui, registrado para não virar falsa segurança:

| Limitação | Detalhe |
|---|---|
| Meta Pixel no domínio de Preview | O console do Preview mostra aviso do Pixel sobre restrição de tráfego no domínio `*.vercel.app`. É comportamento esperado de domínio não verificado no Business Manager, e o Preview não tem domínio customizado. A validação ponta a ponta de `Lead` (Pixel + CAPI) só fecha em produção. **Não mexer em pixel, permissões de domínio nem domínio para contornar.** |
| CRM, CAPI e telemetria no Preview | O escopo Preview só tem as duas variáveis do YouTube. Sem credencial, Pipedrive, Supabase e CAPI não respondem — o que protege contra lead de teste, mas também impede validar esses caminhos fora de produção. **Não copiar credencial de produção para o Preview.** Detalhe na seção do painel. |
| Saída de rede da sessão | Esta sessão não alcança `*.vercel.app`, `img.youtube.com` nem o CDN de bandeiras do campo de telefone. As miniaturas do YouTube e a bandeira BR não renderizam nas capturas locais; foram conferidas no Preview real por auditoria independente. |
| Node diferente do da Vercel | Local 22.22, Vercel 24.x. Build verde local não substitui o check do deployment do mesmo commit. |

---

## Configuração externa verificada em 17/10/2026

Levantado só com os acessos já disponíveis. Nenhum valor de segredo foi lido,
nenhuma configuração foi alterada.

### Repositório e branch de produção

| Item | Valor |
|---|---|
| Remoto | `github.com/FlavioBeraldo/ciclo`, público |
| Branch padrão do repositório | `claude/elegant-darwin-HVyvT` |
| Branch de produção na Vercel | a mesma, confirmada pelos deployments |

**A branch do redesign gera somente Preview.** Isso foi confirmado por
evidência, não pelo nome: os três pushes de `claude/redesign-ciclo-2026-HVyvT`
geraram deployments com `environment: "Preview"`, enquanto o merge em
`claude/elegant-darwin-HVyvT` gerou `environment: "Production"`.

| Commit | Ambiente | Estado |
|---|---|---|
| `7fcf734` (redesign) | Preview | success |
| `53dc116` (redesign) | Preview | success |
| `e608981` (redesign) | Preview | success |
| `7ae962b` (produção) | Production | success |

### Projeto Vercel

| Item | Valor |
|---|---|
| Projeto | `ciclo-dl2o`, escopo `flavioberaldos-projects` |
| Ligação | Deployments disparados por push no repositório acima |
| Framework | `nextjs`, declarado em `vercel.json` |
| Build | `npm run build`, que roda fetch-youtube, next build e postbuild |
| Install | `npm install` |
| Saída | `.next`, com `output: 'standalone'` no next.config |
| Diretório raiz | Raiz do repositório |
| Runtime | Node >= 20 por `engines`; rotas de API em `runtime = 'nodejs'` |
| Cron | 1 job: `/api/cron/site-digest` às `0 12 * * *` |
| Redirects | 153 regras em `next.config.ts` |
| GitHub Actions | Nenhum workflow no repositório |
| Checks no commit | Um contexto `Vercel` e o check `Vercel Preview Comments` |

### Variáveis de ambiente necessárias, só os nomes

`ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `CRON_SECRET`, `GA4_API_SECRET`,
`GA4_LEAD_QUALIFY_STAGES`, `GA4_MEASUREMENT_ID`, `INTERNAL_EMAIL_DOMAINS`,
`LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_REDIRECT_URI`,
`META_CAPI_TOKEN`, `META_PIXEL_ID`, `META_TEST_EVENT_CODE`,
`NEXT_PUBLIC_LINKEDIN_ENABLED`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`,
`PIPEDRIVE_API_TOKEN`, `PIPEDRIVE_PIPELINE_NAME`, `PIPEDRIVE_STAGE_ID`,
`PIPEDRIVE_STAGE_NAME`, `PIPEDRIVE_WEBHOOK_SECRET`, `RECAPTCHA_SECRET_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`, `YOUTUBE_API_KEY`,
`YOUTUBE_CHANNEL_HANDLE`.

O único arquivo de ambiente versionado é `.env.example`. Nenhum valor foi lido
nem será copiado para commit ou relatório.

### Referência de retorno, sem executar rollback

| Item | Valor |
|---|---|
| Deployment de produção atual | id `6665805577` |
| Commit | `7ae962bad1758ef0c77e775af6a683e7e5a0e280` |
| URL do deployment | `ciclo-dl2o-93six9eyy-flavioberaldos-projects.vercel.app` |
| Data | 25/09/2026, estado success |

### Painel da Vercel, conferido por auditoria independente em 17/10/2026

O painel não é acessível desta sessão. O que segue foi lido por outra pessoa,
sem alterar nenhuma configuração, e confirma por leitura direta o que antes
era só dedução a partir dos rótulos de ambiente dos deployments.

| Item | Valor conferido no painel |
|---|---|
| Git | conectado a `FlavioBeraldo/ciclo` |
| Production | rastreia `claude/elegant-darwin-HVyvT` e tem `cicloecommerce.com.br` |
| Preview | rastreia as demais branches, **sem domínio customizado** |
| Diretório raiz | vazio, isto é, a raiz do repositório |
| Node | 24.x |
| Framework exibido | "Other", mas os *Production Overrides* usam Next.js, `npm run build`, `.next`, `npm install` e `npm run dev` — coerente com o `vercel.json` |

Isso fecha a dúvida de origem: a branch do redesign publica em Preview porque
a Production rastreia outra branch, não por acaso.

#### Variáveis por ambiente — a parte que muda o teste

No escopo Preview existem **apenas** `YOUTUBE_API_KEY` e
`YOUTUBE_CHANNEL_HANDLE` (presentes em Production e Preview). `META_CAPI_*`,
Supabase, Pipedrive, GA4, reCAPTCHA e LinkedIn são **exclusivas de
Production**. Nenhum valor foi revelado.

Consequências práticas, a tratar como projeto e não como defeito:

- No Preview, `/api/pipedrive`, `/api/track` e a CAPI **não têm credencial** e
  por isso não criam lead, não gravam telemetria e não enviam conversão. É a
  proteção que queremos: um envio de teste no Preview não alcança sistema real.
- Em compensação, **CRM, CAPI e telemetria não são validáveis ponta a ponta no
  Preview.** Some-se a isso o aviso do Pixel por domínio, e a conclusão é que
  essa validação só fecha em produção, depois do merge.
- `/api/youtube/latest` funciona no Preview, então O Fator M mostra os
  episódios reais lá — ao contrário das capturas locais, onde a sessão não
  alcança a API.
- **Não copiar credencial de produção para o Preview** e **não usar env real
  nos testes.** Os testes continuam com rede externa cortada e `/api/*` em
  mock.

#### Diferença de runtime a ter em mente

A Vercel compila em Node 24.x; esta sessão compila em Node 22.22. Os dois
builds passam, mas um verde local não substitui o check do deployment do mesmo
commit.

---

## Regras de operação desta etapa

- Implementação por grupos na branch isolada, sem pedir aprovação a cada edição
  reversível.
- Não recriar projeto ou repositório. Não alterar domínio, DNS, variáveis,
  integrações, banco ou CMS.
- Sem force-push, sem reset destrutivo, sem apagar branch, sem reescrever
  histórico.
- Preservar workflows, lockfile e dependências, salvo necessidade concreta do
  front-end, explicada no commit.
- Nunca copiar `.env` ou credenciais para commit ou relatório.
- Testes de formulário e medição sempre com rede externa bloqueada e APIs
  simuladas.
- Por grupo, entregar: commit, arquivos alterados, verificações e URL de Preview.
- Conferir os checks do GitHub e o deployment **do mesmo commit**, não um build
  local anterior.
- Lint comparado por arquivo e regra, não por contagem.
- Playbook integralmente congelado.
- Nenhum merge ou publicação antes da revisão final do Flávio.

---

## Decisões já tomadas

1. **Escopo.** Todas as páginas entram, menos `/playbook-social-commerce`, que
   é **referência congelada de regressão**: nada nela é refeito, nem layout,
   nem formulário, nem lint, nem markup, nem fluxo. Serve só para comparar.
2. **`/link-bio` permanece.** O kit não ter um exemplo equivalente não autoriza
   remover a página. O contrato dela está na seção 2.4 da auditoria.
3. **Isolamento por escopo, não por `:root`.** Os tokens do design novo entram
   sob uma classe na raiz de cada página redesenhada. O playbook, sem a classe,
   não é alcançado. `body`, `:root`, `:focus-visible`, a barra de rolagem e a
   base de `.ciclo-phone-input` não são redefinidos globalmente.
4. **`PhoneField` ganha variante**, nunca alteração na base. A variante
   `lp-phone-light` do playbook fica intocada.
5. **Só a camada de apresentação muda.** Os handlers reais são reutilizados; os
   formulários demonstrativos do kit são descartados.
6. **Nenhum lead de teste** vai para sistemas reais. Toda verificação roda com
   a rede externa cortada e as rotas `/api/*` em mock.
7. **Sem merge nem deploy** antes da revisão final do Flávio.

---

## Regras visuais acordadas, a aplicar quando o pacote chegar

- A home aprovada é a base de todo o site.
- Tipografia: Inter. Playfair Display Italic 400 só em frases editoriais curtas.
- Cores: preto `#1d1d1b`, branco, off-white `#efeeed`, roxo `#933dc9` discreto.
  Sem verde e sem Space Grotesk.
- A sequência clara → fade → explicações escuras com SVG → fade → processo e
  provas claros vale **só** para as páginas individuais `/servicos/*`. Não é o
  conceito do site inteiro.
- Manter na home: clientes, mídia e parceiros; soluções com ícones; cases
  agrupados; vídeos em 16:9; formulário centralizado.
- Não reintroduzir a galeria nem os dois botões centrais removidos do hero.
- Não importar do kit: `noindex`, robots bloqueador ou redirect demonstrativo.
- O kit traz layouts, não conteúdo. Os textos e os seis artigos de demonstração
  não substituem o CMS. O conteúdo real entra nos layouts novos, com as URLs
  preservadas.

---

## Ordem de implementação proposta

Um grupo por vez, com build válido, preview revisável e
`verificar.sh comparar` limpo antes de seguir.

| # | Grupo | Páginas | Cuidado principal | Situação |
|---|---|---|---|---|
| 1 | Base visual e home | tokens, tipografia, Header, Footer, `/` | Escopo que não alcance o playbook; manter clientes, mídia, parceiros, cases, vídeos e formulário | **Feito** (`9fd52eb`, `2007992`) |
| 2 | Serviços e soluções | `/servicos/*`, `/solucoes/*` | A sequência própria dos serviços; JSON-LD | **Feito** (`05a241d`) |
| 3 | Blog | `/blog`, `/blog/[slug]` | Template de artigo; 884 páginas; Article e FAQPage | Próximo |
| 4 | Institucionais | `/ofatorm`, `/depoimentos`, `/ecomshift`, `/tiktok-shop`, `/mapa-do-site`, `/politica-de-privacidade` | Opt-out da privacidade | |
| 5 | Consultorias | `/consultoria-para-e-commerce`, `/consultoria-ecom-shift` | A identidade `shift` será substituída | |
| 6 | Formulários | `/aplicacao`, `/link-bio`, `/obrigado`, LeadForm | O mais sensível. Handlers reais, payload idêntico | |

A base visual e a home saíram no mesmo grupo porque o kit entrega a home como
a página que define os tokens: separar as duas só geraria um commit que não dá
para olhar. O grupo dos formulários fica por último de propósito: é onde um
descuido quebra a medição sem aparecer na tela.

### Lições do grupo 1, para não repetir

- **O kit é layout, não conteúdo nem comportamento.** Ele usa links externos
  para o YouTube "para demonstração" e o próprio
  `docs/INTEGRACOES-E-PENDENCIAS.md` pede para integrar o player existente. Eu
  segui o markup ao pé da letra e quebrei o player interno dos depoimentos.
  Antes de copiar um `<a>`, conferir o que a página fazia antes.
- **Métrica vem de `@/lib/*`, nunca do kit.** O kit escreve a terceira métrica
  da Gringa diferente de `cases.ts`; vale o dado do projeto.
- **Processo velho na porta 3100.** O `next-server` não casa com
  `pkill -f "standalone/server.js"`, e `pkill -f next-server` mata o próprio
  shell. Matar por PID (`ps -eo pid,args | grep "[n]ext-server"`) e reiniciar
  sempre depois de um build, senão o teste roda contra o bundle anterior.
- **`deployments?sha=` exige SHA completo.** Com o abreviado a resposta vem
  vazia e parece que o deploy falhou.

### Lições do grupo 2

- **`.inner` não pode dividir o nó com `.ciclo2026`.** As regras do kit são
  `.inner h1`; com o escopo viram `.ciclo2026 .inner h1`, que exige um
  descendente de verdade. Com as duas classes no mesmo elemento o `h1` sai do
  tamanho do corpo do texto e o erro passa despercebido.
- **Conferir quais folhas a página do kit carrega.** A home carrega
  `base.css` e `interiors.css`; as internas carregam as duas mais
  `service-explanations.css`. Faltou a segunda na home do grupo 1 e o
  `--accent` ficou `#b400ff` em vez de `#933dc9`.
- **`git checkout <arquivo>` apaga trabalho não commitado.** Perdi a página de
  serviço inteira assim. Em arquivo novo ainda não commitado, não existe
  versão para voltar.
- **Dá para ler os dados de `src/lib/*.ts` num script de verificação** com
  `node --experimental-strip-types`. Evita manter uma segunda cópia da
  verdade dentro do teste.

---

## Como retomar, na prática

```bash
cd /home/user/ciclo
git fetch origin && git checkout claude/redesign-ciclo-2026-HVyvT
npm ci                                    # o container recicla e perde node_modules
bash docs/redesign/verificar.sh comparar  # confirma que a base segue íntegra
```

Se o container tiver sido reciclado, `node_modules` e o `playwright-core` do
diretório temporário somem. O `npm ci` resolve o primeiro; o script de
verificação reinstala o segundo sozinho.

O `verificar.sh comparar` tem sete etapas: hashes da camada protegida,
typecheck e lint por arquivo e regra, build, rotas, impressão digital do
playbook, eventos e payloads dos quatro formulários e, por último,
`internas-seo.mjs`, que confere conteúdo, URLs e SEO das 23 páginas internas.
Há ainda um teste à parte para o player dos depoimentos:

```bash
node docs/redesign/depoimentos-player.mjs http://127.0.0.1:3100
```

Para mexer no servidor local, matar por PID — `pkill -f next-server` mata o
próprio shell:

```bash
PID=$(ps -eo pid,args | grep "[n]ext-server" | awk '{print $1}'); [ -n "$PID" ] && kill $PID
(PORT=3100 HOSTNAME=127.0.0.1 nohup node .next/standalone/server.js >/tmp/srv.log 2>&1 &)
```

---

## Pendências reais

| Pendência | Situação |
|---|---|
| Validação do Pixel no Preview | Bloqueada por domínio. Só fecha em produção. Ver "Limitações conhecidas da validação" |
| 8 componentes órfãos da home antiga | `Hero`, `BrandsStrip`, `CommonErrorSection`, `ThesisSection`, `ServicesSection`, `TestimonialsSection`, `PodcastSection`, `RecentBlogSection`. Mantidos de propósito até os grupos seguintes; `LeadForm` e `CasesSection` seguem em uso |
| 8 erros de lint preexistentes | Registrados. Não são do redesign e não serão corrigidos de carona. Os 2 do PlaybookForm ficam por definição, já que o arquivo é congelado |
| Meta aguardando aceite dos termos | Herdada, fora deste escopo |
| Episódio do Fator M no artigo do Creator Hub | Herdada, fora deste escopo |
