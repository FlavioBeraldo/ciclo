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

**17 templates ou rotas públicas: 9 feitos, 7 pendentes e 1 congelado.** A
18ª linha da tabela é o painel do CMS, que não é público. Em páginas
geradas, 853 de 858 — o blog responde pelo volume.

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

> **Correção de 17/10, de auditoria independente.** A versão anterior desta
> seção dizia que, por faltarem variáveis no Preview, as tags não rodavam
> ali. **Está errado para as tags de navegador.** Conferido no DOM real do
> Preview: carregam `googletagmanager.com/gtm.js?id=GTM-5NNPNZ`,
> `gtag/js?id=G-EY1FLE5C0J` e `gtag/js?id=AW-975154282`. Eles vêm do
> `layout.tsx`, em código, e **não dependem de variável de ambiente**.
> Ausência de env no Preview **não** significa isolamento das tags.

### O que roda no Preview

| Camada | No Preview | Observação |
|---|---|---|
| GTM, GA4 e Google Ads, no navegador | **Carregam** | Vêm do layout, sem env |
| Meta Pixel, no navegador | **Carrega**, com aviso de restrição de domínio no console | `*.vercel.app` não é verificado no Business Manager |
| YouTube | **Funciona** | Única integração de servidor com variável no escopo Preview |
| Meta CAPI (servidor) | Não roda | Sem `META_*` |
| Pipedrive | Não roda | Sem `PIPEDRIVE_*` |
| Supabase | Não roda | Sem `SUPABASE_*` |
| reCAPTCHA | Não roda | Sem chave |
| Cron `site-digest` | Não dispara | Só em produção |

### NÃO VERIFICADO

- Se o container **filtra por hostname**, e portanto se os hits do Preview
  chegam ou não ao GA4, ao Google Ads e ao Meta.
- Se há **deduplicação** configurada entre Pixel e CAPI pelo `event_id`.
- Como o **consentimento** está ligado no container.
- Quais **domínios** estão autorizados em cada tag.

Isso vive no container e no Business Manager, fora do repositório, e precisa
ser conferido **antes da liberação**. Enquanto não for, não dá para afirmar
nem que o Preview está isolado, nem que está poluindo os relatórios.

**O que posso afirmar:** os testes automatizados deste repositório rodam com
a rede externa cortada e `/api/*` em mock, e **nenhum lead de teste saiu**.
Mas **navegação humana no Preview carrega as tags** e pode gerar hit.

**Não desativar tag global nem alterar produção** para resolver isso.

Sem credencial de servidor, um envio no Preview não cria negócio no CRM nem
linha no Supabase. **Não copiar credencial de produção para o Preview.**

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
| 7 páginas pendentes de redesign | Pendente |

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

---

# Segunda rodada — respostas aos achados de 17/10

## 9. Mensuração: o snippet idêntico não basta

A observação está certa e eu tinha sido vago. Script igual **não garante**
que os gatilhos do GTM continuem casando: muitos gatilhos são configurados
por classe, id, texto ou seletor CSS, e isso vive no container, fora do
repositório.

### 9.1 O que foi comparado, elemento a elemento

| Gancho | Base `7ae962b` | HEAD | Risco |
|---|---|---|---|
| `id` dos campos do lead | `lead-name`, `lead-email`, `lead-company`, `lead-annual-revenue`, `lead-segment`, `lead-message` | **Idênticos** | Nenhum |
| `id="contato"` na seção | presente | **Presente** | Nenhum |
| `data-*` | nenhum | nenhum | Nenhum |
| Texto do botão de envio | "Fale com um especialista" | **Idêntico** | Nenhum |
| Texto do estado de envio | "Enviando..." | "Enviando..." — eu havia trocado por reticência tipográfica e **revertí** | Evitado |
| `<form>` | sem `id`, classe `grid sm:grid-cols-2 gap-5` | `id="contact-form"`, classe `contact-form` | **Gatilho por aquela classe deixaria de casar** |
| Botões de CTA | utilitários Tailwind, incluindo `bg-[#A100FF]` e `rounded-full` | classe `.button` do kit | **Gatilho por classe utilitária deixaria de casar** |
| Nomes de evento no dataLayer | 11 eventos | **Idênticos**, medidos | Nenhum |
| Chaves de payload | 4 contratos | **Idênticos**, medidos | Nenhum |

### 9.2 O que isso quer dizer

- **Gatilho de evento customizado do dataLayer:** seguro. Os nomes e as
  chaves foram medidos e são idênticos.
- **Gatilho de clique por seletor CSS:** **precisa de conferência no
  container.** Qualquer regra apoiada na classe antiga do formulário ou nas
  classes utilitárias dos botões deixa de casar nas páginas refeitas.
- **Gatilho por texto visível:** sobrevive, com a ressalva do "Enviando...",
  já revertido.

**Não declaro GA4 nem Meta entregues.** O que posso afirmar é que o código
emite os mesmos eventos com o mesmo payload. Se o disparo chega ao GA4 e ao
Meta depende do container e das credenciais, e isso só se confirma em
produção, com o Assistente de Tags aberto.

**Ação necessária fora daqui:** alguém com acesso ao container `GTM-5NNPNZ`
precisa listar os gatilhos que usam seletor CSS e conferir contra a tabela
acima. É a única parte desta auditoria que não cabe no repositório.

> **RESOLVIDO em 17/10 — ver seção 26.1.** A leitura do container mostrou que
> os gatilhos por seletor CSS têm **zero tags associadas** e que os gatilhos
> de conversão em uso são por evento customizado. As duas linhas marcadas
> como risco nesta tabela **não quebram nada**.

## 10. Playbook: a comparação não é só hash

Correto, e o método já vai além do hash — mas eu não tinha explicado.

`playbook-fingerprint.mjs` captura, em **desktop 1440 e celular 390**, com
`isMobile` e `hasTouch` no celular:

- **Fontes efetivamente carregadas**, pela `document.fonts`, depois de
  `document.fonts.ready` — pega regressão de fonte compartilhada.
- **Estilo computado** de `html`, `body`, `.lp-playbook`, `h1`,
  `.font-serif-lp` e `button[type="submit"]`: família, tamanho, peso, cor,
  fundo, entrelinha, raio e espaçamento.
- **Três estados**: inicial, rolado a 1600px e com erro de validação, com
  captura de tela inteira em cada um.
- Altura e largura do documento, e a visibilidade do CTA fixo.

O `.font-serif-lp` está ali de propósito: é a regra que o popup do playbook
compartilhava. Quando passei o popup para Inter, **não toquei nessa regra** —
dei ao popup uma marcação própria —, e a impressão digital continuou idêntica
em todas as rodadas desde então.

**Status: aprovado, por comparação visual e funcional**, não por hash.

## 11. Barras literais em `/blog/email-marketing-para-ecommerce`

**Não se reproduz no texto visível.** Medido no DOM renderizado:

```
"…sem distorcer — e-mails "teaser", que escondem a proposta…"
contém barra invertida: false
```

- No `.mdoc` de origem: `e-mails "teaser"`, aspas retas, sem escape.
- No HTML servido: `&quot;teaser&quot;` — correto.
- No payload do React Server Components, no fim do HTML: `&quot;` —
  **serialização normal do framework**, invisível para quem lê a página e
  para quem rastreia o corpo do documento.

Se a barra apareceu em `view-source`, era o payload. **Herdado e inofensivo,
nada a editar.** Se aparecer na tela em algum navegador, me mandem a captura
que eu reabro.

## 12. ISR Writes: origem investigada

**Não é do redesign.** Os três `revalidate` são idênticos à base:

| Rota | Base | HEAD |
|---|---|---|
| `/` | 900 | 900 |
| `/blog` | 900 | 900 |
| `/blog/[slug]` | 900 | 900 |
| `/sitemap.xml` | 3600 | 3600 |

**A origem quase certa é `/blog/[slug]` com `revalidate: 900` em 825
páginas.** Cada artigo pode regravar o cache 96 vezes por dia. O teto teórico
é 79.200 gravações diárias; o observado, 343 mil em 30 dias, dá ~11,4 mil por
dia — compatível com cerca de 14% dos artigos sendo pedidos em cada janela.
As 30 invocações de cron em 30 dias são o `site-digest` diário e não
explicam nada disso.

**Recomendação, com número:** os 900 segundos existem para o post agendado do
Keystatic entrar no ar às 9h. Isso importa para a **listagem** e para o
**sitemap**, não para os 825 artigos já publicados, que raramente mudam.
Subir `revalidate` só em `/blog/[slug]` para 6 horas cortaria a fonte
dominante por volta de 24×, sem atrasar publicação nenhuma. É mudança de
comportamento, então **fica como recomendação, não aplicada.**

**Sobre amplificação ao mover o podcast para o servidor:** a busca entraria
na home, que **já** revalida a cada 900s. Zero gravação nova. `/ofatorm`
ainda não foi refeita; quando for, entra com a mesma ressalva.

## 13. Miniaturas: o placeholder de 120×90

Observação procedente, e corrigida. Para `maxresdefault` e `hq720` ausentes o
YouTube às vezes responde 404 — e às vezes **200 com uma imagem cinza de
120×90**. O `onError` sozinho não pega o segundo caso: a imagem carrega e o
cartão mostra um retângulo cinza.

`MiniaturaYouTube` agora desce de degrau também quando a imagem **carrega**
com menos de 320px de largura decodificada. A verificação é por vídeo, em
tempo de execução, nos dois caminhos de falha. O último degrau é
`hqdefault`, que sempre existe.

## 14. Imagem do case Mamô

Procurei fonte melhor em todos os lugares plausíveis:

| Onde | Resultado |
|---|---|
| `public/cases/` | só `mamo.jpg` 399×501 e `mamo.svg`, que é logotipo |
| `public/brands/mamo.png` | logotipo, não foto |
| Kit de layouts | mesmo arquivo, 34.155 bytes, idêntico |
| Miniatura do vídeo do cliente | `MlDyvGg7rGs` é **depoimento em estúdio**, não imagem de marca. Usar como foto do case trocaria a identidade visual do bloco |

**Pendência explícita: não há fonte melhor no projeto.** Não farei upscale
nem gerarei imagem. Preciso de `mamo.jpg` com no mínimo 1100px de largura.
`gringa.jpg`, 855×481, atende em tela comum e fica curto em Retina.

## 15. Dívida herdada, separada de regressão

Para não misturar as duas coisas no mesmo balde:

| Item | Natureza | Veio de |
|---|---|---|
| 340 artigos saltando de `h1` para `h3`/`h4` | **Dívida herdada** | Importação do WordPress |
| Fallback do podcast com depoimento renomeado | **Dívida herdada** | Base `7ae962b` |
| `scripts/fetch-youtube.js` escrevendo JSON que ninguém lê | **Dívida herdada** | Base |
| ISR Writes acima da franquia | **Dívida herdada** | `revalidate: 900` em 825 páginas, igual à base |
| `/obrigado` com `#depoimentos` sem alvo | **Dívida herdada** | Rodapé antigo |
| `#resultados` sem alvo na página de UGC | **Regressão minha** | Corrigida em `935291a` |
| Busca do blog ignorando o destaque | **Herdado, revelado por mim** | A exclusão vinha da base; a busca que acrescentei tornou visível. Corrigida |
| `sizes` ausente nas imagens | **Herdado** | Corrigido |

**Nenhuma correção em massa dos 340 artigos agora**, conforme orientado.

## 16. Base de produção e plano de migração

### 16.1 Base atual, confirmada nos dois lados

| Item | Valor |
|---|---|
| Produção | **Ready** em `7ae962bad1758ef0c77e775af6a683e7e5a0e280` |
| Deployment | `Hb5TEUapVasyUCm9amGRnRzDyAhe` · `ciclo-dl2o-93six9eyy` |
| Branch | `claude/elegant-darwin-HVyvT` |
| Domínio | `cicloecommerce.com.br` |

Conferido também pela API do GitHub: deployment `6665805577`, ambiente
Production, estado success, no mesmo SHA. **A produção não avançou desde a
ramificação** — `7ae962b` é ao mesmo tempo a base histórica e o estado atual.

### 16.2 Conteúdo que pode ter mudado em produção

A ramificação foi do próprio `7ae962b`, e o HEAD de produção segue nele.
**Não há commit novo em produção para preservar.** Mas há duas fontes que
mudam **fora do git** e precisam de checagem no dia:

| Fonte | Como muda | O que fazer antes do merge |
|---|---|---|
| Artigos do Keystatic | commit em `content/blog/*.mdoc`, pelo painel | `git log origin/claude/elegant-darwin-HVyvT -- content/blog` e rebase da branch se houver commit novo |
| Episódios do YouTube | API externa, sem commit | Nada: o conteúdo é buscado em tempo de execução |

**Gate 1: conferir, na hora do merge, se a branch de produção avançou.** Se
tiver avançado, rebase antes, nunca force-push por cima.

### 16.3 Gates para liberar a migração

> **Substituída pela seção 26.9.** A tabela abaixo é o estado de então; o
> gate 5 foi resolvido, o 7 concluído, e o gate "OK do Flávio" mudou de dono.

| # | Gate | Como se verifica | Estado |
|---|---|---|---|
| 1 | Produção não avançou, ou a branch foi rebaseada | `git log` comparando os dois HEADs | A conferir no dia |
| 2 | As 12 etapas do `verificar.sh` verdes no SHA exato | rodar e anexar a saída | Verde hoje |
| 3 | Crawl sem destino quebrado | `crawl.mjs` | Verde hoje |
| 4 | 7 páginas pendentes refeitas, ou decisão explícita de ir ao ar com elas antigas | inventário | **Pendente** |
| 5 | Gatilhos do GTM por seletor conferidos no container | fora do repositório | **Pendente** |
| 6 | Imagem do Mamô substituída, ou aceite da pendência | arquivo novo | **Pendente** |
| 7 | Fallback do podcast honesto | checkpoint próprio | **Em andamento** |
| 8 | OK explícito do Flávio | — | **Pendente** |

### 16.4 Rollback

| Item | Valor |
|---|---|
| Versão de retorno | `7ae962bad1758ef0c77e775af6a683e7e5a0e280` |
| Deployment a promover | `Hb5TEUapVasyUCm9amGRnRzDyAhe` |
| Como | **Promote** desse deployment no painel da Vercel, que é imediato e não depende de build |
| Alternativa pelo git | `git revert` do merge na branch de produção, que dispara um build novo — mais lento |
| O que **não** fazer | force-push, reset, apagar deployment ou trocar plano |

O rollback restaura o código. **Não desfaz** o que tiver sido gravado em
sistema externo no intervalo — lead no Pipedrive, evento no GA4 e no Meta,
linha no Supabase. Por isso a janela de validação pós-deploy é curta.

### 16.5 Validação pós-deploy, em produção

Na ordem, logo depois do merge:

1. **Fumaça**: home, um serviço, uma solução, `/blog`, um artigo,
   `/tiktok-shop`, `/depoimentos` — todas em 200, com o visual novo.
2. **Mensuração, com o Assistente de Tags aberto**: carregar a home e
   confirmar `page_view` no GA4 e `PageView` no Meta.
3. **Um lead de teste real**, combinado com o time, com e-mail interno
   identificável: confirmar `generate_lead` no dataLayer, o negócio no
   Pipedrive no funil e etapa certos, o `Lead` no Meta com o mesmo
   `event_id` de Pixel e CAPI, e a linha no Supabase. **É o único teste que
   fecha o que o Preview não alcança.**
4. **Atribuição**: entrar por uma URL com UTM, verificar o cookie
   `ciclo_attr` e o payload do envio.
5. **SEO**: `sitemap.xml` com 856 URLs, três canonicals por amostragem, e os
   dois redirects das rotas encerradas devolvendo 308.
6. **Cron**: confirmar a execução seguinte do `site-digest`.
7. **ISR**: acompanhar o painel por 48h, pelo histórico de franquia estourada.

Se 1, 2 ou 3 falharem, **rollback pelo Promote** e investigação na branch.

---

# Terceira rodada — 17/10, revalidação do `935291a`

## 17. O que a auditoria independente confirmou

| Item | Resultado |
|---|---|
| `/blog?q=full+funnel` | **1 artigo, o correto** — corrigido |
| Mapa do site | **5 destinos novos presentes** |
| 6 miniaturas do podcast | **maxresdefault** |
| Depoimentos Mamô e DANKI | **maxresdefault** |
| Depoimentos Líquido e KVRA | **caem para hqdefault** |
| Player do Mamô | reproduz, Escape fecha, foco volta ao botão |

## 18. Miniaturas: parcial, não aprovado

**Dois dos quatro depoimentos continuam limitados pela origem.** `djykk9EFghg`
(Líquido) e `xVdqhprwKWw` (KVRA) não têm `maxresdefault` nem `hq720` no
YouTube — foram enviados em resolução menor. Para esses dois, `hqdefault` é
o melhor que existe, e o cartão de 546px continua ampliando.

**Não declarar os depoimentos em HD.** O status correto:

| Vídeo | Melhor degrau real | Veredito |
|---|---|---|
| Mamô `MlDyvGg7rGs` | maxresdefault | Aprovado |
| DANKI `6B2XYATbK3Q` | maxresdefault | Aprovado |
| Líquido `djykk9EFghg` | hqdefault | **Parcial — limitado pela origem** |
| KVRA `xVdqhprwKWw` | hqdefault | **Parcial — limitado pela origem** |
| 6 episódios do podcast | maxresdefault | Aprovado |

Só reenviar o vídeo ao YouTube em resolução maior resolve os dois. Não é
coisa de código.

## 19. Fallback para resposta 200 com placeholder: confirmado por teste

O Preview `935291a` que a auditoria revalidou **ainda não tinha** essa
proteção — ela entrou no `628116d`. Agora está coberta e provada.

`docs/redesign/miniaturas.mjs` força os dois caminhos de falha com resposta
fabricada, sem rede:

```
ok  maxres existe de verdade              → para em maxresdefault
ok  maxres responde 404                   → desce para hq720
ok  maxres responde 200 com 120×90        → desce para hq720
ok  maxres e hq720 placeholder            → desce para sddefault
ok  nada existe a não ser hqdefault       → para em hqdefault
```

A regra: desce de degrau no `onError` **e** quando a imagem carrega com
menos de 320px decodificados. O último degrau não desce mais.

## 20. Quadro corrigido de status

| Área | Status |
|---|---|
| Busca e filtros do blog | **Aprovado** |
| Mapa do site | **Aprovado** |
| Miniaturas de episódio | **Aprovado** |
| Miniaturas de depoimento | **Parcial** — 2 de 4 limitados pela origem |
| Queda de degrau da miniatura | **Aprovado**, com teste dos dois caminhos |
| Player: teclado, Escape, foco | **Aprovado**, confirmado em navegador real |
| Imagem do case Mamô | **Pendente** — não há fonte melhor no projeto |
| Fallback e SSR do podcast | **Pendente** — próximo checkpoint |
| Tags no Preview: GTM, GA4, Ads, Pixel carregam | **Fato registrado** |
| Container do GTM: hostname, consentimento, deduplicação, domínios | **NÃO VERIFICADO** |
| Alerta de ISR Writes | **Pendente** — origem diagnosticada, correção recomendada e não aplicada |
| 7 páginas no design antigo | **Pendente** |
| Migração | **NÃO APROVADA** pelo Flávio |

---

# Quarta rodada — inventário completo de integrações

Levantado do código em `47a024a`, do histórico git e do PR #18. Nenhum token,
chave ou dado pessoal aparece aqui. Nada foi alterado em produção, no GTM, em
conta, credencial ou banco. Nenhum lead real foi enviado.

**A regra que organiza tudo abaixo:** presença de env e de código **não é**
entrega. A coluna de evidência separa o que eu medi do que só posso ler.

## 21. Matriz de fluxos

### 21.1 Conversão do site — `generate_lead`

| | |
|---|---|
| **Origem** | `ciclo/Contato.tsx` (páginas refeitas) e `components/LeadForm.tsx` (4 páginas antigas) |
| **Caminho** | `pushConversion('generate_lead')` → `lib/conversions.ts` → dataLayer → GTM |
| **Servidor** | `POST /api/pipedrive` → `lib/pipedrive-server.ts` |
| **Destinos** | GTM web `GTM-5NNPNZ` → GA4 `G-EY1FLE5C0J` e Google Ads `AW-975154282`; Pipedrive; Meta Pixel + CAPI; Supabase |
| **Configuração** | `PIPEDRIVE_API_TOKEN`, `META_CAPI_TOKEN`, `META_PIXEL_ID`, `SUPABASE_*` |
| **Preservado** | **Sim, medido.** Nome do evento e as 12 chaves do payload idênticos ao baseline |
| **NÃO VALIDADO** | Se o hit chega ao GA4 e ao Meta; se o negócio é criado no funil certo |

### 21.2 Pipedrive — funil, etapa e campos

| Item | Valor no código | Arquivo |
|---|---|---|
| Funil padrão | por nome em `PIPEDRIVE_PIPELINE_NAME`, senão o que contém "entrada" | `lib/pipedrive-server.ts:113` |
| Etapa | `PIPEDRIVE_STAGE_ID`, senão por `PIPEDRIVE_STAGE_NAME`, senão `/entrada/i` | `:79, :110, :122` |
| Aplicação E-com Shift | `PIPELINE_ID` e `STAGE_ID` fixos no módulo | `api/aplicacao/route.ts:125` |
| Playbook | hint por nome "Playbook" → primeira etapa do funil | `lib/pipedrive-server.ts:76` |
| Campos de atribuição | 8 campos com chave de hash fixa: Origem, Mídia, Campanha, GA Client ID, GA Session ID, Landing Page, gclid, Atribuição extra (JSON) | `lib/pipedrive-fields.ts:25-32` |
| Webhook | `POST /api/pipedrive/webhook`, Basic auth com `PIPEDRIVE_WEBHOOK_SECRET` ou `?secret=`; aceita payload v1 e v2 | `api/pipedrive/webhook/route.ts:16-19` |
| Segundo webhook | `POST /api/pipedrive/enrich`, no gatilho "Criar negócio" — **faltou nesta tabela, ver 26.3** | `api/pipedrive/enrich/route.ts` |

**Preservado:** todos esses arquivos estão **idênticos** a `7ae962b`.
**NÃO VALIDADO:** se as chaves de campo ainda correspondem aos campos da
conta, se o webhook está cadastrado e apontando para o domínio certo, e se
os ids de funil e etapa da Aplicação continuam válidos.

### 21.3 GA4 — dois caminhos distintos

**Caminho A, navegador:** `generate_lead`, `playbook_form_submit`,
`consultoria_ecom_shift_lead`, `begin_checkout`, os eventos de etapa do
link-bio e da aplicação, e os três do popup. Vão ao dataLayer e dependem do
container para virar hit.

**Caminho B, servidor, pelo Measurement Protocol:** `qualify_lead` e
`close_convert_lead`, disparados pelo **webhook do Pipedrive**, não pelo
site. Regra em `lib/ga4-lead-events.ts`:

| Funil | `qualify_lead` | `close_convert_lead` |
|---|---|---|
| 2 — Site/Whats | etapa 11, "Lead Qualificado" | negócio ganho |
| 13 — Playbooks | etapa 96, "SQL / Oportunidade" | negócio ganho |

- Pular a etapa também dispara; negócio ganho sem `qualify_lead` prévio
  recebe os dois.
- `client_id` e `session_id` saem de campos do próprio negócio
  (`ga_client_id`, `ga_session_id`); sem `client_id` real usa um de
  fallback, e aí **não** envia `session_id`.
- Idempotente por (negócio, evento) na tabela `conversion_events`,
  plataforma `ga4`.
- Override sem deploy por `GA4_LEAD_QUALIFY_STAGES="2:11,13:96"`.
- Origem: PR **#18** `feat/ga4-lead-events`, merge `54a2dea`, commits
  `9e65c96` e `927fdf2`.

**Sobre o que você viu no painel:** `generate_lead`, `playbook_form_submit` e
`qualify_lead` com atividade nos últimos 28 dias, e `close_convert_lead` e
`consultoria_ecom_shift_lead` sem streaming. **Isso é consistente com o
código e não indica regressão:**

- `close_convert_lead` só dispara quando um negócio é **marcado como ganho**
  nos funis 2 ou 13. Sem ganho no período, não há evento.
- `consultoria_ecom_shift_lead` só existe em `/aplicacao`, que é página
  `noindex` de campanha. Sem envio no período, não há evento.

Nenhum dos dois depende do redesign: `/aplicacao` ainda está no design
antigo e o webhook não foi tocado.

### 21.4 Meta — Pixel e CAPI

| | |
|---|---|
| Dedup | O `event_id` do CAPI é **o mesmo** que o Pixel usa no navegador — `lib/meta-capi.ts:4` |
| Dados pessoais | normalizados e hasheados em SHA-256 antes de sair: e-mail, telefone, nome, sobrenome, cidade, estado, país, `external_id` |
| Cookies | `fbp` e `fbc` enviados sem hash, como manda a API |
| E-mail interno | `isInternalEmail` descarta envio, por `INTERNAL_EMAIL_DOMAINS` |
| Eventos de funil | por mudança de etapa, via webhook: `Schedule`, `MeetingHeld`, `QualifiedLead`, `Opportunity`, `ProposalSent` — `lib/pipedrive-funnel-events.ts:18-22` |
| Idempotência | `conversionAlreadySent('meta', evento, dealId)` |

**Preservado:** arquivos idênticos à base.
**NÃO VALIDADO:** se a deduplicação funciona de fato no Gerenciador de
Eventos, e se o `test_event_code` está ou não ligado em produção.

### 21.5 Atribuição

| Item | Comportamento | Arquivo |
|---|---|---|
| Primeiro toque | cookie próprio `ciclo_attr`, 90 dias, **só grava se ainda não existir** | `lib/attribution.ts:71, :100` |
| Precedência da origem | utm_source → gclid (google/cpc) → fbclid (facebook/paid_social) → referrer → (direct)/(none) | `:47-52` |
| Campos | source, medium, campaign, term, content, gclid, fbclid, landing_page, first_visit | `:88-96` |
| Último toque | lido do cookie do GA4 no momento do envio | `:1-2` |
| `_fbc` | lido do cookie; se não houver mas existir `fbclid`, montado no formato oficial `fb.1.<ts>.<fbclid>` | `:168-169` |
| `_fbp` | lido do cookie do Pixel | `:28` |
| LinkedIn | detecta `utm_source` linkedin ou `li_fat_id` | `:108` |

**Preservado:** idêntico à base, e o payload com `attribution` foi medido nos
quatro formulários.

### 21.6 Supabase

| Item | Detalhe |
|---|---|
| Acesso | PostgREST puro, sem SDK — `lib/supabase-server.ts:1` |
| Operações | `upsertVisitor`, `insertEvent`, e registro em `conversion_events` |
| Idempotência | consulta por `platform + event_name + deal_id + status=sent` antes de enviar — `:157` |
| Erros | capturados e logados, **não derrubam o fluxo** — `:95, :120` |
| Tipos de evento | `page_view`, `form_submit`, `material_download`, `popup_view`, `popup_click` |

**NÃO VALIDADO:** se as tabelas existem com esse formato na instância atual.

### 21.7 reCAPTCHA — achado

`/api/verify-recaptcha` existe e valida com limiar de score 0,5
(`route.ts:16`). `RecaptchaProvider` envolve **apenas a home**
(`src/app/page.tsx`).

**Nenhum formulário do site chama `executeRecaptcha` nem posta para
`/api/verify-recaptcha`.** Busquei em todo o `src/`: as únicas ocorrências
estão no próprio provider e na própria rota.

**Ou seja: o reCAPTCHA é carregado, mas não protege formulário nenhum.**
Isso é dívida herdada, idêntica em `7ae962b` — não foi o redesign. Vale
decidir: ligar de verdade, ou remover o provider e a chave pública para
parar de carregar script e de criar superfície de consentimento à toa.

### 21.8 Demais fluxos

| Fluxo | Eventos | Servidor | Observação |
|---|---|---|---|
| `/link-bio` | `link_bio_step_view`, `link_bio_step_complete`, `generate_lead` | `POST /api/link-bio` por etapa, com `complete` e cookie assinado `ciclo_lb` | Lead parcial vira negócio desde a 1ª etapa |
| `/aplicacao` | 8 `step_view`, 7 `step_complete`, `consultoria_ecom_shift_lead` | `POST /api/aplicacao`, funil e etapa fixos, cookie `ciclo_apl` | Reenvio com mesmo `event_id` devolve `duplicate: true` e não conta duas vezes |
| `/obrigado` | **nenhum** | — | Página estática. A conversão é disparada **antes** do redirecionamento, por `waitForTags` |
| Playbook | `playbook_form_submit` | `POST /api/pipedrive` com `pipeline` | Congelado |
| Popup do playbook | `playbook_popup_view`, `_click`, `_dismiss` | `/api/track` | Só nas rotas do blog |
| Cron | — | `GET /api/cron/site-digest`, Bearer `CRON_SECRET`, 0 12 * * * UTC | Resumo de navegação vira Note na pessoa e no negócio aberto |
| LinkedIn | — | `/api/auth/linkedin/*`, atrás de `NEXT_PUBLIC_LINKEDIN_ENABLED` | Desligado por padrão |
| WhatsApp | — | — | **Nenhum link `wa.me` ou `api.whatsapp.com` no código.** O nome aparece como canal no conteúdo e como campo de formulário, não como integração |

## 22. GTM: dois containers

| Container | Onde aparece |
|---|---|
| `GTM-5NNPNZ`, web | `src/app/layout.tsx`, em código |
| **`GTM-M4K3G2GK`, servidor** | **Não existe no repositório.** Busquei o id em todo o `src/` — zero ocorrência |

O container de servidor, se estiver em uso, está configurado **fora do
código**: ou o container web envia para ele por um endpoint próprio, ou ele
recebe de outra origem. **NÃO VERIFICÁVEL daqui.** Precisa de leitura do
container web para saber se há tag apontando para o endpoint do servidor, e
qual domínio ele usa.

Isso importa para o redesign por um motivo prático: se o container de
servidor faz a deduplicação do Meta ou o encaminhamento ao GA4, a conferência
dos gatilhos precisa cobrir os dois, não só o web.

## 23. O que eu ainda não consigo provar

> **Quadro atualizado na seção 26.8.** Depois da leitura dos painéis, os
> itens 6, 7 e 8 saíram provados, o 9 e o 10 mudaram de veredito, e sobraram
> quatro pendências reais.

| # | Afirmação que **não** posso fazer | Por quê |
|---|---|---|
| 1 | "O `generate_lead` chega ao GA4" | O hit depende do container; o Preview não dá leitura do painel |
| 2 | "A dedup Pixel/CAPI funciona" | Precisa do Gerenciador de Eventos com dois envios do mesmo `event_id` |
| 3 | "O negócio entra no funil e etapa certos" | Precisa de credencial do Pipedrive, ausente no Preview |
| 4 | "As 8 chaves de campo ainda existem na conta" | Mesma razão |
| 5 | "O webhook está cadastrado e autenticando" | Configuração vive no Pipedrive |
| 6 | "As tabelas do Supabase têm o formato esperado" | Sem credencial no Preview |
| 7 | "`qualify_lead` e `close_convert_lead` disparam hoje" | Dependem de mudança de etapa e de ganho reais |
| 8 | "Os gatilhos do GTM por seletor continuam casando" | A classe do `<form>` e as dos CTAs mudaram; a regra vive no container |
| 9 | "O container de servidor está no caminho" | `GTM-M4K3G2GK` não existe no código |
| 10 | "O Preview não polui os relatórios" | As tags carregam lá; o filtro por hostname é configuração do container |

## 24. Teste controlado proposto — para executar depois da aprovação

**Não executei nada disto.** É o roteiro que fecharia os dez itens acima.

### Fase 1 — leitura, sem tocar em nada

1. No GTM web `GTM-5NNPNZ`: listar os gatilhos, marcar os que usam seletor
   CSS e conferir contra a tabela da seção 9.1. Verificar se existe tag
   apontando para o container de servidor e qual domínio.
2. No GTM servidor `GTM-M4K3G2GK`: identificar clientes e tags, e se ele
   recebe do web.
3. No Meta: confirmar se há `test_event_code` ativo e se a dedup por
   `event_id` está configurada.
4. No Pipedrive: confirmar que as 8 chaves de campo existem e que o webhook
   aponta para `cicloecommerce.com.br`.

### Fase 2 — um lead controlado, em produção, depois do merge

Com o time avisado, janela combinada, e um e-mail interno em
`INTERNAL_EMAIL_DOMAINS` **ou** fora dele, conforme o que se queira testar —
e-mail interno faz o CAPI pular o envio de propósito.

| Passo | O que conferir |
|---|---|
| 1 | Entrar por URL com UTM conhecida. Cookie `ciclo_attr` gravado com a origem certa |
| 2 | Enviar o formulário da home. `generate_lead` no dataLayer com `event_id` |
| 3 | Assistente de Tags do GTM: a tag do GA4 e a do Ads dispararam |
| 4 | GA4 em tempo real: `generate_lead` com os parâmetros |
| 5 | Gerenciador de Eventos da Meta: `Lead` do navegador e do servidor, **deduplicados pelo mesmo `event_id`** |
| 6 | Pipedrive: negócio no funil 2, etapa de entrada, com os 8 campos preenchidos |
| 7 | Supabase: linha em `conversion_events` e o visitante |
| 8 | Mover o negócio para a etapa 11: `qualify_lead` no GA4 e `QualifiedLead` na Meta |
| 9 | Marcar como ganho: `close_convert_lead` no GA4 |
| 10 | Mover de novo para a mesma etapa: **nada é reenviado** — prova a idempotência |

### Fase 3 — limpeza

Arquivar o negócio de teste e registrar no relatório qual `event_id` e qual
`deal_id` foram usados, para rastrear depois.

**Custo:** um negócio de teste no CRM e alguns hits nos relatórios.

> **Corrigido na seção 26.7.** Eu escrevia aqui que "não existe caminho que
> os feche sem tocar em produção" — está errado, e a frase saiu. Com
> ambiente dedicado dá para fechar quase tudo antes do merge. E o passo 5
> desta fase precisa de e-mail **fora** de `INTERNAL_EMAIL_DOMAINS`: com
> e-mail interno o CAPI pula o envio de propósito, então esse teste **não
> aprova a Meta**.

---

## 25. Podcast: checkpoint executado

Fecha os três problemas da seção 6.2, sem tocar em credencial, produção ou
conta.

### 25.1 O que mudou

| Antes | Agora |
|---|---|
| Busca no **navegador**, depois da montagem. O HTML servido saía com o fallback | Busca no **servidor**, dentro da página. O HTML já sai com episódio real |
| Fallback = 4 **vídeos de depoimento de cliente** reetiquetados, com título inventado e data 2024-01-01 | Fallback = os 8 episódios reais mais recentes do canal, com o título e a data que o canal publicou |
| `scripts/fetch-youtube.js` escrevia um JSON que **ninguém lia** | O mesmo JSON é o fallback: `src/lib/youtube.ts` o lê, e o build o atualiza |
| Sem episódio nenhum, mostrava os 4 falsos | Sem episódio nenhum, mostra "lista indisponível" com link para o canal |
| Regra de busca só em `/api/youtube/latest` | Regra em `src/lib/youtube-server.ts`; a rota e as páginas usam a **mesma** |

### 25.2 Arquivos

| Arquivo | O que é |
|---|---|
| `src/lib/youtube-server.ts` | **Novo.** `buscarEpisodios()`: API → snapshot → vazio, com a origem explícita. Nunca lança — é chamada durante a renderização, e uma exceção derrubaria a home |
| `src/lib/youtube.ts` | Passou a ler `src/data/youtube-videos.json`; `FALLBACK_VIDEOS` virou `EPISODIOS_SNAPSHOT` |
| `src/data/youtube-videos.json` | Os 8 episódios reais mais recentes, conferidos no canal em 17/10/2026 |
| `src/app/api/youtube/latest/route.ts` | Mesma resposta, mesmo cache; delega para `buscarEpisodios()` |
| `src/app/page.tsx` | `async`; passa a lista para `<Podcast>` |
| `src/app/ofatorm/page.tsx` | `async` + `revalidate = 3600`; passa a lista |
| `src/components/ciclo/home/Podcast.tsx` | Deixou de ser cliente: recebe a lista por prop e tem o estado de indisponível |
| `src/app/ofatorm/interactive.tsx` | Recebe por prop; saíram o `useEffect`, o esqueleto e o `AnimatePresence` |
| `scripts/fetch-youtube.js` | Mesmo filtro do servidor; lista vazia **não** substitui o snapshot |

As três mudanças na camada protegida estão em `hashes-excecoes.txt`, com o
motivo, e aparecem como `nota` a cada rodada da verificação.

### 25.3 Episódios do snapshot

Conferidos no canal `@ofatorm` (`UCRBJjfLbUd0tG5W2MBWFAwA`) em 17/10/2026.
São os 8 mais recentes com mais de 5 minutos — o mesmo corte que o site
aplica. **Nenhum título foi escrito por mim.** A descrição ficou vazia porque
não consegui lê-la; `/ofatorm` só mostra descrição quando existe, então nada
inventado aparece.

| # | id | publicado |
|---|---|---|
| 1 | `ytBr2WZmJJo` | 2026-10-15 |
| 2 | `6pwvTi-HexM` | 2026-10-14 |
| 3 | `7iKdQ8Xheks` | 2026-10-13 |
| 4 | `YjTTiJ2WPmk` | 2026-10-08 |
| 5 | `4TIw-6oM4xY` | 2026-10-06 |
| 6 | `tbvkX5i8jN0` | 2026-09-29 |
| 7 | `D06oE_kezXM` | 2026-09-22 |
| 8 | `wAEP7gpww1s` | 2026-09-01 |

Os seis primeiros são exatamente os que o kit tinha capturado da produção em
setembro (seção 6.4) — agora com o título real, não o reetiquetado.

### 25.4 Frequência efetiva de atualização

| Caminho | Janela | Comentário |
|---|---|---|
| Home | **15 min** | `revalidate = 900`, que já existia por causa de "Últimos artigos". O fetch usa o cache de dados do Next com 600s. Nenhuma regeneração nova |
| `/ofatorm` | **1 hora** | `revalidate = 3600`. Antes a página era estática e a lista vinha do navegador a cada visita |
| `/api/youtube/latest` | **10 min** | `s-maxage=600` no sucesso, `s-maxage=3600` no fallback. Igual a antes |
| Build | a cada deploy | `scripts/fetch-youtube.js` regrava o snapshot |

**Efeito em ISR Writes:** a home não muda. `/ofatorm` passa a regenerar:
1 página × 24/dia ≈ **720 por mês**, cerca de 0,2% das 343K medidas. Em troca,
some uma chamada a `/api/youtube/latest` por visita na home e em `/ofatorm`.

### 25.5 Falhas tratadas

| Situação | O que acontece |
|---|---|
| `YOUTUBE_API_KEY` ausente | Snapshot, com aviso no log |
| API fora do ar, 5xx | Snapshot |
| Cota estourada, 403 | Snapshot, com o status no log |
| Canal ou playlist não encontrados | Snapshot |
| Resposta só com Shorts | Snapshot — a lista vazia não vira tela vazia |
| Snapshot vazio | Estado de indisponível com link para o canal |
| Build sem rede | Snapshot anterior fica como está; o script nunca apaga |

### 25.6 Evidência

Teste novo: `docs/redesign/podcast.mjs`, passo 13 da verificação. Pede o HTML
**cru**, sem executar JavaScript.

```
== 13. Podcast
  ok    home traz os 6 episódios no HTML servido, sem JavaScript
  ok    /ofatorm traz os 7 episódios no HTML servido, sem JavaScript
  ok    home aponta para o episódio mais recente (ytBr2WZmJJo)
  ok    título inventado fora do ar: "Líquido - Crescimento E-commerce"
  ok    título inventado fora do ar: "KVRA - Estratégia de Crescimento"
  ok    título inventado fora do ar: "DANKI - Resultados Full Funnel"
  ok    título inventado fora do ar: "Mamô Brasil - E-commerce de Sucesso"
  ok    seção #podcast sem vídeo de depoimento
  ok    /api/youtube/latest devolve 8 itens com os 6 campos de sempre
  ok    cache-control preservado: public, s-maxage=3600
  ok    a rota não devolve vídeo de depoimento
```

O teste confere que os quatro vídeos de depoimento não aparecem **dentro da
seção `#podcast`** — fora dela eles continuam, porque ali são depoimentos
mesmo, que é o lugar certo.

**Estado de indisponível, medido:** esvaziei o snapshot, subi o servidor e pedi
as duas páginas. Resultado nas duas: o aviso presente, o link do canal
presente, e **zero** cartões de episódio. Depois restaurei o snapshot. Essa
checagem não entrou na suíte porque exige recompilar com outro conteúdo.

### 25.7 O que continua em aberto

- **`src/components/PodcastSection.tsx`** é a seção de podcast da home antiga.
  **Nenhuma página o importa.** Ficou no lugar; vale decidir junto com o resto
  do que sobrou do design anterior.
- O snapshot só se atualiza em deploy. Entre um deploy e outro, se a API ficar
  fora do ar por muito tempo, o fallback envelhece — continua real, mas
  desatualizado.
- **NÃO VALIDADO daqui:** se `YOUTUBE_API_KEY` responde em produção. Esta
  sessão não alcança `googleapis.com`; a lista de episódios foi conferida por
  outra via de leitura do canal, sem usar a chave do projeto.

---

# Quarta rodada — 17/10, evidência externa de leitura

## 26. O que a leitura dos painéis fechou, e o que abriu

Tudo nesta seção veio de **leitura externa independente** nos painéis do GTM,
Pipedrive, Supabase e GA4. Nenhum lead enviado, nenhuma configuração
alterada. Eu não executei nada disto e não tenho acesso a esses painéis; o
que faço aqui é cruzar com o código e dizer o que muda no veredito.

### 26.1 GTM web `GTM-5NNPNZ`

| Item | Leitura |
|---|---|
| Versão ativa | **107**, de 17/09/2026 |
| Volume | 39 tags, 29 gatilhos, 37 variáveis |
| Workspace | **0 alterações pendentes** |
| Histórico 99–107 | playbook, dedup, mensuração v2 / Ads enhanced, UID, renomeação `ciclo_uid` → `ciclo_ga4_uid`, filtro de bots, consultoria |

**O achado que mais importa para o redesign:**

> Os gatilhos antigos por seletor CSS — `Form Classes js-submit-popup` e
> `Click Classes button` — têm **ZERO tags associadas**. Os gatilhos de
> conversão em uso são por **evento customizado**, sem filtro CSS.

Isto **resolve o risco da seção 9.1**. O redesign trocou a classe do
`<form>` (`grid sm:grid-cols-2 gap-5` → `contact-form`) e as classes
utilitárias dos CTAs pela `.button` do kit. Eu tinha marcado os dois como
"gatilho por aquela classe deixaria de casar". **Nenhuma tag depende dessas
classes.** O item 8 da seção 23 sai da lista de coisas que não consigo
provar — e sai provado a favor.

**Demais tags e gatilhos, como lidos:**

| Peça | Estado |
|---|---|
| CE Conversões (regex) | `generate_lead`, `playbook_form_submit`, `begin_checkout`, `purchase`, `playbook_popup_view/_click/_dismiss`, `consultoria_ecom_shift_lead`, mais "Todos eventos personalizados" |
| GA4 base | All Pages, exceção só BLK bots; `send_page_view=true`; `user_id` por cJS |
| GA4 Evento Conversões | envia Event, `event_id`, `lead_source`, `medium`, `campaign`, `form`, `content_name`, `method`, `trigger`, `value`, `currency`, `user_data` |
| Meta Lead | `eventID = DLV event_id` — **estrutura de dedup confirmada**; a dedup efetiva, não |
| Ads Lead | CE `generate_lead`, transação = `event_id`, UPD UserData |
| Ads por `/obrigado` | **PAUSADA** |
| GA4/Meta legadas e 4 tags do playbook | **PAUSADAS — não reativar** |
| Também ativos | TikTok Setup / Pixel Event, LinkedIn Insight, Clarity |

Três leituras minhas sobre isso:

**a) A tag de Ads por `/obrigado` estar pausada confirma a seção 21.8.** Eu
tinha registrado que `/obrigado` não dispara nada e que a conversão sai
**antes** do redirecionamento, por `waitForTags`. O container concorda: a
tag que dependia da página de obrigado foi desligada e a de conversão passou
a pendurar no evento. Nada a fazer.

**b) O LinkedIn Insight roda pelo container, não pelo código.** No
repositório o LinkedIn está atrás de `NEXT_PUBLIC_LINKEDIN_ENABLED`,
desligado por padrão (seção 21.8). Isso não é contradição: são duas coisas
diferentes, e a que mede está no GTM. O mesmo vale para TikTok e Clarity —
**nenhum dos três tem código no repositório**, então o redesign não os
afeta.

**c) Quatro eventos do código não aparecem na regex de conversões.**
`aplicacao_step_view`, `aplicacao_step_complete`, `link_bio_step_view` e
`link_bio_step_complete` são emitidos pelo código (conferido agora:
`AplicacaoForm.tsx:174` e `:279`, `LinkBioForm.tsx:107` e `:150`) e **não
estão na regex de CE Conversões**. Devem depender do gatilho "Todos eventos
personalizados". **Vale confirmar no container** se esses quatro chegam ao
GA4 como evento — não é regressão do redesign, é um ponto cego que a leitura
expôs.

**d) Preview sem isolamento — risco demonstrado, poluição não medida.** Não
há bloqueio por hostname nos gatilhos atuais, e o filtro de Internal Traffic
do GA4 está em **TESTE**, sem isolamento confirmado. Isso demonstra que
**não existe barreira** entre o Preview e os relatórios.

O que isso **não** demonstra: que os relatórios já estejam poluídos. Para
afirmar poluição efetiva seria preciso observar, no destino, eventos com
hostname de Preview — o que não foi feito. A formulação correta é: **risco
demonstrado, efeito não medido.** Ação fora do repositório, antes ou junto
da migração; **eu não altero o container**.

### 26.2 GTM servidor `GTM-M4K3G2GK`

| Item | Leitura |
|---|---|
| Versão ativa | **5**, de **27/05/2025** |
| Conteúdo | 3 tags (Meta CAPI, GA4, TikTok EAPI), 1 cliente |
| Alterações | 0 |
| No container web | **sem `server_container_url` visível**; tags de proxy GA4 legadas pausadas |

**Conclusão, com o cuidado que eu não tive na primeira redação:** o container
de servidor existe e **não há prova de que receba tráfego do container web**.
Só isso.

Eu tinha escrito "provavelmente fora do caminho". **Retiro.** Ausência de
`server_container_url` visível no GA4 do web e uma versão de maio de 2025 não
provam que ele esteja fora do caminho: um container de servidor pode receber
de outras origens — app, backend, outro container, chamada direta ao endpoint
— e uma configuração antiga que funciona não precisa de versão nova. Idade
não é inatividade.

O que posso dizer: **o código do site envia CAPI por conta própria**
(`src/lib/meta-capi.ts`), e nada no repositório aponta para o sGTM. Se ele
também recebe, por onde, e se há dupla contagem, **continua não verificável
daqui** — exatamente como o item 9 já dizia. **Não mexer.**

### 26.3 Pipedrive — webhooks

| Webhook | Destino | Última tentativa |
|---|---|---|
| Alterar negócio | `https://cicloecommerce.com.br/api/pipedrive/webhook` | 16/10/2026 17:46, **HTTP 200** |
| Criar negócio | `https://cicloecommerce.com.br/api/pipedrive/enrich` | 16/10/2026 17:46, **HTTP 200** |

Fecha parcialmente o item 5 da seção 23: os webhooks **estão cadastrados,
apontam para o domínio de produção e respondem 200**. Isso prova resposta,
**não** processamento nem destino final.

**Correção à minha matriz:** a seção 21.2 listou só
`/api/pipedrive/webhook`. Existe um **segundo** endpoint em uso,
`/api/pipedrive/enrich`, no gatilho "Criar negócio". Ele existe no
repositório (`src/app/api/pipedrive/enrich/route.ts`) e está **byte a byte
idêntico à base** — o passo 1 da verificação cobre `src/app/api` inteiro e
ele não aparece entre as exceções. Preservado, mas eu tinha deixado de fora
do inventário.

### 26.4 Supabase — projeto `ciclo-site`

| Item | Leitura |
|---|---|
| Saúde | Healthy |
| Schema `public` | `site_visitors` (12 colunas), `site_events` (11), `conversion_events` (12) |
| RLS | ativo, **sem policies** nos três — o backend usa service role. **Não mexer** |
| Volume | 3.775 visitantes, 1.713 eventos; última navegação 17/10 16:42 UTC |
| `conversion_events` | 123 no total |
| Meta | 115 `sent`, resposta `events_received=1` sem `error.code`; 2 `skipped` em 15/09 |
| GA4 | 6 `sent` — 4 `qualify_lead` (último 02/10) e 2 `close_convert_lead` (último 18/09) |
| Meta por evento | Lead 54, ProposalSent 14, Opportunity 19, QualifiedLead 8, MeetingHeld 14, Schedule 4, Purchase 2. Último Lead 16/10 20:46 UTC |

Isto fecha dois itens da seção 23, **sobre a base `7ae962b`, não sobre o
redesign**:

- **Item 6 — PROVADO.** As três tabelas existem com o formato que o código
  espera.
- **Item 7 — PROVADO historicamente.** `qualify_lead` e `close_convert_lead`
  já dispararam, 4 e 2 vezes. Confirma a leitura da seção 21.3: o
  `close_convert_lead` de 18/09 está **fora dos últimos 28 dias**, e é por
  isso que o painel do GA4 não mostra streaming. **Ausência recente não é
  falha**, e não tem relação com o redesign.

Confirma também que a idempotência grava de fato: há linhas `skipped`, não
só `sent`.

**Ressalva, e ela é maior do que parece.** Tudo aqui é **histórico de
produção rodando `7ae962b`** — o código de antes do redesign. Um `HTTP 200`
do webhook e 115 linhas `sent` provam que **aquele** código enviou e que a
API aceitou. **Não provam nada sobre esta branch**, porque o redesign ainda
não rodou em produção e nenhum lead passou por ele.

Também não são prova de deduplicação no Gerenciador de Eventos:
`events_received=1` diz que a Meta recebeu, não que casou com o evento do
Pixel. E `HTTP 200` diz que a rota respondeu, não que processou e gravou o
que devia.

**Em uma frase: isto é linha de base, não validação do redesign.** A prova
ponta a ponta só existe depois da publicação, no teste controlado da seção
26.11.

### 26.5 Consentimento — estado herdado

O painel do GA4 diz "Bom", mas `analytics_storage`, `ad_storage`,
`ad_user_data` e `ad_personalization` estão **INATIVOS**, e "Adopt GTM" está
pausado.

**Registrado como estado herdado. Não declaro consentimento validado e não
altero nada.** É anterior ao redesign e não é afetado por ele.

### 26.6 reCAPTCHA

A descoberta da seção 21.7 — o provider carrega na home, mas nenhum
formulário chama `executeRecaptcha` nem posta para `/api/verify-recaptcha` —
fica como **dívida herdada pendente**. Instrução expressa: **não corrigir
backend global nesta migração visual.** Não toquei.

### 26.7 Correções ao roteiro da seção 24

Três ajustes, todos procedentes:

1. **E-mail interno não aprova a Meta.** `isInternalEmail` faz o CAPI
   **pular o envio de propósito** (seção 21.4). O passo 5 da minha Fase 2
   ficou ambíguo: um teste com e-mail interno prova Pipedrive, GA4, Supabase
   e atribuição, mas **não** prova Meta nem dedup. Para Meta é preciso
   e-mail fora de `INTERNAL_EMAIL_DOMAINS` — e por isso o teste exige
   coordenação explícita, não é um "lead de teste qualquer".
2. **Comparar conta, campos e pipelines continua pendente.** As 8 chaves de
   hash de `pipedrive-fields.ts` e os ids fixos de funil e etapa da
   Aplicação (`api/aplicacao/route.ts:125`) ainda não foram conferidos
   contra a conta.
3. **Retiro a frase final da seção 24.** Eu escrevi que "não existe caminho
   que feche os dez itens sem tocar em produção". Está errada: com ambiente
   dedicado — projeto próprio na Vercel e contas de teste de Pipedrive, Meta
   e GA4 — dá para fechar quase tudo antes do merge. O que **não** se pode
   fazer é copiar token de produção para o Preview. Se esse ambiente existir,
   o teste vai antes; se não existir, vai depois, coordenado.

**Nenhum teste real será executado sem coordenação explícita.**

### 26.8 Quadro atualizado dos dez itens da seção 23

| # | Afirmação | Antes | Agora |
|---|---|---|---|
| 1 | `generate_lead` chega ao GA4 | não provado | **parcial** — tag e gatilho existem e casam; o hit, não |
| 2 | Dedup Pixel/CAPI funciona | não provado | **parcial** — `eventID = DLV event_id` confirmado; efetividade, não |
| 3 | Negócio no funil e etapa certos | não provado | **não provado** |
| 4 | As 8 chaves de campo existem na conta | não provado | **não provado** |
| 5 | Webhook cadastrado e autenticando | não provado | **parcial** — 2 webhooks cadastrados, domínio certo, HTTP 200 |
| 6 | Tabelas do Supabase no formato esperado | não provado | **PROVADO** |
| 7 | `qualify_lead` e `close_convert_lead` disparam | não provado | **PROVADO** historicamente (4 e 2 envios) |
| 8 | Gatilhos por seletor continuam casando | não provado | **RESOLVIDO** — nenhuma tag usa seletor CSS |
| 9 | Container de servidor está no caminho | não verificável | **continua não verificável** — nada no repositório aponta para ele; a ausência de `server_container_url` no web não prova que esteja fora |
| 10 | Preview não polui os relatórios | não provado | **risco demonstrado, efeito não medido** — sem bloqueio de hostname e filtro em teste; poluição efetiva exigiria observar eventos no destino |

Sobram **quatro** pendências reais de integração: os itens 1, 2, 3 e 4, mais
a parte de processamento do 5. Os itens 9 e 10 não são pendências de
integração: o 9 continua não verificável daqui e o 10 é um risco de
configuração, a tratar no container.

**Nenhum item desta tabela vale como validação do redesign.** O que está
provado é o comportamento da base `7ae962b` em produção. Esta branch nunca
recebeu um lead. Todas dependem de acesso a conta, não de
código.

### 26.9 Autorização e gates — atualizado

Em 17/10, 14:31 de Brasília, o Flávio autorizou que a **revisão técnica
independente coordene a migração** quando considerar seguro, depois de tudo
terminado e corrigido, com validação completa pós-publicação. **Não é preciso
novo OK dele.**

**Isso não libera publicar agora.** O que muda é quem dá a liberação, não o
que precisa estar pronto antes. Gates revisados:

| # | Gate | Estado |
|---|---|---|
| 1 | Produção não avançou, ou a branch foi rebaseada | A conferir no dia |
| 2 | `verificar.sh` verde no SHA exato — hoje 13 passos, 32 checagens | **Verde** |
| 3 | Crawl sem destino quebrado | **Verde** |
| 4 | 7 páginas pendentes refeitas | **Pendente** — `/ofatorm`, `/ecomshift`, `/consultoria-para-e-commerce`, `/consultoria-ecom-shift`, `/aplicacao`, `/link-bio`, `/obrigado` |
| 5 | Gatilhos do GTM por seletor conferidos | **RESOLVIDO** (26.1) |
| 6 | Imagem do Mamô substituída, ou aceite da pendência | **Pendente** — depende de arquivo novo do Flávio |
| 7 | Fallback do podcast honesto | **Concluído** (seção 25) |
| 8 | Correções de UX, links e imagens | **Pendente** |
| 9 | Isolamento do Preview nos relatórios, ou aceite do risco | **Pendente**, fora do repositório (26.1 d) |
| 10 | SHA final revisado e rollback pronto | **Pendente** — candidato final com evidências, para liberação técnica |

Rollback inalterado: **Promote** do deployment `Hb5TEUapVasyUCm9amGRnRzDyAhe`,
`7ae962bad1758ef0c77e775af6a683e7e5a0e280`. Sem force-push, sem reset, sem
apagar deployment, sem trocar plano.

### 26.10 Validação pós-publicação

Além dos sete passos da seção 16.5, a conferência precisa cobrir, na ordem:
rotas, conteúdo, SEO, responsivo, formulários, atribuição, GTM, GA4, Meta,
Pipedrive, Supabase, **podcast** e cron. Regressão crítica em qualquer um
deles → volta para a versão anterior pelo Promote.

Acréscimos ao roteiro, por causa desta rodada:

- **Podcast:** confirmar que o HTML servido traz episódio real com
  JavaScript desligado, e que a lista veio da API e não do snapshot — se vier
  do snapshot, a chave não está respondendo em produção.
- **`/api/pipedrive/enrich`:** confirmar que o webhook "Criar negócio"
  continua recebendo 200 depois do deploy. É o endpoint que eu tinha deixado
  de fora do inventário.
- **Os quatro eventos de etapa** (`aplicacao_step_*`, `link_bio_step_*`):
  confirmar se chegam ao GA4 pelo gatilho "Todos eventos personalizados".

### 26.11 O que falta de material ou acesso, dito na cara

Para não marcar como aprovado o que não é:

| Falta | Quem destrava |
|---|---|
| Conferir as 8 chaves de campo e os ids de funil/etapa contra a conta do Pipedrive | acesso à conta |
| Dedup no Gerenciador de Eventos da Meta | acesso à conta |
| Hit real de `generate_lead` no GA4 | teste coordenado |
| `mamo.jpg` com pelo menos 1100px de largura (hoje 399×501) | arquivo do Flávio |
| `gringa.jpg` em resolução maior, desejável | arquivo do Flávio |
| Isolamento do Preview nos relatórios | alteração no container, **que eu não faço** |
| Ambiente dedicado para teste antes do merge | decisão de infraestrutura |

**Playbook permanece congelado.**

---

# Candidato final — 17/10/2026

## 27. O que está pronto para revisão técnica

### 27.1 Identificação

| Item | Valor |
|---|---|
| Branch | `claude/redesign-ciclo-2026-HVyvT` |
| Último commit de **código** | `b5a45dcf0a61a79624f4f128ba0243da046ade40` |
| Preview desse commit | https://ciclo-dl2o-khob0pt76-flavioberaldos-projects.vercel.app · **success** |
| Produção, revalidada hoje | `7ae962bad1758ef0c77e775af6a683e7e5a0e280` — **não avançou** |

Commits das páginas: `ac58a47` (/ofatorm), `af7b8b9` (/ecomshift),
`7e3b63c` (/consultoria-para-e-commerce), `9df6eff` (as quatro últimas),
`8684981` (UX das páginas de formulário), `3c5d176` (as três correções de
frontend e o tempo limite do podcast — **este quebrou o build no Preview**,
ver 27.10), `e0f5bc2` (a correção do gerador; Preview verde) e `b5a45dc`
(bug da Gringa, teste dos webhooks e plano de migração).

**Sobre o SHA a liberar.** Mantenha esta regra, e não o número de um commit
antigo — foi assim que a seção ficou com `8684981` desatualizado por três
rodadas:

> O **último commit de código** está na tabela acima. Qualquer commit depois
> dele nesta branch toca só `docs/`. Confira antes de liberar com
> `git diff --stat <último commit de código>..HEAD`: se só aparecer `docs/`,
> o SHA a liberar é o HEAD e o Preview da tabela mostra o mesmo site. Se
> aparecer qualquer outro caminho, a tabela está velha — me avise.

### 27.2 Inventário de cascas, rota por rota

Todas as rotas públicas estão no design 2026. Conferido arquivo por arquivo.

| Rota | Casca |
|---|---|
| `/` | 2026 |
| `/blog` e `/blog/[slug]` | 2026 |
| `/servicos/[slug]` (19) | 2026 |
| `/solucoes/[slug]` (4) | 2026 |
| `/tiktok-shop` | 2026 |
| `/depoimentos` | 2026 |
| `/ofatorm` | 2026 |
| `/ecomshift` | 2026 |
| `/consultoria-para-e-commerce` | 2026 |
| `/consultoria-ecom-shift` | 2026 |
| `/mapa-do-site` | 2026 |
| `/politica-de-privacidade` | 2026 |
| `/obrigado` | 2026 |
| `/aplicacao` | 2026, sem cabeçalho do site — é página de formulário, como já era |
| `/link-bio` | idem |
| `/playbook-social-commerce` | **intocado, de propósito** |
| `/keystatic` | painel do CMS, fora do escopo |

**Nenhuma página importa mais o cabeçalho antigo.**

### 27.3 Evidências no SHA do candidato

| Verificação | Resultado |
|---|---|
| `verificar.sh comparar` | **19 passos, tudo verde** |
| 1 · Camada protegida | 41 arquivos, nenhuma mudança não autorizada; 5 exceções registradas e impressas |
| 2 · Typecheck e lint | typecheck limpo; lint sem erro novo |
| 3 · Build | verde, 883 páginas |
| 4 · Rotas | 17 rotas em 200 |
| 5 · Playbook | **idêntico** em desktop e celular, por impressão digital de fontes, estilo computado e três estados |
| 6 · Mensuração | eventos e payloads **idênticos** nos quatro formulários |
| 7 · Internas | 22 páginas com conteúdo, URLs e SEO preservados |
| 8 · Blog | listagem e 87 artigos preservados |
| 9 · Tipografia | 18 rotas: Inter na estrutura, Playfair em 27 frases editoriais |
| 10 · h1 | 38 páginas com um h1 só, começando pelo título |
| 11 · Serviços encerrados | dois 308 sem laço nem cadeia |
| 12 · TikTok Shop | conteúdo, SEO e schema preservados |
| 13 · Podcast | episódio real no HTML servido, sem depoimento reetiquetado |
| 14 · ECOM Shift | `begin_checkout` idêntico nos dois `placement`; vídeos no player interno |
| 15 · Formulários em etapas | etapas, conversão, **idempotência** e `/obrigado` sem contagem dupla |
| 16 · Responsivo | 11 rotas sem estouro horizontal em 1440 e 390 |
| 17 · Indicadores de case | 9 indicadores inteiros e dentro da célula em 7 cenários (320 a 1440, texto a 150% e 200%), em 3 rotas |
| 18 · Podcast no servidor | API, episódio novo, **tempo limite medido em 3501ms**, cota, sem chave, só Shorts, sem snapshot e gerador com descrição real |
| 19 · Webhooks do Pipedrive | autenticação, filtros, etapas, ganho, idempotência, v1/v2, enrich e **11 arquivos byte a byte iguais à base** |
| Crawl | **0 destinos quebrados, 0 âncoras sem alvo** (eram 3) |
| Diff protegido vs produção | só os 5 arquivos autorizados |
| `content/` vs produção | **sem diferença** — nenhum artigo novo a preservar |

Nos passos 14 e 15 a rede fica interceptada e `/api/*` é respondida por mock:
**nenhum lead foi criado em lugar nenhum**, nem de teste.

### 27.4 Gates

**Aprovados — o que eu consigo provar daqui:**

| # | Gate | Como foi fechado |
|---|---|---|
| 1 | Produção não avançou | `git rev-parse origin/claude/elegant-darwin-HVyvT` = `7ae962b`, igual à base |
| 2 | Suíte verde no SHA exato | 17 passos |
| 3 | Crawl sem destino quebrado | 0 quebrados, 0 âncoras órfãs |
| 4 | 7 páginas pendentes refeitas | todas |
| 5 | Gatilhos do GTM por seletor | resolvido pela leitura do container (26.1) |
| 7 | Fallback do podcast honesto, com tempo limite e teste determinístico | seções 25 e 27.8 |
| 10 | Plano de rollback escrito, com a prova de **commit** feita | 27.5 — a prova de **deployment** não é minha |

**Bloqueados — nenhum depende de código:**

| # | Gate | Estado | Quem destrava |
|---|---|---|---|
| 6 | `mamo.jpg` em resolução maior (hoje 399×501) | **estético, não crítico** | arquivo do Flávio |
| 8 | Isolamento do Preview nos relatórios | risco demonstrado, efeito não medido | alteração no container, **que eu não faço** |
| 9 | Revisão técnica independente do SHA exato | **pendente** | a sua. Este gate é só seu: nada que eu faça o fecha |
| 11 | Rollback disponível na Vercel | **parcial** — o deployment existe, Ready/Production/Current; a operação de Promote **nunca foi executada nem testada** | leitura do painel e, se quiserem certeza, um ensaio |

**NÃO VALIDADO — evidência de integração bloqueada.**

Isto não é nota de rodapé: são gates abertos, e nenhum deles tem evidência
hoje. **Nada abaixo foi provado para esta branch.** O que existe é o
histórico da base `7ae962b` rodando em produção (26.4), que é linha de base,
não validação.

| # | O que precisa ser provado | Por que está bloqueado | Requisito concreto |
|---|---|---|---|
| 12 | `generate_lead` chega ao GA4 a partir desta branch | O hit depende do container e de credencial que o Preview não tem | Um envio real, com o Assistente de Tags aberto, no domínio de produção ou em ambiente dedicado |
| 13 | Negócio criado no Pipedrive no funil e etapa certos | Sem token no Preview | `PIPEDRIVE_API_TOKEN` válido em ambiente de teste, ou envio em produção |
| 14 | As 8 **chaves** de campo de atribuição existem na conta | Os 8 **nomes** foram confirmados na revisão de 17/10; as chaves de hash, não | Leitura de campos personalizados na conta do Pipedrive |
| 15 | `consultoria_ecom_shift_lead` chega ao GA4 | Nunca houve streaming desse evento (26) | Um envio real pela `/aplicacao` |
| 16 | Dedup Pixel/CAPI pelo mesmo `event_id` **neste candidato** | A cobertura de 100% vista no Events Manager é da base, em janela de 7 dias, com amostra de 1 navegador + 1 servidor. E a lista de permissão não tem `vercel.app`, o que impede o teste de Pixel no Preview | Gerenciador de Eventos aberto, no domínio real, com os dois envios do mesmo `event_id` |
| 17 | Linha gravada no Supabase a partir desta branch | Sem credencial no Preview | Consulta a `conversion_events` depois do envio |
| 18 | Webhook do Pipedrive processa, não só responde 200 | `HTTP 200` prova resposta, não processamento | Mudança de etapa real seguida de leitura de `conversion_events` |

Os requisitos de identidade, janela e limpeza desse teste estão em 27.6.
**Nenhum deles é desbloqueável por código, e eu não executo nenhum sem
coordenação explícita.**

### 27.5 Rollback, revalidado hoje

| Item | Valor |
|---|---|
| Versão de retorno | `7ae962bad1758ef0c77e775af6a683e7e5a0e280` |
| Deployment a promover | `Hb5TEUapVasyUCm9amGRnRzDyAhe` · `ciclo-dl2o-93six9eyy` |
| Como | **Promote** no painel da Vercel: imediato, sem build |
| Alternativa | `git revert` do merge — mais lento, dispara build |
| O que **não** fazer | force-push, reset, apagar deployment, trocar plano |

**Duas provas diferentes, e eu só tenho uma delas.** Eu tinha escrito
"disponibilidade conferida por `git fetch`", e isso estava errado:

| Prova | O que mostra | Quem fez |
|---|---|---|
| **De commit** | A branch de produção aponta para `7ae962b`. Conferido por mim agora, com `git fetch` + `git rev-parse` | **eu** |
| **De deployment** | O build `Hb5TEUapVasyUCm9amGRnRzDyAhe` continua existindo na Vercel, íntegro e promovível | **não eu.** Só se vê no painel |

`git fetch` prova que o **código** de retorno existe e qual é. Não prova que
há um build pronto para promover: um deployment pode ter sido removido, ter
expirado por política de retenção, ou estar num estado que não aceita
Promote. Nesse caso o rollback deixa de ser imediato e vira `git revert` com
build novo — minutos em vez de segundos.

Na revisão de 17/10 o painel foi lido de forma independente e confirmou
produção em `7ae962b` / `Hb5TEUapVasyUCm9amGRnRzDyAhe`. **Essa é a prova de
deployment, e ela tem data.** Antes de publicar, vale reconfirmá-la no dia:
é a diferença entre rollback de segundos e rollback de minutos.

**Gate 11 fica aberto até essa releitura.**

O rollback restaura o código. **Não desfaz** o que tiver sido gravado em
sistema externo no intervalo — lead no Pipedrive, evento no GA4 e no Meta,
linha no Supabase. Por isso a janela de validação pós-deploy é curta.

### 27.6 O que falta para o teste real controlado

Registrado sem inventar identidade e sem usar e-mail interno como prova de
Meta.

| Falta | Por quê | Quem destrava |
|---|---|---|
| Uma identidade de teste combinada — nome, e-mail e telefone de alguém do time, **fora** de `INTERNAL_EMAIL_DOMAINS` | Com e-mail interno o CAPI pula o envio de propósito; o teste provaria Pipedrive, GA4, Supabase e atribuição, mas **não** a Meta nem a dedup | decisão do time; **não invento dado de pessoa** |
| Janela combinada e time avisado | O teste cria um negócio real no funil e hits reais nos relatórios | coordenação |
| Acesso de leitura ao Gerenciador de Eventos da Meta | Único lugar onde a dedup por `event_id` se confirma | conta Meta |
| Acesso ao Pipedrive para conferir as 8 chaves de campo e os ids de funil/etapa da Aplicação | Hoje só sei que o código as usa, não que existem na conta | conta Pipedrive |
| Decisão sobre ambiente dedicado | Com projeto próprio e contas de teste, quase tudo fecha **antes** do merge. Sem ele, só depois | infraestrutura |
| Combinação de como limpar | Arquivar o negócio de teste e registrar `event_id` e `deal_id` usados | coordenação |

**Nenhum teste real será executado sem coordenação explícita.**

### 27.7 Pendências, separadas por natureza

A distinção importa: uma lista impede publicar, a outra não.

**A. Bloqueios de integração — sem evidência, impedem declarar a mensuração
validada.** São os gates 12 a 18 da seção 27.4. Nenhum é desbloqueável por
código; todos exigem conta, credencial ou um envio real coordenado. Até lá, o
estado correto de GA4, Meta, Pipedrive e Supabase **nesta branch** é
**NÃO VALIDADO** — não "provavelmente ok".

**B. Risco de configuração — fora do repositório.**

| Pendência | Situação |
|---|---|
| Preview sem isolamento nos relatórios | Risco demonstrado, efeito não medido. Resolver no container, **que eu não altero** |
| Consentimento: os quatro sinais inativos | Estado herdado, registrado, não alterado |
| Rollback disponível na Vercel | Prova de deployment é leitura de painel, com data. Ver 27.5 |

**C. Estética não crítica — não impede publicar.**

| Pendência | Situação |
|---|---|
| `mamo.jpg` 399×501 num cartão de 546px | A imagem amplia. Depende de arquivo novo do Flávio; `gringa.jpg` maior também seria bom. **Não bloqueia** |
| Miniaturas de Líquido e KVRA caem para `hqdefault` | `maxresdefault` não existe no YouTube para esses dois vídeos. Limite da origem, não do código. **Não bloqueia** |

**D. Dívida herdada — anterior ao redesign, fora deste escopo.**

| Pendência | Situação |
|---|---|
| reCAPTCHA carrega e nenhum formulário verifica | **Não corrigida nesta migração**, por instrução expressa |
| 340 artigos do WordPress com hierarquia de títulos irregular | Herdada. 739 órfãos de link interno, idem |
| ISR de `/blog/[slug]` em 900s | Recomendação de subir para 6h permanece, não aplicada |

**E. Limpeza adiada por decisão de escopo.**

| Pendência | Situação |
|---|---|
| `LeadForm`, `CasesSection`, `PodcastSection` e quatro `interactive.tsx` órfãos | Nenhuma página os importa. Commit de limpeza à parte, **não misturado** com a revisão das páginas |

### 27.8 Podcast: o que está provado e o que não está

**Correção.** Eu tinha escrito que a conferência independente "prova que a
busca no servidor funciona". **Não prova.** Ver episódio real na tela não
distingue API de snapshot: as duas fontes servem episódio real, e hoje elas
coincidem — o snapshot foi gravado dos mesmos últimos episódios. O que a
conferência prova é que **o HTML servido traz episódio real e miniatura boa**,
que já é o que o checkpoint se propunha a corrigir.

Como a arquitetura mudou — a busca passou a rodar dentro da renderização da
página —, ela trouxe riscos novos que mereciam teste próprio. Passo 17 novo,
`docs/redesign/podcast-servidor.mjs`, que ataca `buscarEpisodios()` direto com
o `fetch` global trocado por mock. Nenhuma chamada sai.

| Caso | Resultado medido |
|---|---|
| API responde | `origem: 'api'`, lista vinda da API |
| **Episódio novo numa chamada seguinte** | a 2ª chamada traz o episódio novo; a função não guarda nada por conta própria |
| **API trava** | `AbortSignal.timeout(3500)` corta; medido: desistiu em **3501ms** e caiu para o snapshot |
| Cota estourada (403) | snapshot |
| Sem `YOUTUBE_API_KEY` | snapshot, e **nenhuma chamada sai** |
| Resposta só com Shorts | snapshot; nenhum Short entra na lista |
| Sem API e sem snapshot | `origem: 'vazio'` → a página mostra indisponível com link do canal |
| Conteúdo do snapshot | nenhum vídeo de depoimento, nenhuma data de marcador 2024-01-01 |

**O tempo limite é a parte que mais importa** e não existia antes: sem ele,
uma API lenta seguraria a regeneração da home até o limite da plataforma.
São três chamadas em série, então o pior caso é ~10,5s antes de cair para o
snapshot.

**O que este teste NÃO prova, e continua pendente:**

| Pendência | Por quê |
|---|---|
| Que a janela de 600s do cache de dados do Next se comporta como esperado | É do framework. O mock prova que a função não cacheia por conta própria; a janela em si só se observa com o tempo passando |
| Que a home mostra um episódio novo até 15 min depois de o canal publicar | **Teste temporal.** Exige um episódio novo real e observação ao longo do tempo |
| Que a `YOUTUBE_API_KEY` responde em produção | Esta sessão não alcança `googleapis.com`. Se a lista exibida empatar com o snapshot do build por vários dias depois de o canal publicar, a chave não está respondendo |
| Se o `signal` muda o comportamento do cache de dados do Next | A documentação só diz que ele desliga a **memoização** por render. O efeito no cache persistente não está documentado e não consigo medir daqui sem rede |

Os três primeiros entram no roteiro pós-publicação.

### 27.9 Correções desta rodada

Pedidas na revisão independente de `e917a54`.

**Frontend:**

| # | O que estava errado | Correção |
|---|---|---|
| 1 | `/obrigado` tinha um link único "Mercado Livre, Shopee e Amazon" apontando **só** para o Mercado Livre | Três links separados: `/servicos/mercado-livre-ads`, `/servicos/shopee-ads`, `/servicos/amazon-ads` |
| 2 | `/obrigado` repetia `+300` e `+R$ 350MM` em dois blocos seguidos | Os dois saíram do bloco "Nossa história", que ficou com `2015 · Fundação da Ciclo` e `4 · Pilares do método`. Nenhum número se perdeu: os dois continuam na faixa logo acima, e o texto ao lado repete "mais de 300 marcas" por extenso. Conferido no HTML: cada indicador aparece **uma vez** |
| 3 | O rodapé do kit não levava à Política de Privacidade | Entrou na faixa legal do `CicloFooter`, presente em toda página com o rodapé do site. Playbook intocado |

**Relatório:**

| # | O que estava errado | Correção |
|---|---|---|
| 4 | Gate 10 aparecia como aprovado dizendo "SHA final revisado", e o gate 9 dizia que a revisão estava pendente | Gate 10 virou "plano de rollback escrito"; a revisão independente é o gate 9, **só seu**. E os gates 12 a 18 passaram a registrar a evidência de integração como **NÃO VALIDADO**, dentro da matriz, com o requisito concreto de cada um — não mais numa nota |
| 5 | "Disponibilidade conferida por `git fetch`" | `git fetch` é prova de **commit**. A prova de **deployment** é leitura de painel e não é minha. Separadas em 27.5, com o gate 11 aberto |
| 6 | 27.8 dizia que ver conteúdo real prova a busca pela API | Não prova: snapshot também serve episódio real, e hoje os dois coincidem. Reescrita, com o passo 17 novo cobrindo tempo limite, cota, sem chave, só Shorts, sem snapshot e episódio novo numa chamada seguinte — e dizendo o que continua pendente |

**Limpeza de órfãos não foi misturada**, como pedido.

### 27.10 Um erro meu, e como ele passou

O primeiro commit desta rodada, `3c5d176`, **quebrou o build no Preview**.
Registro porque o modo de falha é instrutivo.

**O que eu fiz.** Para o teste do passo 17 conseguir importar o snapshot fora
do Next, troquei `src/data/youtube-videos.json` por um módulo `.ts`. O
gerador em `scripts/fetch-youtube.js` passou a escrever esse módulo montando
as strings na unha, escapando só barra invertida e aspa simples.

**Por que quebrou.** Descrição de vídeo do YouTube tem **quebra de linha** —
e aspas, e emoji. Uma quebra de linha dentro de literal de string é erro de
sintaxe. O primeiro episódio real derrubava o `next build`.

**Por que não apareceu aqui.** Sem `YOUTUBE_API_KEY`, o gerador nem roda:
imprime "mantendo o snapshot atual" e sai. Local passava verde todas as
vezes. O Preview tem a chave, roda o gerador de verdade, e quebrou.

**É exatamente o tipo de coisa que o meu relatório não pegava**: eu dizia
"build verde, 883 páginas" sem distinguir *build com o gerador rodando* de
*build com o gerador pulando*.

**Correção, em três camadas:**

1. O gerador passou a usar `JSON.stringify` em cada valor. Literal JSON é
   literal JavaScript válido e escapa quebra de linha, aspas, barra e emoji.
2. O passo 17 ganhou um caso que roda o gerador com uma descrição hostil —
   quatro linhas, aspas dos dois tipos, barra invertida e emoji — escreve o
   módulo e **importa de volta**, conferindo que o conteúdo sobrevive ao ida
   e volta. Esse caso falha se alguém voltar a montar string na unha.
3. Reproduzi a falha do jeito que a Vercel a produz: gerei o snapshot com
   descrição real, rodei `tsc --noEmit` e o `next build` inteiro, e os dois
   passaram. Depois restaurei o snapshot limpo.

**O que isso diz sobre o candidato:** a suíte local não cobre o passo do
build que depende de variável de ambiente que só existe na plataforma. A
prova de que esse passo funciona continua sendo **o deployment verde**, não
a minha suíte.

---

# Quinta rodada — 17/10, bug da Gringa, webhooks e plano

## 28. Correção do indicador que vazava

**Bug real, confirmado nos dois lados.** No cartão da Gringa, "120→55 dias"
saía para fora do cartão: célula de 124px, `scrollWidth` 162px, corpo de
29px e `white-space: nowrap`.

**Por que acontecia.** `.case-results` é grade de colunas iguais. A Gringa é
o único case com **três** resultados, então cada célula fica com um terço. E
é o único valor com unidade por extenso. Os dois juntos estouravam.

**Correção, sem esconder nada** — nada de `overflow: hidden`, reticências ou
número abreviado:

1. A unidade sai do corpo grande e vira palavra menor ao lado
   (`ValorDeCase`). O texto lido continua "120→55 dias"; `src/lib/cases.ts`
   não mudou.
2. O número segue inquebrável, mas a unidade pode descer de linha em vez de
   empurrar tudo para fora.
3. O corpo encolhe quando há três resultados, e encolhe de novo conforme a
   largura do cartão, por **container query** — é a largura do cartão que
   manda, não a da janela.

**Medição, passo 17 novo** (`docs/redesign/cases-indicadores.mjs`). Mede por
**elemento**, não pela página: `scrollWidth` maior que `clientWidth` da
própria célula já reprova, que era o caso que passava batido.

| | |
|---|---|
| Larguras | 320, 390, 768, 1024, 1440 |
| Ampliação de texto | 150% em 1440 e **200% em 390** |
| Rotas | `/`, `/obrigado`, `/consultoria-ecom-shift` |
| Resultado | **9 indicadores inteiros e dentro da célula nos 7 cenários, nas 3 rotas** |

Depois da correção, no cartão da Gringa: célula 140px e `scrollWidth` 140px
em 1440; 82px e 82px em 390.

**Um segundo achado, do mesmo teste.** Em 390px com texto a 200%, um chip de
canal do diagrama do E-com Shift passava 7px da tela — o espaçamento dele é
em `rem` e dobra junto com o texto. Corrigido com uma regra escopada à
página 2026; a folha do `.shift` em si não foi tocada.

## 29. Webhooks do Pipedrive, provados em isolamento

Os seis arquivos já estavam byte a byte iguais à base — a revisão
independente conferiu o conteúdo integral e eu conferi o hash. Mas arquivo
igual não é comportamento provado, e esta é a mensuração que mais importa
preservar.

**Passo 19 novo** (`docs/redesign/pipedrive-webhooks.mjs`). Carrega as rotas
reais com o `fetch` global trocado por mock. **Nenhuma chamada sai, nenhum
registro real é movido, nenhum contato inventado é usado** — os e-mails são
`@exemplo.test`, domínio reservado, e as variáveis recebem valores de
mentira marcados como tal.

Os resultados esperados saem do **código da base**, não de regra inventada.

| Caso | Esperado, pelo código | Resultado |
|---|---|---|
| Sem segredo | 401, e nada é consultado | ok |
| Basic `pipedrive:<segredo>` | 200 | ok |
| Mudança de título | ignorada, sem buscar o negócio | ok |
| `previous` sem a chave `stage_id` (v2 manda só o que mudou) | não conta como mudança de etapa | ok |
| **Etapa não qualificadora** (10, ordem 2 < 3) | **sem** `qualify_lead`; só `Schedule` na Meta | ok |
| **Funil fora da regra** (7) | **nenhum** evento de lead no GA4 | ok |
| Etapa 11 do funil 2 | `qualify_lead` + `QualifiedLead` | ok |
| Pulou para Proposta (ordem 4 > 3) | `qualify_lead` também + `ProposalSent` | ok |
| Etapa 96 do funil 13 | `qualify_lead` + `Opportunity` | ok |
| **Ganho sem qualify anterior** | `qualify_lead` + `close_convert_lead` + `purchase` + `Purchase`; **sem** evento de funil por etapa | ok |
| **Ganho depois de já ter qualificado** | `qualify_lead` **não repete** (`already_sent`); `close_convert_lead` vai | ok |
| Mesmo webhook duas vezes | conta uma vez; grava em `conversion_events` com plataforma, evento e `deal_id` | ok |
| Ganho sem `ga_client_id` | `purchase` **não** vai ao GA4 (`no_ga_client_id`); `Purchase` da Meta vai | ok |
| Payload v2 | lido igual ao v1 | ok |
| `/enrich` sem segredo | 401 | ok |
| `/enrich` com evento que não é `added.deal` | ignorado, nada sai | ok |
| As 8 chaves de atribuição | os mesmos 8 campos, com hash de 40 caracteres | ok |
| **Hashes contra a base `7ae962b`** | **11 arquivos byte a byte iguais** | ok |

Os 11: as duas rotas de webhook, `ga4-lead-events`,
`pipedrive-funnel-events`, `pipedrive-server`, `pipedrive-fields`,
`meta-capi`, `attribution`, `conversions`, `supabase-server` e
`webhook-auth`.

**O que isto prova e o que não prova.** Prova que a **regra** sobreviveu ao
redesign, com cada ramo exercitado. **Não prova** que a conta do Pipedrive, o
GA4 e a Meta respondem como o mock — isso são os gates 12 a 18, e continuam
**NÃO VALIDADOS**.

## 30. Evidência externa desta rodada

| Fonte | O que mostrou | O que NÃO mostrou |
|---|---|---|
| Meta Events Manager, dataset `780524645411912` | `Lead` ativo, score 9,3/10, navegador + CAPI, cobertura de `eventID` 100% na janela de 7 dias | **Nada sobre este candidato.** É histórico da base. A amostra citada é de 1 evento de navegador e 1 de servidor |
| Lista de permissão da Meta | `cicloecommerce.com.br` e subdomínios, **sem `vercel.app`** | Impede o teste de Pixel de navegador no Preview. **Não prova isolamento** de CAPI nem de GA4 |
| Alerta de domínios externos na Meta | Existe | **Sem nexo demonstrado** com o redesign |
| Pipedrive | Os **8 nomes** dos campos de atribuição existem | As **chaves** ainda não foram conferidas — gate 14 segue aberto |
| Vercel, deployments | `Hb5TEUapVasyUCm9amGRnRzDyAhe` existe, Ready, Production, Current, em `7ae962b` | **A operação de Promote nunca foi executada nem testada** |
| Vercel, variáveis | 13 variáveis **somente em Production**; YouTube em Production + Preview | Ver 30.1 — isto muda o caminho da publicação |
| Vercel, cron | Habilitado, `/api/cron/site-digest`, `0 12 * * *`, plano Hobby com janela de 1h | Histórico do horário de hoje fora da retenção; **Run não foi executado** |
| Comparação dos 6 arquivos, base × candidato | Todos idênticos | Revalidar no SHA final — e o passo 19 agora faz isso sozinho, com 11 arquivos |

### 30.1 Promote de Preview não é publicação

Treze variáveis de ambiente existem **somente em Production**. Um artefato
de Preview foi compilado sem elas.

**Consequência direta:** a publicação precisa gerar um **build novo de
Production** pelo fluxo da branch `claude/elegant-darwin-HVyvT`. Promover o
artefato de Preview não publica o site — publica uma versão sem Pipedrive,
sem Meta CAPI, sem Supabase e sem GA4 Measurement Protocol.

Isso também explica, de forma definitiva, por que **teste real em Preview
não equivale a produção**: o Preview não tem com o que falar.

Para o rollback a lógica é a mesma, e a favor: `Hb5TEUapVasyUCm9amGRnRzDyAhe`
**é** um artefato de Production, então Promote ali é válido.

Está tudo em `docs/redesign/PLANO-MIGRACAO.md`, seções 4 e 8.

## 31. Plano de migração versionado

`docs/redesign/PLANO-MIGRACAO.md`, primeira versão. Cobre: pré-requisitos,
inventário URL antiga → final com status e indexação, as duas remoções
autorizadas com os 308 conferidos, variáveis preservadas, sequência da
publicação, verificação pós-publicação com evidência correlacionada por
evento e horário, o que falta combinar para o teste real, e o rollback com a
distinção entre prova de commit e prova de deployment.

A **mudança funcional do podcast está separada da troca visual** na seção
1.1, com os commits que a isolam.

**O playbook está no plano como item de pré-requisito**, e o passo 5 da
suíte cobre efeito indireto de CSS e de componente compartilhado — ele mede
o que o navegador aplicou, não o que o arquivo diz.

---

# Sexta rodada — 17/10, a correção da Gringa estava errada

## 32. Eu consertei o estouro quebrando os números

A revisão independente reprovou `b5a45dc`, e com razão. **Todos** os números
dos cases estavam saindo a **10px, peso 500, na cor cinza da legenda, em
`display: block`** — o `strong` em volta tinha 29px, mas o nó com os dígitos,
não.

### 32.1 A causa

A folha do kit tem uma regra de legenda:

```css
.ciclo2026 .case-results span { display:block; font-size:10px; color:#827681; margin-top:6px }
```

Ela foi escrita para o rótulo, e pega **qualquer** `span` dentro do bloco.
Quando eu envolvi o número num `<span class="valor-numero">` para separar a
unidade, o número virou legenda.

### 32.2 Por que o meu teste não pegou

**Porque eu media o elemento errado.** O teste olhava o `font-size` do
`strong` e o estouro da célula. O `strong` continuava com 29px. E o estouro
tinha sumido — mas pelo motivo errado: um número de 10px cabe em qualquer
lugar.

Ou seja: a correção anterior passou no teste **porque o defeito que ela
introduziu mascarava o defeito que ela deveria corrigir**. É o pior tipo de
verde.

### 32.3 Correção

**No CSS:**

- `.valor-numero` e `.valor-unidade` passam a herdar fonte, peso, cor,
  espaçamento e entrelinha do `strong`, em `display: inline`. Só a unidade
  encolhe, para `.5em`, e só porque "dias" ao lado de "120→55" no mesmo corpo
  não caberia.
- A regra de legenda que eu mesmo tinha escrito na container query passou a
  ser `> div > span`: **só o rótulo, que é filho direto da célula.** O span
  do número vive dentro do `strong` e deixou de ser alcançável.
- Em cartão estreito a grade **quebra** em vez de espremer: `auto-fit` com
  mínimo em `em`, ancorado no corpo do próprio número. Texto ampliado faz o
  mínimo crescer e sobra uma coluna a menos — em vez de o número vazar. A
  divisória vertical sai quando quebra, porque linha em pé no começo de uma
  linha nova não quer dizer nada.
- Último recurso, só para ampliação extrema: o número pode quebrar em vez de
  sair pela borda. Em tamanho normal ele nunca quebra, porque cabe.

**No teste** — e esta é a parte que importa mais que a correção:

| Agora mede | Antes |
|---|---|
| `font-size`, peso e cor **no nó que contém os dígitos** | só o `strong` em volta |
| Número **maior** que a legenda, em toda célula | nada |
| Número **sem a cor** da legenda | nada |
| Número **não mais leve** que a legenda | nada |
| Nenhum número abaixo de 14px (escalado pela ampliação) | nada |
| Estouro por célula, nos 7 cenários e 3 rotas | isto já existia |
| **Captura de tela** do cartão de três resultados, desktop e celular | nada |

A simulação de ampliação de texto também foi corrigida: agora escala **o
contêiner da grade junto com o número**, que é o que o navegador faz. Antes
escalava só o número, o que era mais severo que a realidade e escondia a
adaptação da grade.

### 32.4 Medido depois

| | Antes da correção | Depois |
|---|---|---|
| Número na home | 10px / peso 500 / `rgb(130,118,129)` / block | **29px** / peso 500 / `rgb(29,29,27)` / inline |
| Número na Gringa | 10px | **23px** |
| Unidade "dias" | 11,5px na cor da legenda | 11,5px **na cor do número** |
| Legenda | 10px / peso 400 / cinza | igual, inalterada |

Suíte: **19 passos verdes**, com o passo 17 agora reprovando este defeito se
ele voltar.

## 33. O que a revisão confirmou nesta rodada

| Item | Resultado |
|---|---|
| Delta de produção de `b5a45dc` | lido por inteiro; as mudanças extras do podcast são só comentários de numeração de teste |
| Playbook em `e0f5bc2` × produção | **63 elementos iguais** em conteúdo, estilo computado e geometria, em desktop e 390px, depois do cache da fonte. A diferença do primeiro carregamento vem do `display: optional` do Inter e some no reload |
| Produção e rollback | `Hb5TEUapVasyUCm9amGRnRzDyAhe`, Ready, Current, em `7ae962b` — reconfirmados |
| Erro documental em 27.1 | corrigido, e a frase virou **regra** em vez de número fixo, que foi o que a deixou desatualizada por três rodadas |

O novo candidato precisa manter os 63 elementos do playbook idênticos. O
passo 5 da suíte continua medindo exatamente isso, nas mesmas duas larguras.

**A validação da entrega real de eventos continua separada da preservação de
código**, e segue NÃO VALIDADA — gates 12 a 18.
