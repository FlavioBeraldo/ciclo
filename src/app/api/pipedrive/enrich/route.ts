import { NextRequest, NextResponse } from 'next/server'
import { after } from 'next/server'
import { isWebhookAuthorized } from '@/lib/webhook-auth'
import { runEnrichment } from '@/lib/enrichment'

export const runtime = 'nodejs'
export const maxDuration = 60

// Webhook added.deal do Pipedrive -> enriquecimento com Claude em background.
// Responde 200 imediatamente; o processamento roda via after().

function extractAddedDealId(body: Record<string, unknown>): number | null {
  // v1: {event: 'added.deal', current: {id}}
  if (typeof body.event === 'string') {
    if (body.event !== 'added.deal') return null
    const id = (body.current as Record<string, unknown> | undefined)?.id
    return id ? Number(id) : null
  }
  // v2: {meta: {action: 'create'|'added', entity: 'deal'}, data: {id}}
  const meta = body.meta as Record<string, unknown> | undefined
  if (meta?.entity === 'deal' && (meta.action === 'create' || meta.action === 'added')) {
    const id = (body.data as Record<string, unknown> | undefined)?.id
    return id ? Number(id) : null
  }
  return null
}

export async function POST(req: NextRequest) {
  if (!isWebhookAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  try {
    const body = (await req.json()) as Record<string, unknown>
    const dealId = extractAddedDealId(body)
    if (!dealId) return NextResponse.json({ skipped: true })

    after(async () => {
      try {
        const result = await runEnrichment(dealId)
        if (result.skipped) console.info('[Enrich] Deal', dealId, 'pulado:', result.skipped)
      } catch (err) {
        console.error('[Enrich] Erro em background (deal', dealId, '):', err)
      }
    })
    return NextResponse.json({ accepted: true, deal_id: dealId })
  } catch (err) {
    console.error('[Enrich] Erro no webhook:', err)
    return NextResponse.json({ ok: false })
  }
}

// Modo de teste: roda síncrono para um deal e devolve o JSON gerado.
// GET /api/pipedrive/enrich?secret=...&deal_id=NNN[&force=1]
export async function GET(req: NextRequest) {
  if (!isWebhookAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const dealId = Number(req.nextUrl.searchParams.get('deal_id'))
  if (!dealId) {
    return NextResponse.json({ error: 'deal_id obrigatório' }, { status: 400 })
  }
  try {
    const result = await runEnrichment(dealId, {
      force: req.nextUrl.searchParams.get('force') === '1',
    })
    return NextResponse.json(result)
  } catch (err) {
    console.error('[Enrich] Erro no modo de teste:', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
