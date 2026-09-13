// Interações do site refletidas no Pipedrive: Activities de conversão em tempo
// real e o resumo diário de navegação (Notes). Toda falha é logada e engolida —
// telemetria nunca derruba a resposta ao visitante.
import { pipedriveUrl } from './pipedrive-server'
import { sbSelect } from './supabase-server'

// ── Activity type ─────────────────────────────────────────────────────────────

let cachedActivityType: string | null = null

/** Prefere o tipo 'task'; senão o primeiro tipo ativo da conta. */
export async function getActivityTypeKey(): Promise<string | null> {
  if (cachedActivityType) return cachedActivityType
  try {
    const res = await fetch(pipedriveUrl('/activityTypes'))
    const data = await res.json()
    if (!data.success || !Array.isArray(data.data)) return null
    const types = data.data as { key_string: string; active_flag: boolean }[]
    const task = types.find((t) => t.key_string === 'task' && t.active_flag)
    cachedActivityType = (task ?? types.find((t) => t.active_flag))?.key_string ?? null
    return cachedActivityType
  } catch (err) {
    console.error('[Pipedrive] activityTypes:', err)
    return null
  }
}

/** Negócio ABERTO mais recente da pessoa (por add_time), se houver. */
export async function findLatestOpenDealId(personId: number): Promise<number | undefined> {
  try {
    const res = await fetch(pipedriveUrl(`/persons/${personId}/deals`, { status: 'open', limit: '100' }))
    const data = await res.json()
    if (!data.success || !Array.isArray(data.data)) return undefined
    const deals = data.data as { id: number; add_time: string }[]
    return deals.sort((a, b) => (a.add_time < b.add_time ? 1 : -1))[0]?.id
  } catch (err) {
    console.error('[Pipedrive] deals da pessoa:', err)
    return undefined
  }
}

// ── B1: Activity de conversão em tempo real ───────────────────────────────────

const SUBJECTS: Record<string, (meta: Record<string, unknown>) => string> = {
  material_download: (m) =>
    m.material === 'playbook-social-commerce'
      ? 'Site: baixou Playbook de Social Commerce'
      : `Site: baixou material${m.material ? ` (${m.material})` : ''}`,
  form_submit: (m) => `Site: enviou formulário${m.form ? ` (${m.form})` : ''}`,
  popup_click: () => 'Site: clicou no popup do playbook',
  whatsapp_click: () => 'Site: clicou no WhatsApp',
  cta_click: (m) => `Site: clicou em CTA${m.label ? ` (${m.label})` : ''}`,
}

export const CONVERSION_TYPES = new Set(Object.keys(SUBJECTS))

export interface ConversionEvent {
  type: string
  path?: string
  title?: string
  source?: string
  medium?: string
  campaign?: string
  meta?: Record<string, unknown>
}

/** Já existe evento igual (uid+type+path) na última hora? (dedupe da Activity) */
export async function hasRecentEvent(uid: string, type: string, path: string | undefined): Promise<boolean> {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const pathFilter = path ? `&path=eq.${encodeURIComponent(path)}` : '&path=is.null'
  const rows = await sbSelect<{ id: number }>(
    `/site_events?select=id&uid=eq.${uid}&type=eq.${encodeURIComponent(type)}${pathFilter}&occurred_at=gt.${encodeURIComponent(since)}&limit=1`
  )
  return rows.length > 0
}

export async function createConversionActivity(personId: number, event: ConversionEvent): Promise<void> {
  try {
    const subjectFor = SUBJECTS[event.type]
    if (!subjectFor) return
    const [typeKey, dealId] = await Promise.all([getActivityTypeKey(), findLatestOpenDealId(personId)])
    if (!typeKey) return

    const noteLines = [
      event.title ? `Página: ${event.title}` : null,
      event.path ? `Path: ${event.path}` : null,
      event.source ? `Origem: ${event.source} / ${event.medium ?? '(none)'}${event.campaign ? ` / ${event.campaign}` : ''}` : null,
    ].filter(Boolean)

    const res = await fetch(pipedriveUrl('/activities'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: subjectFor(event.meta ?? {}),
        type: typeKey,
        done: 1,
        due_date: new Date().toISOString().slice(0, 10),
        person_id: personId,
        ...(dealId ? { deal_id: dealId } : {}),
        note: noteLines.join('<br>'),
      }),
    })
    const data = await res.json()
    if (!data.success) console.error('[Pipedrive] Falha ao criar activity:', data?.error ?? data)
  } catch (err) {
    console.error('[Pipedrive] createConversionActivity:', err)
  }
}

// ── B2: resumo diário de navegação ────────────────────────────────────────────

export interface DigestEvent {
  occurred_at: string
  type: string
  path: string | null
  title: string | null
  source: string | null
  medium: string | null
}

const SESSION_GAP_MS = 30 * 60 * 1000

/**
 * Monta o texto da Note a partir dos page_views (função pura, testável).
 * Retorna null quando não há navegação relevante (nada além de /obrigado).
 */
export function buildDigestNote(events: DigestEvent[], date: Date): string | null {
  const views = events
    .filter((e) => e.type === 'page_view')
    .sort((a, b) => (a.occurred_at < b.occurred_at ? -1 : 1))
  const relevant = views.filter((v) => (v.path ?? '') !== '/obrigado')
  if (relevant.length === 0) return null

  // Sessões: gap > 30 min separa visitas; tempo estimado = soma (último - primeiro)
  let sessions = 0
  let totalMs = 0
  let sessionStart: number | null = null
  let prev: number | null = null
  for (const v of views) {
    const t = new Date(v.occurred_at).getTime()
    if (prev === null || t - prev > SESSION_GAP_MS) {
      if (sessionStart !== null && prev !== null) totalMs += prev - sessionStart
      sessions += 1
      sessionStart = t
    }
    prev = t
  }
  if (sessionStart !== null && prev !== null) totalMs += prev - sessionStart

  const byPath = new Map<string, { title: string; count: number }>()
  for (const v of relevant) {
    const key = v.path ?? '/'
    const entry = byPath.get(key) ?? { title: v.title ?? key, count: 0 }
    entry.count += 1
    if (v.title) entry.title = v.title
    byPath.set(key, entry)
  }
  const list = [...byPath.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .map(([path, { title, count }]) => `• ${title} (${path})${count > 1 ? ` ×${count}` : ''}`)

  const origem = relevant.find((v) => v.source)
  const minutes = Math.max(1, Math.round(totalMs / 60000))
  const dateStr = date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })

  return [
    `Navegação no site em ${dateStr}: ${relevant.length} página${relevant.length > 1 ? 's' : ''} em ${sessions} visita${sessions > 1 ? 's' : ''}`,
    ...list,
    origem ? `Origem: ${origem.source} / ${origem.medium ?? '(none)'}` : null,
    `Tempo estimado no site: ~${minutes} min`,
  ]
    .filter(Boolean)
    .join('<br>')
}

export async function createPersonNote(personId: number, content: string, dealId?: number): Promise<void> {
  try {
    const res = await fetch(pipedriveUrl('/notes'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ person_id: personId, ...(dealId ? { deal_id: dealId } : {}), content }),
    })
    const data = await res.json()
    if (!data.success) console.error('[Pipedrive] Falha ao criar note do digest:', data?.error ?? data)
  } catch (err) {
    console.error('[Pipedrive] createPersonNote:', err)
  }
}
