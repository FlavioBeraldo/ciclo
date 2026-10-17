import type { Metadata } from 'next'
import Link from 'next/link'
import CicloHeader from '@/components/ciclo/CicloHeader'
import CicloFooter from '@/components/ciclo/CicloFooter'
import Breadcrumb from '@/components/ciclo/interior/Breadcrumb'
import { playfair2026 } from '@/components/ciclo/fonts'
import '@/components/ciclo/base.css'
import '@/components/ciclo/interiors.css'

export const metadata: Metadata = {
  title: 'Mapa do Site | Ciclo E-commerce',
  description: 'Todas as páginas do site da Ciclo E-commerce organizadas por categoria.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cicloecommerce.com.br/mapa-do-site' },
}

const sections = [
  {
    heading: 'Páginas principais',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Blog', href: '/blog' },
      { label: 'Depoimentos', href: '/depoimentos' },
    ],
  },
  {
    heading: 'Serviços especializados',
    links: [
      { label: 'TikTok Shop & Social Commerce', href: '/tiktok-shop' },
      { label: 'Consultoria para E-commerce', href: '/consultoria-para-e-commerce' },
    ],
  },
  {
    heading: 'Soluções de marketing',
    links: [
      { label: 'Geração de Demanda', href: '/solucoes/geracao-de-demanda' },
      { label: 'Captação de Demanda', href: '/solucoes/captacao-de-demanda' },
      { label: 'Expansão de Demanda', href: '/solucoes/expansao-de-demanda' },
      { label: 'Inteligência & Operação', href: '/solucoes/inteligencia-e-operacao' },
    ],
  },
  {
    heading: 'Geração de Demanda — serviços',
    links: [
      { label: 'TikTok Shop (Social Commerce)', href: '/tiktok-shop' },
      { label: 'Gestão de Creators e Influenciadores', href: '/servicos/gestao-creators-influenciadores' },
      { label: 'Agência de UGC para E-commerce', href: '/servicos/agencia-ugc' },
    ],
  },
  {
    heading: 'Captação de Demanda — serviços',
    links: [
      { label: 'Creative Strategy', href: '/servicos/creative-strategy' },
      { label: 'Google Ads', href: '/servicos/google-ads' },
      { label: 'Bing Ads', href: '/servicos/bing-ads' },
      { label: 'Meta Ads', href: '/servicos/meta-ads' },
      { label: 'TikTok Ads', href: '/servicos/tiktok-ads' },
      { label: 'Mídia Programática', href: '/servicos/programatica' },
      { label: 'Pinterest Ads', href: '/servicos/pinterest-ads' },
      { label: 'Mercado Livre Ads', href: '/servicos/mercado-livre-ads' },
      { label: 'Shopee Ads', href: '/servicos/shopee-ads' },
      { label: 'Amazon Ads', href: '/servicos/amazon-ads' },
    ],
  },
  {
    heading: 'Expansão de Demanda — serviços',
    links: [
      { label: 'CRM: E-mail, SMS, Push, WhatsApp', href: '/servicos/crm-email-sms-push-whatsapp' },
      { label: 'Réguas de automação personalizadas', href: '/servicos/reguas-automacao-personalizadas' },
      { label: 'Reativação e programas de fidelização', href: '/servicos/reativacao-fidelizacao' },
      { label: 'Programas de indicação / Reviews', href: '/servicos/programas-indicacao-reviews' },
    ],
  },
  {
    heading: 'Inteligência & Operação — serviços',
    links: [
      { label: 'Analytics & BI', href: '/servicos/analytics-bi' },
    ],
  },
]

// Mapa do site no design 2026. Os grupos e os links são exatamente os mesmos;
// o que muda é a casca. O kit usa cartões grandes com ícone para esta página;
// aqui as listas continuam listas, porque são 26 links e o cartão grande
// transformaria a página numa rolagem longa sem ganho nenhum.
export default function MapaDoSite() {
  return (
    <div className={`ciclo2026 ${playfair2026.variable}`}>
      <div className="inner legal-page">
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>

        <CicloHeader />

        <main id="conteudo">
          <section className="inner-hero">
            <div className="wrap narrow">
              <Breadcrumb etapas={[{ rotulo: 'Início', href: '/' }, { rotulo: 'Mapa do site' }]} />

              <h1>
                <span className="eyebrow h1-kicker">
                  <span />
                  Mapa do Site
                </span>
                Todas as conexões
                <br />
                <em>para crescer.</em>
              </h1>

              <p className="inner-lead">
                Todas as páginas e seções do site da Ciclo E-commerce organizadas por categoria.
              </p>
            </div>
          </section>

          <section className="inner-section paper">
            <div className="wrap narrow">
              <div className="mapa-grupos">
                {sections.map((section) => (
                  <div className="mapa-grupo" key={section.heading}>
                    <h2>{section.heading}</h2>
                    <ul>
                      {section.links.map(({ label, href }) => (
                        <li key={href + label}>
                          <Link href={href}>
                            {label}
                            <b aria-hidden="true">↗</b>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="inner-section">
            <div className="wrap narrow">
              <div className="tts-cta">
                <h2>Precisa de algo específico? Fale com um especialista.</h2>
                <Link className="button" href="/#contato">
                  <span>Entrar em contato</span>
                  <b aria-hidden="true">↗</b>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <CicloFooter />
      </div>
    </div>
  )
}
