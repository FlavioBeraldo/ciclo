import { NextRequest, NextResponse } from 'next/server'
import { UID_COOKIE } from '@/lib/identity-server'
import { upsertVisitor } from '@/lib/supabase-server'

export const runtime = 'nodejs'

// Opt-out LGPD: marca opted_out no visitante, apaga os cookies de identificação
// e atribuição, e volta para a política de privacidade com a confirmação.
export async function GET(req: NextRequest) {
  const uid = req.cookies.get(UID_COOKIE)?.value
  if (uid) {
    await upsertVisitor(uid, { opted_out: true })
  }

  const res = NextResponse.redirect(new URL('/politica-de-privacidade?optout=1', req.nextUrl.origin))
  for (const name of [UID_COOKIE, 'ciclo_attr']) {
    res.cookies.set(name, '', { path: '/', maxAge: 0 })
  }
  return res
}
