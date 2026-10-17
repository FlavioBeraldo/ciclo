# Verificação depois da migração — 17/10/2026

**Rótulo, e ele vale para o documento inteiro: isto é LOCAL, não é
ponta a ponta.** O que está aqui foi medido contra a **árvore exata do
merge**, servida em `127.0.0.1:3100`. Prova o que o código entrega. **Não**
prova o que o domínio responde: não cobre DNS, CDN, cabeçalho de borda,
redirect de plataforma, nem nenhuma integração real.

A inspeção do domínio e dos painéis é da revisão independente.

---

## 1. O que foi publicado

| Item | Valor |
|---|---|
| Merge SHA | `df452e315b4a33fc67a5f8e782a07c0f53570a94` |
| Hora do merge | **17/10/2026, 20:29:23 BRT** |
| Deployment de Production | `7147282117` (GitHub) · `9wDAEozub4kNH11R6dsnRDmo1YjX` (Vercel) |
| Ready | **20:30:50 BRT**, Current, com domínio atribuído |
| SHA aprovado que entrou | `2dc1b31121cb285c6ea63b14702b285fead7173f` |
| Árvore | `fc601cf18310833d7976eaeea15abfaa3e7f82fc` — **idêntica** entre `2dc1b31` e o merge |
| Caminho | **merge pela branch → build novo de Production.** Nenhum Promote de artefato Preview |

O merge foi enviado com `sha=2dc1b31…` na chamada, então a API só o aceitaria
se o head fosse exatamente o aprovado. Base conferida em `7ae962b` no mesmo
instante, `mergeable_state: clean`, árvore de trabalho limpa, nenhum código
novo acrescentado depois da liberação.

## 2. O bloqueio de rede, dito como é

A rede desta sessão **recusa o domínio**, com 403 de política no CONNECT:

```
cicloecommerce.com.br:443       — 403 (policy denial)
www.cicloecommerce.com.br:443   — 403
*.vercel.app (inclusive o de Production) — 403
```

É o mesmo bloqueio que me impediu de abrir qualquer Preview durante toda a
construção. **Portanto: não executei crawl, SEO, sitemap, robots, imagens,
podcast nem checagem de erro no domínio real, e nada disso está relatado
como verificado.**

O que eu sei do domínio vem só da API do GitHub: o deployment de Production
está `success` e é o mais recente do repositório.

## 3. Suíte completa na árvore do merge

`bash docs/redesign/verificar.sh comparar` — **19 passos, tudo verde.**

| Passo | Resultado |
|---|---|
| 1 Camada protegida | 40 arquivos; só os 5 autorizados mudaram, cada um com motivo impresso |
| 2 Typecheck e lint | limpo; sem erro novo |
| 3 Build | verde, 883 páginas |
| 4 Rotas | 17 em 200 |
| 5 **Playbook** | **idêntico** em desktop e 390px |
| 6 Mensuração | eventos e payloads idênticos nos quatro formulários |
| 7–8 Conteúdo e SEO | 22 internas e 87 artigos preservados |
| 9 Tipografia | 18 rotas |
| 10 h1 | 38 páginas, um h1 cada, começando pelo título |
| 11 Rotas encerradas | dois 308 sem laço nem cadeia |
| 12 TikTok Shop | conteúdo, SEO e schema preservados |
| 13 Podcast | episódio real no HTML servido |
| 14 ECOM Shift | `begin_checkout` idêntico nos dois `placement` |
| 15 Formulários em etapas | etapas, conversão, idempotência, `/obrigado` sem contagem dupla |
| 16 Responsivo | 11 rotas sem estouro em 1440 e 390 |
| 17 Indicadores de case | 9 indicadores, 7 cenários, 3 rotas, medidos no nó dos dígitos |
| 18 Podcast no servidor | tempo limite, cota, sem chave, só Shorts, sem snapshot |
| 19 Webhooks do Pipedrive | regras e **11 arquivos byte a byte iguais à base** |

## 4. Crawl

| | |
|---|---|
| Páginas visitadas | 859 |
| Destinos internos distintos | 158 |
| **Destinos quebrados** | **0** |
| **Âncoras sem alvo** | **0** |
| Páginas órfãs | 739 — arquivo do WordPress, dívida herdada |
| Hierarquia de títulos | 340 — artigos do WordPress, dívida herdada |

As duas últimas linhas são anteriores ao redesign e estão registradas como
dívida desde a auditoria.

## 5. URLs, redirects e SEO

**Sitemap:** 856 URLs, a mesma contagem da base.

**robots.txt:** inalterado — `Disallow` em `/api/`, `/obrigado`, `/_next/`,
`/static/`, `/keystatic`, e os dois sitemaps declarados.

**As três páginas que já eram fora do índice continuam fora:**

| Rota | meta robots | No sitemap |
|---|---|---|
| `/obrigado` | `noindex, nofollow` | não |
| `/aplicacao` | `noindex, follow, nocache` | não |
| `/link-bio` | `noindex, nofollow, nocache` | não |

**As duas remoções autorizadas:**

| Rota antiga | Status | Destino | Destino responde |
|---|---|---|---|
| `/servicos/processos-playbooks` | **308** | `/solucoes/inteligencia-e-operacao` | 200 |
| `/servicos/growth-continuo` | **308** | `/solucoes/inteligencia-e-operacao` | 200 |

Um salto só, sem cadeia e sem laço.

**Canonical:** conferido em 12 rotas por amostragem; todas apontam para
`https://cicloecommerce.com.br` + o próprio caminho, nenhuma faltando.

## 6. Erros de servidor

| Verificação | Resultado |
|---|---|
| 37 rotas públicas (home, blog, 19 serviços, 4 soluções, especiais, playbook) | **todas 200**, nenhuma fora disso |
| `/api/youtube/latest` | 200 |
| `/api/pipedrive/webhook` sem segredo | **401**, como deve |
| `/api/pipedrive/enrich` sem segredo | **401**, como deve |
| Rota inexistente | **404** |
| Log do servidor | **0 erros** |

## 7. Imagens

**585 referências a imagem local em 10 rotas; 0 arquivo faltando.**

Pendência estética já conhecida, que a publicação não muda: `mamo.jpg` tem
399×501 num cartão de 546px, e os depoimentos de Líquido e KVRA não têm
`maxresdefault` no YouTube. Nenhuma das duas bloqueia.

## 8. Evidência independente no domínio — 17/10, 20:33 a 20:47 BRT

Não é minha: veio da revisão independente, que tem alcance ao domínio e aos
painéis. Registro aqui para o relatório ficar completo, **com a classificação
de cada item**.

### 8.1 Aprovado

| Item | Resultado |
|---|---|
| 38 rotas abertas no domínio | 1 h1 cada, sem estouro horizontal, sem imagem quebrada, sem âncora local ausente |
| Canonical nas indexáveis | correto |
| `/link-bio`, `/aplicacao`, `/obrigado` | seguem `noindex` |
| **Playbook** | **63 elementos idênticos** em DOM, estilo computado e geometria, baseline × produção, em desktop 1397 e mobile 390. Comparação móvel repetida na mesma aba contra o deployment antigo |
| Gringa | legível e dentro das células, em produção e no celular |
| Menu móvel | abre e fecha com Escape |
| Depoimento Mamô | abre o diálogo com o iframe certo |
| Tag Assistant, ambiente **LIVE** | `GTM-5NNPNZ`, GA4 `G-EY1FLE5C0J`, Ads `AW-975154282`; 7 tags base concluídas no `gtm.js`, sem erro no console |
| GA4 em tempo real | 38 páginas, 54 `page_view`, 2 `link_bio_step_view` |
| Supabase desde 23:30:50Z | 49 `page_view` posteriores — a telemetria está gravando depois da migração |
| Logs do deployment, últimos 30 min | Warning 0, Error 0, Fatal 0 |

### 8.2 NÃO aprovado — e não pode ser classificado como tal

| Item | Estado | Por quê |
|---|---|---|
| **Conversão ponta a ponta** | **NÃO VALIDADO** | GA4 em tempo real mostra **zero eventos principais**. Nenhum lead foi enviado — por decisão, não por falha. Sem envio não há o que validar |
| `conversion_events` no Supabase | **sem linha nova** | Coerente com o acima. O histórico (115 Meta sent, 6 GA4 sent, 2 skipped) está intacto, e é da base |
| **Entrega real dos webhooks do Pipedrive** | **NÃO PROVADA** | Os 2 webhooks seguem nos mesmos endpoints, mas a última tentativa continua sendo **16/10 17:46, HTTP 200** — anterior à migração. Nada foi entregue depois dela |
| **Cron** | **NÃO VALIDADO** | A próxima execução natural de `0 12 * * *` ainda não aconteceu. Não foi executado à mão, e não deve ser |
| Status Code nos logs da Vercel | em conferência | — |

**O que o conjunto permite afirmar:** o site responde, as tags carregam no
ambiente ativo, a telemetria passiva grava, e nada quebrou. **O que ele não
permite afirmar:** que uma conversão percorre o caminho inteiro. Isso só com
um envio real coordenado, e ele não aconteceu.

## 9. Podcast: a URL pública e como saber a origem

### 9.1 URL exata

```
https://cicloecommerce.com.br/api/youtube/latest
```

Método `GET`, pública, **sem token**. Devolve um array de episódios com
`id`, `title`, `description`, `publishedAt`, `thumbnail` e `url`.

### 9.2 Procedimento read-only para separar API de fallback

Quatro sinais, do mais barato ao decisivo. **Nenhum usa token, nenhum
escreve nada.**

**Sinal 1 — o cabeçalho `Cache-Control`. É o mais direto.**

A rota emite cabeçalho diferente conforme a origem. Medido em isolamento,
com o `fetch` mockado:

| Origem | `cache-control` emitido |
|---|---|
| **API do YouTube respondeu** | `public, s-maxage=600, stale-while-revalidate=600` |
| **Caiu para o snapshot** | `public, s-maxage=3600` |

Como ler, com um parâmetro qualquer para escapar do cache da borda:

```
curl -sS -D - -o /dev/null "https://cicloecommerce.com.br/api/youtube/latest?cb=$RANDOM"
```

Olhe três cabeçalhos: `cache-control` (o sinal), `x-vercel-cache` (`MISS`
indica resposta vinda da origem, não do CDN) e `age` (0 numa resposta
fresca).

**Ressalva honesta:** a borda da Vercel pode reescrever ou normalizar o
`cache-control` antes de devolver. Se o que chegar não for nenhuma das duas
formas acima, o sinal 1 não serve e vale ir ao 2.

**Sinal 2 — o campo `description`.**

No snapshot que está no repositório, **todas as descrições são vazias**. O
gerador do build preenche descrição quando a chave responde.

```
curl -sS https://cicloecommerce.com.br/api/youtube/latest \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d),'episódios;', sum(1 for e in d if e['description'].strip()),'com descrição')"
```

| Resultado | Leitura |
|---|---|
| **0 com descrição** | É o snapshot do repositório. **Nem o gerador do build nem a API em execução trouxeram dado** — sinal forte de que a chave não está respondendo |
| **Algumas com descrição** | A chave respondeu em algum momento — no build ou em execução. Ainda não diz qual |

**Sinal 3 — comparar com o snapshot publicado.**

```
git show df452e315b4a33fc67a5f8e782a07c0f53570a94:src/data/episodios-fator-m.ts | grep -oE "id: \"[^\"]+\"" 
```

Compare com os `id` que a rota devolve.

| Resultado | Leitura |
|---|---|
| **Ids diferentes** | Veio da **API em execução** — prova positiva |
| Ids iguais | Inconclusivo: a API pode estar devolvendo os mesmos oito |

**Sinal 4 — temporal. É o decisivo.**

Depois de o canal publicar um episódio novo, **sem deploy novo**, pedir a
rota de novo. Se o episódio novo aparecer, a busca em execução está
funcionando. Se a lista continuar igual ao snapshot por dias depois de uma
publicação, a chave não está respondendo em produção.

Janelas esperadas: a rota cacheia 600s no caminho da API, a home revalida a
cada 900s e `/ofatorm` a cada 3600s.

### 9.3 O que eu medi daqui, e por que não vale para produção

A rota local devolveu 8 episódios com `cache-control: public, s-maxage=3600`
— o cabeçalho do fallback. **Era inevitável**: esta sessão não alcança
`googleapis.com`, então a busca sempre cai para o snapshot. Não diz nada
sobre produção.

## 10. O que continua NÃO VALIDADO

Depois da evidência da seção 8, o quadro ficou mais preciso — e mais curto,
mas nenhum item virou "aprovado":

| Item | Estado |
|---|---|
| Site responde, tags carregam no ambiente ativo, telemetria passiva grava | **confirmado** pela revisão independente (8.1) |
| **Conversão ponta a ponta** — `generate_lead` → GA4, Meta com dedup, negócio no Pipedrive com os 8 campos, linha em `conversion_events` | **NÃO VALIDADO.** Zero eventos principais no GA4, nenhuma linha nova em `conversion_events`. Não houve envio |
| **Entrega real dos webhooks** do Pipedrive depois da migração | **NÃO PROVADA.** Última tentativa continua 16/10 17:46 |
| **Cron** `/api/cron/site-digest` | **NÃO VALIDADO.** Próxima execução natural ainda não ocorreu. Não executar à mão |
| **Podcast: API ou snapshot em produção** | **NÃO DETERMINADO.** Procedimento na seção 9 |

Nada disso é falha: são verificações que dependem de um envio real
coordenado ou da passagem do tempo. **Nenhuma delas pode ser marcada como
aprovada agora.**

**Nenhum lead foi criado, nenhum registro de CRM foi movido, nenhum cron foi
executado à mão.** Nos passos 14, 15, 18 e 19 a rede fica interceptada e as
rotas `/api/*` respondem por mock.

## 11. Rollback

Inalterado e pronto: Promote do deployment `Hb5TEUapVasyUCm9amGRnRzDyAhe`,
artefato de **Production** em `7ae962b`. A operação nunca foi executada nem
testada.

Se a inspeção de domínio achar regressão: **crítica → rollback**; não
crítica → conserto restaurando o comportamento da base, que o passo 19
descreve ramo por ramo.
