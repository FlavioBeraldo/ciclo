import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // `/_next/static/` precisa ser liberado explicitamente. O `Disallow:
        // /_next/` abaixo bloqueava fonte, CSS e JS — foi o que apareceu no
        // Search Console como quatro arquivos de fonte bloqueados em
        // `_next/static/media`. Sem esses arquivos o Google renderiza a página
        // sem a tipografia e sem o layout, e avalia o que não é o site.
        // Allow mais específico ganha de Disallow mais genérico, então o resto
        // de `/_next/` (chunks internos, dados de build) continua fora.
        allow: ['/', '/_next/static/'],
        disallow: ['/api/', '/obrigado', '/_next/', '/static/', '/keystatic'],
      },
    ],
    sitemap: [
      'https://cicloecommerce.com.br/sitemap.xml',
      'https://cicloecommerce.com.br/sitemap-v2.xml',
    ],
  }
}
