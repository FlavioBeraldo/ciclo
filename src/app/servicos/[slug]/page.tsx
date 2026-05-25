import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  ChevronRight,
  TrendingUp,
  Lightbulb,
  Target,
  BarChart3,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/ui/Button'
import {
  servicos,
  getServicoBySlug,
  getAllServicoSlugs,
  getRelatedServicos,
} from '@/lib/servicos'
import { ServicosInteractive } from './interactive'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>
}

// ─── Static generation ───────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllServicoSlugs().map((slug) => ({ slug }))
}

// ─── SEO metadata ─────────────────────────────────────────────────────────────

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
    },
  }
}

// ─── Why-it-matters icons (cycle through 3) ──────────────────────────────────

const whyIcons = [TrendingUp, Lightbulb, Target]

// ─── Server page ─────────────────────────────────────────────────────────────

export default async function ServicoPage({ params }: PageProps) {
  const { slug } = await params
  const servico = getServicoBySlug(slug)
  if (!servico) notFound()

  const related = getRelatedServicos(servico.relatedSlugs)

  // Split "why" into sentences for the 3-column cards
  const whySentences = servico.why
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 3)

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: servico.faq.map(({ q, a }) => ({
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
      {/* JSON-LD structured data */}
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

        {/* ── 1. Hero ── */}
        <section className="relative bg-gradient-to-br from-[#1a0030] via-[#0d0020] to-[#050505] py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#A100FF]/15 blur-[120px]" />
            <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[#A100FF]/10 blur-[80px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* 2. Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[#A1A1AA]">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="w-3 h-3 opacity-40" />
                </li>
                <li>
                  <span className="text-[#A1A1AA]">Soluções</span>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="w-3 h-3 opacity-40" />
                </li>
                <li>
                  <Link
                    href={`/solucoes/${servico.parentSlug}`}
                    className="hover:text-white transition-colors"
                  >
                    {servico.parentTitle}
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="w-3 h-3 opacity-40" />
                </li>
                <li aria-current="page">
                  <span className="text-white">{servico.title}</span>
                </li>
              </ol>
            </nav>

            <div className="max-w-4xl">
              <p className="inline-block text-xs font-bold text-[#A100FF] bg-[#A100FF]/10 border border-[#A100FF]/20 rounded-full px-4 py-1.5 uppercase tracking-widest mb-5">
                {servico.parentTitle}
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                {servico.heroHeadline}
              </h1>

              <p className="text-base sm:text-lg text-[#A100FF] font-medium mb-5">
                {servico.tagline}
              </p>

              <p className="text-lg sm:text-xl text-[#D4D4D8] leading-relaxed mb-10 max-w-2xl">
                {servico.heroDescription}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/#contato" arrow size="lg">
                  Fale com especialista
                </Button>
                <Button
                  href={`/solucoes/${servico.parentSlug}`}
                  variant="outline"
                  size="lg"
                >
                  Ver solução completa
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Main content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 space-y-24">

          {/* ── 3. O que é — split layout ── */}
          <section aria-labelledby="o-que-e-heading">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: text */}
              <div>
                <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-3">
                  Entenda o conceito
                </p>
                <h2
                  id="o-que-e-heading"
                  className="text-2xl sm:text-3xl font-bold text-white mb-5"
                >
                  O que é {servico.title}?
                </h2>
                <p className="text-[#D4D4D8] leading-relaxed text-base sm:text-lg">
                  {servico.what}
                </p>
              </div>

              {/* Right: colored stat box */}
              <div className="relative">
                <div className="absolute inset-0 bg-[#A100FF]/10 rounded-3xl blur-[60px]" />
                <div className="relative bg-gradient-to-br from-[#A100FF]/20 to-[#A100FF]/5 border border-[#A100FF]/30 rounded-3xl p-8">
                  <BarChart3 className="w-10 h-10 text-[#A100FF] mb-4" />
                  <p className="text-4xl font-bold text-white mb-2">
                    {servico.results[0].metric}
                  </p>
                  <p className="text-[#D4D4D8] text-sm mb-6">{servico.results[0].label}</p>
                  <div className="border-t border-white/10 pt-5">
                    <p className="text-xs text-[#A1A1AA] mb-3">Outros resultados</p>
                    <div className="space-y-2">
                      {servico.results.slice(1).map(({ metric, label }) => (
                        <div key={label} className="flex items-center gap-3">
                          <span className="text-[#A100FF] font-bold text-sm w-16 flex-shrink-0">
                            {metric}
                          </span>
                          <span className="text-[#A1A1AA] text-xs leading-tight">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 4. Por que importa — 3-column icon cards ── */}
          <section aria-labelledby="por-que-heading">
            <div className="mb-10">
              <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-3">
                Por que faz diferença
              </p>
              <h2
                id="por-que-heading"
                className="text-2xl sm:text-3xl font-bold text-white max-w-xl"
              >
                Por que {servico.title} importa para o seu e-commerce
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              {whySentences.map((sentence, i) => {
                const Icon = whyIcons[i % whyIcons.length]
                return (
                  <div
                    key={i}
                    className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-[#A100FF]/30 hover:bg-[#A100FF]/5 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#A100FF]/20 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-[#A100FF]" />
                    </div>
                    <p className="text-[#D4D4D8] text-sm leading-relaxed">{sentence}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ── 5. Como funciona — numbered steps ── */}
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

            <div className="relative">
              {/* Connecting line */}
              <div
                className="absolute left-5 top-10 bottom-10 w-0.5 bg-gradient-to-b from-[#A100FF]/60 via-[#A100FF]/20 to-transparent hidden sm:block"
                aria-hidden="true"
              />

              <div className="space-y-4">
                {servico.howItWorks.map(({ step, detail }, i) => (
                  <div key={step} className="relative flex gap-6">
                    {/* Step number bubble */}
                    <div className="flex-shrink-0 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-[#A100FF] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_20px_rgba(161,0,255,0.4)]">
                        {i + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-[#A100FF]/20 transition-colors">
                      <p className="font-semibold text-white mb-2">{step}</p>
                      <p className="text-[#A1A1AA] text-sm leading-relaxed">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 6. Nossas entregas — checklist grid ── */}
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
              {servico.deliverables.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 bg-white/3 border border-white/8 rounded-2xl px-5 py-4 hover:border-[#A100FF]/20 transition-colors"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#A100FF]/20 flex items-center justify-center mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#A100FF]" />
                  </div>
                  <span className="text-[#D4D4D8] text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── 7. Resultados — 2×2 metric grid ── */}
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

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {servico.results.map(({ metric, label }, i) => (
                <div
                  key={metric + i}
                  className="relative overflow-hidden bg-gradient-to-br from-[#A100FF]/15 to-[#A100FF]/5 border border-[#A100FF]/25 rounded-2xl p-6 text-center"
                >
                  <div className="absolute inset-0 bg-[#A100FF]/5 blur-[40px]" />
                  <p className="relative text-3xl sm:text-4xl font-bold text-[#A100FF] mb-2">
                    {metric}
                  </p>
                  <p className="relative text-[#A1A1AA] text-xs leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── 8. Exemplos reais — 3 gradient cards ── */}
          <section aria-labelledby="exemplos-heading">
            <div className="mb-8">
              <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-3">
                Casos práticos
              </p>
              <h2
                id="exemplos-heading"
                className="text-2xl sm:text-3xl font-bold text-white"
              >
                Exemplos reais de resultado
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              {servico.examples.map(({ title, description, highlight }, i) => {
                const gradients = [
                  'from-[#4a0080]/40 via-[#2a0050]/30 to-[#0d0020]/20',
                  'from-[#6600aa]/40 via-[#3a0070]/30 to-[#0d0020]/20',
                  'from-[#3300cc]/40 via-[#220055]/30 to-[#0d0020]/20',
                ]
                return (
                  <div
                    key={title}
                    className={`relative overflow-hidden bg-gradient-to-br ${gradients[i % gradients.length]} border border-[#A100FF]/20 rounded-2xl p-6 flex flex-col`}
                  >
                    <div
                      className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#A100FF]/10 blur-[50px]"
                      aria-hidden="true"
                    />

                    <div className="relative z-10 flex-1">
                      <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-3">
                        {title}
                      </p>
                      <p className="text-[#D4D4D8] text-sm leading-relaxed mb-5">{description}</p>
                    </div>

                    <div className="relative z-10 pt-4 border-t border-white/10">
                      <span className="inline-block bg-[#A100FF]/20 border border-[#A100FF]/40 text-[#A100FF] text-xs font-bold px-3 py-1.5 rounded-full">
                        {highlight}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ── 9. FAQ + CTA form (client components) ── */}
          <ServicosInteractive servico={servico} />

          {/* ── 10. Serviços relacionados ── */}
          {related.length > 0 && (
            <section aria-labelledby="relacionados-heading">
              <div className="mb-8">
                <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-3">
                  Continue explorando
                </p>
                <h2
                  id="relacionados-heading"
                  className="text-2xl sm:text-3xl font-bold text-white"
                >
                  Veja também
                </h2>
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/servicos/${r.slug}`}
                    className="group bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-[#A100FF]/40 hover:bg-[#A100FF]/5 transition-all duration-300 flex flex-col"
                  >
                    <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-2">
                      {r.parentTitle}
                    </p>
                    <h3 className="font-semibold text-white text-sm mb-2 flex-1 leading-snug">
                      {r.title}
                    </h3>
                    <p className="text-[#A1A1AA] text-xs leading-relaxed mb-4">{r.tagline}</p>
                    <div className="flex items-center gap-1.5 text-xs text-[#A100FF] font-semibold group-hover:gap-2.5 transition-all mt-auto pt-4 border-t border-white/8">
                      Ver serviço <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
