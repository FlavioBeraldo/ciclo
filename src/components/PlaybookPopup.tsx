'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'
import { track } from '@/lib/track'

const STORAGE_KEY = 'ciclo-playbook-popup-dismissed-at'
const COOLDOWN_DAYS = 7
const DELAY_MS = 10_000

const SERVICE_COPY = {
  'tiktok-shop': {
    title: 'Sua marca ainda está explorando o TikTok Shop?',
    description: 'Se contratar uma agência ainda não é o próximo passo, comece pelo Playbook gratuito de Social Commerce da Ciclo. Entenda como creators, afiliados, lives e anúncios ajudam a vender no TikTok Shop.',
  },
  'agencia-ugc': {
    title: 'Quer testar UGC na sua marca e ainda está definindo por onde começar?',
    description: 'O Playbook gratuito de Social Commerce da Ciclo mostra como escolher ângulos criativos e testar vídeos de creators para descobrir quais funcionam melhor nos seus anúncios.',
  },
}

const SERVICE_SHOWN_KEY = 'ciclo-service-playbook-shown'
const COMMERCIAL_INTENT_KEY = 'ciclo-service-commercial-intent'

function pushPopupEvent(event: string, details: Record<string, string>) {
  const analyticsWindow = window as Window & { dataLayer?: Record<string, string>[] }
  analyticsWindow.dataLayer?.push({ event, ...details })
}

export default function PlaybookPopup({ service }: { service?: keyof typeof SERVICE_COPY }) {
  const [open, setOpen] = useState(false)
  const openedOnce = useRef(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const copy = service ? SERVICE_COPY[service] : undefined
  const context: Record<string, string> = service ? { service } : {}

  useEffect(() => {
    if (service) {
      const contact = document.getElementById('contato')
      if (!contact) return

      let commercialIntent = false
      const protectContact = () => {
        commercialIntent = true
        try {
          sessionStorage.setItem(COMMERCIAL_INTENT_KEY, '1')
        } catch {
          // A proteção continua ativa nesta montagem.
        }
      }
      const contactReached = () => contact.getBoundingClientRect().top < window.innerHeight
      const onCommercialAction = (event: Event) => {
        if (!(event.target instanceof Element)) return
        const link = event.target.closest<HTMLAnchorElement>('a[href]')
        if (contact.contains(event.target) || link?.hash === '#contato') protectContact()
      }
      const onHashChange = () => {
        if (window.location.hash === '#contato') protectContact()
      }
      onHashChange()
      const contactObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) protectContact()
      })
      contactObserver.observe(contact)

      const showServicePopup = (trigger: 'exit_intent' | 'scroll_end') => {
        if (contactReached()) protectContact()
        if (commercialIntent || openedOnce.current || document.querySelector('dialog[open], [role="dialog"][aria-modal="true"]')) return
        try {
          if (sessionStorage.getItem(SERVICE_SHOWN_KEY) || sessionStorage.getItem(COMMERCIAL_INTENT_KEY)) return
          sessionStorage.setItem(SERVICE_SHOWN_KEY, '1')
        } catch {
          // O ref ainda limita a exibição nesta montagem.
        }
        openedOnce.current = true
        setOpen(true)
        const event = { trigger, service }
        pushPopupEvent('playbook_popup_view', event)
        track('popup_view', { popup: 'playbook', ...event })
      }

      const touch = window.matchMedia('(hover: none) and (pointer: coarse)')
      const onExit = (event: MouseEvent) => {
        if (!touch.matches && !event.relatedTarget && event.clientY <= 0) showServicePopup('exit_intent')
      }
      const onScroll = () => {
        if (contactReached()) {
          protectContact()
          return
        }
        if (!touch.matches || window.scrollY <= 0) return
        const contactTop = contact.getBoundingClientRect().top + window.scrollY
        if (window.scrollY + window.innerHeight >= contactTop * 0.9) showServicePopup('scroll_end')
      }
      const commercialEvents = ['click', 'focusin', 'input', 'submit']
      commercialEvents.forEach((event) => document.addEventListener(event, onCommercialAction, true))
      window.addEventListener('hashchange', onHashChange)
      window.addEventListener('scroll', onScroll, { passive: true })
      document.addEventListener('mouseout', onExit)
      return () => {
        contactObserver.disconnect()
        commercialEvents.forEach((event) => document.removeEventListener(event, onCommercialAction, true))
        window.removeEventListener('hashchange', onHashChange)
        window.removeEventListener('scroll', onScroll)
        document.removeEventListener('mouseout', onExit)
      }
    }

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
      pushPopupEvent('playbook_popup_view', { trigger })
      track('popup_view', { popup: 'playbook', trigger })
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
  }, [service])

  const close = useCallback(() => {
    setOpen(false)
    if (service) return
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()))
    } catch {
      // sem persistência, sem problema
    }
  }, [service])

  // Fechamento sem conversão: registra o dispensar e o meio usado
  const dismiss = useCallback(
    (method: 'agora_nao' | 'x' | 'backdrop' | 'esc') => {
      pushPopupEvent('playbook_popup_dismiss', service ? { method, service } : { method })
      close()
    },
    [close, service]
  )

  useEffect(() => {
    if (!open) return
    const modal = dialog.current
    modal?.showModal()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dismiss('esc')
    if (!modal) document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      modal?.close()
      document.body.style.overflow = previousOverflow
    }
  }, [open, dismiss])

  if (!open) return null

  const popup = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role={service ? undefined : 'dialog'}
      aria-modal={service ? undefined : true}
      aria-label={service ? undefined : 'Playbook gratuito de Social Commerce'}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Fechar"
        tabIndex={service ? -1 : undefined}
        onClick={() => dismiss('backdrop')}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
      />

      {/* Card editorial */}
      <div className={`relative w-full max-w-2xl bg-[#EDE7DB] text-[#1A1917] rounded-2xl overflow-hidden shadow-2xl animate-popup-in ${service ? 'max-h-[calc(100dvh-2rem)] overflow-y-auto' : ''}`}>
        <button
          type="button"
          onClick={() => dismiss('x')}
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
            <p className="text-2xl sm:text-[1.7rem] font-medium tracking-[-0.02em] leading-tight mb-2.5">
              {copy?.title ?? 'Social Commerce: a nova era do e-commerce.'}
            </p>
            <p className="text-sm text-[#6E6A60] leading-relaxed mb-5">
              {copy?.description ?? 'Dados de mercado, os 4 motores do modelo e um método prático de 90 dias para transformar atenção em vendas. 38 páginas direto ao ponto.'}
            </p>
            <Link
              href="/playbook-social-commerce"
              onClick={() => {
                pushPopupEvent('playbook_popup_click', context)
                track('popup_click', { popup: 'playbook', ...context })
                close()
              }}
              className="block w-full bg-[#1A1917] text-[#EDE7DB] text-center rounded-xl px-5 py-3.5 text-sm font-semibold tracking-wide hover:bg-[#2B6B9B] transition-colors"
            >
              {service ? 'Quero o playbook gratuito' : 'Baixar o playbook gratuito →'}
            </Link>
            <button
              type="button"
              onClick={() => dismiss('agora_nao')}
              className="block w-full text-center text-xs text-[#6E6A60] hover:text-[#1A1917] mt-3 transition-colors"
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (!service) return popup

  return createPortal(
    <dialog
      ref={dialog}
      aria-label={copy?.title}
      onCancel={(event) => {
        event.preventDefault()
        dismiss('esc')
      }}
      className="fixed inset-0 m-0 h-full w-full max-h-none max-w-none bg-transparent p-0"
    >
      {popup}
    </dialog>,
    document.body,
  )
}
