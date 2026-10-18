'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Seta } from './Seta'

// Cabeçalho do design 2026, conforme o kit de layouts.
// Sticky, fundo branco translúcido, borda que aparece ao rolar, menu móvel.
// Na home as âncoras são locais; nas demais páginas ganham a barra inicial.
//
// O menu móvel fecha no Escape, ao escolher um destino e ao clicar fora, e
// devolve o foco ao botão que o abriu. Enquanto está aberto, o Tab fica
// dentro dele — senão o foco some para trás de um painel que cobre a tela.

const LINKS = [
  { label: 'Soluções', href: '#solucoes' },
  { label: 'Nosso método', href: '#metodo' },
  { label: 'Cases', href: '#cases' },
  { label: 'O Fator M', href: '/ofatorm' },
  { label: 'Blog', href: '/blog' },
]

const FOCAVEIS = 'a[href], button:not([disabled])'

export default function CicloHeader() {
  const [aberto, setAberto] = useState(false)
  const [rolado, setRolado] = useState(false)
  const pathname = usePathname()
  const naHome = pathname === '/'

  const botaoMenu = useRef<HTMLButtonElement>(null)
  const painel = useRef<HTMLElement>(null)

  const fechar = useCallback(() => setAberto(false), [])

  useEffect(() => {
    const aoRolar = () => setRolado(window.scrollY > 8)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  useEffect(() => {
    if (!aberto) return

    // O foco entra no primeiro destino do menu
    painel.current?.querySelector<HTMLElement>(FOCAVEIS)?.focus()

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        fechar()
        return
      }
      if (e.key !== 'Tab') return

      // O botão de fechar entra no ciclo, e vem primeiro: no DOM ele está
      // ANTES do painel, então deixar o navegador andar sozinho jogaria o
      // foco para fora. O Tab aqui é sempre explícito.
      const alvos = [
        botaoMenu.current,
        ...Array.from(painel.current?.querySelectorAll<HTMLElement>(FOCAVEIS) ?? []),
      ].filter((el): el is HTMLElement => !!el)
      if (!alvos.length) return

      e.preventDefault()
      const i = alvos.indexOf(document.activeElement as HTMLElement)
      const passo = e.shiftKey ? -1 : 1
      const proximo = i === -1 ? 0 : (i + passo + alvos.length) % alvos.length
      alvos[proximo].focus()
    }

    // Clique fora do cabeçalho também fecha
    const aoClicar = (e: MouseEvent) => {
      const alvo = e.target as Node
      if (!painel.current?.contains(alvo) && !botaoMenu.current?.contains(alvo)) fechar()
    }

    document.addEventListener('keydown', aoTeclar)
    document.addEventListener('mousedown', aoClicar)
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.removeEventListener('mousedown', aoClicar)
      // Devolve o foco ao acionador ao sair
      botaoMenu.current?.focus()
    }
  }, [aberto, fechar])

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
            <b aria-hidden="true"><Seta /></b>
          </a>
          <button
            ref={botaoMenu}
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
        ref={painel}
        className={`mobile-nav${aberto ? ' open' : ''}`}
        id="mobile-nav"
        aria-label="Menu móvel"
      >
        {LINKS.map((l) => (
          <a key={l.label} href={resolver(l.href)} onClick={fechar}>
            {l.label}
          </a>
        ))}
        <a href="/ecomshift" onClick={fechar}>
          Aprenda nosso método
        </a>
      </nav>
    </header>
  )
}
