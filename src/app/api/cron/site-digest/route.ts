import { NextRequest, NextResponse } from 'next/server'
import { sbSelect, upsertVisitor, type SiteVisitor } from '@/lib/supabase-server'
import {
  buildDigestNote,
  createPersonNote,
  findLatestOpenDealId,
  type DigestEvent,
} from '@/lib/pipedrive-activity'

export const runtime = 'nodejs'
export const maxDuration = 60

// Resumo diário de navegação -> Note na pessoa (e no negócio aberto mais
// recente) para cada visitante vinculado com page_views nas últimas 24h.
// Agendado no vercel.json: 0 12 * * * UTC (09:00 BRT). Auth: Bearer CRON_SECRET.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  if (!process.env.PIPEDRIVE_API_TOKEN) {
    console.error('[Digest] PIPEDRIVE_API_TOKEN não configurado')
    return NextResponse.json({ processed: 0, skipped: 0, reason: 'pipedrive_env_missing' })
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const digestCutoff = new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()

  const visitors = await sbSelect<SiteVisitor>(
    `/site_visitors?select=uid,pipedrive_person_id,last_digest_at&pipedrive_person_id=not.is.null&opted_out=eq.false&limit=500`
  )

  let processed = 0
  let skipped = 0

  for (const visitor of visitors) {
    try {
      // Não repetir: já resumido nas últimas 20h
      if (visitor.last_digest_at && visitor.last_digest_at > digestCutoff) {
        skipped++
        continue
      }

      const events = await sbSelect<DigestEvent>(
        `/site_events?select=occurred_at,type,path,title,source,medium&uid=eq.${visitor.uid}&occurred_at=gt.${encodeURIComponent(since)}&order=occurred_at.asc&limit=1000`
      )
      const note = buildDigestNote(events, new Date())
      if (!note) {
        skipped++
        continue
      }

      const dealId = await findLatestOpenDealId(visitor.pipedrive_person_id!)
      // Note vinculada à pessoa e (quando houver) ao negócio — aparece nos dois
      await createPersonNote(visitor.pipedrive_person_id!, note, dealId)
      await upsertVisitor(visitor.uid, { last_digest_at: new Date().toISOString() })
      processed++
    } catch (err) {
      console.error('[Digest] Falha no visitante', visitor.uid, err)
      skipped++
    }
  }

  console.log(`[Digest] Concluído: ${processed} resumos, ${skipped} pulados`)
  return NextResponse.json({ processed, skipped })
}
