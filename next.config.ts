import type { NextConfig } from 'next'
import wpSlugs from './src/data/wp-slugs.json'

const nextConfig: NextConfig = {
  output: 'standalone',
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
      // ── Consultoria (old long slug) ───────────────────────────────────────
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

      // ── /servico/ (singular) — old WordPress service pages ────────────────
      { source: '/servico/facebook-ads-para-e-commerce',          destination: '/servicos/meta-ads-tiktok-ads',              permanent: true },
      { source: '/servico/facebook-ads-para-e-commerce/',         destination: '/servicos/meta-ads-tiktok-ads',              permanent: true },
      { source: '/servico/marketing-de-conteudo-para-e-commerce', destination: '/servicos/producao-conteudo-redes-sociais',  permanent: true },
      { source: '/servico/marketing-de-conteudo-para-e-commerce/',destination: '/servicos/producao-conteudo-redes-sociais',  permanent: true },
      { source: '/servico/midia-programatica-para-e-commerce',    destination: '/servicos/programatica-pinterest-ads',       permanent: true },
      { source: '/servico/midia-programatica-para-e-commerce/',   destination: '/servicos/programatica-pinterest-ads',       permanent: true },
      { source: '/servico/woocommerce',                           destination: '/consultoria-para-e-commerce',               permanent: true },
      { source: '/servico/woocommerce/',                          destination: '/consultoria-para-e-commerce',               permanent: true },
      // catch-all for any remaining /servico/ slugs
      { source: '/servico/:slug*',                                destination: '/',                                          permanent: true },

      // ── Landing pages de serviço (não eram posts, eram páginas WP) ────────
      { source: '/meta-ads-para-e-commerce-impulsione-suas-vendas-com-ciclo-e-commerce',  destination: '/servicos/meta-ads-tiktok-ads', permanent: true },
      { source: '/meta-ads-para-e-commerce-impulsione-suas-vendas-com-ciclo-e-commerce/', destination: '/servicos/meta-ads-tiktok-ads', permanent: true },
      { source: '/tiktok-ads-para-e-commerce-transforme-suas-vendas-com-ciclo-e-commerce',  destination: '/servicos/meta-ads-tiktok-ads', permanent: true },
      { source: '/tiktok-ads-para-e-commerce-transforme-suas-vendas-com-ciclo-e-commerce/', destination: '/servicos/meta-ads-tiktok-ads', permanent: true },

      // ── /servicos/ hub (no index page in new site) ────────────────────────
      { source: '/servicos',  destination: '/', permanent: true },
      { source: '/servicos/', destination: '/', permanent: true },

      // ── /solucoes/ hub (no index page in new site) ────────────────────────
      { source: '/solucoes',  destination: '/', permanent: true },
      { source: '/solucoes/', destination: '/', permanent: true },

      // ── Company pages ─────────────────────────────────────────────────────
      { source: '/contato',           destination: '/consultoria-para-e-commerce', permanent: true },
      { source: '/contato/',          destination: '/consultoria-para-e-commerce', permanent: true },
      { source: '/contact',           destination: '/consultoria-para-e-commerce', permanent: true },
      { source: '/contact/',          destination: '/consultoria-para-e-commerce', permanent: true },
      { source: '/cultura',           destination: '/',                            permanent: true },
      { source: '/cultura/',          destination: '/',                            permanent: true },
      { source: '/sobre',             destination: '/',                            permanent: true },
      { source: '/sobre/',            destination: '/',                            permanent: true },
      { source: '/sobre-nos',         destination: '/',                            permanent: true },
      { source: '/sobre-nos/',        destination: '/',                            permanent: true },
      { source: '/quem-somos',        destination: '/',                            permanent: true },
      { source: '/quem-somos/',       destination: '/',                            permanent: true },
      { source: '/equipe',            destination: '/',                            permanent: true },
      { source: '/equipe/',           destination: '/',                            permanent: true },
      { source: '/time',              destination: '/',                            permanent: true },
      { source: '/time/',             destination: '/',                            permanent: true },
      { source: '/trabalhe-conosco',  destination: '/',                            permanent: true },
      { source: '/trabalhe-conosco/', destination: '/',                            permanent: true },
      { source: '/carreiras',         destination: '/',                            permanent: true },
      { source: '/carreiras/',        destination: '/',                            permanent: true },
      { source: '/agencia',           destination: '/',                            permanent: true },
      { source: '/agencia/',          destination: '/',                            permanent: true },

      // ── Cases / Portfolio ─────────────────────────────────────────────────
      { source: '/cases',               destination: '/depoimentos', permanent: true },
      { source: '/cases/',              destination: '/depoimentos', permanent: true },
      { source: '/cases-de-ecommerce',  destination: '/depoimentos', permanent: true },
      { source: '/cases-de-ecommerce/', destination: '/depoimentos', permanent: true },
      { source: '/portfolio',           destination: '/depoimentos', permanent: true },
      { source: '/portfolio/',          destination: '/depoimentos', permanent: true },

      // ── WordPress taxonomy archives (wildcard) ────────────────────────────
      { source: '/categoria/:slug*', destination: '/blog', permanent: true },
      { source: '/category/:slug*',  destination: '/blog', permanent: true },
      { source: '/tag/:slug*',       destination: '/blog', permanent: true },
      { source: '/author/:slug*',    destination: '/blog', permanent: true },

      // ── WordPress / blog pagination ───────────────────────────────────────
      { source: '/blog/page/:num*', destination: '/blog', permanent: true },
      { source: '/page/:num*',      destination: '/blog', permanent: true },

      // ── WordPress admin (security) ────────────────────────────────────────
      { source: '/wp-admin/:path*', destination: '/', permanent: false },
      { source: '/wp-login.php',    destination: '/', permanent: false },
      { source: '/wp-login',        destination: '/', permanent: false },

      // ── WordPress blog post redirects ─────────────────────────────────────
      ...wpRedirects,
      ...wpRedirectsNoTrail,
    ]
  },
}

export default nextConfig
