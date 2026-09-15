import { NextRequest, NextResponse } from 'next/server'
import {
  LI_COOKIE,
  LI_COOKIE_MAX_AGE,
  LI_STATE_COOKIE,
  linkedinRedirectUri,
  signProfile,
  type LinkedInProfile,
} from '@/lib/linkedin-session'
import { randomUUID } from 'node:crypto'
import { createPipedriveLead, attributionFromRequestCookies } from '@/lib/pipedrive-server'
import { bindVisitorToLead, UID_COOKIE } from '@/lib/identity-server'
import { clientInfoFromRequest, isInternalEmail, sendMetaEvent } from '@/lib/meta-capi'

export const runtime = 'nodejs'

const RETURN_PATH = '/playbook-social-commerce'
const LI_DONE_COOKIE = 'ciclo_li_done'
const LI_DONE_MAX_AGE = 24 * 60 * 60 // 24h — janela de idempotência por sub

function backTo(req: NextRequest, result: 'done' | 'erro', eventId?: string): NextResponse {
  const qs = new URLSearchParams({ li: result })
  if (eventId) qs.set('eid', eventId) // mesmo event_id p/ o Pixel deduplicar com a CAPI
  const res = NextResponse.redirect(new URL(`${RETURN_PATH}?${qs}`, req.nextUrl.origin))
  // state é de uso único
  res.cookies.set(LI_STATE_COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 })
  return res
}

// Callback do OAuth: valida o state, troca o code por access token, busca o
// userinfo, grava o perfil em cookie httpOnly assinado e DESCARTA o token.
export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams
    const code = params.get('code')
    const state = params.get('state')
    const storedState = req.cookies.get(LI_STATE_COOKIE)?.value

    if (params.get('error') || !code || !state || !storedState || state !== storedState) {
      console.error('[LinkedIn] Callback inválido:', params.get('error') ?? 'state/code ausente ou divergente')
      return backTo(req, 'erro')
    }

    const clientId = process.env.LINKEDIN_CLIENT_ID
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET
    if (!clientId || !clientSecret) {
      console.error('[LinkedIn] LINKEDIN_CLIENT_ID/SECRET não configurados')
      return backTo(req, 'erro')
    }

    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: linkedinRedirectUri(),
      }),
    })
    const tokenData = await tokenRes.json()
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('[LinkedIn] Falha na troca do code:', tokenData?.error_description ?? tokenRes.status)
      return backTo(req, 'erro')
    }

    const userRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const user = await userRes.json()
    if (!userRes.ok || !user?.sub) {
      console.error('[LinkedIn] Falha no userinfo:', userRes.status)
      return backTo(req, 'erro')
    }

    const name =
      user.name ?? [user.given_name, user.family_name].filter(Boolean).join(' ')
    const profile: LinkedInProfile = { name, email: user.email ?? '', picture: user.picture, sub: user.sub }

    // Cadastro automático: cria o lead direto no servidor (sem formulário).
    // Idempotência: mesmo sub não gera novo deal dentro de 24h.
    let created = false
    let personId: number | undefined
    let dealId: number | undefined
    const eventId = randomUUID()
    const alreadyDone = req.cookies.get(LI_DONE_COOKIE)?.value === profile.sub
    if (!alreadyDone) {
      if (!process.env.PIPEDRIVE_API_TOKEN) {
        console.error('[LinkedIn] PIPEDRIVE_API_TOKEN ausente — lead não criado, download segue')
      } else if (!profile.name || !profile.email) {
        console.error('[LinkedIn] userinfo sem name/email — lead não criado, download segue')
      } else {
        try {
          const result = await createPipedriveLead({
            name: profile.name,
            email: profile.email,
            // Sem telefone e sem Organization neste fluxo
            objetivo: 'Baixou o Playbook de Social Commerce pela landing page.',
            pipelineHint: 'Playbook',
            attribution: attributionFromRequestCookies(req.cookies),
            linkedin: profile,
            extraMerge: { event_id: eventId, ...(isInternalEmail(profile.email) ? { internal: true } : {}) },
          })
          created = result.success
          personId = result.personId
          dealId = result.dealId
          if (!created) console.error('[LinkedIn] Falha ao criar lead — download segue mesmo assim')
        } catch (err) {
          console.error('[LinkedIn] Erro ao criar lead — download segue mesmo assim:', err)
        }
      }
    }

    const res = backTo(req, 'done', created ? eventId : undefined)
    if (created) {
      // Identidade: cookie ciclo_uid + vínculo pessoa<->navegação
      const client = clientInfoFromRequest(req)
      const uid =
        (await bindVisitorToLead(req, res, { personId, email: profile.email, match: client })) ??
        req.cookies.get(UID_COOKIE)?.value
      const attr = attributionFromRequestCookies(req.cookies)
      // API de Conversões (Meta) com o mesmo event_id que o Pixel usará na volta
      if (!isInternalEmail(profile.email)) {
        const [firstName, ...rest] = profile.name.trim().split(/\s+/)
        await sendMetaEvent({
          eventName: 'Lead',
          eventId,
          actionSource: 'website',
          eventSourceUrl: `${req.nextUrl.origin}${RETURN_PATH}`,
          userData: {
            email: profile.email,
            firstName,
            lastName: rest.join(' ') || null,
            externalId: uid ?? null,
            fbp: req.cookies.get('_fbp')?.value ?? null,
            fbc: req.cookies.get('_fbc')?.value ?? null,
            ...client,
          },
          customData: {
            content_name: 'playbook-social-commerce',
            content_category: 'material',
            lead_type: 'playbook',
            method: 'linkedin',
            lead_source: attr.source,
            lead_medium: attr.medium,
            lead_campaign: attr.campaign,
            deal_id: dealId,
            pipeline: 'Playbook',
          },
          context: { dealId, personId, uid },
        })
      }
    }
    res.cookies.set(LI_COOKIE, signProfile(profile), {
      httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: LI_COOKIE_MAX_AGE,
    })
    if (created) {
      res.cookies.set(LI_DONE_COOKIE, profile.sub, {
        httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: LI_DONE_MAX_AGE,
      })
    }
    return res
  } catch (err) {
    console.error('[LinkedIn] Erro no callback:', err)
    return backTo(req, 'erro')
  }
}
