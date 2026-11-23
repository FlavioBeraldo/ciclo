-- Fila exclusiva dos dois sinais adicionais. Não contém identificadores de contato.
create table if not exists public.perfil_a_entregas (
  event_id text primary key, nome text not null, recibo uuid not null,
  criado timestamptz not null default now(), tentativa timestamptz not null default now(),
  enviado boolean not null default false
);
create index if not exists perfil_a_entregas_sessao on public.perfil_a_entregas(recibo,nome,criado desc);
alter table public.perfil_a_entregas enable row level security;
revoke all on public.perfil_a_entregas from public, anon, authenticated;
grant select, insert, update on public.perfil_a_entregas to service_role;

create or replace function public.perfil_a_reservar(p_id text,p_nome text,p_recibo uuid,p_versao text)
returns text language plpgsql security invoker set search_path = public, pg_temp as $$
declare escolha record; anterior public.perfil_a_entregas%rowtype;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_recibo::text,0));
  select marketing, analytics, recorded_at, policy_version into escolha from public.privacy_consent_events
    where browser_ref=p_recibo order by recorded_at desc, id desc limit 1;
  if not found or not escolha.marketing or not escolha.analytics or escolha.policy_version<>p_versao
    or escolha.recorded_at < now()-interval '180 days' then return 'negado'; end if;
  select * into anterior from public.perfil_a_entregas where event_id=p_id for update;
  if found then
    if anterior.recibo<>p_recibo or anterior.nome<>p_nome then return 'negado'; end if;
    if anterior.enviado then return 'entregue'; end if;
    if anterior.tentativa>now()-interval '20 seconds' then return 'aguarde'; end if;
    update public.perfil_a_entregas set tentativa=now() where event_id=p_id;
  else
    if p_nome='visita_perfil_a' and exists(select 1 from public.perfil_a_entregas
       where recibo=p_recibo and nome=p_nome and criado>now()-interval '30 minutes') then return 'sessao'; end if;
    insert into public.perfil_a_entregas(event_id,nome,recibo) values(p_id,p_nome,p_recibo);
  end if;
  return 'enviar';
end; $$;
revoke all on function public.perfil_a_reservar(text,text,uuid,text) from public, anon, authenticated;
grant execute on function public.perfil_a_reservar(text,text,uuid,text) to service_role;
