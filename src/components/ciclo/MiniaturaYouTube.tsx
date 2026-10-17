'use client'

import Image from 'next/image'
import { useState } from 'react'

// Miniatura de vídeo do YouTube na melhor resolução que o vídeo tiver.
//
// O YouTube serve vários tamanhos por vídeo, e nem todos existem para todos:
//
//   maxresdefault  1280×720  só para vídeo enviado em alta resolução
//   hq720          1280×720  idem, nome alternativo
//   sddefault       640×480  quase sempre existe, com tarja preta
//   hqdefault       480×360  sempre existe, com tarja preta
//
// Não dá para saber de fora qual existe sem pedir. Então este componente
// pede a maior, e só desce para a seguinte quando o navegador avisa que
// falhou — a queda é comprovada por vídeo, em tempo de execução, não
// adivinhada. O `hqdefault` é o último degrau e sempre responde.
//
// Por que isso importa: `hqdefault` tem 480×360, dos quais só 480×270 é
// imagem (o resto é tarja, recortada pelo `object-fit`). Num cartão de 546px
// de largura, isso é ampliação — e foi o que a auditoria viu como miniatura
// macia.

const DEGRAUS = ['maxresdefault', 'hq720', 'sddefault', 'hqdefault'] as const

export default function MiniaturaYouTube({
  videoId,
  alt,
  sizes,
  className,
}: {
  videoId: string
  alt: string
  /** Largura que a imagem ocupa, para o navegador escolher a variante certa */
  sizes: string
  className?: string
}) {
  const [degrau, setDegrau] = useState(0)
  const nome = DEGRAUS[degrau]

  return (
    <Image
      src={`https://img.youtube.com/vi/${videoId}/${nome}.jpg`}
      alt={alt}
      // 16:9, a proporção dos degraus grandes. O recorte é do CSS.
      width={1280}
      height={720}
      sizes={sizes}
      className={className}
      loading="lazy"
      onError={() => setDegrau((d) => Math.min(d + 1, DEGRAUS.length - 1))}
    />
  )
}
