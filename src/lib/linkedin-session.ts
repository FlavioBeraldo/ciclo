// Sessão leve do "Continuar com LinkedIn": o perfil (nome/e-mail/foto/sub) vive
// num cookie httpOnly assinado com HMAC-SHA256 (chave = LINKEDIN_CLIENT_SECRET).
// O access token do LinkedIn NUNCA é persistido — é descartado após o userinfo.
import { createHmac, timingSafeEqual } from 'node:crypto'

export const LI_COOKIE = 'ciclo_li'
export const LI_STATE_COOKIE = 'ciclo_li_state'
export const LI_COOKIE_MAX_AGE = 15 * 60 // 15 min
export const LI_STATE_MAX_AGE = 10 * 60 // 10 min

export interface LinkedInProfile {
  name: string
  email: string
  picture?: string
  sub: string
}

function secret(): string {
  const s = process.env.LINKEDIN_CLIENT_SECRET
  if (!s) throw new Error('LINKEDIN_CLIENT_SECRET não configurado')
  return s
}

function hmac(data: string): string {
  return createHmac('sha256', secret()).update(data).digest('base64url')
}

export function signProfile(profile: LinkedInProfile): string {
  const payload = Buffer.from(JSON.stringify(profile)).toString('base64url')
  return `${payload}.${hmac(payload)}`
}

export function verifyProfile(value: string | undefined): LinkedInProfile | null {
  if (!value) return null
  const dot = value.lastIndexOf('.')
  if (dot <= 0) return null
  const payload = value.slice(0, dot)
  const signature = value.slice(dot + 1)
  try {
    const expected = hmac(payload)
    const a = Buffer.from(signature)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as LinkedInProfile
  } catch {
    return null
  }
}

export function linkedinRedirectUri(): string {
  return process.env.LINKEDIN_REDIRECT_URI ?? 'https://cicloecommerce.com.br/api/auth/linkedin/callback'
}
