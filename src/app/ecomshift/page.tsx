import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import EcomShiftInteractive from './interactive'

export const metadata: Metadata = {
  title: 'ECOM Shift | Treinamento de Marketing para Gestores de E-commerce na Era do Full Funnel',
  description:
    'Treinamento intensivo de marketing para gestores de marketing e e-commerce. Aprenda o método Full Funnel Marketing com Flávio Beraldo, COO da Ciclo E-commerce. +250 gestores já transformaram suas operações.',
  keywords: [
    'treinamento de marketing',
    'gestores de marketing',
    'gestores de ecommerce',
    'full funnel marketing',
    'ECOM Shift',
    'Flávio Beraldo',
    'Ciclo E-commerce',
    'marketing digital ecommerce',
    'funil ampulheta',
    'curso ecommerce',
    'treinamento ecommerce',
    'ecossistema de aquisição de clientes',
  ],
  openGraph: {
    title: 'ECOM Shift | Treinamento de Full Funnel Marketing para E-commerce',
    description:
      '+250 gestores já fizeram. Aprenda o método que transforma marcas de e-commerce com Full Funnel Marketing.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ciclo E-commerce',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ECOM Shift | Treinamento de Full Funnel Marketing',
    description: '+250 gestores de marketing e e-commerce já fizeram o ECOM Shift.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cicloecommerce.com.br/ecomshift' },
}

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'ECOM Shift — Full Funnel Marketing para E-commerce',
  description:
    'Treinamento intensivo de marketing para gestores de e-commerce. Aprenda a construir um ecossistema de aquisição de clientes com o método Full Funnel Marketing da Ciclo E-commerce.',
  url: 'https://cicloecommerce.com.br/ecomshift',
  inLanguage: 'pt-BR',
  offers: {
    '@type': 'Offer',
    price: '37.90',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock',
    url: 'https://pay.hub.la/4JzioLT4Af7962CGf2by',
  },
  instructor: {
    '@type': 'Person',
    name: 'Flávio Beraldo',
    jobTitle: 'COO da Ciclo E-commerce',
    url: 'https://cicloecommerce.com.br',
  },
  provider: {
    '@type': 'Organization',
    name: 'Ciclo E-commerce',
    url: 'https://cicloecommerce.com.br',
    logo: {
      '@type': 'ImageObject',
      url: 'https://cicloecommerce.com.br/logo-ciclo.png',
    },
  },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    inLanguage: 'pt-BR',
  },
}

export default function EcomShiftPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <main>
        <Header />
        <EcomShiftInteractive />
        <Footer />
      </main>
    </>
  )
}
