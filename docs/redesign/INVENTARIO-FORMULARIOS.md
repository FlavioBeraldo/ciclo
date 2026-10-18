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
