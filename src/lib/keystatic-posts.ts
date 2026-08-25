import { createReader } from '@keystatic/core/reader'
import * as Markdoc from '@markdoc/markdoc'
import type { Node as MarkdocNode } from '@markdoc/markdoc'
import config from '../../keystatic.config'

const reader = createReader(process.cwd(), config)

// Agendamento de publicação: posts com data futura só entram no ar às 9h da
// manhã (fuso de Brasília) do dia marcado. Como /blog lê isso a cada
// requisição e as páginas de post revalidam via ISR, não é preciso novo
// deploy a cada artigo.
const PUBLISH_HOUR_SAO_PAULO = 9

function isPublished(date: string | null | undefined): boolean {
  if (!date) return true
  const now = new Date()
  // en-CA => formato YYYY-MM-DD, comparável com a string de data do frontmatter
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
  }).format(now)
  if (date < today) return true
  if (date > today) return false
  const hour = parseInt(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      hourCycle: 'h23',
    }).format(now),
    10
  )
  return hour >= PUBLISH_HOUR_SAO_PAULO
}

export type KeystaticPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  author: string
  authorRole: string
  readTime: number
}

export type KeystaticPostWithContent = KeystaticPost & { html: string }

export async function getAllKeystatiSlugs(): Promise<string[]> {
  try {
    const slugs = await reader.collections.posts.list()
    const published = await Promise.all(
      slugs.map(async (slug) => {
        const entry = await reader.collections.posts.read(slug)
        return entry && isPublished(entry.date) ? slug : null
      })
    )
    return published.filter((s): s is string => s !== null)
  } catch {
    return []
  }
}

export async function getKeystatiPosts(): Promise<KeystaticPost[]> {
  try {
    const slugs = await reader.collections.posts.list()
    const results = await Promise.all(
      slugs.map(async (slug) => {
        const entry = await reader.collections.posts.read(slug)
        if (!entry || !isPublished(entry.date)) return null
        return {
          slug,
          title: entry.title as unknown as string,
          excerpt: entry.excerpt ?? '',
          category: entry.category,
          date: entry.date ?? new Date().toISOString().slice(0, 10),
          author: entry.author || 'Time Ciclo',
          authorRole: entry.authorRole || 'Especialistas em Full Funnel Marketing',
          readTime: entry.readTime ?? 5,
        } satisfies KeystaticPost
      })
    )
    return (results.filter(Boolean) as KeystaticPost[]).sort((a, b) =>
      b.date.localeCompare(a.date)
    )
  } catch {
    return []
  }
}

export async function getKeystatiPostBySlug(
  slug: string
): Promise<KeystaticPostWithContent | null> {
  try {
    const entry = await reader.collections.posts.read(slug, {
      resolveLinkedFiles: true,
    })
    if (!entry || !isPublished(entry.date)) return null

    const contentValue = entry.content as unknown as { node: MarkdocNode } | null
    let html = ''
    if (contentValue?.node) {
      const transformed = Markdoc.transform(contentValue.node)
      html = Markdoc.renderers.html(transformed) ?? ''
    }

    return {
      slug,
      title: entry.title as unknown as string,
      excerpt: entry.excerpt ?? '',
      category: entry.category,
      date: entry.date ?? new Date().toISOString().slice(0, 10),
      author: entry.author || 'Time Ciclo',
      authorRole: entry.authorRole || 'Especialistas em Full Funnel Marketing',
      readTime: entry.readTime ?? 5,
      html,
    }
  } catch {
    return null
  }
}
