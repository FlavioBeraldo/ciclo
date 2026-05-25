import type { NextConfig } from 'next'
import wpSlugs from './src/data/wp-slugs.json'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  async redirects() {
    const wpRedirects = (wpSlugs as string[]).map((slug) => ({
      source: `/${slug}/`,
      destination: `/blog/${slug}`,
      permanent: true,
    }))
    const wpRedirectsNoTrail = (wpSlugs as string[]).map((slug) => ({
      source: `/${slug}`,
      destination: `/blog/${slug}`,
      permanent: true,
    }))
    return [
      // Consultoria page redirect
      {
        source: '/consultoria-para-e-commerce-cresca-sua-operacao-de-forma-estrategica-e-sustentavel',
        destination: '/consultoria-para-e-commerce',
        permanent: true,
      },
      {
        source: '/consultoria-para-e-commerce-cresca-sua-operacao-de-forma-estrategica-e-sustentavel/',
        destination: '/consultoria-para-e-commerce',
        permanent: true,
      },
      // WordPress blog post redirects
      ...wpRedirects,
      ...wpRedirectsNoTrail,
    ]
  },
}

export default nextConfig
