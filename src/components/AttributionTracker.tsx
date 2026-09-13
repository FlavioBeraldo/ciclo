'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { collectAttribution, markLinkedInTraffic } from '@/lib/attribution'
import { ensureIdentity, track } from '@/lib/track'

// Em cada página (inclusive navegação client-side): registra o primeiro toque
// de atribuição, o flag de tráfego LinkedIn, garante o ciclo_uid anônimo e
// envia o page_view para /api/track.
export default function AttributionTracker() {
  const pathname = usePathname()

  useEffect(() => {
    collectAttribution()
    markLinkedInTraffic()
    ensureIdentity()
    track('page_view')
  }, [pathname])

  return null
}
