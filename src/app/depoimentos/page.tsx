import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DepoimentosInteractive from './interactive'

export const metadata: Metadata = {
  title: 'Depoimentos | Cases de Sucesso em E-commerce — Ciclo E-commerce',
  description:
    'Veja o que as marcas que cresceram com a Ciclo E-commerce têm a dizer. Cases reais de crescimento com Full Funnel Marketing para e-commerce.',
  openGraph: {
    title: 'Depoimentos | Cases de Sucesso — Ciclo E-commerce',
    description: 'Marcas reais, resultados reais. Veja os depoimentos de quem cresceu com a Ciclo.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ciclo E-commerce',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cicloecommerce.com.br/depoimentos' },
}

export default function DepoimentosPage() {
  return (
    <main className="min-h-screen bg-[#050505] pt-20">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#A100FF]/8 blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#A100FF]/5 blur-[80px]" />
      </div>
      <Header />
      <DepoimentosInteractive />
      <Footer />
    </main>
  )
}
