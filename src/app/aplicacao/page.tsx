import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import AplicacaoForm from './AplicacaoForm'
import { anton } from '@/components/shift/fonts'
import '@/components/shift/shift.css'

// Página de formulário: fora do índice, como as demais páginas de aplicação.
export const metadata: Metadata = {
  title: 'Aplicação | Consultoria E-com Shift — Ciclo E-commerce',
  description:
    'Conte para a gente o momento do seu e-commerce e aplique para a Consultoria E-com Shift, da Ciclo E-commerce.',
  robots: { index: false, follow: true, nocache: true },
}

export default function AplicacaoPage() {
  return (
    <div className={`shift ${anton.variable} min-h-screen`}>
      <main className="shift-container py-12 md:py-16">
        <div className="shift-signature">
          <Link href="/" aria-label="Ciclo E-commerce — página inicial">
            <Image
              src="/logo-ciclo-white.png"
              alt="Ciclo E-commerce"
              width={1010}
              height={250}
              className="h-5 w-auto"
              priority
            />
          </Link>
          <span className="shift-eyebrow">Aplicação · Consultoria E-com Shift</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20 pt-12 md:pt-16">
          <div>
            <h1 className="shift-display shift-h2">
              Conte para a gente o momento do seu e-commerce
            </h1>
            <p className="shift-lead shift-measure mt-6">
              São algumas perguntas rápidas sobre a sua operação. Com elas, o time da Ciclo consegue
              avaliar se a Consultoria E-com Shift faz sentido para o seu momento.
            </p>
            <p className="shift-body mt-6">
              <Link href="/consultoria-ecom-shift" className="underline underline-offset-4">
                Voltar para a Consultoria E-com Shift
              </Link>
            </p>
          </div>

          <div className="lg:pt-2">
            <AplicacaoForm />
          </div>
        </div>
      </main>

      <footer className="shift-container pb-12">
        <hr className="shift-rule mb-6" />
        <p className="shift-body">
          © {new Date().getFullYear()} Ciclo E-commerce · CNPJ 23.757.895/0001-09 ·{' '}
          <a href="/politica-de-privacidade" className="underline underline-offset-4">
            Política de Privacidade
          </a>
        </p>
      </footer>
    </div>
  )
}
