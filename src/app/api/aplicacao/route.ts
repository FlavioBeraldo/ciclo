// Aplicação da Consultoria E-com Shift (/aplicacao).
//
// Reaproveita a integração que já existe no projeto: createPipedriveLead cria
// Person + Organization + Deal, a jornada de conteúdo e o evento Lead da Meta
// seguem o mesmo caminho do /api/pipedrive. O que muda é só o destino fixo no
// CRM e o identificador próprio da oferta — nenhuma outra rota é afetada.
import { NextRequest, NextResponse, after } from 'next/server'
import { randomUUID } from 'node:crypto'
import { createPipedriveLead, pipedriveUrl } from '@/lib/pipedrive-server'
import { DEAL_FIELD_CARGO, DEAL_FIELD_OBJETIVO, DEAL_FIELD_SITE } from '@/lib/pipedrive-fields'
import { APL_COOKIE, APL_MAX_AGE, signSession, verifySession } from '@/lib/aplicacao-session'
import { bindVisitorToLead, UID_COOKIE } from '@/lib/identity-server'
import { clientInfoFromRequest, isInternalEmail, sendMetaEvent } from '@/lib/meta-capi'
import { applyJourneyToDeal, getLeadJourney } from '@/lib/lead-journey'

export const runtime = 'nodejs'

// Identificador único da oferta. O MESMO token viaja no dataLayer (GA4), na
// CAPI da Meta e no Pipedrive, para as três pontas falarem da mesma coisa.
const OFFER_ID = 'consultoria_ecom_shift'
const OFFER_LABEL = 'Aplicação — Consultoria E-com Shift'

// Destino fixo: funil "1 - Site/Whats (Passivo)" (2), etapa "Entrada de Lead"
// (8). Explícito de propósito — a busca por nome e a env global
// PIPEDRIVE_STAGE_ID não interferem nesta rota, e nenhuma outra rota muda.
const PIPELINE_ID = 2
const STAGE_ID = 8

/** Título do negócio, igual na criação e na atualização. */
function dealTitle(empresa: string, nome: string, email: string): string {
  const quem = empresa || nome || email
  return `Consultoria E-com Shift | ${quem}`.slice(0, 255)
}

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
          title: dealTitle(empresa, nome, email),
          [DEAL_FIELD_OBJETIVO]: objetivo,
          ...dealProps,
        }),
      })
      // Reenvio não é conversão nova: nada vai para a CAPI e o cliente recebe
      // duplicate:true com o event_id original, para não contar duas vezes.
      console.log('[Aplicacao] Reenvio — negócio atualizado:', existing.dealId)
      return NextResponse.json({ success: true, event_id: existing.eventId, duplicate: true })
    }

    const result = await createPipedriveLead({
      name: nome,
      email,
      phone: whatsapp,
      company: empresa || undefined,
      title: dealTitle(empresa, nome, email),
      objetivo,
      attribution,
      dealProps,
      stageId: STAGE_ID,
      pipelineId: PIPELINE_ID,
      extraMerge: {
        event_id: eventId,
        origem_formulario: OFFER_ID,
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
        // Mesmos identificadores do navegador. A faixa de faturamento fica só
        // no CRM: não é necessária para a conversão e não sai daqui.
        customData: {
          content_name: OFFER_ID,
          content_category: OFFER_ID,
          lead_type: OFFER_ID,
          lead_source: attr.source,
          lead_medium: attr.medium,
          lead_campaign: attr.campaign,
          deal_id: dealId,
        },
      })
    }

    console.log('[Aplicacao] Negócio criado:', dealId, '| origem', OFFER_ID, '| funil', PIPELINE_ID, '| etapa', STAGE_ID)
    return res
  } catch (err) {
    console.error('[Aplicacao] Erro interno:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
