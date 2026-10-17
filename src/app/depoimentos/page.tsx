import type { Metadata } from 'next'
import Link from 'next/link'
import CicloHeader from '@/components/ciclo/CicloHeader'
import CicloFooter from '@/components/ciclo/CicloFooter'
import Breadcrumb from '@/components/ciclo/interior/Breadcrumb'
import VideosDepoimento from '@/components/ciclo/VideosDepoimento'
import { playfair2026 } from '@/components/ciclo/fonts'
import '@/components/ciclo/base.css'
import '@/components/ciclo/interiors.css'

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

// Os mesmos quatro vídeos, com as mesmas descrições que a página já trazia.
const DEPOIMENTOS = [
  {
    id: 'djykk9EFghg',
    marca: 'Líquido',
    descricao: 'Como a Líquido escalou seu e-commerce com Full Funnel Marketing.',
  },
  {
    id: 'xVdqhprwKWw',
    marca: 'KVRA',
    descricao: 'A jornada de crescimento da KVRA com Ciclo E-commerce.',
  },
  {
    id: '6B2XYATbK3Q',
    marca: 'DANKI',
    descricao: 'DANKI e os resultados de Full Funnel Marketing com a Ciclo.',
  },
  {
    id: 'MlDyvGg7rGs',
    marca: 'Mamô Brasil',
    descricao: 'Mamô Brasil e sua estratégia de crescimento sustentável.',
  },
]

// /depoimentos no design 2026. Mesmos vídeos, mesmas descrições, mesma
// metadata e mesmo canonical. O player é o mesmo componente da home, com o
// teclado e o foco já testados.
export default function DepoimentosPage() {
  return (
    <div className={`ciclo2026 ${playfair2026.variable}`}>
      <div className="inner">
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>

        <CicloHeader />

        <main id="conteudo">
          <section className="inner-hero">
            <div className="wrap narrow">
              <Breadcrumb etapas={[{ rotulo: 'Início', href: '/' }, { rotulo: 'Depoimentos' }]} />

              <h1>
                <span className="eyebrow h1-kicker">
                  <span />
                  Depoimentos
                </span>
                <em>Quem vive, recomenda</em>
              </h1>

              <p className="inner-lead">
                Veja o que as marcas que cresceram com a Ciclo têm a dizer sobre a parceria.
              </p>
            </div>
          </section>

          <div className="section-fade paper-dark" aria-hidden="true" />

          <section className="section dark proof">
            <div className="wrap narrow">
              <VideosDepoimento itens={DEPOIMENTOS} />
            </div>
          </section>

          <div className="section-fade dark-white" aria-hidden="true" />

          <section className="inner-section">
            <div className="wrap narrow">
              <div className="tts-cta">
                <h2>Quer ser o próximo case de sucesso?</h2>
                <Link className="button" href="/#contato">
                  <span>Fale com um especialista</span>
                  <b aria-hidden="true">↗</b>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <CicloFooter />
      </div>
    </div>
  )
}
