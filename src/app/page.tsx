import type { Metadata } from 'next'
import RecaptchaProvider from '@/components/RecaptchaProvider'
import CicloHeader from '@/components/ciclo/CicloHeader'
import CicloFooter from '@/components/ciclo/CicloFooter'
import Abertura from '@/components/ciclo/home/Abertura'
import Metodo from '@/components/ciclo/home/Metodo'
import Problema from '@/components/ciclo/home/Problema'
import Solucoes from '@/components/ciclo/home/Solucoes'
import Cases from '@/components/ciclo/home/Cases'
import Depoimentos from '@/components/ciclo/home/Depoimentos'
import Podcast from '@/components/ciclo/home/Podcast'
import Artigos from '@/components/ciclo/home/Artigos'
import Contato from '@/components/ciclo/Contato'
import { buscarEpisodios } from '@/lib/youtube-server'
// Mesmas duas folhas que a home do kit carrega, nesta ordem: `interiors.css`
// redefine `--accent` para #933dc9 e é o que vale.
import { playfair2026 } from '@/components/ciclo/fonts'
import '@/components/ciclo/base.css'
import '@/components/ciclo/interiors.css'

export const metadata: Metadata = {
  alternates: { canonical: 'https://cicloecommerce.com.br' },
}

// ISR: mantém "Últimos artigos" em dia conforme novos posts são publicados
// (inclusive os agendados no Keystatic, que entram no ar na data marcada), e
// agora também os episódios do Fator M — a mesma revalidação já existente
// cobre os dois, sem acrescentar regeneração nenhuma.
export const revalidate = 900

// Home no design 2026. Todo o CSS do kit vive sob `.ciclo2026`, então nada
// daqui alcança as páginas que ainda não foram refeitas — em especial o
// /playbook-social-commerce, que fica fora do redesign.
export default async function Home() {
  // No servidor, para o HTML sair com episódio real em vez do fallback.
  const { lista: episodios } = await buscarEpisodios()

  return (
    <RecaptchaProvider>
      <div className={`ciclo2026 ${playfair2026.variable}`}>
        <a className="skip" href="#inicio">
          Pular para o conteúdo
        </a>

        <CicloHeader />

        <main>
          <Abertura />
          <Metodo />
          <div className="section-fade dark-paper" aria-hidden="true" />
          <Problema />
          <div className="section-fade paper-white" aria-hidden="true" />
          <Solucoes />
          <div className="section-fade white-paper" aria-hidden="true" />
          <Cases />
          <div className="section-fade paper-dark" aria-hidden="true" />
          <Depoimentos />
          <div className="section-fade dark-white" aria-hidden="true" />
          <Podcast episodios={episodios} />
          <div className="section-fade white-paper" aria-hidden="true" />
          <Artigos />
          <div className="section-fade paper-dark" aria-hidden="true" />
          <Contato />
        </main>

        <CicloFooter />
      </div>
    </RecaptchaProvider>
  )
}
