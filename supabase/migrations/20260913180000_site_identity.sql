-- Módulo A: identidade e eventos do site (site -> Supabase)
-- Visitantes identificados por cookie ciclo_uid (uuid) e eventos de navegação.

create table if not exists public.site_visitors (
  uid uuid primary key,
  pipedrive_person_id integer,
  email text,
  ga_client_id text,
  opted_out boolean not null default false,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

create table if not exists public.site_events (
  id bigserial primary key,
  uid uuid not null references public.site_visitors (uid) on delete cascade,
  occurred_at timestamptz not null default now(),
  type text not null,
  path text,
  title text,
  referrer text,
  source text,
  medium text,
  campaign text,
  meta jsonb
);

create index if not exists site_events_uid_occurred_at_idx
  on public.site_events (uid, occurred_at);

create index if not exists site_events_type_idx
  on public.site_events (type);

-- RLS ligado sem policies: apenas a service role (que ignora RLS) lê/escreve.
alter table public.site_visitors enable row level security;
alter table public.site_events enable row level security;
