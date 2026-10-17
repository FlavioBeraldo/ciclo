import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import CicloHeader from '@/components/ciclo/CicloHeader'
import CicloFooter from '@/components/ciclo/CicloFooter'
import Breadcrumb from '@/components/ciclo/interior/Breadcrumb'
import PlayerVideo from '@/components/ciclo/PlayerVideo'
import ValorDeCase from '@/components/ciclo/ValorDeCase'
import CtaFlutuante from '@/components/ciclo/CtaFlutuante'
import Hourglass from '@/components/shift/Hourglass'
import FunnelCompare from '@/components/shift/FunnelCompare'
import { cases } from '@/lib/cases'
import { playfair2026 } from '@/components/ciclo/fonts'
import '@/components/ciclo/base.css'
import '@/components/ciclo/interiors.css'
// O diagrama da ampulheta e a comparação de funis continuam sendo os mesmos
// componentes aprovados. A folha deles vive inteira sob `.shift` e não toca
// em nada do site — por isso dá para reaproveitá-los sem risco de vazamento.
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

// ─── Conteúdo, o mesmo que a página já trazia ───────────────────────────────

const MOTORES = [
  {
    num: '01',
    title: 'Canais de venda',
    desc: 'Loja própria, marketplaces, WhatsApp, televendas, social commerce. Onde o cliente já compra e onde a sua marca ainda não está.',
  },
  {
    num: '02',
    title: 'Canais de mídia',
    desc: 'Cada canal com um papel definido, em vez de todos disputando o mesmo clique no fim do funil.',
  },
  {
    num: '03',
    title: 'Recompra',
    desc: 'A base que já comprou entra na meta do mês, não no fim da lista.',
  },
  {
    num: '04',
    title: 'Geração de demanda',
    desc: 'Ser lembrado antes de o cliente pesquisar. Quem chega procurando pela marca custa menos.',
  },
]

const FRENTES = [
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

const INDICADORES = [
  { sigla: 'CAC', texto: 'Quanto custa conquistar um novo cliente.' },
  { sigla: 'LTV', texto: 'Quanto esse cliente rende até a última compra.' },
  { sigla: 'Recompra', texto: 'Quanto da receita do mês vem de quem já comprou.' },
]

// Depoimentos em vídeo já publicados em /depoimentos — mesmas fontes, marcas e
// descrições, sem nenhuma associação nova entre marca e depoimento. O cargo do
// depoente não é exibido em lugar nenhum, então nem viaja para o cliente.
const DEPOIMENTOS = [
  {
    id: 'djykk9EFghg',
    brand: 'Líquido',
    description: 'Como a Líquido escalou seu e-commerce com Full Funnel Marketing.',
  },
  {
    id: 'xVdqhprwKWw',
    brand: 'KVRA',
    description: 'A jornada de crescimento da KVRA com Ciclo E-commerce.',
  },
  {
    id: '6B2XYATbK3Q',
    brand: 'DANKI',
    description: 'DANKI e os resultados de Full Funnel Marketing com a Ciclo.',
  },
  {
    // Vídeo novo do case da Mamô, indicado pelo usuário em 18/09/2026
    id: 'MlDyvGg7rGs',
    brand: 'Mamô Brasil',
    description: 'Mamô Brasil e sua estratégia de crescimento sustentável.',
  },
]

const LOGOS = [
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
const TIME = [
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

const PUBLICOS = [
  {
    rotulo: 'Negócio',
    titulo: 'Empresários, donos, fundadores e sócios',
    texto:
      'Para quem quer desenvolver a operação com prioridades claras, visão de negócio e uma estratégia que conecte aquisição e recompra.',
  },
  {
    rotulo: 'Marketing e e-commerce',
    titulo: 'Líderes de Marketing e E-commerce',
    texto:
      'Para C-levels, diretores, gestores e supervisores que precisam conectar canais, equipe e indicadores a uma estratégia de crescimento.',
  },
]

const FAQ = [
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
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

// Rótulo único de todos os CTAs da landing
const CTA_LABEL = 'Aplicar para a consultoria'

function Seta() {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function Aplicar() {
  return (
    <Link href="/aplicacao" className="semibold action-link">
      {CTA_LABEL}
      <Seta />
    </Link>
  )
}

// /consultoria-ecom-shift no design 2026, pelo layout do kit.
//
// Conteúdo, metadata, canonical e os dois JSON-LD (Service e FAQPage)
// preservados. Os destinos continuam os mesmos: todo CTA vai para /aplicacao,
// e as âncoras #metodo, #a-consultoria e #quem-conduz seguem existindo.
//
// Esta página não emite evento nenhum: a conversão acontece em /aplicacao.
export default function ConsultoriaEcomShiftPage() {
  return (
    <div className={`ciclo2026 ${playfair2026.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="inner">
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>

        <CicloHeader />

        <main id="conteudo">
          {/* ── Abertura ──────────────────────────────────────────────── */}
          <section className="inner-section special-section special-hero" id="ces-abertura">
            <div className="wrap narrow">
              <Breadcrumb
                etapas={[{ rotulo: 'Início', href: '/' }, { rotulo: 'Consultoria E-com Shift' }]}
              />

              <div className="special-module">
                <div className="assinatura module-gap-after">
                  <span className="section-kicker">Ciclo E-commerce</span>
                  <span className="section-kicker">Consultoria · 4 meses</span>
                </div>

                <div className="module-grid cols-2">
                  <div>
                    <h1>
                      <span className="eyebrow h1-kicker">
                        <span />
                        Consultoria E-com Shift
                      </span>
                      Seu funil termina na compra. <em>Seu cliente não.</em>
                    </h1>

                    <p className="module-gap-before">
                      Consultoria de 4 meses para e-commerces que já vendem e querem crescer sem
                      depender de um único canal.
                    </p>

                    <p className="module-gap-before">
                      Quatro meses com os sócios da Ciclo dentro da sua operação: canais de venda,
                      canais de mídia, recompra e geração de demanda lidos juntos, com CAC, LTV e
                      recompra na mesma tabela.
                    </p>

                    <div className="module-flex module-gap-before">
                      <Aplicar />
                      <a href="#metodo" className="textlink">
                        Ver o método
                      </a>
                    </div>

                    <p className="module-gap-before">8 perguntas, cerca de 2 minutos.</p>
                  </div>

                  <div>
                    <div className="module-grid cols-3">
                      {TIME.map((p, i) => (
                        <div key={p.name}>
                          <Image
                            src={p.photo}
                            alt={`${p.name}, ${p.role} da Ciclo E-commerce`}
                            width={600}
                            height={800}
                            sizes="(max-width: 760px) 30vw, 180px"
                            className="module-image portrait retrato-fixo"
                            priority={i === 0}
                          />
                          <p className="module-gap-before">{p.name}</p>
                        </div>
                      ))}
                    </div>
                    <p className="module-gap-before">
                      Felipe, Flávio e Alan conduzem a consultoria pessoalmente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Os quatro motores ─────────────────────────────────────── */}
          <section className="inner-section special-section paper">
            <div className="wrap narrow">
              <div className="special-module">
                <h2 className="semibold module-gap-after">Os quatro motores</h2>

                <div className="module-grid cols-4">
                  {MOTORES.map((m) => (
                    <div className="module-panel" key={m.num}>
                      <span className="section-kicker">{m.num}</span>
                      <h3 className="semibold">{m.title}</h3>
                      <p className="module-gap-before">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Marcas ────────────────────────────────────────────────── */}
          <section className="inner-section special-section">
            <div className="wrap narrow">
              <div className="special-module">
                <p className="centered">Mais de 300 marcas atendidas pela Ciclo E-commerce</p>
                <div className="module-flex faixa-marcas module-gap-before">
                  {LOGOS.map((l) => (
                    <Image
                      key={l.name}
                      src={l.src}
                      alt={l.name}
                      width={220}
                      height={84}
                      sizes="110px"
                      className="module-image brandmark"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="section-fade paper-dark" aria-hidden="true" />

          {/* ── O método ──────────────────────────────────────────────── */}
          <section className="section dark" id="metodo">
            <div className="wrap narrow">
              <div className="eyebrow">
                <span />O método
              </div>
              <h2>A mesma jornada, da primeira lembrança à indicação</h2>
              <p className="lead">
                Seis etapas, cada uma com um papel na receita e um indicador para decidir. O funil
                tradicional para na terceira.
              </p>

              {/* O diagrama aprovado, com a folha própria dele */}
              <div className="shift diagrama-shift">
                <Hourglass />
              </div>

              <div className="module-grid cols-3 indicadores">
                {INDICADORES.map((i) => (
                  <div key={i.sigla}>
                    <h3>{i.sigla}</h3>
                    <p>{i.texto}</p>
                  </div>
                ))}
              </div>
              <p className="lead">
                Lidos juntos. Separados, cada um justifica a decisão errada.
              </p>

              <h2 className="module-gap-before">
                O funil tradicional para onde o seu cliente começa
              </h2>
              <div className="shift diagrama-shift">
                <FunnelCompare />
              </div>
              <p className="lead">
                Você para de decidir olhando só o custo do último clique.
              </p>
            </div>
          </section>

          <div className="section-fade dark-paper" aria-hidden="true" />

          {/* ── O que acontece nos 4 meses ────────────────────────────── */}
          <section className="inner-section special-section paper" id="a-consultoria">
            <div className="wrap narrow">
              <div className="special-module">
                <p className="semibold section-kicker module-gap-after">Como funciona</p>
                <h2 className="semibold">O que acontece nos 4 meses</h2>
                <p className="module-gap-before">
                  Quatro frentes, conduzidas na ordem que a sua operação pedir.
                </p>

                <div className="module-grid cols-4 module-gap-before">
                  {FRENTES.map((f) => (
                    <div className="module-panel" key={f.num}>
                      <span className="section-kicker">{f.num}</span>
                      <h3 className="semibold">{f.title}</h3>
                      <p className="module-gap-before">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Cases ─────────────────────────────────────────────────── */}
          <section className="inner-section special-section">
            <div className="wrap narrow">
              <div className="special-module">
                <p className="semibold section-kicker module-gap-after">Experiência</p>
                <h2 className="semibold">O que já aconteceu em operações reais</h2>
                <p className="module-gap-before">Quatro operações, com número.</p>

                <div className="module-grid cols-4 module-gap-before">
                  {cases.map((c) => (
                    <div className="module-panel" key={c.brand}>
                      {c.image && (
                        <Image
                          src={c.image}
                          alt={`${c.brand}, marca atendida pela Ciclo E-commerce`}
                          width={900}
                          height={600}
                          sizes="(max-width: 760px) 100vw, 300px"
                          className="module-image"
                          loading="lazy"
                        />
                      )}
                      <span className="section-kicker module-gap-before">{c.category}</span>
                      <h3 className="semibold">{c.brand}</h3>

                      <p className="semibold rotulo-case module-gap-before">Desafio</p>
                      <p>{c.challenge}</p>

                      <p className="semibold rotulo-case">Ação</p>
                      <p>{c.action}</p>

                      <p className="semibold rotulo-case">Resultado</p>
                      <dl className="metricas-case">
                        {c.metrics.map((m) => (
                          <div key={m.label}>
                            <dt>
                              <ValorDeCase valor={m.value} />
                            </dt>
                            <dd>{m.label}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>

                <p className="module-gap-before">
                  Resultados de projetos conduzidos pela Ciclo E-commerce para essas marcas, não
                  uma promessa de resultado da consultoria.
                </p>
              </div>
            </div>
          </section>

          {/* ── Depoimentos ───────────────────────────────────────────── */}
          <section className="inner-section special-section">
            <div className="wrap narrow">
              <div className="special-module">
                <h2 className="semibold module-gap-after">Quem viveu a operação, conta</h2>

                <div className="module-grid cols-4">
                  {DEPOIMENTOS.map((d) => (
                    <div key={d.id}>
                      <PlayerVideo
                        videoId={d.id}
                        titulo={`Depoimento ${d.brand} — ${d.description}`}
                        sizes="(max-width: 760px) 100vw, 300px"
                      />
                      <h3 className="semibold module-gap-before">{d.brand}</h3>
                      <p className="module-gap-before">{d.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Quem conduz ───────────────────────────────────────────── */}
          <section className="inner-section special-section paper" id="quem-conduz">
            <div className="wrap narrow">
              <div className="special-module">
                <p className="semibold section-kicker module-gap-after">Quem conduz</p>
                <h2 className="semibold">Estratégia com quem conhece a operação</h2>

                <div className="module-grid cols-3 module-gap-before">
                  {TIME.map((p) => (
                    <div className="module-panel" key={p.name}>
                      <Image
                        src={p.photo}
                        alt={`Retrato de ${p.name}, ${p.role} da Ciclo E-commerce`}
                        width={600}
                        height={800}
                        sizes="(max-width: 760px) 100vw, 33vw"
                        className="module-image portrait retrato-fixo"
                        loading="lazy"
                      />
                      <h3 className="semibold module-gap-before">{p.name}</h3>
                      <p className="module-gap-before">{p.role} · Ciclo E-commerce</p>
                      <p className="module-gap-before">{p.bio}</p>
                    </div>
                  ))}
                </div>

                <div className="module-gap-before">
                  <Aplicar />
                </div>
              </div>
            </div>
          </section>

          {/* ── Para quem é ───────────────────────────────────────────── */}
          <section className="inner-section special-section">
            <div className="wrap narrow">
              <div className="special-module">
                <p className="semibold section-kicker module-gap-after">Para quem é</p>
                <h2 className="semibold">Para quem decide o próximo passo do e-commerce</h2>

                <div className="module-grid cols-2 module-gap-before">
                  {PUBLICOS.map((p) => (
                    <div className="module-panel" key={p.titulo}>
                      <span className="section-kicker">{p.rotulo}</span>
                      <h3 className="semibold">{p.titulo}</h3>
                      <p className="module-gap-before">{p.texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Chamada final ─────────────────────────────────────────── */}
          <section className="inner-section special-section" id="ces-final">
            <div className="wrap narrow">
              <div className="special-module">
                <h2 className="semibold">Conte o momento da sua operação</h2>
                <p className="module-gap-before">
                  8 perguntas, cerca de 2 minutos. O time da Ciclo lê cada aplicação e responde se
                  faz sentido conversar.
                </p>

                <div className="module-flex module-gap-before">
                  <Aplicar />
                  <span className="section-kicker">Consultoria de 4 meses</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Perguntas frequentes ──────────────────────────────────── */}
          <section className="inner-section special-section paper" id="faq">
            <div className="wrap narrow">
              <div className="special-module">
                <p className="semibold section-kicker module-gap-after">Perguntas frequentes</p>

                <div>
                  {FAQ.map(({ q, a }) => (
                    <details key={q}>
                      <summary>{q}</summary>
                      <p>{a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        <CtaFlutuante
          idAbertura="ces-abertura"
          idFinal="ces-final"
          titulo="Consultoria E-com Shift"
          subtitulo="4 meses"
        >
          <Aplicar />
        </CtaFlutuante>

        <CicloFooter />
      </div>
    </div>
  )
}
