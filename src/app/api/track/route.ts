import { NextRequest, NextResponse } from 'next/server'
import { UID_COOKIE } from '@/lib/identity-server'
import { getVisitor, insertEvent, upsertVisitor } from '@/lib/supabase-server'

export const runtime = 'nodejs'

const ALLOWED_TYPES = new Set([
  'page_view',
  'form_submit',
  'material_download',
  'popup_view',
  'popup_click',
  'video_play',
  'whatsapp_click',
  'cta_click',
  'scroll_75',
])

// Rate limit 60/min por uid (best-effort, por instância serverless)
const RATE_LIMIT = 60
const WINDOW_MS = 60_000
const buckets = new Map<string, { count: number; resetAt: number }>()

function rateLimited(uid: string): boolean {
  const now = Date.now()
  const bucket = buckets.get(uid)
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(uid, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  bucket.count += 1
  return bucket.count > RATE_LIMIT
}

const clip = (v: unknown, max: number): string | undefined =>
  typeof v === 'string' && v.trim() !== '' ? v.slice(0, max) : undefined

export async function POST(req: NextRequest) {
  try {
    const uid = req.cookies.get(UID_COOKIE)?.value
    if (!uid) return new NextResponse(null, { status: 204 })
    if (rateLimited(uid)) return new NextResponse(null, { status: 429 })

    // sendBeacon envia Blob — parse tolerante
    const body = await req.json().catch(async () => {
      try {
        return JSON.parse(await req.text())
      } catch {
        return null
      }
    })
    if (!body || !ALLOWED_TYPES.has(body.type)) {
      return new NextResponse(null, { status: 204 })
    }

    // opted_out: não registra nada
    let visitor = await getVisitor(uid)
    if (!visitor) {
      await upsertVisitor(uid)
      visitor = await getVisitor(uid)
    }
    if (visitor?.opted_out) return new NextResponse(null, { status: 204 })

    // source/medium/campaign do cookie de atribuição
    let attr: Record<string, string> = {}
    const rawAttr = req.cookies.get('ciclo_attr')?.value
    if (rawAttr) {
      try {
        attr = JSON.parse(decodeURIComponent(rawAttr))
      } catch {
        try {
          attr = JSON.parse(rawAttr)
        } catch {
          // cookie ilegível — segue sem atribuição
        }
      }
    }

    await insertEvent({
      uid,
      type: body.type,
      path: clip(body.path, 500),
      title: clip(body.title, 300),
      referrer: clip(body.referrer, 500),
      source: clip(attr.source, 255),
      medium: clip(attr.medium, 255),
      campaign: clip(attr.campaign, 255),
      meta: body.meta && typeof body.meta === 'object' ? body.meta : undefined,
    })

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[Track] Erro:', err)
    return new NextResponse(null, { status: 204 })
  }
}
