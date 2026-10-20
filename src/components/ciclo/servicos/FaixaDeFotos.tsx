'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { fotosDaFaixa, type FotoDaFaixa } from './fotos-da-faixa'
import './faixa-de-fotos.css'

/**
 * Faixa horizontal de fotos do hero, nas rotas de serviço configuradas em
 * `fotos-da-faixa.ts`. O desenho e o movimento estão no CSS ao lado — a
 * animação é contínua e roda sozinha. Aqui ficam só as três coisas que
 * dependem do navegador:
 *
 *   1. a duração, calculada da largura real de uma cópia do trilho, para a
 *      faixa andar na mesma velocidade em qualquer tela e em qualquer rota;
 *   2. as duas pausas que o CSS não enxerga — fora de cena e aba em segundo
 *      plano. As de ponteiro e foco são `:hover` e `:focus-within`, no CSS;
 *   3. trazer as fotos que ainda estão fora da área visível antes de o
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

  useEffect(() => {
    const el = raiz.current
    const via = trilho.current
    if (!el || !via) return

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

    // ── Vídeos ──────────────────────────────────────────────────────────
    // O endereço do vídeo NÃO está no `src` do HTML: fica guardado em
    // `data-src` e só é anexado quando o cartão está prestes a aparecer.
    // Sem `src` não existe pedido nenhum — é a única forma de o navegador
    // não baixar os cartões que ainda estão longe.
    //
    // `preload="none"` sozinho não basta: ele só adia o primeiro pedido, e
    // o endereço continua no documento. Sem `src` não há o que adiar.
    //
    // O que desce é fatia, não arquivo: as respostas de vídeo são 206, e o
    // navegador para de puxar quando o vídeo pausa.
    //
    // Por isso a janela é curta: a área visível mais 80px de cada lado. É o
    // suficiente para o vídeo já estar rodando quando o cartão entra, sem
    // acordar meia faixa de uma vez.
    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)')
    const videos = [...el.querySelectorAll<HTMLVideoElement>('video.faixa-video')]
    const naJanela = new Set<HTMLVideoElement>()
    let tocando = false
    const acertarVideos = () => {
      for (const v of videos) {
        if (tocando && naJanela.has(v)) {
          if (!v.getAttribute('src')) {
            const fonte = v.dataset.src
            if (fonte) v.setAttribute('src', fonte)
          }
          if (v.paused) {
            // Um play() recusado (política de autoplay, formato, rede) deixa
            // o cartaz no lugar: o cartão nunca fica vazio.
            void v.play().catch(() => {})
          }
        } else if (!v.paused) {
          v.pause()
        }
      }
    }

    let observadorVideo: IntersectionObserver | undefined
    const area = el.querySelector('.faixa-viewport')
    if (videos.length && area && typeof IntersectionObserver !== 'undefined') {
      observadorVideo = new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) {
            const v = e.target as HTMLVideoElement
            if (e.isIntersecting) naJanela.add(v)
            else naJanela.delete(v)
          }
          acertarVideos()
        },
        { root: area, rootMargin: '0px 80px' }
      )
      for (const v of videos) observadorVideo.observe(v)
    }

    // ── Pausas ──────────────────────────────────────────────────────────
    // Dois motivos aqui; a faixa só anda quando nenhum dos dois vale.
    // Ponteiro e foco são do CSS, que já os enxerga sozinho. O vídeo não
    // para no ponteiro: quem passa o mouse quer olhar a cena, e é só o
    // deslocamento que atrapalha.
    let emCena = false
    const aplicar = () => {
      const rodando = emCena && !document.hidden
      el.dataset.rodando = rodando ? 'sim' : 'nao'
      // Com `prefers-reduced-motion` o vídeo nem aparece: o CSS o esconde e
      // fica só o cartaz. Então também não há por que tocá-lo.
      tocando = rodando && !semMovimento.matches
      acertarVideos()
    }

    const aoTrocarAba = () => aplicar()
    semMovimento.addEventListener('change', aplicar)
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
      observadorVideo?.disconnect()
      for (const v of videos) v.pause()
      window.removeEventListener('resize', aoRedimensionar)
      document.removeEventListener('visibilitychange', aoTrocarAba)
      semMovimento.removeEventListener('change', aplicar)
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
                  {/* O cartaz. Fica atrás do vídeo e é o que se vê antes de
                      ele chegar, se ele falhar e quando o sistema pede menos
                      movimento. É a mesma imagem de sempre, servida no
                      tamanho do cartão — mais leve que o atributo `poster`,
                      que baixaria o arquivo inteiro. */}
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

                  {foto.video && (
                    <video
                      className="faixa-video"
                      data-src={foto.video}
                      muted
                      loop
                      playsInline
                      preload="none"
                      style={{ objectPosition: foto.foco ?? '50% 50%' }}
                      aria-hidden={clone || undefined}
                      aria-label={clone ? undefined : foto.alt}
                    />
                  )}
                </li>
              )
            })
          )}
        </ul>
      </div>
    </div>
  )
}
