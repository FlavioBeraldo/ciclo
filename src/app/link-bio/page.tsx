import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import LinkBioForm from './LinkBioForm'
import { playfair2026 } from '@/components/ciclo/fonts'
import '@/components/ciclo/base.css'
import '@/components/ciclo/interiors.css'

// Página de uso exclusivo nas redes sociais: fora do índice e fora do sitemap.
export const metadata: Metadata = {
  title: 'Aplicação | Ciclo E-commerce',
  description: 'Aplicação para conversa com o time da Ciclo E-commerce.',
  robots: { index: false, follow: false, nocache: true },
}

// /link-bio no design 2026, com a mesma casca de /aplicacao: as duas são
// páginas de formulário em etapas, e agora se parecem.
//
// A LÓGICA DO FORMULÁRIO NÃO FOI TOCADA. Os eventos `link_bio_step_view` e
// `link_bio_step_complete`, o POST por etapa para /api/link-bio, o cookie
// assinado `ciclo_lb`, o `complete` da última etapa e o `generate_lead`
// continuam iguais — só as classes de estilo mudaram.
export default function LinkBioPage() {
  return (
    <div className={`ciclo2026 ${playfair2026.variable}`}>
      <div className="inner application-page">
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>

        <main id="conteudo">
          <div className="wrap narrow">
            <div className="application-topo">
              <Link href="/" aria-label="Ir para a home da Ciclo E-commerce">
                <Image
                  src="/logo-ciclo-black.png"
                  alt="Ciclo E-commerce"
                  width={1010}
                  height={250}
                  className="application-marca"
                  priority
                />
              </Link>
              <span className="section-kicker">Aplicação</span>
            </div>
          </div>

          <div className="wrap narrow application-shell">
            <div className="application-intro">
              {/* O h1 é o que a página já tinha: "Aplicação", e nada mais.
                  O texto de apoio continua dentro do formulário, como era. */}
              <h1>Aplicação</h1>
            </div>

            <div className="application-card" id="link-bio-form">
              <LinkBioForm />
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
