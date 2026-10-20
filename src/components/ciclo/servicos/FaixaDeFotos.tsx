'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { fotosDaFaixa, type FotoDaFaixa } from './fotos-da-faixa'
import './faixa-de-fotos.css'

/**
 * Faixa horizontal de fotos do hero, nas rotas de serviço configuradas em
 * `fotos-da-faixa.ts`. As regras do desenho e do movimento estão no CSS ao
 * lado; aqui ficam só as três coisas que dependem do navegador:
 *
 *   1. escolher o motor do movimento (animação de rolagem nativa do CSS ou,
 *      sem suporte, o fallback medido);
 *   2. ligar e desligar o trabalho conforme a faixa entra e sai de cena;
 *   3. trazer as fotos que ainda estão fora da área visível ANTES de o
 *      movimento alcançá-las, para não aparecer cartão vazio.
 *
 * Tudo isso acontece num efeito só, escrevendo direto no DOM: a faixa não
 * tem estado em React e não re-renderiza depois de montada.
 *
 * Sem foto na lista, não renderiza nada.
 */
export default function FaixaDeFotos({ slug }: { slug: string }) {
  const fotos = fotosDaFaixa(slug)
  if (fotos.length === 0) return null
  return <Faixa fotos={fotos} />
}

/**
 * O que o navegador precisa saber sobre o tamanho do cartão, na mesma conta
 * do `faixa-de-fotos.css`. Se a largura do cartão mudar lá, muda aqui junto —
 * é o que impede o navegador de baixar uma imagem maior do que a necessária.
 */
const TAMANHOS = '(max-width: 760px) 62vw, (max-width: 1400px) 30vw, 420px'

/** Quantos cartões já estão na tela quando a faixa está no alto da página. */
const CARTOES_DA_FRENTE = 2

function Faixa({ fotos }: { fotos: FotoDaFaixa[] }) {
  const raiz = useRef<HTMLDivElement>(null)
  const trilho = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = raiz.current
    const via = trilho.current
    if (!el || !via) return

    // O HTML já sai com data-motor="css": num navegador com
    // `animation-timeline` e com o JavaScript desligado, o movimento
    // funciona assim mesmo. Só quem não tem suporte cai para o medido.
    const temTimeline =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('animation-timeline: view()')
    const motor = temTimeline ? 'css' : 'js'
    el.dataset.motor = motor

    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)')

    // ── Fotos de fora da área visível ───────────────────────────────────
    // A troca é empurrada para o primeiro momento ocioso: as fotos que já
    // estão na tela carregam sozinhas, e as de fora chegam antes de o
    // movimento alcançá-las, sem disputar a abertura da página com o hero.
    let ocioso = 0
    let completo = false
    const carregarResto = () => {
      completo = true
      for (const img of el.querySelectorAll<HTMLImageElement>('img[loading="lazy"]')) {
        img.loading = 'eager'
      }
    }
    const agendarCarga = () => {
      if (completo || ocioso) return
      const quando = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 300))
      ocioso = quando(carregarResto) as unknown as number
    }

    // ── Fallback medido ─────────────────────────────────────────────────
    let pedido = 0
    let ligado = false
    const medir = () => {
      pedido = 0
      const area = el.getBoundingClientRect()
      const janela = window.innerHeight || document.documentElement.clientHeight
      // Mesmo intervalo do `animation-range: contain` do caminho em CSS: 0
      // quando a faixa acaba de caber inteira na tela, 1 quando começa a
      // sair por cima. Se ela for mais alta que a janela — não é o caso com
      // 4:3, mas pode ser numa janela muito baixa —, vale o percurso todo.
      const folga = janela - area.height
      const bruto =
        folga > 0 ? (folga - area.top) / folga : (janela - area.top) / (janela + area.height)
      via.style.setProperty('--faixa-p', String(Math.min(1, Math.max(0, bruto))))
    }
    const aoRolar = () => {
      if (!pedido) pedido = requestAnimationFrame(medir)
    }
    const ligar = () => {
      if (ligado || motor !== 'js' || semMovimento.matches) return
      ligado = true
      medir()
      window.addEventListener('scroll', aoRolar, { passive: true })
      window.addEventListener('resize', aoRolar, { passive: true })
    }
    const desligar = () => {
      if (!ligado) return
      ligado = false
      if (pedido) cancelAnimationFrame(pedido)
      pedido = 0
      window.removeEventListener('scroll', aoRolar)
      window.removeEventListener('resize', aoRolar)
    }
    const aoTrocarPreferencia = () => {
      if (semMovimento.matches) {
        desligar()
        via.style.removeProperty('--faixa-p')
      } else if (el.dataset.visivel === 'sim') {
        ligar()
      }
    }

    // ── Visibilidade ────────────────────────────────────────────────────
    let observador: IntersectionObserver | undefined
    if (typeof IntersectionObserver === 'undefined') {
      el.dataset.visivel = 'sim'
      carregarResto()
      ligar()
    } else {
      observador = new IntersectionObserver(
        ([entrada]) => {
          el.dataset.visivel = entrada.isIntersecting ? 'sim' : 'nao'
          if (entrada.isIntersecting) {
            agendarCarga()
            ligar()
          } else {
            desligar()
          }
        },
        { rootMargin: '200px 0px' }
      )
      observador.observe(el)
    }
    semMovimento.addEventListener('change', aoTrocarPreferencia)

    return () => {
      observador?.disconnect()
      semMovimento.removeEventListener('change', aoTrocarPreferencia)
      desligar()
      if (ocioso && window.cancelIdleCallback) window.cancelIdleCallback(ocioso)
    }
  }, [])

  return (
    <div className="faixa-fotos" ref={raiz} data-motor="css" data-visivel="nao">
      <div className="faixa-viewport">
        <ul className="faixa-trilho" ref={trilho}>
          {fotos.map((foto, indice) => {
            // Os primeiros cartões são os que já estão na tela quando a faixa
            // está no alto da página — num monitor largo o primeiro deles é
            // grande o bastante para ser o próprio elemento de LCP. Segurá-lo
            // em prioridade baixa só atrasaria a maior pintura, então esses
            // vão em prioridade normal. Nenhuma foto da faixa é preload, e o
            // resto carrega em prioridade baixa.
            const naFrente = indice < CARTOES_DA_FRENTE
            return (
              <li className="faixa-cartao" key={foto.arquivo}>
                <Image
                  src={foto.arquivo}
                  alt={foto.alt}
                  fill
                  sizes={TAMANHOS}
                  quality={72}
                  className="faixa-imagem"
                  style={{ objectPosition: foto.foco ?? '50% 50%' }}
                  loading={naFrente ? 'eager' : 'lazy'}
                  fetchPriority={naFrente ? undefined : 'low'}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
