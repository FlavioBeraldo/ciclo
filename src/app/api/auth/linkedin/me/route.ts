import { NextRequest, NextResponse } from 'next/server'
import { LI_COOKIE, verifyProfile } from '@/lib/linkedin-session'

export const runtime = 'nodejs'

// Devolve o perfil do cookie assinado ciclo_li (ou 204 se ausente/inválido).
export async function GET(req: NextRequest) {
  try {
    const profile = verifyProfile(req.cookies.get(LI_COOKIE)?.value)
    if (!profile) return new NextResponse(null, { status: 204 })
    return NextResponse.json(profile)
  } catch {
    return new NextResponse(null, { status: 204 })
  }
}
