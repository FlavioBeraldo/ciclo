# Auditoria para o redesign — estado antes de qualquer mudança visual

Levantado em 16/10/2026, com a produção em `7ae962b`.
Branch do trabalho: `claude/redesign-ciclo-2026-HVyvT`, criada a partir da produção.

Este documento é o contrato do que precisa continuar igual. Depois do redesign,
cada item aqui deve ser verificável de novo.

---

## 1. Estado do repositório

| Item | Situação |
|---|---|
| Branch de produção | `claude/elegant-darwin-HVyvT`, topo `7ae962b` |
| Diretório de trabalho | Limpo, sem pendências |
| Trabalho em voo não mergeado | Nenhum |

Existem quatro branches remotas "à frente" em contagem de commits, mas todas
estão 84 commits **atrás** da produção e datam de maio a setembro. O conteúdo
delas já chegou à produção por outro caminho de histórico: o agendamento de
artigos, por exemplo, está publicado. São branches abandonadas, não trabalho
pendente. `feat/ga4-lead-events` está integralmente mergeada.

As branches recentes deste fluxo (`ecom-shift`, `shift-copy-ux`,
`depoimentos-sem-cargo`, `artigo-creator-marketing-hub`) também já foram
mergeadas. Nada foi sobrescrito.

---

## 2. Camada protegida: o que não pode mudar

O baseline de hash está em `hashes-protegidos.txt`: **39 arquivos** entre
`src/lib` e `src/app/api`. Qualquer alteração aparece no diff de hash, gerado
pelo comando de verificação da seção 7.

### 2.1 Eventos do dataLayer

Onze nomes, exatos:

```
generate_lead                 playbook_form_submit        begin_checkout
consultoria_ecom_shift_lead   playbook_popup_view         link_bio_step_view
aplicacao_step_view           playbook_popup_click        link_bio_step_complete
aplicacao_step_complete       playbook_popup_dismiss
```

### 2.2 Telemetria interna (`track()`)

`page_view`, `form_submit`, `material_download`, `popup_view`, `popup_click`,
`video_play`, `whatsapp_click`, `cta_click`, `scroll_75`.

### 2.3 Meta CAPI

Evento único `Lead`, enviado do servidor com o mesmo `event_id` do navegador.
Variáveis de ambiente: `META_CAPI_TOKEN`, `META_PIXEL_ID`, `META_TEST_EVENT_CODE`.

### 2.4 Formulários e seus handlers

| Formulário | Rota | Campos do payload |
|---|---|---|
| `LeadForm` | `/api/pipedrive` | dados do form, `source: 'Site/WhatsApp'`, `attribution`, `event_id`, `page_url` |
| `PlaybookForm` | `/api/pipedrive` | `name`, `email`, `company`, `phone`, `message`, `source: 'LP Playbook Social Commerce'`, `pipeline: 'Playbook'`, `attribution`, `event_id`, `page_url` |
| `AplicacaoForm` | `/api/aplicacao` | 8 respostas, `attribution`, `event_id`, `page_url` |
| `LinkBioForm` | `/api/link-bio` | `step`, `data`, `attribution`, `complete`, `event_id`, `page_url` |

#### `/link-bio` — contrato próprio, a preservar na íntegra

A página apareceu no inventário e **permanece no site**. A ausência de um
exemplo equivalente no kit de layouts não autoriza removê-la nem simplificá-la.
O que precisa continuar funcionando exatamente como hoje:

- **Envio por etapa.** Cada uma das 5 etapas faz seu próprio POST para
  `/api/link-bio`, em fila, para a etapa 1 criar a sessão antes das seguintes
  atualizarem o mesmo negócio. A interface avança na hora, sem esperar a rede.
- **Campo `complete`.** Vai `false` nas quatro primeiras etapas e `true` na
  última. É ele que dispara a conversão Lead na Meta no servidor.
- **`event_id` único.** Gerado uma vez ao montar o formulário e repetido em
  todos os POSTs, para o Pixel e a CAPI deduplicarem.
- **`attribution`** em todos os POSTs, com a carga completa de UTM, cliques e
  cookies do GA.
- **Cookie `ciclo_lb`**, httpOnly e assinado, que carrega os ids do Pipedrive
  entre as etapas. Os ids nunca trafegam em texto claro.
- **Eventos do dataLayer:** `link_bio_step_view` e `link_bio_step_complete` em
  cada etapa, mais `generate_lead` na conclusão.
- **Lead parcial.** Quem abandona no meio já virou negócio no CRM. Esse
  comportamento é intencional e não pode ser perdido.
- A página segue `noindex, nofollow`, por ser exclusiva de redes sociais.

Medido no baseline: 5 eventos de visualização, 5 de conclusão, 1 `generate_lead`
e 5 POSTs com as chaves `step`, `data`, `complete`, `event_id`, `attribution` e
`page_url`.

O `PlaybookForm` consta nesta tabela apenas como **referência congelada de
regressão**. Ele não será refeito, não recebe ajuste de lint, de markup nem de
fluxo. Está aqui para que a comparação antes e depois prove que continuou
idêntico. Detalhe registrado pelo mesmo motivo: o LinkedIn não viaja no body,
a rota lê o cookie assinado `ciclo_li` no servidor.

Identificador fixo da consultoria: `consultoria_ecom_shift`, usado no dataLayer,
na CAPI e no `origem_formulario` do Pipedrive. Destino fixo no CRM da rota
`/api/aplicacao`: pipeline 2, stage 8.

### 2.5 Cookies

`ciclo_attr` (atribuição, 90 dias, primeiro toque), `ciclo_uid`, `ciclo_uid_init`,
`ciclo_lb`, `ciclo_apl`, `ciclo_li`, `ciclo_li_state`, `ciclo_li_done`,
`ciclo_li_traffic`, mais os de terceiros `_ga`, `_fbp`, `_fbc`.

### 2.6 UTM

Lidos em `src/lib/attribution.ts`: `utm_source`, `utm_medium`, `utm_campaign`,
`utm_term`, `utm_content`, além de `gclid`, `fbclid`, `ttclid`.

### 2.7 SEO

- 11 canonicais declarados, um por página indexável.
- 3 páginas `noindex`: `/aplicacao`, `/link-bio`, `/obrigado`. Nenhuma outra pode
  ganhar `noindex`.
- JSON-LD em 8 páginas: artigo do blog, as duas consultorias, ecomshift, ofatorm,
  playbook, serviços, soluções e tiktok-shop.
- 153 regras de redirect em `next.config.ts`, a maior parte do acervo WordPress.
- 884 páginas estáticas geradas no build.

### 2.8 Conteúdo

42 artigos em `content/blog/*.mdoc` mais o acervo WordPress em
`src/data/wp-posts.json`. O redesign muda o template de leitura, nunca o texto.

---

## 3. Isolamento do /playbook-social-commerce

A página já é razoavelmente isolada, o que ajuda.

**Arquivos próprios:** `page.tsx`, `PlaybookForm.tsx`, `StickyCta.tsx`.
Não usa `Header` nem `Footer` globais. Carrega a própria Playfair Display.
Define o próprio fundo na raiz: `.lp-playbook` com `#EDE7DB` e texto `#1A1917`.

**Compartilhado que ela consome:**

| Dependência | Risco |
|---|---|
| `src/app/globals.css` | Alto. Ver abaixo |
| `src/app/layout.tsx` | Médio. Fonte Inter, classe `grain` no body, GTM, provedores |
| `src/components/ui/PhoneField.tsx` | Médio. Componente compartilhado do telefone |
| `src/lib/attribution`, `conversions`, `track` | Nenhum. É lógica, não muda |

**O que em `globals.css` escapa para dentro dela:**

1. `:root` com `--purple: #A100FF` e os tokens de fundo escuro.
2. `body` com fundo `#050505`, texto branco e Inter.
3. `html { scroll-behavior: smooth }`.
4. `:focus-visible` com contorno roxo `#A100FF`.
5. `::-webkit-scrollbar` com barra roxa.
6. `.grain::before`, a textura aplicada no body.
7. As 6 regras `.lp-*` próprias dela e a base `.ciclo-phone-input`.

**Plano de isolamento.** O design novo não pode redefinir `:root`, `body`,
`:focus-visible`, a barra de rolagem nem a base de `.ciclo-phone-input` sem
preservar o efeito atual nessa página. Três caminhos, nesta ordem de preferência:

1. Os tokens novos entram sob uma classe de escopo na raiz de cada página
   redesenhada, não em `:root`. O playbook, que não recebe a classe, fica intacto.
2. Se algum token global for inevitável, a página ganha um bloco de restauração
   explícito, no mesmo espírito das regras `.lp-*` que já existem.
3. `PhoneField` recebe uma variante nova em vez de ter a base alterada. A
   variante `lp-phone-light` que o playbook usa continua como está.

**Prova.** O baseline visual e de estilo computado está capturado em
`playbook-antes.json`, com screenshots de desktop e celular. Inclui fundo,
cores, fontes, altura da página, lista de títulos, campos, botões, links,
imagens, meta robots, canonical e JSON-LD. A comparação depois do redesign é
item obrigatório do PR.

Medidas de referência: altura 3112px no desktop e 5147px no celular, 10 títulos,
6 campos de formulário.

---

## 4. Matriz página → componentes → lógica

| Rota | Componentes visuais | Lógica preservada |
|---|---|---|
| `/` | Hero, BrandsStrip, CommonErrorSection, ThesisSection, ServicesSection, CasesSection, TestimonialsSection, PodcastSection, RecentBlogSection, LeadForm, Header, Footer | AttributionTracker, Recaptcha, `/api/pipedrive` |
| `/blog` | Header, Footer, PlaybookPopup | `blog`, `keystatic-posts` |
| `/blog/[slug]` | Header, Footer | `blog`, `keystatic-posts`, JSON-LD Article + FAQPage |
| `/servicos/[slug]` | Header, Footer, Button | `servicos`, JSON-LD |
| `/solucoes/[slug]` | Header, Footer, Button | `solucoes`, JSON-LD |
| `/consultoria-para-e-commerce` | Header, Footer, LeadForm | `/api/pipedrive` |
| `/consultoria-ecom-shift` | 6 componentes `shift/*` | `cases`, JSON-LD, CTAs para `/aplicacao` |
| `/aplicacao` | PhoneField, fonts | `attribution`, `conversions`, `track`, `/api/aplicacao` |
| `/link-bio` | PhoneField | `attribution`, `conversions`, `track`, `/api/link-bio` |
| `/ofatorm` | Header, Footer, Button | `youtube`, JSON-LD |
| `/ecomshift` | Header, Footer, YouTubeFacade | `attribution`, `conversions`, JSON-LD |
| `/tiktok-shop` | Header, Footer, LeadForm | `/api/pipedrive`, JSON-LD |
| `/depoimentos` | Header, Footer | — |
| `/obrigado` | CasesSection | `noindex` |
| `/politica-de-privacidade` | OptOutNotice | opt-out de telemetria |
| `/mapa-do-site` | — | — |
| `/playbook-social-commerce` | **Fora do redesign: referência congelada** | PlaybookForm, StickyCta, intocados |

---

## 5. Verificações executadas e problemas prévios

| Verificação | Resultado |
|---|---|
| `tsc --noEmit` | Limpo |
| `next build` | Verde, 884 páginas estáticas |
| Todas as 16 rotas servidas localmente | 200 |
| `eslint src` | **8 erros e 4 avisos, todos preexistentes** |

Os problemas do lint existem hoje, antes de qualquer mudança minha, e ficam
registrados para não serem atribuídos ao redesign:

- `api/youtube/latest/route.ts`: uso de `any`.
- `consultoria-para-e-commerce/interactive.tsx`: aspas não escapadas e import
  não usado.
- `playbook-social-commerce/PlaybookForm.tsx`: dois casos de `setState` dentro
  de efeito. **Permanecem como estão**: o arquivo é referência congelada e não
  recebe correção de carona.
- `politica-de-privacidade/OptOutNotice.tsx`: mesmo caso.
- `link-bio/page.tsx` e `components/Header.tsx`: `<a>` em vez de `<Link>`.
- `servicos/[slug]/page.tsx`: import não usado.
- `aplicacao/AplicacaoForm.tsx` e `link-bio/LinkBioForm.tsx`: aviso do React
  Compiler sobre o `watch()` do react-hook-form.

O lint não faz parte do script de build, por isso o build passa mesmo assim.

---

## 6. Bloqueios

1. **O pacote do design não chegou.** `ciclo-layouts-para-claude.zip` não está no
   repositório nem foi anexado. Sem ele não começo a interface.
2. **A prévia pode exigir acesso do proprietário.** Não vou tentar contornar.
3. Pendência herdada, fora deste escopo: a Meta ainda aguarda o aceite dos termos
   para a conversão da consultoria.

---

## 7. Comando de verificação repetível

Tudo acima é verificável com um comando só, versionado na branch:

```bash
bash docs/redesign/verificar.sh baseline   # grava a referência (já feito)
bash docs/redesign/verificar.sh comparar   # compara o estado atual com ela
```

Ele executa, em ordem: diff de hash dos 39 arquivos protegidos; typecheck;
lint contra o número de erros preexistentes; build; as 17 rotas servidas;
a impressão digital do playbook em desktop e celular; e os eventos e payloads
dos quatro formulários. Sai com código diferente de zero se qualquer item
falhar, e imprime o diff do que mudou.

**Nenhuma chamada real sai durante os testes.** Os dois scripts de captura
cortam tudo que não é o host local e respondem as rotas `/api/*` por mock.
Confirmado na execução: `googletagmanager.com` e o CDN de bandeiras foram
bloqueados. Pipedrive, Meta CAPI, GA4, GTM e a telemetria interna não recebem
nada, e nenhum lead de teste é criado.

### Arquivos de referência versionados

| Arquivo | Conteúdo |
|---|---|
| `hashes-protegidos.txt` | SHA-256 dos 39 arquivos de lógica |
| `lint-erros-baseline.txt` | 8, o número de erros de lint que já existiam |
| `playbook-antes.json` | Fontes carregadas, estilo computado e estados do playbook |
| `medicao-antes.json` | Eventos e payloads dos quatro formulários |
| `playbook-fingerprint.mjs` | Script que captura o playbook |
| `medicao-fingerprint.mjs` | Script que captura a medição |
| `verificar.sh` | O comando acima |

### Resultado da execução de referência

Commit base: **`e608981`**, na branch `claude/redesign-ciclo-2026-HVyvT`,
criada a partir da produção `7ae962b`.

| Verificação | Resultado |
|---|---|
| Arquivos protegidos | 39 registrados |
| Typecheck | Limpo |
| Lint | 8 erros, todos preexistentes, registrados como teto |
| Build | Verde, 884 páginas estáticas |
| 17 rotas | Todas 200 |
| Playbook | Capturado em desktop e celular |
| Medição | Capturada nos quatro formulários |

O modo `comparar` foi executado em seguida contra esse mesmo estado e passou em
todos os itens, o que prova que a comparação funciona e não dá falso positivo.

### Baseline do playbook, em detalhe

Capturado com as mesmas fontes carregadas, os mesmos estados e os mesmos
viewports que serão usados depois. Hash de arquivo não cobre efeito de CSS
global; por isso a comparação é feita sobre o que o navegador computa.

| Dimensão | Desktop 1440 | Celular 390 |
|---|---|---|
| Altura do documento | 3112px | 5147px |
| Overflow horizontal | Não | Não |
| Títulos | 10 | 10 |
| Campos de formulário | 6 | 6 |
| Fontes carregadas | Inter e Playfair Display | Inter e Playfair Display |
| Mensagens de validação | 2 | 2 |

Fundo herdado do `body`: `rgb(5,5,5)`. Fundo da raiz da própria página:
`rgb(237,231,219)`. Essa diferença é exatamente o ponto de vazamento a vigiar.

Estados capturados em cada viewport: inicial no topo, rolado com o CTA fixo, e
erro de validação disparado sem rede. Três screenshots por viewport, seis no
total, com os mesmos nomes de arquivo no `depois`.

### O que o PR precisará apresentar

- Saída completa de `verificar.sh comparar`, sem falhas.
- Diff de `playbook-antes.json` contra `playbook-depois.json`: vazio.
- Diff de `medicao-antes.json` contra `medicao-depois.json`: vazio.
- Screenshots lado a lado do playbook, desktop e celular, nos três estados.
- Screenshots de cada grupo de páginas redesenhadas, desktop e celular.
