import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Ciclo E-commerce | Obcecados por Crescimento',
  description:
    'A Ciclo E-commerce é uma agência especializada em Full Funnel Marketing para marcas que querem crescer com eficiência e previsibilidade.',
  keywords: ['e-commerce', 'marketing digital', 'full funnel', 'crescimento', 'agência'],
  openGraph: {
    title: 'Ciclo E-commerce | Obcecados por Crescimento',
    description: 'Full Funnel Marketing para marcas que querem crescer.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="grain">{children}</body>
    </html>
  )
}
