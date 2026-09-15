// Camada única de conversões (client-side).
//
// Toda conversão do site passa por aqui para que Pixel/CAPI da Meta, GA4 e
// Google Ads recebam o MESMO event_id (deduplicação navegador <-> servidor) e os
// mesmos dados de correspondência (user_data), via GTM.
//
// Fluxo por formulário:
//   1. const eventId = newEventId()
//   2. pushConversion('generate_lead', { eventId, userData, ... })  -> GTM dispara Pixel/GA4/Ads
//   3. POST /api/pipedrive { ..., event_id: eventId, attribution }  -> servidor manda CAPI com o mesmo id
//   4. await waitForTags(eventId) antes de navegar (evita perder o hit no redirect)

import type { AttributionPayload } from './attribution'

export type ConversionEvent =
  | 'generate_lead'
  | 'playbook_form_submit'
  | 'begin_checkout'
  | 'purchase'

/** Dados de contato em texto claro: o GTM faz o hash para a Meta e o Google. */
export interface ConversionUserData {
  email?: string
  phone_number?: string
  first_name?: string
  last_name?: string
}

export interface ConversionOptions {
  eventId: string
  userData?: ConversionUserData
  attribution?: AttributionPayload
  form?: string
  method?: string
  value?: number
  currency?: string
  contentName?: string
  /** Extra params (chaves simples) para GA4/Meta */
  extra?: Record<string, string | number | boolean | undefined>
}

const TAG_TIMEOUT_MS = 2000

export function newEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
}

/** Separa "Nome Sobrenome" em first/last para Advanced Matching. */
export function splitName(full: string | undefined): { first_name?: string; last_name?: string } {
  const parts = (full ?? '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return {}
  if (parts.length === 1) return { first_name: parts[0] }
  return { first_name: parts[0], last_name: parts.slice(1).join(' ') }
}

const pending = new Map<string, () => void>()

/**
 * Publica a conversão no dataLayer. Resolve o callback do GTM (eventCallback)
 * para que `waitForTags` possa aguardar os tags dispararem antes de um redirect.
 */
export function pushConversion(event: ConversionEvent, opts: ConversionOptions): void {
  if (typeof window === 'undefined') return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  w.dataLayer = w.dataLayer || []

  const { eventId, userData, attribution, form, method, value, currency, contentName, extra } = opts
  const userDataClean: ConversionUserData = {}
  if (userData?.email) userDataClean.email = userData.email.trim().toLowerCase()
  if (userData?.phone_number) userDataClean.phone_number = userData.phone_number.replace(/[^\d+]/g, '')
  if (userData?.first_name) userDataClean.first_name = userData.first_name.trim()
  if (userData?.last_name) userDataClean.last_name = userData.last_name.trim()

  let done = false
  const finish = () => {
    if (done) return
    done = true
    pending.delete(eventId)
  }
  pending.set(eventId, finish)

  w.dataLayer.push({
    event,
    event_id: eventId,
    form,
    method,
    content_name: contentName,
    value,
    currency: value !== undefined ? currency ?? 'BRL' : undefined,
    lead_source: attribution?.source,
    lead_medium: attribution?.medium,
    lead_campaign: attribution?.campaign,
    user_data: Object.keys(userDataClean).length ? userDataClean : undefined,
    ...extra,
    eventCallback: finish,
    eventTimeout: TAG_TIMEOUT_MS,
  })
}

/**
 * Aguarda os tags do GTM terminarem para o event_id (ou o timeout), para que o
 * hit do Pixel/GA4 saia antes de uma navegação. Nunca bloqueia mais que ~2s.
 */
export function waitForTags(eventId: string): Promise<void> {
  return new Promise((resolve) => {
    if (!pending.has(eventId)) return resolve()
    const timer = setTimeout(() => {
      pending.delete(eventId)
      resolve()
    }, TAG_TIMEOUT_MS + 200)
    const check = () => {
      if (!pending.has(eventId)) {
        clearTimeout(timer)
        resolve()
      } else {
        setTimeout(check, 50)
      }
    }
    check()
  })
}
