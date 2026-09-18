'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// Barra fixa de aplicação no mobile. Entra em cena quando o fim do hero sai da
// tela e some de novo quando a pessoa volta ao topo. Só existe abaixo de
// 1024px (o CSS cuida disso), então no desktop não ocupa espaço nem foco.
export default function ShiftMobileCta() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const marco = document.getElementById('fim-do-hero')
    if (!marco) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisivel(entry.boundingClientRect.top < 0),
      { threshold: 0 }
    )
    observer.observe(marco)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`shift-mobile-cta${visivel ? ' is-visible' : ''}`} aria-hidden={!visivel}>
      <Link href="/aplicacao" className="shift-cta" tabIndex={visivel ? undefined : -1}>
        Aplicar
        <span className="shift-mobile-cta-nota">2 min</span>
      </Link>
    </div>
  )
}
