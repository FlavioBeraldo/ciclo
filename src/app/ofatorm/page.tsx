import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import OFatorMInteractive from './interactive'

export const metadata: Metadata = {
  title: 'O Fator M | Podcast de Marketing e E-commerce | Ciclo E-commerce',
  description:
    'O Fator M é o podcast da Ciclo E-commerce apresentado por Felipe Beraldo e Flávio Beraldo. +250 episódios com líderes de marketing e e-commerce. Aqui você descobre o lado marqueteiro das pessoas e dos negócios.',
  keywords: [
    'podcast marketing digital',
    'podcast e-commerce',
    'O Fator M',
    'ofatorm',
    'Felipe Beraldo',
    'Flávio Beraldo',
    'Alan Rocumback',
    'Ciclo E-commerce',
    'marketing estratégico',
    'podcast estratégia',
    'podcast empresários',
    'e-commerce Brasil',
  ],
  openGraph: {
    title: 'O Fator M | Podcast de Marketing e E-commerce',
    description:
      '+250 episódios com líderes do mercado. Aqui você descobre o lado marqueteiro das pessoas e dos negócios.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ciclo E-commerce',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'O Fator M | Podcast de Marketing e E-commerce',
    description: '+250 episódios com líderes do mercado de marketing e e-commerce.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cicloecommerce.com.br/ofatorm' },
}

const podcastSchema = {
  '@context': 'https://schema.org',
  '@type': 'PodcastSeries',
  name: 'O Fator M',
  description:
    'Canal de conteúdo da Ciclo E-commerce com insights e tendências para ajudar negócios na área de marketing e vendas. Aqui você descobre o lado marqueteiro das pessoas e dos negócios.',
  url: 'https://cicloecommerce.com.br/ofatorm',
  image: 'https://cicloecommerce.com.br/logo-ofatorm-white.png',
  inLanguage: 'pt-BR',
  author: [
    {
      '@type': 'Person',
      name: 'Felipe Beraldo',
      jobTitle: 'CEO da Ciclo E-commerce',
      url: 'https://cicloecommerce.com.br/ofatorm',
    },
    {
      '@type': 'Person',
      name: 'Flávio Beraldo',
      jobTitle: 'Diretor de Marketing da Ciclo E-commerce',
      url: 'https://cicloecommerce.com.br/ofatorm',
    },
    {
      '@type': 'Person',
      name: 'Alan Rocumback',
      jobTitle: 'COO da Ciclo E-commerce',
      url: 'https://cicloecommerce.com.br/ofatorm',
    },
  ],
  publisher: {
    '@type': 'Organization',
    name: 'Ciclo E-commerce',
    url: 'https://cicloecommerce.com.br',
    logo: {
      '@type': 'ImageObject',
      url: 'https://cicloecommerce.com.br/logo-ciclo.png',
    },
  },
  sameAs: [
    'https://www.youtube.com/@ofatorm',
    'https://instagram.com/ofatorm',
    'https://tiktok.com/@ofatorm',
    'https://open.spotify.com/show/6QIXPnTNJeiNSOzyNPDl7H',
    'https://ofatorm.substack.com/',
  ],
}

export default function OFatorMPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(podcastSchema) }}
      />
      <main>
        <Header />
        <OFatorMInteractive />
        <Footer />
      </main>
    </>
  )
}
