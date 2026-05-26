'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Button from './ui/Button'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Cases', href: '#cases' },
  { label: 'Podcast', href: '#podcast' },
  { label: 'Blog', href: '/blog' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const sentinel = document.getElementById('scroll-sentinel')
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  // On non-home pages, prefix hash links with / so they navigate home first
  const resolvedLinks = navLinks.map((link) => ({
    ...link,
    href: link.href.startsWith('#') && !isHome ? `/${link.href}` : link.href,
  }))

  const ctaHref = isHome ? '#contato' : '/#contato'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled || open
          ? 'bg-[#050505]/98 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" aria-label="Ciclo E-commerce - Página inicial">
            <Image src="/logo-ciclo.png" alt="Ciclo E-commerce" width={160} height={60} priority className="h-[60px] w-auto" />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Navegação principal">
            {resolvedLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-[#A1A1AA] hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA group */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="/ecomshift"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border border-[#A100FF]/60 text-[#A100FF] bg-[#A100FF]/10 hover:bg-[#A100FF]/20 hover:border-[#A100FF] transition-all duration-200 whitespace-nowrap"
            >
              Aprenda nosso método
            </a>
            <Button href={ctaHref} arrow size="md">
              Fale com especialista
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white p-2"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden py-4 border-t border-white/10 bg-[#050505]">
            <nav className="flex flex-col gap-4" aria-label="Navegação mobile">
              {resolvedLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-[#A1A1AA] hover:text-white transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/ecomshift"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold border border-[#A100FF]/60 text-[#A100FF] bg-[#A100FF]/10 hover:bg-[#A100FF]/20 transition-all duration-200 mt-2"
              >
                Aprenda nosso método
              </a>
              <Button href={ctaHref} arrow className="w-full justify-center mt-2">
                Fale com especialista
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
