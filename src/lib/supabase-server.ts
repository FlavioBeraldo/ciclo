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
