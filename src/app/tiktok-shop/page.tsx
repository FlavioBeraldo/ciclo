import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TikTokShopContent from './interactive'

export const metadata: Metadata = {
  title: 'TikTok Shop | Ciclo E-commerce',
  description:
    'A Ciclo E-commerce é o seu parceiro de Full Funnel Marketing no TikTok Shop. Acelere suas vendas com a era do Discovery Commerce.',
  keywords: [
    'TikTok Shop',
    'social commerce',
    'discovery commerce',
    'TikTok Ads',
    'GMV Max',
    'creators',
    'e-commerce',
    'Ciclo E-commerce',
  ],
  openGraph: {
    title: 'TikTok Shop | Ciclo E-commerce',
    description:
      'A Ciclo E-commerce é o seu parceiro de Full Funnel Marketing no TikTok Shop. Da configuração à escala.',
    type: 'website',
  },
}

export default function TikTokShopPage() {
  return (
    <main>
      <Header />
      <TikTokShopContent />
      <Footer />
    </main>
  )
}
