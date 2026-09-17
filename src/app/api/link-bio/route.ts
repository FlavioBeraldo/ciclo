import { NextRequest, NextResponse, after } from 'next/server'
import { randomUUID } from 'node:crypto'
import {
  pipedriveUrl,
  findOrCreateOrg,
  findOrCreatePerson,
  findStageId,
  findUserId,
  attributionDealProps,
} from '@/lib/pipedrive-server'
import { DEAL_FIELD_CARGO, DEAL_FIELD_OBJETIVO } from '@/lib/pipedrive-fields'
import { LB_COOKIE, LB_MAX_AGE, signSession, verifySession, type LinkBioSession } from '@/lib/link-bio-session'
import { bindVisitorToLead, UID_COOKIE } from '@/lib/identity-server'
import { clientInfoFromRequest, isInternalEmail, sendMetaEvent } from '@/lib/meta-capi'
import { applyJourneyToDeal, getLeadJourney } from '@/lib/lead-journey'

export const runtime = 'nodejs'

const STEPS = ['email', 'whatsapp', 'empresa', 'cargo', 'faturamento'] as const
type Step = (typeof STEPS)[number]

// Funil Site/Whats, etapa "Entrada de Lead" — é exatamente o que findStageId()
// resolve SEM hint (pipeline /site|whats/ + etapa /entrada/). Passar o nome do
// funil como hint cairia na primeira etapa por ordem ("Reabertura"), que não é
// onde um lead novo deve entrar.
const PIPELINE_LABEL = 'Site/Whats'

/** Objetivo do negócio: remontado a cada etapa, com o progresso explícito. */
function buildObjetivo(data: Record<string, string>, complete: boolean): string {
  const filled = STEPS.filter((s) => data[s])
  return [
    `Aplicação via link da bio — ${complete ? 'concluída' : `em andamento (${filled.length}/${STEPS.length})`}`,
    data.faturamento ? `Faturamento anual: ${data.faturamento}` : null,
    data.cargo ? `Cargo: ${data.cargo}` : null,
    data.empresa ? `Empresa: ${data.empresa}` : null,
    !complete ? 'Lead parcial: preencheu as etapas acima e ainda não finalizou.' : null,
  ]
    .filter(Boolean)
    .join('\n')
}

export async function POST(req: NextRequest) {
  if (!process.env.PIPEDRIVE_API_TOKEN) {
    console.error('[LinkBio] PIPEDRIVE_API_TOKEN não configurado')
    return NextResponse.json({ error: 'Pipedrive não configurado' }, { status: 500 })
  }

  try {
    const body = await req.json()
    const step = body.step as Step
    const data = (body.data ?? {}) as Record<string, string>
    const attribution = body.attribution
    const complete = body.complete === true
    const pageUrl = typeof body.page_url === 'string' ? body.page_url : undefined

    if (!STEPS.includes(step)) {
      return NextResponse.json({ error: 'Etapa inválida' }, { status: 400 })
    }

    const attr = (typeof attribution === 'object' && attribution !== null ? attribution : {}) as Record<string, string | undefined>
    let session = verifySession(req.cookies.get(LB_COOKIE)?.value)
    const res = NextResponse.json({ ok: true, complete })
    let justCreated = false

    // ── Criação: primeira etapa, ou recuperação se a sessão se perdeu ───────
    // (falha de rede na etapa 1, cookie bloqueado, aba reaberta). O cliente
    // reenvia tudo o que já preencheu, então nenhum dado se perde.
    if (!session) {
      const email = (data.email ?? '').trim()
      if (!email.includes('@')) {
        return NextResponse.json({ error: 'Sessão ausente' }, { status: 400 })
      }

      const eventId = typeof body.event_id === 'string' && body.event_id.length >= 8 ? body.event_id : randomUUID()
      const [stageId, ownerId] = await Promise.all([findStageId(), findUserId('Felipe')])
      // Sem nome nesta jornada: o e-mail identifica a pessoa até o CRM enriquecer
      const personId = await findOrCreatePerson(email, email, data.whatsapp?.trim() ?? '')

      const dealRes = await fetch(pipedriveUrl('/deals'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.empresa?.trim() || email,
          person_id: personId,
          user_id: ownerId,
          stage_id: stageId,
          status: 'open',
          [DEAL_FIELD_OBJETIVO]: buildObjetivo(data, complete),
          ...attributionDealProps(attribution, {
            event_id: eventId,
            origem_formulario: 'link-bio',
            ...(isInternalEmail(email) ? { internal: true } : {}),
          }),
        }),
      })
      const dealData = await dealRes.json()
      if (!dealData.success) {
        console.error('[LinkBio] Falha ao criar deal:', dealData?.error ?? dealData)
        return NextResponse.json({ error: 'Erro ao criar deal' }, { status: 500 })
      }

      session = { personId, dealId: dealData.data.id, eventId, email, done: [step] }
      justCreated = true

      // Identidade + jornada de conteúdo (mesma trilha dos outros formulários)
      const client = clientInfoFromRequest(req)
      const uid =
        (await bindVisitorToLead(req, res, {
          personId,
          email,
          match: { fbp: attr.fbp, fbc: attr.fbc, ...client },
        })) ?? req.cookies.get(UID_COOKIE)?.value
      const dealId = dealData.data.id as number
      const journey = await getLeadJourney(uid, attr.landing_page, 'outro')
      after(() => applyJourneyToDeal(dealId, journey, 'Aplicação via link da bio'))

      console.log('[LinkBio] Deal criado:', dealId, '| etapa', step)
    }

    // ── Atualização incremental do mesmo negócio ────────────────────────────
    const merged: Record<string, string> = { ...data, email: session.email }
    const done = Array.from(new Set([...(session.done ?? []), step]))

    // Empresa: cria/vincula Organization à pessoa e ao negócio
    let orgId = session.orgId
    if (merged.empresa?.trim() && !orgId) {
      orgId = await findOrCreateOrg(merged.empresa.trim())
      if (orgId && session.personId) {
        await fetch(pipedriveUrl(`/persons/${session.personId}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ org_id: orgId }),
        })
      }
    }

    // WhatsApp na pessoa
    if (step === 'whatsapp' && merged.whatsapp?.trim() && session.personId && !justCreated) {
      await fetch(pipedriveUrl(`/persons/${session.personId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: [{ value: merged.whatsapp.trim(), primary: true }] }),
      })
    }

    // Negócio: título vira a empresa, campos e objetivo acompanham o progresso
    if (session.dealId && !justCreated) {
      const dealPatch: Record<string, unknown> = {
        [DEAL_FIELD_OBJETIVO]: buildObjetivo(merged, complete),
      }
      if (orgId) dealPatch.org_id = orgId
      if (merged.empresa?.trim()) dealPatch.title = merged.empresa.trim()
      if (merged.cargo?.trim()) dealPatch[DEAL_FIELD_CARGO] = merged.cargo.trim().slice(0, 255)

      await fetch(pipedriveUrl(`/deals/${session.dealId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealPatch),
      })
    }

    const updated: LinkBioSession = { ...session, orgId, done }
    res.cookies.set(LB_COOKIE, signSession(updated), {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: LB_MAX_AGE,
    })

    // ── Conclusão: conversão Lead na Meta (mesmo event_id do Pixel) ─────────
    if (complete && !isInternalEmail(session.email)) {
      const client = clientInfoFromRequest(req)
      const uid = req.cookies.get(UID_COOKIE)?.value
      await sendMetaEvent({
        eventName: 'Lead',
        eventId: session.eventId,
        actionSource: 'website',
        eventSourceUrl: pageUrl ?? `${req.headers.get('origin') ?? req.nextUrl.origin}/link-bio`,
        userData: {
          email: session.email,
          phone: merged.whatsapp ?? null,
          externalId: uid ?? null,
          fbp: attr.fbp ?? req.cookies.get('_fbp')?.value ?? null,
          fbc: attr.fbc ?? req.cookies.get('_fbc')?.value ?? null,
          ...client,
        },
        customData: {
          content_name: 'link-bio',
          content_category: 'aplicacao',
          lead_type: 'link-bio',
          lead_source: attr.source,
          lead_medium: attr.medium,
          lead_campaign: attr.campaign,
          deal_id: session.dealId,
          pipeline: PIPELINE_LABEL,
          annual_revenue: merged.faturamento,
        },
      })
    }

    console.log(`[LinkBio] Deal ${session.dealId} | etapa ${done.length}/5 (${step})${complete ? ' — concluída' : ''}`)
    return res
  } catch (err) {
    console.error('[LinkBio] Erro interno:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
