import { NextRequest, NextResponse } from 'next/server'
import { pipedriveUrl, attributionFieldKeys } from '@/lib/pipedrive-server'

export const runtime = 'nodejs'

// Webhook do Pipedrive: quando um Negócio vira "won", envia um evento purchase
// ao GA4 via Measurement Protocol, amarrado ao GA Client ID capturado no lead.
//
// Autenticação: Basic (user "pipedrive", senha PIPEDRIVE_WEBHOOK_SECRET) OU ?secret=.
// Sempre responde 200 após autenticar (para o Pipedrive não desativar o webhook).

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.PIPEDRIVE_WEBHOOK_SECRET
  if (!secret) {
    console.error('[Webhook] PIPEDRIVE_WEBHOOK_SECRET não configurado')
    return false
  }
  if (req.nextUrl.searchParams.get('secret') === secret) return true
  const auth = req.headers.get('authorization') ?? ''
  if (auth.startsWith('Basic ')) {
    try {
      const [user, pass] = Buffer.from(auth.slice(6), 'base64').toString('utf8').split(':')
      return user === 'pipedrive' && pass === secret
    } catch {
      return false
    }
  }
  return false
}

// Aceita payload v1 ({event, current, previous}) e v2 ({meta:{action,entity}, data, previous})
function extractDeal(body: Record<string, unknown>): {
  current: Record<string, unknown> | null
  previous: Record<string, unknown> | null
} {
  const current = (body.current ?? body.data ?? null) as Record<string, unknown> | null
  const previous = (body.previous ?? null) as Record<string, unknown> | null
  return { current, previous }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const debug = req.nextUrl.searchParams.get('debug') === '1'

  try {
    const body = (await req.json()) as Record<string, unknown>
    const { current, previous } = extractDeal(body)

    const becameWon = current?.status === 'won' && previous?.status !== 'won'
    if (!becameWon || !current?.id) {
      return NextResponse.json({ skipped: true })
    }

    // G-EY1FLE5C0J = fluxo GA4 do container GTM-5NNPNZ (fallback se a env não estiver definida)
    const measurementId = process.env.GA4_MEASUREMENT_ID || 'G-EY1FLE5C0J'
    const apiSecret = process.env.GA4_API_SECRET
    if (!apiSecret) {
      console.error('[Webhook] GA4_API_SECRET não configurado')
      return NextResponse.json({ skipped: true, reason: 'ga4_env_missing' })
    }

    // Busca o deal completo para ler os campos personalizados de atribuição
    const dealId = Number(current.id)
    const dealRes = await fetch(pipedriveUrl(`/deals/${dealId}`))
    const dealData = await dealRes.json()
    if (!dealData.success || !dealData.data) {
      console.error('[Webhook] Falha ao buscar deal', dealId, dealData?.error ?? '')
      return NextResponse.json({ skipped: true, reason: 'deal_fetch_failed' })
    }
    const deal = dealData.data as Record<string, unknown>

    const keys = attributionFieldKeys()
    const field = (k: keyof typeof keys): string | undefined => {
      const v = deal[keys[k]]
      return typeof v === 'string' && v.trim() !== '' ? v : undefined
    }

    const storedClientId = field('ga_client_id')
    // Sem client_id capturado: usa um determinístico derivado do id do deal
    const clientId = storedClientId ?? `${1000000000 + dealId}.${1700000000 + dealId}`
    const sessionId = field('ga_session_id')

    const value = Number(deal.value ?? 0)
    if (!value) {
      console.warn('[Webhook] Deal', dealId, 'ganho com valor 0/nulo — enviando mesmo assim')
    }

    const params: Record<string, unknown> = {
      transaction_id: `pd-${dealId}`,
      value,
      currency: (deal.currency as string) || 'BRL',
      deal_id: dealId,
      deal_title: deal.title,
      pipeline_id: deal.pipeline_id,
      stage_id: deal.stage_id,
      lead_source: field('source'),
      lead_medium: field('medium'),
      lead_campaign: field('campaign'),
      engagement_time_msec: 1,
      items: [{ item_id: `deal-${dealId}`, item_name: deal.title, price: value, quantity: 1 }],
    }
    if (sessionId) params.session_id = sessionId
    if (!storedClientId) params.attribution_fallback = true

    const endpoint = debug
      ? 'https://www.google-analytics.com/debug/mp/collect'
      : 'https://www.google-analytics.com/mp/collect'
    const mpRes = await fetch(
      `${endpoint}?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          non_personalized_ads: false,
          events: [{ name: 'purchase', params }],
        }),
      }
    )

    console.log('[Webhook] purchase enviado ao GA4 — deal', dealId, 'valor', value, 'status MP', mpRes.status)

    if (debug) {
      const validation = await mpRes.json().catch(() => null)
      return NextResponse.json({ sent: true, deal_id: dealId, ga_validation: validation })
    }
    return NextResponse.json({ sent: true, deal_id: dealId })
  } catch (err) {
    // Nunca responder erro ao Pipedrive — ele desativa webhooks que falham repetidamente
    console.error('[Webhook] Erro interno:', err)
    return NextResponse.json({ ok: false })
  }
}
