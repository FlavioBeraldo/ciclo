import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // `/_next/static/` precisa ser liberado explicitamente. O `Disallow:
        // /_next/` abaixo bloqueia fonte, CSS e JS, e foi o que apareceu no
        // Search Console como quatro arquivos de fonte bloqueados em
        // `_next/static/media`.
        //
        // O bloqueio é fato; o efeito dele na renderização NÃO foi medido —
        // ninguém viu o render anterior do Googlebot. A razão de liberar é a
        // orientação do próprio Google, de não bloquear recurso necessário
        // para renderizar, e não um prejuízo comprovado.
        //
        // `/_next/image` é o otimizador de imagem do Next, e é por ele que
        // passam TODAS as imagens do site: 212 referências na home (logos das
        // marcas) e 8 no blog. Sem liberar, o `Disallow: /_next/` bloqueia a
        // imagem inteira do site, não só as fontes.
        //
        // Allow mais específico ganha de Disallow mais genérico, então o resto
        // de `/_next/` (chunks internos, dados de build) continua fora.
        allow: ['/', '/_next/static/', '/_next/image'],
        disallow: ['/api/', '/obrigado', '/_next/', '/static/', '/keystatic'],
      },
    ],
    sitemap: [
      'https://cicloecommerce.com.br/sitemap.xml',
      'https://cicloecommerce.com.br/sitemap-v2.xml',
    ],
  }
}
