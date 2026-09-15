// Identidade do visitante (cookie ciclo_uid) e vínculo navegação <-> pessoa.
// O vínculo com dados pessoais só acontece na criação do lead, ou seja, após o
// aceite da política de privacidade nos formulários (LGPD).
import { randomUUID } from 'node:crypto'
import type { NextRequest, NextResponse } from 'next/server'
import { upsertVisitor, saveVisitorMatchData } from './supabase-server'

export const UID_COOKIE = 'ciclo_uid'
export const UID_MAX_AGE = 365 * 24 * 60 * 60 // 365 dias

export function setUidCookie(res: NextResponse, uid: string): void {
  res.cookies.set(UID_COOKIE, uid, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: UID_MAX_AGE,
  })
}

/**
 * Na criação de um lead: reaproveita o ciclo_uid anônimo se existir (senão gera),
 * grava o cookie na resposta e vincula a pessoa ao visitante no Supabase.
 */
export async function bindVisitorToLead(
  req: NextRequest,
  res: NextResponse,
  data: { personId?: number; email?: string; match?: { fbp?: string; fbc?: string; clientIp?: string; clientUserAgent?: string } }
): Promise<string | undefined> {
  try {
    const uid = req.cookies.get(UID_COOKIE)?.value ?? randomUUID()
    setUidCookie(res, uid)

    // ga_client_id do cookie _ga ("GA1.1.AAAA.BBBB" -> "AAAA.BBBB")
    let gaClientId: string | undefined
    const ga = req.cookies.get('_ga')?.value
    if (ga) {
      const parts = ga.split('.')
      if (parts.length >= 4) gaClientId = parts.slice(-2).join('.')
    }

    await upsertVisitor(uid, {
      ...(data.personId ? { pipedrive_person_id: data.personId } : {}),
      ...(data.email ? { email: data.email } : {}),
      ...(gaClientId ? { ga_client_id: gaClientId } : {}),
    })
    // Dados de correspondência (Meta) para eventos offline vindos do Pipedrive
    if (data.match) {
      await saveVisitorMatchData(uid, {
        fbp: data.match.fbp ?? req.cookies.get('_fbp')?.value,
        fbc: data.match.fbc ?? req.cookies.get('_fbc')?.value,
        client_ip: data.match.clientIp,
        user_agent: data.match.clientUserAgent,
      })
    }
    return uid
  } catch (err) {
    console.error('[Identity] Falha ao vincular visitante ao lead:', err)
    return undefined
  }
}
