'use client'

import MiniaturaYouTube from './MiniaturaYouTube'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Seta } from './Seta'

// Grade de depoimentos em vídeo, com o player dentro do site.
//
// Vive num componente só porque a home e /depoimentos mostram os mesmos
// vídeos: o comportamento de teclado e foco é testado uma vez e vale nos dois
// lugares. O vídeo abre no mesmo iframe de sempre, com os mesmos IDs.
//
// O cartão é um <button>, então responde a Enter e Espaço. O modal fecha no
// Escape e no clique fora, prende o Tab enquanto está aberto, devolve o foco
// ao cartão de origem e trava a rolagem do corpo.

export interface Depoimento {
  id: string
  marca: string
  descricao?: string
}

const FOCAVEIS = 'button, [href], iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])'

export default function VideosDepoimento({ itens }: { itens: Depoimento[] }) {
  const [aberto, setAberto] = useState<Depoimento | null>(null)
  const dialogo = useRef<HTMLDivElement>(null)
  const origem = useRef<HTMLButtonElement | null>(null)

  const fechar = useCallback(() => setAberto(null), [])

  const abrir = (d: Depoimento, e: React.MouseEvent<HTMLButtonElement>) => {
    origem.current = e.currentTarget
    setAberto(d)
  }

  useEffect(() => {
    if (!aberto) return

    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogo.current?.querySelector<HTMLElement>(FOCAVEIS)?.focus()

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        fechar()
        return
      }
      if (e.key !== 'Tab') return
      const alvos = Array.from(dialogo.current?.querySelectorAll<HTMLElement>(FOCAVEIS) ?? [])
      if (!alvos.length) return
      const inicio = alvos[0]
      const fim = alvos[alvos.length - 1]
      const atual = document.activeElement
      if (e.shiftKey && (atual === inicio || !dialogo.current?.contains(atual))) {
        e.preventDefault()
        fim.focus()
      } else if (!e.shiftKey && atual === fim) {
        e.preventDefault()
        inicio.focus()
      }
    }

    // Rede de segurança: o navegador pula um <iframe> sem nada focável dentro,
    // e aí o foco escaparia para a página atrás do modal.
    const aoReceberFoco = (e: FocusEvent) => {
      const alvo = e.target as Node | null
      if (!dialogo.current || (alvo && dialogo.current.contains(alvo))) return
      dialogo.current.querySelector<HTMLElement>(FOCAVEIS)?.focus()
    }

    document.addEventListener('keydown', aoTeclar)
    document.addEventListener('focusin', aoReceberFoco)
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.removeEventListener('focusin', aoReceberFoco)
      document.body.style.overflow = overflow
      origem.current?.focus()
    }
  }, [aberto, fechar])

  return (
    <>
      <div className="proof-grid">
        {itens.map((d) => (
          <button
            type="button"
            className="proof-card"
            key={d.id}
            onClick={(e) => abrir(d, e)}
            aria-haspopup="dialog"
            aria-label={`Assistir ao depoimento ${d.marca}`}
          >
            <div className="thumb">
              <span className="video-eyebrow">Depoimento</span>
              <MiniaturaYouTube
                videoId={d.id}
                alt=""
                // Medido no navegador: o cartão tem 546px no desktop e ~344px no celular
                sizes="(max-width: 760px) 100vw, 546px"
              />
              <span className="play" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 5v14l11-7z" />
                </svg>
              </span>
            </div>

            <div className="proof-caption">
              <span>{d.marca}</span>
              <small>
                Assistir ao vídeo <b aria-hidden="true"><Seta /></b>
              </small>
            </div>

            {d.descricao && <p className="proof-descricao">{d.descricao}</p>}
          </button>
        ))}
      </div>

      {aberto && (
        <div className="video-modal" onClick={fechar}>
          <div
            className="video-modal-dialog"
            ref={dialogo}
            role="dialog"
            aria-modal="true"
            aria-label={`Depoimento ${aberto.marca}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="video-modal-close" onClick={fechar}>
              Fechar <span aria-hidden="true">✕</span>
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${aberto.id}?autoplay=1`}
              title={`Depoimento ${aberto.marca} — Ciclo E-commerce`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  )
}
