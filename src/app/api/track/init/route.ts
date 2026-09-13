import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { UID_COOKIE, setUidCookie } from '@/lib/identity-server'
import { upsertVisitor } from '@/lib/supabase-server'

export const runtime = 'nodejs'

// Gera o ciclo_uid anônimo server-side no primeiro acesso (idempotente).
export async function GET(req: NextRequest) {
  const existing = req.cookies.get(UID_COOKIE)?.value
  if (existing) return new NextResponse(null, { status: 204 })

  const uid = randomUUID()
  const res = new NextResponse(null, { status: 204 })
  setUidCookie(res, uid)
  await upsertVisitor(uid)
  return res
}
