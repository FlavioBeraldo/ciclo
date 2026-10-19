import type { Metadata } from 'next'
import Image from 'next/image'
import CicloHeader from '@/components/ciclo/CicloHeader'
import CicloFooter from '@/components/ciclo/CicloFooter'
import Breadcrumb from '@/components/ciclo/interior/Breadcrumb'
import PlayerVideo from '@/components/ciclo/PlayerVideo'
import { playfair2026 } from '@/components/ciclo/fonts'
import BotaoCheckout, { PRECO } from './BotaoCheckout'
import CtaFlutuante from '@/components/ciclo/CtaFlutuante'
import '@/components/ciclo/base.css'
import '@/components/ciclo/interiors.css'
import '@/components/ciclo/ecomshift.css'

export const metadata: Metadata = {
  title: 'ECOM Shift | Treinamento de Marketing para Gestores de E-commerce na Era do Full Funnel',
  description:
    'Treinamento intensivo de marketing para gestores de marketing e e-commerce. Aprenda o método Full Funnel Marketing com Flávio Beraldo, Sócio e Diretor de Marketing da Ciclo E-commerce. +250 gestores já transformaram suas operações.',
  keywords: [
    'treinamento de marketing',
    'gestores de marketing',
    'gestores de ecommerce',
    'full funnel marketing',
    'ECOM Shift',
    'Flávio Beraldo',
    'Ciclo E-commerce',
    'marketing digital ecommerce',
    'funil ampulheta',
    'curso ecommerce',
    'treinamento ecommerce',
    'ecossistema de aquisição de clientes',
  ],
  openGraph: {
    title: 'ECOM Shift | Treinamento de Full Funnel Marketing para E-commerce',
    description:
      '+250 gestores já fizeram. Aprenda o método que transforma marcas de e-commerce com Full Funnel Marketing.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ciclo E-commerce',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ECOM Shift | Treinamento de Full Funnel Marketing',
    description: '+250 gestores de marketing e e-commerce já fizeram o ECOM Shift.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cicloecommerce.com.br/ecomshift' },
}

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'ECOM Shift — Full Funnel Marketing para E-commerce',
  description:
    'Treinamento intensivo de marketing para gestores de e-commerce. Aprenda a construir um ecossistema de aquisição de clientes com o método Full Funnel Marketing da Ciclo E-commerce.',
  url: 'https://cicloecommerce.com.br/ecomshift',
  inLanguage: 'pt-BR',
  offers: {
    '@type': 'Offer',
    price: '37.90',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock',
    url: 'https://pay.hub.la/4JzioLT4Af7962CGf2by',
  },
  instructor: {
    '@type': 'Person',
    name: 'Flávio Beraldo',
    jobTitle: 'Diretor de Marketing da Ciclo E-commerce',
    url: 'https://cicloecommerce.com.br',
  },
  provider: {
    '@type': 'Organization',
    name: 'Ciclo E-commerce',
    url: 'https://cicloecommerce.com.br',
    logo: {
      '@type': 'ImageObject',
      url: 'https://cicloecommerce.com.br/logo-ciclo.png',
    },
  },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    inLanguage: 'pt-BR',
  },
}

// ─── Conteúdo, o mesmo que a página já trazia ───────────────────────────────

const VANTAGENS = ['Acesso imediato', 'Online e no seu ritmo', 'Método testado em +300 marcas']

const NUMEROS = [
  { valor: '+250', rotulo: 'gestores formados' },
  { valor: '+14', rotulo: 'anos de experiência' },
  { valor: '+300', rotulo: 'projetos liderados' },
  { valor: 'R$350M+', rotulo: 'em receita gerada' },
]

const PARA_QUEM = [
  'Gestores de marketing de e-commerce que querem sair do operacional e pensar estrategicamente',
  'Donos e sócios de lojas virtuais que precisam entender e dominar o marketing da operação',
  'Profissionais de performance que querem construir um ecossistema de crescimento sustentável',
  'Empreendedores que sentem que o negócio está no teto e precisam destravar o próximo nível',
]

// Traçado dos ícones copiado do kit, sem alteração.
const ICONES = {
  tendencia: (
    <>
      <path d="M16 7h6v6" />
      <path d="m22 7-8.5 8.5-5-5L2 17" />
    </>
  ),
  barras: (
    <>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </>
  ),
  alvo: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  pessoas: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <path d="M16 3.128a4 4 0 0 1 0 7.744" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
  raio: (
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  ),
  ciclo: (
    <>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </>
  ),
}

const MODULOS = [
  {
    numero: '01',
    titulo: 'O Novo Cenário do E-commerce',
    texto:
      'A mudança brutal do mercado e por que quem não se adapta ao Full Funnel fica para trás.',
    icone: ICONES.tendencia,
  },
  {
    numero: '02',
    titulo: 'O Funil Ampulheta',
    texto:
      'Da atração à expansão: Reconhecimento, Consideração, Compra, Recompra, Fidelização e Conquista.',
    icone: ICONES.barras,
  },
  {
    numero: '03',
    titulo: 'Reconhecimento & Atenção',
    texto: 'Como construir alcance real com frequência e relevância para sua marca no digital.',
    icone: ICONES.alvo,
  },
  {
    numero: '04',
    titulo: 'Consideração com Provas',
    texto: 'Creators, UGC e prova social como motor de consideração e intenção de compra.',
    icone: ICONES.pessoas,
  },
  {
    numero: '05',
    titulo: 'Canais Transacionais',
    texto: 'Marketplaces, loja própria, WhatsApp, social commerce e IA no checkout.',
    icone: ICONES.raio,
  },
  {
    numero: '06',
    titulo: 'Fidelização & Expansão',
    texto:
      'Transforme compradores em fãs e expanda via boca a boca, conquista e novos mercados.',
    icone: ICONES.ciclo,
  },
]

const MARCAS = [
  'Danki',
  'Liquido',
  'GoPro',
  'Shiseido',
  'Motorola',
  'NARS',
  'TVZ',
  'Eico',
  'DaBelle',
  'Universal Assistance',
]

function Icone({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      className="module-icon"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function Conferido() {
  return (
    <Icone>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </Icone>
  )
}

// /ecomshift no design 2026, pelo layout do kit. Conteúdo, metadata, canonical
// e o schema Course preservados. O `begin_checkout` continua saindo dos mesmos
// dois lugares, com o mesmo payload — ver BotaoCheckout.tsx.
export default function EcomShiftPage() {
  return (
    <div className={`ciclo2026 ${playfair2026.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      <div className="inner">
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>

        <CicloHeader />

        <main id="conteudo">
          {/* ── Abertura ──────────────────────────────────────────────── */}
          <section className="inner-section special-section special-hero" id="es-abertura">
            <div className="wrap narrow">
              <Breadcrumb etapas={[{ rotulo: 'Início', href: '/' }, { rotulo: 'ECOM Shift' }]} />

              <div className="special-module">
                <div className="module-grid cols-2">
                  <div>
                    <div className="module-gap-after">
                      <Image
                        src="/logo-ecomshift.png"
                        alt="ECOM Shift"
                        width={240}
                        height={80}
                        className="module-image special-logo"
                        priority
                      />
                    </div>

                    <p className="semibold section-kicker module-gap-after">
                      Treinamento intensivo
                    </p>

                    <h1 className="module-gap-after">
                      <span className="eyebrow h1-kicker">
                        <span />
                        ECOM Shift
                      </span>
                      Marketing que <em>vende de verdade.</em>
                    </h1>

                    <p className="module-gap-after">
                      O método Full Funnel que +250 gestores de marketing e e-commerce já usam para
                      escalar marcas no digital. Do reconhecimento à fidelização — uma estratégia
                      completa.
                    </p>

                    <div className="module-flex module-gap-after">
                      <BotaoCheckout placement="cta" />
                      <div className="preco">
                        <s>R$ 197,00</s>
                        <strong className="semibold">R$ 37,90</strong>
                      </div>
                    </div>

                    <div className="module-flex vantagens">
                      {VANTAGENS.map((v) => (
                        <div className="module-flex" key={v}>
                          <Conferido />
                          {v}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="module-panel">
                      <Image
                        src="/foto-flavio-beraldo.webp"
                        alt="Flávio Beraldo — Professor do ECOM Shift"
                        width={480}
                        height={640}
                        sizes="(max-width: 760px) 100vw, 420px"
                        className="module-image portrait retrato-fixo retrato-pb"
                        priority
                      />
                      <div>
                        <p className="semibold">Flávio Beraldo</p>
                        <p>Diretor de Marketing da Ciclo E-commerce · +14 anos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Números ───────────────────────────────────────────────── */}
          <section className="inner-section special-section paper">
            <div className="wrap narrow">
              <div className="special-module">
                <div className="module-grid cols-4 centered">
                  {NUMEROS.map((n) => (
                    <div key={n.rotulo}>
                      <p className="module-number module-gap-after">{n.valor}</p>
                      <p>{n.rotulo}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Para quem é ───────────────────────────────────────────── */}
          <section className="inner-section special-section">
            <div className="wrap narrow">
              <div className="special-module">
                <div className="centered module-gap-after">
                  <p className="semibold section-kicker module-gap-after">Para quem é</p>
                  <h2>Este treinamento foi feito para você?</h2>
                </div>

                <div className="module-grid cols-2">
                  {PARA_QUEM.map((t) => (
                    <div className="module-flex" key={t}>
                      <Conferido />
                      <p>{t}</p>
                    </div>
                  ))}
                </div>

                <div className="centered module-gap-before">
                  <BotaoCheckout placement="cta" />
                </div>
              </div>
            </div>
          </section>

          {/* ── Vídeo da edição presencial ────────────────────────────── */}
          <section className="inner-section special-section">
            <div className="wrap narrow">
              <div className="special-module">
                <div className="centered module-gap-after">
                  <p className="semibold section-kicker module-gap-after">Assista</p>
                  <h2>
                    Veja como foi a <em>primeira edição presencial</em>
                  </h2>
                  <p className="module-gap-before">
                    Mais de 250 gestores reunidos para aprender o método Full Funnel Marketing ao
                    vivo.
                  </p>
                </div>

                <div className="module-panel">
                  <PlayerVideo
                    videoId="oJBr4hIaW8k"
                    titulo="ECOM Shift — Primeira Edição Presencial"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── Módulos ───────────────────────────────────────────────── */}
          <section className="inner-section special-section paper">
            <div className="wrap narrow">
              <div className="special-module">
                <div className="centered module-gap-after">
                  <p className="semibold section-kicker module-gap-after">Conteúdo</p>
                  <h2>
                    O que você vai <em>aprender</em>
                  </h2>
                  <p className="module-gap-before">
                    6 módulos que cobrem o método Full Funnel Marketing da captação à expansão.
                  </p>
                </div>

                <div className="module-grid cols-3">
                  {MODULOS.map((m) => (
                    <div className="module-panel" key={m.numero}>
                      <div className="module-flex module-gap-after">
                        <span className="section-kicker">Módulo {m.numero}</span>
                        <Icone>{m.icone}</Icone>
                      </div>
                      <h3 className="semibold module-gap-after">{m.titulo}</h3>
                      <p>{m.texto}</p>
                    </div>
                  ))}
                </div>

                <div className="centered module-gap-before">
                  <BotaoCheckout placement="cta" />
                </div>
              </div>
            </div>
          </section>

          {/* ── Aula aberta ───────────────────────────────────────────── */}
          <section className="inner-section special-section">
            <div className="wrap narrow">
              <div className="special-module">
                <div className="centered module-gap-after">
                  <p className="semibold section-kicker module-gap-after">Aula aberta</p>
                  <h2>
                    Como construir um <em>ecossistema de aquisição</em>
                  </h2>
                  <p className="module-gap-before">
                    Felipe Beraldo, CEO da Ciclo E-commerce, explica o método completo de aquisição
                    de clientes.
                  </p>
                </div>

                <div className="module-panel">
                  <PlayerVideo
                    videoId="3Hxo0Y2PhAI"
                    titulo="ECOM Shift — Como Construir um Ecossistema de Aquisição de Clientes com Felipe Beraldo"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── Seu professor ─────────────────────────────────────────── */}
          <section className="inner-section special-section">
            <div className="wrap narrow">
              <div className="special-module">
                <div className="module-grid cols-2">
                  <div className="module-panel">
                    <Image
                      src="/foto-flavio-beraldo.webp"
                      alt="Flávio Beraldo"
                      width={480}
                      height={640}
                      sizes="(max-width: 760px) 100vw, 420px"
                      className="module-image portrait retrato-fixo retrato-pb"
                      loading="lazy"
                    />
                  </div>

                  <div>
                    <p className="semibold section-kicker module-gap-after">Seu professor</p>
                    <h2 className="module-gap-after">Flávio Beraldo</h2>
                    <p className="module-gap-after">
                      Diretor de Marketing da Ciclo E-commerce com +14 anos de experiência no
                      mercado digital. Já liderou mais de 300 projetos de marketing e e-commerce,
                      gerando mais de R$350 milhões em receita para marcas nacionais e
                      internacionais.
                    </p>
                    <p className="module-gap-after">
                      Seu objetivo no ECOM Shift é direto:{' '}
                      <strong>fazer você vender mais e de forma inteligente.</strong> 100% voltado
                      para marketing e vendas com método comprovado.
                    </p>

                    <div className="marcas-lista module-gap-after">
                      {MARCAS.map((m) => (
                        <span key={m}>{m}</span>
                      ))}
                    </div>

                    <BotaoCheckout placement="cta" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Fechamento ────────────────────────────────────────────── */}
          <section className="inner-section special-section paper" id="es-final">
            <div className="wrap narrow">
              <div className="special-module">
                <div className="centered">
                  <div className="module-flex module-gap-after">
                    <Image
                      src="/logo-ecomshift.png"
                      alt="ECOM Shift"
                      width={240}
                      height={80}
                      className="module-image special-logo"
                      loading="lazy"
                    />
                  </div>

                  <h2 className="module-gap-after">
                    Pronto para dominar o <em>Full Funnel Marketing?</em>
                  </h2>

                  <p className="module-gap-after">
                    +250 gestores já transformaram suas operações. Por apenas R$ 37,90, acesse o
                    método completo que a Ciclo E-commerce usa com as maiores marcas do Brasil.
                  </p>

                  <BotaoCheckout placement="cta" />

                  <p className="module-gap-before">
                    Acesso imediato · Método Full Funnel completo · Online, no seu ritmo
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <CtaFlutuante
          idAbertura="es-abertura"
          idFinal="es-final"
          titulo="ECOM Shift"
          subtitulo={PRECO}
        >
          <BotaoCheckout placement="header" />
        </CtaFlutuante>

        <CicloFooter />
      </div>
    </div>
  )
}
