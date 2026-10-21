import Image from 'next/image'
import { RESULTADOS } from './conteudo'

// "Nossos resultados": os três prints da Central do Vendedor, logo depois do
// hero, no lugar dos três números de mercado que abriam a página.
//
// Figuras estáticas, e nada além disso: sem botão, sem ampliação, sem data
// no rodapé do cartão e sem nenhum JavaScript. Em 21/10 o Flávio viu a
// prévia e pediu para tirar o clique e a legenda de data; com isso o
// componente deixou de precisar de estado, de `<dialog>` e de 'use client',
// e voltou a ser renderizado inteiro no servidor.
//
// Três molduras iguais, não uma principal com miniaturas: os três prints têm
// proporções diferentes (1,45, 1,33 e 1,30), e eleger um deles como o grande
// obrigaria a cortar os outros dois para encaixar na mesma moldura. Aqui a
// moldura é a mesma e a imagem entra inteira, por `object-fit: contain` —
// nenhum número fica fora do quadro, e nenhum pixel do print foi tocado.
//
// O primeiro print carrega junto com a página; os outros dois só quando se
// aproximam da tela.

export default function Resultados() {
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
              <figure className="tts-print">
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

                <figcaption className="tts-print-pe">{p.rotulo}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
