'use client'

import { useEffect, useState, type ReactNode } from 'react'

// Barra flutuante de chamada para ação.
//
// Aparece quando a abertura sai da tela e some quando o bloco final entra —
// a mesma regra que as duas páginas de conversão já usavam, com os mesmos
// dois IntersectionObserver.
//
// Em /ecomshift ela não é enfeite: é de lá que sai o `begin_checkout` com
// `placement: 'header'`. Por isso ela sobreviveu ao redesign em vez de ser
// descartada junto com o layout antigo.

export default function CtaFlutuante({
  idAbertura,
  idFinal,
  titulo,
  subtitulo,
  children,
}: {
  idAbertura: string
  idFinal: string
  titulo: string
  subtitulo?: string
  children: ReactNode
}) {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const abertura = document.getElementById(idAbertura)
    const final = document.getElementById(idFinal)

    const oAbertura = new IntersectionObserver(([e]) => setVisivel(!e.isIntersecting), {
      threshold: 0,
    })
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
        <p className="semibold">{titulo}</p>
        {subtitulo && <p>{subtitulo}</p>}
      </div>
      {children}
    </div>
  )
}
