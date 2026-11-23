-- Histórico isolado do consentimento, sem dados de formulário, URL ou IP.
create table if not exists public.privacy_consent_events (
  id uuid primary key default gen_random_uuid(),
  browser_ref uuid not null,
  recorded_at timestamptz not null default now(),
  policy_version text not null,
  analytics boolean not null,
  marketing boolean not null
);
alter table public.privacy_consent_events enable row level security;
revoke all on public.privacy_consent_events from anon, authenticated, public;
grant insert, select on public.privacy_consent_events to service_role;
