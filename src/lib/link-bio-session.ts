// Sessão do formulário progressivo /link-bio.
//
// O salvamento acontece etapa a etapa: a primeira (e-mail) cria Person + Deal no
// Pipedrive e devolve um cookie httpOnly ASSINADO com os ids; as etapas seguintes
// apenas atualizam esse mesmo negócio. Os ids nunca trafegam pelo cliente em
// texto claro, então ninguém consegue escrever em um deal arbitrário.
import { createHmac, timingSafeEqual } from 'node:crypto'

export const LB_COOKIE = 'ciclo_lb'
export const LB_MAX_AGE = 2 * 60 * 60 // 2h — tempo de sobra para concluir a aplicação

export interface LinkBioSession {
  personId?: number
  dealId?: number
  orgId?: number
  eventId: string
  email: string
  /** Etapas já gravadas, para não repetir escrita à toa */
  done: string[]
}

/** Chave de assinatura: segredos que já existem no servidor para este fluxo. */
function secret(): string {
  const s = process.env.PIPEDRIVE_WEBHOOK_SECRET || process.env.PIPEDRIVE_API_TOKEN
  if (!s) throw new Error('Sem segredo para assinar a sessão do link-bio')
  return s
}

function hmac(data: string): string {
  return createHmac('sha256', secret()).update(data).digest('base64url')
}

export function signSession(session: LinkBioSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url')
  return `${payload}.${hmac(payload)}`
}

export function verifySession(value: string | undefined): LinkBioSession | null {
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
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as LinkBioSession
  } catch {
    return null
  }
}
