# Mensuração — Pixel + CAPI (Meta), GA4, Google Ads e Pipedrive

Arquitetura implementada em set/2026. Objetivo: todas as plataformas recebem os
mesmos eventos, com o mesmo `event_id`, sem duplicidade e com dados de
correspondência (e-mail/telefone hasheados).

## Fluxo de uma conversão (formulário)

1. **Cliente** (`src/lib/conversions.ts`): `newEventId()` gera um UUID e
   `pushConversion(evento, {...})` publica no `dataLayer`:
   `event`, `event_id`, `user_data` (email, phone_number, first_name, last_name — texto claro,
   o GTM faz o hash), `lead_source/medium/campaign`, `content_name`, `value/currency`.
   O push traz `eventCallback`, e `waitForTags(eventId)` espera os tags dispararem
   (máx. ~2s) antes de qualquer navegação — era aqui que o `Lead` se perdia antes.
2. **GTM (GTM-5NNPNZ)** dispara com o mesmo `event_id`: Meta Pixel (`Lead`, com
   Advanced Matching manual), GA4 (`generate_lead`/`playbook_form_submit`), Google Ads
   (conversão + Enhanced Conversions), TikTok.
3. **Servidor** (`POST /api/pipedrive`): cria o deal, grava `event_id`/`fbp`/`fbc`/`ttclid`
   no JSON "Atribuição extra (GA)" do deal, vincula o `ciclo_uid` e envia o `Lead` à
   **API de Conversões** (`src/lib/meta-capi.ts`) com `event_id` idêntico ao do Pixel,
   `em/ph/fn/ln` SHA-256, `external_id` (= `ciclo_uid`), `fbp`, `fbc`, IP e User-Agent.
   E-mails de `INTERNAL_EMAIL_DOMAINS` não geram conversão (deal recebe `internal:true`).
4. **Cadastro via LinkedIn**: o callback cria o deal, envia a CAPI e devolve
   `?li=done&eid=<event_id>`; a LP usa esse `eid` no push do Pixel (dedup).
5. **Log**: cada envio vai para `conversion_events` (Supabase) sem PII.

## Eventos

| dataLayer (site) | Meta | GA4 | Google Ads |
|---|---|---|---|
| `generate_lead` (form contato) | `Lead` (content_name `fale-com-especialista`) | `generate_lead` (key event) | conversão Lead |
| `playbook_form_submit` | `Lead` (content_name `playbook-social-commerce`) | `playbook_form_submit` (key event) | conversão Playbook* |
| `begin_checkout` (Ecomshift → Hubla) | `InitiateCheckout` (37,90 BRL) | `begin_checkout` | — |
| `playbook_popup_view/click/dismiss` | — | eventos (não-conversão) | — |

\* exige criar a ação de conversão no Google Ads e colocar o label na tag do GTM.

## Conversões offline (Pipedrive → Meta)

Webhook `updated.deal` → `POST /api/pipedrive/webhook` (`src/lib/pipedrive-funnel-events.ts`):

| Etapa (nome contém) | Evento Meta | action_source |
|---|---|---|
| Agendamento / Reunião agendada | `Schedule` | system_generated |
| Reunião realizada / Call realizada / Call de validação | `MeetingHeld` (custom) | system_generated |
| Lead Qualificado / Qualificação | `QualifiedLead` (custom) | system_generated |
| Oportunidade | `Opportunity` (custom) | system_generated |
| Apresentação de Proposta | `ProposalSent` (custom) | system_generated |
| status `won` | `Purchase` (valor do deal) + `purchase` no GA4 (MP) | system_generated |

Idempotente por (deal, evento) via `conversion_events`. Correspondência: e-mail/telefone
da Person + `fbp/fbc/IP/UA` guardados em `site_visitors` no momento do lead.
`event_id` = `pd-<dealId>-<evento>`.

## Variáveis de ambiente novas

`META_CAPI_TOKEN` (obrigatória), `META_PIXEL_ID`, `META_TEST_EVENT_CODE`, `INTERNAL_EMAIL_DOMAINS`.

## Migration

`supabase/migrations/20260915120000_conversion_events.sql` — tabela `conversion_events`
e colunas `fbp/fbc/client_ip/user_agent` em `site_visitors`. Rodar no SQL Editor do Supabase.

## Como validar

1. Events Manager → Px da Ciclo → **Testar eventos**: defina `META_TEST_EVENT_CODE` na
   Vercel (Preview), envie o formulário e confira `Lead` chegando por *Navegador* e
   *Servidor* com o mesmo ID e a marcação "Deduplicado".
2. `select * from conversion_events order by sent_at desc limit 20;` no Supabase.
3. GA4 DebugView: `generate_lead` com `event_id`, `lead_source`.
4. Mova um deal de teste para "Agendamento call" e confira `Schedule` no Events Manager
   (ou `?debug=1` no webhook).
