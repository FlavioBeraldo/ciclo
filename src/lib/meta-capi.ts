// API de Conversões da Meta (server-side) — envio direto do backend Next.js.
//
// Regras:
// - O event_id é o MESMO usado pelo Pixel no navegador (deduplicação).
// - Dados pessoais são normalizados e hasheados (SHA-256) antes de sair do servidor.
// - Sem META_CAPI_TOKEN configurado, tudo vira no-op logado (nunca quebra o lead).
// - Cada envio é registrado em Supabase (conversion_events) para auditoria e para
//   evitar reenvio (webhooks do Pipedrive).
import { createHash } from 'node:crypto'
import type { NextRequest } from 'next/server'
import { logConversionEvent } from './supabase-server'

const GRAPH_VERSION = 'v21.0'
const DEFAULT_PIXEL_ID = '780524645411912' // Px da Ciclo

export type MetaActionSource = 'website' | 'system_generated' | 'chat' | 'email' | 'phone_call' | 'other'

export interface MetaUserDataInput {
  email?: string | null
  phone?: string | null
  firstName?: string | null
  lastName?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  externalId?: string | null
  fbp?: string | null
  fbc?: string | null
  clientIp?: string | null
  clientUserAgent?: string | null
  /** Lead ID do Meta (leads nativos do Facebook) */
  leadId?: string | null
}

export interface MetaEventInput {
  eventName: string
  eventId: string
  eventTime?: number // unix seconds
  actionSource?: MetaActionSource
  eventSourceUrl?: string | null
  userData: MetaUserDataInput
  customData?: Record<string, unknown>
  /** contexto para o log (deal, uid, etc.) */
  context?: { dealId?: number; uid?: string; personId?: number }
}

export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Telefone em E.164 sem "+": só dígitos; BR sem DDI recebe 55. */
export function normalizePhone(phone: string): string | null {
  let digits = phone.replace(/\D/g, '')
  if (!digits) return null
  if (digits.startsWith('00')) digits = digits.slice(2)
  // 10/11 dígitos = DDD + número brasileiro sem DDI
  if ((digits.length === 10 || digits.length === 11) && !digits.startsWith('55')) {
    digits = `55${digits}`
  }
  return digits.length >= 8 ? digits : null
}

function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

function hashed(value: string | null | undefined, normalize: (v: string) => string | null): string[] | undefined {
  if (!value) return undefined
  const n = normalize(value)
  return n ? [sha256(n)] : undefined
}

export function buildUserData(input: MetaUserDataInput): Record<string, unknown> {
  const ud: Record<string, unknown> = {}
  const em = hashed(input.email, normalizeEmail)
  const ph = hashed(input.phone, normalizePhone)
  const fn = hashed(input.firstName, normalizeName)
  const ln = hashed(input.lastName, normalizeName)
  const ct = hashed(input.city, (v) => normalizeName(v).replace(/\s+/g, ''))
  const st = hashed(input.state, (v) => normalizeName(v).replace(/\s+/g, ''))
  const country = hashed(input.country ?? 'br', (v) => v.trim().toLowerCase())
  if (em) ud.em = em
  if (ph) ud.ph = ph
  if (fn) ud.fn = fn
  if (ln) ud.ln = ln
  if (ct) ud.ct = ct
  if (st) ud.st = st
  if (country) ud.country = country
  if (input.externalId) ud.external_id = [sha256(input.externalId)]
  if (input.fbp) ud.fbp = input.fbp
  if (input.fbc) ud.fbc = input.fbc
  if (input.clientIp) ud.client_ip_address = input.clientIp
  if (input.clientUserAgent) ud.client_user_agent = input.clientUserAgent
  if (input.leadId) ud.lead_id = input.leadId
  return ud
}

/** IP e User-Agent reais do visitante (Vercel coloca o IP em x-forwarded-for). */
export function clientInfoFromRequest(req: NextRequest): { clientIp?: string; clientUserAgent?: string } {
  const fwd = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? ''
  const clientIp = fwd.split(',')[0]?.trim() || undefined
  const clientUserAgent = req.headers.get('user-agent') ?? undefined
  return { clientIp, clientUserAgent }
}

/** E-mails da própria Ciclo não viram conversão (testes internos). */
export function isInternalEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const domain = email.trim().toLowerCase().split('@')[1] ?? ''
  const internal = (process.env.INTERNAL_EMAIL_DOMAINS ?? 'cicloecommerce.com.br')
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean)
  return internal.includes(domain)
}

let warned = false
function ready(): boolean {
  if (process.env.META_CAPI_TOKEN) return true
  if (!warned) {
    warned = true
    console.warn('[Meta CAPI] META_CAPI_TOKEN não configurado — envio server-side desativado')
  }
  return false
}

export interface MetaSendResult {
  sent: boolean
  status?: number
  eventsReceived?: number
  error?: string
  traceId?: string
}

/**
 * Envia um evento para a API de Conversões. Nunca lança: erros são logados e
 * devolvidos no resultado. Registra o resultado em conversion_events.
 */
export async function sendMetaEvent(input: MetaEventInput): Promise<MetaSendResult> {
  const pixelId = process.env.META_PIXEL_ID || DEFAULT_PIXEL_ID
  const token = process.env.META_CAPI_TOKEN
  const eventTime = input.eventTime ?? Math.floor(Date.now() / 1000)
  const actionSource = input.actionSource ?? 'website'

  const event: Record<string, unknown> = {
    event_name: input.eventName,
    event_time: eventTime,
    event_id: input.eventId,
    action_source: actionSource,
    user_data: buildUserData(input.userData),
  }
  if (input.eventSourceUrl) event.event_source_url = input.eventSourceUrl
  if (input.customData && Object.keys(input.customData).length) event.custom_data = input.customData

  const body: Record<string, unknown> = { data: [event] }
  if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE

  const logBase = {
    platform: 'meta' as const,
    event_name: input.eventName,
    event_id: input.eventId,
    action_source: actionSource,
    deal_id: input.context?.dealId ?? null,
    uid: input.context?.uid ?? null,
    person_id: input.context?.personId ?? null,
    payload: { ...event, user_data: Object.keys(event.user_data as object) }, // sem PII no log
  }

  if (!ready()) {
    await logConversionEvent({ ...logBase, status: 'skipped', response: { reason: 'META_CAPI_TOKEN ausente' } })
    return { sent: false, error: 'META_CAPI_TOKEN ausente' }
  }

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })
    const json = (await res.json().catch(() => ({}))) as {
      events_received?: number
      fbtrace_id?: string
      error?: { message?: string }
    }
    const ok = res.ok && !json.error
    await logConversionEvent({
      ...logBase,
      status: ok ? 'sent' : 'error',
      response: { status: res.status, events_received: json.events_received, fbtrace_id: json.fbtrace_id, error: json.error?.message },
    })
    if (!ok) {
      console.error('[Meta CAPI]', input.eventName, input.eventId, res.status, json.error?.message ?? json)
      return { sent: false, status: res.status, error: json.error?.message ?? `HTTP ${res.status}`, traceId: json.fbtrace_id }
    }
    console.log('[Meta CAPI]', input.eventName, input.eventId, 'ok', json.events_received ?? 1)
    return { sent: true, status: res.status, eventsReceived: json.events_received, traceId: json.fbtrace_id }
  } catch (err) {
    console.error('[Meta CAPI] Falha de rede:', err)
    await logConversionEvent({ ...logBase, status: 'error', response: { error: String(err) } })
    return { sent: false, error: String(err) }
  }
}
