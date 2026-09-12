'use client'

import { useEffect } from 'react'
import { collectAttribution } from '@/lib/attribution'

// Registra o primeiro toque de atribuição (cookie ciclo_attr) no load de cada página.
export default function AttributionTracker() {
  useEffect(() => {
    collectAttribution()
  }, [])
  return null
}
