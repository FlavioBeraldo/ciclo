'use client'

import { useRef, useState } from 'react'
import MiniaturaYouTube from './MiniaturaYouTube'

// Player de vídeo embutido, no estilo do kit.
//
// O kit manda o visitante para o YouTube num link externo. Aqui o vídeo abre
// DENTRO da página, como já abria: mesmo id, mesma URL de embed
// (`/embed/<id>?autoplay=1`) e nenhuma requisição ao YouTube antes do clique
// — a capa vem de img.youtube.com, pelo componente que escolhe o melhor
// degrau disponível.
//
// Ao abrir, o foco vai para o iframe, para quem navega por teclado não ficar
// com o foco num botão que deixou de existir.

export default function PlayerVideo({
  videoId,
  titulo,
  sizes = '(max-width: 760px) 100vw, 860px',
}: {
  videoId: string
  titulo: string
  sizes?: string
}) {
  const [tocando, setTocando] = useState(false)
  const quadro = useRef<HTMLIFrameElement>(null)

  if (tocando) {
    return (
      <iframe
        ref={quadro}
        className="video-embed"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={titulo}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  return (
    <button
      type="button"
      className="video-trigger"
      aria-label={`Assistir: ${titulo}`}
      onClick={() => {
        setTocando(true)
        // o iframe só existe depois da próxima pintura
        requestAnimationFrame(() => quadro.current?.focus())
      }}
    >
      <MiniaturaYouTube videoId={videoId} alt={titulo} sizes={sizes} />
    </button>
  )
}
