import { createReader } from '@keystatic/core/reader'
import * as Markdoc from '@markdoc/markdoc'
import type { Node as MarkdocNode } from '@markdoc/markdoc'
import config from '../../keystatic.config'

const reader = createReader(process.cwd(), config)

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
    return await reader.collections.posts.list()
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
        if (!entry) return null
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
    if (!entry) return null

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
