import type { Metadata } from 'next'
import ObrigadoInteractive from './interactive'

export const metadata: Metadata = {
  title: 'Obrigado pelo contato | Ciclo E-commerce',
  description: 'Recebemos seu contato. Nossa equipe entrará em breve.',
  robots: { index: false, follow: false },
}

export default function ObrigadoPage() {
  return <ObrigadoInteractive />
}
