'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const STORAGE_KEY = 'ciclo-playbook-popup-dismissed-at'
const COOLDOWN_DAYS = 7
const DELAY_MS = 10_000

// Popup do Playbook de Social Commerce: aparece após 10s nas páginas do blog
// ou imediatamente na intenção de saída (mouse deixando a janela pelo topo).
// Depois de fechado, só volta a aparecer após o período de cooldown.
export default function PlaybookPopup() {
  const [open, setOpen] = useState(false)
  const openedOnce = useRef(false)

  useEffect(() => {
    try {
      const dismissedAt = Number(localStorage.getItem(STORAGE_KEY) ?? 0)
      if (Date.now() - dismissedAt < COOLDOWN_DAYS * 24 * 60 * 60 * 1000) return
    } catch {
      // localStorage indisponível — mostra mesmo assim
    }

    const show = (trigger: 'timer' | 'exit_intent') => {
      if (openedOnce.current) return
      openedOnce.current = true
      setOpen(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).dataLayer?.push({ event: 'playbook_popup_view', trigger })
    }

    const timer = setTimeout(() => show('timer'), DELAY_MS)

    // Exit intent: mouse deixa a viewport pelo topo (fechar aba, digitar URL, trocar de aba)
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) show('exit_intent')
    }
    document.addEventListener('mouseout', onMouseOut)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()))
    } catch {
      // sem persistência, sem problema
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close])

  if (!open) return null

  return (
    <div
      className={`${playfair.variable} lp-playbook fixed inset-0 z-[100] flex items-center justify-center p-4`}
      role="dialog"
      aria-modal="true"
      aria-label="Playbook gratuito de Social Commerce"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Fechar"
        onClick={close}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
      />

      {/* Card editorial */}
      <div className="relative w-full max-w-2xl bg-[#EDE7DB] text-[#1A1917] rounded-2xl overflow-hidden shadow-2xl animate-popup-in">
        <button
          type="button"
          onClick={close}
          aria-label="Fechar popup"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-[#1A1917]/8 hover:bg-[#1A1917]/15 flex items-center justify-center transition-colors"
        >
          <X className="w-4.5 h-4.5 text-[#1A1917]" />
        </button>

        <div className="grid sm:grid-cols-[200px_1fr]">
          {/* Capa do playbook */}
          <div className="bg-[#2B6B9B]/12 flex items-center justify-center p-5 sm:p-6">
            <Image
              src="/playbook/capa-playbook-social-commerce.jpg"
              alt="Capa do Playbook Social Commerce"
              width={993}
              height={1404}
              className="w-24 sm:w-full max-w-[170px] h-auto rounded shadow-[0_14px_34px_-10px_rgba(26,25,23,0.5)] rotate-[-2deg]"
            />
          </div>

          {/* Copy + CTA */}
          <div className="p-6 sm:p-7">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#C0564A] mb-2.5">
              Playbook gratuito · 2026
            </p>
            <p className="font-serif-lp text-2xl sm:text-[1.7rem] leading-tight mb-2.5">
              Social Commerce: a nova era do e-commerce.
            </p>
            <p className="text-sm text-[#6E6A60] leading-relaxed mb-5">
              Dados de mercado, os 4 motores do modelo e um método prático de 90 dias
              para transformar atenção em vendas. 29 capítulos direto ao ponto.
            </p>
            <Link
              href="/playbook-social-commerce"
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(window as any).dataLayer?.push({ event: 'playbook_popup_click' })
                close()
              }}
              className="block w-full bg-[#1A1917] text-[#EDE7DB] text-center rounded-xl px-5 py-3.5 text-sm font-semibold tracking-wide hover:bg-[#2B6B9B] transition-colors"
            >
              Baixar o playbook gratuito →
            </Link>
            <button
              type="button"
              onClick={close}
              className="block w-full text-center text-xs text-[#6E6A60] hover:text-[#1A1917] mt-3 transition-colors"
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
