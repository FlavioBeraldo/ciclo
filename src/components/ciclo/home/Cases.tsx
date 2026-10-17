import Image from 'next/image'
import { cases } from '@/lib/cases'
import ValorDeCase from '../ValorDeCase'

// Cases da home. O conteúdo vem de @/lib/cases, a mesma fonte que a landing da
// Consultoria E-com Shift lê — nenhum número é escrito aqui.

export default function Cases() {
  return (
    <section className="section cases" id="cases">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">
              <span />
              Cresça seu e-commerce
            </div>

            <h2>Nosso método gera resultados.</h2>
          </div>

          <a className="textlink" href="#depoimentos">
            Quem vive, recomenda <span>↗</span>
          </a>
        </div>

        <div className="case-grid">
          {cases.map((c, i) => (
            <article className="case-card" id={`case-${i}`} key={c.brand}>
              <div className="case-photo">
                {c.image && (
                  <Image
                    src={c.image}
                    alt={c.brand}
                    width={900}
                    height={660}
                    // Sem `sizes`, o navegador numa tela Retina baixa a
                    // variante de 1920px para um espaço de ~546px. Isto é
                    // peso, não nitidez: a nitidez depende do arquivo de
                    // origem, e `mamo.jpg` tem só 399px de largura.
                    sizes="(max-width: 760px) 100vw, 546px"
                    loading="lazy"
                    style={c.imagePosition === 'object-top' ? { objectPosition: 'top' } : undefined}
                  />
                )}
                <span className="case-type">{c.category}</span>
              </div>

              <div className="case-content">
                <div className="case-title">
                  <h3>{c.brand}</h3>
                  <span className="case-index">
                    {String(i + 1).padStart(2, '0')} / {String(cases.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="case-copy">
                  <div>
                    <small>Desafio</small>
                    <p>{c.challenge}</p>
                  </div>

                  <div>
                    <small>Ação</small>
                    <p>{c.action}</p>
                  </div>
                </div>

                <div className="case-outcome">
                  <div className="case-outcome-label">Resultados</div>

                  <div className="case-results" aria-label="Resultado">
                    {c.metrics.map((m) => (
                      <div key={m.label}>
                        <strong>
                          <ValorDeCase valor={m.value} />
                        </strong>
                        <span>{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="cases-bottom">
          <a className="button" href="#depoimentos">
            <span>Ver mais cases de sucesso</span>
            <b aria-hidden="true">↗</b>
          </a>
        </div>
      </div>
    </section>
  )
}
