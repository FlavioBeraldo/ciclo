'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Button from './ui/Button'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Atuação', href: '#servicos' },
  { label: 'Cases', href: '#cases' },
  { label: 'Conteúdos', href: '#conteudo' },
  { label: 'Podcast', href: '#podcast' },
  { label: 'Blog', href: '#blog' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
          <a href="#home" aria-label="Ciclo E-commerce - Página inicial">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-ciclo.svg" alt="Ciclo E-commerce" className="h-8 w-auto" />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Navegação principal">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-[#A1A1AA] hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:block">
            <Button href="#contato" arrow size="md">
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
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-[#A1A1AA] hover:text-white transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <Button href="#contato" arrow className="w-full justify-center mt-2">
                Fale com especialista
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
