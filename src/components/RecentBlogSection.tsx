import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { posts, formatDate } from '@/lib/blog'

const categoryColors: Record<string, string> = {
  Estratégia: 'text-[#A100FF] bg-[#A100FF]/10',
  'Social Commerce': 'text-[#FE2C55] bg-[#FE2C55]/10',
  Analytics: 'text-blue-400 bg-blue-400/10',
  CRM: 'text-green-400 bg-green-400/10',
  Conteúdo: 'text-yellow-400 bg-yellow-400/10',
  Tráfego: 'text-orange-400 bg-orange-400/10',
}

export default function RecentBlogSection() {
  const recent = posts.slice(0, 3)

  return (
    <section className="py-20 lg:py-28 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-2">
              Conteúdo
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold">Últimos artigos</h2>
          </div>
          <Link
            href="/blog"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm text-[#A100FF] font-semibold hover:gap-3 transition-all"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {recent.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-[#A100FF]/30 hover:bg-[#A100FF]/5 transition-all duration-300"
            >
              {/* Cover gradient */}
              <div className={`h-32 bg-gradient-to-br ${post.coverGradient}`} />

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      categoryColors[post.category] ?? 'text-white/60 bg-white/10'
                    }`}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs text-[#71717A]">{post.readTime} min</span>
                </div>

                <h3 className="font-bold text-white text-sm leading-snug mb-3 line-clamp-2 group-hover:text-[#A100FF] transition-colors">
                  {post.title}
                </h3>

                <p className="text-[#A1A1AA] text-xs leading-relaxed line-clamp-2 flex-1 mb-4">
                  {post.excerpt}
                </p>

                <p className="text-xs text-[#71717A]">{formatDate(post.date)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
