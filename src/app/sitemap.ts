import type { MetadataRoute } from 'next'
import { getAllWpSlugs, getAllSlugs, supersededWpPosts } from '@/lib/blog'
import { getAllServicoSlugs } from '@/lib/servicos'
import { getAllSolucaoSlugs } from '@/lib/solucoes'
import { getAllKeystatiSlugs } from '@/lib/keystatic-posts'

const BASE = 'https://cicloecommerce.com.br'

// Revalida a cada hora para que posts agendados (publicados às 9h) entrem
// no sitemap ainda na manhã do dia de publicação.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                                   lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/consultoria-para-e-commerce`,  lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/tiktok-shop`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/blog`,                         lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/depoimentos`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/ofatorm`,                      lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/ecomshift`,                    lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/politica-de-privacidade`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE}/mapa-do-site`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ]

  const solucaoPages: MetadataRoute.Sitemap = getAllSolucaoSlugs().map((slug) => ({
    url: `${BASE}/solucoes/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  const servicoPages: MetadataRoute.Sitemap = getAllServicoSlugs().map((slug) => ({
    url: `${BASE}/servicos/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const curatedSlugs = getAllSlugs()
  const ksSlugs = await getAllKeystatiSlugs()
  // Posts antigos substituídos saem do sitemap quando o sucessor é publicado
  // (a URL antiga passa a responder redirect 308 para a nova).
  const publishedKs = new Set(ksSlugs)
  const wpSlugs = getAllWpSlugs().filter((slug) => {
    const successor = supersededWpPosts[slug]
    return !(successor && publishedKs.has(successor))
  })

  const blogPages: MetadataRoute.Sitemap = [
    ...ksSlugs.map((slug) => ({
      url: `${BASE}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...curatedSlugs.map((slug) => ({
      url: `${BASE}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...wpSlugs.map((slug) => ({
      url: `${BASE}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]

  return [...staticPages, ...solucaoPages, ...servicoPages, ...blogPages]
}
