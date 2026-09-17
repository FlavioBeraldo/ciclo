import type { Metadata } from 'next'
import Image from 'next/image'
import LinkBioForm from './LinkBioForm'

// Página de uso exclusivo nas redes sociais: fora do índice e fora do sitemap.
export const metadata: Metadata = {
  title: 'Aplicação | Ciclo E-commerce',
  description: 'Aplicação para conversa com o time da Ciclo E-commerce.',
  robots: { index: false, follow: false, nocache: true },
}

export default function LinkBioPage() {
  return (
    <main className="lb-root min-h-screen bg-black text-white flex items-center">
      <div className="w-full max-w-2xl mx-auto px-6 sm:px-10 py-16">
        <a href="/" className="inline-block mb-12 opacity-90 hover:opacity-100 transition-opacity">
          <Image src="/logo-ciclo-white.png" alt="Ciclo E-commerce" width={1010} height={250} className="h-6 w-auto" priority />
        </a>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-10">
          Aplicação
        </h1>

        <LinkBioForm />
      </div>
    </main>
  )
}
