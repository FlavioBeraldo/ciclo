// Cookie de deduplicação da Aplicação (/aplicacao).
//
// Mesmo desenho do cookie do /link-bio: o id do negócio criado no Pipedrive é
// guardado em um cookie httpOnly ASSINADO, nunca em texto claro no cliente. Se a
// mesma pessoa enviar a aplicação de novo (clique duplo, refresh, volta no
// navegador), o servidor ATUALIZA o negócio que já existe em vez de criar outro.
import { createHmac, timingSafeEqual } from 'node:crypto'

export const APL_COOKIE = 'ciclo_apl'
export const APL_MAX_AGE = 6 * 60 * 60 // 6h

export interface AplicacaoSession {
  dealId: number
  personId?: number
  eventId: string
  email: string
}

/** Chave de assinatura: segredos que já existem no servidor para este fluxo. */
function secret(): string {
  const s = process.env.PIPEDRIVE_WEBHOOK_SECRET || process.env.PIPEDRIVE_API_TOKEN
  if (!s) throw new Error('Sem segredo para assinar a sessão da aplicação')
  return s
}

function hmac(data: string): string {
  return createHmac('sha256', secret()).update(data).digest('base64url')
}

export function signSession(session: AplicacaoSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url')
  return `${payload}.${hmac(payload)}`
}

export function verifySession(value: string | undefined): AplicacaoSession | null {
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
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AplicacaoSession
  } catch {
    return null
  }
}
