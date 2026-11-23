// Enriquecimento pós-sucesso. Nunca cria negócio ou pessoa nem reenvia o Lead.
import { NextRequest, NextResponse } from 'next/server'
import { classify } from '@/lib/playbook-profile'
import { getVisitor } from '@/lib/supabase-server'
import { UID_COOKIE } from '@/lib/identity-server'
import { ATTRIBUTION_FIELD_KEYS } from '@/lib/pipedrive-fields'

const PROFILE_FIELD = '3581ad9c8d4612bf6cfce83ba340c2dc80af539c'
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const eventKey = /^(?:[a-f0-9-]{36}|\d{13}-[a-z0-9]{1,10})$/i
type Deal = { id: number; custom_fields?: Record<string, unknown> }

async function crm(path: string, init?: RequestInit) {
  const res = await fetch('https://cicloe-commerce.pipedrive.com/api/v2' + path, {
    ...init, cache: 'no-store', signal: AbortSignal.timeout(5000),
    headers: { 'x-api-token': process.env.PIPEDRIVE_API_TOKEN!, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error('CRM ' + res.status)
  const body = await res.json()
  if (body.success !== true) throw new Error('CRM recusou a operação')
  return body.data
}
function submittedDeal(deal: Deal, id: string) {
  const extra = deal.custom_fields?.[ATTRIBUTION_FIELD_KEYS.extra]
  try { return typeof extra === 'string' && JSON.parse(extra).event_id === id }
  catch { return false }
}

export async function POST(req: NextRequest) {
  if (req.headers.get('origin') !== req.nextUrl.origin) return new Response(null, { status: 403 })
  const uid = req.cookies.get(UID_COOKIE)?.value || ''
  if (!uuid.test(uid)) return new Response(null, { status: 403 })
  try {
    const body = await req.json()
    if (!eventKey.test(String(body?.recibo || '')) || !body.respostas || typeof body.respostas !== 'object') {
      return new Response(null, { status: 400 })
    }
    // A pessoa é resolvida no servidor. O cliente não escolhe IDs de registros.
    const visitor = await getVisitor(uid)
    if (!visitor?.pipedrive_person_id || !visitor.email) return new Response(null, { status: 409 })
    const params = new URLSearchParams({
      person_id: String(visitor.pipedrive_person_id), pipeline_id: '13', limit: '25',
      sort_by: 'add_time', sort_direction: 'desc', custom_fields: [ATTRIBUTION_FIELD_KEYS.extra, PROFILE_FIELD].join(','),
    })
    const deals: Deal[] = await crm('/deals?' + params)
    const deal = deals.find(d => submittedDeal(d, body.recibo))
    if (!deal) return new Response(null, { status: 409 })
    const result = classify(body.respostas, visitor.email)
    // Journal operacional separado. Permite projetar os demais campos quando houver cota.
    // Guarda categorias, vínculo e recibo; não copia e-mail, telefone ou URL.
    const base = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!base || !key) return new Response(null, { status: 503 })
    const id = 'pa-l-' + body.recibo
    const ledger = base + '/rest/v1/conversion_events'
    const headers = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }
    const lookup = new URLSearchParams({ platform: 'eq.crm_perfil', event_id: 'eq.' + id,
      deal_id: 'eq.' + deal.id, select: 'payload', order: 'id.asc', limit: '1' })
    // A sequência bigserial do log atribui IDs positivos. Chave negativa por negócio
    // isola este novo evento e torna recarregamentos e tentativas concorrentes idempotentes.
    const recorded = await fetch(ledger + '?on_conflict=id', { method: 'POST',
      headers: { ...headers, Prefer: 'resolution=ignore-duplicates,return=minimal' },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({ id: -deal.id, platform: 'crm_perfil', event_name: 'perfil_lead_classificado',
        event_id: id, status: 'received', deal_id: deal.id, person_id: visitor.pipedrive_person_id, payload: result }) })
    if (!recorded.ok) throw new Error('Falha ao registrar classificação')
    const prior = await fetch(ledger + '?' + lookup, { headers, cache: 'no-store', signal: AbortSignal.timeout(5000) })
    if (!prior.ok) throw new Error('Consulta ao registro indisponível')
    const [saved] = await prior.json()
    if (!saved?.payload) throw new Error('Registro não localizado')
    const profile = saved.payload
    if (deal.custom_fields?.[PROFILE_FIELD] !== profile.perfil) {
      await crm('/deals/' + deal.id, { method: 'PATCH',
        body: JSON.stringify({ custom_fields: { [PROFILE_FIELD]: profile.perfil } }) })
    }
    return NextResponse.json({ success: true, event_id: id, ...profile }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    console.error('[Playbook Perfil] Falha no enriquecimento independente')
    return new Response(null, { status: 503 })
  }
}
