import type { Metadata } from 'next'
import MaquinaDeReceita from '@/components/ciclo/lp/MaquinaDeReceita'
import { playfair2026 } from '@/components/ciclo/fonts'
import '@/components/ciclo/base.css'
import '@/components/ciclo/interiors.css'
import '@/components/ciclo/case/case.css'
import '@/components/ciclo/lp/lp.css'

// Landing exclusiva de mídia paga. Fica fora do índice de busca, do sitemap e
// da navegação do site; nada daqui altera o SEO das outras páginas.

const TITULO = 'Máquina de receita no e-commerce | Ciclo E-commerce'
const DESCRICAO =
  'Para empresas com marca própria: a Ciclo conecta reconhecimento antes da compra, conversão e recompra para transformar marketing em crescimento de receita.'

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    title: TITULO,
    description: DESCRICAO,
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ciclo E-commerce',
  },
  twitter: { card: 'summary', title: TITULO, description: DESCRICAO },
}

export default function Page() {
  const escopo = `ciclo2026 ${playfair2026.variable}`
  return (
    <div className={escopo}>
      <MaquinaDeReceita classeDeEscopo={escopo} />
    </div>
  )
}
