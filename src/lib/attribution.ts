// Captura de atribuição (client-side): primeiro toque em cookie próprio +
// leitura dos cookies do GA4 no momento do submit.

const COOKIE_NAME = 'ciclo_attr'
const COOKIE_DAYS = 90
const OWN_HOSTS = ['cicloecommerce.com.br', 'www.cicloecommerce.com.br', 'localhost']

const SEARCH_ENGINES = ['google.', 'bing.com', 'duckduckgo.', 'yahoo.']
const SOCIAL_HOSTS = ['instagram.com', 'facebook.com', 'linkedin.com', 'tiktok.com', 'youtube.com']

export interface AttributionPayload {
  source?: string
  medium?: string
  campaign?: string
  term?: string
  content?: string
  gclid?: string
  fbclid?: string
  referrer?: string
  landing_page?: string
  first_visit?: string
  ga_client_id?: string
  ga_session_id?: string
}

function readCookie(name: string): string | null {
  const match = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null
}

function readStored(): AttributionPayload | null {
  try {
    const raw = readCookie(COOKIE_NAME)
    return raw ? (JSON.parse(raw) as AttributionPayload) : null
  } catch {
    return null
  }
}

// Deriva source/medium seguindo a lógica do GA:
// utm -> gclid (google/cpc) -> fbclid (facebook/paid_social) -> referrer -> (direct)/(none)
function deriveSourceMedium(params: URLSearchParams, referrer: string): { source: string; medium: string } {
  const utmSource = params.get('utm_source')
  if (utmSource) return { source: utmSource, medium: params.get('utm_medium') ?? '(none)' }
  if (params.get('gclid')) return { source: 'google', medium: 'cpc' }
  if (params.get('fbclid')) return { source: 'facebook', medium: 'paid_social' }

  if (referrer) {
    try {
      const host = new URL(referrer).hostname.replace(/^www\./, '')
      const isOwn = OWN_HOSTS.some((own) => host === own.replace(/^www\./, ''))
      if (!isOwn) {
        if (SEARCH_ENGINES.some((s) => host.includes(s))) return { source: host, medium: 'organic' }
        if (SOCIAL_HOSTS.some((s) => host.endsWith(s))) return { source: host, medium: 'social' }
        return { source: host, medium: 'referral' }
      }
    } catch {
      // referrer inválido — cai no direct
    }
  }
  return { source: '(direct)', medium: '(none)' }
}

/**
 * Registra o PRIMEIRO toque no cookie ciclo_attr (90 dias) — só grava se ainda
 * não existir. Chamar no load de cada página (AttributionTracker).
 */
export function collectAttribution(): void {
  if (typeof document === 'undefined') return
  if (readStored()) return

  const params = new URLSearchParams(window.location.search)
  // ?li=ok/erro é a volta do OAuth do LinkedIn — não é uma nova landing
  params.delete('li')
  const referrer = document.referrer || ''
  const { source, medium } = deriveSourceMedium(params, referrer)

  const data: AttributionPayload = {
    source,
    medium,
    campaign: params.get('utm_campaign') ?? undefined,
    term: params.get('utm_term') ?? undefined,
    content: params.get('utm_content') ?? undefined,
    gclid: params.get('gclid') ?? undefined,
    fbclid: params.get('fbclid') ?? undefined,
    referrer: referrer || undefined,
    landing_page: window.location.pathname + (params.size > 0 ? `?${params}` : ''),
    first_visit: new Date().toISOString(),
  }

  const expires = new Date(Date.now() + COOKIE_DAYS * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(data))}; expires=${expires}; path=/; SameSite=Lax`
}

// ── Detecção de tráfego vindo do LinkedIn (exibição do botão de login) ────────

const LI_TRAFFIC_FLAG = 'ciclo_li_traffic'

function urlHasLinkedInSignal(params: URLSearchParams): boolean {
  return /linkedin|lnkd/i.test(params.get('utm_source') ?? '') || params.has('li_fat_id')
}

function referrerIsLinkedIn(): boolean {
  return /linkedin\.com|lnkd\.in/i.test(document.referrer || '')
}

/**
 * Marca a sessão como tráfego LinkedIn quando a URL ou o referrer indicam isso.
 * Chamado no load de cada página (AttributionTracker) para o botão sobreviver
 * à navegação interna e ao retorno do OAuth (?li=ok).
 */
export function markLinkedInTraffic(): void {
  if (typeof document === 'undefined') return
  try {
    const params = new URLSearchParams(window.location.search)
    if (urlHasLinkedInSignal(params) || referrerIsLinkedIn()) {
      sessionStorage.setItem(LI_TRAFFIC_FLAG, '1')
    }
  } catch {
    // sessionStorage indisponível — o botão cai nos outros critérios
  }
}

/** O visitante veio do LinkedIn? (?li_test=1 força true para testes) */
export function isLinkedInTraffic(): boolean {
  if (typeof document === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  if (params.get('li_test') === '1') return true
  try {
    if (sessionStorage.getItem(LI_TRAFFIC_FLAG) === '1') return true
  } catch {
    // segue para os demais critérios
  }
  const stored = readStored()
  if (stored?.source && /linkedin|lnkd/i.test(stored.source)) return true
  return urlHasLinkedInSignal(params) || referrerIsLinkedIn()
}

// _ga = "GA1.1.AAAA.BBBB" -> client_id "AAAA.BBBB"
function readGaClientId(): string | undefined {
  const raw = readCookie('_ga')
  if (!raw) return undefined
  const parts = raw.split('.')
  return parts.length >= 4 ? parts.slice(-2).join('.') : undefined
}

// Primeiro cookie _ga_XXXX: "GS1.1.<session>...." ou "GS2.1.s<session>$o..."
function readGaSessionId(): string | undefined {
  const entry = document.cookie
    .split('; ')
    .find((c) => c.startsWith('_ga_'))
  if (!entry) return undefined
  const value = decodeURIComponent(entry.slice(entry.indexOf('=') + 1))
  const third = value.split('.')[2]
  if (!third) return undefined
  const session = third.startsWith('s') ? third.slice(1).split('$')[0] : third
  return session || undefined
}

/**
 * Payload completo para enviar junto ao lead. Os cookies do GA são lidos AQUI
 * (no submit), porque o _ga pode só existir depois do consentimento/GTM carregar.
 */
export function getAttributionPayload(): AttributionPayload {
  if (typeof document === 'undefined') return {}
  collectAttribution() // fallback: garante o primeiro toque mesmo se o tracker não rodou
  const stored = readStored() ?? {}
  return {
    ...stored,
    ga_client_id: readGaClientId(),
    ga_session_id: readGaSessionId(),
  }
}
