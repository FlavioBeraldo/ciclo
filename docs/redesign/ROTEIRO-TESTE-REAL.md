# Roteiro do teste ponta a ponta — contra `df452e3`

**Nada aqui foi executado.** Nenhum lead enviado, nenhum registro de CRM
movido, nenhuma tag, credencial, backend ou dado alterado. Tudo abaixo foi
derivado da **leitura do código publicado** (`df452e315b4a33fc67a5f8e782a07c0f53570a94`).

Quem executa é a revisão independente, pelo navegador, **depois de receber do
Flávio o contato autorizado** da seção 1.

---

## 1. O que preciso pedir ao Flávio — a lista mínima

### 1.1 Primeiro, a resposta curta sobre o e-mail interno

**Sim: `@cicloecommerce.com.br` SERIA filtrado.** E em dois lugares
diferentes, o que piora.

`src/lib/meta-capi.ts:115`:

```ts
const internal = (process.env.INTERNAL_EMAIL_DOMAINS ?? 'cicloecommerce.com.br')
  .split(',').map(d => d.trim().toLowerCase()).filter(Boolean)
return internal.includes(domain)
```

Comparação é do **domínio inteiro, exata**. `@cicloecommerce.com.br` entra na
lista por padrão, mesmo sem a variável definida — e `INTERNAL_EMAIL_DOMAINS`
**não aparece** na listagem de variáveis de Production que a revisão leu, o
que indica que o default é o que vale. *Confirmar isso é um dos itens de 1.3.*
Subdomínio como `@mkt.cicloecommerce.com.br` **não** seria filtrado, porque a
comparação é exata.

**O que um e-mail interno desliga:**

| Caminho | Com e-mail interno |
|---|---|
| Negócio no Pipedrive | **criado normalmente** |
| Meta `Lead` pela CAPI | **não enviado** (`/api/pipedrive/route.ts:131`) |
| Meta `Lead` pelo Pixel do navegador | **enviado** — o Pixel é GTM e não conhece o filtro |
| GA4 `generate_lead` | **enviado** — também é GTM |
| Meta `QualifiedLead`, `Purchase` e demais de funil | **não enviados** |
| GA4 `qualify_lead` e `close_convert_lead` | **não enviados** |
| GA4 `purchase` do webhook | enviado, se houver GA Client ID |

Ou seja: com e-mail interno o teste **prova Pipedrive, GA4 de navegador e
atribuição, e não prova nada de CAPI nem de deduplicação.** Metade do que o
Flávio pediu ficaria de fora.

**Há uma segunda trava, e ela é permanente.** `/api/pipedrive/route.ts:62`
grava `internal: true` dentro do campo "Atribuição extra" do negócio. Depois
disso, `pipedrive-funnel-events.ts:105` bloqueia os eventos de funil **pelo
campo do negócio**, não pelo e-mail:

```ts
if (extra.internal === 'true') return { sent: false, skipped: 'internal' }
```

Trocar o e-mail da pessoa depois **não destrava**. Um negócio criado com
e-mail interno nasce inutilizável para o teste de CAPI, para sempre.

**Conclusão: o contato precisa ser externo.** Não há como contornar sem
mexer em variável de produção, e isso está vedado.

### 1.2 Dados mínimos — peça exatamente isto

O formulário recomendado (seção 2) exige sete campos. Todos vão para o
Pipedrive e três viram dado de correspondência na Meta.

| # | Dado | Regra do código | Por que preciso |
|---|---|---|---|
| 1 | **Nome completo** | mínimo 2 caracteres; é quebrado em `first_name` / `last_name` | Título do negócio e Advanced Matching |
| 2 | **E-mail corporativo** | formato válido e **domínio fora de `INTERNAL_EMAIL_DOMAINS`** — ou seja, **não** `@cicloecommerce.com.br` | Sem isto não há CAPI nem dedup. **É o item que trava tudo** |
| 3 | **Empresa** | mínimo 1 caractere | Organização no Pipedrive |
| 4 | **WhatsApp** | mínimo 1 caractere, formato internacional (`+55…`) | Correspondência na Meta |
| 5 | **Faturamento anual** | uma das 4 opções: `R$ 5 a R$ 10 milhões/ano`, `R$ 10 a R$ 30 milhões/ano`, `R$ 30 a R$ 50 milhões/ano`, `Acima de R$ 50 milhões/ano` | Campo do negócio |
| 6 | **Segmento** | uma das 11: Moda e Acessórios, Beleza e Cosméticos, Saúde e Suplementos, Casa e Decoração, Alimentos e Bebidas, Eletrônicos e Tecnologia, Esporte e Lazer, Pet, Infantil, Joias e Semijoias, Outro | Campo do negócio |
| 7 | **Descrição do desafio** | **mínimo 20 caracteres** | Campo do negócio |

Duas autorizações, **já concedidas** — registradas aqui só para constar, não
para pedir de novo:

| # | Autorização | Estado |
|---|---|---|
| 8 | Contato autorizado nesse e-mail e WhatsApp | **concedida.** Gmail próprio do Flávio |
| 9 | Mover o negócio de etapa e marcá-lo como ganho | **concedida** |

**Sugestão ao Flávio, para resolver os dois de uma vez:** um e-mail de
domínio próprio dele ou de alguém do time **que não seja
`@cicloecommerce.com.br`**, com a caixa acessível durante o teste. Não serve
e-mail descartável se ninguém puder confirmar o recebimento, e não serve
e-mail de cliente.

### 1.3 Três confirmações rápidas, sem alterar nada

| # | O que confirmar | Onde | Se vier diferente |
|---|---|---|---|
| 1 | `INTERNAL_EMAIL_DOMAINS` existe em Production? Com que valor? | Painel de variáveis | Se listar outros domínios, o e-mail escolhido precisa ficar fora deles também |
| 2 | `META_TEST_EVENT_CODE` existe em Production? | Painel de variáveis | Se existir, o evento cai no modo de teste do Events Manager e **não entra nos relatórios**. Pode ser bom ou ruim — precisa ser uma escolha, não uma surpresa |
| 3 | O funil "1 - Site/Whats (Passivo)" é mesmo o `pipeline_id` 2, e a etapa "Lead Qualificado" é a 11 | Pipedrive | É o que a regra do GA4 espera (seção 4) |

**Não alterar nenhuma das três.** São leituras.

---

## 2. Qual formulário usar, e por quê

**Use o formulário `#contato`**, na home (`https://cicloecommerce.com.br/#contato`)
ou em `/consultoria-para-e-commerce` — são o mesmo componente, com o mesmo
envio.

| Formulário | Serve? | Por quê |
|---|---|---|
| **`#contato`** | **sim** | Cai no funil Site/Whats, que é o único com regra de `qualify_lead` e `close_convert_lead` **e** eventos de funil da Meta por etapa. É o caminho que o Flávio descreveu |
| `/aplicacao` | não | Pipeline e etapa fixos da oferta E-com Shift; emite `consultoria_ecom_shift_lead`, não `generate_lead` |
| `/link-bio` | não | Lead parcial por etapa; não exercita o funil comercial |
| `/playbook-social-commerce` | **proibido** | Congelado |

Campos e opções exatos estão em 1.2. O **aceite da Política de Privacidade**
é obrigatório para o botão funcionar.

### 2.0 Há cadastro preexistente para esse e-mail — e isso muda duas coisas

A revisão encontrou, antes de qualquer envio: **pessoa 3588 "Teste
Mensuração"** e **organização 1849**, ligadas ao Gmail do teste, **sem
negócio visível**. Ordem: **preservar as duas, não arquivar nem excluir.**

**Efeito colateral do fluxo, que precisa ser decidido antes de enviar.**
`findOrCreatePerson` (`pipedrive-server.ts:167`) busca a pessoa **pelo
e-mail** e reusa a que existir. Até aí, bom: o negócio nasce ligado à 3588 e
nenhuma pessoa duplicada é criada.

O problema é o que vem logo depois, na linha 172:

```ts
if (phone || orgId) {
  await fetch(pipedriveUrl(`/persons/${existingId}`), {
    method: 'PUT',
    body: JSON.stringify({
      ...(phone ? { phone: [{ value: phone, primary: true }] } : {}),
      ...(orgId ? { org_id: orgId } : {}),
    }),
  })
}
```

**O envio do formulário vai ESCREVER na pessoa 3588:**

| Campo | O que acontece |
|---|---|
| Telefone | **substituído** pelo WhatsApp do formulário. É `phone: [ ... ]`, uma lista nova — o telefone que estiver lá hoje **é perdido** |
| Organização | **trocada** pela organização resolvida a partir do campo "Empresa". `findOrCreateOrg` busca por **nome**: se o texto digitado não casar com o nome da organização 1849, ele **cria uma organização nova** e **desvincula** a pessoa da 1849 |

Isso não é bug: é o comportamento da base, igual para qualquer lead
recorrente. Mas colide com "preservar o registro preexistente".

**Três saídas. A escolha é de vocês, eu não decido isso sozinho:**

| Opção | O que fazer | Custo |
|---|---|---|
| **A — anotar antes** | Anotar telefone e organização atuais da pessoa 3588 **antes** do envio, e no campo "Empresa" digitar **exatamente o nome da organização 1849**. Assim `findOrCreateOrg` acha a existente e o `org_id` não muda; só o telefone é sobrescrito, e dá para restaurar à mão depois | Telefone sobrescrito e restaurado manualmente |
| **B — outro e-mail** | Pedir ao Flávio um segundo endereço **sem cadastro** no Pipedrive, por exemplo `nome+qa@gmail.com`. O Gmail entrega no mesmo inbox, e para o Pipedrive é pessoa nova | Nada é tocado na 3588. **É a mais limpa** |
| **C — aceitar** | Enviar assim mesmo, com a alteração registrada | Perde o estado anterior da 3588 |

**Recomendo a B.** O sufixo `+qa` resolve sem tocar em registro preexistente
e sem pedir nada além de um endereço.

Se for A ou C, **anote antes do envio**: telefone atual da pessoa 3588 e o
nome e id da organização vinculada. Sem isso não há como restaurar.

### 2.1 UTM própria de QA

Entre no site **pela URL com UTM**, não pelo formulário direto. A atribuição
é de **primeiro toque** e grava um cookie `ciclo_attr` de 90 dias — se o
navegador já tiver esse cookie, a UTM nova **é ignorada**.

```
https://cicloecommerce.com.br/?utm_source=qa_migracao&utm_medium=teste&utm_campaign=qa_df452e3_20261018&utm_content=contato_home&utm_term=validacao_pos_migracao
```

**Antes de abrir: janela anônima nova, ou apague o cookie `ciclo_attr`.** Sem
isso a atribuição do teste não é a do teste.

Esses cinco valores são inventados de propósito e não colidem com campanha
real. Vão aparecer nos campos do negócio e nos parâmetros dos eventos, e são
o que vai permitir achar o registro depois sem usar PII.

---

## 3. O que esperar no Pipedrive

### 3.1 Onde o negócio nasce

A escolha é **por nome, não por id** (`pipedrive-server.ts:113-127`):

1. Se `PIPEDRIVE_STAGE_ID` estiver definida, ela manda.
2. Senão, o funil é o que casa com `PIPEDRIVE_PIPELINE_NAME`, ou — se ela não
   existir — **o primeiro cujo nome casa com `/site|whats/i`**.
3. A etapa é a que casa com `PIPEDRIVE_STAGE_NAME`, ou **a primeira com
   "entrada" no nome**.

**Esperado:** funil **"1 - Site/Whats (Passivo)" (2)**, etapa **de entrada**,
`status: open`.

### 3.2 Campos preenchidos

Os 8 de atribuição, por chave de hash (`pipedrive-fields.ts`):

| Campo | Valor esperado no teste |
|---|---|
| Origem (GA) | `qa_migracao` |
| Mídia (GA) | `teste` |
| Campanha (GA) | `qa_df452e3_20261018` |
| GA Client ID | o `_ga` do navegador — **precisa estar preenchido**, senão o `purchase` do GA4 não sai |
| GA Session ID | o da sessão |
| Landing Page | a URL com UTM |
| gclid | vazio, se não vier de anúncio |
| Atribuição extra (JSON) | contém `event_id`, `utm_content`, `utm_term`, `fbp`, `fbc` e afins |

**Confira o "Atribuição extra": ele NÃO pode conter `"internal":"true"`.** Se
contiver, o e-mail foi filtrado e o teste de CAPI está morto — ver 1.1.

### 3.3 Valor do negócio — atenção

**O negócio nasce SEM valor.** O POST de criação (`pipedrive-server.ts:250`)
não envia `value`. Consequência ao marcar ganho:

- GA4 `purchase` vai com `value: 0` e o log registra
  *"ganho com valor 0/nulo — enviando mesmo assim"*;
- Meta `Purchase` vai com `value: 0`.

**Se quiser testar valor,** preencha um valor no negócio **antes** de marcar
ganho — um valor simbólico, e anote qual. Isso é edição do registro de teste,
não de regra.

---

## 4. A sequência, e o que cada passo deve produzir

### Passo A — enviar o formulário

| Camada | Esperado |
|---|---|
| dataLayer | `generate_lead`, com `event_id` (UUID v4), `form: 'contato'`, `content_name: 'fale-com-especialista'`, `user_data`, e os campos de atribuição |
| Pixel da Meta (navegador) | `Lead` com **`eventID` = esse mesmo UUID** |
| GA4 (navegador) | `generate_lead` com o mesmo `event_id` |
| Google Ads | conversão com transação = `event_id` |
| Servidor | `POST /api/pipedrive` cria o negócio e envia **Meta `Lead` pela CAPI com o MESMO UUID**, `action_source: 'website'` |
| Navegação | só depois de `waitForTags`, e aí vai para `/obrigado` |

**Anote o `event_id` do dataLayer.** Ele é a chave de tudo o que vem depois.
Para capturá-lo sem nenhuma extensão, no console antes de enviar:

```js
window.dataLayer.push = new Proxy(window.dataLayer.push, {
  apply(t, z, a) { console.log('[QA]', JSON.stringify(a[0])); return Reflect.apply(t, z, a) }
})
```

### Passo B — mover para "Lead Qualificado" (etapa 11)

| Camada | Esperado |
|---|---|
| GA4, pelo servidor | **`qualify_lead`**, `event_id` = **`pd-<dealId>-qualify_lead`** |
| Meta, pela CAPI | **`QualifiedLead`**, `event_id` = **`pd-<dealId>-qualifiedlead`**, `action_source: 'system_generated'` |

Pular etapas também dispara: a comparação é por `order_nr`, então mover
direto para "Proposta" gera `qualify_lead` **e** `ProposalSent`.

### Passo C — marcar como ganho

| Camada | Esperado |
|---|---|
| GA4 | **`close_convert_lead`**, `event_id` = `pd-<dealId>-close_convert_lead` |
| GA4 | **`purchase`**, `transaction_id` = `pd-<dealId>`, `sales_channel: 'pipedrive'` — **só se houver GA Client ID** |
| Meta | **`Purchase`**, `event_id` = `pd-<dealId>-purchase`, `order_id` = `pd-<dealId>` |
| Meta | **nenhum** evento de funil por etapa — o código pula isso quando é ganho |

Se `qualify_lead` ainda não tiver sido enviado, o ganho manda os dois.

### Passo D — repetir o movimento, para provar idempotência

Mova o negócio para a **mesma etapa** de novo.

**Esperado: nada é reenviado.** A resposta do webhook traz
`skipped: 'already_sent'`. Se algo for enviado duas vezes, é regressão.

---

## 5. Meta: `Lead` inicial × `QualifiedLead` e `Purchase`

Confundir os dois é o erro mais provável desta verificação.

| | **`Lead`** (passo A) | **`QualifiedLead` / `Purchase`** (B e C) |
|---|---|---|
| Origem | **navegador E servidor**, os dois | **só servidor** |
| `action_source` | `website` | `system_generated` |
| `event_id` | UUID v4 do navegador, **o mesmo nos dois envios** | `pd-<dealId>-<nome>`, só um envio |
| **Deduplicação** | **SIM, e é aqui que se prova** | **NÃO — e não deve haver.** Não existe par de navegador |
| No Events Manager | um evento, com os dois envios casados | um evento de servidor, sozinho |

**Só o `Lead` prova deduplicação.** Esperar dedup em `QualifiedLead` ou
`Purchase` é esperar algo que o código nunca fez — e, se aparecesse, seria
sinal de evento duplicado, não de acerto.

### 5.1 Como ler no Events Manager, sem PII

1. Teste de eventos ou visão do dataset `780524645411912`, janela do teste.
2. No evento **`Lead`**: dois envios, Navegador e Servidor, **casados pelo
   mesmo `eventID`**. A Meta mostra isso como evento deduplicado.
3. Os eventos de funil aparecem só como Servidor.
4. Confira o `event_source_url` do `Lead`: deve ser a página do formulário.

Se `META_TEST_EVENT_CODE` estiver definida em Production (item 2 de 1.3), os
eventos vão para a aba de teste e **não** para os relatórios.

---

## 6. GA4: qualificação e ganho, navegador × servidor

| Evento | Origem | Como achar |
|---|---|---|
| `generate_lead` | **navegador**, via GTM | Tempo real e DebugView |
| `qualify_lead` | **servidor**, Measurement Protocol | Tempo real; parâmetro `lead_origin: 'pipedrive'` |
| `close_convert_lead` | **servidor** | idem |
| `purchase` | **servidor** | `sales_channel: 'pipedrive'` separa do checkout da Hubla |

Os três de servidor carregam `client_id_source`: **`deal`** quando usaram o
GA Client ID capturado no formulário, **`fallback`** quando o lead não veio do
site. **No nosso teste tem de ser `deal`** — se vier `fallback`, a atribuição
não foi gravada no negócio, e isso é achado.

`session_id` só é enviado junto com `client_id` real. Com `fallback`, não vai.

### 6.1 Consultas no GA4, sem PII

Nenhum dado pessoal sai nos eventos: o que vai são ids técnicos e UTM.

- **Tempo real**, filtrando por `lead_campaign` = `qa_df452e3_20261018`.
- **DebugView**, se o navegador estiver em modo debug, para ver parâmetro a
  parâmetro.
- **Exploração**, dimensão `event_id`, métrica contagem de eventos — para
  confirmar que cada `event_id` aparece **uma vez**.

---

## 7. Supabase: provar aceitação e idempotência, sem PII

`conversion_events` **não guarda PII**: o `payload` da Meta registra só as
*chaves* de `user_data`, não os valores (`meta-capi.ts:172`).

Colunas: `platform`, `event_name`, `event_id`, `action_source`, `status`,
`deal_id`, `person_id`, `uid`, `payload`, `response`, `sent_at`.

**Linha a linha do teste** — troque `<dealId>`:

```sql
select platform, event_name, event_id, action_source, status, sent_at,
       response->>'events_received' as meta_recebidos,
       response->>'status'          as http_status
from conversion_events
where deal_id = <dealId>
order by sent_at;
```

**O que uma execução correta mostra:**

| platform | event_name | event_id | status |
|---|---|---|---|
| meta | `Lead` | o UUID do navegador | `sent` |
| ga4 | `qualify_lead` | `pd-<dealId>-qualify_lead` | `sent` |
| meta | `QualifiedLead` | `pd-<dealId>-qualifiedlead` | `sent` |
| ga4 | `close_convert_lead` | `pd-<dealId>-close_convert_lead` | `sent` |
| meta | `Purchase` | `pd-<dealId>-purchase` | `sent` |

**Idempotência — a consulta que importa:**

```sql
select platform, event_name, count(*) as vezes
from conversion_events
where deal_id = <dealId>
group by platform, event_name
having count(*) > 1;
```

**Tem de voltar vazio.** Qualquer linha aqui é contagem dupla.

**Agregado sem citar o negócio:**

```sql
select platform, event_name, status, count(*)
from conversion_events
where sent_at >= '<início do teste em UTC>'
group by 1,2,3 order by 1,2,3;
```

### 7.1 Por que HTTP 200 não prova nada

O webhook do Pipedrive **sempre responde 200 depois de autenticar** — é
proposital, para o Pipedrive não desativá-lo. Ele responde 200 inclusive
quando pula o evento, quando não acha o negócio e quando dá erro interno.

**A prova de entrega é a linha em `conversion_events` com `status = 'sent'`**
e, no caso da Meta, `response->>'events_received' = '1'`. E mesmo
`events_received = 1` diz que a Meta **recebeu**, não que casou o par — isso
só o Events Manager mostra.

---

## 8. Identificar e restaurar o registro de teste

### 8.1 Como achar depois

| Chave | Onde |
|---|---|
| `utm_campaign = qa_df452e3_20261018` | Campo "Campanha (GA)" do negócio |
| `event_id` do passo A | Campo "Atribuição extra", e em `conversion_events` |
| `deal_id` | Anote no passo A |

Anote os três no momento do teste. Depois, procurar por nome ou e-mail é
procurar por PII — evite.

### 8.2 Como restaurar

| Fazer | Não fazer |
|---|---|
| **Arquivar** o negócio de teste no Pipedrive | **Não apagar nada de `conversion_events`** |
| **Preservar a pessoa 3588 e a organização 1849** — são preexistentes | **Não arquivar nem excluir** nenhuma das duas |
| Se usar a opção A ou C de 2.0: restaurar à mão o telefone e o vínculo de organização da pessoa 3588 | Não apagar linhas de `site_visitors` nem de `site_events` |
| Registrar `deal_id`, `event_id`, `person_id` e o horário UTC no relatório | Não tocar em negócio de cliente real |

**Se a opção B for escolhida** (e-mail com `+qa`), a pessoa criada pelo teste
é nova e pode ser arquivada; a 3588 e a 1849 nem são tocadas.

**Por que não apagar os eventos:** `conversion_events` é o que garante a
idempotência. Apagar a linha do teste faria o sistema reenviar os mesmos
eventos se aquele negócio fosse mexido de novo — exatamente o problema que a
tabela existe para evitar. E são eventos que **realmente aconteceram**: o
histórico ficaria mentindo.

As linhas do teste ficam identificadas pelo `deal_id` e pelo `event_id`
anotados. É assim que se separa teste de produção em consulta futura:

```sql
-- excluir o teste de uma contagem, sem apagar nada
select platform, event_name, count(*)
from conversion_events
where deal_id is distinct from <dealId>
group by 1,2;
```

**No GA4 e na Meta não dá para apagar evento enviado.** Os 4 ou 5 hits do
teste ficam nos relatórios para sempre. É o custo do teste, e é pequeno —
mas é irreversível, e o Flávio precisa saber disso antes, não depois.

---

## 9. Checklist de execução

Antes:

- [ ] Contato externo autorizado recebido (1.2), **fora de
      `INTERNAL_EMAIL_DOMAINS`** — **feito:** Gmail do Flávio
- [ ] **Decidida a opção de 2.0** (A, B ou C) para o cadastro preexistente
- [ ] Se A ou C: telefone e organização atuais da pessoa 3588 **anotados**
- [ ] As três confirmações de 1.3 feitas, **sem alterar nada**
- [ ] Janela anônima, sem cookie `ciclo_attr`
- [ ] Proxy do dataLayer colado no console (passo A)
- [ ] Horário UTC de início anotado

Durante:

- [ ] A: enviar, anotar `event_id` e `deal_id`
- [ ] A: conferir funil, etapa e os 8 campos; **"Atribuição extra" sem
      `internal`**
- [ ] A: Events Manager — `Lead` com Navegador + Servidor **deduplicados**
- [ ] B: mover para etapa 11 → `qualify_lead` + `QualifiedLead`
- [ ] C: (opcional) pôr valor; marcar ganho → `close_convert_lead`,
      `purchase`, `Purchase`
- [ ] D: repetir o movimento → **nada reenviado**
- [ ] Rodar as consultas da seção 7

Depois:

- [ ] Arquivar **o negócio** de teste. **Preservar a pessoa 3588 e a
      organização 1849**
- [ ] **Não** apagar nada de `conversion_events`
- [ ] Registrar `deal_id`, `event_id`, `person_id` e os horários

---

## 10. O que fazer se divergir

Regra do Flávio: **restaurar o comportamento da base**, não redesenhar.

| Sintoma | Primeira hipótese | Ação |
|---|---|---|
| Nenhum evento de funil na Meta | e-mail interno, ou `internal: true` no negócio | Conferir 1.1. Não é bug |
| `qualify_lead` não sai | funil fora de `{2, 13}`, ou etapa antes da de qualificação | Conferir 3.1 e 1.3 |
| `purchase` não sai no GA4 | negócio sem GA Client ID | Conferir 3.2 |
| `client_id_source: fallback` | atribuição não gravada no negócio | **Achado.** Reportar |
| `Lead` não deduplica | `eventID` diferente entre Pixel e CAPI | **Achado grave.** Reportar com os dois ids |
| Evento duplicado | idempotência | **Achado grave.** Reportar com a consulta de 7 |

Em todos: me mande `deal_id`, `event_id` e os horários UTC. Conserto para
voltar ao comportamento da base — descrito ramo por ramo no passo 19 da
suíte. Se a regressão for crítica, rollback pelo Promote do
`Hb5TEUapVasyUCm9amGRnRzDyAhe`.

---

# 11. O relatório "Aquisição de leads" do GA4 e o playbook

Escopo pedido pelo Flávio por volta das 21h, para **análise agora e
configuração só depois da validação**. Nada foi configurado, nenhum código
foi alterado, o playbook segue intocado.

## 11.1 De quais eventos o relatório depende

Documentação do Google. O relatório é alimentado por eventos de lead
recomendados, e **cada métrica conta usuários únicos com aquele evento**:

| Métrica | Evento que a alimenta |
|---|---|
| **Novos leads** | `generate_lead` |
| **Leads qualificados** | `qualify_lead` |
| **Leads convertidos** | `close_convert_lead` |
| — (sem métrica no relatório) | `working_lead` |

`disqualify_lead` e `close_unconvert_lead` alimentam outro relatório, o de
desqualificação e perda.

**Consequência que importa aqui: evento customizado não entra.** Só esses
nomes exatos alimentam as métricas.

## 11.2 O que o playbook emite hoje — evidência no código

**O playbook dispara `playbook_form_submit`, e NÃO dispara `generate_lead`.**
São dois pontos de emissão, ambos com o mesmo nome:

| Caminho | Linha | Evento | `userData` |
|---|---|---|---|
| Manual | `PlaybookForm.tsx:100` | `playbook_form_submit` | **sim** — e-mail, telefone, nome |
| LinkedIn | `PlaybookForm.tsx:80` | `playbook_form_submit` | **não** |

Nenhum `generate_lead` em lugar nenhum do arquivo. Confirmado por busca no
arquivo inteiro.

**No GTM:** o gatilho "CE Conversões" cobre `playbook_form_submit` pela
regex, então o GA4 recebe **o evento customizado**.

> **Correção, e ela é minha.** Eu tinha escrito que "não há tradução em parte
> alguma", misturando duas afirmações de peso diferente. A ausência **no
> código** eu verifiquei e sustento. A ausência **no GTM e no GA4 eu não
> posso afirmar**: uma tag de tradução no container, ou um **evento derivado
> criado dentro do próprio GA4**, produziriam `generate_lead` sem deixar
> rastro nenhum no repositório — e o evento derivado nem fica no GTM.
>
> **Antes de adicionar qualquer coisa, verificar nos dois lugares:**
>
> | Onde | O que procurar |
> |---|---|
> | GTM, container `GTM-5NNPNZ` | tag de evento GA4 com nome `generate_lead` disparando a partir de `playbook_form_submit` |
> | GA4, Administrador → Eventos | **Criar evento** e **Modificar evento** — um evento derivado de `playbook_form_submit` para `generate_lead` |
>
> Se qualquer um dos dois já existir, a proposta de 11.5 **não deve ser
> executada**: ela duplicaria.

**Na Meta é diferente, e vale registrar:** o playbook posta em
`/api/pipedrive` com `pipeline: 'Playbook'`, e essa rota envia **`Lead` pela
CAPI** como qualquer outro lead (`/api/pipedrive/route.ts:131`). Então, **na
Meta o playbook já conta como Lead; no GA4, não conta como lead.** A lacuna é
só do lado do GA4.

## 11.3 Qualificação e conversão: já funcionam

A regra em `ga4-lead-events.ts:30` já inclui o funil do playbook:

```ts
const DEFAULT_QUALIFY_STAGE_BY_PIPELINE: Record<number, number> = {
  2: 11,   // 1 - Site/Whats  -> Lead Qualificado
  13: 96,  // Playbooks       -> SQL / Oportunidade
}
```

E o lead do playbook nasce no funil 13: o POST manda `pipeline: 'Playbook'`,
que `findStageId` resolve para a primeira etapa do funil cujo nome contém
"playbook".

**Então `qualify_lead` e `close_convert_lead` já saem para leads do
playbook** — desde que o e-mail não seja interno e alguém mova o negócio.

## 11.4 O problema que isso cria hoje

Juntando 11.1, 11.2 e 11.3:

| Métrica do relatório | Lead do contato | **Lead do playbook** |
|---|---|---|
| Novos leads | conta | **NÃO conta** |
| Leads qualificados | conta | **conta** |
| Leads convertidos | conta | **conta** |

**O playbook aparece qualificando e convertendo sem nunca ter entrado como
lead.** O denominador falta. Qualquer taxa de qualificação ou de conversão
calculada no relatório fica distorcida — e para mais, não para menos.

Há um agravante: as métricas contam **usuários únicos**. Os eventos de
qualificação e conversão saem pelo Measurement Protocol usando o GA Client ID
guardado no negócio; **sem ele**, `sendGa4LeadEvent` usa um `client_id` de
fallback (`pd-<dealId>`), que é um "usuário" que nunca existiu no site. Esse
caso é qualificação sem origem **por construção**, mesmo que o
`generate_lead` passasse a existir.

O playbook **captura** o GA Client ID (`attribution.ts:188` lê o cookie
`_ga`), então o caso normal está coberto. O fallback só aparece em lead que
não veio do site.

## 11.5 Proposta mínima — condicionada à validação

**Não executar antes de os testes da seção 9 passarem.** O que segue é
proposta, não instrução de execução.

### Opção recomendada: uma tag no GTM, sem tocar no código

Adicionar **uma** tag de evento GA4 que envia `generate_lead` quando o
dataLayer recebe `playbook_form_submit`.

| Item | Valor |
|---|---|
| Tipo | Evento GA4, mesma configuração de medição já usada |
| Nome do evento | `generate_lead` |
| Gatilho | **evento customizado, nome exatamente `playbook_form_submit`** |
| Parâmetros | `event_id` = `{{DLV - event_id}}`, `form` = `playbook`, `method`, `content_name`, `lead_source`, `lead_medium`, `lead_campaign` — todos já no dataLayer |

**Por que esta e não outra:**

- O playbook **não é tocado**. Nem o código, nem o formulário, nem o
  `playbook_form_submit` que já existe.
- A série histórica de `playbook_form_submit` continua intacta.
- É reversível em um clique: pausar a tag.

### O risco de duplicidade, e como evitá-lo

**Há um jeito errado de fazer isto, e ele é o caminho mais curto.**

O gatilho "CE Conversões" do container é uma **regex que cobre vários
eventos ao mesmo tempo**, incluindo `generate_lead` e `playbook_form_submit`.
Se a tag nova for pendurada nesse gatilho, ela dispararia **também no envio
do formulário de contato** — que já emite `generate_lead` — e o GA4 passaria a
receber **dois `generate_lead` por um único lead**.

**O gatilho da tag nova tem de ser exclusivo de `playbook_form_submit`.** Um
gatilho novo, de evento customizado, com igualdade exata. Não reaproveitar o
"CE Conversões".

Segunda checagem antes de publicar: confirmar que **nenhuma tag existente já
envia `generate_lead` a partir de `playbook_form_submit`**. A leitura do
container não mostrou nenhuma, mas isso se confere em segundos na pré-visão.

### O que muda na leitura do relatório

"Novos leads" passa a somar contato **e** playbook. É o que o Flávio pediu,
mas é uma mudança de definição: a série antes e depois da publicação da tag
**não é comparável**. Vale anotar a data da mudança para não ler degrau como
crescimento.

Se a intenção for distinguir os dois na análise, o parâmetro `form`
(`contato` × `playbook`) já vai no evento e serve de dimensão — sem precisar
de evento separado.

### O que NÃO propor

| Alternativa | Por que não |
|---|---|
| Fazer o playbook emitir `generate_lead` no código | **Playbook congelado.** Fora de questão |
| Renomear `playbook_form_submit` para `generate_lead` no GTM | Perde a série histórica e apaga um evento que já existe |
| Marcar `playbook_form_submit` como evento principal | Resolveria contagem de conversão, **não** alimenta "Novos leads" — a métrica é por nome de evento |

## 11.6 Como verificar depois, sem configurar nada agora

Antes de qualquer mudança, dá para medir a lacuna na própria property
`402971489`:

> **Correção, também minha.** Eu tinha proposto comparar "Novos leads" com a
> contagem de `playbook_form_submit` e tratar a diferença como o tamanho da
> lacuna. **Isso está errado, e não é detalhe de redação.** São grandezas
> diferentes:
>
> - **Novos leads** conta **usuários únicos** com `generate_lead`.
> - A contagem de `playbook_form_submit` em Eventos conta **eventos**.
>
> Três motivos pelos quais subtrair um do outro não dá a lacuna:
>
> 1. **Repetição** — a mesma pessoa pode baixar o playbook mais de uma vez;
>    eventos sobem, usuários não.
> 2. **Sobreposição** — quem baixou o playbook **e** preencheu o contato já
>    está contado em "Novos leads". Esse usuário não é lacuna nenhuma.
> 3. **Unidade de contagem** — "usuário" no GA4 é `client_id`, ou seja
>    navegador/dispositivo, não pessoa. A mesma pessoa em dois aparelhos são
>    dois usuários.
>
> **A diferença entre os dois números não é a lacuna, e não deve ser
> apresentada como tal.**

A forma honesta de dimensionar, e ainda assim é **estimativa**:

1. Relatório **Aquisição de leads** (`ruid=lead-acquisition`), últimos 28 dias
   — anotar **Novos leads**, **Leads qualificados** e **Leads convertidos**.
2. Numa **Exploração**, métrica **Usuários ativos** (não contagem de eventos),
   segmentada por quem disparou `playbook_form_submit` e por quem disparou
   `generate_lead`.
3. Olhar a **sobreposição** entre os dois segmentos. Quem está só no primeiro
   é a estimativa de usuário que qualifica sem ter entrado como lead.

Mesmo assim fica estimativa: amostragem, janelas de atribuição e multi-
dispositivo afetam o número. **Serve de ordem de grandeza e de linha de
base**, não de medida exata.

## 11.7 Resumo em quatro linhas

- **No código**, o playbook emite só `playbook_form_submit`; não emite
  `generate_lead`. Isso está verificado.
- **No GTM e no GA4, a ausência de tradução ainda NÃO está verificada** — tag
  de tradução ou evento derivado produziriam `generate_lead` sem aparecer no
  código. **Checar antes de propor qualquer tag.**
- Se de fato não houver tradução: o playbook **não entra em "Novos leads"**,
  mas **entra** em "Leads qualificados" e "Leads convertidos", porque o funil
  13 já está na regra. Resultado: qualificação e conversão sem o lead de
  origem.
- **O tamanho dessa lacuna não é a diferença entre dois números do painel** —
  usuários únicos e eventos não se subtraem. Só dá para estimar por
  sobreposição de segmentos.
- Correção mínima, **se e só se** a checagem confirmar a ausência: uma tag no
  GTM com gatilho exclusivo de `playbook_form_submit`, depois da validação, e
  nunca no gatilho "CE Conversões".

---

# 12. Pendências registradas, não executadas

## 12.1 Favicon

Pedido do Flávio: trocar o favicon pela imagem `icon-site-ciclo.png`.

| | |
|---|---|
| Estado | **Pendente. Não executar agora** |
| Arquivo | **Ainda não recebido por mim.** Conferido pela revisão, mas não chegou a esta sessão |
| Quando | Depois de concluídas as validações de dados |
| Onde | O favicon atual vive em `src/app/` — `favicon.ico`, `icon.png` e `icon.svg`. O Next serve os três por convenção de arquivo |

Quando chegar a hora, isto precisa de atenção, porque **não é trocar um
arquivo só**: há três entradas, e deixar uma desatualizada faz o navegador
escolher a antiga. Além disso, `logo-ciclo.png` é referenciado em JSON-LD de
várias páginas e **não** é o favicon — não confundir.

Nada disso será feito sem o arquivo em mãos e sem a validação concluída.

## 12.2 Tag de `generate_lead` para o playbook

Ver seção 11. **Condicionada** a duas coisas, nesta ordem:

1. A checagem de 11.2 confirmar que **não existe** tag de tradução no GTM
   nem evento derivado no GA4.
2. As validações da seção 9 passarem.

Não será configurada por mim em hipótese alguma.
