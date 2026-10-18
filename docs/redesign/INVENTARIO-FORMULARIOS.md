# Inventário de formulários e pontos de captura

Levantado por varredura do código em `df452e3`, não por memória: todo
componente com `<form>` ou `onSubmit`, todas as rotas de `src/app/api`, e
quem renderiza o quê.

**Regra que vale para o documento inteiro:** compartilhar componente **não**
é prova. Os testes reais cobriram **três envios** — contato (3646 e 3648) e
playbook (3647). Nada além disso está comprovado ponta a ponta, por mais
parecido que seja o caminho.

---

## 1. Matriz

| # | Rota / Componente | Endpoint | Evento dataLayer → GA4 | Meta | Funil / etapa | Campos e consentimento | Testes | **Não provado E2E** |
|---|---|---|---|---|---|---|---|---|
| 1 | **`#contato`** · `ciclo/Contato.tsx` — home, `/tiktok-shop`, `/consultoria-para-e-commerce`, 19 `/servicos/*`, 4 `/solucoes/*` | `POST /api/pipedrive` | `generate_lead` | **`Lead`** CAPI, mesmo `event_id` | Por **nome**: `/site|whats/i` → etapa `/entrada/i`. Observado: **funil 2** | nome, e-mail, empresa, WhatsApp, faturamento, segmento, desafio (≥20). **LGPD obrigatório** | passo 6 (payload), passo 16 | **Provado E2E** nos envios 3646 e 3648 — *só a partir da home* |
| 2 | **`/playbook-social-commerce`** · `PlaybookForm.tsx` | `POST /api/pipedrive` com `pipeline: 'Playbook'` | **`playbook_form_submit`** — **não** emite `generate_lead` | **`Lead`** CAPI, mesmo `event_id` | **Funil 13**, primeira etapa | nome, e-mail, empresa, WhatsApp. **LGPD obrigatório** | passo 5 (congelamento), passo 6 | **Provado E2E** no envio 3647, caminho manual. **Caminho LinkedIn não testado** |
| 3 | **`/aplicacao`** · `AplicacaoForm.tsx` | `POST /api/aplicacao` | 8 `aplicacao_step_view`, 7 `_step_complete`, **`consultoria_ecom_shift_lead`** | `Lead` CAPI pela rota | **Fixos no módulo: `PIPELINE_ID = 2`, `STAGE_ID = 8`** | 8 etapas: empresa, site, cargo, faturamento, desafio, nome, e-mail, WhatsApp. **LGPD na última** | passo 6, **passo 15** (etapas, conversão, **idempotência**) | **NÃO PROVADO E2E.** Nunca houve envio real. `consultoria_ecom_shift_lead` **nunca teve streaming no GA4** |
| 4 | **`/link-bio`** · `LinkBioForm.tsx` | `POST /api/link-bio`, **um por etapa** | 5 `link_bio_step_view`, 5 `_step_complete`, **`generate_lead`** no fim | `Lead` CAPI pela rota | Lead parcial vira negócio **desde a 1ª etapa** | 5 etapas: e-mail, WhatsApp, empresa, cargo, faturamento | passo 6, **passo 15** | **NÃO PROVADO E2E.** O GA4 em tempo real registrou 2 `link_bio_step_view` de tráfego real, mas **nenhum envio completo** |
| 5 | **Popup do playbook** · `PlaybookPopup.tsx`, montado em `blog/layout.tsx` | `POST /api/track` | `playbook_popup_view`, `_click`, `_dismiss` | — | — | não coleta dado nenhum; é CTA | passo 9 (tipografia do popup) | **NÃO PROVADO E2E.** Os três eventos nunca foram observados em produção |
| 6 | **Busca do blog** · `<form role="search" action="/blog">` em `blog/page.tsx` | — | **nenhum** | — | — | só `q`, via GET | passo 8 | Não é captura de lead. **Nada a provar** |
| 7 | **LinkedIn** · `/api/auth/linkedin/*` | `GET` callback → `createPipedriveLead` | `playbook_form_submit` com `?eid=` | `Lead` CAPI | Funil 13 | perfil OIDC | — | **NÃO PROVADO E2E.** Atrás de `NEXT_PUBLIC_LINKEDIN_ENABLED`, **desligado por padrão** |

### 1.1 Não são formulários, mas capturam

| Componente | Endpoint | O que faz | Estado |
|---|---|---|---|
| `track.ts` em todas as páginas | `POST /api/track`, `/api/track/init` | `page_view`, `form_submit`, `material_download`, `popup_*` | **Funcionando**: 49 `page_view` no Supabase depois da migração |
| `/api/track/optout` | — | Exclusão de rastreamento | **NÃO PROVADO** |
| `/api/cron/site-digest` | `GET`, Bearer | Resumo diário vira nota no CRM | **NÃO PROVADO** — aguarda execução natural |
| `/api/pipedrive/webhook` e `/enrich` | recebem do Pipedrive | Qualificação, ganho, enriquecimento | Webhook **provado E2E** em 3646 e 3647. **`enrich` NÃO provado** |
| `/api/verify-recaptcha` | — | — | **Dívida herdada: nenhum formulário o chama** |

---

## 2. Resposta direta ao Flávio

**Não. Dos sete pontos de captura, dois foram validados ponta a ponta.**

| Validado E2E | Não validado E2E |
|---|---|
| **`#contato`**, pela home (3646, 3648) | **`/aplicacao`** — nunca houve envio real |
| **`/playbook`**, caminho manual (3647) | **`/link-bio`** — nenhum envio completo |
| | **Popup do playbook** — eventos nunca observados |
| | **Playbook via LinkedIn** — recurso desligado |
| | **`/api/pipedrive/enrich`** — sem entrega após a migração |
| | **Cron** — aguarda execução natural |

### 2.1 Duas ressalvas que mudam a leitura

**O `#contato` aparece em 26 rotas e foi testado em uma.** É o mesmo
componente e o mesmo endpoint nas 26, então o risco de divergência é baixo —
mas **baixo não é nulo**, e eu não vou classificar as outras 25 como
comprovadas. O que muda entre elas é só o contexto da página; o envio é
idêntico.

**O `/aplicacao` é o que tem mais superfície sem prova.** É o único com
**funil e etapa fixos no código** (`PIPELINE_ID = 2`, `STAGE_ID = 8`), o
único com evento de conversão próprio (`consultoria_ecom_shift_lead`), e esse
evento **nunca teve streaming no GA4** — nem antes nem depois da migração. É
onde eu olharia primeiro.

---

## 3. O que falta para fechar cada lacuna

Sem enviar nada agora. Só o que seria preciso.

| Lacuna | O que fecharia | Custo |
|---|---|---|
| `/aplicacao` | Um envio real das 8 etapas, com contato autorizado | Cria negócio no funil 2, etapa 8 |
| `/link-bio` | Um envio real das 5 etapas | Cria negócio **desde a 1ª etapa** — atenção: gera registro mesmo se abandonado |
| Popup do playbook | Abrir uma página do blog e esperar o gatilho; clicar e fechar | **Zero.** Não cria lead, só eventos de telemetria |
| Playbook via LinkedIn | Ligar `NEXT_PUBLIC_LINKEDIN_ENABLED` | Mudança de ambiente — **fora de escopo** |
| `/api/pipedrive/enrich` | Um negócio novo qualquer no Pipedrive | Já teria acontecido nos testes se o webhook "Criar negócio" tivesse entregue |
| Cron | Esperar `0 12 * * *` | Zero |

**O popup é o único que fecha sem custo nenhum** — não cria lead, não move
CRM, não envia nada ao Pipedrive. Se quiserem reduzir a lista de pendências
com risco zero, é por onde começar.

---

## 4. O que NÃO fazer

- **Não** classificar as 25 rotas restantes do `#contato` como comprovadas
  por compartilharem componente.
- **Não** enviar nada por minha conta.
- **Não** mexer em mensuração até esta análise ser discutida.

---

# 5. Atualização 17/10, 22:03 — mais dois endpoints testados

Dois envios reais a mais, pela revisão independente. **Eu não executei
nenhum.**

| Endpoint | Negócio | Quando | Funil / etapa | Estado |
|---|---|---|---|---|
| **`/link-bio`**, as 5 etapas | **3649** | nasceu no passo e-mail 21:58, concluído 22:03 | Site/Whats, Entrada | **arquivado** |
| **`/aplicacao`** | **3650** | 22:03 | Site/Whats, Entrada | **arquivado** |

Pessoa 3588 e organização 1849 nos dois, valor R$ 0, dados autorizados.
**GA4 em tempo real recebeu `generate_lead` e `consultoria_ecom_shift_lead`.**

**Cinco negócios de teste no total — 3646, 3647, 3648, 3649, 3650 — todos
arquivados.**

## 5.1 O achado: zero linhas em `conversion_events`

`SELECT ... WHERE deal_id IN (3649, 3650)` voltou **vazio** às 22:04–06. E
por `person_id = 3588` só apareceram as 7 linhas da Meta dos negócios
3646–48.

**Achei a causa, e ela não é falta de envio: é o log que não amarra o
negócio.**

As três rotas chamam `sendMetaEvent`, mas **só uma passa o `context`**:

```ts
// src/app/api/pipedrive/route.ts:121  — passa
context: { dealId: result.dealId, personId: result.personId, uid },

// src/app/api/link-bio/route.ts:171   — NÃO passa
// src/app/api/aplicacao/route.ts:162  — NÃO passa
```

E em `meta-capi.ts`, o registro usa exatamente esses campos:

```ts
deal_id:   input.context?.dealId   ?? null,
uid:       input.context?.uid      ?? null,
person_id: input.context?.personId ?? null,
```

**Sem `context`, a linha é gravada com `deal_id`, `person_id` e `uid`
todos NULL.** Por isso nenhuma consulta por negócio ou por pessoa acha os
envios do `/link-bio` e do `/aplicacao` — **mesmo que eles tenham
acontecido**.

Isto explica os dois sintomas de uma vez: o `WHERE deal_id IN (...)` vazio e
o `person_id = 3588` trazendo só os três negócios que vieram de
`/api/pipedrive`.

## 5.2 Herdado, não regressão

Conferido contra a base de produção `7ae962b`:

| Arquivo | Contra a base |
|---|---|
| `src/app/api/link-bio/route.ts` | **IDÊNTICO** |
| `src/app/api/aplicacao/route.ts` | **IDÊNTICO** |
| `src/lib/meta-capi.ts` | **IDÊNTICO** |
| `src/lib/supabase-server.ts` | **IDÊNTICO** |

**Nenhuma das quatro foi tocada pelo redesign.** O comportamento é o mesmo
de antes da migração: é **dívida herdada de observabilidade**, não
regressão.

## 5.3 O que isso ainda NÃO responde

**Não sei se os eventos foram enviados.** Só sei por que não aparecem na
consulta feita.

Duas possibilidades, e elas se distinguem com **uma consulta, sem alterar
nada**:

```sql
select platform, event_name, event_id, action_source, status,
       deal_id, person_id, uid, sent_at,
       response->>'events_received' as recebidos
from conversion_events
where sent_at >= '2026-10-18T00:55:00Z'
order by sent_at;
```

| Resultado | Leitura |
|---|---|
| Aparecem linhas Meta `Lead` com **`deal_id` NULL** nessa janela | **Foram enviados.** O problema é só rastreabilidade do log |
| **Nenhuma** linha nova da Meta na janela | **Não foram enviados.** Aí sim há o que investigar no envio |

Também dá para cruzar pelo `event_id`: os UUIDs dos dois envios são
conhecidos pelo dataLayer de cada um.

**A contagem da Meta não resolve sozinha.** O painel mostrou `Lead` 6, sendo
3 de navegador e 3 de servidor. Os leads de teste foram **cinco**. Se os
dois últimos tivessem chegado ao servidor, seriam 5 de servidor — mas a
consolidação da Meta tem latência, e a leitura foi minutos depois. **Não dá
para concluir dos dois lados: nem que faltaram, nem que chegaram.**

## 5.4 Uma pergunta que precisa do GTM

**Em qual gatilho está a tag "Meta Lead" do container?**

Isso importa, e pode revelar uma assimetria:

| Se a tag dispara em… | `/link-bio` (emite `generate_lead`) | `/aplicacao` (emite `consultoria_ecom_shift_lead`) |
|---|---|---|
| gatilho exclusivo de `generate_lead` | Meta Lead do **navegador** dispara | **NÃO dispara** → só o servidor envia → **sem par para deduplicar** |
| gatilho "CE Conversões" (a regex) | dispara | **dispara** — e aí haveria par |

A regex do "CE Conversões" inclui `consultoria_ecom_shift_lead`, mas inclui
também `begin_checkout` e os `playbook_popup_*` — e disparar Meta `Lead`
nesses seria errado. Então é pouco provável que a tag Meta use esse gatilho.

**Se a tag Meta Lead for exclusiva de `generate_lead`, o `/aplicacao` nunca
teve dedup possível** — o navegador não manda `Lead` para ele. Seria achado
herdado, e explicaria por que `consultoria_ecom_shift_lead` nunca teve
streaming.

**Não tenho acesso ao container.** Esta é leitura de vocês, e é de dez
segundos.

## 5.5 Matriz atualizada

| # | Ponto de captura | Envio real | `conversion_events` com `deal_id` | Dedup possível |
|---|---|---|---|---|
| 1 | `#contato` (home) | **sim** — 3646, 3648 | **sim** | **sim**, par comprovado em 3648 |
| 2 | `/playbook` manual | **sim** — 3647 | **sim** | sim |
| 3 | **`/link-bio`** | **sim** — 3649 | **não** — `context` não é passado (5.1) | a confirmar (5.4) |
| 4 | **`/aplicacao`** | **sim** — 3650 | **não** — idem | **a confirmar, e é o caso suspeito** (5.4) |
| 5 | Popup do playbook | não | — | — |
| 6 | Busca do blog | n/a | — | — |
| 7 | Playbook via LinkedIn | não — recurso desligado | — | — |

**Os sete pontos de captura agora têm quatro com envio real.** Os três
restantes seguem sem teste, e o popup continua sendo o único que fecharia
sem custo nenhum.

## 5.6 Recomendação

**Não mexer em mensuração agora**, como combinado. Mas registro o conserto
mínimo, para quando houver decisão:

Passar `context` nas duas rotas, como `/api/pipedrive` já faz:

```ts
context: { dealId, personId, uid }
```

São **duas linhas**, em arquivos da camada protegida, e **só melhoram
rastreabilidade** — não mudam evento, nem payload, nem destino. Mas mudam
arquivos que hoje estão byte a byte iguais à base, então **não entram sem
decisão explícita**.

---

# 6. Atualização 18/10 — as perguntas de 5.3, 5.4 e 5.6 têm resposta

Três coisas que estavam em aberto fecharam, todas com evidência externa da
revisão independente. Nenhuma delas veio de envio meu.

## 6.1 Os eventos **foram** enviados — 5.3 resolvido

A consulta de 5.3 foi executada, e também o cruzamento por `event_id`. O
resultado é a primeira linha da tabela daquela seção:

| Negócio | CAPI | `events_received` | `fbtrace_id` | `deal_id` no log |
|---|---|---|---|---|
| **3649** (`/link-bio`) | **200** | **1** | `ASHbRKViecDIJ2Uap8pgpsf` | **NULL** |
| **3650** (`/aplicacao`) | **200** | **1** | `AhQVMXPxmQTy3YugsXjdJVN` | **NULL** |

Então **a hipótese de 5.1 está confirmada e o alarme de 5.3 está descartado**:
os dois endpoints enviaram, a Meta aceitou, e o que faltava era só o `context`
no registro. **É rastreabilidade, não entrega.**

Duas ressalvas que eu mantenho:

- HTTP 200 e `events_received: 1` dizem que a Meta **recebeu**. Não dizem que
  processou, nem que deduplicou. Isso continua valendo aqui como valeu em
  15.8 do pós-migração.
- Eu não li o banco nem os logs da Vercel: **não tenho acesso**. Estou
  registrando evidência de terceiro, identificada pela origem.

## 6.2 O GTM contempla a `/aplicacao` — 5.4 cai

A pergunta de 5.4 era qual gatilho aciona a tag Meta Lead. A leitura do
container real responde:

| Objeto | Conteúdo |
|---|---|
| Gatilho **179** | regex `^(generate_lead\|playbook_form_submit\|consultoria_ecom_shift_lead)$` |
| Tag **180**, Meta Lead | `eventID={{DLV - event_id}}`, no gatilho 179 |

`consultoria_ecom_shift_lead` **está na regex**. Logo a tag Meta Lead dispara
na `/aplicacao`, com o mesmo `event_id` que o servidor usa.

**A assimetria que eu suspeitava em 5.4 não existe.** Eu havia raciocinado
sobre o gatilho "CE Conversões", largo demais para a tag Meta; o container tem
um gatilho **específico de três eventos**, que eu não conhecia. A tabela de
5.4 está errada nos dois ramos e **fica substituída por esta**:

| Rota | Evento do dataLayer | Na regex do 179? | Par navegador+servidor |
|---|---|---|---|
| `/link-bio` | `generate_lead` | **sim** | **existe** |
| `/aplicacao` | `consultoria_ecom_shift_lead` | **sim** | **existe** |

**Nenhuma alteração de GTM é necessária.** A dedup das duas rotas depende só
do que já depende para as outras: a Meta casar o par (15.8 do pós-migração).

## 6.3 O conserto de 5.6 foi autorizado e está feito — não publicado

Autorizado pelo Flávio em 17/10 22:12 BRT, como correção mínima em commit
isolado. Commit **`f73a2ef`**, na branch, **sem publicar**.

O que mudou: `context: { dealId, personId, uid }` nas duas chamadas a
`sendMetaEvent`, com ids que **já estavam no escopo** — o mesmo `dealId` que
vai em `custom_data`, o `personId` da sessão assinada e o `uid` que já é usado
em `externalId`. Nada é recalculado nem inventado.

O que **não** mudou, e está coberto por teste: nome do evento, `event_id`,
`action_source`, `user_data`, `custom_data`, a dedup com o Pixel, o formulário,
o playbook e as regras comerciais. O `context` **não vai** no corpo enviado à
Meta — ele só alimenta o log.

O passo 20 de `verificar.sh` chama as três rotas de verdade com `fetch`
mockado — **sem rede, sem criar lead em lugar nenhum** — e afirma as duas
coisas: que os três ids chegam ao registro e que o envio está intacto.

**Isso conserta o log a partir do próximo envio. Não é retroativo:** as linhas
de 3649 e 3650 continuam com `deal_id` NULL, e a auditoria delas depende da
janela de tempo e do `event_id`, como em 6.1.

## 6.4 A supressão do popup não é o que eu supus — 3 continua aberto

Na seção 3 eu escrevi que abrir uma página do blog e esperar o gatilho fecharia
a lacuna do popup, a custo zero. **Isso não basta**, e a razão está no código:

```
src/components/PlaybookPopup.tsx
  STORAGE_KEY    'ciclo-playbook-popup-dismissed-at'
  COOLDOWN_DAYS  7
  DELAY_MS       10_000
```

A supressão vem de **fechar** o popup: `close()` grava o instante em
`localStorage`, e na montagem o componente desiste se o registro tiver menos de
sete dias. Os gatilhos são o temporizador de 10s e a intenção de saída, e o
componente só é montado em `blog/layout.tsx`.

Duas consequências:

- **Baixar o playbook não suprime o popup.** Não há gravação no caminho de
  download — só no de fechamento. Quem baixou e nunca fechou o popup continua
  elegível.
- **Quem fechou o popup nos últimos 7 dias não vai vê-lo**, tenha baixado o
  playbook ou não, e nenhuma navegação muda isso dentro da janela.

Então, **antes de assumir que a lacuna fecha abrindo o blog**, o teste tem que
começar lendo a chave no console do navegador em questão:

```js
localStorage.getItem('ciclo-playbook-popup-dismissed-at')
```

`null` → o popup deve aparecer em 10s numa página do blog, e a lacuna fecha.
Com valor de menos de 7 dias → **não vai aparecer**, e isso é o comportamento
correto, não falha. Nesse caso só fecha removendo a chave, ou em outro perfil
de navegador — e é decisão de vocês, não minha: eu não executo navegação de
teste por minha conta.
