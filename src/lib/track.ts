// Telemetria de navegação (client-side) -> POST /api/track.
// Respeita Do Not Track; o opt-out (cookie removido) é tratado no servidor.

export type TrackType =
  | 'page_view'
  | 'form_submit'
  | 'material_download'
  | 'popup_view'
  | 'popup_click'
  | 'video_play'
  | 'whatsapp_click'
  | 'cta_click'
  | 'scroll_75'

function dntActive(): boolean {
  return typeof navigator !== 'undefined' && navigator.doNotTrack === '1'
}

/** Garante o ciclo_uid anônimo (uma chamada por sessão de navegação). */
export function ensureIdentity(): void {
  if (typeof window === 'undefined' || dntActive()) return
  try {
    if (sessionStorage.getItem('ciclo_uid_init') === '1') return
    sessionStorage.setItem('ciclo_uid_init', '1')
  } catch {
    // sem sessionStorage, chama mesmo assim (a rota é idempotente)
  }
  fetch('/api/track/init', { credentials: 'same-origin' }).catch(() => {})
}

/** Envia um evento; usa sendBeacon para sobreviver à navegação. */
export function track(type: TrackType, meta?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || dntActive()) return
  const payload = JSON.stringify({
    type,
    path: window.location.pathname,
    title: document.title,
    referrer: document.referrer || undefined,
    meta,
  })
  try {
    const blob = new Blob([payload], { type: 'application/json' })
    if (navigator.sendBeacon?.('/api/track', blob)) return
  } catch {
    // cai no fetch abaixo
  }
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
    credentials: 'same-origin',
  }).catch(() => {})
}
