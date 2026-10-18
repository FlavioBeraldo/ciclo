import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CicloHeader from '@/components/ciclo/CicloHeader'
import CicloFooter from '@/components/ciclo/CicloFooter'
import Contato from '@/components/ciclo/Contato'
import Breadcrumb from '@/components/ciclo/interior/Breadcrumb'
import Faq from '@/components/ciclo/interior/Faq'
import CartoesDeServico from '@/components/ciclo/interior/CartoesDeServico'
import { simboloPorSolucao } from '@/components/ciclo/servicos/diagramas'
import { solucoes, getSolucaoBySlug, getAllSolucaoSlugs } from '@/lib/solucoes'
import { getServicoBySlug } from '@/lib/servicos'
import { playfair2026 } from '@/components/ciclo/fonts'
import '@/components/ciclo/base.css'
import '@/components/ciclo/interiors.css'
import { Seta } from '@/components/ciclo/Seta'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllSolucaoSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const solucao = getSolucaoBySlug(slug)
  if (!solucao) return { title: 'Não encontrado | Ciclo E-commerce' }
  return {
    title: solucao.seo.title,
    description: solucao.seo.description,
    keywords: solucao.seo.keywords,
    openGraph: {
      title: solucao.seo.title,
      description: solucao.seo.description,
      type: 'website',
      locale: 'pt_BR',
      siteName: 'Ciclo E-commerce',
    },
    robots: { index: true, follow: true },
    alternates: { canonical: `https://cicloecommerce.com.br/solucoes/${slug}` },
  }
}

// Página de solução no design 2026.
//
// Mesmo conteúdo de @/lib/solucoes, mesmo canonical, mesma metadata e o mesmo
// JSON-LD de FAQPage. Os serviços-filhos continuam linkados um a um, agora nos
// cartões do kit, e o bloco de "Outras soluções" que estava na barra lateral
// vira uma lista ao pé da página.
export default async function SolucaoPage({ params }: PageProps) {
  const { slug } = await params
  const solucao = getSolucaoBySlug(slug)
  if (!solucao) notFound()

  // Cada serviço-filho com o título e a chamada que a própria página dele usa
  const servicos = solucao.serviceLinks.map(({ label, slug: s }) => {
    const servico = getServicoBySlug(s)
    return { slug: s, title: servico?.title ?? label, tagline: servico?.tagline ?? '' }
  })

  const outras = solucoes.filter((s) => s.slug !== solucao.slug)

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: solucao.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <div className={`ciclo2026 ${playfair2026.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* `inner` precisa ficar DENTRO do escopo: as regras do kit são
          `.inner h1`, que depois do escopo viram `.ciclo2026 .inner h1`. */}
      <div className="inner service-page">
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
                { rotulo: solucao.shortTitle },
              ]}
            />

            <div className="service-hero-layout">
              <div>
                {/* O nome da solução abre o h1. Ele estava na linha de
                    assinatura, logo abaixo; agora aparece uma vez só, no
                    lugar que o buscador lê primeiro. */}
                <h1>
                  <span className="eyebrow h1-kicker">
                    <span />
                    {solucao.heroSub}
                  </span>
                  {solucao.heroHeadline}
                </h1>

                <p className="inner-lead">{solucao.heroDescription}</p>

                <div className="inner-actions">
                  <a className="button" href="#contato">
                    <span>Fale com especialista</span>
                    <b aria-hidden="true"><Seta /></b>
                  </a>
                  <a href="#como-funciona" className="textlink">
                    Conheça o processo <span>↓</span>
                  </a>
                </div>
              </div>

              <div className="service-symbol" aria-hidden="true">
                <div className="symbol-orbit" />
                <div className="symbol-orbit second" />
                <div
                  className="symbol-logo"
                  dangerouslySetInnerHTML={{ __html: simboloPorSolucao[slug] ?? '' }}
                />
                <span>Full Funnel Marketing</span>
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

        <section id="visao" className="inner-section paper">
          <div className="wrap narrow">
            <div className="eyebrow">
              <span />
              Entenda a estratégia
            </div>

            <div className="overview-grid">
              <h2>O que é {solucao.title}?</h2>

              <div>
                <p>{solucao.whatIs}</p>
              </div>
            </div>
          </div>
        </section>

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
              {solucao.howItWorks.map(({ step, description }, i) => (
                <li key={step}>
                  <span className="step-number">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{step}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="inner-section paper" id="entregas">
          <div className="wrap narrow">
            <div className="inner-section-heading">
              <div className="eyebrow">
                <span />O que a Ciclo entrega
              </div>

              <h2>Soluções que se complementam.</h2>
            </div>

            <CartoesDeServico servicos={servicos} />
          </div>
        </section>

        <div className="section-fade paper-dark" aria-hidden="true" />

        <section className="inner-section dark outcome-section" id="resultados">
          <div className="wrap narrow">
            <div className="inner-section-heading">
              <div className="eyebrow">
                <span />
                Resultados
              </div>

              <h2>O impacto da estratégia no negócio.</h2>
            </div>

            <div className="result-grid">
              {solucao.results.map(({ metric, description }) => (
                <div key={metric + description}>
                  <strong>{metric}</strong>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-fade dark-white" aria-hidden="true" />

        <Faq perguntas={solucao.faq} />

        <section className="inner-section">
          <div className="wrap narrow">
            <div className="inner-section-heading">
              <div className="eyebrow">
                <span />
                Continue explorando
              </div>

              <h2>Outras soluções.</h2>
            </div>

            <div className="directory-links">
              {outras.map((s) => (
                <Link href={`/solucoes/${s.slug}`} key={s.slug}>
                  {s.shortTitle}
                  <b aria-hidden="true"><Seta /></b>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="section-fade paper-dark" aria-hidden="true" />

        <Contato />
      </main>

      <CicloFooter />
      </div>
    </div>
  )
}
