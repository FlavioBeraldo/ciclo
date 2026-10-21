import { ROADMAP } from './conteudo'

// O roadmap em duas fases, como a direção pediu.
//
// Antes eram quatro itens iguais numa lista numerada, e o quarto — "Start &
// Ongoing", que não é uma etapa e sim a operação que começa depois — parecia
// o último passo de uma fila, com cinco atividades soltas dentro.
//
// Agora a página mostra o que é cada coisa:
//
//   1. IMPLANTAÇÃO: as três etapas 01 → 02 → 03, numa sequência ligada. Têm
//      começo e fim, e acontecem uma vez.
//   2. START & ONGOING: a rotina que não termina. As cinco atividades
//      aparecem em ciclo, com a volta desenhada do último para o primeiro —
//      são frentes de uma rotina integrada, não cinco passos em fila.
//
// Nenhum texto mudou: os títulos, as descrições das três etapas, o nome
// "Start & Ongoing", o número 04 e as cinco atividades são os mesmos, na
// mesma ordem. O que mudou é o desenho.

const [...etapas] = ROADMAP.passos
const implantacao = etapas.filter((p) => p.texto)
const continua = etapas.find((p) => p.lista)

export default function Roadmap() {
  return (
    <section className="inner-section" id="roadmap">
      <div className="wrap narrow">
        <div className="inner-section-heading">
          <div className="eyebrow">
            <span />
            {ROADMAP.eyebrow}
          </div>

          <h2>{ROADMAP.titulo}</h2>

          <p className="tts-frentes-lead">{ROADMAP.lead}</p>
        </div>

        {/* ── Fase 1: implantação, com começo e fim ── */}
        <div className="tts-fase">
          <span className="tts-fase-rotulo">Implantação</span>

          <ol className="tts-etapas">
            {implantacao.map((p) => (
              <li key={p.numero}>
                <span className="tts-etapa-marca" aria-hidden="true">
                  <span className="tts-etapa-ponto" />
                </span>
                <span className="tts-numero">{p.numero}</span>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* ── Fase 2: a rotina que não termina ── */}
        {continua && (
          <div className="tts-fase tts-fase-continua">
            <span className="tts-fase-rotulo">Operação contínua</span>

            <div className="tts-continua-topo">
              <span className="tts-numero">{continua.numero}</span>
              <h3>{continua.titulo}</h3>
            </div>

            <ul className="tts-ciclo" aria-label="Frentes da operação contínua">
              {continua.lista?.map((item) => (
                <li className="tts-ciclo-item" key={item}>
                  <span className="tts-ciclo-ponto" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            {/* A volta do ciclo: do último item de novo para o primeiro. */}
            <svg
              className="tts-ciclo-volta"
              viewBox="0 0 1000 40"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M968 6v14a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8V6" />
              <path d="m26 14 6-9 6 9" />
            </svg>
          </div>
        )}
      </div>
    </section>
  )
}
