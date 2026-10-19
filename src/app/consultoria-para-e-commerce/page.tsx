import type { Metadata } from 'next'
import CicloHeader from '@/components/ciclo/CicloHeader'
import CicloFooter from '@/components/ciclo/CicloFooter'
import Breadcrumb from '@/components/ciclo/interior/Breadcrumb'
import Contato from '@/components/ciclo/Contato'
import { playfair2026 } from '@/components/ciclo/fonts'
import '@/components/ciclo/base.css'
import '@/components/ciclo/interiors.css'

export const metadata: Metadata = {
  title: 'Consultoria para E-commerce: Cresça sua Operação de Forma Estratégica e Sustentável | Ciclo',
  description:
    'Potencialize seu e-commerce com uma consultoria estratégica. Identificamos gargalos, otimizamos processos e criamos um ecossistema de crescimento sustentável. Fale com especialistas!',
  keywords: ['consultoria e-commerce', 'crescimento e-commerce', 'agência e-commerce', 'ciclo ecommerce', 'Full Funnel Marketing'],
  openGraph: {
    title: 'Consultoria para E-commerce | Ciclo E-commerce',
    description: 'Potencialize seu e-commerce com uma consultoria estratégica da Ciclo.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ciclo E-commerce',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cicloecommerce.com.br/consultoria-para-e-commerce' },
}

// ─── Conteúdo, o mesmo que a página já trazia ───────────────────────────────

const PARA_QUEM = [
  'Marca consolidada no físico e quer expandir para o digital',
  'Indústria que deseja criar um canal direto com o consumidor final',
  'Já vende online mas sente que sua operação poderia performar melhor',
]

// Traçado dos ícones copiado do kit, sem alteração.
const RAIO = (
  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
)
const ALVO = (
  <>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </>
)
const REPETE = (
  <>
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="m7 22-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  </>
)
const BARRAS = (
  <>
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </>
)
const SETA = <path d="m9 18 6-6-6-6" />

const PILARES = [
  {
    icone: RAIO,
    ciclo: 'Geração de Demanda',
    itens: [
      'Share of search e presença de marca',
      'Cobertura de conteúdo e creators',
      'Participação do social commerce na receita',
      'Custo de descoberta frente à concorrência',
    ],
  },
  {
    icone: ALVO,
    ciclo: 'Captação de Demanda',
    itens: [
      'Estrutura de contas e desperdício de verba',
      'Dependência e diversificação de canais',
      'Maturidade da creative strategy',
      'CAC, ROAS e incrementalidade por canal',
    ],
  },
  {
    icone: REPETE,
    ciclo: 'Expansão de Demanda',
    itens: [
      'LTV por canal, produto e safra de cliente',
      'Cobertura das réguas e automações de CRM',
      'Taxa de recompra e recência da base',
      'Receita da base versus receita de cliente novo',
    ],
  },
  {
    icone: BARRAS,
    ciclo: 'Inteligência & Operação',
    itens: [
      'Integridade de dados e modelo de atribuição',
      'KPIs e rotina de leitura da operação',
      'Processos e playbooks documentados',
      'Cadência de experimentação e aprendizado',
    ],
  },
]

const NUMEROS = [
  { valor: '+300', rotulo: 'marcas atendidas' },
  { valor: '+R$ 350MM', rotulo: 'em receita gerada' },
  { valor: '-35%', rotulo: 'de CAC em média' },
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

// /consultoria-para-e-commerce no design 2026, pelo layout do kit. Conteúdo,
// metadata e canonical preservados.
//
// O formulário trocou de `components/LeadForm` para `ciclo/Contato`: os dois
// tinham o MESMO envio — `generate_lead` com `form: 'contato'`,
// `contentName: 'fale-com-especialista'`, o mesmo POST para /api/pipedrive
// com `source: 'Site/WhatsApp'`, o mesmo `waitForTags` e o mesmo redirect
// para /obrigado. A troca é só de marcação; o contrato é o mesmo que o passo
// 6 da verificação mede na home.
export default function ConsultoriaParaEcommercePage() {
  return (
    <div className={`ciclo2026 ${playfair2026.variable}`}>
      <div className="inner">
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>

        <CicloHeader />

        <main id="conteudo">
          {/* ── Abertura ──────────────────────────────────────────────── */}
          <section className="inner-section special-section special-hero">
            <div className="wrap narrow">
              <Breadcrumb
                etapas={[{ rotulo: 'Início', href: '/' }, { rotulo: 'Consultoria para E-commerce' }]}
              />

              <div className="special-module">
                <div className="centered">
                  <h1 className="semibold module-gap-after">
                    <span className="eyebrow h1-kicker">
                      <span />
                      Consultoria para E-commerce
                    </span>
                    Cresça sua Operação de Forma <em>Estratégica e Sustentável</em>
                  </h1>

                  <p className="module-gap-after">
                    Com mais de 9 anos de experiência, a Ciclo cria um plano personalizado para
                    escalar seu e-commerce com previsibilidade e sem desperdícios.
                  </p>

                  <a href="#contato" className="semibold action-link">
                    Quero uma consultoria estratégica
                    <Icone>{SETA}</Icone>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ── Para quem é ───────────────────────────────────────────── */}
          <section className="inner-section special-section paper">
            <div className="wrap narrow">
              <div className="special-module">
                <div className="centered module-gap-after">
                  <p className="semibold section-kicker module-gap-after">Para quem é</p>
                  <h2 className="semibold">Nossa consultoria é para você que…</h2>
                </div>

                <div className="module-grid cols-3">
                  {PARA_QUEM.map((t) => (
                    <div className="module-flex module-panel" key={t}>
                      <Icone>{SETA}</Icone>
                      <p>{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Framework ─────────────────────────────────────────────── */}
          <section className="inner-section special-section">
            <div className="wrap narrow">
              <div className="special-module">
                <div className="centered module-gap-after">
                  <p className="semibold section-kicker module-gap-after">Nosso método</p>
                  <h2 className="semibold module-gap-after">
                    Framework de análise baseado nos 4 pilares
                  </h2>
                  <p>
                    Cada pilar do Full Funnel Marketing tem seu próprio diagnóstico — e é a leitura
                    conjunta dos quatro que mostra onde está o gargalo de crescimento.
                  </p>

                  <p>
                    A consultoria ajuda a transformar dúvidas sobre o crescimento em prioridades de
                    trabalho. Antes de escolher canais ou aumentar o investimento, vale entender
                    quais desafios estão na aquisição, na experiência de compra, na retenção e na
                    leitura dos dados. A atuação deve ser combinada com a equipe responsável por
                    executar as decisões.
                  </p>
                </div>

                <div className="module-grid cols-4">
                  {PILARES.map((p, iPilar) => (
                    <div className="module-panel" key={p.ciclo}>
                      <div className="module-flex module-gap-after">
                        <Icone>{p.icone}</Icone>
                        <h3 className="semibold">{p.ciclo}</h3>
                      </div>
                      <ul className="lista-numerada">
                        {p.itens.map((item, i) => (
                          <li key={item}>
                            <span className="semibold">
                              {String(iPilar * 4 + i + 1).padStart(2, '0')}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Caso real ─────────────────────────────────────────────── */}
          <section className="inner-section special-section">
            <div className="wrap narrow">
              <div className="special-module">
                <div className="module-panel">
                  <p className="semibold section-kicker module-gap-after">Caso real</p>
                  <h2 className="semibold module-gap-after">
                    Crescimento de <em>230% em 3 anos de parceria</em>
                  </h2>

                  <blockquote className="citacao-longa module-gap-after">
                    <p>
                      &quot;A parceria com a Ciclo E-commerce transformou nossa trajetória. Antes,
                      enfrentávamos altos e baixos constantes. Com a Ciclo, conquistamos
                      consistência e superamos nossas metas. A dedicação e expertise da equipe nos
                      permitiram focar em outras áreas críticas do negócio.&quot;
                    </p>
                    <footer>— Lucas Gomez, Gerente de Marketing, Danki</footer>
                  </blockquote>

                  <div className="module-grid cols-3">
                    {NUMEROS.map((n) => (
                      <div className="centered" key={n.rotulo}>
                        <p className="semibold module-number">{n.valor}</p>
                        <p className="module-gap-before">{n.rotulo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="section-fade paper-dark" aria-hidden="true" />

          <Contato />
        </main>

        <CicloFooter />
      </div>
    </div>
  )
}
