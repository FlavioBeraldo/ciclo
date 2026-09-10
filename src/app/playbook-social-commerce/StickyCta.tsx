'use client'

import { useEffect, useState } from 'react'

// Botão fixo no rodapé (só mobile) que acompanha o scroll e some
// quando o formulário está visível na tela.
export default function StickyCta() {
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    const form = document.getElementById('baixar')
    if (!form) return
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.2 }
    )
    observer.observe(form)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`lg:hidden fixed bottom-0 inset-x-0 z-50 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-[#EDE7DB]/95 backdrop-blur-sm border-t border-[#1A1917]/15 transition-transform duration-300 ${
        hidden ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      <a
        href="#baixar"
        className="block w-full bg-[#1A1917] text-[#EDE7DB] text-center rounded-xl px-6 py-4 text-sm font-semibold tracking-wide active:bg-[#2B6B9B] transition-colors"
      >
        Baixar o playbook gratuito ↓
      </a>
    </div>
  )
}
