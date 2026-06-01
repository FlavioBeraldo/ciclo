import type { Metadata } from 'next'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TikTokShopContent from './interactive'

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
  mainEntity: [
    {
      '@type': 'Question',
      name: 'O que é TikTok Shop e como funciona para e-commerces?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TikTok Shop é o canal de social commerce do TikTok que permite vender diretamente dentro da plataforma. Para e-commerces, funciona como uma loja integrada ao feed de conteúdo: os produtos aparecem em vídeos, lives e vitrine da marca, e o usuário compra sem sair do app. É o modelo de Discovery Commerce — a venda acontece antes que o consumidor perceba que estava comprando.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quais marcas e e-commerces se beneficiam mais do TikTok Shop?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Marcas de beleza, moda, saúde, casa e alimentação têm os melhores resultados, especialmente as que vendem produtos com apelo visual ou que se beneficiam de demonstração em vídeo. E-commerces com ticket médio entre R$30 e R$300 e que já possuem presença digital tendem a escalar mais rápido. A Ciclo atende desde marcas em fase inicial no TikTok até operações consolidadas que querem aumentar o GMV.',
      },
    },
    {
      '@type': 'Question',
      name: 'A Ciclo E-commerce faz toda a gestão do TikTok Shop?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. A Ciclo oferece gestão completa do TikTok Shop: setup e integração da loja, curadoria e gestão de creators e afiliados, criação de conteúdo otimizado para conversão, campanhas GMV Max, TikTok Ads e análise contínua de performance. A operação é gerenciada de ponta a ponta — seu time não precisa aprender a plataforma do zero.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual a diferença entre TikTok Ads e TikTok Shop?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TikTok Ads é a plataforma de mídia paga do TikTok — você investe em anúncios para gerar tráfego e conversões. TikTok Shop é o canal de social commerce nativo onde os produtos são vendidos diretamente dentro do app via conteúdo orgânico, lives e creators. A maior potência está na combinação: TikTok Shop como canal de vendas e TikTok Ads (especialmente GMV Max) para escalar o volume de pedidos.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como funciona a gestão de creators e afiliados no TikTok Shop?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Ciclo identifica creators alinhados ao seu nicho via TikTok Creator Marketplace, negocia parcerias, orienta a criação de conteúdo e acompanha a performance de cada creator. Para afiliados, estruturamos o programa de comissões, recrutamos os criadores certos e gerenciamos o relacionamento. O objetivo é construir um ecossistema de conteúdo que gere vendas de forma consistente.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quanto tempo leva para ter resultados no TikTok Shop?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Os primeiros resultados aparecem nas primeiras 4 a 8 semanas — fase de setup, integração, onboarding de creators e primeiros testes de conteúdo. A escala consistente costuma acontecer entre 2 e 4 meses, quando já há dados suficientes de creators, produtos e formatos para otimizar a operação. O tempo varia conforme o nicho, o ticket médio e a agilidade da marca em produzir conteúdo.',
      },
    },
  ],
}

export default function TikTokShopPage() {
  return (
    <main>
      <Script
        id="tiktok-shop-service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Script
        id="tiktok-shop-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="tiktok-shop-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />
      <TikTokShopContent />
      <Footer />
    </main>
  )
}
