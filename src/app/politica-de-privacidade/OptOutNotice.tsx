'use client'

import { useEffect, useState } from 'react'

const GA4_UID_KEY = 'ciclo_ga4_uid'

// O GTM espelha o hash do User-ID em localStorage e no cookie ciclo_ga4_uid.
// O servidor já apagou os cookies no redirect; aqui limpamos o que só o
// navegador alcança (localStorage) e reforçamos a remoção do cookie no cliente.
function clearGa4Identity() {
  try {
    localStorage.removeItem(GA4_UID_KEY)
  } catch {
    // localStorage indisponível (modo privado, bloqueio) — nada a limpar.
  }
  const expired = `${GA4_UID_KEY}=; path=/; max-age=0`
  document.cookie = `${expired}; domain=.cicloecommerce.com.br`
  document.cookie = expired
}

// Confirmação exibida quando o visitante volta de GET /api/track/optout (?optout=1)
export default function OptOutNotice() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const optedOut = new URLSearchParams(window.location.search).get('optout') === '1'
    if (optedOut) clearGa4Identity()
    setShow(optedOut)
  }, [])

  if (!show) return null
  return (
    <div className="mb-8 rounded-xl border border-green-500/30 bg-green-900/20 px-5 py-4 text-sm text-green-300">
      Registro de navegação desativado: os cookies ciclo_uid, ciclo_attr e ciclo_ga4_uid foram
      removidos deste navegador e novos eventos não serão registrados.
    </div>
  )
}
