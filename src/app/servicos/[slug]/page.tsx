import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import CicloHeader from '@/components/ciclo/CicloHeader'
import CicloFooter from '@/components/ciclo/CicloFooter'
import Contato from '@/components/ciclo/Contato'
import Breadcrumb from '@/components/ciclo/interior/Breadcrumb'
import Faq from '@/components/ciclo/interior/Faq'
import CartoesDeServico from '@/components/ciclo/interior/CartoesDeServico'
import { diagramasPorServico, simboloPorServico } from '@/components/ciclo/servicos/diagramas'
import { simboloExtraPorServico } from '@/components/ciclo/servicos/extras'
import { getServicoBySlug, getAllServicoSlugs, getRelatedServicos } from '@/lib/servicos'
import '@/components/ciclo/base.css'
import '@/components/ciclo/interiors.css'
import '@/components/ciclo/explicacoes.css'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllServicoSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const servico = getServicoBySlug(slug)
  if (!servico) return { title: 'Não encontrado | Ciclo E-commerce' }
  return {
    title: servico.seo.title,
    description: servico.seo.description,
    keywords: servico.seo.keywords,
    openGraph: {
      title: servico.seo.title,
      description: servico.seo.description,
      type: 'website',
      locale: 'pt_BR',
      siteName: 'Ciclo E-commerce',
    },
    robots: { index: true, follow: true },
    alternates: { canonical: `https://cicloecommerce.com.br/servicos/${slug}` },
  }
}

// Página de serviço no design 2026.
//
// O conteúdo é o mesmo de @/lib/servicos — título, tagline, o que é, por que
// importa, processo, entregas, resultados, exemplos, FAQ e relacionados —, com
// o mesmo canonical, a mesma metadata e o mesmo JSON-LD de FAQPage. O que muda
// é a casca: a sequência clara → escuro com diagramas → claro que o kit define
// para as páginas individuais de serviço.
//
// Atenção à estrutura: `inner` fica num elemento DENTRO do escopo, nunca no
// mesmo nó. As regras do kit são `.inner h1`, que depois do escopo viram
// `.ciclo2026 .inner h1` e exigem um descendente de verdade.
export default async function ServicoPage({ params }: PageProps) {
  const { slug } = await params
  const servico = getServicoBySlug(slug)
  if (!servico) notFound()

  const relacionados = getRelatedServicos(servico.relatedSlugs)
  const capitulos = diagramasPorServico[slug] ?? []
  // Serviços criados depois do kit não têm símbolo no arquivo gerado
  const simbolo = simboloPorServico[slug] ?? simboloExtraPorServico[slug] ?? ''

  // "Por que importa" continua no texto da visão geral, frase a frase
  const porQue = servico.why.split(/(?<=[.!?])\s+/).filter(Boolean)

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: servico.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  // Diagramas próprios do serviço, quando a lib traz (campo `visuals`)
  const renderVisual = (posicao: 'mechanism' | 'process') => {
    const v = servico.visuals?.find((x) => x.position === posicao)
    if (!v) return null
    return (
      <section className="inner-section" aria-labelledby={`visual-${posicao}`}>
        <div className="wrap narrow">
          <div className="inner-section-heading">
            <div className="eyebrow">
              <span />
              {v.eyebrow}
            </div>
            <h2 id={`visual-${posicao}`}>{v.title}</h2>
          </div>

          <figure className="service-diagram">
            <Image src={v.src} alt={v.alt} width={880} height={470} />
            {v.caption && <figcaption>{v.caption}</figcaption>}
          </figure>
        </div>
      </section>
    )
  }

  return (
    <div className="ciclo2026">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="inner service-page individual-service">
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>

        <CicloHeader />

        <main id="conteudo">
          <section className="inner-hero">
            <div className="wrap narrow">
              <Breadcrumb
                etapas={[
                  { rotulo: 'Início', href: '/' },
                  { rotulo: 'Soluções', href: '/#solucoes' },
                  { rotulo: servico.parentTitle, href: `/solucoes/${servico.parentSlug}` },
                  { rotulo: servico.title },
                ]}
              />

              <div className="service-hero-layout">
                <div>
                  {/* O nome do serviço abre o h1. A solução de origem continua
                      visível no caminho da página e sob o símbolo. */}
                  <h1>
                    <span className="eyebrow h1-kicker">
                      <span />
                      {servico.title}
                    </span>
                    {servico.heroHeadline}
                  </h1>

                  <p className="inner-signature">{servico.tagline}</p>

                  <p className="inner-lead">{servico.heroDescription}</p>

                  <div className="inner-actions">
                    <a className="button" href="#contato">
                      <span>Fale com especialista</span>
                      <b aria-hidden="true">↗</b>
                    </a>
                    <a href="#como-funciona" className="textlink">
                      Conheça o processo <span>↓</span>
                    </a>
                    {/* A chamada para a solução de origem já existia no hero
                        antes do redesign; volta aqui como link de texto. */}
                    <Link href={`/solucoes/${servico.parentSlug}`} className="textlink">
                      Ver solução completa <span>↗</span>
                    </Link>
                  </div>
                </div>

                <div className="service-symbol" aria-hidden="true">
                  <div className="symbol-orbit" />
                  <div className="symbol-orbit second" />
                  <div
                    className="symbol-logo"
                    dangerouslySetInnerHTML={{ __html: simbolo }}
                  />
                  <span>{servico.parentTitle}</span>
                </div>
              </div>

              <nav className="section-index" aria-label="Nesta página">
                <a href="#visao">Visão geral</a>
                <a href="#como-funciona">Como funciona</a>
                <a href="#entregas">Entregas</a>
                <a href="#resultados">Resultados</a>
                <a href="#faq">Perguntas frequentes</a>
              </nav>
            </div>
          </section>

          <div className="service-tone-entry" aria-hidden="true" />

          <section id="visao" className="service-dark-story">
            <div className="wrap narrow">
              <div className="story-overview">
                <div className="eyebrow">
                  <span />
                  Entenda a estratégia
                </div>

                <div className="overview-grid">
                  <h2>O que é {servico.title}?</h2>

                  <div>
                    <p>{servico.what}</p>
                    {porQue.map((frase, i) => (
                      <p key={i}>{frase}</p>
                    ))}
                  </div>
                </div>
              </div>

              {capitulos.length > 0 && (
                <>
                  <div className="story-editorial">
                    <span>A estratégia</span> <em>em movimento.</em>
                  </div>

                  <div className="service-explanations">
                    {capitulos.map((c) => (
                      <article className="visual-chapter" key={c.numero}>
                        <div className="visual-chapter-copy">
                          <span className="chapter-number">{c.numero}</span>
                          <h3>{c.titulo}</h3>
                          <p>{c.texto}</p>
                          <div className="visual-key">{c.chave}</div>
                        </div>

                        <figure
                          className="service-diagram"
                          dangerouslySetInnerHTML={{
                            __html: `${c.svg}<figcaption>${c.legenda}</figcaption>`,
                          }}
                        />
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>

          <div className="service-tone-exit" aria-hidden="true" />

          {renderVisual('mechanism')}

          <section className="inner-section process-section" id="como-funciona">
            <div className="wrap narrow">
              <div className="inner-section-heading">
                <div className="eyebrow">
                  <span />
                  Nosso processo
                </div>

                <h2>Estratégia com direção. Execução com método.</h2>
              </div>

              <ol className="process-list">
                {servico.howItWorks.map(({ step, detail }, i) => (
                  <li key={step}>
                    <span className="step-number">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3>{step}</h3>
                      <p>{detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {renderVisual('process')}

          <section className="inner-section paper" id="entregas">
            <div className="wrap narrow">
              <div className="inner-section-heading">
                <div className="eyebrow">
                  <span />O que você recebe
                </div>

                <h2>Nossas entregas.</h2>
              </div>

              <ul className="deliverable-list">
                {servico.deliverables.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true">↗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {servico.results.length > 0 && (
          <section className="inner-section service-light-results" id="resultados">
            <div className="wrap narrow">
              <div className="inner-section-heading">
                <div className="eyebrow">
                  <span />
                  Resultados
                </div>

                <h2>O impacto da estratégia no negócio.</h2>
              </div>

              <div className="result-grid">
                {servico.results.map(({ metric, label }) => (
                  <div key={metric + label}>
                    <strong>{metric}</strong>
                    <p>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          )}

          {servico.examples.length > 0 && (
          <section className="inner-section">
            <div className="wrap narrow">
              <div className="inner-section-heading">
                <div className="eyebrow">
                  <span />
                  Casos práticos
                </div>

                <h2>Estratégia aplicada ao mundo real.</h2>
              </div>

              <div className="example-grid">
                {servico.examples.map(({ title, description, highlight }, i) => (
                  <article key={title}>
                    <span className="example-index">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <strong>{highlight}</strong>
                  </article>
                ))}
              </div>
            </div>
          </section>
          )}

          <Faq perguntas={servico.faq} />

          {relacionados.length > 0 && (
            <section className="inner-section">
              <div className="wrap narrow">
                <div className="inner-section-heading">
                  <div className="eyebrow">
                    <span />
                    Continue explorando
                  </div>

                  <h2>Conecte as próximas etapas.</h2>
                </div>

                <CartoesDeServico servicos={relacionados} />
              </div>
            </section>
          )}

          <div className="section-fade paper-dark" aria-hidden="true" />

          <Contato />
        </main>

        <CicloFooter />
      </div>
    </div>
  )
}
