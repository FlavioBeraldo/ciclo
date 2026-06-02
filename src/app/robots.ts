import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/obrigado', '/_next/', '/static/'],
      },
    ],
    sitemap: [
      'https://cicloecommerce.com.br/sitemap.xml',
      'https://cicloecommerce.com.br/sitemap-v2.xml',
    ],
  }
}
