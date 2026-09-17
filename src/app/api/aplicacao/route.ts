// Aplicação da Consultoria E-com Shift (/aplicacao).
//
// Reaproveita a integração que já existe no projeto: createPipedriveLead cria
// Person + Organization + Deal no mesmo funil dos outros formulários, a jornada
// de conteúdo e o evento Lead da Meta seguem o mesmo caminho do /api/pipedrive.
// A origem fica marcada em `origem_formulario: consultoria-ecom-shift`, sem
// mudar o comportamento de nenhum outro formulário.
import { NextRequest, NextResponse, after } from 'next/server'
import { randomUUID } from 'node:crypto'
import { createPipedriveLead, pipedriveUrl } from '@/lib/pipedrive-server'
import { DEAL_FIELD_CARGO, DEAL_FIELD_OBJETIVO, DEAL_FIELD_SITE } from '@/lib/pipedrive-fields'
import { APL_COOKIE, APL_MAX_AGE, signSession, verifySession } from '@/lib/aplicacao-session'
import { bindVisitorToLead, UID_COOKIE } from '@/lib/identity-server'
import { clientInfoFromRequest, isInternalEmail, sendMetaEvent } from '@/lib/meta-capi'
import { applyJourneyToDeal, getLeadJourney } from '@/lib/lead-journey'

export const runtime = 'nodejs'

const ORIGIN_TAG = 'consultoria-ecom-shift'
const OFFER_LABEL = 'Aplicação — Consultoria E-com Shift'

interface Body {
  nome?: string
  email?: string
  whatsapp?: string
  empresa?: string
  site?: string
  cargo?: string
  faturamento?: string
  desafio?: string
  attribution?: unknown
  event_id?: string
  page_url?: string
}

/** Texto do campo "Objetivo" do negócio, com o contexto que a pessoa enviou. */
function buildObjetivo(data: Body): string {
  return [
    OFFER_LABEL,
    data.cargo ? `Cargo: ${data.cargo}` : null,
    data.faturamento ? `Faturamento anual: ${data.faturamento}` : null,
    data.site ? `Loja: ${data.site}` : null,
    data.desafio ? `\nPrincipal desafio da operação:\n${data.desafio}` : null,
  ]
    .filter(Boolean)
    .join('\n')
}

export async function POST(req: NextRequest) {
  if (!process.env.PIPEDRIVE_API_TOKEN) {
    console.error('[Aplicacao] PIPEDRIVE_API_TOKEN não configurado')
    return NextResponse.json({ error: 'Integração indisponível no momento' }, { status: 500 })
  }

  try {
    const body = (await req.json()) as Body
    const nome = (body.nome ?? '').trim()
    const email = (body.email ?? '').trim()
    const whatsapp = (body.whatsapp ?? '').trim()
    const empresa = (body.empresa ?? '').trim()
    const site = (body.site ?? '').trim()
    const cargo = (body.cargo ?? '').trim()
    const faturamento = (body.faturamento ?? '').trim()
    const desafio = (body.desafio ?? '').trim()

    if (nome.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const eventId =
      typeof body.event_id === 'string' && body.event_id.length >= 8 && body.event_id.length <= 64
        ? body.event_id
        : randomUUID()
    const attribution = body.attribution
    const attr = (typeof attribution === 'object' && attribution !== null ? attribution : {}) as Record<
      string,
      string | undefined
    >
    const internal = isInternalEmail(email)
    const objetivo = buildObjetivo({ cargo, faturamento, site, desafio })
    const dealProps: Record<string, unknown> = {}
    if (cargo) dealProps[DEAL_FIELD_CARGO] = cargo.slice(0, 255)
    if (site) dealProps[DEAL_FIELD_SITE] = site.slice(0, 255)

    // ── Reenvio da mesma aplicação: atualiza o negócio já criado ────────────
    const existing = verifySession(req.cookies.get(APL_COOKIE)?.value)
    if (existing && existing.email === email) {
      await fetch(pipedriveUrl(`/deals/${existing.dealId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [DEAL_FIELD_OBJETIVO]: objetivo,
          ...dealProps,
          ...(empresa ? { title: empresa } : {}),
        }),
      })
      console.log('[Aplicacao] Reenvio — negócio atualizado:', existing.dealId)
      return NextResponse.json({ success: true, event_id: existing.eventId, duplicate: true })
    }

    const result = await createPipedriveLead({
      name: nome,
      email,
      phone: whatsapp,
      company: empresa || undefined,
      objetivo,
      attribution,
      dealProps,
      extraMerge: {
        event_id: eventId,
        origem_formulario: ORIGIN_TAG,
        ...(internal ? { internal: true } : {}),
      },
    })

    if (!result.success || !result.dealId) {
      return NextResponse.json({ error: 'Não foi possível registrar a aplicação' }, { status: 500 })
    }

    const res = NextResponse.json({ success: true, event_id: eventId })
    res.cookies.set(
      APL_COOKIE,
      signSession({ dealId: result.dealId, personId: result.personId, eventId, email }),
      { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: APL_MAX_AGE }
    )

    // Identidade + jornada de conteúdo — mesma trilha dos outros formulários
    const client = clientInfoFromRequest(req)
    const uid =
      (await bindVisitorToLead(req, res, {
        personId: result.personId,
        email,
        match: { fbp: attr.fbp, fbc: attr.fbc, ...client },
      })) ?? req.cookies.get(UID_COOKIE)?.value

    const dealId = result.dealId
    const journey = await getLeadJourney(uid, attr.landing_page, 'outro')
    after(() => applyJourneyToDeal(dealId, journey, OFFER_LABEL))

    // Conversão Lead na Meta com o mesmo event_id do Pixel
    if (!internal) {
      const [firstName, ...rest] = nome.split(/\s+/)
      const origin = req.headers.get('origin') ?? req.nextUrl.origin
      await sendMetaEvent({
        eventName: 'Lead',
        eventId,
        actionSource: 'website',
        eventSourceUrl:
          typeof body.page_url === 'string' && body.page_url.startsWith('http')
            ? body.page_url
            : `${origin}/aplicacao`,
        userData: {
          email,
          phone: whatsapp || null,
          firstName,
          lastName: rest.join(' ') || null,
          externalId: uid ?? null,
          fbp: attr.fbp ?? req.cookies.get('_fbp')?.value ?? null,
          fbc: attr.fbc ?? req.cookies.get('_fbc')?.value ?? null,
          ...client,
        },
        customData: {
          content_name: ORIGIN_TAG,
          content_category: 'aplicacao',
          lead_type: 'consultoria-ecom-shift',
          lead_source: attr.source,
          lead_medium: attr.medium,
          lead_campaign: attr.campaign,
          deal_id: dealId,
          annual_revenue: faturamento,
        },
      })
    }

    console.log('[Aplicacao] Negócio criado:', dealId, '| origem', ORIGIN_TAG)
    return res
  } catch (err) {
    console.error('[Aplicacao] Erro interno:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
