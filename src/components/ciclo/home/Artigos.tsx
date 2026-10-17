import Link from 'next/link'
import { posts, getWpPosts, formatDate, resolveCategory } from '@/lib/blog'
import { getKeystatiPosts } from '@/lib/keystatic-posts'

// Últimos artigos. A mesclagem é a mesma da listagem do blog — Keystatic,
// curados e o acervo WordPress, ordenados por data —, para que todo artigo
// publicado entre aqui sozinho.

export default async function Artigos() {
  const [keystatiPosts, wpPosts] = [await getKeystatiPosts(), getWpPosts()]

  const recentes = [
    ...keystatiPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      readTime: p.readTime,
      category: resolveCategory(p.category, p.title, p.excerpt),
    })),
    ...posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      readTime: p.readTime,
      category: resolveCategory(p.category, p.title, p.excerpt),
    })),
    ...wpPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      // WP não tem readTime: estima por contagem de palavras (~200 ppm)
      readTime: Math.max(1, Math.round(p.html.replace(/<[^>]+>/g, ' ').split(/\s+/).length / 200)),
      category: resolveCategory(p.category, p.title, p.excerpt),
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  return (
    <section className="section articles" id="blog">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">
              <span />
              Conteúdo
            </div>

            <h2>Últimos artigos.</h2>
          </div>

          <Link className="textlink" href="/blog">
            Ver todos <span>↗</span>
          </Link>
        </div>

        <div className="article-grid">
          {recentes.map((p) => (
            <Link className="article" href={`/blog/${p.slug}`} key={p.slug}>
              <div className="article-meta">
                <span>{p.category}</span>
                <span>{p.readTime} min de leitura</span>
              </div>

              <h3>{p.title}</h3>

              <p>{p.excerpt}</p>

              <div className="article-foot">
                <span>{formatDate(p.date)}</span>
                <b>↗</b>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
