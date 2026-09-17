import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ShiftHeader from '@/components/shift/ShiftHeader'
import ShiftFooter from '@/components/shift/ShiftFooter'
import Hourglass from '@/components/shift/Hourglass'
import { anton } from '@/components/shift/fonts'
import '@/components/shift/shift.css'

export const metadata: Metadata = {
  title: 'Consultoria E-com Shift | 4 meses para destravar o crescimento do seu e-commerce',
  description:
    'Consultoria de 4 meses para empresários e líderes de e-commerce. Conecte canais de venda, canais de mídia, recompra e geração de demanda em uma estratégia de crescimento com método.',
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
    title: 'Consultoria E-com Shift | Ciclo E-commerce',
    description:
      'Uma consultoria de 4 meses para conectar marketing, canais de venda e recompra na estratégia do próximo estágio da sua operação.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ciclo E-commerce',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Consultoria E-com Shift | Ciclo E-commerce',
    description: 'Consultoria de 4 meses para líderes e empresários de e-commerce.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cicloecommerce.com.br/consultoria-ecom-shift' },
}

const pillars = [
  {
    title: 'Canais de venda',
    desc: 'Onde o cliente compra hoje e onde a operação ainda pode estar presente.',
  },
  {
    title: 'Canais de mídia',
    desc: 'Papéis definidos para cada canal, conectados aos momentos da jornada.',
  },
  {
    title: 'Recompra',
    desc: 'A relação com quem já comprou como parte da receita, não como sobra.',
  },
  {
    title: 'Geração de demanda',
    desc: 'Reconhecimento e consideração construídos antes da decisão de compra.',
  },
]

const isolated = [
  'Concentração da receita em poucos canais.',
  'Mídia avaliada apenas pela última venda.',
  'Decisões tomadas sem prioridades claras.',
  'Pouca atenção à base de clientes já conquistada.',
  'Marca ausente antes do momento da decisão.',
]

const oriented = [
  'Canais de venda com papéis definidos.',
  'Geração e captação de demanda conectadas.',
  'Metas e indicadores de negócio orientando a operação.',
  'CRM, experiência e recompra dentro da estratégia.',
  'Reconhecimento e consideração construídos de forma contínua.',
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
const cases = [
  {
    brand: 'Mamô Brasil',
    context: 'Aquisição paga integrada a CRM e réguas de retenção.',
    metrics: [
      { value: '+200%', label: 'Vendas YoY' },
      { value: '+57%', label: 'LTV' },
    ],
  },
  {
    brand: 'GoPro Brasil',
    context: 'Mídia full funnel com otimização contínua de campanhas e criativos.',
    metrics: [
      { value: '+120%', label: 'Vendas YoY' },
      { value: '-37%', label: 'CAC' },
    ],
  },
  {
    brand: 'Gringa',
    context: 'CRM e automações de recompra, com fidelização e indicação.',
    metrics: [
      { value: '+35%', label: 'Taxa de recompra YoY' },
      { value: '120→55 dias', label: 'Recência de compra' },
    ],
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
    'Consultoria de 4 meses para empresários e líderes de e-commerce, orientada pelos quatro motores do E-com Shift: canais de venda, canais de mídia, recompra e geração de demanda.',
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
              <span className="shift-eyebrow">Consultoria de 4 meses</span>
            </div>

            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16 pt-12 pb-14 md:pt-16 md:pb-20">
              <div>
                <h1 className="shift-display shift-h1">
                  Consultoria{' '}
                  <span className="block">E-com Shift</span>
                </h1>

                <p className="shift-serif mt-6 text-xl md:text-2xl" style={{ color: '#efeeed' }}>
                  Destrave o crescimento do seu e-commerce.
                </p>

                <p className="shift-lead shift-measure mt-6">
                  Conecte marketing, canais de venda e recompra em uma estratégia para o próximo
                  estágio da sua operação.
                </p>

                <p className="shift-body shift-measure mt-4">
                  Uma consultoria de 4 meses para empresários e líderes que querem tomar decisões de
                  crescimento com método.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Cta>Quero aplicar</Cta>
                  <Link href="#metodo" className="shift-cta-ghost">
                    Conhecer o método
                  </Link>
                </div>
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
                  Os sócios da Ciclo E-commerce conduzem a estratégia da consultoria.
                </p>
              </div>
            </div>
          </section>

          {/* ── 2. FAIXA DE PILARES ─────────────────────────────────────── */}
          <section className="shift-container pb-14 md:pb-20">
            <div className="shift-pillars">
              {pillars.map((pillar, i) => (
                <div key={pillar.title} className="shift-pillar">
                  <span className="shift-pillar-index">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="shift-display shift-h3 shift-pillar-title">{pillar.title}</h2>
                  <p className="shift-body mt-3">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── 3. MÉTODO ───────────────────────────────────────────────── */}
          <section id="metodo" className="shift-paper shift-section">
            <div className="shift-container">
              <span className="shift-eyebrow shift-eyebrow--purple">O método</span>
              <h2 className="shift-display shift-h2 shift-measure-wide mt-4">
                O crescimento continua depois da primeira compra
              </h2>
              <p className="shift-lead shift-measure-wide mt-6">
                O E-com Shift conecta toda a jornada do cliente: da primeira lembrança da marca à
                recompra, à fidelização e à indicação. Cada etapa tem um papel na receita e
                indicadores para orientar suas decisões.
              </p>

              <div className="mt-14 md:mt-20">
                <Hourglass />
              </div>

              <div className="mt-14 md:mt-20">
                <hr className="shift-rule" />
                <div className="grid gap-6 md:grid-cols-3 pt-6">
                  {[
                    { k: 'CAC', v: 'Quanto custa conquistar um novo cliente.' },
                    { k: 'LTV', v: 'Quanto um cliente representa ao longo da relação.' },
                    { k: 'Recompra', v: 'Quanto da receita vem de quem já comprou.' },
                  ].map((item) => (
                    <div key={item.k}>
                      <h3 className="shift-display shift-h3">{item.k}</h3>
                      <p className="shift-body mt-2">{item.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── 4. COMPARAÇÃO ───────────────────────────────────────────── */}
          <section className="shift-section">
            <div className="shift-container">
              <span className="shift-eyebrow shift-eyebrow--purple">Por que quatro motores</span>
              <h2 className="shift-display shift-h2 shift-measure-wide mt-4">
                Seu e-commerce precisa de mais de um motor para crescer
              </h2>

              <div className="shift-compare mt-12">
                <div className="shift-compare-col">
                  <h3 className="shift-display shift-h3">
                    Quando o crescimento depende de ações isoladas
                  </h3>
                  <ul className="shift-list mt-6">
                    {isolated.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="shift-compare-col">
                  <h3 className="shift-display shift-h3">
                    Uma operação orientada pelo E-com Shift
                  </h3>
                  <ul className="shift-list shift-list--accent mt-6">
                    {oriented.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="shift-lead shift-measure-wide mt-12">
                Mais clareza para decidir onde investir, o que priorizar e como desenvolver sua
                operação.
              </p>
              <div className="mt-8">
                <Cta>Quero aplicar</Cta>
              </div>
            </div>
          </section>

          {/* ── 5. COMO FUNCIONA ────────────────────────────────────────── */}
          <section id="a-consultoria" className="shift-paper shift-section">
            <div className="shift-container">
              <span className="shift-eyebrow shift-eyebrow--purple">Como funciona</span>
              <h2 className="shift-display shift-h2 shift-measure-wide mt-4">
                4 meses para conectar estratégia e crescimento
              </h2>
              <p className="shift-lead shift-measure-wide mt-6">
                Uma jornada de consultoria orientada pelos desafios da sua operação e pelos quatro
                motores do E-com Shift.
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
                Experiência aplicada a operações reais
              </h2>
              <p className="shift-lead shift-measure-wide mt-6">
                A Ciclo E-commerce já atendeu mais de 300 marcas em projetos de marketing e
                e-commerce. É essa experiência de operação que orienta a consultoria.
              </p>

              <div className="grid gap-8 md:grid-cols-3 mt-12">
                {cases.map((c) => (
                  <article key={c.brand}>
                    <hr className="shift-rule" />
                    <h3 className="shift-display shift-h3 mt-5">{c.brand}</h3>
                    <p className="shift-body mt-2">{c.context}</p>
                    <dl className="mt-5 space-y-3">
                      {c.metrics.map((metric) => (
                        <div key={metric.label}>
                          <dt className="shift-figure" style={{ color: '#efeeed' }}>
                            {metric.value}
                          </dt>
                          <dd className="shift-eyebrow mt-1">{metric.label}</dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                ))}
              </div>

              <p className="shift-body mt-10 shift-measure-wide">
                Resultados de projetos conduzidos pela Ciclo E-commerce para essas marcas. São um
                retrato da experiência da agência, não uma promessa de resultado da consultoria.
              </p>

              <div className="mt-12">
                <span className="shift-eyebrow">Algumas marcas atendidas pela Ciclo</span>
                <div className="shift-logos mt-6">
                  {logos.map((logo) => (
                    <Image
                      key={logo.name}
                      src={logo.src}
                      alt={logo.name}
                      width={160}
                      height={60}
                      sizes="120px"
                      className="h-[26px] w-auto"
                    />
                  ))}
                </div>
              </div>
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
                <Cta>Quero aplicar para a consultoria</Cta>
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
                O próximo estágio do seu e-commerce começa com uma nova estratégia
              </h2>
              <p className="shift-lead shift-measure-wide mt-6">
                Conheça a Consultoria E-com Shift e conte para a gente o momento da sua operação.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Cta>Quero aplicar</Cta>
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
      </div>
    </>
  )
}
