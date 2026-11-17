'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { MateriaDeImprensa, PrintDeMateria } from '@/data/estudos-de-caso'
import { Seta } from '@/components/ciclo/Seta'

// "<Marca> na imprensa" — matérias publicadas sobre o case.
//
// Cada matéria mostra o print real da página do veículo (cabeçalho como
// imagem principal e, se houver, um recorte de detalhe da mesma matéria), o
// veículo, a data quando comprovada, um resumo curto escrito por nós e o
// botão para a matéria original em nova aba.
//
// Os prints são servidos sem otimização (`unoptimized`): o arquivo publicado
// é exatamente o que foi enviado, sem recompressão sobre texto.
//
// Clicar num print abre a versão ampliada num diálogo: fecha no botão, no
// Escape e no clique fora, prende o Tab e devolve o foco a quem abriu. Print
// mais alto que a tela rola dentro do diálogo, em tamanho legível.

const FOCAVEIS = 'button, [href], [tabindex]:not([tabindex="-1"])'

function formatarData(iso: string) {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1, d)).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export default function Imprensa({ marca, materias }: { marca: string; materias: MateriaDeImprensa[] }) {
  const [aberto, setAberto] = useState<PrintDeMateria | null>(null)
  const dialogo = useRef<HTMLDivElement>(null)
  const origem = useRef<HTMLButtonElement | null>(null)
  const fechar = useCallback(() => setAberto(null), [])

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
      if (e.shiftKey && document.activeElement === inicio) {
        e.preventDefault()
        fim.focus()
      } else if (!e.shiftKey && document.activeElement === fim) {
        e.preventDefault()
        inicio.focus()
      }
    }
    document.addEventListener('keydown', aoTeclar)
    const quemAbriu = origem.current
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = overflow
      quemAbriu?.focus()
    }
  }, [aberto, fechar])

  const botaoDePrint = (p: PrintDeMateria, classe: string, sizes: string) => (
    <button
      type="button"
      className={`case-print ${classe}`}
      aria-haspopup="dialog"
      aria-label={`Ampliar: ${p.alt}`}
      onClick={(e) => {
        origem.current = e.currentTarget
        setAberto(p)
      }}
    >
      <Image src={p.src} alt={p.alt} width={p.largura} height={p.altura} sizes={sizes} unoptimized />
      <span className="case-print-ampliar" aria-hidden="true">
        Ampliar
      </span>
    </button>
  )

  return (
    <section className="case-imprensa" aria-labelledby="imprensa-titulo">
      <div className="eyebrow">
        <span />
        Imprensa
      </div>
      <h2 id="imprensa-titulo">{marca} na imprensa</h2>

      {materias.map((m) => (
        <article className="case-materia" key={m.url}>
          <div className="case-materia-topo">
            {botaoDePrint(m.print, 'principal', '(max-width: 760px) 100vw, 400px')}

            <div className="case-materia-texto">
              <p className="case-materia-fonte">
                <span>{m.veiculo}</span>
                {m.data && <time dateTime={m.data}>{formatarData(m.data)}</time>}
              </p>
              <h3>{m.titulo}</h3>
              <p>{m.resumo}</p>
              <a className="button case-materia-link" href={m.url} target="_blank" rel="noopener noreferrer">
                <span>
                  Ler matéria completa<span className="sr-only"> (abre em nova aba)</span>
                </span>
                <b aria-hidden="true">
                  <Seta />
                </b>
              </a>
            </div>
          </div>

          {m.detalhe && (
            <figure className="case-materia-detalhe">
              {botaoDePrint(m.detalhe, 'detalhe', '(max-width: 760px) 100vw, 587px')}
              {m.detalhe.legenda && <figcaption>{m.detalhe.legenda}</figcaption>}
            </figure>
          )}
        </article>
      ))}

      {aberto && (
        <div className="case-print-modal" onClick={fechar}>
          <div
            ref={dialogo}
            className="case-print-modal-caixa"
            role="dialog"
            aria-modal="true"
            aria-label={aberto.alt}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="case-print-fechar" onClick={fechar}>
              Fechar <span aria-hidden="true">✕</span>
            </button>
            <Image
              src={aberto.src}
              alt={aberto.alt}
              width={aberto.largura}
              height={aberto.altura}
              sizes="100vw"
              unoptimized
              style={{ maxWidth: `${aberto.largura * 1.6}px` }}
            />
          </div>
        </div>
      )}
    </section>
  )
}
