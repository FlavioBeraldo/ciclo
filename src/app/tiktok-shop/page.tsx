import type { Metadata } from 'next'
import CicloHeader from '@/components/ciclo/CicloHeader'
import CicloFooter from '@/components/ciclo/CicloFooter'
import Contato from '@/components/ciclo/Contato'
import Breadcrumb from '@/components/ciclo/interior/Breadcrumb'
import Faq from '@/components/ciclo/interior/Faq'
import Frentes from '@/components/ciclo/tiktok/Frentes'
import Roadmap from '@/components/ciclo/tiktok/Roadmap'
import {
  HERO,
  PILARES,
  CONVERSAO,
  NUMEROS,
  FAQ,
  CTA_FINAL,
} from '@/components/ciclo/tiktok/conteudo'
import { playfair2026 } from '@/components/ciclo/fonts'
import '@/components/ciclo/base.css'
import '@/components/ciclo/interiors.css'
import '@/components/ciclo/tiktok.css'
// Depois de tiktok.css de propósito: as regras do tratamento editorial
// sobrepõem as antigas pela ordem, sem `!important` e sem tocar no arquivo
// compartilhado.
import '@/components/ciclo/tiktok/tiktok-editorial.css'
import { Seta } from '@/components/ciclo/Seta'

export const metadata: Metadata = {
  title: 'Agência TikTok Shop | Gestão e Escala no Social Commerce — Ciclo E-commerce',
  description:
    'Agência especializada em TikTok Shop no Brasil. Gerenciamos sua operação completa: cadastro, creators, GMV Max, TikTok Ads e social commerce. Mais de 300 marcas atendidas.',
  keywords: [
    'agência TikTok Shop',
    'gestão TikTok Shop',
    'TikTok Shop Brasil',
    'TikTok Shop para e-commerce',
    'social commerce TikTok',
    'discovery commerce',
    'TikTok Ads',
    'GMV Max',
    'creators TikTok Shop',
    'como vender no TikTok Shop',
    'TikTok Shop agência especializada',
    'TikTok Shop para marcas',
    'e-commerce TikTok',
    'Ciclo E-commerce TikTok Shop',
  ],
  openGraph: {
    title: 'Agência TikTok Shop | Gestão e Escala no Social Commerce — Ciclo E-commerce',
    description:
      'Agência especializada em TikTok Shop no Brasil. Creators, GMV Max, TikTok Ads e social commerce para marcas que querem escalar.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ciclo E-commerce',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agência TikTok Shop | Ciclo E-commerce',
    description: 'Agência especializada em TikTok Shop no Brasil. Gestão completa: creators, GMV Max, TikTok Ads e social commerce.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cicloecommerce.com.br/tiktok-shop' },
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Gestão de TikTok Shop',
  serviceType: 'Social Commerce / Marketing Digital',
  description:
    'Serviço especializado em TikTok Shop: setup e integração da loja, gestão de creators, campanhas GMV Max, TikTok Ads e operação de social commerce para e-commerces.',
  provider: {
    '@type': 'Organization',
    name: 'Ciclo E-commerce',
    url: 'https://cicloecommerce.com.br',
    logo: 'https://cicloecommerce.com.br/logo-ciclo.png',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Brazil',
  },
  url: 'https://cicloecommerce.com.br/tiktok-shop',
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    url: 'https://cicloecommerce.com.br/tiktok-shop#contato',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://cicloecommerce.com.br',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'TikTok Shop',
      item: 'https://cicloecommerce.com.br/tiktok-shop',
    },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  // Derivado da MESMA constante FAQ que o accordion exibe, como já é feito nas
  // páginas de serviço e de solução.
  //
  // Antes o schema era escrito à mão aqui, em fonte separada, e cinco das seis
  // respostas já divergiam do texto visível. Duas fontes para o mesmo FAQ só
  // tinham como divergir mais a cada edição — e divergiram, quando a pergunta
  // nova entrou só em um lado. Nenhuma pergunta ou resposta VISÍVEL mudou com
  // isso: o que mudou é de onde o schema lê.
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

// /tiktok-shop no design 2026.
//
// Um detalhe que melhorou: os três JSON-LD eram injetados por next/script com
// a estratégia padrão, isto é, só depois que o JavaScript roda — não estavam
// no HTML servido. Agora são <script> comuns, renderizados no servidor. O
// conteúdo dos três é idêntico ao de antes.
//
// O que NÃO mudou: a URL, a metadata, o canonical, os três JSON-LD acima e
// todo o texto da página — incluindo as perguntas do FAQ, que o Flávio
// confirmou que precisam ficar por causa do SEO. Eram seis; em 19/10 entrou
// uma complementar, e nenhuma das seis mudou.
//
// O que mudou: a casca e a ordem. Abertura com CTA, visão da operação
// integrada, as quatro frentes com os entregáveis reais, o conteúdo educativo
// e os números e o roadmap que já existiam, FAQ e contato. Os cinco cartões
// iguais de serviço viraram quatro frentes de uma operação só.
export default function TikTokShopPage() {
  return (
    <div className={`ciclo2026 ${playfair2026.variable}`}>
      <script
        id="tiktok-shop-service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        id="tiktok-shop-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        id="tiktok-shop-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="inner service-page">
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>

        <CicloHeader />

        <main id="conteudo">
          {/* ── 1. Abertura ── */}
          <section className="inner-hero">
            <div className="wrap narrow">
              <Breadcrumb
                etapas={[{ rotulo: 'Início', href: '/' }, { rotulo: 'TikTok Shop' }]}
              />

              <h1>
                <span className="eyebrow h1-kicker">
                  <span />
                  Agência TikTok Shop
                </span>
                {HERO.titulo}
              </h1>

              <p className="inner-signature">{HERO.selo}</p>

              <p className="inner-lead">{HERO.lead}</p>

              <div className="inner-actions">
                <a className="button" href="#contato">
                  <span>{HERO.ctaPrimario}</span>
                  <b aria-hidden="true"><Seta /></b>
                </a>
                <a href="#ecossistema" className="textlink">
                  {HERO.ctaSecundario} <span>↓</span>
                </a>
              </div>

              <div className="tts-hero-numeros">
                {HERO.numeros.map((n) => (
                  <div key={n.rotulo}>
                    <strong>{n.valor}</strong>
                    <span>{n.rotulo}</span>
                  </div>
                ))}
              </div>

              <nav className="section-index" aria-label="Nesta página">
                <a href="#ecossistema">O ecossistema</a>
                <a href="#frentes">As quatro frentes</a>
                <a href="#numeros">Números</a>
                <a href="#roadmap">Roadmap</a>
                <a href="#faq">Perguntas frequentes</a>
              </nav>
            </div>
          </section>

          {/* ── 2. Visão da operação integrada ── */}
          <section className="inner-section paper" id="ecossistema">
            <div className="wrap narrow">
              <div className="inner-section-heading">
                <div className="eyebrow">
                  <span />
                  Entenda o ecossistema
                </div>

                <h2>O TikTok é muito mais do que entretenimento</h2>

                <p className="tts-frentes-lead">
                  Antes de falar sobre TikTok Shop, é importante conhecer os três pilares da
                  plataforma.
                </p>
              </div>

              <div className="tts-pilares">
                {PILARES.map((p) => (
                  <div key={p.titulo}>
                    <h3>{p.titulo}</h3>
                    <p>{p.texto}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 3. As quatro frentes ── */}
          <Frentes />

          {/* ── 4a. Conteúdo educativo: conversão e jornada ── */}
          <section className="inner-section paper" id="conversao">
            <div className="wrap narrow">
              <div className="tts-conversao">
                <div>
                  <div className="eyebrow">
                    <span />
                    {CONVERSAO.eyebrow}
                  </div>

                  <h2>{CONVERSAO.titulo}</h2>

                  <p className="tts-frentes-lead">{CONVERSAO.texto}</p>

                  <div className="tts-barras">
                    {CONVERSAO.barras.map((b) => (
                      <div key={b.rotulo}>
                        <div className="tts-barra-topo">
                          <span>{b.rotulo}</span>
                          <b>{b.valor}</b>
                        </div>
                        <div className="tts-barra-trilho">
                          <div
                            className={`tts-barra-valor${b.proporcao < 50 ? ' fraca' : ''}`}
                            style={{ width: `${b.proporcao}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="eyebrow">
                    <span />
                    Processo de compra no TikTok Shop
                  </div>

                  <ol className="tts-jornada">
                    {CONVERSAO.jornada.map((j) => (
                      <li key={j.numero}>
                        <small>{j.numero}</small>
                        <span>{j.rotulo}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </section>

          {/* ── 4b. Big numbers ── */}
          <div className="section-fade paper-dark" aria-hidden="true" />

          <section className="inner-section dark outcome-section" id="numeros">
            <div className="wrap narrow">
              <div className="inner-section-heading">
                <div className="eyebrow">
                  <span />
                  {NUMEROS.eyebrow}
                </div>

                <h2>{NUMEROS.titulo}</h2>

                <p className="tts-frentes-lead">{NUMEROS.lead}</p>
              </div>

              <div className="tts-numeros-grid">
                <div className="destaque">
                  <strong>{NUMEROS.destaque.valor}</strong>
                  <p>{NUMEROS.destaque.rotulo}</p>
                </div>
                {NUMEROS.cartoes.map((c) => (
                  <div key={c.valor + c.rotulo}>
                    <strong>{c.valor}</strong>
                    <p>{c.rotulo}</p>
                    {c.fonte && <em>{c.fonte}</em>}
                  </div>
                ))}
              </div>

              <div className="tts-nota">
                <h3>{NUMEROS.nota.titulo}</h3>
                <p>{NUMEROS.nota.texto}</p>
              </div>
            </div>
          </section>

          <div className="section-fade dark-white" aria-hidden="true" />

          {/* ── 4c. Roadmap: implantação e operação contínua ── */}
          <Roadmap />

          {/* ── 5. FAQ ── */}
          <Faq perguntas={FAQ} titulo="Perguntas sobre gestão de TikTok Shop" />

          {/* ── 6. Chamada final e contato ── */}
          <section className="inner-section">
            <div className="wrap narrow">
              <div className="tts-cta">
                <div className="eyebrow">
                  <span />
                  {CTA_FINAL.eyebrow}
                </div>

                <h2>{CTA_FINAL.titulo}</h2>

                <p>{CTA_FINAL.texto}</p>

                <a className="button" href="#contato">
                  <span>{CTA_FINAL.botao}</span>
                  <b aria-hidden="true"><Seta /></b>
                </a>
              </div>
            </div>
          </section>

          <div className="section-fade paper-dark" aria-hidden="true" />

          <Contato />
        </main>

        <CicloFooter />
      </div>
    </div>
  )
}
