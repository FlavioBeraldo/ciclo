import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ShiftHeader from '@/components/shift/ShiftHeader'
import ShiftFooter from '@/components/shift/ShiftFooter'
import Hourglass from '@/components/shift/Hourglass'
import FunnelCompare from '@/components/shift/FunnelCompare'
import ShiftVideoCarousel from '@/components/shift/ShiftVideoCarousel'
import ShiftMobileCta from '@/components/shift/ShiftMobileCta'
import { anton } from '@/components/shift/fonts'
import '@/components/shift/shift.css'

export const metadata: Metadata = {
  title: 'Consultoria E-com Shift | Seu funil termina na compra. Seu cliente não.',
  description:
    'Consultoria de 4 meses para e-commerces que já vendem e querem crescer sem depender de um único canal. Canais de venda, canais de mídia, recompra e geração de demanda lidos juntos.',
  keywords: [
    'consultoria e-commerce',
    'E-com Shift',
    'consultoria de marketing para e-commerce',
    'funil ampulheta',
    'geração de demanda',
    'recompra',
    'canais de venda',
    'Ciclo E-commerce',
  ],
  openGraph: {
    title: 'Consultoria E-com Shift | Seu funil termina na compra. Seu cliente não.',
    description:
      'Consultoria de 4 meses para e-commerces que já vendem e querem crescer sem depender de um único canal.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ciclo E-commerce',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Consultoria E-com Shift | Seu funil termina na compra. Seu cliente não.',
    description:
      'Consultoria de 4 meses para e-commerces que já vendem e querem crescer sem depender de um único canal.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cicloecommerce.com.br/consultoria-ecom-shift' },
}

const pillars = [
  {
    title: 'Canais de venda',
    desc: 'Loja própria, marketplaces, WhatsApp, televendas, social commerce. Onde o cliente já compra e onde a sua marca ainda não está.',
  },
  {
    title: 'Canais de mídia',
    desc: 'Cada canal com um papel definido, em vez de todos disputando o mesmo clique no fim do funil.',
  },
  {
    title: 'Recompra',
    desc: 'A base que já comprou entra na meta do mês, não no fim da lista.',
  },
  {
    title: 'Geração de demanda',
    desc: 'Ser lembrado antes de o cliente pesquisar. Quem chega procurando pela marca custa menos.',
  },
]

const modules = [
  {
    num: '01',
    title: 'Canais de venda',
    desc: 'Mapear onde o cliente compra hoje e quais são as oportunidades de expansão para novos canais.',
  },
  {
    num: '02',
    title: 'Canais de mídia',
    desc: 'Conectar canais, mensagens e momentos da jornada, em vez de avaliar cada canal isoladamente.',
  },
  {
    num: '03',
    title: 'Recompra e experiência',
    desc: 'Desenvolver a relação com a base de clientes e identificar as oportunidades de CRM da operação.',
  },
  {
    num: '04',
    title: 'Geração de demanda',
    desc: 'Fortalecer reconhecimento e consideração antes da compra, para a marca entrar na decisão.',
  },
]

// Cases e números já documentados no site da Ciclo. São resultados de projetos
// conduzidos pela agência — não são promessas de resultado desta consultoria.
//
// Cada número abaixo veio de outra página deste mesmo projeto, com a métrica e o
// período preservados. Onde o projeto não tem número documentado, o card fica
// sem métrica: nada aqui é estimado.
const cases = [
  {
    brand: 'Mamô Brasil',
    // Números já publicados em CasesSection (home)
    context: 'Mídia paga ligada ao CRM e às réguas de retenção.',
    metrics: [
      { value: '+200%', label: 'Vendas YoY' },
      { value: '+57%', label: 'LTV' },
    ],
  },
  {
    brand: 'DANKI',
    // "Crescimento de 230% em 3 anos de parceria", publicado no bloco Caso real
    // de /consultoria-para-e-commerce, junto ao depoimento da Danki
    context: 'DANKI e os resultados de Full Funnel Marketing com a Ciclo.',
    metrics: [{ value: '+230%', label: 'Crescimento em 3 anos' }],
  },
  {
    brand: 'KVRA',
    context: 'A jornada de crescimento da KVRA com Ciclo E-commerce.',
    metrics: [],
  },
  {
    brand: 'Líquido',
    context: 'Como a Líquido escalou seu e-commerce com Full Funnel Marketing.',
    metrics: [],
  },
]

// Depoimentos em vídeo já publicados em /depoimentos — mesmas fontes, marcas,
// cargos e descrições, sem nenhuma associação nova entre marca e depoimento.
const videos = [
  {
    id: 'djykk9EFghg',
    brand: 'Líquido',
    role: 'CEO – Líquido',
    description: 'Como a Líquido escalou seu e-commerce com Full Funnel Marketing.',
  },
  {
    id: 'xVdqhprwKWw',
    brand: 'KVRA',
    role: 'Head de Marketing – KVRA',
    description: 'A jornada de crescimento da KVRA com Ciclo E-commerce.',
  },
  {
    id: '6B2XYATbK3Q',
    brand: 'DANKI',
    role: 'Fundador – DANKI',
    description: 'DANKI e os resultados de Full Funnel Marketing com a Ciclo.',
  },
  {
    id: 'EhnxUiDMMRg',
    brand: 'Mamô Brasil',
    role: 'CEO – Mamô Brasil',
    description: 'Mamô Brasil e sua estratégia de crescimento sustentável.',
  },
]

const logos = [
  { name: 'Motorola', src: '/brands/motorola.png' },
  { name: 'GoPro', src: '/brands/gopro.png' },
  { name: 'Shiseido', src: '/brands/shiseido.png' },
  { name: 'NARS', src: '/brands/nars.png' },
  { name: "Jack Link's", src: '/brands/jacklinks.png' },
  { name: 'DANKI', src: '/brands/danki.png' },
  { name: 'Líquido', src: '/brands/liquido.png' },
  { name: 'TVZ', src: '/brands/tvz.png' },
]

// Nomes, cargos e bios conforme já publicados no próprio site (página /ofatorm).
const team = [
  {
    name: 'Felipe Beraldo',
    role: 'Sócio e CEO',
    photo: '/foto-felipe-beraldo.webp',
    bio: 'Empreendedor serial e especialista em crescimento de e-commerce. Lidera a Ciclo E-commerce na missão de escalar marcas com estratégia e dados.',
  },
  {
    name: 'Flávio Beraldo',
    role: 'Sócio e Diretor de Marketing',
    photo: '/foto-flavio-beraldo.webp',
    bio: 'Estrategista de marketing com foco em Full Funnel para e-commerce. Conecta marca, dados e criatividade para gerar crescimento previsível.',
  },
  {
    name: 'Alan Rocumback',
    role: 'Sócio e COO',
    photo: '/foto-alan-rocumback.webp',
    bio: 'Especialista em operações e escala de negócios digitais. Co-fundador da Ciclo E-commerce, responsável por estruturar processos que transformam resultados.',
  },
]

const faq = [
  {
    q: 'O que é a Consultoria E-com Shift?',
    a: 'É uma consultoria de marketing e e-commerce de 4 meses baseada nos quatro motores do E-com Shift — canais de venda, canais de mídia, recompra e geração de demanda — e na jornada completa do cliente, do reconhecimento à expansão.',
  },
  {
    q: 'Para quem ela é?',
    a: 'Para empresários, donos, fundadores e sócios de e-commerce, e para líderes de Marketing e E-commerce: C-levels, diretores, gestores e supervisores que precisam conectar canais, equipe e indicadores a uma estratégia de crescimento.',
  },
  {
    q: 'Qual é a duração?',
    a: '4 meses.',
  },
  {
    q: 'A consultoria trata apenas de aquisição?',
    a: 'Não. Além da captação, ela trata de geração de demanda, canais de venda, compra e recompra, fidelização e expansão — a jornada inteira, e não só o momento da conversão.',
  },
  {
    q: 'Como faço para aplicar?',
    a: 'Pelo botão de aplicação desta página, que leva ao formulário de Aplicação. Você conta o momento da sua operação e as informações seguem para avaliação do time da Ciclo E-commerce.',
  },
]

const serviceLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Consultoria E-com Shift',
  serviceType: 'Consultoria de marketing e e-commerce',
  description:
    'Consultoria de 4 meses para e-commerces que já vendem e querem crescer sem depender de um único canal, orientada pelos quatro motores do E-com Shift: canais de venda, canais de mídia, recompra e geração de demanda.',
  url: 'https://cicloecommerce.com.br/consultoria-ecom-shift',
  areaServed: 'BR',
  inLanguage: 'pt-BR',
  provider: {
    '@type': 'Organization',
    name: 'Ciclo E-commerce',
    url: 'https://cicloecommerce.com.br',
    logo: {
      '@type': 'ImageObject',
      url: 'https://cicloecommerce.com.br/logo-ciclo.png',
    },
  },
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

function Cta({ ghost = false, children }: { ghost?: boolean; children: React.ReactNode }) {
  return (
    <Link href="/aplicacao" className={ghost ? 'shift-cta-ghost' : 'shift-cta'}>
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  )
}

// Rótulo único de todos os CTAs da landing
const CTA_LABEL = 'Aplicar para a consultoria'

export default function ConsultoriaEcomShiftPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className={`shift ${anton.variable}`}>
        <ShiftHeader />

        <main>
          {/* ── 1. HERO ─────────────────────────────────────────────────── */}
          <section className="shift-container pt-8 md:pt-10">
            <div className="shift-signature shift-signature--hero">
              <span className="shift-eyebrow">Ciclo E-commerce</span>
              <span className="shift-eyebrow">Consultoria · 4 meses</span>
            </div>

            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16 pt-12 pb-14 md:pt-16 md:pb-20">
              <div>
                <h1 className="shift-display shift-h1">
                  Seu funil termina na compra.{' '}
                  <span className="block">Seu cliente não.</span>
                </h1>

                <p className="shift-serif mt-6 text-xl md:text-2xl" style={{ color: '#efeeed' }}>
                  Consultoria de 4 meses para e-commerces que já vendem e querem crescer sem
                  depender de um único canal.
                </p>

                <p className="shift-lead shift-measure mt-6">
                  Quatro meses com os sócios da Ciclo dentro da sua operação: canais de venda,
                  canais de mídia, recompra e geração de demanda lidos juntos, com CAC, LTV e
                  recompra na mesma tabela.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Cta>{CTA_LABEL}</Cta>
                  <Link href="#metodo" className="shift-cta-ghost">
                    Ver o método
                  </Link>
                </div>
                <p className="shift-body mt-3">8 perguntas, cerca de 2 minutos.</p>
              </div>

              <div>
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {team.map((person, i) => (
                    <div key={person.name}>
                      <div className="shift-photo-frame">
                        <Image
                          src={person.photo}
                          alt={`${person.name}, ${person.role} da Ciclo E-commerce`}
                          width={1333}
                          height={1300}
                          sizes="(max-width: 1024px) 30vw, 180px"
                          className="shift-photo"
                          priority={i === 0}
                        />
                      </div>
                      <p className="shift-eyebrow mt-2 block leading-tight">{person.name}</p>
                    </div>
                  ))}
                </div>
                <p className="shift-body mt-4">
                  Felipe, Flávio e Alan conduzem a consultoria pessoalmente.
                </p>
              </div>
            </div>
            {/* A partir daqui a barra fixa do mobile entra em cena */}
            <div id="fim-do-hero" aria-hidden="true" className="h-px w-full" />
          </section>

          {/* ── 2. OS QUATRO MOTORES ────────────────────────────────────── */}
          <section className="shift-container pb-10 md:pb-14">
            <h2 className="shift-display shift-h2 mb-8">Os quatro motores</h2>
            <div className="shift-pillars">
              {pillars.map((pillar, i) => (
                <div key={pillar.title} className="shift-pillar">
                  <span className="shift-pillar-index">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="shift-display shift-h3 shift-pillar-title">{pillar.title}</h3>
                  <p className="shift-body mt-3">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── 3. PROVA: MARCAS ATENDIDAS ──────────────────────────────── */}
          <section className="shift-container pb-14 md:pb-20">
            <p className="shift-eyebrow text-center">
              Mais de 300 marcas atendidas pela Ciclo E-commerce
            </p>
            <div className="shift-logos mt-7">
              {logos.map((logo) => (
                <div key={logo.name} className="shift-logo-cell">
                  <Image src={logo.src} alt={logo.name} width={160} height={60} sizes="140px" />
                </div>
              ))}
            </div>
          </section>

          {/* ── 4. MÉTODO + COMPARAÇÃO, em um bloco só ──────────────────── */}
          <section id="metodo" className="shift-paper shift-section">
            <div className="shift-container">
              <span className="shift-eyebrow shift-eyebrow--purple">O método</span>
              <h2 className="shift-display shift-h2 shift-measure-wide mt-4">
                A mesma jornada, da primeira lembrança à indicação
              </h2>
              <p className="shift-lead shift-measure-wide mt-6">
                Seis etapas, cada uma com um papel na receita e um indicador para decidir. O funil
                tradicional para na terceira.
              </p>

              <div className="mt-14 md:mt-20">
                <Hourglass />
              </div>

              <div className="mt-14 md:mt-20">
                <hr className="shift-rule" />
                <div className="grid gap-6 md:grid-cols-3 pt-6">
                  {[
                    { k: 'CAC', v: 'Quanto custa conquistar um novo cliente.' },
                    { k: 'LTV', v: 'Quanto esse cliente rende até a última compra.' },
                    { k: 'Recompra', v: 'Quanto da receita do mês vem de quem já comprou.' },
                  ].map((item) => (
                    <div key={item.k}>
                      <h3 className="shift-display shift-h3">{item.k}</h3>
                      <p className="shift-body mt-2">{item.v}</p>
                    </div>
                  ))}
                </div>
                <p className="shift-body mt-6">
                  Lidos juntos. Separados, cada um justifica a decisão errada.
                </p>
              </div>

              {/* Comparação, no mesmo bloco: sem nova introdução e sem CTA no meio */}
              <div className="mt-16 md:mt-24">
                <h2 className="shift-display shift-h2 shift-measure-wide">
                  O funil tradicional para onde o seu cliente começa
                </h2>

                <div className="mt-12">
                  <FunnelCompare />
                </div>

                <p className="shift-lead shift-measure-wide mt-12">
                  Você para de decidir olhando só o custo do último clique.
                </p>
              </div>
            </div>
          </section>

          {/* ── 5. COMO FUNCIONA ────────────────────────────────────────── */}
          <section id="a-consultoria" className="shift-paper shift-section">
            <div className="shift-container">
              <span className="shift-eyebrow shift-eyebrow--purple">Como funciona</span>
              <h2 className="shift-display shift-h2 shift-measure-wide mt-4">
                O que acontece nos 4 meses
              </h2>
              <p className="shift-lead shift-measure-wide mt-6">
                Quatro frentes, conduzidas na ordem que a sua operação pedir.
              </p>

              <div className="mt-12">
                {modules.map((mod) => (
                  <article key={mod.num} className="shift-module">
                    <span className="shift-module-num">{mod.num}</span>
                    <h3 className="shift-display shift-h3">{mod.title}</h3>
                    <p className="shift-body">{mod.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ── 6. PROVAS ───────────────────────────────────────────────── */}
          <section className="shift-section">
            <div className="shift-container">
              <span className="shift-eyebrow shift-eyebrow--purple">Experiência</span>
              <h2 className="shift-display shift-h2 shift-measure-wide mt-4">
                O que já aconteceu em operações reais
              </h2>
              <p className="shift-lead shift-measure-wide mt-6">Quatro operações, com número.</p>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-12">
                {cases.map((c) => (
                  <article key={c.brand} className="shift-case">
                    <hr className="shift-rule" />
                    <h3 className="shift-display shift-h3 mt-5">{c.brand}</h3>
                    <p className="shift-body mt-2">{c.context}</p>
                    {c.metrics.length > 0 && (
                      <dl className="shift-case-metrics">
                        {c.metrics.map((metric) => (
                          <div key={metric.label}>
                            <dt className="shift-case-figure">{metric.value}</dt>
                            <dd className="shift-eyebrow mt-1">{metric.label}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </article>
                ))}
              </div>

              <p className="shift-body mt-10 shift-measure-wide">
                Resultados de projetos conduzidos pela Ciclo E-commerce para essas marcas, não uma
                promessa de resultado da consultoria.
              </p>
            </div>
          </section>

          {/* ── 7. DEPOIMENTOS EM VÍDEO ─────────────────────────────────── */}
          <section className="shift-section shift-section--tight">
            <div className="shift-container">
              <h2 className="shift-display shift-h2 shift-measure-wide mb-8">
                Quem viveu a operação, conta
              </h2>
              <ShiftVideoCarousel videos={videos} />
            </div>
          </section>

          {/* ── 7. EQUIPE ───────────────────────────────────────────────── */}
          <section id="quem-conduz" className="shift-section" style={{ backgroundColor: '#191917' }}>
            <div className="shift-container">
              <span className="shift-eyebrow shift-eyebrow--purple">Quem conduz</span>
              <h2 className="shift-display shift-h2 shift-measure-wide mt-4">
                Estratégia com quem conhece a operação
              </h2>

              <div className="grid gap-8 sm:grid-cols-3 mt-12">
                {team.map((person) => (
                  <article key={person.name}>
                    <div className="shift-photo-frame">
                      <Image
                        src={person.photo}
                        alt={`Retrato de ${person.name}, ${person.role} da Ciclo E-commerce`}
                        width={1333}
                        height={1300}
                        sizes="(max-width: 640px) 90vw, 33vw"
                        className="shift-photo"
                      />
                    </div>
                    <h3 className="shift-display shift-h3 mt-5">{person.name}</h3>
                    <p className="shift-eyebrow mt-2 block">{person.role} · Ciclo E-commerce</p>
                    <p className="shift-body mt-3">{person.bio}</p>
                  </article>
                ))}
              </div>

              <div className="mt-12">
                <Cta>{CTA_LABEL}</Cta>
              </div>
            </div>
          </section>

          {/* ── 8. PÚBLICO ──────────────────────────────────────────────── */}
          <section className="shift-paper shift-section">
            <div className="shift-container">
              <span className="shift-eyebrow shift-eyebrow--purple">Para quem é</span>
              <h2 className="shift-display shift-h2 shift-measure-wide mt-4">
                Para quem decide o próximo passo do e-commerce
              </h2>

              <div className="shift-compare mt-12">
                <div className="shift-compare-col">
                  <span className="shift-eyebrow">Negócio</span>
                  <h3 className="shift-display shift-h3 mt-3">
                    Empresários, donos, fundadores e sócios
                  </h3>
                  <p className="shift-body mt-4 shift-measure">
                    Para quem quer desenvolver a operação com prioridades claras, visão de negócio e
                    uma estratégia que conecte aquisição e recompra.
                  </p>
                </div>
                <div className="shift-compare-col">
                  <span className="shift-eyebrow">Marketing e e-commerce</span>
                  <h3 className="shift-display shift-h3 mt-3">
                    Líderes de Marketing e E-commerce
                  </h3>
                  <p className="shift-body mt-4 shift-measure">
                    Para C-levels, diretores, gestores e supervisores que precisam conectar canais,
                    equipe e indicadores a uma estratégia de crescimento.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 9. FECHAMENTO ───────────────────────────────────────────── */}
          <section className="shift-section">
            <div className="shift-container">
              <h2 className="shift-display shift-h2 shift-measure-wide">
                Conte o momento da sua operação
              </h2>
              <p className="shift-lead shift-measure-wide mt-6">
                8 perguntas, cerca de 2 minutos. O time da Ciclo lê cada aplicação e responde se
                faz sentido conversar.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Cta>{CTA_LABEL}</Cta>
                <span className="shift-eyebrow">Consultoria de 4 meses</span>
              </div>
            </div>
          </section>

          {/* ── 10. FAQ ─────────────────────────────────────────────────── */}
          <section className="shift-section shift-section--tight">
            <div className="shift-container">
              <span className="shift-eyebrow shift-eyebrow--purple">Perguntas frequentes</span>
              <div className="mt-8 max-w-3xl">
                <hr className="shift-rule" />
                {faq.map((item) => (
                  <details key={item.q} className="shift-faq-item">
                    <summary>{item.q}</summary>
                    <p className="shift-body shift-faq-answer">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>

        <ShiftFooter />
        <ShiftMobileCta />
      </div>
    </>
  )
}
