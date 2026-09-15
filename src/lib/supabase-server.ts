// Acesso server-side ao Supabase via PostgREST puro (sem SDK, zero dependências).
// A service role NUNCA sai do servidor. Sem env configurada, tudo vira no-op
// logado — a captura de leads nunca depende do Supabase para funcionar.

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

let warned = false
function ready(): boolean {
  if (SUPABASE_URL && SERVICE_KEY) return true
  if (!warned) {
    warned = true
    console.warn('[Supabase] SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY não configuradas — telemetria desativada')
  }
  return false
}

async function rest(path: string, init: RequestInit & { headers?: Record<string, string> } = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY!,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })
  if (!res.ok && res.status !== 406) {
    console.error('[Supabase]', init.method ?? 'GET', path, res.status, await res.text().catch(() => ''))
  }
  return res
}

export interface SiteVisitor {
  uid: string
  pipedrive_person_id: number | null
  email: string | null
  ga_client_id: string | null
  opted_out: boolean
  last_digest_at?: string | null
}

/** SELECT genérico via PostgREST; retorna [] em erro ou sem env. */
export async function sbSelect<T>(pathQuery: string): Promise<T[]> {
  if (!ready()) return []
  try {
    const res = await rest(pathQuery)
    const rows = await res.json().catch(() => [])
    return Array.isArray(rows) ? (rows as T[]) : []
  } catch (err) {
    console.error('[Supabase] sbSelect:', err)
    return []
  }
}

export async function getVisitor(uid: string): Promise<SiteVisitor | null> {
  if (!ready()) return null
  try {
    const res = await rest(`/site_visitors?uid=eq.${uid}&limit=1`)
    const rows = await res.json().catch(() => [])
    return Array.isArray(rows) && rows[0] ? (rows[0] as SiteVisitor) : null
  } catch (err) {
    console.error('[Supabase] getVisitor:', err)
    return null
  }
}

/** Cria o visitante se não existir e atualiza last_seen + campos não-nulos. */
export async function upsertVisitor(
  uid: string,
  fields: Partial<Pick<SiteVisitor, 'pipedrive_person_id' | 'email' | 'ga_client_id' | 'opted_out' | 'last_digest_at'>> = {}
): Promise<void> {
  if (!ready()) return
  try {
    const existing = await getVisitor(uid)
    const now = new Date().toISOString()
    if (existing) {
      const patch: Record<string, unknown> = { last_seen: now }
      for (const [k, v] of Object.entries(fields)) {
        if (v !== undefined && v !== null) patch[k] = v
      }
      await rest(`/site_visitors?uid=eq.${uid}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify(patch),
      })
    } else {
      await rest('/site_visitors', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ uid, first_seen: now, last_seen: now, ...fields }),
      })
    }
  } catch (err) {
    console.error('[Supabase] upsertVisitor:', err)
  }
}

export interface SiteEvent {
  uid: string
  type: string
  path?: string
  title?: string
  referrer?: string
  source?: string
  medium?: string
  campaign?: string
  meta?: unknown
}

export async function insertEvent(event: SiteEvent): Promise<void> {
  if (!ready()) return
  try {
    await rest('/site_events', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ occurred_at: new Date().toISOString(), ...event }),
    })
  } catch (err) {
    console.error('[Supabase] insertEvent:', err)
  }
}

// ── Log de conversões enviadas às plataformas (Meta CAPI, GA4 MP, Google Ads) ─

export interface ConversionEventLog {
  platform: 'meta' | 'ga4' | 'google_ads' | 'tiktok'
  event_name: string
  event_id: string
  action_source?: string | null
  status: 'sent' | 'error' | 'skipped'
  deal_id?: number | null
  person_id?: number | null
  uid?: string | null
  payload?: unknown
  response?: unknown
}

export async function logConversionEvent(entry: ConversionEventLog): Promise<void> {
  if (!ready()) return
  try {
    await rest('/conversion_events', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ sent_at: new Date().toISOString(), ...entry }),
    })
  } catch (err) {
    console.error('[Supabase] logConversionEvent:', err)
  }
}

/** Já existe um envio bem-sucedido deste evento para o deal? (idempotência dos webhooks) */
export async function conversionAlreadySent(platform: string, eventName: string, dealId: number): Promise<boolean> {
  if (!ready()) return false
  try {
    const res = await rest(
      `/conversion_events?platform=eq.${platform}&event_name=eq.${encodeURIComponent(eventName)}&deal_id=eq.${dealId}&status=eq.sent&select=id&limit=1`
    )
    const rows = await res.json().catch(() => [])
    return Array.isArray(rows) && rows.length > 0
  } catch {
    return false
  }
}

/** Dados de correspondência guardados no lead (uid -> fbp/fbc/ip/ua) para eventos offline. */
export interface VisitorMatchData {
  uid: string
  fbp?: string | null
  fbc?: string | null
  client_ip?: string | null
  user_agent?: string | null
}

export async function getVisitorByPerson(personId: number): Promise<(SiteVisitor & VisitorMatchData) | null> {
  if (!ready()) return null
  try {
    const res = await rest(`/site_visitors?pipedrive_person_id=eq.${personId}&order=last_seen.desc&limit=1`)
    const rows = await res.json().catch(() => [])
    return Array.isArray(rows) && rows[0] ? (rows[0] as SiteVisitor & VisitorMatchData) : null
  } catch {
    return null
  }
}

export async function saveVisitorMatchData(uid: string, data: Omit<VisitorMatchData, 'uid'>): Promise<void> {
  if (!ready()) return
  const patch: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(data)) if (v) patch[k] = v
  if (!Object.keys(patch).length) return
  try {
    await rest(`/site_visitors?uid=eq.${uid}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify(patch),
    })
  } catch (err) {
    console.error('[Supabase] saveVisitorMatchData:', err)
  }
}
