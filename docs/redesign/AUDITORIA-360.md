# Auditoria 360 do redesign

> **Atualizado.** A versão original auditou o `dc62559`. Os achados objetivos
> foram corrigidos e estão marcados abaixo; o que depende de decisão ou de
> arquivo novo segue pendente.

**HEAD auditado:** `dc62559` · **Base de produção:** `7ae962b`
**Data:** 17/10/2026 · **Branch:** `claude/redesign-ciclo-2026-HVyvT`

Nenhum merge, nenhuma promoção de deployment, nenhuma alteração de domínio,
branch de produção, variável, token ou integração real foi feita para esta
auditoria. Nenhum lead foi enviado. Nenhuma credencial foi copiada para o
Preview.

**Como ler os status.** *Aprovado* é o que foi medido e passou. *Pendente* é
o que falta fazer ou corrigir. *Não verificável aqui* é o que depende de
produção, de credencial ou de acesso que esta sessão não tem — e aí o
relatório diz o que seria preciso para fechar.

**Uma distinção que vale para o documento inteiro:** tudo abaixo é evidência
de **código e teste local**, contra o build do `dc62559` servido em
`127.0.0.1:3100`. Não é evidência de comportamento em produção. Onde os dois
podem divergir, está dito.

---

## 1. Inventário de rotas

### 1.1 Templates públicos

| Rota | Template | Páginas geradas | Redesign |
|---|---|---|---|
| `/` | `app/page.tsx` | 1 | **Feito** |
| `/servicos/[slug]` | `app/servicos/[slug]/page.tsx` | 18 | **Feito** |
| `/solucoes/[slug]` | `app/solucoes/[slug]/page.tsx` | 4 | **Feito** |
| `/blog` | `app/blog/page.tsx` | 1 + paginação | **Feito** |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | 825 | **Feito** |
| `/tiktok-shop` | `app/tiktok-shop/page.tsx` | 1 | **Feito** |
| `/depoimentos` | `app/depoimentos/page.tsx` | 1 | **Feito** |
| `/mapa-do-site` | `app/mapa-do-site/page.tsx` | 1 | **Feito** |
| `/politica-de-privacidade` | `app/politica-de-privacidade/page.tsx` | 1 | **Feito** |
| `/ofatorm` | `app/ofatorm/page.tsx` | 1 | **Pendente** |
| `/ecomshift` | `app/ecomshift/page.tsx` | 1 | **Pendente** |
| `/consultoria-para-e-commerce` | `app/consultoria-para-e-commerce/page.tsx` | 1 | **Pendente** |
| `/consultoria-ecom-shift` | `app/consultoria-ecom-shift/page.tsx` | 1 | **Pendente** |
| `/aplicacao` | `app/aplicacao/page.tsx` | 1 | **Pendente** |
| `/link-bio` | `app/link-bio/page.tsx` | 1 | **Pendente** |
| `/obrigado` | `app/obrigado/page.tsx` | 1 | **Pendente** |
| `/playbook-social-commerce` | `app/playbook-social-commerce/page.tsx` | 1 | **Congelado, fora do escopo** |
| `/keystatic/[[...params]]` | painel do CMS | — | Não é página pública |

**9 de 17 rotas públicas refeitas.** Em páginas geradas, 853 de 858 — o blog
responde pelo volume.

### 1.2 Rotas novas e retiradas

| Mudança | Rota | Origem |
|---|---|---|
| **Nova** | `/servicos/agencia-ugc` | Pedido do Flávio |
| **Retirada** | `/servicos/processos-playbooks` | Ordem do Flávio, 17/10 |
| **Retirada** | `/servicos/growth-continuo` | Ordem do Flávio, 17/10 |

Serviços: 19 na base → 18 no HEAD. Nenhuma outra rota entrou ou saiu.

### 1.3 Redirects

153 regras na base → 155 no HEAD. As duas novas apontam as rotas encerradas
para `/solucoes/inteligencia-e-operacao`, com `permanent: true`.

Medido: as duas respondem **308**, o destino responde **200 na primeira
tentativa**, sem laço e sem cadeia. A forma com barra no fim termina no mesmo
lugar — o Next normaliza `/rota/` antes de olhar as regras, em todo o site,
comportamento que já existia nas 153 regras anteriores.

**Status: aprovado.**

---

## 2. Links, âncoras e navegação

Crawl local de **859 rotas** a partir do sitemap, seguindo só links internos,
com 158 destinos distintos conferidos. Script: `docs/redesign/crawl.mjs`.

| Achado | Quantidade | Status |
|---|---|---|
| Destinos quebrados | **0** | Aprovado |
| Âncoras sem alvo | 3 reais | 1 corrigida, 2 pendentes |
| Páginas órfãs | 0 reais | Aprovado, ver ressalva |
| Hierarquia de títulos | 340 | Pré-existente, ver 3.2 |

### 2.1 Âncoras sem alvo

| Âncora | Onde | Causa | Status |
|---|---|---|---|
| `#resultados` | `/servicos/agencia-ugc` | O índice da página listava uma seção que não é renderizada quando o serviço não tem números publicados | **Corrigido neste commit** |
| `#depoimentos` | `/obrigado` | O rodapé antigo aponta para uma âncora que só existe na home | Pendente — sai quando `/obrigado` for refeito |
| `/#home`, `/#servicos` | páginas ainda no design antigo | O cabeçalho antigo aponta para âncoras que a home nova não tem | Pendente — sai quando cada página for refeita |

As duas pendências **não existem em nenhuma página já redesenhada**. São o
custo de o site estar meio novo e meio velho, e desaparecem com os
checkpoints que faltam. A mesma causa que o Codex apontou em `/tiktok-shop`,
já resolvida lá.

### 2.2 Ressalva sobre "órfãs"

O crawl acusou 740 artigos sem link apontando. **É limitação do crawler, não
defeito do site:** ele não segue `?page=` nem `?cat=`, e a listagem do blog
pagina de 24 em 24. Todos os 825 artigos estão no sitemap e são alcançáveis
pela paginação e pelos filtros, ambos renderizados no servidor. Conferido à
parte: `/blog?page=2` e `/blog?cat=SEO` respondem 200 com cartões no HTML.

### 2.3 Menus, rodapés e caminho de página

- Menu móvel: 14 asserções em 5 rotas, a 390×844 — abre, foco entra, Escape
  fecha, foco volta ao botão, Tab e Shift+Tab presos, 6 destinos internos com
  âncora existente, fecha ao escolher destino. **Aprovado.**
- Rodapé: mesmos grupos e destinos em todas as páginas refeitas.
- Caminho de página (breadcrumb): presente em todas as internas refeitas, com
  a última etapa como texto e `aria-current`.

---

## 3. SEO

### 3.1 Metadata, canonical, robots

Conferido página a página contra `@/lib/servicos`, `@/lib/solucoes` e o
conteúdo do blog:

| Verificação | Cobertura | Status |
|---|---|---|
| `title`, `description`, `keywords` | 22 internas + 87 artigos + listagem | Aprovado |
| `canonical` | idem | Aprovado |
| `robots: index, follow` | idem | Aprovado |
| JSON-LD `FAQPage` pergunta a pergunta | 22 internas | Aprovado |
| JSON-LD `Article` campo a campo | 87 artigos | Aprovado |
| JSON-LD `Service` e `BreadcrumbList` | `/tiktok-shop` | Aprovado |
| Sitemap | 856 URLs, sem as rotas encerradas, com a nova | Aprovado |
| Um `h1` por página, abrindo pelo título | 31 páginas | Aprovado |

Scripts: `internas-seo.mjs`, `blog-seo.mjs`, `h1-das-paginas.mjs`,
`tiktok-shop.mjs`.

**Uma melhoria encontrada no caminho:** em `/tiktok-shop` os três JSON-LD
eram injetados por `next/script` com a estratégia padrão — só existiam depois
que o JavaScript rodava, não no HTML servido. Agora são `<script>` comuns,
renderizados no servidor, com conteúdo idêntico.

### 3.2 Hierarquia de títulos — pré-existente

340 artigos do acervo WordPress saltam de `h1` para `h3` ou `h4`. **A causa é
o conteúdo, não o template:** numa amostra de 200 posts, 57 começam com `h3`
ou `h4` no próprio HTML importado. O template antigo tinha o mesmo
comportamento.

Corrigir é possível — normalizar os níveis na renderização —, mas mexe no
conteúdo de 340 páginas indexadas. **Pendente de autorização**, não de
trabalho.

### 3.3 Conteúdo do blog preservado

87 artigos conferidos (6 curados, 42 Keystatic, 39 de 777 do WordPress, em
amostra determinística): título, resumo, data, corpo e o sumário batendo com
os `h2`. O redirecionamento 308 dos posts substituídos continua. `extractFaqs`
e o `articleLd` estão **byte a byte idênticos** aos da base.

---

## 4. Integrações e mensuração

### 4.1 Camada protegida

`git diff 7ae962b..HEAD -- src/lib src/app/api`:

| Arquivo | Mudou | Motivo |
|---|---|---|
| `src/lib/servicos.ts` | sim | Dois serviços encerrados e a página de UGC criada, ambos por ordem do Flávio |
| `src/lib/solucoes.ts` | sim | Os dois saíram de Inteligência & Operação, com o FAQ absorvendo o conteúdo; a UGC entrou em Geração de Demanda |
| **Todo o resto de `src/lib`** | **não** | — |
| **Todo o `src/app/api`** | **não** | — |

Os dois são bibliotecas de **conteúdo**, não de mensuração. Nenhum arquivo de
conversão, CRM, atribuição ou telemetria foi tocado. As duas exceções estão
registradas em `docs/redesign/hashes-excecoes.txt` e são **impressas em toda
rodada** do `verificar.sh`, em vez de sumirem num rebaseline.

### 4.2 Tags e scripts

| Item | Estado |
|---|---|
| `src/app/layout.tsx` (GTM `GTM-5NNPNZ`, head e noscript) | **Idêntico à base** |
| `AttributionTracker` | **Idêntico** |
| `RecaptchaProvider` | **Idêntico** |
| `vercel.json`, inclusive o cron `0 12 * * *` | **Idêntico** |
| `src/components/ui/PhoneField.tsx` | +16/−4: ganhou a variante `ciclo2026`; o padrão não mudou |

### 4.3 Contratos de formulário e evento

Medido com a rede externa cortada e `/api/*` em mock — nada saiu para
Pipedrive, Meta, GA4, GTM ou Supabase:

```
leadForm        generate_lead → POST /api/pipedrive
                annualRevenue, attribution, company, email, event_id, lgpd,
                message, name, page_url, phone, segment, source
playbookForm    playbook_form_submit → POST /api/pipedrive (+pipeline)
linkBioForm     5× step_view, 5× step_complete, generate_lead
                → 5× POST /api/link-bio (attribution, complete, data,
                  event_id, page_url, step)
aplicacaoForm   8× step_view, 7× step_complete, consultoria_ecom_shift_lead
                → POST /api/aplicacao
```

**Idênticos ao baseline**, nomes de evento e chaves de payload. Isso cobre
`event_id` único por envio, `attribution` com UTMs e o consentimento LGPD,
que é campo obrigatório do schema.

### 4.4 Variáveis de ambiente — só nomes

25 nomes referenciados no código, e o `.env.example` bate exatamente com
eles. Nenhum valor foi lido, exibido ou copiado.

`ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `CRON_SECRET`, `GA4_API_SECRET`,
`GA4_LEAD_QUALIFY_STAGES`, `GA4_MEASUREMENT_ID`, `INTERNAL_EMAIL_DOMAINS`,
`LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_REDIRECT_URI`,
`META_CAPI_TOKEN`, `META_PIXEL_ID`, `META_TEST_EVENT_CODE`,
`NEXT_PUBLIC_LINKEDIN_ENABLED`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`,
`PIPEDRIVE_API_TOKEN`, `PIPEDRIVE_PIPELINE_NAME`, `PIPEDRIVE_STAGE_ID`,
`PIPEDRIVE_STAGE_NAME`, `PIPEDRIVE_WEBHOOK_SECRET`, `RECAPTCHA_SECRET_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`, `YOUTUBE_API_KEY`,
`YOUTUBE_CHANNEL_HANDLE`.

### 4.5 O que NÃO é verificável aqui

| Integração | Por quê |
|---|---|
| Meta Pixel e CAPI ponta a ponta | O escopo Preview não tem `META_*`; e o domínio `*.vercel.app` não é verificado no Business Manager, o que gera o aviso de restrição já registrado |
| Pipedrive: pipeline, etapa, campos | Sem `PIPEDRIVE_*` no Preview. O código que monta o payload não mudou, mas a criação de negócio real só se confirma em produção |
| Supabase (telemetria) | Sem `SUPABASE_*` no Preview |
| GA4 e reCAPTCHA | Sem chave no Preview |
| Cron `/api/cron/site-digest` | Só dispara em produção |

Isso é **proteção, não defeito**: sem credencial, um envio de teste no Preview
não alcança sistema real. O preço é que esses caminhos só fecham depois do
merge. **Não copiar credencial de produção para o Preview.**

---

## 5. Imagens: diagnóstico da baixa qualidade

Medido no navegador a 1440px, DPR 1, com `naturalWidth` real.

### 5.1 Cases da home

Caixa exibida: **546 × 225** (recorte por `object-fit: cover`).

| Arquivo | Origem real | Servido | Exibido | Veredito |
|---|---|---|---|---|
| `mamo.jpg` | **399 × 501** | 399 × 501 | 546 × 225 | **Ampliado ~1,37×. É a causa principal da moleza.** |
| `gringa.jpg` | 855 × 481 | 855 × 481 | 546 × 225 | Suficiente a 1×, curto a 2× |
| `gopro.jpg` | 1280 × 720 | 1080 × 608 | 546 × 225 | Adequado |
| `jacklinks.jpg` | ≥1080 de largura | 1080 × 615 | 546 × 225 | Adequado |

**Causa raiz:** o arquivo de origem do Mamô tem 399px de largura para um
espaço de 546px. Nenhum ajuste de código recupera detalhe que não existe no
arquivo — **só um arquivo maior resolve**. O do Gringa fica no limite: bom em
tela comum, macio em tela Retina.

**Segundo problema, este de banda, não de nitidez:** nenhuma das imagens tem
atributo `sizes`. O Next emite `srcset` com `w=1080` e `w=1920`, e numa tela
DPR 2 o navegador baixa a variante de 1920px para um espaço de 546px — cerca
de doze vezes mais pixels que o necessário. Corrigir é barato e **não melhora
a nitidez**, só o peso.

### 5.2 Episódios do podcast e depoimentos

| Bloco | Origem | Conteúdo útil | Exibido | Veredito |
|---|---|---|---|---|
| Episódios (home) | `hqdefault.jpg` 480×360 | 480×270 (o resto é tarja preta, recortada) | 420 × 236 | Adequado a 1×, macio a 2× |
| Depoimentos (home) | `hqdefault.jpg` 480×360 | 480×270 | **546 × 307** | **Ampliado. Macio mesmo a 1×.** |

`hqdefault` foi escolhido antes nesta mesma operação porque `maxresdefault`
não existe para os vídeos mais antigos. Mas há opções melhores que não foram
testadas: `hq720.jpg` (1280×720, sem tarja) e `sddefault.jpg` (640×480).

**Correção proposta,** para checkpoint próprio: usar `hq720` com queda para
`hqdefault` quando a plataforma não tiver, e acrescentar `sizes` nos dois
blocos. Isso resolve os depoimentos e melhora os episódios em tela Retina,
sem depender de arquivo novo.

**Status: diagnosticado. Correção pendente.** A dos cases depende de arquivo
de origem maior, que precisa vir do Flávio — `mamo.jpg` em pelo menos 1100px
de largura, `gringa.jpg` idem para telas Retina.

---

## 6. Atualização automática do podcast

### 6.1 Como funciona hoje

| Peça | O que faz |
|---|---|
| Canal | `YOUTUBE_CHANNEL_HANDLE`, com `@ofatorm` como padrão no código |
| Fonte | API do YouTube v3: canal → playlist de uploads → detalhes dos vídeos |
| Filtro | Descarta Shorts: menos de 300s, título com `#short`, ou vídeo vertical |
| Corte | Os 8 primeiros horizontais |
| Rota | `GET /api/youtube/latest` |
| Cache | `revalidate: 600` em cada fetch; resposta com `s-maxage=600, stale-while-revalidate=600`; em caso de erro, `s-maxage=3600` |
| Consumo | `PodcastSection` (antigo), `ciclo/home/Podcast` (novo) e `/ofatorm` — todos buscam no **cliente**, depois da montagem |
| Fallback | `FALLBACK_VIDEOS`, em `src/lib/youtube.ts` |

O redesign **conserva essa operação sem alterar nada**: o novo `Podcast.tsx`
faz a mesma busca, com o mesmo fallback. `src/app/api/youtube/latest/route.ts`
não foi tocado.

Preview e produção **dependem da mesma variável**, e o escopo Preview tem
`YOUTUBE_API_KEY` e `YOUTUBE_CHANNEL_HANDLE` — é a única integração que
funciona de verdade no Preview. Nas capturas locais ela não aparece porque
esta sessão não alcança `googleapis.com`.

### 6.2 Três problemas encontrados

**a) O passo de build não serve para nada.**
`scripts/fetch-youtube.js` roda antes do `next build` e escreve
`src/data/youtube-videos.json`. **Nenhum arquivo do projeto lê esse JSON.**
Conferido por busca em todo o `src/` e `scripts/`. O passo gasta cota da API
a cada build e o resultado é descartado.

**b) O fallback não é feito de episódios.**
Os quatro itens de `FALLBACK_VIDEOS` são os **vídeos de depoimento de
cliente** — `djykk9EFghg` (Líquido), `xVdqhprwKWw` (KVRA), `6B2XYATbK3Q`
(DANKI), `EhnxUiDMMRg` (Mamô) —, reetiquetados com títulos inventados
("Líquido - Crescimento E-commerce") e data de marcador `2024-01-01`. O JSON
do build traz sete itens no mesmo formato.

Ou seja: quando a API falha, "O Fator M" mostra **depoimento de cliente
apresentado como episódio de podcast**, com título que não existe.

**c) A primeira pintura sempre mostra o fallback.**
Como a busca é no cliente, o HTML servido traz os quatro itens falsos, e só
depois o JavaScript troca pelos reais. Quem rastreia sem executar JavaScript
vê os títulos inventados — na home e em `/ofatorm`.

**Nada disso foi causado pelo redesign: os três já estavam na base `7ae962b`.**
Mas (b) e (c) são exatamente o tipo de coisa que a instrução proíbe, e (c)
tem efeito de SEO na home.

### 6.3 Correção proposta

1. Buscar os episódios **no servidor**, na própria página — a home já é ISR
   com `revalidate: 900` — para o HTML sair com episódio real.
2. Trocar o conteúdo do fallback por episódios reais do canal, ou esconder a
   seção quando não houver dado. **Não vou escolher episódio sozinho:** os
   seis que o kit capturou da produção são reais e servem, se o Flávio
   confirmar.
3. Decidir sobre `scripts/fetch-youtube.js`: ligar o JSON a alguém ou tirar o
   passo do build.

**Status: diagnosticado. Correção pendente de decisão do Flávio** sobre qual
episódio entra no fallback — não vou inventar nem usar demonstração.

### 6.4 Episódios mais recentes

Não consigo listar daqui: esta sessão não alcança a API do YouTube. Os IDs
mais recentes que tenho com origem real são os seis que o kit capturou da
produção em setembro: `ytBr2WZmJJo`, `6pwvTi-HexM`, `7iKdQ8Xheks`,
`YjTTiJ2WPmk`, `4TIw-6oM4xY`, `tbvkX5i8jN0`. **Não verificável aqui** se
ainda são os mais recentes.

---

## 7. Quadro de status

| Área | Status |
|---|---|
| Inventário de rotas | Aprovado |
| Rotas novas e retiradas, com redirect | Aprovado |
| Destinos internos quebrados | Aprovado — zero |
| Âncoras | 1 corrigida; 2 pendentes, nas páginas ainda antigas |
| Metadata, canonical, robots, sitemap | Aprovado |
| JSON-LD | Aprovado, e melhorado em `/tiktok-shop` |
| Conteúdo do blog preservado | Aprovado |
| Hierarquia de títulos no blog | Pendente de autorização — pré-existente |
| Camada protegida | Aprovado, com 2 exceções registradas |
| GTM, atribuição, reCAPTCHA, cron | Aprovado — idênticos |
| Contratos de formulário e evento | Aprovado |
| Pixel, CAPI, Pipedrive, Supabase, GA4 | **Não verificável aqui** |
| Imagens dos cases | Diagnosticado — depende de arquivo novo |
| Miniaturas de depoimento e episódio | Diagnosticado — correção possível em código |
| Atualização do podcast | Diagnosticado — 3 problemas, todos pré-existentes |
| 8 páginas pendentes de redesign | Pendente |

---

## 8. O que eu faria em seguida, em checkpoints separados

1. **Miniaturas**: `hq720` com queda para `hqdefault`, e `sizes` nos cases,
   episódios e depoimentos. Só código.
2. **Podcast no servidor** e fallback honesto, depois do OK sobre quais
   episódios entram.
3. **`/ofatorm` e `/ecomshift`**, que fecham as institucionais.
4. **Consultorias**, depois **formulários** — o grupo mais sensível, por
   último.
5. Imagens de case novas, quando o Flávio enviar.

A migração só acontece depois do OK explícito dele.
