import Image from 'next/image'
import Link from 'next/link'
import CicloHeader from '@/components/ciclo/CicloHeader'
import CicloFooter from '@/components/ciclo/CicloFooter'
import Contato, { type TextosDoContato } from '@/components/ciclo/Contato'
import Breadcrumb from '@/components/ciclo/interior/Breadcrumb'
import PlayerVideo from '@/components/ciclo/PlayerVideo'
import ValorDeCase from '@/components/ciclo/ValorDeCase'
import { Seta } from '@/components/ciclo/Seta'
import { estudosDeCaso, type EstudoDeCase } from '@/data/estudos-de-caso'
import { Comparacao, Etapas, Framework } from './Frameworks'
import CtaFixoCase from './CtaFixoCase'

// Template das páginas de case (/cases/<slug>).
//
// Duas colunas no desktop: a leitura à esquerda e, à direita, o formulário de
// contato fixo enquanto o visitante lê. Abaixo de 1024px vira uma coluna só,
// com o formulário no fim e um CTA fixo no rodapé que leva até ele.
//
// O formulário é o `Contato` das páginas de serviço, o mesmo componente, com
// os mesmos campos, regras, eventos e destino — só a variante de apresentação
// e os textos mudam. Há uma única instância dele por página.
//
// Seções opcionais (vídeo, materiais, depoimentos, comparação) só existem
// quando o case tem o material. Sem dado, sem seção.

const TEXTOS_DO_FORMULARIO: TextosDoContato = {
  sobretitulo: 'Vamos escrever o próximo capítulo',
  titulo: 'Sua empresa pode ser o próximo case.',
  apoio: 'Conte seu desafio. Vamos conversar sobre uma estratégia de crescimento para o seu e-commerce.',
  botao: 'Quero construir meu case de sucesso',
}

const CAPITULOS = [
  { id: 'desafio', rotulo: 'Desafio' },
  { id: 'estrategia', rotulo: 'Estratégia' },
  { id: 'execucao', rotulo: 'Execução' },
  { id: 'resultados', rotulo: 'Resultados' },
] as const

function Capitulo({
  id,
  numero,
  rotulo,
  titulo,
  paragrafos,
  children,
}: {
  id: string
  numero: number
  rotulo: string
  titulo: string
  paragrafos: string[]
  children?: React.ReactNode
}) {
  return (
    <section className="case-capitulo" id={id} aria-labelledby={`${id}-titulo`}>
      <div className="case-capitulo-head">
        <span className="case-capitulo-num">{String(numero).padStart(2, '0')}</span>
        <div className="eyebrow">
          <span />
          {rotulo}
        </div>
      </div>
      <h2 id={`${id}-titulo`}>{titulo}</h2>
      <div className="case-prosa">
        {paragrafos.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {children}
    </section>
  )
}

export default function PaginaDeCase({ caso }: { caso: EstudoDeCase }) {
  const outros = estudosDeCaso.filter((c) => c.slug !== caso.slug)
  const { hero } = caso

  return (
    <div className="case-page">
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>

      <CicloHeader contatoNaPagina />

      <main id="conteudo">
        <div className="case-wrap">
          <Breadcrumb
            etapas={[
              { rotulo: 'Início', href: '/' },
              { rotulo: 'Cases', href: '/#cases' },
              { rotulo: caso.marca },
            ]}
          />

          <div className="case-layout">
            <article className="case-main" aria-labelledby="case-titulo">
              {/* ── Abertura ─────────────────────────────────────────── */}
              <header className="case-hero">
                <div className="case-hero-texto">
                  <p className="case-tag">
                    <span>Case</span>
                    <span>{caso.marca}</span>
                    <span>{caso.segmento}</span>
                  </p>
                  <h1 id="case-titulo">
                    {hero.titulo.map((parte, i) =>
                      parte.destaque ? <em key={i}>{parte.texto}</em> : <span key={i}>{parte.texto}</span>
                    )}
                  </h1>
                  <p className="case-resumo">{hero.resumo}</p>
                  <p className="case-frente">
                    <span>Frente</span> {caso.frente}
                  </p>
                </div>

                <div className="case-hero-foto">
                  <Image
                    src={hero.foto.src}
                    alt={hero.foto.alt}
                    width={hero.foto.largura}
                    height={hero.foto.altura}
                    sizes="(max-width: 1023px) 100vw, 300px"
                    priority
                    style={hero.foto.posicao ? { objectPosition: hero.foto.posicao } : undefined}
                  />
                </div>
              </header>

              {/* ── Indicadores ─────────────────────────────────────── */}
              <section
                className={`case-indicadores n${caso.indicadores.length}`}
                aria-label={caso.legendaIndicadores ?? 'Indicadores do case'}
              >
                {caso.legendaIndicadores && (
                  <p className="case-indicadores-legenda">{caso.legendaIndicadores}</p>
                )}
                <dl>
                  {caso.indicadores.map((ind) => (
                    <div key={ind.rotulo}>
                      <dt>{ind.rotulo}</dt>
                      <dd>
                        <ValorDeCase valor={ind.valor} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              {/* ── Vídeo do case, no topo, antes da narrativa ──────── */}
              {caso.video && (
                <section className="case-video" aria-label={`Vídeo do case ${caso.marca}`}>
                  <PlayerVideo
                    videoId={caso.video.youtubeId}
                    titulo={caso.video.titulo}
                    sizes="(max-width: 1023px) 100vw, 780px"
                  />
                  {caso.video.legenda && <p>{caso.video.legenda}</p>}
                </section>
              )}

              <nav className="case-indice" aria-label="Nesta página">
                {CAPITULOS.map((c) => (
                  <a key={c.id} href={`#${c.id}`}>
                    {c.rotulo}
                  </a>
                ))}
              </nav>

              {/* ── Narrativa ───────────────────────────────────────── */}
              <Capitulo
                id="desafio"
                numero={1}
                rotulo="O desafio"
                titulo={caso.desafio.titulo}
                paragrafos={caso.desafio.paragrafos}
              />

              <Capitulo
                id="estrategia"
                numero={2}
                rotulo="A estratégia"
                titulo={caso.estrategia.titulo}
                paragrafos={caso.estrategia.paragrafos}
              >
                {caso.estrategia.frameworks.map((fw) => (
                  <Framework fw={fw} key={fw.titulo} />
                ))}
              </Capitulo>

              <Capitulo
                id="execucao"
                numero={3}
                rotulo="A execução"
                titulo={caso.execucao.titulo}
                paragrafos={caso.execucao.paragrafos}
              >
                {caso.execucao.etapas && caso.execucao.etapas.length > 0 && (
                  <Etapas etapas={caso.execucao.etapas} sequencia={caso.execucao.sequencia} />
                )}
                {caso.execucao.materiais && caso.execucao.materiais.length > 0 && (
                  <div className="case-materiais">
                    {caso.execucao.materiais.map((m) => (
                      <figure key={m.src}>
                        <Image
                          src={m.src}
                          alt={m.alt}
                          width={m.largura}
                          height={m.altura}
                          sizes="(max-width: 1023px) 100vw, 380px"
                        />
                        {m.legenda && <figcaption>{m.legenda}</figcaption>}
                      </figure>
                    ))}
                  </div>
                )}
              </Capitulo>

              <Capitulo
                id="resultados"
                numero={4}
                rotulo="O impacto"
                titulo={caso.resultados.titulo}
                paragrafos={caso.resultados.paragrafos}
              >
                {caso.resultados.comparacao && <Comparacao c={caso.resultados.comparacao} />}
                {caso.resultados.nota && <p className="case-nota">{caso.resultados.nota}</p>}
              </Capitulo>

              {caso.depoimentos && caso.depoimentos.length > 0 && (
                <section className="case-depoimentos" aria-label="Depoimentos">
                  {caso.depoimentos.map((d) => (
                    <figure key={d.autor + d.citacao.slice(0, 20)}>
                      <blockquote>
                        <p>{d.citacao}</p>
                      </blockquote>
                      <figcaption>
                        <strong>{d.autor}</strong>
                        {d.cargo && <span>{d.cargo}</span>}
                      </figcaption>
                    </figure>
                  ))}
                </section>
              )}

              {/* ── Convite ─────────────────────────────────────────── */}
              <section className="case-fechamento" aria-labelledby="fechamento-titulo">
                <h2 id="fechamento-titulo">
                  A próxima história de sucesso pode ser <em>a da sua empresa.</em>
                </h2>
                <a className="button case-fechamento-cta" href="#contato">
                  <span>Conte seu desafio</span>
                  <b aria-hidden="true">
                    <Seta />
                  </b>
                </a>
              </section>

              {outros.length > 0 && (
                <nav className="case-outros" aria-label="Outros cases">
                  <div className="eyebrow">
                    <span />
                    Outros cases
                  </div>
                  <ul>
                    {outros.map((o) => (
                      <li key={o.slug}>
                        <Link href={`/cases/${o.slug}`}>
                          <span>{o.marca}</span>
                          <small>{o.frente}</small>
                          <Seta />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </article>

            <aside className="case-aside">
              <Contato variante="lateral" textos={TEXTOS_DO_FORMULARIO} />
            </aside>
          </div>
        </div>
      </main>

      <CicloFooter />

      <CtaFixoCase texto="Quero crescer com a Ciclo" />
    </div>
  )
}
