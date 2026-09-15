// Jornada de conteúdo do lead: quais páginas/posts a pessoa viu antes de converter.
//
// Fonte: site_events (Supabase) — page_view por visitante (ciclo_uid), com título.
// Resultado gravado no Pipedrive em dois campos de negócio criados sob demanda
// ("Conteúdo de entrada" e "Último conteúdo antes de converter") e numa Note com a
// jornada completa. Também alimenta o custom_data da CAPI (content_source).
import { sbSelect } from './supabase-server'
import { pipedriveUrl } from './pipedrive-server'

export interface JourneyStep {
  occurred_at: string
  path: string
  title: string | null
}

export type ContentKind = 'blog' | 'servico' | 'solucao' | 'playbook' | 'ecomshift' | 'tiktok-shop' | 'consultoria' | 'home' | 'outro'

export interface LeadJourney {
  steps: JourneyStep[]
  entry: { label: string; path: string; kind: ContentKind } | null
  lastContent: { label: string; path: string; kind: ContentKind } | null
  firstSeen: string | null
  pages: number
}

const SITE_SUFFIX = /\s*[|–-]\s*Ciclo( E-?commerce)?\s*$/i

export function classifyPath(path: string): ContentKind {
  const p = (path || '/').split('?')[0].split('#')[0]
  if (p === '/' || p === '') return 'home'
  if (p.startsWith('/blog/')) return 'blog'
  if (p.startsWith('/servicos/')) return 'servico'
  if (p.startsWith('/solucoes/')) return 'solucao'
  if (p.startsWith('/playbook')) return 'playbook'
  if (p.startsWith('/ecomshift')) return 'ecomshift'
  if (p.startsWith('/tiktok-shop')) return 'tiktok-shop'
  if (p.startsWith('/consultoria')) return 'consultoria'
  return 'outro'
}

const KIND_LABEL: Record<ContentKind, string> = {
  blog: 'Blog',
  servico: 'Serviço',
  solucao: 'Solução',
  playbook: 'Playbook',
  ecomshift: 'Ecomshift',
  'tiktok-shop': 'TikTok Shop',
  consultoria: 'Consultoria',
  home: 'Home',
  outro: 'Página',
}

/** "Título do post | Ciclo E-commerce" -> "Título do post" */
export function cleanTitle(title: string | null | undefined, path: string): string {
  const t = (title ?? '').replace(SITE_SUFFIX, '').trim()
  if (t && !/^ciclo e-?commerce/i.test(t)) return t
  const kind = classifyPath(path)
  if (kind === 'home') return 'Home'
  const slug = path.split('?')[0].split('/').filter(Boolean).pop() ?? path
  return slug.replace(/-/g, ' ')
}

/** Rótulo curto para os campos do Pipedrive: "Blog: Título do post" (máx. 255) */
export function contentLabel(step: { path: string; title: string | null }): string {
  const kind = classifyPath(step.path)
  return `${KIND_LABEL[kind]}: ${cleanTitle(step.title, step.path)}`.slice(0, 255)
}

// Páginas que não são "conteúdo" (não contam como último conteúdo visto)
const NON_CONTENT: ContentKind[] = ['home', 'outro']
const IGNORE_PATHS = /^\/(obrigado|politica-de-privacidade|mapa-do-site|api\/)/

/**
 * @param excludeKind tipo da página onde a conversão aconteceu (não conta como "último conteúdo")
 */
export async function getLeadJourney(uid: string | undefined, landingPage?: string, excludeKind?: ContentKind): Promise<LeadJourney> {
  const empty: LeadJourney = { steps: [], entry: null, lastContent: null, firstSeen: null, pages: 0 }
  let steps: JourneyStep[] = []
  if (uid) {
    steps = await sbSelect<JourneyStep>(
      `/site_events?select=occurred_at,path,title&uid=eq.${uid}&type=eq.page_view&order=occurred_at.asc&limit=500`
    )
  }
  steps = steps.filter((s) => s.path && !IGNORE_PATHS.test(s.path))

  const entryStep = steps[0] ?? (landingPage ? { occurred_at: '', path: landingPage.split('?')[0], title: null } : null)
  const entry = entryStep
    ? { label: contentLabel(entryStep), path: entryStep.path, kind: classifyPath(entryStep.path) }
    : null

  // Último conteúdo (blog/serviço/solução/LP) visto antes da conversão
  const contentSteps = steps.filter((s) => {
    const k = classifyPath(s.path)
    return !NON_CONTENT.includes(k) && k !== excludeKind
  })
  const last = contentSteps[contentSteps.length - 1]
  const lastContent = last ? { label: contentLabel(last), path: last.path, kind: classifyPath(last.path) } : null

  if (!entryStep && !last) return empty
  return { steps, entry, lastContent, firstSeen: steps[0]?.occurred_at ?? null, pages: steps.length }
}

function fmt(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  } catch {
    return iso
  }
}

/** Texto da Note "Jornada até a conversão" */
export function journeyNote(j: LeadJourney, conversion: string): string {
  const lines: string[] = [`Jornada até a conversão (${conversion})`]
  if (j.entry) lines.push(`Entrada: ${j.entry.label} (${j.entry.path})`)
  if (j.lastContent) lines.push(`Último conteúdo: ${j.lastContent.label} (${j.lastContent.path})`)
  if (j.firstSeen) {
    const days = Math.max(0, Math.round((Date.now() - new Date(j.firstSeen).getTime()) / 86400000))
    lines.push(`Primeira visita: ${fmt(j.firstSeen)} (${days} dia${days === 1 ? '' : 's'} antes) · ${j.pages} página${j.pages === 1 ? '' : 's'} vistas`)
  }
  if (j.steps.length) {
    lines.push('', 'Páginas (mais antiga → mais recente):')
    const shown = j.steps.length > 40 ? j.steps.slice(-40) : j.steps
    if (shown.length < j.steps.length) lines.push(`… ${j.steps.length - shown.length} anteriores omitidas`)
    for (const s of shown) lines.push(`${fmt(s.occurred_at)} — ${cleanTitle(s.title, s.path)} (${s.path})`)
  }
  return lines.join('\n')
}

// ── Campos de negócio (criados sob demanda, uma vez) ─────────────────────────

export const JOURNEY_FIELD_NAMES = {
  entry: 'Conteúdo de entrada',
  lastContent: 'Último conteúdo antes de converter',
} as const

let fieldKeysCache: Record<keyof typeof JOURNEY_FIELD_NAMES, string> | null = null

async function ensureJourneyFields(): Promise<Record<keyof typeof JOURNEY_FIELD_NAMES, string> | null> {
  if (fieldKeysCache) return fieldKeysCache
  try {
    const res = await fetch(pipedriveUrl('/dealFields', { limit: '500' }))
    const json = await res.json()
    if (!json.success) return null
    const fields = json.data as { key: string; name: string }[]
    const keys: Partial<Record<keyof typeof JOURNEY_FIELD_NAMES, string>> = {}
    for (const [k, name] of Object.entries(JOURNEY_FIELD_NAMES) as [keyof typeof JOURNEY_FIELD_NAMES, string][]) {
      const found = fields.find((f) => f.name.trim().toLowerCase() === name.toLowerCase())
      if (found) {
        keys[k] = found.key
        continue
      }
      const created = await fetch(pipedriveUrl('/dealFields'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, field_type: 'varchar', add_visible_flag: true }),
      })
      const cj = await created.json()
      if (cj.success && cj.data?.key) {
        keys[k] = cj.data.key as string
        console.log('[Jornada] Campo criado no Pipedrive:', name, cj.data.key)
      } else {
        console.error('[Jornada] Falha ao criar campo', name, cj?.error ?? '')
        return null
      }
    }
    fieldKeysCache = keys as Record<keyof typeof JOURNEY_FIELD_NAMES, string>
    return fieldKeysCache
  } catch (err) {
    console.error('[Jornada] ensureJourneyFields:', err)
    return null
  }
}

/** Grava os campos de conteúdo no deal e a Note com a jornada. Nunca lança. */
export async function applyJourneyToDeal(dealId: number, j: LeadJourney, conversion: string): Promise<void> {
  if (!j.entry && !j.lastContent) return
  try {
    const keys = await ensureJourneyFields()
    if (keys) {
      const body: Record<string, string> = {}
      if (j.entry) body[keys.entry] = j.entry.label
      if (j.lastContent) body[keys.lastContent] = j.lastContent.label
      await fetch(pipedriveUrl(`/deals/${dealId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    }
    if (j.steps.length) {
      await fetch(pipedriveUrl('/notes'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deal_id: dealId, content: journeyNote(j, conversion).replace(/\n/g, '<br>') }),
      })
    }
    console.log('[Jornada] Deal', dealId, '| entrada:', j.entry?.label, '| último conteúdo:', j.lastContent?.label)
  } catch (err) {
    console.error('[Jornada] applyJourneyToDeal:', err)
  }
}
