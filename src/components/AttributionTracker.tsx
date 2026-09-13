'use client'

import { useEffect } from 'react'
import { collectAttribution, markLinkedInTraffic } from '@/lib/attribution'

// Registra o primeiro toque de atribuição (cookie ciclo_attr) e o flag de
// tráfego LinkedIn no load de cada página.
export default function AttributionTracker() {
  useEffect(() => {
    collectAttribution()
    markLinkedInTraffic()
  }, [])
  return null
}
