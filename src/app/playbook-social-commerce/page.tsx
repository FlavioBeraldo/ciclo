import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Playfair_Display } from 'next/font/google'
import PlaybookForm from './PlaybookForm'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Playbook Social Commerce 2026 | Download Gratuito | Ciclo E-commerce',
  description:
    'Baixe gratuitamente o Playbook de Social Commerce da Ciclo: dados de mercado, os 4 motores (conteúdo, creators, live e ads), o método 100/20/6 de 90 dias e cases reais. Estratégias para transformar atenção em vendas.',
  keywords: [
    'social commerce',
    'playbook social commerce',
    'tiktok shop',
    'live commerce',
    'creators',
    'e-commerce',
    'ciclo e-commerce',
  ],
  openGraph: {
    title: 'Playbook Social Commerce — A nova era do e-commerce',
    description:
      'Estratégias, canais e playbooks para transformar atenção em vendas. 29 capítulos, dados de mercado e um método prático de 90 dias. Download gratuito.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ciclo E-commerce',
    images: [{ url: 'https://cicloecommerce.com.br/playbook/capa-playbook-social-commerce.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playbook Social Commerce — download gratuito',
    description: 'Dados, canais, método de 90 dias e cases reais de Social Commerce.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cicloecommerce.com.br/playbook-social-commerce' },
}

const stats = [
  { value: 'US$ 2,1 tri', label: 'Mercado global de Social Commerce em 2026, com projeção de US$ 7,5 tri até 2031' },
  { value: '22,4%', label: 'Fatia do Social Commerce sobre todo o e-commerce mundial em 2026' },
  { value: 'R$ 1,2 bi', label: 'GMV do TikTok Shop no Brasil em 2025 — no primeiro ano de operação' },
  { value: 'até 40%', label: 'Conversão em lives com oferta, contra 1,65% da média do e-commerce' },
]

const chapters = [
  {
    n: '01',
    title: 'O jogo e as regras',
    text: 'O que é Social Commerce de verdade, o que não é, e os 5 princípios que sustentam a operação.',
  },
  {
    n: '02',
    title: 'Os números do movimento',
    text: 'Dados globais e do Brasil que provam a escala: mercado, conversão e a guerra contra a fricção.',
  },
  {
    n: '03',
    title: 'Os 4 motores',
    text: 'Conteúdo, creators, live commerce e ads — como cada motor funciona e como eles se combinam.',
  },
  {
    n: '04',
    title: 'O método 100/20/6',
    text: 'Volume, teste e seleção em 90 dias: o passo a passo prático para sair do zero com método.',
  },
  {
    n: '05',
    title: 'Operação e métricas',
    text: 'Produto certo, retaguarda que segura a escala e as métricas que realmente importam.',
  },
  {
    n: '06',
    title: 'Cases reais',
    text: 'Canvas Beauty, Made by Mitchell, Aura Beauty e o case de R$ 2 milhões em 15 dias da Viih Tube.',
  },
]

export default function PlaybookSocialCommercePage() {
  return (
    <div className={`${playfair.variable} lp-playbook min-h-screen bg-[#EDE7DB] text-[#1A1917]`}>
      {/* Top bar editorial */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#1A1917]/60">
          <Link href="/" className="hover:opacity-70 transition-opacity" aria-label="Ciclo E-commerce — página inicial">
            <Image
              src="/logo-ciclo-black.png"
              alt="Ciclo"
              width={1010}
              height={250}
              priority
              className="h-7 w-auto"
            />
          </Link>
          <span className="text-xs tracking-[0.25em] uppercase text-[#6E6A60]">Playbook / 2026</span>
        </div>
      </header>

      {/* Hero: capa + formulário */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-16 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Capa do playbook */}
          <div className="relative max-w-md mx-auto lg:mx-0 w-full">
            <div className="absolute -inset-3 bg-[#2B6B9B]/10 rounded-2xl rotate-[-1.5deg]" aria-hidden="true" />
            <Image
              src="/playbook/capa-playbook-social-commerce.jpg"
              alt="Capa do Playbook Social Commerce — A nova era do e-commerce"
              width={993}
              height={1404}
              priority
              className="relative w-full h-auto rounded-lg shadow-[0_24px_60px_-20px_rgba(26,25,23,0.45)]"
            />
          </div>

          {/* Copy + form */}
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#C0564A] mb-4">
              Playbook gratuito · Social Commerce
            </p>
            <h1 className="font-serif-lp text-4xl sm:text-5xl leading-[1.05] mb-4">
              A venda saiu do site. Sua marca já sabe operar onde ela acontece?
            </h1>
            <p className="text-[#6E6A60] leading-relaxed mb-6">
              Um em cada cinco reais do e-commerce mundial já nasce dentro de uma rede social.
              Este playbook reúne os dados, os 4 motores do modelo e um método prático de 90 dias
              para transformar atenção em vendas — sem achismo.
            </p>

            <ul className="flex flex-col gap-2.5 mb-8 text-sm">
              {[
                '29 capítulos direto ao ponto, do conceito à operação',
                'O método 100/20/6 para os primeiros 90 dias',
                'Cases reais: do quase colapso ao recorde de vendas',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="text-[#2B6B9B] font-bold mt-px" aria-hidden="true">+</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div id="baixar" className="bg-[#F4F0E6] border border-[#1A1917]/10 rounded-2xl p-6 sm:p-7">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6E6A60] mb-4">
                Receba o PDF agora
              </p>
              <PlaybookForm />
            </div>
          </div>
        </div>
      </section>

      {/* Faixa de números — estética editorial do playbook */}
      <section className="border-y border-[#1A1917]/60 bg-[#E8E2D4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.value}>
                <p className="font-serif-lp text-4xl text-[#2B6B9B] mb-2">{s.value}</p>
                <p className="text-xs text-[#6E6A60] leading-relaxed uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que você vai encontrar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-serif-lp text-3xl sm:text-4xl mb-10">
          O que você leva no playbook
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-9">
          {chapters.map((c) => (
            <div key={c.n} className="border-t border-[#1A1917]/25 pt-4">
              <p className="font-serif-lp text-2xl text-[#C0564A] mb-1.5">{c.n}</p>
              <h3 className="font-semibold text-sm uppercase tracking-wide mb-2">{c.title}</h3>
              <p className="text-sm text-[#6E6A60] leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pull quote no estilo do material */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="w-10 border-t-2 border-[#C0564A] mb-4" aria-hidden="true" />
        <blockquote className="font-serif-lp italic text-2xl sm:text-3xl leading-snug">
          Social Commerce deixou de ser aposta e virou infraestrutura do varejo global.
          A pergunta não é mais se sua marca deve entrar, e sim com que método.
        </blockquote>
      </section>

      {/* CTA final */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-[#1A1917] text-[#EDE7DB] rounded-2xl px-8 py-12 text-center">
          <h2 className="font-serif-lp text-3xl sm:text-4xl mb-3">Comece antes da sua concorrência.</h2>
          <p className="text-[#EDE7DB]/70 mb-7 max-w-xl mx-auto leading-relaxed">
            O playbook é gratuito e leva 30 segundos para chegar até você.
            O custo real é continuar operando como se a venda ainda começasse no seu site.
          </p>
          <a
            href="#baixar"
            className="inline-block bg-[#EDE7DB] text-[#1A1917] rounded-xl px-8 py-4 text-sm font-semibold tracking-wide hover:bg-[#2B6B9B] hover:text-[#EDE7DB] transition-colors"
          >
            Quero o playbook gratuito ↑
          </a>
        </div>
      </section>

      {/* Rodapé mínimo */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="border-t border-[#1A1917]/25 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#6E6A60]">
          <p>© {new Date().getFullYear()} Ciclo E-commerce — Playbook Social Commerce</p>
          <Link href="/politica-de-privacidade" className="underline hover:text-[#1A1917]">
            Política de Privacidade
          </Link>
        </div>
      </footer>
    </div>
  )
}
