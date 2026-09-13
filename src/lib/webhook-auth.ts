// Autenticação compartilhada dos webhooks do Pipedrive (won e enriquecimento):
// Basic (user "pipedrive", senha PIPEDRIVE_WEBHOOK_SECRET) OU query ?secret=.
import type { NextRequest } from 'next/server'

export function isWebhookAuthorized(req: NextRequest): boolean {
  const secret = process.env.PIPEDRIVE_WEBHOOK_SECRET
  if (!secret) {
    console.error('[Webhook] PIPEDRIVE_WEBHOOK_SECRET não configurado')
    return false
  }
  if (req.nextUrl.searchParams.get('secret') === secret) return true
  const auth = req.headers.get('authorization') ?? ''
  if (auth.startsWith('Basic ')) {
    try {
      const [user, pass] = Buffer.from(auth.slice(6), 'base64').toString('utf8').split(':')
      return user === 'pipedrive' && pass === secret
    } catch {
      return false
    }
  }
  return false
}
