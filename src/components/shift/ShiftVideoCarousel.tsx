'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import YouTubeFacade from '@/components/ui/YouTubeFacade'

// Carrossel dos depoimentos em vídeo, com a identidade E-com Shift.
//
// Os vídeos, marcas, cargos e descrições são exatamente os já publicados em
// /depoimentos — nenhuma fonte nova e nenhuma associação inventada. O player é
// o YouTubeFacade que o site já usa: a thumbnail é um botão e o iframe só é
// criado depois do clique, então nada toca sozinho.

interface Video {
  id: string
  brand: string
  /** Cargo do depoente: guardado na fonte, mas não exibido no card */
  role?: string
  description: string
}

export default function ShiftVideoCarousel({ videos }: { videos: Video[] }) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)

  const readPosition = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const card = track.firstElementChild as HTMLElement | null
    if (!card) return
    const step = card.getBoundingClientRect().width + 16
    setActive(Math.min(videos.length - 1, Math.max(0, Math.round(track.scrollLeft / step))))
  }, [videos.length])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    track.addEventListener('scroll', readPosition, { passive: true })
    return () => track.removeEventListener('scroll', readPosition)
  }, [readPosition])

  const scrollBy = (direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.firstElementChild as HTMLElement | null
    if (!card) return
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + 16), behavior: 'smooth' })
  }

  return (
    <div className="shift-carousel">
      <div className="shift-carousel-controls">
        <p className="shift-eyebrow" aria-live="polite">
          Depoimento {active + 1} de {videos.length}
        </p>
        <div className="shift-carousel-arrows">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Ver depoimento anterior"
            disabled={active === 0}
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Ver próximo depoimento"
            disabled={active === videos.length - 1}
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul className="shift-carousel-track" ref={trackRef}>
        {videos.map((video) => (
          <li key={video.id} className="shift-carousel-card">
            <div className="shift-carousel-player">
              <YouTubeFacade
                videoId={video.id}
                title={`Depoimento ${video.brand} — ${video.description}`}
                // hqdefault existe para todos os vídeos da lista; maxresdefault
                // não existe para os mais antigos e deixava a capa vazia.
                thumbnailQuality="hqdefault"
                sizes="(max-width: 639px) 82vw, (max-width: 1023px) 45vw, 33vw"
              />
            </div>
            <h3 className="shift-step-name mt-4">{video.brand}</h3>
            <p className="shift-body mt-2">{video.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
