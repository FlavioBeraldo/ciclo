// Contrato opcional com a CMP. Sem confirmação explícita, nenhum novo sinal de publicidade sai.
import type { classify } from '@/lib/playbook-profile'

type Consent = { marketing?: boolean; ad_storage?: string; ad_user_data?: string; ad_personalization?: string }
type Receipt = ReturnType<typeof classify> & { success: boolean; event_id: string; interno?: boolean }
export function publishClassifiedLead(r: Receipt) {
  const w = window as Window & { cicloPerfilPermissoes?: () => Consent; dataLayer?: unknown[] }
  const p = w.cicloPerfilPermissoes?.()
  if (!r.success || r.interno || !p || p.marketing !== true || p.ad_storage !== 'granted' ||
      p.ad_user_data !== 'granted' || p.ad_personalization !== 'granted') return
  const q = new URLSearchParams(window.location.search).get('utm_source')
  const stored = document.cookie.split('; ').find(c => c.startsWith('ciclo_perfil_origem='))?.split('=')[1]
  const allowed = (v?: string | null) => v && ['linkedin', 'meta', 'google'].includes(v) ? v : ''
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event: 'perfil_lead_classificado', pa_event_id: r.event_id, pa_perfil: r.perfil,
    pa_cargo: r.cargo, pa_tipo_negocio: r.tipo_negocio, pa_faixa_faturamento: r.faixa_faturamento,
    pa_papel_decisao: r.papel_decisao, pa_email_corporativo: r.email_corporativo,
    pa_origem: allowed(q) || allowed(stored) || 'nao_informada' })
}
