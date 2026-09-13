import { NextRequest, NextResponse } from 'next/server'
import {
  LI_COOKIE,
  LI_COOKIE_MAX_AGE,
  LI_STATE_COOKIE,
  linkedinRedirectUri,
  signProfile,
  type LinkedInProfile,
} from '@/lib/linkedin-session'
import { createPipedriveLead, attributionFromRequestCookies } from '@/lib/pipedrive-server'

export const runtime = 'nodejs'

const RETURN_PATH = '/playbook-social-commerce'
const LI_DONE_COOKIE = 'ciclo_li_done'
const LI_DONE_MAX_AGE = 24 * 60 * 60 // 24h — janela de idempotência por sub

function backTo(req: NextRequest, result: 'done' | 'erro'): NextResponse {
  const res = NextResponse.redirect(new URL(`${RETURN_PATH}?li=${result}`, req.nextUrl.origin))
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
          })
          created = result.success
          if (!created) console.error('[LinkedIn] Falha ao criar lead — download segue mesmo assim')
        } catch (err) {
          console.error('[LinkedIn] Erro ao criar lead — download segue mesmo assim:', err)
        }
      }
    }

    const res = backTo(req, 'done')
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
