import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import {
  getPostBySlug,
  getWpPostBySlug,
  getAllSlugs,
  getAllWpSlugs,
  posts,
  getWpPosts,
  formatDate,
  resolveCategory,
  supersededWpPosts,
  type BlogSection,
} from '@/lib/blog'
import {
  getAllKeystatiSlugs,
  getKeystatiPostBySlug,
  getKeystatiPosts,
} from '@/lib/keystatic-posts'
import CicloHeader from '@/components/ciclo/CicloHeader'
import CicloFooter from '@/components/ciclo/CicloFooter'
import Breadcrumb from '@/components/ciclo/interior/Breadcrumb'
import { comSumario, type ItemDeSumario } from '@/components/ciclo/blog/sumario'
import '@/components/ciclo/base.css'
import '@/components/ciclo/interiors.css'

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

// Os posts curados vêm em blocos estruturados, não em HTML
function Bloco({ secao, id }: { secao: BlogSection; id?: string }) {
  switch (secao.type) {
    case 'paragraph':
      return <p>{secao.text}</p>
    case 'heading':
      return <h2 id={id}>{secao.text}</h2>
    case 'subheading':
      return <h3>{secao.text}</h3>
    case 'list':
      return (
        <ul>
          {secao.items?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )
    case 'highlight':
      return (
        <blockquote>
          <p>{secao.text}</p>
        </blockquote>
      )
    case 'divider':
      return <hr />
    case 'ctaCard':
      return (
        <div className="article-cta">
          <h2>{secao.text}</h2>
          <Link className="button" href={secao.ctaHref ?? '/'}>
            <span>{secao.ctaLabel}</span>
            <b aria-hidden="true">↗</b>
          </Link>
        </div>
      )
    default:
      return null
  }
}

// Artigo no design 2026.
//
// Tudo que é conteúdo e SEO continua igual: as três fontes (curados, acervo
// WordPress e Keystatic), o redirecionamento 308 dos posts substituídos, a
// metadata, o canonical e os dois JSON-LD, Article e FAQPage. O layout passa a
// ser o do kit — capa editorial, sumário fixo à esquerda, corpo largo —, e os
// `h2` ganham `id` para o sumário funcionar.
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  // Post antigo substituído: redireciona (308) para o artigo novo assim que
  // ele estiver publicado; enquanto o novo está agendado, o antigo segue no ar.
  const successor = supersededWpPosts[slug]
  if (successor && (await getKeystatiPostBySlug(successor))) {
    permanentRedirect(`/blog/${successor}`)
  }

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

  // Corpo do artigo e sumário, conforme a fonte
  let corpoHtml: string | null = null
  let sumario: ItemDeSumario[] = []
  if (curated) {
    let n = 0
    sumario = curated.content
      .filter((s) => s.type === 'heading' && s.text)
      .map((s) => ({ id: `secao-${++n}`, texto: s.text! }))
  } else {
    const resultado = comSumario(wp?.html ?? ks!.html)
    corpoHtml = resultado.html
    sumario = resultado.sumario
  }

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

  // Contador próprio para casar o id do heading curado com o do sumário
  let indiceDeTitulo = 0

  return (
    <div className="ciclo2026">
      <JsonLd data={articleLd} />
      {faqLd && <JsonLd data={faqLd} />}

      <div className="inner blog-page">
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>

        <CicloHeader />

        <main id="conteudo">
          <header className="article-hero wrap narrow">
            <Breadcrumb
              etapas={[
                { rotulo: 'Início', href: '/' },
                { rotulo: 'Ciclo Insights', href: '/blog' },
                { rotulo: category },
              ]}
            />

            <div className="eyebrow">
              <span />
              {category}
            </div>

            <h1>{title}</h1>

            <p className="article-deck">{excerpt}</p>

            <div className="article-byline">
              <span className="author-mark">{author.charAt(0)}</span>
              <div>
                <strong>{author}</strong>
                <p>
                  {authorRole} <span>·</span> {formatDate(date)} <span>·</span> {readTime} min de
                  leitura
                </p>
              </div>
            </div>
          </header>

          <div className="reading-layout wrap narrow">
            <aside className="article-toc">
              <span>NESTE ARTIGO</span>
              {sumario.length > 0 && (
                <nav aria-label="Seções do artigo">
                  {sumario.map((s) => (
                    <a href={`#${s.id}`} key={s.id}>
                      {s.texto}
                    </a>
                  ))}
                </nav>
              )}

              <div className="toc-contact">
                <p>
                  Do conhecimento
                  <br />
                  <em>à prática.</em>
                </p>

                <Link href="/#contato">Converse com a Ciclo ↗</Link>
              </div>
            </aside>

            <article className="article-body">
              {corpoHtml !== null ? (
                <div dangerouslySetInnerHTML={{ __html: corpoHtml }} />
              ) : (
                curated!.content.map((secao, i) => (
                  <Bloco
                    key={i}
                    secao={secao}
                    id={secao.type === 'heading' ? `secao-${++indiceDeTitulo}` : undefined}
                  />
                ))
              )}

              <div className="article-end">
                <span>Ciclo Insights</span>
                <Link href="/blog">Ver todos os artigos ↗</Link>
              </div>

              <div className="article-cta">
                <h2>
                  Leve essa estratégia
                  <br />
                  <em>para a sua marca.</em>
                </h2>

                <Link className="button" href="/#contato">
                  <span>Fale com especialista</span>
                  <b aria-hidden="true">↗</b>
                </Link>
              </div>
            </article>
          </div>

          {related.length > 0 && (
            <section className="inner-section paper">
              <div className="wrap narrow">
                <div className="inner-section-heading">
                  <div className="eyebrow">
                    <span />
                    Continue a leitura
                  </div>

                  <h2>Mais ideias para o seu e-commerce.</h2>
                </div>

                <div className="article-grid">
                  {related.map((r) => {
                    const rCat = resolveCategory(r.category, r.title, r.excerpt)
                    const rt = 'readTime' in r ? r.readTime : 5
                    return (
                      <Link className="article-card" href={`/blog/${r.slug}`} key={r.slug}>
                        <div className="article-card-top">
                          <span>{rCat}</span>
                          <b>↗</b>
                        </div>

                        <h3>{r.title}</h3>

                        <p>{r.excerpt}</p>

                        <div className="article-card-foot">
                          <span>{formatDate(r.date)}</span>
                          <span>{rt} min de leitura</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </section>
          )}
        </main>

        <CicloFooter />
      </div>
    </div>
  )
}
