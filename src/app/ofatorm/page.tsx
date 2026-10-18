import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import CicloHeader from '@/components/ciclo/CicloHeader'
import CicloFooter from '@/components/ciclo/CicloFooter'
import Breadcrumb from '@/components/ciclo/interior/Breadcrumb'
import MiniaturaYouTube from '@/components/ciclo/MiniaturaYouTube'
import { playfair2026 } from '@/components/ciclo/fonts'
import { buscarEpisodios } from '@/lib/youtube-server'
import { CANAL_URL } from '@/lib/youtube'
import '@/components/ciclo/base.css'
import '@/components/ciclo/interiors.css'
import { Seta } from '@/components/ciclo/Seta'

export const metadata: Metadata = {
  title: 'O Fator M | Podcast de Marketing e E-commerce | Ciclo E-commerce',
  description:
    'O Fator M é o podcast da Ciclo E-commerce apresentado por Felipe Beraldo e Flávio Beraldo. +250 episódios com líderes de marketing e e-commerce. Aqui você descobre o lado marqueteiro das pessoas e dos negócios.',
  keywords: [
    'podcast marketing digital',
    'podcast e-commerce',
    'O Fator M',
    'ofatorm',
    'Felipe Beraldo',
    'Flávio Beraldo',
    'Alan Rocumback',
    'Ciclo E-commerce',
    'marketing estratégico',
    'podcast estratégia',
    'podcast empresários',
    'e-commerce Brasil',
  ],
  openGraph: {
    title: 'O Fator M | Podcast de Marketing e E-commerce',
    description:
      '+250 episódios com líderes do mercado. Aqui você descobre o lado marqueteiro das pessoas e dos negócios.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ciclo E-commerce',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'O Fator M | Podcast de Marketing e E-commerce',
    description: '+250 episódios com líderes do mercado de marketing e e-commerce.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cicloecommerce.com.br/ofatorm' },
}

const podcastSchema = {
  '@context': 'https://schema.org',
  '@type': 'PodcastSeries',
  name: 'O Fator M',
  description:
    'Canal de conteúdo da Ciclo E-commerce com insights e tendências para ajudar negócios na área de marketing e vendas. Aqui você descobre o lado marqueteiro das pessoas e dos negócios.',
  url: 'https://cicloecommerce.com.br/ofatorm',
  image: 'https://cicloecommerce.com.br/logo-ofatorm-white.png',
  inLanguage: 'pt-BR',
  author: [
    {
      '@type': 'Person',
      name: 'Felipe Beraldo',
      jobTitle: 'CEO da Ciclo E-commerce',
      url: 'https://cicloecommerce.com.br/ofatorm',
    },
    {
      '@type': 'Person',
      name: 'Flávio Beraldo',
      jobTitle: 'Diretor de Marketing da Ciclo E-commerce',
      url: 'https://cicloecommerce.com.br/ofatorm',
    },
    {
      '@type': 'Person',
      name: 'Alan Rocumback',
      jobTitle: 'COO da Ciclo E-commerce',
      url: 'https://cicloecommerce.com.br/ofatorm',
    },
  ],
  publisher: {
    '@type': 'Organization',
    name: 'Ciclo E-commerce',
    url: 'https://cicloecommerce.com.br',
    logo: {
      '@type': 'ImageObject',
      url: 'https://cicloecommerce.com.br/logo-ciclo.png',
    },
  },
  sameAs: [
    'https://www.youtube.com/@ofatorm',
    'https://instagram.com/ofatorm',
    'https://tiktok.com/@ofatorm',
    'https://open.spotify.com/show/6QIXPnTNJeiNSOzyNPDl7H',
    'https://ofatorm.substack.com/',
  ],
}

// ─── Conteúdo, o mesmo que a página já trazia ───────────────────────────────

const NUMEROS = [
  { valor: '+250', rotulo: 'Episódios' },
  { valor: '11k', rotulo: 'Seguidores Spotify' },
  { valor: '74k', rotulo: 'Views/mês Instagram' },
  { valor: '60k', rotulo: 'Views/mês TikTok' },
]

// Traçado dos ícones copiado do kit, sem alteração.
const ICONES = {
  youtube: (
    <>
      <path d="M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
      <rect x="2" y="3" width="20" height="14" rx="2" />
    </>
  ),
  spotify: (
    <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
  ),
  instagram: (
    <>
      <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" />
      <circle cx="12" cy="13" r="3" />
    </>
  ),
  newsletter: (
    <>
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </>
  ),
}

const PLATAFORMAS = [
  {
    nome: 'YouTube',
    href: `${CANAL_URL}?sub_confirmation=1`,
    rotulo: 'Assista no YouTube',
    icone: ICONES.youtube,
  },
  {
    nome: 'Spotify',
    href: 'https://open.spotify.com/show/6QIXPnTNJeiNSOzyNPDl7H',
    rotulo: 'Ouça no Spotify',
    icone: ICONES.spotify,
  },
  {
    nome: 'Instagram',
    href: 'https://instagram.com/ofatorm',
    rotulo: 'Siga no Instagram',
    icone: ICONES.instagram,
  },
  {
    nome: 'Newsletter',
    href: 'https://ofatorm.substack.com/',
    rotulo: 'Newsletter no Substack',
    icone: ICONES.newsletter,
  },
]

const APRESENTADORES = [
  {
    nome: 'Felipe Beraldo',
    cargo: 'Sócio e CEO',
    foto: '/foto-felipe-beraldo.webp',
    bio: 'Empreendedor serial e especialista em crescimento de e-commerce. Lidera a Ciclo E-commerce na missão de escalar marcas com estratégia e dados.',
  },
  {
    nome: 'Alan Rocumback',
    cargo: 'Sócio e COO',
    foto: '/foto-alan-rocumback.webp',
    bio: 'Especialista em operações e escala de negócios digitais. Co-fundador da Ciclo E-commerce, responsável por estruturar processos que transformam resultados.',
  },
  {
    nome: 'Flávio Beraldo',
    cargo: 'Sócio e Diretor de Marketing',
    foto: '/foto-flavio-beraldo.webp',
    bio: 'Estrategista de marketing com foco em Full Funnel para e-commerce. Conecta marca, dados e criatividade para gerar crescimento previsível.',
  },
]

const FOTOS_DUPLA = [
  {
    src: '/foto-criadores.webp',
    alt: 'Os apresentadores do O Fator M gravando episódio no estúdio',
  },
  {
    src: '/foto-criadores-2.webp',
    alt: 'Felipe Beraldo, Alan Rocumback e Flávio Beraldo — apresentadores do O Fator M',
  },
]

const FOTOS_ESTUDIO = [
  {
    src: '/studio-ofatorm-1.webp',
    alt: 'Bastidores do O Fator M — apresentadores com convidados antes da gravação',
  },
  {
    src: '/studio-ofatorm-2.webp',
    alt: 'Mesa de operação do estúdio O Fator M com switcher e mixer de áudio profissional',
  },
  {
    src: '/studio-ofatorm-3.webp',
    alt: 'Bastidores — Felipe Beraldo sendo fotografado no estúdio O Fator M',
  },
  {
    src: '/studio-ofatorm-4.webp',
    alt: 'Bastidores — gravação de episódio do O Fator M com convidado',
  },
]

const FORMATOS = [
  {
    titulo: 'Visão Estratégica',
    texto:
      'Entrevistas com Diretores e Gestores de grandes marcas. Compartilhamos os bastidores das estratégias que movem o mercado — o que funciona, o que não funciona e o que está por vir.',
  },
  {
    titulo: 'Por Trás da Marca',
    texto:
      'Fundadores e empreendedores revelam os bastidores dos seus negócios. As histórias reais de quem construiu marcas do zero e transformou desafios em crescimento.',
  },
]

function Plataforma({ p, empilhado }: { p: (typeof PLATAFORMAS)[number]; empilhado?: boolean }) {
  return (
    <a
      href={p.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={p.rotulo}
      className={empilhado ? 'module-stack centered' : 'module-flex'}
    >
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
        {p.icone}
      </svg>
      <span>{p.nome}</span>
    </a>
  )
}

// Logo do Fator M. O `.special-logo` do kit aplica `brightness(0)`, então a
// arte branca sobre fundo transparente vira preta — é o mesmo arquivo que a
// página já usava.
function LogoFatorM({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-ofatorm-white.png"
      alt="O Fator M"
      width={280}
      height={113}
      className={`module-image special-logo${className ? ' ' + className : ''}`}
    />
  )
}

// /ofatorm no design 2026, pelo layout do kit. Mesmo conteúdo, mesma
// metadata, mesmo canonical e mesmo schema. Os episódios são buscados no
// servidor — ver docs/redesign/AUDITORIA-360.md, seção 25.
export const revalidate = 3600

export default async function OFatorMPage() {
  const { lista: episodios } = await buscarEpisodios()

  return (
    <div className={`ciclo2026 ${playfair2026.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(podcastSchema) }}
      />

      <div className="inner">
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>

        <CicloHeader />

        <main id="conteudo">
          {/* ── Abertura ──────────────────────────────────────────────── */}
          <section className="inner-section special-section special-hero">
            <div className="wrap narrow">
              <Breadcrumb etapas={[{ rotulo: 'Início', href: '/' }, { rotulo: 'O Fator M' }]} />

              <div className="special-module">
                <div className="centered">
                  <div className="module-flex module-gap-after">
                    <LogoFatorM />
                  </div>

                  <p className="semibold section-kicker module-gap-after">por Ciclo E-commerce</p>

                  <h1 className="semibold module-gap-after">
                    <span className="eyebrow h1-kicker">
                      <span />O Fator M
                    </span>
                    Aqui você descobre o lado <em>marqueteiro</em> das pessoas e dos negócios.
                  </h1>

                  <p className="module-gap-after">
                    Insights, tendências e estratégias de marketing e vendas com os maiores líderes
                    do mercado digital brasileiro.
                  </p>

                  <div className="module-flex module-gap-after">
                    {PLATAFORMAS.map((p) => (
                      <Plataforma key={p.nome} p={p} />
                    ))}
                  </div>

                  <div className="module-grid cols-4">
                    {NUMEROS.map((n) => (
                      <div className="module-panel centered" key={n.rotulo}>
                        <p className="semibold module-number">{n.valor}</p>
                        <p className="module-gap-before">{n.rotulo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Spotify ───────────────────────────────────────────────── */}
          <section className="inner-section special-section paper">
            <div className="wrap narrow">
              <div className="special-module">
                <iframe
                  src="https://open.spotify.com/embed/show/6QlXPnTNJeiNSOzyNPDI7H?utm_source=generator&theme=0"
                  width="100%"
                  height="232"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  title="O Fator M no Spotify"
                  loading="lazy"
                />
              </div>
            </div>
          </section>

          {/* ── Episódios ─────────────────────────────────────────────── */}
          <section className="inner-section special-section" id="episodios">
            <div className="wrap narrow">
              <div className="eyebrow">
                <span />
                Playlist
              </div>
              <h2>Últimos episódios.</h2>

              {episodios.length ? (
                <div className="video-grid">
                  {episodios.slice(0, 6).map((v) => (
                    <a
                      className="video-card"
                      key={v.id}
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="video-thumb">
                        <MiniaturaYouTube
                          videoId={v.id}
                          alt={v.title}
                          sizes="(max-width: 760px) 100vw, 50vw"
                        />
                        <span className="play" aria-hidden="true">
                          ▶
                        </span>
                      </div>
                      <div className="video-caption">
                        <h3>{v.title}</h3>
                        <span>Assistir <Seta /></span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="episodes-vazio">
                  A lista de episódios está indisponível no momento.{' '}
                  <a href={CANAL_URL} target="_blank" rel="noopener noreferrer">
                    Veja os episódios no canal <Seta />
                  </a>
                </p>
              )}

              <a
                href={`${CANAL_URL}/videos`}
                className="textlink"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver todos os episódios <Seta />
              </a>
            </div>
          </section>

          {/* ── Apresentadores ────────────────────────────────────────── */}
          <section className="inner-section special-section" id="apresentadores">
            <div className="wrap narrow">
              <div className="special-module">
                <div className="centered module-gap-after">
                  <p className="semibold section-kicker module-gap-after">Quem apresenta</p>
                  <h2 className="semibold">Os apresentadores</h2>
                  <p className="module-gap-before">
                    Líderes da Ciclo E-commerce que trazem visão estratégica, operacional e de
                    marketing para cada episódio.
                  </p>
                </div>

                <div className="module-grid cols-2 module-gap-after">
                  {FOTOS_DUPLA.map((f) => (
                    <div className="module-panel" key={f.src}>
                      <Image
                        src={f.src}
                        alt={f.alt}
                        width={900}
                        height={600}
                        sizes="(max-width: 760px) 100vw, 50vw"
                        className="module-image"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>

                <div className="module-grid cols-3">
                  {APRESENTADORES.map((a) => (
                    <div className="module-panel" key={a.nome}>
                      <Image
                        src={a.foto}
                        alt={a.nome}
                        width={600}
                        height={800}
                        sizes="(max-width: 760px) 100vw, 33vw"
                        className="module-image portrait retrato-fixo"
                        loading="lazy"
                      />
                      <div>
                        <h3 className="semibold">{a.nome}</h3>
                        <p className="module-gap-before">{a.cargo}</p>
                        <p className="module-gap-before">Ciclo E-commerce</p>
                        <p className="module-gap-before">{a.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Bastidores ────────────────────────────────────────────── */}
          <section className="inner-section special-section paper" id="bastidores">
            <div className="wrap narrow">
              <div className="special-module">
                <div className="module-gap-after">
                  <p className="semibold section-kicker module-gap-after">Nossa história</p>
                  <div className="module-grid cols-2">
                    <h2 className="semibold">Bastidores do O Fator M</h2>
                    <p>
                      Nascido dentro da Ciclo E-commerce, o O Fator M se tornou um dos podcasts de
                      referência em marketing e e-commerce do Brasil. Com um estúdio profissional em
                      São Paulo e convidados como gestores da Nestlé, Shiseido, Suvinil e Faber
                      Castell, cada episódio traz a visão de quem está no campo de batalha do
                      mercado digital.
                    </p>
                  </div>
                </div>

                <div className="module-grid cols-2">
                  {FOTOS_ESTUDIO.map((f, i) => (
                    <Image
                      key={f.src}
                      src={f.src}
                      alt={f.alt}
                      width={900}
                      height={600}
                      sizes="(max-width: 760px) 100vw, 50vw"
                      className={`module-image${i === 2 ? ' portrait' : ''}`}
                      loading="lazy"
                    />
                  ))}
                </div>

                <div className="module-grid cols-2 module-gap-before">
                  {FORMATOS.map((f) => (
                    <div className="module-panel" key={f.titulo}>
                      <div className="module-flex module-gap-after">
                        <span className="semibold">M</span>
                      </div>
                      <h3 className="semibold module-gap-after">{f.titulo}</h3>
                      <p>{f.texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Siga ──────────────────────────────────────────────────── */}
          <section className="inner-section special-section">
            <div className="wrap narrow">
              <div className="special-module">
                <div className="centered">
                  <div className="module-flex module-gap-after">
                    <LogoFatorM />
                  </div>

                  <h2 className="semibold module-gap-after">Siga e nunca perca um episódio</h2>

                  <p className="module-gap-after">
                    Acompanhe O Fator M na plataforma que preferir e receba novos episódios toda
                    semana.
                  </p>

                  <div className="module-grid cols-4 module-gap-after">
                    {PLATAFORMAS.map((p) => (
                      <Plataforma key={p.nome} p={p} empilhado />
                    ))}
                  </div>

                  <p className="module-gap-after">
                    Quer transformar o marketing do seu e-commerce?
                  </p>

                  <Link href="/#contato" className="semibold action-link">
                    Fale com a Ciclo E-commerce
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
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <CicloFooter />
      </div>
    </div>
  )
}
