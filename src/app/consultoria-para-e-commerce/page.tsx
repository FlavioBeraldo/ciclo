import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ConsultoriaInteractive from './interactive'

export const metadata: Metadata = {
  title: 'Consultoria para E-commerce: Cresça sua Operação de Forma Estratégica e Sustentável | Ciclo',
  description:
    'Potencialize seu e-commerce com uma consultoria estratégica. Identificamos gargalos, otimizamos processos e criamos um ecossistema de crescimento sustentável. Fale com especialistas!',
  keywords: ['consultoria e-commerce', 'crescimento e-commerce', 'agência e-commerce', 'ciclo ecommerce', 'Full Funnel Marketing'],
  openGraph: {
    title: 'Consultoria para E-commerce | Ciclo E-commerce',
    description: 'Potencialize seu e-commerce com uma consultoria estratégica da Ciclo.',
    type: 'website',
  },
}

export default function ConsultoriaPage() {
  return (
    <main>
      <Header />
      <ConsultoriaInteractive />
      <Footer />
    </main>
  )
}
