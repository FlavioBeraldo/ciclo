import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import AplicacaoForm from './AplicacaoForm'
import { playfair2026 } from '@/components/ciclo/fonts'
import '@/components/ciclo/base.css'
import '@/components/ciclo/interiors.css'

// Página de formulário: fora do índice, como as demais páginas de aplicação.
export const metadata: Metadata = {
  title: 'Aplicação | Consultoria E-com Shift — Ciclo E-commerce',
  description:
    'Conte para a gente o momento do seu e-commerce e aplique para a Consultoria E-com Shift, da Ciclo E-commerce.',
  robots: { index: false, follow: true, nocache: true },
}

// /aplicacao no design 2026, pelo layout do kit: coluna de texto fixa à
// esquerda e o cartão do formulário à direita.
//
// A página continua SEM o cabeçalho do site, como já era: é uma página de
// formulário, e a marca volta para a landing da consultoria, não para a home.
//
// A LÓGICA DO FORMULÁRIO NÃO FOI TOCADA. Os oito passos, os eventos
// `aplicacao_step_view` e `aplicacao_step_complete`, o `event_id` por sessão
// de preenchimento, o POST para /api/aplicacao, a resposta `duplicate: true`
// no reenvio e o `consultoria_ecom_shift_lead` do fim seguem iguais — só as
// classes de estilo mudaram.
export default function AplicacaoPage() {
  return (
    <div className={`ciclo2026 ${playfair2026.variable}`}>
      <div className="inner application-page">
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>

        <main id="conteudo">
          <div className="wrap narrow">
            <div className="application-topo">
              {/* A marca volta para a landing da consultoria, não para o site */}
              <Link
                href="/consultoria-ecom-shift"
                aria-label="Voltar para a Consultoria E-com Shift"
              >
                <Image
                  src="/logo-ciclo.png"
                  alt="Ciclo E-commerce"
                  width={1010}
                  height={250}
                  className="application-marca"
                  priority
                />
              </Link>
              <span className="section-kicker">Aplicação · Consultoria E-com Shift</span>
            </div>
          </div>

          <div className="wrap narrow application-shell">
            <div className="application-intro">
              <h1>
                <span className="eyebrow h1-kicker">
                  <span />
                  Aplicação
                </span>
                Conte para a gente o momento do <em>seu e-commerce</em>
              </h1>

              <p>
                São algumas perguntas rápidas sobre a sua operação. Com elas, o time da Ciclo
                consegue avaliar se a Consultoria E-com Shift faz sentido para o seu momento.
              </p>

              <p>8 perguntas · cerca de 2 minutos</p>

              <p>
                <Link href="/consultoria-ecom-shift" className="textlink">
                  Voltar para a Consultoria E-com Shift
                </Link>
              </p>
            </div>

            <div className="application-card" id="application-form">
              <AplicacaoForm />
            </div>
          </div>

          <div className="wrap narrow">
            <footer className="application-rodape">
              <p>
                © {new Date().getFullYear()} Ciclo E-commerce · CNPJ 23.757.895/0001-09 ·{' '}
                <a href="/politica-de-privacidade">Política de Privacidade</a>
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}
