import type { Metadata } from 'next'
import Link from 'next/link'
import CicloHeader from '@/components/ciclo/CicloHeader'
import CicloFooter from '@/components/ciclo/CicloFooter'
import Cases from '@/components/ciclo/home/Cases'
import VideosDepoimento from '@/components/ciclo/VideosDepoimento'
import { playfair2026 } from '@/components/ciclo/fonts'
import '@/components/ciclo/base.css'
import '@/components/ciclo/interiors.css'

export const metadata: Metadata = {
  title: 'Obrigado pelo contato | Ciclo E-commerce',
  description: 'Recebemos seu contato. Nossa equipe entrará em breve.',
  robots: { index: false, follow: false },
}

// ─── Conteúdo, o mesmo que a página já trazia ───────────────────────────────

const NUMEROS = [
  { valor: '+10', rotulo: 'anos de experiência' },
  { valor: '+300', rotulo: 'marcas atendidas' },
  { valor: '+R$ 350MM', rotulo: 'em receita gerada' },
  { valor: '-35%', rotulo: 'de CAC em média' },
]

// A faixa de números logo acima já traz "+300 marcas atendidas" e
// "+R$ 350MM em receita gerada". Repetir os dois aqui, dois blocos depois,
// era contagem dupla do mesmo indicador — ficaram só os dois fatos que não
// aparecem em nenhum outro lugar da página. Nenhum número se perdeu: os
// outros dois continuam na faixa, e o texto ao lado repete "mais de 300
// marcas" por extenso.
const MARCOS = [
  { valor: '2015', rotulo: 'Fundação da Ciclo' },
  { valor: '4', rotulo: 'Pilares do método' },
]

// Os mesmos quatro vídeos de /depoimentos e da home, com os mesmos ids. O
// cargo do depoente não é exibido — foi retirado de todo o site a pedido do
// Flávio.
const DEPOIMENTOS = [
  { id: 'MlDyvGg7rGs', marca: 'Mamô Brasil' },
  { id: 'djykk9EFghg', marca: 'Líquido' },
  { id: 'xVdqhprwKWw', marca: 'KVRA' },
  { id: '6B2XYATbK3Q', marca: 'DANKI' },
]

type ItemDePilar = string | { label: string; href: string }

const PILARES: { titulo: string; desc: string; itens: ItemDePilar[] }[] = [
  {
    titulo: 'Geração de Demanda',
    desc: 'Construímos desejo e relevância de marca por meio de conteúdo, criadores e canais de mídia que geram audiência qualificada antes da compra.',
    itens: [
      { label: 'TikTok Shop / Social Commerce', href: '/tiktok-shop' },
      { label: 'Gestão de Creators e Influenciadores', href: '/servicos/gestao-creators-influenciadores' },
    ],
  },
  {
    titulo: 'Captação de Demanda',
    desc: 'Convertemos interesse em primeira compra com anúncios de alta performance em todos os canais pagos — do Meta ao Retail Media.',
    itens: [
      { label: 'Creative Strategy', href: '/servicos/creative-strategy' },
      { label: 'Meta Ads', href: '/servicos/meta-ads' },
      { label: 'Google Ads', href: '/servicos/google-ads' },
      { label: 'TikTok Ads', href: '/servicos/tiktok-ads' },
      // Três marketplaces, três páginas: o link único mandava os três para o
      // Mercado Livre. Separados conforme a instrução do Flávio.
      { label: 'Mercado Livre Ads', href: '/servicos/mercado-livre-ads' },
      { label: 'Shopee Ads', href: '/servicos/shopee-ads' },
      { label: 'Amazon Ads', href: '/servicos/amazon-ads' },
    ],
  },
  {
    titulo: 'Expansão de Demanda',
    desc: 'Aumentamos a frequência, o ticket médio e o LTV por meio de automações, CRM e programas de fidelização que geram receita recorrente.',
    itens: [
      'CRM: E-mail, SMS, Push, WhatsApp',
      'Réguas de automação',
      'Reativação e fidelização',
      'Programas de indicação',
    ],
  },
  {
    titulo: 'Inteligência & Operação',
    desc: 'Toda decisão é guiada por dados. Analytics, BI e playbooks operacionais garantem previsibilidade e consistência no crescimento.',
    itens: ['Analytics & BI', 'Processos e Playbooks', 'Growth Contínuo'],
  },
]

const FRAMEWORK = [
  {
    ciclo: 'Geração de Demanda',
    itens: [
      'Share of search e presença de marca',
      'Cobertura de conteúdo e creators',
      'Participação do social commerce na receita',
      'Custo de descoberta frente à concorrência',
    ],
  },
  {
    ciclo: 'Captação de Demanda',
    itens: [
      'Estrutura de contas e desperdício de verba',
      'Dependência e diversificação de canais',
      'Maturidade da creative strategy',
      'CAC, ROAS e incrementalidade por canal',
    ],
  },
  {
    ciclo: 'Expansão de Demanda',
    itens: [
      'LTV por canal, produto e safra de cliente',
      'Cobertura das réguas e automações de CRM',
      'Taxa de recompra e recência da base',
      'Receita da base versus receita de cliente novo',
    ],
  },
  {
    ciclo: 'Inteligência & Operação',
    itens: [
      'Integridade de dados e modelo de atribuição',
      'KPIs e rotina de leitura da operação',
      'Processos e playbooks documentados',
      'Cadência de experimentação e aprendizado',
    ],
  },
]

// /obrigado no design 2026.
//
// Esta página NÃO dispara evento nenhum, e isso é de propósito: a conversão
// sai da página do formulário, ANTES do redirecionamento, pelo `waitForTags`.
// Ver docs/redesign/AUDITORIA-360.md, seção 21.8. Nada aqui foi acrescentado
// que pudesse contar a mesma conversão duas vezes.
export default function ObrigadoPage() {
  return (
    <div className={`ciclo2026 ${playfair2026.variable}`}>
      <div className="inner">
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>

        <CicloHeader />

        <main id="conteudo">
          {/* ── Confirmação ───────────────────────────────────────────── */}
          <section className="inner-section special-section special-hero">
            <div className="wrap narrow">
              <div className="special-module">
                <div className="centered">
                  <p className="semibold section-kicker module-gap-after">Mensagem recebida</p>

                  <h1 className="semibold module-gap-after">Obrigado pelo contato!</h1>

                  <p className="module-gap-after">
                    Nossa equipe recebeu suas informações e entrará em contato em breve para
                    entender melhor como podemos acelerar o seu e-commerce.
                  </p>

                  <p className="prazo-resposta">
                    Tempo médio de resposta: <strong className="semibold">até 1 dia útil</strong>
                  </p>
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

          {/* ── Nossa história ────────────────────────────────────────── */}
          <section className="inner-section special-section">
            <div className="wrap narrow">
              <div className="special-module">
                <div className="module-grid cols-2">
                  <div>
                    <p className="semibold section-kicker module-gap-after">Nossa história</p>
                    <h2 className="semibold module-gap-after">
                      Mais de 10 anos construindo <em>e-commerces de alta performance</em>
                    </h2>

                    <p>
                      A Ciclo nasceu da convicção de que crescimento sustentável em e-commerce
                      exige uma visão completa do funil — não apenas tráfego pago ou conteúdo
                      isolado, mas uma estratégia integrada que conecta todos os pontos da jornada
                      do consumidor.
                    </p>
                    <p>
                      Ao longo de mais de 10 anos, desenvolvemos um método próprio que já foi
                      aplicado em mais de 300 marcas de diferentes segmentos — de moda e beleza a
                      alimentos, esportes e eletrônicos. Cada operação nos ensinou algo novo, e
                      todo esse conhecimento está consolidado na forma como trabalhamos hoje.
                    </p>
                    <p>
                      Não somos uma agência de mídia paga. Somos um parceiro estratégico de
                      crescimento que entende o seu negócio de ponta a ponta.
                    </p>
                  </div>

                  <div className="module-grid cols-2">
                    {MARCOS.map((m) => (
                      <div className="module-panel centered" key={m.rotulo}>
                        <p className="semibold module-number">{m.valor}</p>
                        <p className="module-gap-before">{m.rotulo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Nossa tese ────────────────────────────────────────────── */}
          <section className="inner-section special-section paper">
            <div className="wrap narrow">
              <div className="special-module">
                <div className="centered module-gap-after">
                  <p className="semibold section-kicker module-gap-after">Nossa tese</p>
                  <h2 className="semibold">Full Funnel Marketing para e-commerce</h2>
                  <p className="module-gap-before">
                    Crescimento sustentável não é só conversão. Uma marca precisa operar os quatro
                    pilares de forma constante e integrada.
                  </p>
                </div>

                <div className="module-grid cols-2">
                  {PILARES.map((p) => (
                    <div className="module-panel" key={p.titulo}>
                      <h3 className="semibold">{p.titulo}</h3>
                      <p className="module-gap-before">{p.desc}</p>
                      <ul className="lista-pontos">
                        {p.itens.map((i) => {
                          const label = typeof i === 'string' ? i : i.label
                          return (
                            <li key={label}>
                              {typeof i === 'string' ? label : <Link href={i.href}>{label}</Link>}
                            </li>
                          )
                        })}
                      </ul>
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
                  <p className="semibold section-kicker module-gap-after">Nossa metodologia</p>
                  <h2 className="semibold">Framework de análise baseado nos 4 pilares</h2>
                  <p className="module-gap-before">
                    Cada pilar do Full Funnel Marketing tem seu próprio diagnóstico — e é a leitura
                    conjunta dos quatro que mostra onde está o gargalo de crescimento.
                  </p>
                </div>

                <div className="module-grid cols-4">
                  {FRAMEWORK.map((p, iPilar) => (
                    <div className="module-panel" key={p.ciclo}>
                      <h3 className="semibold">{p.ciclo}</h3>
                      <ul className="lista-numerada module-gap-before">
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

          <div className="section-fade paper-white" aria-hidden="true" />

          {/* ── Cases, o mesmo bloco da home ──────────────────────────── */}
          <Cases />

          <div className="section-fade paper-dark" aria-hidden="true" />

          {/* ── Depoimentos ───────────────────────────────────────────── */}
          <section className="section dark proof" id="depoimentos">
            <div className="wrap narrow">
              <div className="eyebrow">
                <span />
                Depoimentos
              </div>
              <h2>Quem vive, recomenda</h2>

              <VideosDepoimento itens={DEPOIMENTOS} />
            </div>
          </section>

          <div className="section-fade dark-white" aria-hidden="true" />

          {/* ── O que fazer enquanto espera ───────────────────────────── */}
          <section className="inner-section special-section">
            <div className="wrap narrow">
              <div className="special-module">
                <div className="centered">
                  <h2 className="semibold module-gap-after">
                    Enquanto aguarda, <em>explore nosso conteúdo</em>
                  </h2>

                  <p className="module-gap-after">
                    Acesse nosso blog com estratégias de e-commerce, ou acompanhe o Fator M — nosso
                    podcast sobre marketing e crescimento.
                  </p>

                  <div className="module-flex">
                    <Link href="/blog" className="semibold action-link">
                      Ler o blog
                    </Link>
                    {/* Mesmo destino de antes: a seção do podcast na home */}
                    <Link href="/#podcast" className="textlink">
                      Ver o Fator M
                    </Link>
                  </div>
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
