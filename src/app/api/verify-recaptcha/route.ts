import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { token } = await req.json()
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) {
    // No key configured — allow through (dev/staging)
    return NextResponse.json({ success: true })
  }
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secret}&response=${token}`,
  })
  const data = await res.json()
  if (!data.success || data.score < 0.5) {
    return NextResponse.json({ success: false, error: 'reCAPTCHA falhou' }, { status: 400 })
  }
  return NextResponse.json({ success: true })
}
