import type { NextConfig } from 'next'
import wpSlugs from './src/data/wp-slugs.json'

const nextConfig: NextConfig = {
  output: 'standalone',
  // Os posts do Keystatic (content/blog) são lidos do filesystem em runtime
  // (listagem do blog, ISR e sitemap); sem isso eles ficam fora do trace de deploy.
  outputFileTracingIncludes: {
    '/blog': ['./content/blog/**/*'],
    '/blog/[slug]': ['./content/blog/**/*'],
    '/sitemap.xml': ['./content/blog/**/*'],
  },
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

      // ── Método (página antiga do WP; conteúdo hoje vive na consultoria) ───
      { source: '/metodo',       destination: '/consultoria-para-e-commerce', permanent: true },
      { source: '/metodo/',      destination: '/consultoria-para-e-commerce', permanent: true },
      { source: '/metodologia',  destination: '/consultoria-para-e-commerce', permanent: true },
      { source: '/metodologia/', destination: '/consultoria-para-e-commerce', permanent: true },

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
      { source: '/case/:slug*',         destination: '/depoimentos', permanent: true },

      // ── WordPress taxonomy archives (wildcard) ────────────────────────────
      { source: '/categoria/:slug*', destination: '/blog', permanent: true },
      { source: '/category/:slug*',  destination: '/blog', permanent: true },
      { source: '/tag/:slug*',       destination: '/blog', permanent: true },
      { source: '/author/:slug*',    destination: '/blog', permanent: true },

      // ── WordPress / blog pagination ───────────────────────────────────────
      { source: '/blog/page/:num*', destination: '/blog', permanent: true },
      { source: '/page/:num*',      destination: '/blog', permanent: true },

      // ── WordPress admin (security) ────────────────────────────────────────
      { source: '/wp-admin/:path*', destination: '/', permanent: true },
      { source: '/wp-login.php',    destination: '/', permanent: true },
      { source: '/wp-login',        destination: '/', permanent: true },

      // ── Marketing pages antigas (landing pages WP sem equivalente) ──────────
      { source: '/marketing-para-loja-pet-aumente-suas-vendas-com-ciclo-e-commerce',                     destination: '/', permanent: true },
      { source: '/marketing-para-loja-pet-aumente-suas-vendas-com-ciclo-e-commerce/',                    destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-moveis-aumente-suas-vendas-com-ciclo-e-commerce',               destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-moveis-aumente-suas-vendas-com-ciclo-e-commerce/',              destination: '/', permanent: true },
      { source: '/marketing-para-e-commerce-dtc-aumente-suas-vendas-com-ciclo-e-commerce',               destination: '/', permanent: true },
      { source: '/marketing-para-e-commerce-dtc-aumente-suas-vendas-com-ciclo-e-commerce/',              destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-acessorios-aumente-suas-vendas-com-ciclo-e-commerce',           destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-acessorios-aumente-suas-vendas-com-ciclo-e-commerce/',          destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-alimentacao-saudavel-aumente-suas-vendas-com-ciclo-e-commerce', destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-alimentacao-saudavel-aumente-suas-vendas-com-ciclo-e-commerce/',destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-joias-aumente-suas-vendas-com-ciclo-e-commerce',                destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-joias-aumente-suas-vendas-com-ciclo-e-commerce/',               destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-moda-potencialize-suas-vendas-com-ciclo-e-commerce',            destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-moda-potencialize-suas-vendas-com-ciclo-e-commerce/',           destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-roupas-infantis-aumente-suas-vendas-com-ciclo-e-commerce',      destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-roupas-infantis-aumente-suas-vendas-com-ciclo-e-commerce/',     destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-cosmeticos-aumente-suas-vendas-com-ciclo-e-commerce',           destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-cosmeticos-aumente-suas-vendas-com-ciclo-e-commerce/',          destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-calcados-potencialize-suas-vendas-com-ciclo-e-commerce',        destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-calcados-potencialize-suas-vendas-com-ciclo-e-commerce/',       destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-decoracao-aumente-suas-vendas-com-ciclo-e-commerce',            destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-decoracao-aumente-suas-vendas-com-ciclo-e-commerce/',           destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-moda-infantil-impulsione-suas-vendas-com-ciclo-e-commerce',     destination: '/', permanent: true },
      { source: '/marketing-para-loja-de-moda-infantil-impulsione-suas-vendas-com-ciclo-e-commerce/',    destination: '/', permanent: true },
      { source: '/marketing-para-e-commerce-transforme-suas-vendas-com-a-ciclo',                         destination: '/', permanent: true },
      { source: '/marketing-para-e-commerce-transforme-suas-vendas-com-a-ciclo/',                        destination: '/', permanent: true },
      // Shopee e Amazon Ads → Retail Media
      { source: '/gestao-de-shopee-ads-potencialize-suas-vendas-na-shopee-com-ciclo-e-commerce',         destination: '/servicos/retail-media', permanent: true },
      { source: '/gestao-de-shopee-ads-potencialize-suas-vendas-na-shopee-com-ciclo-e-commerce/',        destination: '/servicos/retail-media', permanent: true },
      { source: '/gestao-de-amazon-ads-impulsione-suas-vendas-na-amazon-com-ciclo-e-commerce',           destination: '/servicos/retail-media', permanent: true },
      { source: '/gestao-de-amazon-ads-impulsione-suas-vendas-na-amazon-com-ciclo-e-commerce/',          destination: '/servicos/retail-media', permanent: true },
      // CRM → serviço equivalente
      { source: '/crm-para-e-commerce-fidelize-seus-clientes-com-ciclo-e-commerce',                      destination: '/servicos/crm-email-sms-push-whatsapp', permanent: true },
      { source: '/crm-para-e-commerce-fidelize-seus-clientes-com-ciclo-e-commerce/',                     destination: '/servicos/crm-email-sms-push-whatsapp', permanent: true },
      // /solucao/ antiga
      { source: '/solucao/growth-crm',    destination: '/servicos/crm-email-sms-push-whatsapp', permanent: true },
      { source: '/solucao/growth-crm/',   destination: '/servicos/crm-email-sms-push-whatsapp', permanent: true },
      { source: '/solucao/growth-media',  destination: '/', permanent: true },
      { source: '/solucao/growth-media/', destination: '/', permanent: true },
      { source: '/solucao/:slug*',        destination: '/', permanent: true },

      // ── Posts de blog antigos sem conteúdo no novo site ──────────────────────
      { source: '/blog/loja-virtual-de-alimentos-saiba-por-onde-comecar',                                destination: '/blog', permanent: true },
      { source: '/blog/loja-virtual-de-alimentos-saiba-por-onde-comecar/',                               destination: '/blog', permanent: true },
      { source: '/blog/cro-solucao-para-mais-vendas',                                                    destination: '/blog', permanent: true },
      { source: '/blog/cro-solucao-para-mais-vendas/',                                                   destination: '/blog', permanent: true },
      { source: '/blog/como-encontrar-palavras-chave-que-irao-te-ajudar-a-vender-seus-produtos',         destination: '/blog', permanent: true },
      { source: '/blog/como-encontrar-palavras-chave-que-irao-te-ajudar-a-vender-seus-produtos/',        destination: '/blog', permanent: true },
      { source: '/blog/o-que-e-ctr-taxa-de-cliques',                                                     destination: '/blog', permanent: true },
      { source: '/blog/o-que-e-ctr-taxa-de-cliques/',                                                    destination: '/blog', permanent: true },
      { source: '/blog/as-4-fases-do-growth-hacking',                                                    destination: '/blog', permanent: true },
      { source: '/blog/as-4-fases-do-growth-hacking/',                                                   destination: '/blog', permanent: true },
      { source: '/blog/woocommerce-funcionalidades',                                                      destination: '/blog', permanent: true },
      { source: '/blog/woocommerce-funcionalidades/',                                                     destination: '/blog', permanent: true },
      { source: '/blog/vantagens-de-criar-uma-loja-virtual',                                             destination: '/blog', permanent: true },
      { source: '/blog/vantagens-de-criar-uma-loja-virtual/',                                            destination: '/blog', permanent: true },
      { source: '/blog/seo-x-ads',                                                                       destination: '/blog', permanent: true },
      { source: '/blog/seo-x-ads/',                                                                      destination: '/blog', permanent: true },
      { source: '/blog/como-criar-conteudos-para-redes-sociais-que-tenham-engajamento',                  destination: '/blog', permanent: true },
      { source: '/blog/como-criar-conteudos-para-redes-sociais-que-tenham-engajamento/',                 destination: '/blog', permanent: true },
      { source: '/blog/5-dicas-rapidas-para-voce-aplicar-ainda-hoje-no-seu-e-commerce',                  destination: '/blog', permanent: true },
      { source: '/blog/5-dicas-rapidas-para-voce-aplicar-ainda-hoje-no-seu-e-commerce/',                 destination: '/blog', permanent: true },
      { source: '/blog/o-guia-completo-de-como-configurar-sua-loja-na-aba-comprar-do-instagram',         destination: '/blog', permanent: true },
      { source: '/blog/o-guia-completo-de-como-configurar-sua-loja-na-aba-comprar-do-instagram/',        destination: '/blog', permanent: true },
      { source: '/blog/busca-por-voz-entenda-o-que-e',                                                   destination: '/blog', permanent: true },
      { source: '/blog/busca-por-voz-entenda-o-que-e/',                                                  destination: '/blog', permanent: true },
      { source: '/blog/saiba-como-a-sua-plataforma-pode-estar-matando-o-seu-negocio',                    destination: '/blog', permanent: true },
      { source: '/blog/saiba-como-a-sua-plataforma-pode-estar-matando-o-seu-negocio/',                   destination: '/blog', permanent: true },
      { source: '/blog/e-commerce-para-iniciantes-dando-os-primeiros-passos',                            destination: '/blog', permanent: true },
      { source: '/blog/e-commerce-para-iniciantes-dando-os-primeiros-passos/',                           destination: '/blog', permanent: true },
      { source: '/blog/saiba-como-anunciar-o-seu-e-commerce-no-youtube',                                 destination: '/blog', permanent: true },
      { source: '/blog/saiba-como-anunciar-o-seu-e-commerce-no-youtube/',                                destination: '/blog', permanent: true },
      { source: '/blog/conheca-o-reels-instagram-e-saiba-como-usar-no-seu-e-commerce',                   destination: '/blog', permanent: true },
      { source: '/blog/conheca-o-reels-instagram-e-saiba-como-usar-no-seu-e-commerce/',                  destination: '/blog', permanent: true },
      { source: '/blog/saiba-como-vender-em-marketplace',                                                destination: '/blog', permanent: true },
      { source: '/blog/saiba-como-vender-em-marketplace/',                                               destination: '/blog', permanent: true },
      { source: '/blog/blog',                                                                             destination: '/blog', permanent: true },
      { source: '/blog/blog/',                                                                            destination: '/blog', permanent: true },
      { source: '/blog/ecomshiftt.webflow.io',                                                           destination: '/blog', permanent: true },

      // ── ?amp → versão limpa ────────────────────────────────────────────────────
      { source: '/blog/tag/:slug*', has: [{ type: 'query', key: 'amp' }], destination: '/blog', permanent: true },
      { source: '/servico/:slug*',  has: [{ type: 'query', key: 'amp' }], destination: '/',     permanent: true },
      { source: '/nossos-valores',  has: [{ type: 'query', key: 'amp' }], destination: '/',     permanent: true },
      { source: '/nossos-valores/', has: [{ type: 'query', key: 'amp' }], destination: '/',     permanent: true },

      // ── Outras URLs avulsas ────────────────────────────────────────────────────
      { source: '/Siga',                                                   destination: '/',                       permanent: true },
      { source: '/termo-de-politica-de-privacidade-e-protecao-de-dados',  destination: '/politica-de-privacidade', permanent: true },
      { source: '/termo-de-politica-de-privacidade-e-protecao-de-dados/', destination: '/politica-de-privacidade', permanent: true },
      { source: '/upload/:path*',                                          destination: '/',                       permanent: true },

      // ── Podcast (slugs com emoji) ──────────────────────────────────────────────
      { source: '/podcast/:path*', destination: '/blog', permanent: true },

      // ── WordPress blog post redirects ─────────────────────────────────────
      ...wpRedirects,
      ...wpRedirectsNoTrail,
    ]
  },
}

export default nextConfig
