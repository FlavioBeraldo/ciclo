# Auditoria de SEO do Search Console — inventário e correções

**19/10/2026.** Patch na branch de trabalho, **não publicado**. Produção
revalidada em `c6ae9c0298ae222832f4006dbca05f0adb0c47b1` antes de começar, e
nada aqui a altera.

Nenhum lead criado, nenhuma mensuração tocada, nenhuma ação no Search Console.

As três listas vieram do DOM da GSC em 19/10 e estão guardadas como
evidência em `docs/redesign/gsc/`:

| Arquivo | Linhas |
|---|---|
| `not-found-67.txt` | 67 |
| `crawled-not-indexed-266.txt` | 266 |
| `discovered-10.txt` | 10 |

**O relatório agregado não é o estado atual.** Ele mostra o que o Google viu
na última passada. Por isso cada URL foi medida contra a árvore deste commit:
`docs/redesign/gsc/classificar.mjs` pede a URL ao servidor local, segue a
cadeia e registra categoria, estado verificado e se existe conteúdo original
no acervo. A saída bruta está em `docs/redesign/gsc/inventario.tsv`, 343
linhas, uma por URL.

---

## 1. Inventário — estado verificado depois do patch

| Lista | 200 direto | Redirect → 200 | **404** | Fora do repo |
|---|---|---|---|---|
| `not_found` (67) | — | **61** | **4** | 2 |
| `crawled_not_indexed` (266) | **109** | **154** | **3** | — |
| `discovered` (10) | **10** | — | — | — |

**Os 7 que continuam em 404 são todos da mesma família, e é decisão** —
seção 3. Os 2 fora do repo são outros subdomínios — seção 6.

### Por categoria

| Categoria | Qtde | Estado | Ação |
|---|---|---|---|
| `post-do-blog` (200 direto) | 109 | responde 200, canonical próprio | **nenhuma** — página real, só não indexada |
| `pagina-wp-avulsa` → `/blog/<slug>` | ~100 | redirect de um salto para o artigo | **nenhuma** — conteúdo preservado |
| `podcast-episodio` | 41 | redirect → `/ofatorm` | destino corrigido (era `/blog`) — seção 4 |
| `taxonomia-wp` (`/categoria`, `/tag`, `/author`) | 43 | redirect → `/blog` | **nenhuma** — seção 5 |
| `paginacao` (`/page/N`, `?page=`) | 12 | redirect → `/blog`, ou 200 | **nenhuma** — seção 5 |
| `landing-de-servico` | 6 | redirect → serviço/solução | **2 corrigidas** — seções 2 e 3 |
| `landing-por-segmento` | 19 | 12 → `/`, **7 em 404** | **404 mantido** — seção 3 |
| `url-com-parametro` (`fbclid`, `?amp`, `utm`) | 7 | 200 ou redirect | **1 corrigida** — seção 2 |
| `pagina-de-servico` / `pagina-de-solucao` | 5 | 200 direto | **nenhuma** — seção 7 |
| `solucao-wp-antiga`, `case-wp-antigo` | 3 | redirect → 200 | nenhuma |
| `arquivo-de-midia`, `asset` | 2 | redirect / 200 | nenhuma |
| `subdominio-fora-do-repo` | 2 | não medido | **fora de escopo** — seção 6 |

---

## 2. O que foi corrigido, e por quê

Só onde havia **equivalente comprovado**.

| Origem | Destino | Fundamento |
|---|---|---|
| `/google-ads-para-e-commerce-impulsione-suas-vendas-com-ciclo-e-commerce` | `/servicos/google-ads` | Mesma família de `/meta-ads-para-e-commerce-…` e `/tiktok-ads-para-e-commerce-…`, que **já** apontavam para o serviço do canal. Canal idêntico, página existe |
| `/gestao-de-trafego-pago-para-e-commerce-aumente-suas-vendas` | `/solucoes/captacao-de-demanda` | "Tráfego pago" é o conjunto de canais, não um canal. Essa solução reúne Google, Meta, TikTok, Mercado Livre, Shopee e Amazon Ads, com a mesma intenção comercial |
| `/retail-media-para-e-commerce-amplie-suas-vendas-com-ciclo-e-commerce` | `/solucoes/captacao-de-demanda` | Mesma leitura: retail media no site são Mercado Livre, Shopee e Amazon Ads, todos nessa solução. **Estava em 404 e não aparecia na lista dos 67** — apareceu ao classificar os 266 |
| `/blog/como-atrair-clientes` | `/blog/como-atrair-clientes-qualificados-para-o-e-commerce` | **O artigo existe no acervo**, só mudou de slug. Preserva o conteúdo original em vez de mandar para a listagem |
| `/gestao-de-amazon-ads-…` | `/servicos/amazon-ads` | Era cadeia de dois saltos para `/servicos/retail-media`, que **não é página**, e terminava em Mercado Livre. Uma URL de Amazon caía no canal errado |
| `/gestao-de-shopee-ads-…` | `/servicos/shopee-ads` | Idem |
| `/podcast` e `/podcast/:path*` | `/ofatorm` | Era `/blog`. Seção 4 |

**Nenhuma regra genérica nova foi criada.** `/podcast/:path*` e
`/upload/:path*` já existiam; só o destino do podcast mudou, e `/podcast`
sem caminho (que não casava com o curinga) ganhou regra própria.

---

## 3. Landing por segmento — 404 mantido, e é decisão

São 19 URLs no padrão `marketing-para-{loja-de-X, DNVBs, marcas-nativas}`.
**Sete estão em 404 e vão continuar.**

**O fundamento é o acervo, não opinião.** Busca em `wp-posts.json` (777
posts) por conteúdo do segmento:

| Segmento | Artigos no acervo |
|---|---|
| semijoias · papéis de parede · joias · cosméticos · decoração · acessórios · roupas infantis · móveis · saúde e bem-estar · DNVB | **0** |
| suplementos · calçados · alimentação | 1 cada, e são **estudo de caso**, não conteúdo de segmento |
| moda · luxo · DTC | 2 a 10, todos **artigos temáticos**, não oferta comercial por segmento |

O site novo **não tem página por segmento**. Então não existe destino que
responda ao que a pessoa buscou. Mandar para a home ou para a consultoria
seria empurrar para uma página genérica — padrão que o Google trata como
**soft 404**, e que não é melhor que o 404 honesto.

**Eu havia mandado três dessas para `/consultoria-para-e-commerce` no patch
anterior. Reverti.** A regra que vocês deram — "prefira manter 404 quando não
houver substituto convincente" — se aplica exatamente aqui, e o acervo
confirma que não há.

O teste tem um bloco só para isso (`2a`), para ninguém "consertar" por
reflexo depois.

### As 12 irmãs que apontam para a home

`marketing-para-loja-{pet, de-moveis, de-acessorios, de-alimentacao-saudavel,
de-joias, de-moda, de-roupas-infantis, de-cosmeticos, de-calcados,
de-decoracao, de-moda-infantil}` e `marketing-para-e-commerce-dtc` redirecionam
para `/` **desde antes desta auditoria**.

Pelo mesmo raciocínio acima, elas também deveriam ser revistas. **Não entram
neste patch**: remover redirect que já está em produção é decisão de vocês, e
muda URLs que hoje respondem 200. Fica recomendado, não feito.

---

## 4. Podcast — 41 URLs, e o que realmente existe

**Nenhum episódio existe como página, em lugar nenhum.** Busca por
`roi-com-cast` em `wp-posts.json`: **zero posts**. Não há conteúdo original
para preservar e não existe página de episódio no site novo.

**`/ofatorm` é o mesmo programa.** Duas evidências: 15 posts do acervo citam
"ROI Com Cast" no corpo, e a página de "O Fator M" declara **+250 episódios** —
numeração que engloba os episódios 05 a 123 do ROI Com Cast. É o mesmo podcast
sob o nome atual, então a página do podcast é o equivalente mais próximo.

**Tentei casar episódio com artigo do acervo e descartei.** O casamento
automático por palavras do título produz acerto em alguns casos e absurdo em
outros:

| Episódio | Artigo sugerido | Veredito |
|---|---|---|
| `…chatgpt-vai-matar-o-google-tera-impacto-no-e-commerce…` | `chatgpt-vai-matar-o-google-o-impacto-da-ia-no-e-commerce` | plausível (0,62) |
| `…vinicius-fagundes-como-estruturar-programa-de-fidelidade…` | `como-estruturar-um-programa-de-fidelidade-para-e-commerce-na-pratica` | plausível (0,67) |
| `…flavio-e-felipe-crm-para-e-commerce-na-pratica…` | `ma-para-e-commerce-guia-completo-sobre-fusoes-e-aquisicoes` | **absurdo** (0,40) |
| `…nathalia-alecrim-omnichannel-para-vender-mais…` | `estrategias-para-tiktok-no-e-commerce` | **absurdo** (0,38) |

Um artigo sobre o mesmo tema **não é o episódio**. Mandar o visitante para um
artigo que só parece relacionado seria inventar equivalência. **Não fiz.**

**O limite, dito:** quem procurava um episódio específico chega à página do
podcast, não ao episódio. O episódio não existe. Se vocês preferirem 404 para
episódio, é trocar uma linha — e o argumento a favor do 404 é legítimo.

---

## 5. Taxonomia e paginação — 55 URLs para `/blog`

`/categoria/*`, `/tag/*`, `/author/*`, `/page/N` e `/blog/page/N` caem todos em
`/blog`, por regras com curinga que já existiam.

**Não corrigi, e registro a ressalva:** ~55 URLs convergindo para uma página
só é o padrão que o Google costuma classificar como soft 404. Pode estar
contribuindo para a fila de "rastreada, não indexada" dessas URLs
específicas — **não medi isso, é hipótese**. A alternativa seria reconstruir
arquivos de categoria e autor no site novo, o que é projeto de conteúdo, não
patch de redirect. **Fora deste escopo.**

---

## 6. O que está fora do repositório

| URL | Por quê |
|---|---|
| `https://conteudo.cicloecommerce.com.br/` | Outro subdomínio. **Não é servido por este código** — nenhum redirect daqui alcança |
| `https://materiais.cicloecommerce.com.br/playbook-construa-um-e-commerce-epico-para-conversao` | Idem. Provável landing de ferramenta de materiais |

Resolver qualquer um dos dois é DNS ou configuração na plataforma que serve o
subdomínio. **Não toquei, e não dá para tocar daqui.**

---

## 7. Os quatro serviços da lista "descobertas" — sem defeito de código

Conferido no HTML servido, **sem requisição nova à GSC**:

| Serviço | Sitemap | Links internos | Estado |
|---|---|---|---|
| `/servicos/tiktok-ads` | **sim** | 3 em 5 rotas + mapa do site | 200, canonical próprio |
| `/servicos/shopee-ads` | **sim** | 3 | 200, canonical próprio |
| `/servicos/pinterest-ads` | **sim** | 2 | 200, canonical próprio |
| `/servicos/amazon-ads` | **sim** | 3 | 200, canonical próprio |

Os 17 serviços aparecem em `/mapa-do-site`. **Nada a corrigir**: estão no
sitemap, têm link interno, respondem 200 e permitem indexação. O que falta é
o rastreamento, e vocês já solicitaram — indexação aceita para tiktok-ads,
shopee-ads e pinterest-ads, amazon-ads indexada em 16/10. **Não repeti
nenhuma solicitação.**

---

## 8. robots.txt

A GSC listou **4 arquivos de fonte em `_next/static/media` bloqueados** e
nenhum bloqueio global. A causa está no repositório:

```ts
disallow: ['/api/', '/obrigado', '/_next/', '/static/', '/keystatic']
```

`Disallow: /_next/` cobre fonte, CSS e JS. **O bloqueio é fato; o efeito dele
na renderização eu NÃO medi** — ninguém viu o render anterior do Googlebot, e
eu não vou afirmar prejuízo que não foi observado. A razão de liberar é a
orientação do próprio Google, de não bloquear recurso necessário para
renderizar.

```
Allow: /
Allow: /_next/static/
Disallow: /api/ · /obrigado · /_next/ · /static/ · /keystatic
```

`Allow` mais específico ganha do `Disallow` genérico, então o resto de
`/_next/` continua fora. Sem bloqueio global, antes ou depois.

---

## 9. `/aplicacao` e as páginas noindex

Intenção **preservada, não removida**. Nada alterado; o teste passou a afirmar:

| Rota | `robots` |
|---|---|
| `/aplicacao` | `noindex, follow, nocache` |
| `/link-bio` | `noindex, nofollow, nocache` |
| `/obrigado` | `noindex, nofollow` |
| `/` e `/consultoria-ecom-shift` | `index, follow` |

As três **não estão no sitemap**, conferido.

---

## 10. Vídeos

As 6 exclusões são **vídeos complementares dentro de artigos**, não páginas de
episódio — o YouTube embutido em `/blog/gateway-de-pagamento-vs-intermediadores-de-pagamento`,
`/blog/7-ajustes-para-aumentar-as-vendas-no-e-commerce` e outros quatro.

**Artigos e layout preservados**, nada tocado. Indexação de vídeo exigiria
`VideoObject` em página dedicada — **fora deste escopo**.

---

## 11. O que o teste afirma — passo 24

`docs/redesign/seo-redirects.mjs`, sem rede externa:

1. toda origem literal de `next.config.ts` termina em **200**;
2. em **um salto**, fora a normalização de barra do Next;
3. **nenhum laço**;
4. **2a** — as landings por segmento **continuam em 404**, de propósito;
5. os 404 **com equivalente comprovado** resolvem, com e sem barra;
6. o podcast resolve, inclusive slug percent-encoded **com emoji**;
7. o destino tem **canonical próprio**;
8. quem era **noindex continua noindex**;
9. robots libera `/_next/static/` e mantém o resto, sem bloqueio global;
10. sitemap com **856 URLs**, sem origem de redirect nem página noindex.

| | Antes | Depois |
|---|---|---|
| Regras literais | 135 | **138** |
| Cadeias com mais de um salto | **4** | **0** |
| Laços | 0 | 0 |
| URLs das 3 listas em 404 | 11 | **7**, todas deliberadas |
| URLs no sitemap | 856 | 856 |

---

## 12. Limites

- **É local, não é o domínio.** O proxy desta sessão recusa
  `cicloecommerce.com.br`. Está provado o que o código responde, não o que a
  borda entrega.
- **Não executei nada na GSC** — nem validação, nem reindexação.
- **Ausência de indexação não prova defeito, e eu não afirmo o contrário.**
  Classifiquei as 266: 109 respondem 200 e 154 redirecionam certo — para essas
  não encontrei defeito de código; **3 estavam em 404** e uma foi corrigida, as
  outras duas por decisão. A hipótese das 55 de taxonomia está na seção 5,
  marcada como hipótese.
- **O efeito do bloqueio de `/_next/` não foi medido.**
- **Nenhuma correção faz o Google reindexar.** O calendário é dele.
- Os dois subdomínios **não são alcançáveis daqui**.
