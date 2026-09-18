// Eventos de lead do Pipedrive -> GA4 (Measurement Protocol).
//
// Regra de negócio (definida com o Flávio em set/2026): só dois funis geram
// essas marcações no GA4.
//
//   Funil                        | qualify_lead (lead qualificado) | close_convert_lead (lead convertido)
//   -----------------------------|----------------------------------|--------------------------------------
//   1 - Site/Whats (pipeline 2)  | etapa "Lead Qualificado" (11)    | negócio marcado como ganho
//   Playbooks (pipeline 13)      | etapa "SQL / Oportunidade" (96)  | negócio marcado como ganho
//
// "Chegar na etapa" inclui pular por cima dela: se o deal for movido direto para
// uma etapa posterior (ex.: Proposta), o qualify_lead também é enviado.
// Um negócio ganho que nunca teve qualify_lead recebe os dois eventos.
//
// Idempotente por (deal, evento) via conversion_events (platform "ga4").
// Usa os nomes recomendados do GA4 para que os eventos apareçam no relatório
// "Aquisição de leads" e possam ser marcados como eventos principais.
import { pipedriveUrl, attributionFieldKeys } from './pipedrive-server'
import { conversionAlreadySent, logConversionEvent } from './supabase-server'
import { isInternalEmail } from './meta-capi'
import type { DealLike } from './pipedrive-funnel-events'

export const GA4_QUALIFY_LEAD = 'qualify_lead'
export const GA4_CLOSE_CONVERT_LEAD = 'close_convert_lead'

/** pipeline_id -> stage_id da etapa que caracteriza "lead qualificado". */
const DEFAULT_QUALIFY_STAGE_BY_PIPELINE: Record<number, number> = {
  2: 11, // 1 - Site/Whats (Passivo) -> Lead Qualificado
  13: 96, // Playbooks -> SQL / Oportunidade
}

/**
 * Permite sobrescrever sem deploy: GA4_LEAD_QUALIFY_STAGES="2:11,13:96"
 * (pipeline_id:stage_id separados por vírgula).
 */
export function qualifyStageByPipeline(): Record<number, number> {
  const raw = process.env.GA4_LEAD_QUALIFY_STAGES
  if (!raw) return DEFAULT_QUALIFY_STAGE_BY_PIPELINE
  const map: Record<number, number> = {}
  for (const pair of raw.split(',')) {
    const [p, s] = pair.split(':').map((v) => Number(v.trim()))
    if (Number.isInteger(p) && Number.isInteger(s)) map[p] = s
  }
  return Object.keys(map).length ? map : DEFAULT_QUALIFY_STAGE_BY_PIPELINE
}

export function isLeadTrackedPipeline(pipelineId: number | undefined): boolean {
  return typeof pipelineId === 'number' && pipelineId in qualifyStageByPipeline()
}

interface StageInfo {
  id: number
  pipeline_id: number
  order_nr: number
  name: string
}

async function fetchStage(stageId: number): Promise<StageInfo | null> {
  try {
    const res = await fetch(pipedriveUrl(`/stages/${stageId}`))
    const json = await res.json()
    return json.success && json.data ? (json.data as StageInfo) : null
  } catch {
    return null
  }
}

/**
 * O deal, na etapa `stageId`, atingiu (ou passou) a etapa de qualificação do seu funil?
 * Compara pela ordem das etapas dentro do funil, então funciona mesmo quando a etapa é pulada.
 */
export async function reachedQualifyStage(pipelineId: number, stageId: number): Promise<boolean> {
  const qualifyStageId = qualifyStageByPipeline()[pipelineId]
  if (!qualifyStageId) return false
  if (stageId === qualifyStageId) return true
  const [current, qualify] = await Promise.all([fetchStage(stageId), fetchStage(qualifyStageId)])
  if (!current || !qualify) return false
  if (current.pipeline_id !== pipelineId || qualify.pipeline_id !== pipelineId) return false
  return current.order_nr >= qualify.order_nr
}

async function dealPersonEmail(deal: DealLike): Promise<string | null> {
  const personId =
    typeof deal.person_id === 'number' ? deal.person_id : (deal.person_id as { value: number } | null)?.value
  if (!personId) return null
  try {
    const res = await fetch(pipedriveUrl(`/persons/${personId}`))
    const json = await res.json()
    const emails = json.success ? (json.data?.email as { value: string; primary?: boolean }[] | undefined) : undefined
    if (!emails?.length) return null
    return (emails.find((e) => e.primary) ?? emails[0]).value || null
  } catch {
    return null
  }
}

export type Ga4LeadSendResult =
  | { sent: true; event: string; status: number; client_id_source: 'deal' | 'fallback'; validation?: unknown }
  | { sent: false; event: string; skipped: string }

/**
 * Envia um evento de lead (qualify_lead / close_convert_lead) ao GA4 via Measurement Protocol.
 * - Usa o GA Client ID capturado no deal quando existe (mantém atribuição de canal/campanha).
 * - Sem Client ID (ex.: lead que entrou só pelo WhatsApp) usa um client_id de fallback
 *   estável por deal, para que o evento ainda seja contado no GA4.
 * - Ignora e-mails internos e deals já enviados.
 */
export async function sendGa4LeadEvent(
  deal: DealLike,
  eventName: string,
  opts: { debug?: boolean } = {}
): Promise<Ga4LeadSendResult> {
  const dealId = Number(deal.id)
  const measurementId = process.env.GA4_MEASUREMENT_ID || 'G-EY1FLE5C0J'
  const apiSecret = process.env.GA4_API_SECRET
  if (!apiSecret) {
    console.error('[GA4 lead] GA4_API_SECRET não configurado')
    return { sent: false, event: eventName, skipped: 'ga4_env_missing' }
  }

  if (await conversionAlreadySent('ga4', eventName, dealId)) {
    return { sent: false, event: eventName, skipped: 'already_sent' }
  }

  const email = await dealPersonEmail(deal)
  if (isInternalEmail(email)) return { sent: false, event: eventName, skipped: 'internal' }

  const keys = attributionFieldKeys()
  const field = (k: keyof typeof keys): string | undefined => {
    const v = deal[keys[k]]
    return typeof v === 'string' && v.trim() !== '' ? v : undefined
  }

  const dealClientId = field('ga_client_id')
  const clientId = dealClientId ?? `pd-${dealId}`
  const sessionId = field('ga_session_id')
  const eventId = `pd-${dealId}-${eventName}`

  const params: Record<string, unknown> = {
    event_id: eventId,
    deal_id: dealId,
    deal_title: deal.title,
    pipeline_id: deal.pipeline_id,
    stage_id: deal.stage_id,
    lead_source: field('source'),
    lead_medium: field('medium'),
    lead_campaign: field('campaign'),
    lead_origin: 'pipedrive',
    client_id_source: dealClientId ? 'deal' : 'fallback',
    engagement_time_msec: 1,
  }
  if (eventName === GA4_CLOSE_CONVERT_LEAD) {
    params.value = Number(deal.value ?? 0)
    params.currency = (deal.currency as string) || 'BRL'
  }
  // session_id só faz sentido junto do client_id real da sessão
  if (dealClientId && sessionId) params.session_id = sessionId

  const endpoint = opts.debug
    ? 'https://www.google-analytics.com/debug/mp/collect'
    : 'https://www.google-analytics.com/mp/collect'

  const logBase = {
    platform: 'ga4' as const,
    event_name: eventName,
    event_id: eventId,
    action_source: 'system_generated',
    deal_id: dealId,
    payload: { client_id_source: params.client_id_source, pipeline_id: deal.pipeline_id, stage_id: deal.stage_id },
  }

  try {
    const res = await fetch(
      `${endpoint}?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          non_personalized_ads: false,
          events: [{ name: eventName, params }],
        }),
      }
    )
    const validation = opts.debug ? await res.json().catch(() => null) : undefined
    const ok = res.status >= 200 && res.status < 300
    console.log('[GA4 lead]', eventName, '— deal', dealId, 'status MP', res.status, dealClientId ? '(client id do deal)' : '(fallback)')
    if (!opts.debug) {
      await logConversionEvent({ ...logBase, status: ok ? 'sent' : 'error', response: { status: res.status } })
    }
    return {
      sent: true,
      event: eventName,
      status: res.status,
      client_id_source: dealClientId ? 'deal' : 'fallback',
      validation,
    }
  } catch (err) {
    console.error('[GA4 lead] erro ao enviar', eventName, 'deal', dealId, err)
    await logConversionEvent({ ...logBase, status: 'error', response: { error: String(err) } })
    return { sent: false, event: eventName, skipped: 'request_failed' }
  }
}

/**
 * Regra completa para uma atualização de deal. Retorna o resultado por evento.
 *  - mudou de etapa e atingiu a etapa de qualificação -> qualify_lead
 *  - virou ganho -> qualify_lead (se ainda não enviado) + close_convert_lead
 */
export async function processGa4LeadEvents(
  deal: DealLike,
  change: { stageChanged: boolean; becameWon: boolean },
  opts: { debug?: boolean } = {}
): Promise<Record<string, Ga4LeadSendResult>> {
  const out: Record<string, Ga4LeadSendResult> = {}
  const pipelineId = Number(deal.pipeline_id)
  const stageId = Number(deal.stage_id)
  if (!isLeadTrackedPipeline(pipelineId)) return out

  if (change.becameWon) {
    out[GA4_QUALIFY_LEAD] = await sendGa4LeadEvent(deal, GA4_QUALIFY_LEAD, opts)
    out[GA4_CLOSE_CONVERT_LEAD] = await sendGa4LeadEvent(deal, GA4_CLOSE_CONVERT_LEAD, opts)
    return out
  }

  if (change.stageChanged && (await reachedQualifyStage(pipelineId, stageId))) {
    out[GA4_QUALIFY_LEAD] = await sendGa4LeadEvent(deal, GA4_QUALIFY_LEAD, opts)
  }
  return out
}
