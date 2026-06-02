import { getAllWpSlugs, getAllSlugs } from '@/lib/blog'
import { getAllServicoSlugs } from '@/lib/servicos'
import { getAllSolucaoSlugs } from '@/lib/solucoes'
import { getAllKeystatiSlugs } from '@/lib/keystatic-posts'

const BASE = 'https://cicloecommerce.com.br'

export const revalidate = 86400

export async function GET() {
  const now = new Date().toISOString()

  const staticUrls = [
    { url: BASE,                                  priority: '1.0', freq: 'weekly'  },
    { url: `${BASE}/consultoria-para-e-commerce`, priority: '0.9', freq: 'monthly' },
    { url: `${BASE}/tiktok-shop`,                 priority: '0.9', freq: 'monthly' },
    { url: `${BASE}/blog`,                        priority: '0.8', freq: 'daily'   },
    { url: `${BASE}/depoimentos`,                 priority: '0.7', freq: 'monthly' },
    { url: `${BASE}/ofatorm`,                     priority: '0.8', freq: 'weekly'  },
    { url: `${BASE}/ecomshift`,                   priority: '0.9', freq: 'monthly' },
    { url: `${BASE}/politica-de-privacidade`,     priority: '0.4', freq: 'yearly'  },
    { url: `${BASE}/mapa-do-site`,                priority: '0.3', freq: 'monthly' },
  ]

  const ksSlugs = await getAllKeystatiSlugs()
  const dynamicUrls = [
    ...getAllSolucaoSlugs().map((slug) => ({ url: `${BASE}/solucoes/${slug}`, priority: '0.85', freq: 'monthly' })),
    ...getAllServicoSlugs().map((slug) => ({ url: `${BASE}/servicos/${slug}`, priority: '0.8',  freq: 'monthly' })),
    ...ksSlugs.map((slug)             => ({ url: `${BASE}/blog/${slug}`,     priority: '0.75', freq: 'monthly' })),
    ...getAllSlugs().map((slug)        => ({ url: `${BASE}/blog/${slug}`,     priority: '0.7',  freq: 'monthly' })),
    ...getAllWpSlugs().map((slug)      => ({ url: `${BASE}/blog/${slug}`,     priority: '0.6',  freq: 'yearly'  })),
  ]

  const allUrls = [...staticUrls, ...dynamicUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(({ url, priority, freq }) => `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
