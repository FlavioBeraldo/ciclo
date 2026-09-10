import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Playfair_Display } from 'next/font/google'
import PlaybookForm from './PlaybookForm'
import StickyCta from './StickyCta'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Playbook Social Commerce 2026 | Download Gratuito | Ciclo E-commerce',
  description:
    'Um em cada cinco reais do e-commerce mundial já nasce nas redes sociais. Baixe o playbook gratuito da Ciclo: os 4 motores, o método 100/20/6 e cases como US$ 1 mi em uma única live.',
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
      'Os 4 motores do Social Commerce, o método 100/20/6 e cases reais com número. Escrito por quem opera o modelo em dezenas de marcas. Download gratuito.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ciclo E-commerce',
    url: 'https://cicloecommerce.com.br/playbook-social-commerce',
    images: [
      {
        url: 'https://cicloecommerce.com.br/playbook/og-playbook-social-commerce.jpg',
        width: 1200,
        height: 630,
        alt: 'Playbook Social Commerce — A nova era do e-commerce | Ciclo E-commerce',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playbook Social Commerce — download gratuito',
    description: 'Dados, canais, método de 90 dias e cases reais de Social Commerce.',
    images: ['https://cicloecommerce.com.br/playbook/og-playbook-social-commerce.jpg'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cicloecommerce.com.br/playbook-social-commerce' },
}

const stats = [
  { value: '> Target', label: 'Em 2026, o TikTok Shop deve vender mais nos EUA do que toda a operação online da Target (eMarketer)' },
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

const documentSchema = {
  '@context': 'https://schema.org',
  '@type': 'DigitalDocument',
  name: 'Playbook Social Commerce — A nova era do e-commerce',
  description:
    'Playbook gratuito da Ciclo E-commerce sobre Social Commerce: dados de mercado, os 4 motores (conteúdo, creators, live e ads), o método 100/20/6 de 90 dias e cases reais.',
  url: 'https://cicloecommerce.com.br/playbook-social-commerce',
  image: 'https://cicloecommerce.com.br/playbook/og-playbook-social-commerce.jpg',
  thumbnailUrl: 'https://cicloecommerce.com.br/playbook/capa-playbook-social-commerce.jpg',
  inLanguage: 'pt-BR',
  isAccessibleForFree: true,
  datePublished: '2026',
  publisher: {
    '@type': 'Organization',
    name: 'Ciclo E-commerce',
    url: 'https://cicloecommerce.com.br',
    logo: { '@type': 'ImageObject', url: 'https://cicloecommerce.com.br/logo-ciclo.png' },
  },
}

export default function PlaybookSocialCommercePage() {
  return (
    <div className={`${playfair.variable} lp-playbook min-h-screen bg-[#EDE7DB] text-[#1A1917]`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(documentSchema) }}
      />
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
              <span className="text-[#2B6B9B]">Um em cada cinco reais do e-commerce mundial</span>{' '}
              já nasce dentro de uma rede social. O seu ainda nasce no site?
            </h1>
            <p className="text-[#6E6A60] leading-relaxed mb-6">
              Escrito por quem opera Social Commerce em dezenas de marcas: os dados que provam a escala,
              os 4 motores do modelo e o método 100/20/6 para os seus primeiros 90 dias.
            </p>

            <ul className="flex flex-col gap-2.5 mb-8 text-sm">
              {[
                'A distribuição real do resultado: 65% afiliados, 20% live, 10% conteúdo, 5% ads',
                'O método 100/20/6: 100 creators, 20% de vencedores, 6 ciclos em 90 dias',
                'Cases com número: US$ 1 milhão em uma live de 6 horas e R$ 2 mi em 15 dias',
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

      {/* Prova social da Ciclo */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="border-t border-[#1A1917]/60 pt-10">
          <h2 className="font-serif-lp text-3xl sm:text-4xl mb-5">
            Quem escreveu este playbook opera o que ensina.
          </h2>
          <p className="text-[#6E6A60] leading-relaxed max-w-3xl mb-2">
            São mais de 300 marcas atendidas em 11 anos e R$ 350 milhões em receita gerada.
            Entre elas: GoPro, Shiseido, NARS, Motorola, Laura Mercier e Jack Link&apos;s.
          </p>
          <p className="text-[#6E6A60] leading-relaxed max-w-3xl mb-9">
            Os percentuais dos 4 motores não vieram de relatório de mercado. Vieram da nossa operação.
          </p>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
            {[
              { name: 'GoPro',         logo: '/brands/gopro.png' },
              { name: 'Shiseido',      logo: '/brands/shiseido.png' },
              { name: 'NARS',          logo: '/brands/nars.png' },
              { name: 'Motorola',      logo: '/brands/motorola.png' },
              { name: 'Laura Mercier', logo: '/brands/laura-mercier.png' },
              { name: "Jack Link's",   logo: '/brands/jacklinks.png' },
            ].map((brand) => (
              <Image
                key={brand.name}
                src={brand.logo}
                alt={brand.name}
                width={140}
                height={44}
                className="h-8 sm:h-9 w-auto object-contain grayscale opacity-60"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-[#1A1917] text-[#EDE7DB] rounded-2xl px-8 py-12 text-center">
          <h2 className="font-serif-lp text-3xl sm:text-4xl mb-3">Comece antes da sua concorrência.</h2>
          <p className="text-[#EDE7DB]/70 mb-7 max-w-xl mx-auto leading-relaxed">
            O GMV de lives no Brasil cresceu 161x em um ano. O playbook é gratuito e leva 30 segundos.
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

      <StickyCta />

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
