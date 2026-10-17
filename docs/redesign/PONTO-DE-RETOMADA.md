# Ponto de retomada — redesign da Ciclo

Para quem continuar este trabalho, inclusive eu mesmo em outra sessão.
Atualizado em 17/10/2026.

---

## Onde estamos

**Etapa concluída:** auditoria, baseline e ferramental de verificação.
**Etapa seguinte, bloqueada:** a implementação visual, à espera do pacote.

Nenhuma linha de interface foi alterada. O que existe na branch é documentação
e os scripts que vão provar, depois, que nada quebrou.

| Item | Valor |
|---|---|
| Branch de trabalho | `claude/redesign-ciclo-2026-HVyvT` |
| Base | produção `claude/elegant-darwin-HVyvT` no commit `7ae962b` |
| Commit da auditoria | `e608981` |
| Build, typecheck, rotas | Verdes. 884 páginas, 17 rotas em 200 |
| Lint | 8 erros preexistentes, registrados como teto |

---

## O bloqueio

O pacote `ciclo-layouts-para-claude.zip` **não chegou**. Não está no
repositório e não foi anexado à conversa. Sem ele não começo interface, porque
deduzir o design a partir do resumo em texto seria inventar.

A prévia em `ciclo-direcao-visual-1610...chatgpt.site` pode exigir acesso do
proprietário, e não vou tentar contornar.

Quando o arquivo chegar, a primeira ação é ler, nesta ordem: `LEIA-PRIMEIRO.md`,
`docs/GUIA-PARA-CLAUDE.md`, `docs/SISTEMA-VISUAL.md`, `docs/LAYOUTS-E-CAMPOS.md`
e `docs/INTEGRACOES-E-PENDENCIAS.md`. Só depois disso, o plano por grupo.

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

| # | Grupo | Páginas | Cuidado principal |
|---|---|---|---|
| 1 | Base visual | tokens, tipografia, Header, Footer | Escopo que não alcance o playbook |
| 2 | Home | `/` | Manter clientes, mídia, parceiros, cases, vídeos e formulário |
| 3 | Serviços e soluções | `/servicos/*`, `/solucoes/*` | A sequência própria dos serviços; JSON-LD |
| 4 | Blog | `/blog`, `/blog/[slug]` | Template de artigo; 884 páginas; Article e FAQPage |
| 5 | Institucionais | `/ofatorm`, `/depoimentos`, `/ecomshift`, `/tiktok-shop`, `/mapa-do-site`, `/politica-de-privacidade` | Opt-out da privacidade |
| 6 | Consultorias | `/consultoria-para-e-commerce`, `/consultoria-ecom-shift` | A identidade `shift` será substituída |
| 7 | Formulários | `/aplicacao`, `/link-bio`, `/obrigado`, LeadForm | O mais sensível. Handlers reais, payload idêntico |

O grupo 7 fica por último de propósito: é onde um descuido quebra a medição sem
aparecer na tela.

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

---

## Pendências reais

| Pendência | Situação |
|---|---|
| Pacote do design | **Bloqueia a implementação.** Não recebido |
| Acesso à prévia | Pode exigir permissão do proprietário. Não vou contornar |
| 8 erros de lint preexistentes | Registrados. Não são do redesign e não serão corrigidos de carona. Os 2 do PlaybookForm ficam por definição, já que o arquivo é congelado |
| Meta aguardando aceite dos termos | Herdada, fora deste escopo |
| Episódio do Fator M no artigo do Creator Hub | Herdada, fora deste escopo |
