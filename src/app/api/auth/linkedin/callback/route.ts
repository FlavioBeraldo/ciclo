import { NextRequest, NextResponse } from 'next/server'
import {
  LI_COOKIE,
  LI_COOKIE_MAX_AGE,
  LI_STATE_COOKIE,
  linkedinRedirectUri,
  signProfile,
} from '@/lib/linkedin-session'

export const runtime = 'nodejs'

const RETURN_PATH = '/playbook-social-commerce'

function backTo(req: NextRequest, result: 'ok' | 'erro'): NextResponse {
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
    const res = backTo(req, 'ok')
    res.cookies.set(
      LI_COOKIE,
      signProfile({ name, email: user.email ?? '', picture: user.picture, sub: user.sub }),
      { httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: LI_COOKIE_MAX_AGE }
    )
    return res
  } catch (err) {
    console.error('[LinkedIn] Erro no callback:', err)
    return backTo(req, 'erro')
  }
}
