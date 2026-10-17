'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

// Cases em vídeo.
//
// A apresentação é a do kit — cartões 16:9 com capa, selo e botão de play —,
// mas o vídeo continua tocando dentro do site, no mesmo player que a home já
// usava: um iframe do YouTube em modal, com os mesmos IDs e o mesmo embed.
// Os links externos do kit são só demonstração do layout.
//
// O cartão é um <button>, então já responde a Enter e Espaço. O modal fecha
// no Escape e no clique fora, prende o Tab enquanto está aberto, devolve o
// foco ao cartão de origem e trava a rolagem do corpo — o que importa no
// celular, onde o fundo rolava atrás do vídeo.

const DEPOIMENTOS = [
  { id: 'MlDyvGg7rGs', marca: 'Mamô Brasil' },
  { id: 'djykk9EFghg', marca: 'Líquido' },
  { id: 'xVdqhprwKWw', marca: 'KVRA' },
  { id: '6B2XYATbK3Q', marca: 'DANKI' },
]

const FOCAVEIS = 'button, [href], iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])'

export default function Depoimentos() {
  const [aberto, setAberto] = useState<{ id: string; marca: string } | null>(null)
  const dialogo = useRef<HTMLDivElement>(null)
  const origem = useRef<HTMLButtonElement | null>(null)

  const fechar = useCallback(() => setAberto(null), [])

  const abrir = (d: { id: string; marca: string }, e: React.MouseEvent<HTMLButtonElement>) => {
    origem.current = e.currentTarget
    setAberto(d)
  }

  useEffect(() => {
    if (!aberto) return

    // Trava a rolagem do corpo enquanto o vídeo está aberto
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // O foco entra no modal pelo botão de fechar
    const primeiro = dialogo.current?.querySelector<HTMLElement>(FOCAVEIS)
    primeiro?.focus()

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

    // Rede de segurança do Tab: o navegador pula um <iframe> cujo documento
    // não tem nada focável, e aí o foco escaparia para a página atrás do
    // modal. Se isso acontecer, ele volta para o começo do diálogo.
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
      // Devolve o foco ao cartão que abriu o vídeo
      origem.current?.focus()
    }
  }, [aberto, fechar])

  return (
    <section className="section dark proof" id="depoimentos">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">
              <span />
              Cases em vídeo
            </div>

            <h2 className="editorial-accent">Quem vive, recomenda.</h2>
          </div>

          <a className="textlink" href="/depoimentos">
            Ver todos os depoimentos <span>↗</span>
          </a>
        </div>

        <div className="proof-grid">
          {DEPOIMENTOS.map((d) => (
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
                <Image
                  src={`https://img.youtube.com/vi/${d.id}/hqdefault.jpg`}
                  alt=""
                  width={480}
                  height={360}
                  loading="lazy"
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
                  Assistir ao vídeo <b aria-hidden="true">↗</b>
                </small>
              </div>
            </button>
          ))}
        </div>
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
    </section>
  )
}
