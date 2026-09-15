// Conversões offline: etapas do funil do Pipedrive -> eventos da Meta (CAPI).
//
// Permite otimizar campanhas por "reunião agendada"/"lead qualificado"/"fechamento",
// e não só por formulário. Os eventos usam action_source "system_generated"
// (gerados pelo CRM) e são deduplicados por deal em conversion_events.
import { pipedriveUrl, attributionFieldKeys } from './pipedrive-server'
import { conversionAlreadySent, getVisitorByPerson } from './supabase-server'
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
  return (list.find((e) => e.primary) ?? list[0]).value || null
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
  const dealId = Number(deal.id)
  if (await conversionAlreadySent('meta', event.name, dealId)) {
    return { sent: false, skipped: 'already_sent' }
  }

  const personId =
    typeof deal.person_id === 'number' ? deal.person_id : (deal.person_id as { value: number } | null)?.value
  if (!personId) return { sent: false, skipped: 'no_person' }

  const person = await fetchPerson(personId)
  if (!person) return { sent: false, skipped: 'person_not_found' }
  const email = primary(person.email)
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
  if (extra.internal === 'true') return { sent: false, skipped: 'internal' }

  const visitor = await getVisitorByPerson(personId)
  const fbc = visitor?.fbc ?? extra.fbc ?? (extra.fbclid ? `fb.1.${Date.now()}.${extra.fbclid}` : null)

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
    customData.value = opts.purchaseValue ?? Number(deal.value ?? 0)
    customData.currency = deal.currency || 'BRL'
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
      fbp: visitor?.fbp ?? extra.fbp ?? null,
      fbc,
      clientIp: visitor?.client_ip ?? null,
      clientUserAgent: visitor?.user_agent ?? null,
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
