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
