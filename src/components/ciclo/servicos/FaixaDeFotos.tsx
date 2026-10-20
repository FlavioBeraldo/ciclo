'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { fotosDaFaixa, type FotoDaFaixa } from './fotos-da-faixa'
import './faixa-de-fotos.css'

/**
 * Faixa horizontal de fotos do hero, nas rotas de serviço configuradas em
 * `fotos-da-faixa.ts`. O desenho e o movimento estão no CSS ao lado — a
 * animação é contínua e roda sozinha. Aqui ficam só as quatro coisas que
 * dependem do navegador:
 *
 *   1. a duração, calculada da largura real de uma cópia do trilho, para a
 *      faixa andar na mesma velocidade em qualquer tela e em qualquer rota;
 *   2. as pausas que o CSS não enxerga: fora de cena, aba em segundo plano e
 *      o botão de pausar (as de ponteiro e foco são `:hover`/`:focus-within`);
 *   3. o botão em si, que nasce escondido e só aparece quando há JavaScript
 *      para fazê-lo funcionar;
 *   4. trazer as fotos que ainda estão fora da área visível antes de o
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
const TAMANHOS = '(max-width: 760px) 34vw, (max-width: 1400px) 15vw, 210px'

/** Quantos cartões já estão na tela quando a faixa está no alto da página. */
const CARTOES_DA_FRENTE = 2

/**
 * Velocidade do movimento, em pixels por segundo. 28px/s é cerca de um
 * cartão a cada oito segundos: dá para ver a cena sem que a faixa pareça
 * parada. A duração sai daqui e da largura medida — assim uma rota com seis
 * fotos e outra com oito andam no mesmo ritmo, e o celular não fica mais
 * rápido que o desktop só porque o cartão é menor.
 */
const PIXELS_POR_SEGUNDO = 28

/** Quantas cópias da lista formam o trilho. Ver o comentário no CSS. */
const COPIAS = 3

function Faixa({ fotos }: { fotos: FotoDaFaixa[] }) {
  const raiz = useRef<HTMLDivElement>(null)
  const trilho = useRef<HTMLUListElement>(null)
  const botao = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = raiz.current
    const via = trilho.current
    const botaoPausa = botao.current
    if (!el || !via || !botaoPausa) return

    // ── Duração ─────────────────────────────────────────────────────────
    let medida = 0
    const medirDuracao = () => {
      const umaCopia = via.scrollWidth / COPIAS
      if (!umaCopia || Math.abs(umaCopia - medida) < 1) return
      medida = umaCopia
      via.style.setProperty('--faixa-duracao', `${(umaCopia / PIXELS_POR_SEGUNDO).toFixed(2)}s`)
    }
    medirDuracao()

    let pedido = 0
    const aoRedimensionar = () => {
      if (pedido) return
      pedido = requestAnimationFrame(() => {
        pedido = 0
        medirDuracao()
      })
    }
    window.addEventListener('resize', aoRedimensionar, { passive: true })

    // ── Pausas ──────────────────────────────────────────────────────────
    // Três motivos independentes; a faixa só anda quando nenhum deles vale.
    // Ponteiro e foco são do CSS, que já os enxerga sozinho.
    let emCena = false
    let pausadoPeloUsuario = false
    const aplicar = () => {
      const rodando = emCena && !pausadoPeloUsuario && !document.hidden
      el.dataset.rodando = rodando ? 'sim' : 'nao'
      botaoPausa.textContent = pausadoPeloUsuario ? 'Retomar' : 'Pausar'
      botaoPausa.setAttribute(
        'aria-label',
        pausadoPeloUsuario
          ? 'Retomar o movimento da faixa de fotos'
          : 'Pausar o movimento da faixa de fotos'
      )
    }

    const aoClicar = () => {
      pausadoPeloUsuario = !pausadoPeloUsuario
      aplicar()
    }
    botaoPausa.addEventListener('click', aoClicar)
    botaoPausa.hidden = false

    const aoTrocarAba = () => aplicar()
    document.addEventListener('visibilitychange', aoTrocarAba)

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

    // ── Visibilidade ────────────────────────────────────────────────────
    let observador: IntersectionObserver | undefined
    if (typeof IntersectionObserver === 'undefined') {
      emCena = true
      el.dataset.visivel = 'sim'
      carregarResto()
      aplicar()
    } else {
      observador = new IntersectionObserver(
        ([entrada]) => {
          emCena = entrada.isIntersecting
          el.dataset.visivel = emCena ? 'sim' : 'nao'
          if (emCena) {
            agendarCarga()
            medirDuracao()
          }
          aplicar()
        },
        { rootMargin: '200px 0px' }
      )
      observador.observe(el)
      // Até o observador responder, a faixa fica parada — é o "só começa ao
      // entrar em cena". O HTML sai com `data-rodando="sim"` para quem não
      // tem JavaScript continuar vendo o movimento.
      aplicar()
    }

    return () => {
      observador?.disconnect()
      window.removeEventListener('resize', aoRedimensionar)
      document.removeEventListener('visibilitychange', aoTrocarAba)
      botaoPausa.removeEventListener('click', aoClicar)
      if (pedido) cancelAnimationFrame(pedido)
      if (ocioso && window.cancelIdleCallback) window.cancelIdleCallback(ocioso)
    }
  }, [])

  // Três cópias da mesma lista. A primeira é a que vale para quem lê a
  // página; as outras existem só para o laço fechar sem emenda, e por isso
  // são `aria-hidden` e têm `alt` vazio.
  const copias = Array.from({ length: COPIAS }, (_, i) => i)

  return (
    <div className="faixa-fotos" ref={raiz} data-rodando="sim" data-visivel="nao">
      <div className="faixa-viewport">
        <ul className="faixa-trilho" ref={trilho}>
          {copias.map((copia) =>
            fotos.map((foto, indice) => {
              const clone = copia > 0
              const naFrente = !clone && indice < CARTOES_DA_FRENTE
              return (
                <li
                  className={clone ? 'faixa-cartao faixa-clone' : 'faixa-cartao'}
                  key={`${copia}-${foto.arquivo}`}
                  aria-hidden={clone || undefined}
                >
                  <Image
                    src={foto.arquivo}
                    alt={clone ? '' : foto.alt}
                    fill
                    sizes={TAMANHOS}
                    className="faixa-imagem"
                    style={{ objectPosition: foto.foco ?? '50% 50%' }}
                    loading={naFrente ? 'eager' : 'lazy'}
                    fetchPriority={naFrente ? undefined : 'low'}
                  />
                </li>
              )
            })
          )}
        </ul>
      </div>

      <button className="faixa-pausa" type="button" ref={botao} hidden>
        Pausar
      </button>
    </div>
  )
}
