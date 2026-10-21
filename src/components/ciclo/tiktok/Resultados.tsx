'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { RESULTADOS } from './conteudo'

// "Nossos resultados": os três prints da Central do Vendedor, logo depois do
// hero, no lugar dos três números de mercado que abriam a página.
//
// Três cartões iguais, não um principal com miniaturas: os três prints têm
// proporções diferentes (1,45, 1,33 e 1,30), e eleger um deles como o grande
// obrigaria a cortar os outros dois para encaixar na mesma moldura. Aqui a
// moldura é a mesma e a imagem entra inteira, por `object-fit: contain` —
// nenhum número fica fora do quadro.
//
// Para ler os valores de perto, cada cartão abre o print em tamanho grande
// num `<dialog>` nativo: o Escape fecha, o foco fica preso dentro enquanto
// estiver aberto e volta sozinho para o cartão que abriu, sem nenhuma linha
// de JavaScript para isso. Clicar fora também fecha.
//
// O primeiro print carrega junto com a página; os outros dois só quando se
// aproximam da tela.

export default function Resultados() {
  const dialogo = useRef<HTMLDialogElement>(null)
  const fechar = useRef<HTMLButtonElement>(null)
  const [aberto, setAberto] = useState<number | null>(null)

  const abrir = (i: number) => {
    setAberto(i)
    dialogo.current?.showModal()
  }

  const encerrar = useCallback(() => {
    dialogo.current?.close()
  }, [])

  // O <dialog> já devolve o foco ao botão que o abriu; aqui só limpamos o
  // estado quando ele fecha, seja pelo Escape, pelo botão ou pelo fundo.
  useEffect(() => {
    const el = dialogo.current
    if (!el) return
    const aoFechar = () => setAberto(null)
    el.addEventListener('close', aoFechar)
    return () => el.removeEventListener('close', aoFechar)
  }, [])

  // O foco vai para o botão de fechar quando o conteúdo já existe. Chamar
  // `focus()` dentro do clique não funcionava: o quadro só é montado no
  // render seguinte, e o foco acabava no próprio <dialog>.
  useEffect(() => {
    if (aberto !== null) fechar.current?.focus()
  }, [aberto])

  const atual = aberto === null ? null : RESULTADOS.prints[aberto]

  return (
    <section className="inner-section tts-resultados" aria-labelledby="resultados-titulo">
      <div className="wrap narrow">
        <div className="inner-section-heading">
          <div className="eyebrow">
            <span />
            {RESULTADOS.eyebrow}
          </div>

          <h2 id="resultados-titulo">{RESULTADOS.titulo}</h2>

          <p className="tts-frentes-lead">{RESULTADOS.nota}</p>
        </div>

        <ul className="tts-prints">
          {RESULTADOS.prints.map((p, i) => (
            <li key={p.arquivo}>
              <button type="button" className="tts-print" onClick={() => abrir(i)}>
                <span className="tts-print-caixa">
                  <Image
                    src={p.arquivo}
                    alt={p.alt}
                    width={p.largura}
                    height={p.altura}
                    sizes="(max-width: 860px) 92vw, 340px"
                    className="tts-print-img"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? undefined : 'low'}
                  />
                </span>

                <span className="tts-print-pe">
                  <strong>{p.rotulo}</strong>
                  <small>{RESULTADOS.periodo}</small>
                  <span className="tts-ampliar" aria-hidden="true">
                    Ampliar
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        className="tts-lupa"
        ref={dialogo}
        aria-label={atual ? `${atual.rotulo} — ${RESULTADOS.periodo}` : RESULTADOS.eyebrow}
        onClick={(e) => {
          // Só o clique no fundo fecha; dentro do quadro, não.
          if (e.target === dialogo.current) encerrar()
        }}
      >
        {atual && (
          <div className="tts-lupa-quadro">
            <div className="tts-lupa-topo">
              <span>
                <strong>{atual.rotulo}</strong>
                <small>{RESULTADOS.periodo}</small>
              </span>

              <button type="button" className="tts-lupa-fechar" ref={fechar} onClick={encerrar}>
                Fechar
              </button>
            </div>

            <Image
              src={atual.arquivo}
              alt={atual.alt}
              width={atual.largura}
              height={atual.altura}
              sizes="(max-width: 980px) 92vw, 900px"
              className="tts-lupa-img"
            />
          </div>
        )}
      </dialog>
    </section>
  )
}
