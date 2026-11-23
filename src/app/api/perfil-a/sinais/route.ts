import { NextRequest } from 'next/server'
import { consentPreview, profileNoticeEnabled } from '@/lib/consent-preview'
import { choiceCookie, decodeChoice, policyVersion } from '@/lib/privacy-choice'
import { clientInfoFromRequest, isInternalEmail, sendMetaEvent, type MetaUserDataInput } from '@/lib/meta-capi'
import { UID_COOKIE } from '@/lib/identity-server'
import { getVisitor } from '@/lib/supabase-server'

const uuid = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const sources = ['linkedin', 'meta', 'google']
const empty = (status: number) => new Response(null, { status, headers: { 'Cache-Control': 'no-store' } })

export async function POST(req: NextRequest) {
  if (!profileNoticeEnabled) return empty(404)
  if (req.headers.get('origin') !== req.nextUrl.origin || !req.headers.get('content-type')?.startsWith('application/json')) return empty(403)
  const cookie = (name: string) => req.cookies.get(name)?.value || ''
  const ref = cookie('ciclo_pa_recibo')
  if (!uuid.test(ref) || decodeChoice(cookie(choiceCookie)) !== true) return empty(403)
  const data = await req.json().catch(() => null)
  const id = data?.id
  const nome = data?.nome
  const visit = nome === 'visita_perfil_a'
  if (typeof id !== 'string' || id.length > 48 || (!visit && nome !== 'lead_perfil_a')) return empty(400)
  if (visit ? !id.startsWith('pa-v-') || !uuid.test(id.slice(5)) :
    !id.startsWith('pa-l-') || !(uuid.test(id.slice(5)) || /^\d{13}-[a-z0-9]{1,10}$/i.test(id.slice(5)))) return empty(400)
  const origem = sources.includes(data.origem) ? data.origem : 'nao_informada'
  if (visit && (cookie('ciclo_perfil') !== 'A' || !sources.includes(origem) || cookie('ciclo_perfil_origem') !== origem)) return empty(403)
  const base = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const expected = consentPreview ? 'https://zlbpaawgzycaopobfxva.supabase.co' : 'https://nffvtuadqwziwbzpjmlq.supabase.co'
  if (!key || base !== expected) return empty(503)
  const headers = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }
  const db = (path: string, init?: RequestInit) => fetch(base + '/rest/v1/' + path,
    { ...init, headers, cache: 'no-store', signal: AbortSignal.timeout(5000) })
  try {
    const uid = cookie(UID_COOKIE)
    const visitor = uuid.test(uid) ? await getVisitor(uid) : null
    if (visitor?.opted_out || isInternalEmail(visitor?.email)) return empty(403)
    const userData: MetaUserDataInput = { ...clientInfoFromRequest(req), fbp: cookie('_fbp'), fbc: cookie('_fbc') }
    const customData: Record<string, unknown> = { perfil: 'A', origem }
    let personId: number | undefined, dealId: number | undefined
    if (!visit) {
      if (!visitor?.pipedrive_person_id || !visitor.email || visitor.opted_out !== false) return empty(403)
      const query = new URLSearchParams({ event_id: 'eq.' + id, platform: 'eq.crm_perfil', status: 'eq.note_saved',
        person_id: 'eq.' + visitor.pipedrive_person_id, select: 'payload,deal_id,sent_at', limit: '1' })
      const ledger = await db('conversion_events?' + query)
      if (!ledger.ok) return empty(503)
      const [row] = await ledger.json()
      if (row?.payload?.perfil !== 'A' || Date.parse(row.sent_at) < Date.now()-86400000) return empty(403)
      personId = visitor.pipedrive_person_id
      dealId = row.deal_id
      for (const k of ['cargo','tipo_negocio','faixa_faturamento','papel_decisao']) customData[k] = row.payload[k]
      userData.email = visitor.email
    }
    // O recibo mais recente e a reserva idempotente são conferidos numa transação.
    const claim = await db('rpc/perfil_a_reservar', { method: 'POST', body: JSON.stringify({
      p_id: id, p_nome: nome, p_recibo: ref, p_versao: policyVersion }) })
    if (!claim.ok) return empty(503)
    const status = await claim.json()
    if (status === 'negado') return empty(403)
    if (status === 'aguarde') return empty(503)
    if (status === 'entregue' || status === 'sessao') return empty(204)
    if (status !== 'enviar') return empty(503)
    // A homologação nunca contata o pixel nem o CRM oficial.
    if (consentPreview) return empty(202)
    if (personId) {
      const token = process.env.PIPEDRIVE_API_TOKEN
      if (!token) return empty(503)
      const person = await fetch('https://cicloe-commerce.pipedrive.com/api/v2/persons/' + personId, {
        headers: { 'x-api-token': token }, cache: 'no-store', signal: AbortSignal.timeout(5000) })
      if (!person.ok) return empty(503)
      const contact = (await person.json()).data
      if (contact?.id !== personId) return empty(503)
      const phones: { value: string; primary?: boolean }[] = contact.phones || []
      userData.phone = (phones.find(p => p.primary) || phones[0])?.value
    }
    const result = await sendMetaEvent({ eventName: nome, eventId: id,
      eventSourceUrl: req.nextUrl.origin + (visit ? '/' : '/playbook-social-commerce'),
      userData, customData, context: { personId, dealId } })
    if (!result.sent || result.eventsReceived !== 1) return empty(503)
    const ack = await db('perfil_a_entregas?event_id=eq.' + encodeURIComponent(id), {
      method: 'PATCH', body: JSON.stringify({ enviado: true }) })
    return empty(ack.ok ? 204 : 503)
  } catch { return empty(503) }
}
