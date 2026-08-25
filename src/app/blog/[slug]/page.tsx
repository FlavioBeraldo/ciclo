import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, ArrowRight, ExternalLink } from 'lucide-react'
import {
  getPostBySlug,
  getWpPostBySlug,
  getAllSlugs,
  getAllWpSlugs,
  posts,
  getWpPosts,
  getCategoryGradient,
  formatDate,
  resolveCategory,
  type BlogSection,
} from '@/lib/blog'
import {
  getAllKeystatiSlugs,
  getKeystatiPostBySlug,
  getKeystatiPosts,
} from '@/lib/keystatic-posts'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Props {
  params: Promise<{ slug: string }>
}

// ISR: permite que posts agendados (data futura no Keystatic) entrem no ar
// às 9h do dia marcado sem novo deploy — a página revalida a cada 15 min.
export const revalidate = 900

export async function generateStaticParams() {
  const curated = getAllSlugs().map((slug) => ({ slug }))
  const wp = getAllWpSlugs().map((slug) => ({ slug }))
  const ks = (await getAllKeystatiSlugs()).map((slug) => ({ slug }))
  return [...curated, ...wp, ...ks]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const curated = getPostBySlug(slug)
  const wp = !curated ? getWpPostBySlug(slug) : null
  const ks = !curated && !wp ? await getKeystatiPostBySlug(slug) : null
  const post = curated ?? wp ?? ks
  if (!post) return { title: 'Post não encontrado | Ciclo Blog' }
  return {
    title: `${post.title} | Ciclo Blog`,
    description: post.excerpt,
    robots: { index: true, follow: true },
    alternates: { canonical: `https://cicloecommerce.com.br/blog/${slug}` },
  }
}

// Extrai perguntas e respostas do HTML renderizado (padrão dos posts:
// "**Pergunta?**" seguida da resposta no mesmo parágrafo) para o schema FAQPage.
function extractFaqs(html: string): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = []
  const re = /<p><strong>([^<]+\?)<\/strong>\s*([\s\S]*?)<\/p>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    const answer = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    if (answer) faqs.push({ question: m[1].trim(), answer })
  }
  return faqs
}

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}

function RenderSection({ section }: { section: BlogSection }) {
  switch (section.type) {
    case 'paragraph':
      return <p className="text-gray-700 leading-[1.9] text-[1.0625rem]">{section.text}</p>
    case 'heading':
      return <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-10 mb-3">{section.text}</h2>
    case 'subheading':
      return <h3 className="text-lg sm:text-xl font-bold text-[#A100FF] mt-8 mb-2">{section.text}</h3>
    case 'list':
      return (
        <ul className="space-y-3 my-2">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700 text-[1.0625rem] leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A100FF] mt-[0.6rem] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )
    case 'highlight':
      return (
        <blockquote className="border-l-4 border-[#A100FF] pl-6 py-4 bg-purple-50 rounded-r-2xl my-6">
          <p className="text-gray-800 font-medium text-[1.0625rem] leading-relaxed italic">{section.text}</p>
        </blockquote>
      )
    case 'divider':
      return <hr className="border-gray-200 my-8" />
    case 'ctaCard':
      return (
        <div className="my-8 bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <p className="text-gray-800 font-medium text-sm leading-relaxed">{section.text}</p>
          <Link
            href={section.ctaHref ?? '/'}
            className="inline-flex items-center gap-2 bg-[#A100FF] text-white font-semibold px-5 py-2.5 rounded-full text-sm flex-shrink-0 hover:bg-[#8800DD] transition-all"
          >
            {section.ctaLabel} <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )
    default:
      return null
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const curated = getPostBySlug(slug)
  const wp = !curated ? getWpPostBySlug(slug) : null
  const ks = !curated && !wp ? await getKeystatiPostBySlug(slug) : null

  if (!curated && !wp && !ks) notFound()

  const title = curated?.title ?? wp?.title ?? ks!.title
  const excerpt = curated?.excerpt ?? wp?.excerpt ?? ks!.excerpt
  const rawCategory = curated?.category ?? wp?.category ?? ks!.category
  const category = resolveCategory(rawCategory, title, excerpt)
  const date = curated?.date ?? wp?.date ?? ks!.date
  const author = curated?.author ?? ks?.author ?? 'Time Ciclo'
  const authorRole = curated?.authorRole ?? ks?.authorRole ?? 'Especialistas em Full Funnel Marketing'
  const readTime = curated
    ? curated.readTime
    : ks
    ? ks.readTime
    : Math.max(3, Math.round((wp!.html.replace(/<[^>]+>/g, '').length) / 1200))
  const coverGradient = curated ? curated.coverGradient : getCategoryGradient(category)

  const ksPosts = await getKeystatiPosts()
  const wpRelated = getWpPosts()
    .filter((p) => p.slug !== slug && resolveCategory(p.category, p.title, p.excerpt) === category)
    .slice(0, 3)
  const curatedRelated = posts.filter((p) => p.slug !== slug && p.category === category).slice(0, 3)
  const ksRelated = ksPosts.filter((p) => p.slug !== slug && p.category === category).slice(0, 3)
  const related = [...ksRelated, ...curatedRelated, ...wpRelated].slice(0, 3)

  const canonical = `https://cicloecommerce.com.br/blog/${slug}`
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    datePublished: date,
    inLanguage: 'pt-BR',
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    author: {
      '@type': author === 'Time Ciclo' ? 'Organization' : 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ciclo E-commerce',
      url: 'https://cicloecommerce.com.br',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cicloecommerce.com.br/logo-ciclo.png',
      },
    },
  }
  const faqs = extractFaqs(wp?.html ?? ks?.html ?? '')
  const faqLd =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null

  return (
    <>
      <JsonLd data={articleLd} />
      {faqLd && <JsonLd data={faqLd} />}
      <Header />
      <main className="min-h-screen">
        {/* Dark branded hero */}
        <div className={`relative bg-gradient-to-br ${coverGradient} pt-28 pb-14 sm:pb-20`}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm mb-8">
              <ArrowLeft className="w-4 h-4" /> Voltar para o Blog
            </Link>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-[#A100FF]/20 text-white border-[#A100FF]/40">
                {category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/60">
                <Clock className="w-3 h-3" /> {readTime} min de leitura
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-tight mb-5">{title}</h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-2xl">{excerpt}</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                {author.charAt(0)}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{author}</p>
                <p className="text-white/50 text-xs">{authorRole} · {formatDate(date)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Light reading area */}
        <div className="bg-[#FAFAF8] min-h-screen">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid lg:grid-cols-[1fr_260px] gap-14 items-start">

              {/* Article content */}
              <article className="article-light max-w-[700px]">
                {curated ? (
                  <div className="space-y-6">
                    {curated.content.map((section, i) => (
                      <RenderSection key={i} section={section} />
                    ))}
                  </div>
                ) : (
                  <div
                    className="wp-content"
                    dangerouslySetInnerHTML={{ __html: wp?.html ?? ks!.html }}
                  />
                )}

                {/* Mid-article CTA */}
                <div className="mt-14 border border-[#A100FF]/20 bg-white rounded-2xl p-8 text-center shadow-sm">
                  <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-3">Pronto para crescer?</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Aplique essa estratégia na sua marca</h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                    Fale com um especialista da Ciclo e descubra como o Full Funnel Marketing pode transformar seu e-commerce.
                  </p>
                  <Link
                    href="/#contato"
                    className="inline-flex items-center gap-2 bg-[#A100FF] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#8800DD] hover:shadow-[0_0_30px_rgba(161,0,255,0.3)] transition-all"
                  >
                    Fale com um especialista <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="space-y-5 lg:sticky lg:top-24">
                {/* About Ciclo */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-3">Sobre a Ciclo</p>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">
                    Especialistas em Full Funnel Marketing para marcas de e-commerce. +300 marcas. +R$ 350MM em receita gerada.
                  </p>
                  <Link
                    href="/#contato"
                    className="flex items-center justify-center gap-2 bg-[#A100FF] text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-[#8800DD] transition-all w-full"
                  >
                    Falar com especialista <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Related posts */}
                {related.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-4">Leia também</p>
                    <div className="space-y-4">
                      {related.map((r) => {
                        const rCat = resolveCategory(r.category, r.title, r.excerpt)
                        const rt = 'readTime' in r ? r.readTime : 5
                        return (
                          <Link key={r.slug} href={`/blog/${r.slug}`} className="group block">
                            <p className="text-gray-800 text-xs font-semibold leading-snug group-hover:text-[#A100FF] transition-colors">
                              {r.title}
                            </p>
                            <p className="text-gray-400 text-[10px] mt-1">{rt} min · {rCat}</p>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Back to blog */}
                <Link
                  href="/blog"
                  className="flex items-center gap-2 text-gray-400 hover:text-[#A100FF] text-xs transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Ver todos os artigos
                </Link>
              </aside>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
