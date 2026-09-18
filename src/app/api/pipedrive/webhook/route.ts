import { NextRequest, NextResponse } from 'next/server'
import { pipedriveUrl, attributionFieldKeys } from '@/lib/pipedrive-server'
import { isWebhookAuthorized } from '@/lib/webhook-auth'
import { funnelEventForStage, sendDealFunnelEvent, type DealLike } from '@/lib/pipedrive-funnel-events'
import { processGa4LeadEvents } from '@/lib/ga4-lead-events'

export const runtime = 'nodejs'

// Webhook do Pipedrive (updated.deal):
//  - mudança de etapa -> evento de funil na Meta (Schedule, QualifiedLead, ...) via CAPI
//  - funis Site/Whats e Playbooks -> qualify_lead / close_convert_lead no GA4
//                        (regras em lib/ga4-lead-events.ts)
//  - negócio "won"    -> Purchase na Meta (CAPI) + purchase no GA4 (Measurement Protocol),
//                        amarrado ao GA Client ID capturado no lead.
//
// Autenticação: Basic (user "pipedrive", senha PIPEDRIVE_WEBHOOK_SECRET) OU ?secret=.
// Sempre responde 200 após autenticar (para o Pipedrive não desativar o webhook).

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
  if (!isWebhookAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const debug = req.nextUrl.searchParams.get('debug') === '1'

  try {
    const body = (await req.json()) as Record<string, unknown>
    const { current, previous } = extractDeal(body)

    if (!current?.id) return NextResponse.json({ skipped: true })
    // v2 manda em "previous" só os campos alterados: exige a chave presente
    const prevHas = (k: string) => previous !== null && Object.prototype.hasOwnProperty.call(previous, k)
    const becameWon = current.status === 'won' && prevHas('status') && previous!.status !== 'won'
    const stageChanged =
      typeof current.stage_id === 'number' && prevHas('stage_id') && previous!.stage_id !== current.stage_id

    if (!stageChanged && !becameWon) {
      return NextResponse.json({ skipped: true })
    }

    // Busca o deal completo (uma vez) para ler os campos personalizados de atribuição
    const dealId = Number(current.id)
    const dealRes = await fetch(pipedriveUrl(`/deals/${dealId}`))
    const dealData = await dealRes.json()
    if (!dealData.success || !dealData.data) {
      console.error('[Webhook] Falha ao buscar deal', dealId, dealData?.error ?? '')
      return NextResponse.json({ skipped: true, reason: 'deal_fetch_failed' })
    }
    const deal = dealData.data as Record<string, unknown>

    // ── GA4: qualify_lead / close_convert_lead (só funis Site/Whats e Playbooks) ─
    const ga4 = await processGa4LeadEvents(deal as DealLike, { stageChanged, becameWon }, { debug })

    // ── Meta: evento de funil por mudança de etapa ─────────────────────────────
    const meta: Record<string, unknown> = {}
    if (stageChanged && !becameWon) {
      const funnelEvent = await funnelEventForStage(current.stage_id as number)
      if (funnelEvent) {
        meta[funnelEvent.name] = await sendDealFunnelEvent(deal as DealLike, funnelEvent)
      }
    }

    if (!becameWon) {
      return NextResponse.json({ skipped: false, ga4, meta })
    }

    // G-EY1FLE5C0J = fluxo GA4 do container GTM-5NNPNZ (fallback se a env não estiver definida)
    const measurementId = process.env.GA4_MEASUREMENT_ID || 'G-EY1FLE5C0J'
    const apiSecret = process.env.GA4_API_SECRET

    // Meta: Purchase (CAPI) com o valor do negócio — independe do GA Client ID
    meta.Purchase = await sendDealFunnelEvent(deal as DealLike, { name: 'Purchase', custom: false })

    const keys = attributionFieldKeys()
    const field = (k: keyof typeof keys): string | undefined => {
      const v = deal[keys[k]]
      return typeof v === 'string' && v.trim() !== '' ? v : undefined
    }

    // Regra de negócio: só reporta receita ao GA4 quando o lead veio dos canais
    // digitais (entrou pelo site e portanto tem GA Client ID capturado no deal).
    const clientId = field('ga_client_id')
    if (!apiSecret) {
      console.error('[Webhook] GA4_API_SECRET não configurado')
      return NextResponse.json({ skipped: true, reason: 'ga4_env_missing', ga4, meta })
    }
    if (!clientId) {
      console.info('[Webhook] Deal', dealId, 'ganho sem GA Client ID — skip GA4 (lead não veio do site)')
      return NextResponse.json({ skipped: true, reason: 'no_ga_client_id', ga4, meta })
    }
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
      // Separa compras vindas do CRM das do checkout Hubla no GA4
      sales_channel: 'pipedrive',
      pipeline_id: deal.pipeline_id,
      stage_id: deal.stage_id,
      lead_source: field('source'),
      lead_medium: field('medium'),
      lead_campaign: field('campaign'),
      engagement_time_msec: 1,
      items: [{ item_id: `deal-${dealId}`, item_name: deal.title, price: value, quantity: 1 }],
    }
    if (sessionId) params.session_id = sessionId

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
      return NextResponse.json({ sent: true, deal_id: dealId, ga_validation: validation, ga4, meta })
    }
    return NextResponse.json({ sent: true, deal_id: dealId, ga4, meta })
  } catch (err) {
    // Nunca responder erro ao Pipedrive — ele desativa webhooks que falham repetidamente
    console.error('[Webhook] Erro interno:', err)
    return NextResponse.json({ ok: false })
  }
}
