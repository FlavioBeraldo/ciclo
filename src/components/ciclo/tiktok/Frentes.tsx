import { FRENTES } from './conteudo'

// A operação de TikTok Shop em dois tempos, como a auditoria pediu.
//
//   1. Visão geral compacta: o núcleo no centro e as quatro frentes em volta,
//      com rótulo curto. Dá para entender o serviço em poucos segundos e ver
//      tudo junto na mesma tela.
//   2. Os blocos completos logo abaixo, com os subtítulos de serviço, as
//      descrições e os entregáveis.
//
// A descrição inteira aparece uma vez só, no detalhe. Na visão geral vão os
// nomes dos serviços, que já são o conteúdo do bloco — serve de índice.
//
// O texto é HTML de verdade: selecionável, pesquisável e lido na ordem certa.
// O SVG entra só nos traços que ligam o centro às frentes, e é decorativo.
// No celular tudo empilha numa coluna, sem traço e sem texto miúdo.

export default function Frentes() {
  return (
    <section className="inner-section tts-frentes" id="frentes" aria-labelledby="frentes-titulo">
      <div className="wrap narrow">
        <div className="inner-section-heading">
          <div className="eyebrow">
            <span />O que a Ciclo entrega
          </div>

          <h2 id="frentes-titulo">
            Como a Ciclo E-commerce pode ajudar sua marca no TikTok Shop?
          </h2>

          <p className="tts-frentes-lead">
            Uma solução completa, da configuração inicial à gestão e escala contínua. São
            quatro frentes que funcionam como uma operação só.
          </p>
        </div>

        {/* ── 1. Visão geral ── */}
        <div className="tts-mapa">
          <svg
            className="tts-tracos"
            viewBox="0 0 900 360"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line x1="270" y1="90" x2="450" y2="180" />
            <line x1="630" y1="90" x2="450" y2="180" />
            <line x1="270" y1="270" x2="450" y2="180" />
            <line x1="630" y1="270" x2="450" y2="180" />
          </svg>

          <div className="tts-nucleo">
            <span>Operação integrada</span>
            <strong>TikTok Shop</strong>
          </div>

          {FRENTES.map((f) => (
            <a className={`tts-resumo tts-${f.id}`} href={`#${f.id}`} key={f.id}>
              <span className="tts-numero">{f.numero}</span>
              <strong>{f.titulo}</strong>
              <span className="tts-resumo-itens">
                {f.servicos.map((s) => s.titulo).join(' · ')}
              </span>
            </a>
          ))}
        </div>

        {/* ── 2. Os blocos completos ── */}
        <div className="tts-detalhes">
          {FRENTES.map((f) => (
            <article className="tts-frente" key={f.id} id={f.id}>
              <div className="tts-frente-topo">
                <span className="tts-numero">{f.numero}</span>
                <h3>{f.titulo}</h3>
              </div>

              {f.servicos.map((s) => (
                <div className="tts-servico" key={s.titulo}>
                  <h4>{s.titulo}</h4>
                  <p>{s.texto}</p>
                  <ul className="tts-entregaveis" aria-label={`Entregáveis de ${s.titulo}`}>
                    {s.entregaveis.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
