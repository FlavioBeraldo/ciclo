import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react'
import {
  getPostBySlug,
  getWpPostBySlug,
  getAllSlugs,
  getAllWpSlugs,
  posts,
  getWpPosts,
  getCategoryGradient,
  formatDate,
  type BlogSection,
} from '@/lib/blog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const curated = getAllSlugs().map((slug) => ({ slug }))
  const wp = getAllWpSlugs().map((slug) => ({ slug }))
  return [...curated, ...wp]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug) ?? getWpPostBySlug(slug)
  if (!post) return { title: 'Post não encontrado | Ciclo Blog' }
  return {
    title: `${post.title} | Ciclo Blog`,
    description: post.excerpt,
  }
}

function RenderSection({ section }: { section: BlogSection }) {
  switch (section.type) {
    case 'paragraph':
      return <p className="text-[#D4D4D8] leading-[1.85] text-base sm:text-lg">{section.text}</p>
    case 'heading':
      return <h2 className="text-2xl sm:text-3xl font-bold text-white mt-10 mb-2">{section.text}</h2>
    case 'subheading':
      return <h3 className="text-lg sm:text-xl font-bold text-[#A100FF] mt-6 mb-1">{section.text}</h3>
    case 'list':
      return (
        <ul className="space-y-3">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[#D4D4D8] text-base leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A100FF] mt-2.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )
    case 'highlight':
      return (
        <blockquote className="border-l-4 border-[#A100FF] pl-6 py-4 bg-[#A100FF]/8 rounded-r-2xl my-2">
          <p className="text-white font-medium text-base sm:text-lg leading-relaxed italic">{section.text}</p>
        </blockquote>
      )
    case 'divider':
      return <hr className="border-white/10" />
    default:
      return null
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const curated = getPostBySlug(slug)
  const wp = !curated ? getWpPostBySlug(slug) : null

  if (!curated && !wp) notFound()

  const title = curated ? curated.title : wp!.title
  const excerpt = curated ? curated.excerpt : wp!.excerpt
  const category = curated ? curated.category : wp!.category
  const date = curated ? curated.date : wp!.date
  const author = curated ? curated.author : 'Time Ciclo'
  const authorRole = curated ? curated.authorRole : 'Especialistas em Full Funnel Marketing'
  const readTime = curated ? curated.readTime : Math.max(3, Math.round((wp!.html.replace(/<[^>]+>/g, '').length) / 1200))
  const coverGradient = curated ? curated.coverGradient : getCategoryGradient(category)

  const wpRelated = getWpPosts()
    .filter((p) => p.slug !== slug && p.category === category)
    .slice(0, 2)
  const curatedRelated = posts.filter((p) => p.slug !== slug).slice(0, 2)
  const related = [...curatedRelated, ...wpRelated].slice(0, 2)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#050505] pt-20">
        <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#A100FF]/6 blur-[150px]" />
        </div>

        {/* Hero banner */}
        <div className={`relative bg-gradient-to-br ${coverGradient} py-16 sm:py-24`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors text-sm mb-8">
              <ArrowLeft className="w-4 h-4" /> Voltar para o Blog
            </Link>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-[#A100FF]/15 text-[#A100FF] border-[#A100FF]/30">
                {category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                <Clock className="w-3 h-3" /> {readTime} min de leitura
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">{title}</h1>
            <p className="text-[#A1A1AA] text-lg leading-relaxed mb-8 max-w-2xl">{excerpt}</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#A100FF]/30 border border-[#A100FF]/50 flex items-center justify-center text-[#A100FF] font-bold text-sm">
                C
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{author}</p>
                <p className="text-[#A1A1AA] text-xs">{authorRole} · {formatDate(date)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Article body */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12 items-start">
            <article>
              {curated ? (
                <div className="space-y-6">
                  {curated.content.map((section, i) => (
                    <RenderSection key={i} section={section} />
                  ))}
                </div>
              ) : (
                <div
                  className="wp-content prose-invert text-[#D4D4D8] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: wp!.html }}
                />
              )}

              {/* CTA */}
              <div className="mt-14 bg-gradient-to-br from-[#A100FF]/15 to-[#A100FF]/5 border border-[#A100FF]/30 rounded-2xl p-8 text-center">
                <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-3">Pronto para crescer?</p>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Aplique essa estratégia na sua marca</h3>
                <p className="text-[#A1A1AA] text-sm mb-6 max-w-md mx-auto">
                  Fale com um especialista da Ciclo e descubra como o Full Funnel Marketing pode transformar seu e-commerce.
                </p>
                <Link
                  href="/#contato"
                  className="inline-flex items-center gap-2 bg-[#A100FF] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#8800DD] hover:shadow-[0_0_30px_rgba(161,0,255,0.4)] transition-all"
                >
                  Fale com um especialista <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24">
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-3">Sobre a Ciclo</p>
                <p className="text-[#A1A1AA] text-xs leading-relaxed mb-4">
                  Especialistas em Full Funnel Marketing para marcas de e-commerce. +300 marcas. +R$ 350MM em receita gerada.
                </p>
                <Link
                  href="/#contato"
                  className="flex items-center justify-center gap-2 bg-[#A100FF] text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-[#8800DD] transition-all w-full"
                >
                  Falar com especialista <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {related.length > 0 && (
                <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                  <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-4">Leia também</p>
                  <div className="space-y-4">
                    {related.map((r) => {
                      const grad = 'coverGradient' in r ? r.coverGradient : getCategoryGradient(r.category)
                      const rt = 'readTime' in r ? r.readTime : 5
                      return (
                        <Link key={r.slug} href={`/blog/${r.slug}`} className="group block">
                          <div className={`h-1 w-full rounded-full bg-gradient-to-r ${grad.replace('to-[#050505]', 'to-transparent')} mb-2`} />
                          <p className="text-white text-xs font-semibold leading-snug group-hover:text-[#A100FF] transition-colors">
                            {r.title}
                          </p>
                          <p className="text-[#A1A1AA] text-[10px] mt-1">{rt} min · {r.category}</p>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
