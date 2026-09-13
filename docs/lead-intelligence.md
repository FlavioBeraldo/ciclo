# Inteligência de Leads — site → Supabase → Pipedrive → Claude

Módulo que registra a navegação dos visitantes, reflete conversões no Pipedrive e
enriquece leads novos com a API da Anthropic.

## Fluxo

1. **Identidade** — todo visitante recebe o cookie httpOnly `ciclo_uid` (uuid, 365 dias),
   criado anônimo por `GET /api/track/init`. Ao enviar um formulário (ou entrar pelo
   LinkedIn), o servidor vincula o uid à Person do Pipedrive (`site_visitors.pipedrive_person_id`).
   A atribuição de primeiro toque vive no cookie `ciclo_attr` (90 dias).
2. **Eventos** — o site envia `page_view` em toda navegação e eventos de interação
   (`form_submit`, `material_download`, `popup_view`, `popup_click`, `whatsapp_click`,
   `cta_click`, `video_play`, `scroll_75`) via `POST /api/track` → tabela `site_events`.
3. **Atividades em tempo real** — conversões de visitante já vinculado viram Activity
   concluída no Pipedrive (pessoa + negócio aberto mais recente), com dedupe de 1h
   por uid+tipo+página.
4. **Digest diário** — cron às 09:00 BRT resume a navegação das últimas 24h de cada
   pessoa vinculada numa Note (pessoa + negócio), controlado por `site_visitors.last_digest_at`.
5. **Enriquecimento** — webhook `added.deal` dispara duas análises no Claude (empresa e
   pessoa, com web search) que viram Notes `[Enriquecimento automático]` e preenchem
   campos vazios do negócio.

## Tabelas (Supabase)

- `site_visitors` — uid (pk), pipedrive_person_id, email, ga_client_id, opted_out,
  first_seen, last_seen, last_digest_at. RLS ligado sem policies (só a service role acessa).
- `site_events` — uid (fk), occurred_at, type, path, title, referrer,
  source/medium/campaign (do `ciclo_attr`), meta jsonb. Índices: (uid, occurred_at) e (type).

Migration: `supabase/migrations/20260913180000_site_identity.sql`.

## Rotas

| Rota | Função | Teste rápido |
|---|---|---|
| `GET /api/track/init` | cria `ciclo_uid` anônimo | `curl -D - https://cicloecommerce.com.br/api/track/init` → 204 + Set-Cookie |
| `POST /api/track` | grava evento (allowlist, rate limit 60/min/uid, respeita DNT e opted_out) | `curl -X POST .../api/track -H 'Content-Type: application/json' -H 'Cookie: ciclo_uid=<uuid>' -d '{"type":"page_view","path":"/"}'` → 204 |
| `GET /api/track/optout` | opt-out LGPD: marca `opted_out`, apaga cookies | abrir no navegador → redireciona à política com confirmação |
| `GET /api/cron/site-digest` | digest diário (Bearer `CRON_SECRET`) | ver "como validar" abaixo |
| `POST /api/pipedrive/webhook` | negócio ganho → `purchase` no GA4 | `?debug=1` devolve a validação do GA |
| `POST /api/pipedrive/enrich` | added.deal → enriquecimento em background | responde `{accepted:true}` na hora |
| `GET /api/pipedrive/enrich?deal_id=NNN` | enriquecimento síncrono (validação) | devolve o JSON gerado; `&force=1` ignora a idempotência |

## Webhooks a registrar no Pipedrive

Ferramentas → Webhooks, ambos com auth Basic (usuário `pipedrive`, senha = `PIPEDRIVE_WEBHOOK_SECRET`):

1. **updated.deal** → `https://cicloecommerce.com.br/api/pipedrive/webhook` (já existente no código; envia receita de negócio ganho ao GA4)
2. **added.deal** → `https://cicloecommerce.com.br/api/pipedrive/enrich` (enriquecimento)

## Cron

`vercel.json` agenda `GET /api/cron/site-digest` em `0 12 * * *` UTC (09:00 BRT).
A Vercel envia `Authorization: Bearer $CRON_SECRET` automaticamente quando a env existe.

## Opt-out e LGPD

- Checkbox dos formulários cobre contato + registro de navegação.
- Seção 12 da política de privacidade explica os cookies; o link
  `GET /api/track/optout` apaga `ciclo_uid`/`ciclo_attr` e marca `opted_out`
  (nenhum evento novo é gravado). `navigator.doNotTrack === '1'` desativa o
  cliente inteiro. Retenção declarada: 12 meses.

## Custos (Anthropic)

Cada deal novo gera **2 chamadas** ao modelo (`ANTHROPIC_MODEL`, default
`claude-sonnet-4-5`) com `max_tokens 4000` e até **8 buscas web cada**.
Ordem de grandeza: centavos de dólar por lead (tokens + $10/1k buscas).
Com volume alto, configure alerta de billing na console da Anthropic.
E-mail genérico sem organização faz só a análise de pessoa (1 chamada).

## Como validar em produção

1. **page_view no Supabase** — navegue pelo site e rode no SQL Editor:
   `select type, path, source, occurred_at from site_events order by occurred_at desc limit 20;`
2. **Activity após download** — com um lead de teste já criado (uid vinculado),
   baixe o playbook de novo em `/playbook-social-commerce`; em ~5s deve aparecer a
   activity concluída "Site: baixou Playbook de Social Commerce" na pessoa/negócio.
3. **Digest manual** —
   `curl https://cicloecommerce.com.br/api/cron/site-digest -H "Authorization: Bearer $CRON_SECRET"`
   → `{"processed":N,"skipped":M}` e a Note "Navegação no site em..." nas pessoas com atividade.
4. **Enrich manual** —
   `curl "https://cicloecommerce.com.br/api/pipedrive/enrich?secret=$PIPEDRIVE_WEBHOOK_SECRET&deal_id=NNN&force=1"`
   → devolve o JSON de empresa/pessoa e cria as duas Notes no deal.
