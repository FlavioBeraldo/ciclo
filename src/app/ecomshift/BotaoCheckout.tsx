'use client'

import { newEventId, pushConversion } from '@/lib/conversions'
import { getAttributionPayload } from '@/lib/attribution'

export const PAGAMENTO = 'https://pay.hub.la/4JzioLT4Af7962CGf2by'
export const PRECO = 'R$ 37,90'

// Clique no checkout (Hubla) = begin_checkout / InitiateCheckout (R$ 37,90)
//
// O evento, o nome, o valor e as chaves do payload são os mesmos de antes,
// inclusive os dois `placement` — 'header' no botão da abertura e 'cta' nos
// demais. Isso é camada de mensuração: o redesign não a toca.
function trackCheckoutClick(placement: string) {
  pushConversion('begin_checkout', {
    eventId: newEventId(),
    attribution: getAttributionPayload(),
    value: 37.9,
    currency: 'BRL',
    contentName: 'ecomshift',
    extra: { placement, items_count: 1 },
  })
}

export default function BotaoCheckout({ placement }: { placement: 'header' | 'cta' }) {
  return (
    <a
      href={PAGAMENTO}
      target="_blank"
      rel="noopener noreferrer"
      className="semibold action-link"
      onClick={() => trackCheckoutClick(placement)}
    >
      Quero acessar por {PRECO}
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        className="module-icon"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </a>
  )
}
