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

### 8.2 Fechamento da inspeção imediata — contagens do painel

Deployment `9wDAEozub4kNH11R6dsnRDmo1YjX`, janela **20:17–20:47 BRT**:

| Código | Requisições |
|---|---|
| 200 | **478** |
| 304 | **73** |
| 204 | **56** |
| 4xx / 5xx | **nenhum na distribuição** |

Warning 0, Error 0, Fatal 0.

| Item | Resultado |
|---|---|
| Os dois redirects antigos, navegados | terminam em `/solucoes/inteligencia-e-operacao`. O **308** está confirmado localmente; no navegador se vê só o destino |
| Meta Base no GTM **LIVE** | `init 780524645411912` e `PageView`, status **Concluída** |
| GA4 em tempo real | `page_view` e `link_bio_step_view` vindos do domínio; **nenhuma conversão** |

### 8.3 Limite de ferramenta, não falha do site

O navegador da inspeção **recusou abrir** três coisas, com
`ERR_BLOCKED_BY_CLIENT`:

- `robots.txt`
- `/api/youtube/latest`
- os XML (sitemap), já bloqueados antes

`ERR_BLOCKED_BY_CLIENT` é recusa do **cliente** — extensão ou política do
navegador —, não resposta do servidor. **Não é falha comprovada do site, e
não deve ser lida como tal.** Também não vou contornar por outro mecanismo.

Consequência, dita com clareza:

| O que fica sem leitura direta externa | O que existe no lugar |
|---|---|
| `robots.txt` no domínio | Conferido localmente na árvore do merge (seção 5) |
| `sitemap.xml` no domínio | 856 URLs conferidas localmente (seção 5) |
| Frescor da API do podcast no domínio | Episódios **renderizam** na home e em `/ofatorm`, mas isso não distingue API de snapshot. Procedimento na seção 9 |

Código e verificação local aprovados **não substituem** a leitura externa.
Os três continuam **sem confirmação no domínio**.

### 8.4 NÃO aprovado — e não pode ser classificado como tal

| Item | Estado | Por quê |
|---|---|---|
| **Conversão ponta a ponta** | **NÃO VALIDADO** | GA4 em tempo real mostra **zero eventos principais**. Nenhum lead foi enviado — por decisão, não por falha. Sem envio não há o que validar |
| `conversion_events` no Supabase | **sem linha nova** | Coerente com o acima. O histórico (115 Meta sent, 6 GA4 sent, 2 skipped) está intacto, e é da base |
| **Entrega real dos webhooks do Pipedrive** | **NÃO PROVADA** | Os 2 webhooks seguem nos mesmos endpoints, mas a última tentativa continua sendo **16/10 17:46, HTTP 200** — anterior à migração. Nada foi entregue depois dela |
| **Cron** | **NÃO VALIDADO** | A próxima execução natural de `0 12 * * *` ainda não aconteceu. Não foi executado à mão, e não deve ser |
| Status Code nos logs da Vercel | **conferido** — ver 8.2 | sem 4xx/5xx na distribuição |
| **Qualificação e ganho** no Pipedrive → GA4 | **aguardando** | depende de movimento comercial real |
| **`/api/pipedrive/enrich`** depois da migração | **aguardando** | depende de negócio novo real |
| **CAPI e deduplicação** por `event_id` | **aguardando** | depende de envio real e de leitura no Gerenciador de Eventos |
| **Atribuição ponta a ponta** | **aguardando** | depende de envio real com UTM conhecida |

**O que o conjunto permite afirmar:** nos itens medidos, o site responde, as
tags carregam no ambiente ativo e a telemetria passiva grava. **Nenhuma
regressão crítica foi detectada nos itens medidos.**

**O que ele NÃO permite afirmar:** que "nada quebrou". Isso seria uma
garantia geral, e ela não existe — o que existe é uma lista de verificações
que passaram e outra, maior do que parece, do que não foi medido (8.3 e 10).
Também não permite afirmar que uma conversão percorre o caminho inteiro:
isso exige um envio real coordenado, que não aconteceu.

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
| **Cron** `/api/cron/site-digest` | **NÃO VALIDADO.** Próxima execução natural prevista para **18/10, 09–10 BRT**. Não executar à mão |
| **`robots.txt`, `sitemap.xml` e frescor da API** lidos do domínio | **SEM LEITURA DIRETA** — limite de ferramenta, não falha do site (8.3) |
| Qualificação, ganho, enrich, CAPI/dedup e atribuição ponta a ponta | **aguardando** evento real ou contato autorizado |
| **Podcast: API ou snapshot em produção** | **NÃO DETERMINADO.** Procedimento na seção 9 |

Nada disso é falha: são verificações que dependem de um envio real
coordenado, de um limite de ferramenta, ou da passagem do tempo. **Nenhuma
delas pode ser marcada como aprovada agora.**

## 10.1 Estado em uma frase

**Nenhuma regressão crítica foi detectada nos itens medidos.** Não é a mesma
coisa que dizer que está tudo certo: a lista acima é o que ainda não foi
medido, e ela não encolhe sozinha.

Próximo marco sem ação humana: a execução natural do cron, **18/10 entre 09 e
10 BRT**. Os demais dependem de evento real ou de contato autorizado.

Nenhum código novo e nenhuma migração adicional são necessários agora.

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

---

# 12. Teste real ponta a ponta — 17/10, 21:08 BRT

Executado pela revisão independente, no domínio publicado. **Eu não executei
nada**: o que segue é o registro das evidências e a análise de código que me
foi pedida.

**Sem PII.** Nenhum nome, e-mail ou telefone aparece aqui. Os registros são
identificados por id e pelo marcador de QA.

## 12.1 O registro de teste

| Item | Valor |
|---|---|
| Negócio | **3646**, exclusivo do teste |
| Marcador | `QA-MIGRACAO-df452e3-20261017` na nota e no objetivo |
| Pessoa / organização | **3588 / 1849, preexistentes e preservadas** — nenhuma duplicata criada |
| Valor | 0 |
| `event_id` do lead | `e0475ad3-3ca3-47a9-9598-63e1dab3307b` |

O valor 0 era esperado: o POST de criação não envia `value` (ver roteiro,
seção 3.3). Por isso `purchase` e `Purchase` saíram com valor 0.

## 12.2 O que foi medido, passo a passo

| Momento (UTC) | Camada | Resultado |
|---|---|---|
| 00:08 | GTM, ambiente Ativa | evento `generate_lead` no dataLayer; tags GA4 Conversões, Ads Lead e **Meta Lead** — **concluídas uma vez cada**. *Na Meta o evento se chama `Lead`, não `generate_lead`* |
| 00:08:09.704Z | Meta CAPI | `Lead` **sent**, HTTP 200, `events_received: 1` |
| 00:09:33Z | GA4 (servidor) | `qualify_lead` **sent**, 204 |
| 00:09:33Z | Meta CAPI | `QualifiedLead` 200, received 1 |
| 00:10:15Z | GA4 (servidor) | `close_convert_lead` **sent**, 204 |
| 00:10:15Z | Meta CAPI | `Purchase` 200, received 1 |
| — | GA4 Tempo Real | `generate_lead` 1, `qualify_lead` 1, `close_convert_lead` 1, `purchase` 1 |

**Atribuição no negócio — com a ressalva que eu não tinha feito.**
`client_id` e `session_id` vieram preenchidos, e o payload do GA4 trouxe
**`client_id_source: deal`**: usou o GA Client ID capturado no formulário, e
não o fallback. Isso é o que precisava acontecer (roteiro, seção 6).

> **Correção minha.** Eu escrevi "8 campos de atribuição preenchidos". **Não
> foi comprovado.** A campanha estava **vazia** — coerente com a origem
> `direct` / `none` — e o **gclid não foi conferido**. O que se comprovou é
> que `ga_client_id` e `ga_session_id` chegaram ao negócio e foram usados.
> **O preenchimento dos oito campos continua sem verificação**, e só um lead
> vindo de campanha com `gclid` fecharia isso.

A jornada de conteúdo foi anotada automaticamente: 389 páginas.

## 12.3 Idempotência: comprovada

A revisão **repetiu de propósito** o ciclo inteiro — voltou para Entrada,
qualificou de novo e ganhou de novo.

**Resultado: `conversion_events` seguiu com exatamente 5 linhas, uma por
evento, com os horários originais.**

Isto é a prova direta da proteção contra reenvio, e é o único item do teste
que fecha sozinho, sem depender de painel externo.

## 12.4 Limitações — o que este teste NÃO provou

| Item | Estado | Por quê |
|---|---|---|
| **Deduplicação na Meta** | **NÃO APROVADA** | O Events Manager ainda não consolidou o `Lead` novo (a interface avisa até 30 min). **`event_id` igual dos dois lados é condição necessária, não suficiente** — quem declara o par casado é a Meta, não nós |
| **Captura de UTM de campanha** | **NÃO TESTADA** | A atribuição real foi preservada: `direct` / `none`, campanha vazia, landing `/ofatorm`, `first_visit` 14/09. O navegador já tinha cookie de primeiro toque, então a UTM de QA do roteiro **não se aplicou**. O que ficou provado é que o **primeiro toque de 90 dias é respeitado** — o oposto de testar captura nova |
| `purchase` no GA4 | em conferência | — |
| Limpeza / restauração | em andamento | — |

A segunda linha merece atenção: ela não é falha. O primeiro toque ter
resistido é o comportamento correto. Mas significa que **a gravação de uma
campanha nova continua sem teste**, e isso precisa de um navegador sem
`ciclo_attr` para ser verificado.

## 12.5 Achado A — `ga_session_id` de setembro

**O que foi observado:** o negócio recebeu `ga_session_id = 1789481472`,
embora o envio tenha sido agora.

**O que esse número é.** Decodificado como epoch em segundos:

```
1789481472 → 2026-09-15T14:11:12 UTC
```

Setembro, de fato. E bate com o `first_visit` de 14/09.

**O código NÃO congela o session id por lógica de primeiro toque.** Verificado
em `attribution.ts:178-192`:

```ts
export function getAttributionPayload(): AttributionPayload {
  collectAttribution()
  const stored = readStored() ?? {}
  return {
    ...stored,
    ga_client_id: readGaClientId(),
    ga_session_id: readGaSessionId(),   // ← lido do cookie AGORA, no submit
    ...
  }
}
```

O valor é lido **no momento do envio**, direto do cookie, e vem **depois** de
`...stored` — então sobrescreveria qualquer valor guardado. A hipótese de
congelamento por first-touch **não se sustenta no código**.

**A hipótese que sobra está na leitura do cookie** (`attribution.ts:156`):

```ts
const entry = document.cookie.split('; ').find((c) => c.startsWith('_ga_'))
```

Isto pega **o primeiro cookie que começa com `_ga_`, qualquer um** — não
filtra pelo measurement id da property ativa, que seria `_ga_EY1FLE5C0J`. Num
navegador antigo, com cookie de outra property ou de outro container, o
`find` pode devolver o errado. E um cookie de property abandonada fica parado
no session id da última sessão dela — o que explicaria setembro.

**Isto é hipótese, não conclusão, e continua assim.** Não tenho acesso ao
navegador e não posso ver os cookies. A leitura do console **não foi feita**
até agora, então **nada aqui está confirmado** — nem a causa, nem que seja
herdado. **Como confirmar, em dez segundos e sem alterar nada**, no
console do mesmo navegador:

```js
document.cookie.split('; ').filter(c => c.startsWith('_ga'))
```

| Resultado | Leitura |
|---|---|
| Mais de um `_ga_…`, e o primeiro não é `_ga_EY1FLE5C0J` | **Hipótese confirmada.** É a leitura do cookie, não o first-touch |
| Só um `_ga_EY1FLE5C0J`, com session id de setembro | Outra causa. O GA4 não teria iniciado sessão nova, o que seria estranho — e aí vale investigar do lado do GA4 |

**Se confirmado, é defeito herdado, não do redesign:** `attribution.ts` está
byte a byte igual à base `7ae962b` — conferido pelo passo 19 da suíte, que
lista esse arquivo entre os 11 idênticos.

**Impacto real, para dimensionar antes de decidir qualquer coisa:** o
`session_id` só é usado como parâmetro dos eventos de servidor do GA4, e só
quando há `client_id` real. Um `session_id` de outra sessão faz o GA4 não
casar o evento com a sessão certa — atrapalha relatório de sessão, **não**
derruba o evento nem a atribuição de canal, que vem dos campos de UTM.

**Nada alterado.** Correção possível, se vocês quiserem depois: preferir o
cookie `_ga_` que corresponde ao measurement id em uso, caindo no primeiro só
como último recurso. É uma linha, mas é na camada protegida e **não entra sem
decisão explícita**.

## 12.6 Achado B — aviso da tag do TikTok

**O que foi observado:** no `generate_lead`, a tag do TikTok avisa
`[WARN] data.event generate_lead is not a valid event`, apesar de concluir.

**É herdado, e é de configuração, não de código.** Duas evidências:

1. **Não existe código de TikTok no repositório.** Busquei em todo o `src/`:
   as únicas ocorrências são conteúdo de página, ícone de marca e nomes de
   rota (`/tiktok-shop`, `/servicos/tiktok-ads`). Nenhuma tag, nenhum pixel,
   nenhum envio.
2. As tags **TikTok Setup** e **TikTok Pixel Event** já constavam como ativas
   na leitura do container feita **antes** da migração.

**O que o aviso quer dizer.** O TikTok só reconhece um conjunto fechado de
nomes de evento — `SubmitForm`, `Contact`, `CompleteRegistration`,
`PlaceAnOrder` e afins. A tag está repassando o nome do evento do dataLayer
(`generate_lead`) como se fosse nome de evento do TikTok, e ele não está na
lista. A tag "conclui" no GTM porque disparou; o TikTok é quem não reconhece.

**Impacto:** o lead provavelmente não é contado como conversão nomeada no
TikTok. **Não afeta** GA4, Meta, Ads nem Pipedrive — são tags independentes.

**O redesign não causou nem agravou isso**, e corrigir é mudança de
configuração no container: mapear `generate_lead` para um nome válido do
TikTok. **Fora do meu alcance e fora deste escopo**; registro para a decisão
de vocês.

## 12.7 Quadro do teste

| Item | Estado |
|---|---|
| Negócio criado no funil e etapa certos, sem duplicar pessoa | **aprovado** |
| `ga_client_id` e `ga_session_id` no negócio, `client_id_source: deal` | **aprovado** |
| **Os 8 campos de atribuição preenchidos** | **NÃO COMPROVADO** — campanha vazia, gclid não conferido |
| `generate_lead` no navegador: GA4, Ads e Meta, uma vez cada | **aprovado** |
| Meta CAPI `Lead` aceito (200, received 1) | **aprovado** como *aceitação*; **não** como dedup |
| `qualify_lead` e `QualifiedLead` na mudança de etapa | **aprovado** |
| `close_convert_lead` e `Purchase` no ganho | **aprovado** |
| **Idempotência: 5 linhas, uma por evento, horários originais** | **aprovado** |
| **Deduplicação na Meta** | **PENDENTE** — Events Manager não consolidou |
| **Captura de UTM nova** | **NÃO TESTADA** — primeiro toque preexistente |
| `purchase` no GA4 e limpeza | **em conferência** |
| `ga_session_id` de setembro | **achado, hipótese em 12.5**, provavelmente herdado |
| Aviso da tag TikTok | **achado, herdado**, de configuração (12.6) |

---

# 13. Segundo teste real — playbook, 17/10 21:17 BRT

Executado pela revisão. **A página do playbook não foi alterada.**

## 13.1 O registro

| Item | Valor |
|---|---|
| Negócio | **3647**, exclusivo do teste |
| Funil | **Playbooks (13)** — confirma `findStageId('Playbook')` |
| `event_id` | `eea98416-7e40-4a15-8a1b-97bdd713bf99` |
| Valor | 0 |
| Estado final | reaberto e **arquivado** |

## 13.2 O que foi medido

| Momento (UTC) | Camada | Resultado |
|---|---|---|
| 00:17:08.035Z | Meta CAPI | **`Lead`** 200, `events_received: 1` |
| 00:21:20.110Z | GA4 (servidor) | `qualify_lead` **sent**, 204 |
| 00:21:21.535Z | Meta CAPI | **`Opportunity`** 200, received 1 |
| 00:33:38.167Z | GA4 (servidor) | `close_convert_lead` **sent**, 204 |
| 00:33:39.302Z | Meta CAPI | **`Purchase`** 200, received 1 |

Tag Assistant: `playbook_form_submit` disparou, **GA4 Conversões enviou com o
mesmo nome**, e a Meta recebeu **`Lead` com o mesmo UUID**. **Nenhum
`generate_lead`** em lugar nenhum.

**Isto confirma, com evidência de produção, as três afirmações da seção 11
do roteiro:**

1. O playbook emite só `playbook_form_submit`.
2. No GA4 chega o evento customizado, não `generate_lead`.
3. **Na Meta o playbook já conta como `Lead`** — a lacuna é só do GA4.

E confirma a quarta: o funil 13 **já qualifica e converte**. `qualify_lead` e
`close_convert_lead` saíram normalmente, e o evento de funil da Meta foi
`Opportunity`, que é o mapeamento da etapa "SQL / Oportunidade".

## 13.3 Estado consolidado dos dois testes

| | |
|---|---|
| `conversion_events` | **10 registros**, somando os dois testes, **sem erros** |
| GA4 Tempo Real, 21:35 | `qualify_lead` 2, `close_convert_lead` 2, `purchase` 2, `generate_lead` 1, `playbook_form_submit` 1 |
| Negócios 3646 e 3647 | reabertos e **arquivados**; pessoa 3588 e organização 1849 **preservadas** |

O `purchase` do negócio 3646 apareceu no Tempo Real após a repetição —
fechando o item que estava em conferência.

A contagem bate com o esperado: dois leads, dois ciclos de qualificação e
ganho, e **um** `generate_lead` (só o do contato), porque o playbook não
emite esse evento.

## 13.4 A lacuna, agora confirmada no painel

A revisão verificou na interface do GA4 e do GTM:

| Onde | O que encontrou |
|---|---|
| GA4, **Criar evento** | 8 eventos derivados existentes, **nenhum** produz `generate_lead` |
| GA4, **Modificar evento** | **vazia** |
| GTM v107, workspace com 0 alterações | única tag GA4 Conversões ativa usa `{{Event}}`, e a regex inclui o playbook; as demais tags GA4 de playbook estão **pausadas** |

**Portanto a tradução não existe em lugar nenhum** — nem no código, nem no
GTM, nem no GA4. Isto fecha a checagem que eu tinha pedido em 11.2 do
roteiro, e **confirma a lacuna**: o playbook não alimenta "Novos leads".

Registro que isto **não era verificável por mim** e dependia desta leitura.

---

# 14. Evento derivado no GA4 × tag dedicada no GTM

Análise pedida. **Nada configurado.**

## 14.1 Comparação

| Critério | **Evento derivado no GA4** | **Tag GA4 dedicada no GTM** |
|---|---|---|
| Onde vive | Property `402971489` | Container `GTM-5NNPNZ` |
| Toca o container | **não** | sim — publica a v108 |
| Toca a página / o playbook | não | não |
| **Hit adicional do navegador** | **não** — a tradução é no processamento do GA4 | **sim**, mais uma requisição por envio |
| Risco de atingir o `generate_lead` do contato | **praticamente nulo** — a condição é igualdade de `event_name` | **existe**, se pendurarem no gatilho regex "CE Conversões" |
| Visível no Tag Assistant | **não** | sim |
| Versionamento e histórico | fraco: sem versão, sem diff | **forte**: versão do container, com autor e data |
| Pré-visualização antes de valer | não | **sim**, modo de visualização |
| Reversão | excluir ou desativar | pausar a tag |
| Retroativo | **não** | **não** |

## 14.2 Recomendação: o evento derivado

Três razões concretas, nesta ordem:

1. **Não gera hit extra.** A tag no GTM dispararia um segundo evento do
   navegador a cada envio do playbook. O derivado não manda nada a mais.
2. **Não toca o container.** O v107 está estável, auditado e com workspace
   limpo. Toda mudança ali é superfície nova numa semana em que já mexemos em
   muita coisa.
3. **Elimina o risco que eu mesmo levantei.** A condição do derivado é
   igualdade exata de `event_name = playbook_form_submit`. **Não há como
   atingir o `generate_lead` do contato**, que era o erro mais provável do
   caminho pelo GTM.

Some-se que a casa **já usa esse mecanismo**: há 8 eventos derivados na
property. Não é padrão novo.

## 14.3 Riscos do caminho recomendado, ditos sem maquiagem

| Risco | Tamanho | Mitigação |
|---|---|---|
| **Invisível no Tag Assistant** | real | Quem depurar pelo Tag Assistant não vai ver o `generate_lead` do playbook e pode concluir que não existe. **Documentar onde a tradução vive** |
| **Sem versionamento** | real | O GA4 não guarda histórico de quem criou nem quando. Anotar data, autor e motivo no documento |
| **Duplicação futura** | sério se acontecer | Se alguém criar depois a tag no GTM sem saber do derivado, passam a sair **dois** `generate_lead`. É o mesmo risco pelo caminho inverso. **A documentação é a única barreira** |
| **"Novos leads" muda de definição** | certo, não é risco | Passa a somar contato **e** playbook. Anotar a data da mudança: a série antes e depois **não é comparável** |
| Conta como evento adicional | pequeno | O GA4 registra os dois. Afeta contagem total de eventos e cardinalidade, não as métricas de lead |
| Limite de 50 eventos criados | nenhum hoje | Há 8 |
| Ordem de processamento | nenhum hoje | Eventos criados são processados depois das modificações, e **Modificar evento está vazia** |

## 14.4 Antes de criar, três verificações

1. **Marcar "copiar parâmetros do evento de origem"**, para `event_id`,
   `form`, `lead_source`, `lead_medium` e `lead_campaign` irem junto. Sem
   isso o `generate_lead` nasce sem contexto.
2. Conferir se **"Novos leads" alimenta alguma audiência ou importação para o
   Google Ads**. Se alimentar, o volume muda e isso precisa ser esperado, não
   descoberto depois.
3. **Não** marcar o derivado como evento principal antes de decidir o item 2.

## 14.5 Condições que continuam valendo

- Só **depois** de encerrada a validação de dados.
- **Eu não configuro.** Análise e recomendação; a execução é de vocês.
- Se escolherem o GTM em vez do derivado, o gatilho tem de ser **novo e
  exclusivo** de `playbook_form_submit` — nunca o "CE Conversões".

---

# 15. O que continua pendente

| Item | Estado |
|---|---|
| **Deduplicação na Meta** | **PENDENTE.** O Events Manager não consolidou. `event_id` igual dos dois lados é condição necessária, não suficiente |
| **Os 8 campos de atribuição** | **NÃO COMPROVADO.** Campanha vazia, gclid não conferido (12.2) |
| **Captura de UTM nova** | **NÃO TESTADA.** Primeiro toque preexistente no navegador |
| **Hipótese do `ga_session_id`** | **PENDENTE.** Os cookies não foram lidos no console. **Não está confirmada**, e eu não a trato como confirmada |
| Aviso da tag TikTok | achado herdado, de configuração (12.6) |
| Cron | próxima execução natural |
| Favicon | pendente; **arquivo ainda não recebido** nesta sessão |
| Tag ou evento derivado de `generate_lead` para o playbook | **analisado** (14), **não configurado** |
