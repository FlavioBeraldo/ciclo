-- Módulo E: mensuração server-side (Meta CAPI / GA4 MP / Google Ads)
-- Log de cada conversão enviada às plataformas + dados de correspondência do visitante.

create table if not exists public.conversion_events (
  id bigserial primary key,
  sent_at timestamptz not null default now(),
  platform text not null,             -- meta | ga4 | google_ads | tiktok
  event_name text not null,           -- Lead, Schedule, Purchase, ...
  event_id text not null,             -- mesmo id usado no navegador (dedup)
  action_source text,                 -- website | system_generated
  status text not null,               -- sent | error | skipped
  deal_id integer,
  person_id integer,
  uid uuid,
  payload jsonb,                      -- evento enviado (sem PII)
  response jsonb                      -- resposta da plataforma
);

create index if not exists conversion_events_deal_idx on public.conversion_events (platform, event_name, deal_id);
create index if not exists conversion_events_event_id_idx on public.conversion_events (event_id);
create index if not exists conversion_events_sent_at_idx on public.conversion_events (sent_at desc);

-- Dados de correspondência guardados no lead para eventos offline (Pipedrive -> Meta)
alter table public.site_visitors add column if not exists fbp text;
alter table public.site_visitors add column if not exists fbc text;
alter table public.site_visitors add column if not exists client_ip text;
alter table public.site_visitors add column if not exists user_agent text;

alter table public.conversion_events enable row level security;
