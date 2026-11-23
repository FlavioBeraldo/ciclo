// Enriquecimento pós-sucesso. Nunca cria negócio ou pessoa nem reenvia o Lead.
import { NextRequest, NextResponse } from 'next/server'
import { isInternalEmail } from '@/lib/meta-capi'
import { businesses, classify, decisions, revenues, roles } from '@/lib/playbook-profile'
import { getVisitor } from '@/lib/supabase-server'
import { UID_COOKIE } from '@/lib/identity-server'
import { ATTRIBUTION_FIELD_KEYS } from '@/lib/pipedrive-fields'

const PROFILE_FIELD = '3581ad9c8d4612bf6cfce83ba340c2dc80af539c'
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const eventKey = /^(?:[a-f0-9-]{36}|\d{13}-[a-z0-9]{1,10})$/i
type Deal = { id: number; person_id: number | null; pipeline_id: number; label_ids?: number[]; custom_fields?: Record<string, unknown> }

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
// Identifica a etiqueta pelo nome na conta. O ID não é o do campo personalizado.
async function profileLabel(): Promise<number> {
  const response = await fetch('https://cicloe-commerce.pipedrive.com/api/v1/dealFields?limit=100', {
    headers: { 'x-api-token': process.env.PIPEDRIVE_API_TOKEN! }, signal: AbortSignal.timeout(5000),
    next: { revalidate: 300 },
  })
  if (!response.ok) throw new Error('Catálogo de etiquetas indisponível')
  const fields = (await response.json()).data as { key: string; options?: { label: string; id: number }[] }[]
  const labels = fields.find(field => ['label', 'label_ids'].includes(field.key))?.options
  const matches = labels?.filter(option => option.label === 'Perfil A')
  if (matches?.length !== 1) throw new Error('Etiqueta Perfil A indisponível')
  return Number(matches[0].id)
}

function submittedDeal(deal: Deal, id: string) {
  const extra = deal.custom_fields?.[ATTRIBUTION_FIELD_KEYS.extra]
  try { return typeof extra === 'string' && JSON.parse(extra).event_id === id }
  catch { return false }
}

// Os rótulos são do catálogo do formulário. Nenhum texto livre entra no HTML.
function noteContent(profile: ReturnType<typeof classify>, id: string) {
  function label(options: Record<string, string>, value: string) {
    return Object.hasOwn(options, value) ? options[value] : 'Não informado'
  }
  const lines = [
    '<b>Qualificação do Playbook de Social Commerce</b>',
    'Perfil comercial: ' + (profile.perfil === 'A' ? 'A' : 'B'),
    'Tipo de negócio: ' + label(businesses, profile.tipo_negocio),
    'Cargo: ' + label(roles, profile.cargo),
  ]
  if (profile.cargo === 'dono') lines.push('Faturamento anual da empresa: ' + label(revenues, profile.faixa_faturamento))
  if (['gestor', 'diretor'].includes(profile.cargo)) lines.push('Papel na contratação: ' + label(decisions, profile.papel_decisao))
  if (!profile.completa) lines.push('Qualificação incompleta: há respostas opcionais em branco.')
  lines.push('E-mail corporativo: ' + (profile.email_corporativo ? 'Sim' : 'Não'), 'Referência: ' + id)
  return lines.join('<br>')
}

async function saveProfileNote(dealId: number, personId: number, profile: ReturnType<typeof classify>,
  id: string, ledger: string, headers: Record<string, string>) {
  const row = ledger + '?' + new URLSearchParams({
    id: 'eq.' + (-dealId), event_id: 'eq.' + id, platform: 'eq.crm_perfil',
  })
  async function transition(from: string, to: string, noteId?: number) {
    const res = await fetch(row + '&select=id&status=eq.' + from, {
      method: 'PATCH', headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify({ status: to, ...(noteId ? { response: { note_id: noteId } } : {}) }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error('Registro da nota indisponível')
    return (await res.json()).length === 1
  }
  const url = 'https://cicloe-commerce.pipedrive.com/api/v1/notes'
  const auth = { 'x-api-token': process.env.PIPEDRIVE_API_TOKEN!, 'Content-Type': 'application/json' }
  let noteId: number | undefined
  if (await transition('received', 'note_pending')) {
    const res = await fetch(url, { method: 'POST', headers: auth, signal: AbortSignal.timeout(5000),
      body: JSON.stringify({ deal_id: dealId, person_id: personId, content: noteContent(profile, id) }) })
    if (!res.ok) {
      // Uma recusa explícita permite outra tentativa. Timeout/resposta ambígua exige reconciliação.
      if ([400, 401, 403, 404, 422, 429].includes(res.status)) await transition('note_pending', 'received')
      throw new Error('Nota comercial pendente')
    }
    const reply = await res.json()
    if (reply.success) noteId = reply.data?.id
  } else {
    // Se a resposta se perdeu, procure a nota já aceita antes de liberar os eventos.
    // Uma tentativa concorrente jamais faz um segundo POST de criação.
    let start = 0
    while (!noteId) {
      const res = await fetch(url + '?' + new URLSearchParams({ deal_id: String(dealId),
        limit: '100', start: String(start) }), { headers: auth, cache: 'no-store', signal: AbortSignal.timeout(5000) })
      if (!res.ok) throw new Error('Consulta da nota indisponível')
      const page = await res.json()
      if (!page.success) throw new Error('Consulta da nota recusada')
      const existing = (page.data || []).find((n: { person_id: number; deal_id: number; content: string }) =>
        n.person_id === personId && n.deal_id === dealId && n.content.includes('Referência: ' + id) &&
        n.content.includes('Qualificação do Playbook de Social Commerce'))
      if (existing) { noteId = existing.id; break }
      const next = page.additional_data?.pagination
      if (!next?.more_items_in_collection || !Number.isSafeInteger(next.next_start) || next.next_start <= start) break
      start = next.next_start
    }
  }
  if (!noteId || !Number.isSafeInteger(noteId)) throw new Error('Aguardando confirmação da nota')
  await transition('note_pending', 'note_saved', noteId)
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
    const deal = deals.find(d => d.person_id === visitor.pipedrive_person_id &&
      d.pipeline_id === 13 && submittedDeal(d, body.recibo))
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
      deal_id: 'eq.' + deal.id, select: 'payload,status', order: 'id.asc', limit: '1' })
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
    if (profile.perfil === 'A') {
      const labelId = await profileLabel()
      const fresh: Deal = await crm('/deals/' + deal.id)
      // Uma resposta parcial não autoriza substituir etiquetas que não conseguimos ler.
      const existing = fresh.label_ids
      if (!Array.isArray(existing) || !existing.every(Number.isSafeInteger)) {
        throw new Error('Lista de etiquetas indisponível')
      }
      if (!existing.includes(labelId)) {
        // A API substitui o conjunto de etiquetas. Une aos valores lidos no negócio.
        await crm('/deals/' + deal.id, { method: 'PATCH', body: JSON.stringify({ label_ids: [...existing, labelId] }) })
      }
    }
    if (saved.status !== 'note_saved') {
      await saveProfileNote(deal.id, visitor.pipedrive_person_id, profile, id, ledger, headers)
    }
    return NextResponse.json({
      success: true, event_id: id, ...profile, interno: isInternalEmail(visitor.email),
      // O navegador ainda exige o consentimento explícito da CMP antes do evento.
      sinais_permitidos: visitor.opted_out === false,
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    console.error('[Playbook Perfil] Falha no enriquecimento independente')
    return new Response(null, { status: 503 })
  }
}
