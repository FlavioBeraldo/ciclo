import { NextRequest, NextResponse, after } from 'next/server'
import { randomUUID } from 'node:crypto'
import { createPipedriveLead } from '@/lib/pipedrive-server'
import { LI_COOKIE, verifyProfile } from '@/lib/linkedin-session'
import { bindVisitorToLead, UID_COOKIE } from '@/lib/identity-server'
import { clientInfoFromRequest, isInternalEmail, sendMetaEvent } from '@/lib/meta-capi'
import { applyJourneyToDeal, getLeadJourney } from '@/lib/lead-journey'

export const runtime = 'nodejs'

// Conteúdo do evento Lead por origem do formulário (aparece na Meta como content_name)
function leadContent(pipeline: string | undefined, source: string | undefined) {
  if (pipeline?.toLowerCase() === 'playbook') {
    return { content_name: 'playbook-social-commerce', content_category: 'material', lead_type: 'playbook' }
  }
  return { content_name: 'fale-com-especialista', content_category: 'contato', lead_type: 'contato', form_source: source }
}

export async function POST(req: NextRequest) {
  if (!process.env.PIPEDRIVE_API_TOKEN) {
    console.error('[Pipedrive] PIPEDRIVE_API_TOKEN não configurado')
    return NextResponse.json({ error: 'Pipedrive não configurado' }, { status: 500 })
  }

  try {
    const {
      name, email, phone, whatsapp, company, message, storeUrl, annualRevenue, segment, pipeline, attribution,
      event_id: eventIdFromClient, page_url,
    } = await req.json()

    // Cadastro via LinkedIn: o perfil vem do cookie httpOnly ASSINADO (não do body),
    // então "verificado" é garantido pelo servidor, não pelo cliente.
    const liProfile = verifyProfile(req.cookies.get(LI_COOKIE)?.value)
    const objetivo = [
      annualRevenue ? `Faturamento anual: ${annualRevenue}` : null,
      segment ? `Segmento: ${segment}` : null,
      storeUrl ? `URL da loja: ${storeUrl}` : null,
      message || null,
    ].filter(Boolean).join('\n\n')

    if (!name || !email) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    // event_id compartilhado com o Pixel (dedup navegador <-> servidor)
    const eventId: string =
      typeof eventIdFromClient === 'string' && eventIdFromClient.length >= 8 && eventIdFromClient.length <= 64
        ? eventIdFromClient
        : randomUUID()
    const internal = isInternalEmail(email)
    const attr = (typeof attribution === 'object' && attribution !== null ? attribution : {}) as Record<string, string | undefined>
    const pipelineHint = typeof pipeline === 'string' && pipeline.trim() ? pipeline.trim() : undefined

    const result = await createPipedriveLead({
      name,
      email,
      phone: phone ?? whatsapp ?? '',
      company,
      objetivo,
      pipelineHint,
      attribution,
      linkedin: liProfile,
      extraMerge: { event_id: eventId, ...(internal ? { internal: true } : {}) },
    })

    if (!result.success) {
      return NextResponse.json({ error: 'Erro ao criar deal' }, { status: 500 })
    }

    // Identidade: cookie ciclo_uid + vínculo pessoa<->navegação (pós-aceite LGPD)
    const res = NextResponse.json({ success: true, event_id: eventId })
    const client = clientInfoFromRequest(req)
    const uid =
      (await bindVisitorToLead(req, res, {
        personId: result.personId,
        email,
        match: { fbp: attr.fbp, fbc: attr.fbc, ...client },
      })) ?? req.cookies.get(UID_COOKIE)?.value

    // Jornada de conteúdo (posts/páginas vistos antes de converter) -> Pipedrive + Meta
    const conversionLabel = pipelineHint?.toLowerCase() === 'playbook' ? 'Playbook Social Commerce' : 'Formulário de contato'
    const journey = await getLeadJourney(uid, attr.landing_page, pipelineHint?.toLowerCase() === 'playbook' ? 'playbook' : 'home')
    if (result.dealId) {
      const dealId = result.dealId
      after(() => applyJourneyToDeal(dealId, journey, conversionLabel))
    }

    // API de Conversões (Meta): mesmo event_id do Pixel; pula e-mails internos
    if (!internal) {
      const [firstName, ...rest] = String(name).trim().split(/\s+/)
      const origin = req.headers.get('origin') ?? req.nextUrl.origin
      const eventSourceUrl =
        typeof page_url === 'string' && page_url.startsWith('http')
          ? page_url
          : `${origin}${pipelineHint?.toLowerCase() === 'playbook' ? '/playbook-social-commerce' : '/#contato'}`
      await sendMetaEvent({
        eventName: 'Lead',
        eventId,
        actionSource: 'website',
        eventSourceUrl,
        userData: {
          email,
          phone: phone ?? whatsapp ?? null,
          firstName,
          lastName: rest.join(' ') || null,
          externalId: uid ?? null,
          fbp: attr.fbp ?? req.cookies.get('_fbp')?.value ?? null,
          fbc: attr.fbc ?? req.cookies.get('_fbc')?.value ?? null,
          ...client,
        },
        customData: {
          ...leadContent(pipelineHint, undefined),
          lead_source: attr.source,
          lead_medium: attr.medium,
          lead_campaign: attr.campaign,
          content_source: journey.entry?.label,
          content_last: journey.lastContent?.label,
          deal_id: result.dealId,
          pipeline: pipelineHint ?? 'Site/WhatsApp',
        },
        context: { dealId: result.dealId, personId: result.personId, uid },
      })
    } else {
      console.info('[Meta CAPI] Lead interno ignorado:', email)
    }

    return res
  } catch (err) {
    console.error('[Pipedrive] Erro interno:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
