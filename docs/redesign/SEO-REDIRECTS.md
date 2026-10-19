# Auditoria de SEO do Search Console — mapeamento e triagem

**19/10/2026.** Patch mínimo na branch de trabalho, **não publicado**.
Produção revalidada em `c6ae9c0298ae222832f4006dbca05f0adb0c47b1` antes de
começar, e nada aqui a altera.

Nenhum lead criado, nenhuma mensuração tocada, nenhuma ação manual no
Search Console.

---

## 1. O que eu medi antes de mexer

Tudo o que segue foi medido contra a **árvore do commit**, servida em
`127.0.0.1:3100`. **É local, não é o domínio.**

| | Antes do patch |
|---|---|
| Regras literais de redirect em `next.config.ts` | **135** |
| Origens que terminavam em 404 | **0** |
| **Cadeias com mais de um salto** | **4** |
| Laços | 0 |
| URLs no sitemap | **856** |
| Bloqueio global no robots | **não existe** |

As 856 URLs batem com o "Processado em 18/10 com 856 URLs" da auditoria
independente — mesmo número, duas leituras diferentes.

Os cinco 404 confirmados na inspeção individual **reproduziram localmente**,
com e sem barra. A barra no fim não muda nada: o Next normaliza `/rota/` para
`/rota` e só então olha as regras.

---

## 2. Os 404 — origem, destino e por quê

Nenhum destes era post: **não estão em `wp-slugs.json` nem em
`wp-posts.json`** (777 posts). Eram páginas do WordPress antigo. Não havia
artigo para restaurar, e **nenhum artigo foi inventado**.

| Origem (404 confirmado) | Destino | Por que esse |
|---|---|---|
| `/google-ads-para-e-commerce-impulsione-suas-vendas-com-ciclo-e-commerce` | `/servicos/google-ads` | Mesma família de `/meta-ads-para-e-commerce-…` e `/tiktok-ads-para-e-commerce-…`, que **já** apontam para o serviço do canal. A página existe, responde 200 e tem canonical próprio |
| `/gestao-de-trafego-pago-para-e-commerce-aumente-suas-vendas` | `/solucoes/captacao-de-demanda` | "Tráfego pago" não é um canal, é o conjunto. Essa solução é a página que reúne Google, Meta, TikTok, Mercado Livre, Shopee e Amazon Ads — equivalente mais próximo e **específica**, não um hub |
| `/marketing-para-loja-de-semijoias-aumente-suas-vendas-com-ciclo-e-commerce` | `/consultoria-para-e-commerce` | Landing page por segmento. O site novo **não tem página por segmento**, então não existe equivalente exato; o destino é a oferta comercial completa, que responde à mesma intenção |
| `/marketing-para-loja-de-suplementos-…` | `/consultoria-para-e-commerce` | idem |
| `/marketing-para-loja-de-papeis-de-parede-…` | `/consultoria-para-e-commerce` | idem |

### Uma inconsistência que eu NÃO resolvi sozinho

As **12 irmãs** dessa última família — pet, móveis, DTC, acessórios,
alimentação saudável, joias, moda, roupas infantis, cosméticos, calçados,
decoração e moda infantil — **já apontavam para `/`** antes deste patch.

Mandei as três novas para `/consultoria-para-e-commerce` porque é mais
específico que a home, e foi o que vocês pediram. Isso deixa a família
dividida.

**Recomendação, para decisão de vocês:** alinhar as 12 para
`/consultoria-para-e-commerce` também. **Não fiz** porque mexe em URLs que
não estão na lista de 404 e saía do patch mínimo. Se a resposta for o
contrário — que a home é o destino certo para segmento — então são as três
novas que mudam. Qualquer das duas é uma linha por URL.

---

## 3. Dois defeitos que a medição achou, fora da lista de 404

### 3.1 Cadeia de dois saltos terminando no canal errado

```
/gestao-de-amazon-ads-…  →  /servicos/retail-media  →  /servicos/mercado-livre-ads
/gestao-de-shopee-ads-…  →  /servicos/retail-media  →  /servicos/mercado-livre-ads
```

`/servicos/retail-media` **não é página**: é outra origem de redirect. Então
eram dois saltos, e uma URL de **Amazon** terminava em **Mercado Livre**.

Os serviços por canal existem e respondem 200, então agora:

| Origem | Antes | Agora |
|---|---|---|
| `/gestao-de-amazon-ads-…` | `retail-media` → `mercado-livre-ads` | **`/servicos/amazon-ads`**, um salto |
| `/gestao-de-shopee-ads-…` | `retail-media` → `mercado-livre-ads` | **`/servicos/shopee-ads`**, um salto |

### 3.2 Podcast legado ia para o blog

`/podcast/:path*` apontava para `/blog`. Os episódios de "O Fator M" vivem em
**`/ofatorm`** — o blog é outro conteúdo. Corrigido, e `/podcast` sem caminho
(que não tinha regra) passou a ser coberto.

**Importante, sobre o relatório:** `/podcast/:path*` **já estava em produção**
(entrou no checkpoint 3.2, e está no `c6ae9c0`). Medido localmente, `/podcast`,
`/podcast/qualquer-coisa` e slug percent-encoded **com emoji** respondem 308 e
terminam em 200. Ou seja: os 404 de `/podcast/` do relatório agregado são
**anteriores à regra** — o relatório está atrasado até 11/10, como vocês
apontaram. **Não era defeito aberto**; o que mudou foi o destino, que estava
topicamente errado.

---

## 4. robots.txt — o que o Search Console viu

A GSC listou **4 arquivos de fonte em `_next/static/media` bloqueados** e
nenhum bloqueio global. **A causa está no repositório**, e confere:

```ts
// src/app/robots.ts, antes
disallow: ['/api/', '/obrigado', '/_next/', '/static/', '/keystatic']
```

`Disallow: /_next/` bloqueia **fonte, CSS e JS**. Sem esses arquivos o Google
renderiza a página sem tipografia e sem layout — e avalia algo que não é o
site.

Corrigido com um `Allow` mais específico, que ganha do `Disallow` genérico:

```
Allow: /
Allow: /_next/static/
Disallow: /api/
Disallow: /obrigado
Disallow: /_next/
Disallow: /static/
Disallow: /keystatic
```

O resto de `/_next/` (chunks internos, dados de build) **continua fora**, e
`/api/`, `/obrigado`, `/static/` e `/keystatic` seguem bloqueados.
**Não há bloqueio global, nem antes nem depois.**

---

## 5. `/aplicacao` e as outras páginas noindex

A intenção foi **preservada, não removida**. Nada foi alterado aqui; o teste
apenas passou a afirmar o estado:

| Rota | `robots` servido |
|---|---|
| `/aplicacao` | `noindex, follow, nocache` |
| `/link-bio` | `noindex, nofollow, nocache` |
| `/obrigado` | `noindex, nofollow` |
| `/` e `/consultoria-ecom-shift` | `index, follow` |

As três noindex **não estão no sitemap**, conferido. É coerente: página de
conversão não se indexa, e `follow` em `/aplicacao` mantém o repasse de link.

---

## 6. Triagem do resto do relatório

O relatório agregado está **atrasado até 11/10** e é anterior à migração de
17/10. Isso muda a leitura de quase tudo.

| Item do relatório | Triagem |
|---|---|
| **67 URLs em 404** | 5 confirmados na inspeção individual, **mapeados e resolvidos** (seção 2). **Faltam os 62 restantes** — a lista completa vem de vocês. O mecanismo e o teste já estão prontos: cada URL nova é uma linha |
| **266 crawled, não indexadas** | **Não é erro.** É decisão do Google sobre conteúdo que ele viu. Dois dos citados — Amazon Ads e `/blog/por-que-investir-em-facebook-ads` — **já aparecem indexados** na inspeção individual, o que mostra o atraso do agregado. **Nada a corrigir no código**: o caminho é re-solicitar validação e esperar o recrawl |
| **10 descobertas, não rastreadas** | Idem. Fila de rastreamento, não defeito. O sitemap já foi processado com as 856 |
| **6 vídeos excluídos** | O motivo é **"não são páginas de exibição de vídeo"** (relatório de 14/10): os vídeos vivem embutidos, não em páginas dedicadas. **Isso não justifica mexer em layout nem no playbook**, e nada foi mexido. Se um dia quiserem indexação de vídeo, é schema `VideoObject` em página própria — **fora deste escopo** |
| **4 arquivos de fonte bloqueados** | **Corrigido** (seção 4) |
| **Home, UGC, consultoria passam no teste ao vivo** | Confere com o que medi: canonical próprio, 200 |

---

## 7. O que o teste afirma — passo 24 da suíte

`docs/redesign/seo-redirects.mjs`, sem rede externa e sem criar nada:

1. **toda origem literal** de `next.config.ts` termina em **200** — nenhuma aponta para 404;
2. em **um salto**, fora a normalização de barra que o Next faz sozinho;
3. **nenhum laço**;
4. os **cinco 404 confirmados** deixaram de ser 404, com e sem barra;
5. o **destino tem canonical próprio**, não o da origem;
6. quem era **noindex continua noindex**;
7. o **robots** libera `/_next/static/` e mantém o resto bloqueado, sem bloqueio global;
8. o **sitemap** responde 200, tem as 856 URLs e **não lista** origem de redirect nem página noindex.

### Depois do patch

| | Antes | Depois |
|---|---|---|
| Regras literais | 135 | **139** |
| Origens em 404 | 0 | **0** |
| **Cadeias com mais de um salto** | **4** | **0** |
| Laços | 0 | **0** |
| 404 confirmados resolvidos | 0 de 5 | **5 de 5** |
| URLs no sitemap | 856 | **856** |

---

## 8. Limites

- **É local, não é o domínio.** O proxy desta sessão recusa
  `cicloecommerce.com.br`. O que está provado é o que o código responde, não o
  que a borda da Vercel entrega.
- **Não executei nada no Search Console** — nem validação, nem remoção, nem
  reindexação. Isso é de vocês.
- **Faltam 62 das 67 URLs.** Sem a lista, não há como mapear destino
  comprovado; e **não vou adivinhar slug**.
- **Nenhuma correção aqui faz o Google reindexar.** Redirect e robots mudam o
  que ele encontra na próxima passada; o calendário é dele.
- A escolha de destino das três landing pages por segmento é **julgamento**,
  não medição, e está aberta na seção 2 para vocês decidirem.
