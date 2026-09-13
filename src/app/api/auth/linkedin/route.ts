import { NextResponse } from 'next/server'
import { randomBytes } from 'node:crypto'
import { LI_STATE_COOKIE, LI_STATE_MAX_AGE, linkedinRedirectUri } from '@/lib/linkedin-session'

export const runtime = 'nodejs'

// Inicia o Sign In with LinkedIn v2 (OpenID Connect): gera state anti-CSRF em
// cookie httpOnly e redireciona para a tela de autorização do LinkedIn.
export async function GET() {
  const clientId = process.env.LINKEDIN_CLIENT_ID
  if (!clientId) {
    return NextResponse.redirect('https://cicloecommerce.com.br/playbook-social-commerce?li=erro')
  }

  const state = randomBytes(16).toString('hex')
  const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization')
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', linkedinRedirectUri())
  authUrl.searchParams.set('scope', 'openid profile email')
  authUrl.searchParams.set('state', state)

  const res = NextResponse.redirect(authUrl)
  res.cookies.set(LI_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: LI_STATE_MAX_AGE,
  })
  return res
}
