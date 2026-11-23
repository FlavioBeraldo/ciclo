import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { consentPreview } from '@/lib/consent-preview'
import { choiceLifetime, policyVersion } from '@/lib/privacy-choice'

export async function POST(req: NextRequest) {
  if (!consentPreview) return new Response(null, { status: 404 })
  if (req.headers.get('origin') !== req.nextUrl.origin ||
    !req.headers.get('content-type')?.startsWith('application/json')) return new Response(null, { status: 403 })
  const body = await req.json().catch(() => null)
  if (body?.version !== policyVersion || typeof body.analytics !== 'boolean' || typeof body.marketing !== 'boolean') {
    return new Response(null, { status: 400 })
  }
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (url !== 'https://zlbpaawgzycaopobfxva.supabase.co' || !key) return new Response(null, { status: 503 })
  const oldRef = req.cookies.get('ciclo_privacidade_recibo')?.value
  const browserRef = oldRef && /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(oldRef) ? oldRef : randomUUID()
  try {
    const saved = await fetch(url + '/rest/v1/privacy_consent_events', {
      method: 'POST', signal: AbortSignal.timeout(5000),
      headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ browser_ref: browserRef, policy_version: policyVersion,
        analytics: body.analytics, marketing: body.marketing }),
    })
    if (!saved.ok) return new Response(null, { status: 503 })
  } catch { return new Response(null, { status: 503 }) }
  const res = new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })
  res.cookies.set('ciclo_privacidade_recibo', browserRef, {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: choiceLifetime,
  })
  return res
}
