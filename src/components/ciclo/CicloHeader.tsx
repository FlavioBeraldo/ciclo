'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Cabeçalho do design 2026, conforme o kit de layouts.
// Sticky, fundo branco translúcido, borda que aparece ao rolar, menu móvel.
// Na home as âncoras são locais; nas demais páginas ganham a barra inicial.

const LINKS = [
  { label: 'Soluções', href: '#solucoes' },
  { label: 'Nosso método', href: '#metodo' },
  { label: 'Cases', href: '#cases' },
  { label: 'O Fator M', href: '/ofatorm' },
  { label: 'Blog', href: '/blog' },
]

export default function CicloHeader() {
  const [aberto, setAberto] = useState(false)
  const [rolado, setRolado] = useState(false)
  const pathname = usePathname()
  const naHome = pathname === '/'

  useEffect(() => {
    const aoRolar = () => setRolado(window.scrollY > 8)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  // Fora da home, a âncora precisa voltar para a home antes de rolar
  const resolver = (href: string) =>
    href.startsWith('#') && !naHome ? `/${href}` : href

  return (
    <header className={`header${rolado ? ' scrolled' : ''}`}>
      <div className="nav">
        <Link className="brand" href="/" aria-label="Ciclo E-commerce — página inicial">
          <Image
            src="/logo-ciclo-black.png"
            alt="Ciclo E-commerce"
            width={240}
            height={92}
            priority
          />
        </Link>

        <nav className="nav-links" aria-label="Principal">
          {LINKS.map((l) => (
            <a key={l.label} href={resolver(l.href)}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <a className="button" href={resolver('#contato')}>
            <span>Fale com especialista</span>
            <b aria-hidden="true">↗</b>
          </a>
          <button
            className="menu-btn"
            aria-expanded={aberto}
            aria-controls="mobile-nav"
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? 'Fechar' : 'Menu'}
          </button>
        </div>
      </div>

      <nav
        className={`mobile-nav${aberto ? ' open' : ''}`}
        id="mobile-nav"
        aria-label="Menu móvel"
      >
        {LINKS.map((l) => (
          <a key={l.label} href={resolver(l.href)} onClick={() => setAberto(false)}>
            {l.label}
          </a>
        ))}
        <a href="/ecomshift" onClick={() => setAberto(false)}>
          Aprenda nosso método
        </a>
      </nav>
    </header>
  )
}
