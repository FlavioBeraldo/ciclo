import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Tag } from 'lucide-react'
import { posts, formatDate } from '@/lib/blog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Blog | Ciclo E-commerce',
  description:
    'Estratégias, análises e insights sobre Full Funnel Marketing, crescimento para e-commerce, CRM, performance e muito mais.',
}

const categoryColors: Record<string, string> = {
  Estratégia: 'bg-[#A100FF]/15 text-[#A100FF] border-[#A100FF]/30',
  Performance: 'bg-blue-900/20 text-blue-400 border-blue-500/30',
  Retenção: 'bg-green-900/20 text-green-400 border-green-500/30',
  CRM: 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30',
  Social: 'bg-pink-900/20 text-pink-400 border-pink-500/30',
  Crescimento: 'bg-orange-900/20 text-orange-400 border-orange-500/30',
}

export default function BlogPage() {
  const [featured, ...rest] = posts

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#050505] pt-20">
        {/* Background glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[700px] h-[500px] rounded-full bg-[#A100FF]/6 blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[400px] rounded-full bg-[#A100FF]/4 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          {/* Page header */}
          <div className="mb-14">
            <p className="text-[#A100FF] text-sm font-semibold tracking-widest uppercase mb-3">Blog</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Estratégias que geram{' '}
              <span className="text-[#A100FF]">crescimento real</span>
            </h1>
            <p className="text-[#A1A1AA] text-lg max-w-2xl">
              Insights sobre Full Funnel Marketing, performance, CRM e crescimento sustentável para marcas de e-commerce.
            </p>
          </div>

          {/* Featured post */}
          <Link
            href={`/blog/${featured.slug}`}
            className="group block mb-12 rounded-3xl overflow-hidden border border-white/8 hover:border-[#A100FF]/40 transition-all duration-300"
          >
            <div className={`bg-gradient-to-br ${featured.coverGradient} p-8 sm:p-12 lg:p-16 relative`}>
              {/* Subtle glow inside card */}
              <div className="absolute inset-0 bg-[#A100FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      categoryColors[featured.category] || categoryColors['Estratégia']
                    }`}
                  >
                    {featured.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                    <Clock className="w-3 h-3" />
                    {featured.readTime} min de leitura
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-[#A100FF] transition-colors duration-300">
                  {featured.title}
                </h2>
                <p className="text-[#A1A1AA] text-base sm:text-lg mb-8 leading-relaxed">
                  {featured.excerpt}
                </p>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-white text-sm font-semibold">{featured.author}</p>
                    <p className="text-[#A1A1AA] text-xs">{formatDate(featured.date)}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-[#A100FF] text-sm font-semibold group-hover:gap-3 transition-all">
                    Ler artigo <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Post grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden border border-white/8 hover:border-[#A100FF]/40 transition-all duration-300 bg-white/[0.02] hover:bg-[#A100FF]/5"
              >
                {/* Color strip */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${post.coverGradient.replace('from-', 'from-').replace('to-[#050505]', 'to-transparent')}`} />

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        categoryColors[post.category] || categoryColors['Estratégia']
                      }`}
                    >
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-[#A1A1AA]">
                      <Clock className="w-3 h-3" />
                      {post.readTime} min
                    </span>
                  </div>

                  <h2 className="font-bold text-white text-base leading-snug mb-3 group-hover:text-[#A100FF] transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-[#A1A1AA] text-xs leading-relaxed mb-6 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <p className="text-[10px] text-[#A1A1AA]">{formatDate(post.date)}</p>
                    <span className="text-[#A100FF] text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ler <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
