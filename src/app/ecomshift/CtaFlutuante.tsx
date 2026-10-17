'use client'

import { useEffect, useState } from 'react'
import BotaoCheckout, { PRECO } from './BotaoCheckout'

// Barra flutuante de checkout, a mesma que a página já tinha.
//
// Aparece quando a abertura sai da tela e some quando o CTA final entra —
// mesma regra de antes, com os mesmos dois IntersectionObserver. Ela existe
// aqui porque é dela que sai o `begin_checkout` com `placement: 'header'`:
// tirá-la apagaria um evento que a mensuração já conta.

export default function CtaFlutuante({
  idAbertura,
  idFinal,
}: {
  idAbertura: string
  idFinal: string
}) {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const abertura = document.getElementById(idAbertura)
    const final = document.getElementById(idFinal)

    const oAbertura = new IntersectionObserver(
      ([e]) => setVisivel(!e.isIntersecting),
      { threshold: 0 }
    )
    const oFinal = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisivel(false)
      },
      { threshold: 0.3 }
    )

    if (abertura) oAbertura.observe(abertura)
    if (final) oFinal.observe(final)

    return () => {
      oAbertura.disconnect()
      oFinal.disconnect()
    }
  }, [idAbertura, idFinal])

  if (!visivel) return null

  return (
    <div className="cta-flutuante">
      <div>
        <p className="semibold">ECOM Shift</p>
        <p>{PRECO}</p>
      </div>
      <BotaoCheckout placement="header" />
    </div>
  )
}
