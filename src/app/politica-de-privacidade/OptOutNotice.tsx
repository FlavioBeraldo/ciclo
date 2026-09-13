'use client'

import { useEffect, useState } from 'react'

// Confirmação exibida quando o visitante volta de GET /api/track/optout (?optout=1)
export default function OptOutNotice() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(new URLSearchParams(window.location.search).get('optout') === '1')
  }, [])

  if (!show) return null
  return (
    <div className="mb-8 rounded-xl border border-green-500/30 bg-green-900/20 px-5 py-4 text-sm text-green-300">
      Registro de navegação desativado: os cookies ciclo_uid e ciclo_attr foram removidos
      deste navegador e novos eventos não serão registrados.
    </div>
  )
}
