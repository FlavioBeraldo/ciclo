import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Search, TrendingUp, Globe, FileText, ShoppingBag, BarChart2, Cpu, Heart, Truck, Share2, Zap, Target, Mail, Store, Newspaper, FlaskConical, Sparkles, ShoppingCart } from 'lucide-react'
import { posts, getWpPosts, getCategoryGradient, formatDate, resolveCategory } from '@/lib/blog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { LucideIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog de E-commerce | Estratégias de Full Funnel Marketing e Growth | Ciclo',
  description:
    'Artigos sobre Full Funnel Marketing, CAC, LTV, CRM, TikTok Shop e crescimento sustentável para e-commerce. Estratégias usadas por mais de 300 marcas.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cicloecommerce.com.br/blog' },
}

const categoryMeta: Record<string, { color: string; icon: LucideIcon }> = {
  Estratégia:               { color: 'bg-[#A100FF]/15 text-[#A100FF] border-[#A100FF]/30',      icon: Target },
  Performance:              { color: 'bg-blue-900/20 text-blue-400 border-blue-500/30',          icon: Zap },
  Retenção:                 { color: 'bg-green-900/20 text-green-400 border-green-500/30',       icon: Heart },
  CRM:                      { color: 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30',    icon: Mail },
  Social:                   { color: 'bg-pink-900/20 text-pink-400 border-pink-500/30',          icon: Share2 },
  Crescimento:              { color: 'bg-orange-900/20 text-orange-400 border-orange-500/30',    icon: TrendingUp },
  SEO:                      { color: 'bg-emerald-900/20 text-emerald-400 border-emerald-500/30', icon: Search },
  'Mídia Paga':             { color: 'bg-orange-900/20 text-orange-400 border-orange-500/30',    icon: TrendingUp },
  'Redes Sociais':          { color: 'bg-pink-900/20 text-pink-400 border-pink-500/30',          icon: Share2 },
  'Marketing Digital':      { color: 'bg-violet-900/20 text-violet-400 border-violet-500/30',   icon: Globe },
  'Marketing de Conteúdo':  { color: 'bg-cyan-900/20 text-cyan-400 border-cyan-500/30',         icon: FileText },
  'Gestão do E-commerce':   { color: 'bg-green-900/20 text-green-400 border-green-500/30',      icon: ShoppingBag },
  Vendas:                   { color: 'bg-red-900/20 text-red-400 border-red-500/30',             icon: ShoppingCart },
  Logística:                { color: 'bg-sky-900/20 text-sky-400 border-sky-500/30',             icon: Truck },
  'Tecnologia e Inovação':  { color: 'bg-indigo-900/20 text-indigo-400 border-indigo-500/30',   icon: Cpu },
  'Experiência do cliente': { color: 'bg-rose-900/20 text-rose-400 border-rose-500/30',         icon: Heart },
  Marketplace:              { color: 'bg-teal-900/20 text-teal-400 border-teal-500/30',         icon: Store },
  'Métricas e Dados':       { color: 'bg-amber-900/20 text-amber-400 border-amber-500/30',      icon: BarChart2 },
  Tendências:               { color: 'bg-fuchsia-900/20 text-fuchsia-400 border-fuchsia-500/30', icon: Sparkles },
  Noticias:                 { color: 'bg-slate-900/20 text-slate-400 border-slate-500/30',       icon: Newspaper },
  'Pesquisas de Mercado':   { color: 'bg-purple-900/20 text-purple-400 border-purple-500/30',   icon: FlaskConical },
}

function catColor(cat: string) {
  return categoryMeta[cat]?.color ?? 'bg-white/5 text-white/60 border-white/15'
}

const PAGE_SIZE = 24

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; cat?: string }>
}) {
  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.page ?? '1', 10))
  const activeCategory = sp.cat ?? ''

  const wpPosts = getWpPosts()
  const [featured, ...curated] = posts

  // Merge and resolve categories
  const allPosts = [
    ...curated.map((p) => ({ ...p, category: resolveCategory(p.category, p.title, p.excerpt) })),
    ...wpPosts.map((p) => ({ ...p, category: resolveCategory(p.category, p.title, p.excerpt) })),
  ].sort((a, b) => b.date.localeCompare(a.date))

  // All unique categories for the filter bar
  const allCategories = [...new Set(allPosts.map((p) => p.category))].sort()

  // Apply category filter
  const filtered = activeCategory
    ? allPosts.filter((p) => p.category === activeCategory)
    : allPosts

  const total = filtered.length
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const featuredResolved = { ...featured, category: resolveCategory(featured.category, featured.title, featured.excerpt) }

  // Build paginated link href
  function pageHref(p: number) {
    const params = new URLSearchParams()
    if (activeCategory) params.set('cat', activeCategory)
    if (p > 1) params.set('page', String(p))
    const q = params.toString()
    return q ? `/blog?${q}` : '/blog'
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#050505] pt-20">
        <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[700px] h-[500px] rounded-full bg-[#A100FF]/6 blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[400px] rounded-full bg-[#A100FF]/4 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">

          {/* Header */}
          <div className="mb-10">
            <p className="text-[#A100FF] text-sm font-semibold tracking-widest uppercase mb-3">Blog</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Estratégias que geram{' '}
              <span className="text-[#A100FF]">crescimento real</span>
            </h1>
            <p className="text-[#A1A1AA] text-lg max-w-2xl">
              {allPosts.length + 1} artigos sobre Full Funnel Marketing, performance, CRM e crescimento sustentável.
            </p>
          </div>

          {/* Category filter bar */}
          <div className="mb-10 -mx-4 px-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2 min-w-max pb-2">
              <Link
                href="/blog"
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${
                  !activeCategory
                    ? 'bg-[#A100FF] text-white border-[#A100FF]'
                    : 'bg-white/5 text-[#A1A1AA] border-white/10 hover:border-[#A100FF]/40 hover:text-white'
                }`}
              >
                Todos
              </Link>
              {allCategories.map((cat) => {
                const meta = categoryMeta[cat]
                const Icon = meta?.icon
                const isActive = activeCategory === cat
                return (
                  <Link
                    key={cat}
                    href={`/blog?cat=${encodeURIComponent(cat)}`}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-[#A100FF] text-white border-[#A100FF]'
                        : 'bg-white/5 text-[#A1A1AA] border-white/10 hover:border-[#A100FF]/40 hover:text-white'
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {cat}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Featured — page 1 only, no active category filter */}
          {page === 1 && !activeCategory && (
            <Link
              href={`/blog/${featuredResolved.slug}`}
              className="group block mb-12 rounded-3xl overflow-hidden border border-white/8 hover:border-[#A100FF]/40 transition-all duration-300"
            >
              <div className={`bg-gradient-to-br ${featuredResolved.coverGradient} p-8 sm:p-12 lg:p-16 relative`}>
                <div className="absolute inset-0 bg-[#A100FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 max-w-3xl">
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${catColor(featuredResolved.category)}`}>
                      {featuredResolved.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                      <Clock className="w-3 h-3" />
                      {featuredResolved.readTime} min de leitura
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-[#A100FF] transition-colors">
                    {featuredResolved.title}
                  </h2>
                  <p className="text-[#A1A1AA] text-base sm:text-lg mb-8 leading-relaxed">{featuredResolved.excerpt}</p>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-white text-sm font-semibold">{featuredResolved.author}</p>
                      <p className="text-[#A1A1AA] text-xs">{formatDate(featuredResolved.date)}</p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-[#A100FF] text-sm font-semibold group-hover:gap-3 transition-all">
                      Ler artigo <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Empty state */}
          {slice.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[#A1A1AA] text-lg">Nenhum artigo encontrado nessa categoria.</p>
              <Link href="/blog" className="mt-4 inline-flex items-center gap-2 text-[#A100FF] text-sm hover:underline">
                <ArrowRight className="w-4 h-4 rotate-180" /> Ver todos os artigos
              </Link>
            </div>
          )}

          {/* Post grid */}
          {slice.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {slice.map((post) => {
                const gradient = 'coverGradient' in post ? post.coverGradient : getCategoryGradient(post.category)
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col rounded-2xl overflow-hidden border border-white/8 hover:border-[#A100FF]/40 transition-all duration-300 bg-white/[0.02] hover:bg-[#A100FF]/5"
                  >
                    <div className={`h-24 bg-gradient-to-br ${gradient}`} />
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${catColor(post.category)}`}>
                          {post.category}
                        </span>
                      </div>
                      <h2 className="font-bold text-white text-sm leading-snug mb-2 group-hover:text-[#A100FF] transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-[#A1A1AA] text-xs leading-relaxed mb-4 flex-1 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                        <p className="text-[10px] text-[#A1A1AA]">{formatDate(post.date)}</p>
                        <span className="text-[#A100FF] text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Ler <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {page > 1 && (
                <Link
                  href={pageHref(page - 1)}
                  className="px-4 py-2 rounded-lg border border-white/15 text-sm text-[#A1A1AA] hover:border-[#A100FF] hover:text-white transition-all"
                >
                  ← Anterior
                </Link>
              )}
              <span className="text-sm text-[#A1A1AA] px-2">
                Página {page} de {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={pageHref(page + 1)}
                  className="px-4 py-2 rounded-lg border border-white/15 text-sm text-[#A1A1AA] hover:border-[#A100FF] hover:text-white transition-all"
                >
                  Próxima →
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
