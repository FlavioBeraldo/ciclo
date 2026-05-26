import type { MetadataRoute } from 'next'
import { getAllWpSlugs } from '@/lib/blog'
import { getAllServicoSlugs } from '@/lib/servicos'
import { getAllSolucaoSlugs } from '@/lib/solucoes'

const BASE = 'https://cicloecommerce.com.br'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                                    lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/consultoria-para-e-commerce`,   lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/tiktok-shop`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/blog`,                          lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/depoimentos`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/mapa-do-site`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ]

  // ── Soluções (/solucoes/[slug]) ───────────────────────────────────────────
  const solucaoPages: MetadataRoute.Sitemap = getAllSolucaoSlugs().map((slug) => ({
    url: `${BASE}/solucoes/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  // ── Serviços (/servicos/[slug]) ───────────────────────────────────────────
  const servicoPages: MetadataRoute.Sitemap = getAllServicoSlugs().map((slug) => ({
    url: `${BASE}/servicos/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // ── Blog posts (/blog/[slug]) ─────────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = getAllWpSlugs().map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...staticPages, ...solucaoPages, ...servicoPages, ...blogPages]
}
