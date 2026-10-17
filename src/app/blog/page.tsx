import type { Metadata } from 'next'
import Link from 'next/link'
import { posts, getWpPosts, formatDate, resolveCategory } from '@/lib/blog'
import { getKeystatiPosts } from '@/lib/keystatic-posts'
import CicloHeader from '@/components/ciclo/CicloHeader'
import CicloFooter from '@/components/ciclo/CicloFooter'
import Breadcrumb from '@/components/ciclo/interior/Breadcrumb'
import '@/components/ciclo/base.css'
import '@/components/ciclo/interiors.css'

// ISR: novos artigos (e agendados no Keystatic) entram na listagem sozinhos
export const revalidate = 900

export const metadata: Metadata = {
  title: 'Blog de E-commerce | Estratégias de Full Funnel Marketing e Growth | Ciclo',
  description:
    'Artigos sobre Full Funnel Marketing, CAC, LTV, CRM, TikTok Shop e crescimento sustentável para e-commerce. Estratégias usadas por mais de 300 marcas.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cicloecommerce.com.br/blog' },
}

const PAGE_SIZE = 24

// Listagem do blog no design 2026.
//
// A filtragem e a paginação continuam no servidor, com os mesmos parâmetros
// `cat` e `page` de antes: são URLs que o Google já conhece e que renderizam
// sem JavaScript. O kit faz isso no navegador, lendo um índice JSON; não
// adotei, porque trocaria 36 páginas rastreáveis por uma só que depende de JS.
// A busca do kit entra como `q`, também no servidor, e o canonical de todas as
// variantes segue apontando para /blog, como já apontava.
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; cat?: string; q?: string }>
}) {
  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.page ?? '1', 10))
  const categoriaAtiva = sp.cat ?? ''
  const busca = (sp.q ?? '').trim()

  const wpPosts = getWpPosts()
  const keystatiPosts = await getKeystatiPosts()
  const [destaque, ...curados] = posts

  const todos = [
    ...keystatiPosts.map((p) => ({ ...p, category: resolveCategory(p.category, p.title, p.excerpt) })),
    ...curados.map((p) => ({ ...p, category: resolveCategory(p.category, p.title, p.excerpt) })),
    ...wpPosts.map((p) => ({ ...p, category: resolveCategory(p.category, p.title, p.excerpt) })),
  ].sort((a, b) => b.date.localeCompare(a.date))

  const categorias = [...new Set(todos.map((p) => p.category))].sort()

  // Busca sem acento e sem diferença de caixa, no título, no resumo e na categoria
  const normalizar = (s: string) =>
    s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  const alvo = normalizar(busca)

  const filtrados = todos.filter(
    (p) =>
      (!categoriaAtiva || p.category === categoriaAtiva) &&
      (!alvo || normalizar(`${p.title} ${p.excerpt} ${p.category}`).includes(alvo))
  )

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE))
  const paginaAtual = Math.min(page, totalPaginas)
  const fatia = filtrados.slice((paginaAtual - 1) * PAGE_SIZE, paginaAtual * PAGE_SIZE)

  const destaqueResolvido = {
    ...destaque,
    category: resolveCategory(destaque.category, destaque.title, destaque.excerpt),
  }
  // O destaque só aparece na primeira página sem filtro nem busca, como antes
  const mostrarDestaque = paginaAtual === 1 && !categoriaAtiva && !busca

  function href(p: number, cat = categoriaAtiva) {
    const params = new URLSearchParams()
    if (cat) params.set('cat', cat)
    if (busca) params.set('q', busca)
    if (p > 1) params.set('page', String(p))
    const q = params.toString()
    return q ? `/blog?${q}` : '/blog'
  }

  // Primeira, última, atual e as vizinhas — o resto vira reticência
  const paginas = [...new Set([1, paginaAtual - 1, paginaAtual, paginaAtual + 1, totalPaginas])]
    .filter((n) => n >= 1 && n <= totalPaginas)
    .sort((a, b) => a - b)

  return (
    <div className="ciclo2026">
      <div className="inner blog-page">
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>

        <CicloHeader />

        <main id="conteudo">
          <section className="inner-hero blog-hero">
            <div className="wrap narrow">
              <Breadcrumb etapas={[{ rotulo: 'Início', href: '/' }, { rotulo: 'Blog' }]} />

              <div className="eyebrow">
                <span />
                Ciclo Insights
              </div>

              <div className="blog-title-row">
                <h1>
                  Estratégias que geram
                  <br />
                  <em>crescimento real.</em>
                </h1>

                <p>
                  {todos.length + 1} artigos sobre Full Funnel Marketing, performance, CRM e
                  crescimento sustentável.
                </p>
              </div>
            </div>
          </section>

          {mostrarDestaque && (
            <section className="blog-feature wrap narrow">
              <Link href={`/blog/${destaqueResolvido.slug}`} className="feature-link">
                <div>
                  <div className="eyebrow">
                    <span />
                    Leitura em destaque
                  </div>

                  <h2>{destaqueResolvido.title}</h2>

                  <p>{destaqueResolvido.excerpt}</p>

                  <span className="read-more">
                    Ler artigo <b>↗</b>
                  </span>
                </div>

                <div className="feature-orbit" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <strong>
                    Ideias que
                    <br />
                    <em>movem marcas.</em>
                  </strong>
                </div>
              </Link>
            </section>
          )}

          <section className="inner-section paper blog-archive" id="artigos">
            <div className="wrap narrow">
              <div className="archive-toolbar">
                <h2>Explore o conteúdo.</h2>

                {/* Busca por GET: funciona sem JavaScript e mantém a URL legível */}
                <form className="search-field" role="search" action="/blog">
                  <label htmlFor="blog-search">Buscar artigos</label>
                  <input
                    id="blog-search"
                    name="q"
                    type="search"
                    placeholder="O que você quer aprender?"
                    defaultValue={busca}
                    autoComplete="off"
                  />
                  {categoriaAtiva && <input type="hidden" name="cat" value={categoriaAtiva} />}
                  <b aria-hidden="true">⌕</b>
                </form>
              </div>

              <div className="category-tabs" aria-label="Categorias">
                <Link href={href(1, '')} aria-current={!categoriaAtiva ? 'true' : undefined}>
                  Todos
                </Link>
                {categorias.map((cat) => (
                  <Link
                    key={cat}
                    href={href(1, cat)}
                    aria-current={categoriaAtiva === cat ? 'true' : undefined}
                  >
                    {cat}
                  </Link>
                ))}
              </div>

              <p id="blog-status" aria-live="polite">
                {filtrados.length} {filtrados.length === 1 ? 'artigo' : 'artigos'}
                {busca ? ` para “${busca}”` : ''}
                {categoriaAtiva ? ` em ${categoriaAtiva}` : ''}
              </p>

              {fatia.length === 0 ? (
                <div className="empty-state">
                  <h3>Nenhum artigo encontrado.</h3>
                  <p>Experimente outro termo ou veja todas as categorias.</p>
                  <Link className="textlink" href="/blog">
                    Ver todos os artigos <span>↗</span>
                  </Link>
                </div>
              ) : (
                <div className="article-grid">
                  {fatia.map((post) => (
                    <Link className="article-card" href={`/blog/${post.slug}`} key={post.slug}>
                      <div className="article-card-top">
                        <span>{post.category}</span>
                        <b>↗</b>
                      </div>

                      <h3>{post.title}</h3>

                      <p>{post.excerpt}</p>

                      <div className="article-card-foot">
                        <span>{formatDate(post.date)}</span>
                        <span>
                          {'readTime' in post
                            ? post.readTime
                            : Math.max(
                                1,
                                Math.round(
                                  post.html.replace(/<[^>]+>/g, ' ').split(/\s+/).length / 200
                                )
                              )}{' '}
                          min de leitura
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {totalPaginas > 1 && (
                <nav className="pagination" aria-label="Páginas do blog">
                  {paginaAtual > 1 && <Link href={href(paginaAtual - 1)}>← Anterior</Link>}
                  {paginas.map((n, i) => (
                    <span key={n} style={{ display: 'contents' }}>
                      {i > 0 && n - paginas[i - 1] > 1 && <span aria-hidden="true">…</span>}
                      <Link href={href(n)} aria-current={n === paginaAtual ? 'page' : undefined}>
                        {n}
                      </Link>
                    </span>
                  ))}
                  {paginaAtual < totalPaginas && (
                    <Link href={href(paginaAtual + 1)}>Próxima →</Link>
                  )}
                </nav>
              )}
            </div>
          </section>
        </main>

        <CicloFooter />
      </div>
    </div>
  )
}
