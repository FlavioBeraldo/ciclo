import { FRENTES } from './conteudo'

// A operação de TikTok Shop vista como um todo: o núcleo no centro e as quatro
// frentes conectadas em volta, conforme o desenho que o Flávio mandou.
//
// O texto é HTML de verdade — selecionável, pesquisável e lido na ordem certa
// por leitor de tela. O SVG entra só para os traços que ligam o centro às
// frentes, e é decorativo. No celular as frentes viram uma lista empilhada e
// os traços somem: não há texto miúdo nem rolagem lateral.
//
// Nenhum conteúdo de SEO virou imagem.

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

        <div className="tts-mapa">
          {/* Só os traços. O conteúdo é o HTML abaixo. */}
          <svg className="tts-tracos" viewBox="0 0 900 520" preserveAspectRatio="none" aria-hidden="true">
            <line x1="300" y1="150" x2="450" y2="260" />
            <line x1="600" y1="150" x2="450" y2="260" />
            <line x1="300" y1="370" x2="450" y2="260" />
            <line x1="600" y1="370" x2="450" y2="260" />
          </svg>

          <div className="tts-nucleo">
            <span>Operação integrada</span>
            <strong>TikTok Shop</strong>
          </div>

          {FRENTES.map((f) => (
            <article className={`tts-frente tts-${f.id}`} key={f.id} id={f.id}>
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
