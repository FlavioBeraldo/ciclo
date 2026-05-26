import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/obrigado'],
      },
    ],
    sitemap: 'https://cicloecommerce.com.br/sitemap.xml',
  }
}
