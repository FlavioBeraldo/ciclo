import { NextRequest, NextResponse } from 'next/server'
import { UID_COOKIE } from '@/lib/identity-server'
import { upsertVisitor } from '@/lib/supabase-server'

export const runtime = 'nodejs'

// Cookie gravado pelo GTM (v106) com o hash usado como User-ID no GA4.
// Fica em domain=.cicloecommerce.com.br; o espelho em localStorage é
// limpo no cliente por OptOutNotice quando a página de confirmação abre.
const GA4_UID_COOKIE = 'ciclo_ga4_uid'
const GA4_UID_DOMAIN = '.cicloecommerce.com.br'

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
  // ciclo_ga4_uid: apaga a variante com domínio (como o GTM grava) e a
  // host-only, para cobrir qualquer forma em que o cookie exista.
  res.cookies.set(GA4_UID_COOKIE, '', { path: '/', maxAge: 0, domain: GA4_UID_DOMAIN })
  res.cookies.set(GA4_UID_COOKIE, '', { path: '/', maxAge: 0 })
  return res
}
