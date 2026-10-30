// Conversões offline: etapas do funil do Pipedrive -> eventos da Meta (CAPI).
//
// Permite otimizar campanhas por "reunião agendada"/"lead qualificado"/"fechamento",
// e não só por formulário. Os eventos usam action_source "system_generated"
// (gerados pelo CRM) e são deduplicados por deal em conversion_events.
import { pipedriveUrl, attributionFieldKeys } from './pipedrive-server'
import { conversionAlreadySent, getVisitorByPerson, sbSelect, type SiteVisitor, type VisitorMatchData } from './supabase-server'
import { isInternalEmail, sendMetaEvent, type MetaSendResult } from './meta-capi'

export interface FunnelEvent {
  name: string
  custom: boolean
}

/** Nome da etapa -> evento da Meta. Padrão da Meta quando existe; custom nos demais. */
export function stageToMetaEvent(stageName: string): FunnelEvent | null {
  const n = stageName.toLowerCase()
  if (/agendamento|reuni[aã]o (marcada|agendada)|call agendada/.test(n)) return { name: 'Schedule', custom: false }
  if (/reuni[aã]o realizada|call realizada|call de valida/.test(n)) return { name: 'MeetingHeld', custom: true }
  if (/lead qualificado|qualifica/.test(n)) return { name: 'QualifiedLead', custom: true }
  if (/oportunidade/.test(n)) return { name: 'Opportunity', custom: true }
  if (/proposta/.test(n)) return { name: 'ProposalSent', custom: true }
  return null
}

interface PipedrivePerson {
  id: number
  name?: string
  first_name?: string
  last_name?: string
  email?: { value: string; primary?: boolean }[]
  phone?: { value: string; primary?: boolean }[]
}

async function fetchPerson(personId: number): Promise<PipedrivePerson | null> {
  try {
    const res = await fetch(pipedriveUrl(`/persons/${personId}`))
    const json = await res.json()
    return json.success ? (json.data as PipedrivePerson) : null
  } catch {
    return null
  }
}

async function fetchStageName(stageId: number): Promise<string | null> {
  try {
    const res = await fetch(pipedriveUrl(`/stages/${stageId}`))
    const json = await res.json()
    return json.success ? (json.data?.name as string) : null
  } catch {
    return null
  }
}

function primary(list?: { value: string; primary?: boolean }[]): string | null {
  if (!list?.length) return null
  const filled = list.filter((e) => typeof e.value === 'string' && e.value.trim())
  return (filled.find((e) => e.primary) ?? filled[0])?.value.trim() || null
}

/** Recupera apenas o visitante comprovadamente vinculado ao mesmo lead e pessoa. */
async function originalLeadVisitor(dealId: number, personId: number) {
  try {
    const leads = await sbSelect<{ uid: string }>(
      `/conversion_events?platform=eq.meta&event_name=eq.Lead&deal_id=eq.${dealId}&person_id=eq.${personId}&status=eq.sent&uid=not.is.null&select=uid&order=sent_at.asc&limit=1`
    )
    const uid = leads[0]?.uid
    if (!uid || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uid)) return null
    const visitors = await sbSelect<SiteVisitor & VisitorMatchData>(
      `/site_visitors?uid=eq.${uid}&pipedrive_person_id=eq.${personId}&limit=1`
    )
    return visitors[0]?.opted_out ? null : visitors[0] ?? null
  } catch {
    // A melhoria de correspondência nunca deve impedir o evento do CRM.
    return null
  }
}

export interface DealLike {
  id: number
  title?: string
  value?: number
  currency?: string
  person_id?: number | { value: number } | null
  stage_id?: number
  pipeline_id?: number
  [key: string]: unknown
}

/**
 * Envia um evento de funil (ou Purchase) para a Meta a partir de um deal.
 * Idempotente por (deal, evento). Ignora leads internos e deals sem pessoa.
 */
export async function sendDealFunnelEvent(
  deal: DealLike,
  event: FunnelEvent,
  opts: { purchaseValue?: number } = {}
): Promise<MetaSendResult | { sent: false; skipped: string }> {
  // Purchase representa receita do CRM, não a conversão de lead do site.
  // Não inventar preço para negócios sem receita (incluindo testes com valor zero).
  const purchaseValue = opts.purchaseValue ?? Number(deal.value ?? 0)
  const purchaseCurrency = (deal.currency || 'BRL').trim().toUpperCase()
  if (event.name === 'Purchase') {
    if (!Number.isFinite(purchaseValue) || purchaseValue <= 0) {
      return { sent: false, skipped: 'invalid_purchase_value' }
    }
    if (!/^[A-Z]{3}$/.test(purchaseCurrency)) {
      return { sent: false, skipped: 'invalid_purchase_currency' }
    }
  }

  const dealId = Number(deal.id)
  if (await conversionAlreadySent('meta', event.name, dealId)) {
    return { sent: false, skipped: 'already_sent' }
  }

  const personId =
    typeof deal.person_id === 'number' ? deal.person_id : (deal.person_id as { value: number } | null)?.value
  if (!personId) return { sent: false, skipped: 'no_person' }

  const person = await fetchPerson(personId)
  if (!person) return { sent: false, skipped: 'person_not_found' }
  let email = primary(person.email)
  if (isInternalEmail(email)) return { sent: false, skipped: 'internal' }

  const keys = attributionFieldKeys()
  const str = (k: keyof typeof keys) => {
    const v = deal[keys[k]]
    return typeof v === 'string' && v.trim() !== '' ? v : undefined
  }
  let extra: Record<string, string> = {}
  try {
    extra = JSON.parse(str('extra') ?? '{}')
  } catch {
    extra = {}
  }
  if (String(extra.internal) === 'true') return { sent: false, skipped: 'internal' }

  const currentVisitor = await getVisitorByPerson(personId)
  const original = !currentVisitor?.fbp || !currentVisitor?.fbc || !currentVisitor?.client_ip || !currentVisitor?.user_agent || !email
    ? await originalLeadVisitor(dealId, personId)
    : null
  const visitor = currentVisitor ?? original
  // Só completa lacunas; preserva os identificadores que já seriam enviados.
  const fallback = original?.opted_out ? null : original
  email = email ?? (visitor?.opted_out ? null : visitor?.email) ?? fallback?.email ?? null
  if (isInternalEmail(email)) return { sent: false, skipped: 'internal' }
  const fbp = currentVisitor?.fbp || extra.fbp || fallback?.fbp || null
  // Um fbclid antigo não recebe a data da reunião como se fosse um novo clique.
  const clickTime = extra.first_visit ? Date.parse(extra.first_visit) : NaN
  const fbc = currentVisitor?.fbc || extra.fbc || fallback?.fbc ||
    (extra.fbclid && Number.isFinite(clickTime) && clickTime > 0 && clickTime <= Date.now()
      ? `fb.1.${clickTime}.${extra.fbclid}` : null)

  const customData: Record<string, unknown> = {
    deal_id: dealId,
    deal_title: deal.title,
    pipeline_id: deal.pipeline_id,
    stage_id: deal.stage_id,
    lead_source: str('source'),
    lead_medium: str('medium'),
    lead_campaign: str('campaign'),
    lead_event_id: extra.event_id,
  }
  if (event.name === 'Purchase') {
    customData.value = purchaseValue
    customData.currency = purchaseCurrency
    customData.order_id = `pd-${dealId}`
    customData.content_name = 'servico-ciclo'
  }

  return sendMetaEvent({
    eventName: event.name,
    eventId: `pd-${dealId}-${event.name.toLowerCase()}`,
    actionSource: 'system_generated',
    userData: {
      email,
      phone: primary(person.phone),
      firstName: person.first_name ?? person.name?.split(' ')[0] ?? null,
      lastName: person.last_name ?? person.name?.split(' ').slice(1).join(' ') ?? null,
      externalId: visitor?.uid ?? null,
      fbp,
      fbc,
      clientIp: currentVisitor?.client_ip || fallback?.client_ip || null,
      clientUserAgent: currentVisitor?.user_agent || fallback?.user_agent || null,
    },
    customData,
    context: { dealId, personId, uid: visitor?.uid },
  })
}

/** Resolve o evento de funil para uma mudança de etapa (busca o nome no Pipedrive). */
export async function funnelEventForStage(stageId: number): Promise<FunnelEvent | null> {
  const name = await fetchStageName(stageId)
  return name ? stageToMetaEvent(name) : null
}
