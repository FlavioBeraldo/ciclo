import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/ui/Button'
import { solucoes, getSolucaoBySlug, getAllSolucaoSlugs } from '@/lib/solucoes'
import { SolucaoInteractive } from './interactive'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>
}

// ─── Static generation ───────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllSolucaoSlugs().map((slug) => ({ slug }))
}

// ─── SEO metadata ─────────────────────────────────────────────────────────────

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
    },
  }
}

// ─── Server page ─────────────────────────────────────────────────────────────

export default async function SolucaoPage({ params }: PageProps) {
  const { slug } = await params
  const solucao = getSolucaoBySlug(slug)
  if (!solucao) notFound()

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: solucao.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  }

  return (
    <>
      {/* JSON-LD structured data for GEO/AO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Header />
      <main className="min-h-screen bg-[#050505] pt-20">
        {/* Ambient glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#A100FF]/6 blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#A100FF]/4 blur-[120px]" />
        </div>

        {/* ── Hero ── */}
        <section className="relative bg-gradient-to-br from-[#1a0030] via-[#0d0020] to-[#050505] py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-[#A100FF]/15 blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="opacity-40">/</li>
                <li>
                  <span className="text-[#A1A1AA]">Soluções</span>
                </li>
                <li aria-hidden="true" className="opacity-40">/</li>
                <li aria-current="page">
                  <span className="text-white">{solucao.shortTitle}</span>
                </li>
              </ol>
            </nav>

            <div className="max-w-4xl">
              <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-4">
                {solucao.heroSub}
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {solucao.heroHeadline}
              </h1>

              <p className="text-lg sm:text-xl text-[#D4D4D8] leading-relaxed mb-10 max-w-2xl">
                {solucao.heroDescription}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/#contato" arrow size="lg">
                  Fale com um especialista
                </Button>
                <Button href="#como-funciona" variant="outline" size="lg">
                  Como funciona
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Body ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid lg:grid-cols-[1fr_300px] gap-12 items-start">
            {/* Main content */}
            <div className="space-y-20">

              {/* O que é */}
              <section aria-labelledby="o-que-e-heading">
                <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-3">
                  Entenda o conceito
                </p>
                <h2
                  id="o-que-e-heading"
                  className="text-2xl sm:text-3xl font-bold text-white mb-5"
                >
                  O que é {solucao.title}?
                </h2>
                <p className="text-[#D4D4D8] leading-relaxed text-base sm:text-lg">
                  {solucao.whatIs}
                </p>

                {/* Inline CTA */}
                <div className="mt-8 bg-gradient-to-br from-[#A100FF]/15 to-[#A100FF]/5 border border-[#A100FF]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                  <p className="text-white font-medium text-sm">
                    Quer aplicar essa estratégia na sua marca?
                  </p>
                  <Link
                    href="/#contato"
                    className="inline-flex items-center gap-2 bg-[#A100FF] text-white font-semibold px-5 py-2.5 rounded-full hover:bg-[#8800DD] hover:shadow-[0_0_30px_rgba(161,0,255,0.4)] transition-all text-sm flex-shrink-0"
                  >
                    Falar com especialista <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>

              {/* Como funciona */}
              <section id="como-funciona" aria-labelledby="como-funciona-heading">
                <div className="mb-10">
                  <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-3">
                    Nosso processo
                  </p>
                  <h2
                    id="como-funciona-heading"
                    className="text-2xl sm:text-3xl font-bold text-white"
                  >
                    Como funciona
                  </h2>
                </div>

                <div className="space-y-4">
                  {solucao.howItWorks.map(({ step, description }, i) => (
                    <div
                      key={step}
                      className="flex gap-5 bg-white/3 border border-white/8 rounded-2xl p-6"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#A100FF]/20 border border-[#A100FF]/40 flex items-center justify-center text-[#A100FF] font-bold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-white mb-1">{step}</p>
                        <p className="text-[#A1A1AA] text-sm leading-relaxed">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Nossas entregas */}
              <section aria-labelledby="entregas-heading">
                <div className="mb-8">
                  <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-3">
                    O que você recebe
                  </p>
                  <h2
                    id="entregas-heading"
                    className="text-2xl sm:text-3xl font-bold text-white"
                  >
                    Nossas entregas
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {solucao.services.map((service) => (
                    <div
                      key={service}
                      className="flex items-start gap-3 bg-white/3 border border-white/8 rounded-2xl px-5 py-4"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#A100FF]/20 flex items-center justify-center mt-0.5">
                        <Check className="w-3.5 h-3.5 text-[#A100FF]" />
                      </div>
                      <span className="text-[#D4D4D8] text-sm leading-relaxed">{service}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Resultados */}
              <section aria-labelledby="resultados-heading">
                <div className="mb-8">
                  <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-3">
                    Números reais
                  </p>
                  <h2
                    id="resultados-heading"
                    className="text-2xl sm:text-3xl font-bold text-white"
                  >
                    Resultados que entregamos
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {solucao.results.map(({ metric, description }, i) => (
                    <div
                      key={metric + i}
                      className="bg-white/3 border border-white/8 rounded-2xl p-6 shadow-[0_0_40px_rgba(161,0,255,0.08)]"
                    >
                      <p className="text-3xl sm:text-4xl font-bold text-[#A100FF] mb-2">
                        {metric}
                      </p>
                      <p className="text-[#A1A1AA] text-sm leading-relaxed">{description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ + Lead Form — client interactive */}
              <SolucaoInteractive solucao={solucao} />

            </div>

            {/* Sidebar */}
            <aside className="space-y-6 hidden lg:block">
              {/* Sidebar CTA */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5 sticky top-24">
                <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-3">
                  Sobre a Ciclo
                </p>
                <p className="text-[#A1A1AA] text-xs leading-relaxed mb-4">
                  Somos especialistas em Full Funnel Marketing para marcas de e-commerce. +300 marcas atendidas. +12MM em receita gerada.
                </p>
                <Link
                  href="/#contato"
                  className="flex items-center justify-center gap-2 bg-[#A100FF] text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-[#8800DD] transition-all w-full"
                >
                  Falar com especialista <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Other solutions */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-4">
                  Outras soluções
                </p>
                <div className="space-y-3">
                  {solucoes
                    .filter((s) => s.slug !== solucao.slug)
                    .map((s) => (
                      <Link
                        key={s.slug}
                        href={`/solucoes/${s.slug}`}
                        className="group flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors text-xs"
                      >
                        <ArrowRight className="w-3 h-3 text-[#A100FF] flex-shrink-0" />
                        {s.shortTitle}
                      </Link>
                    ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
