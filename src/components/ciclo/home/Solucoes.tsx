import Link from 'next/link'
import { icones } from '../icones'

// As quatro soluções do Full Funnel Marketing. Os destinos são os mesmos que a
// home já apontava: cada serviço em /servicos/<slug> — com a exceção histórica
// do TikTok Shop, que tem landing própria em /tiktok-shop — e cada solução em
// /solucoes/<slug>.

type Servico = { rotulo: string; href: string; icone: keyof typeof icones }

const SOLUCOES: {
  slug: string
  numero: string
  faixa: string
  titulo: string
  objetivo: string
  descricao: string
  ferramentas: (keyof typeof icones)[]
  servicos: Servico[]
}[] = [
  {
    slug: 'geracao-de-demanda',
    numero: '01',
    faixa: 'FULL FUNNEL MARKETING',
    titulo: 'Geração de Demanda',
    objetivo: 'Faça seu cliente te conhecer antes da compra.',
    descricao: 'Construir preferência reduz o custo de mídia e de aquisição de clientes.',
    ferramentas: ['tiktok', 'creators'],
    servicos: [
      { rotulo: 'TikTok Shop (Social Commerce)', href: '/tiktok-shop', icone: 'tiktok' },
      {
        rotulo: 'Gestão de Creators e Influenciadores',
        href: '/servicos/gestao-creators-influenciadores',
        icone: 'creators',
      },
    ],
  },
  {
    slug: 'captacao-de-demanda',
    numero: '02',
    faixa: 'FULL FUNNEL MARKETING',
    titulo: 'Captação de Demanda',
    objetivo: 'Converta interesse em primeira compra.',
    descricao: 'Mídia e criatividade conectadas à aquisição.',
    ferramentas: ['googleAds', 'meta', 'tiktok', 'mercadoLivre', 'shopee', 'amazon'],
    servicos: [
      { rotulo: 'Creative Strategy', href: '/servicos/creative-strategy', icone: 'creative' },
      { rotulo: 'Google Ads', href: '/servicos/google-ads', icone: 'googleAds' },
      { rotulo: 'Meta Ads', href: '/servicos/meta-ads', icone: 'meta' },
      { rotulo: 'TikTok Ads', href: '/servicos/tiktok-ads', icone: 'tiktok' },
      {
        rotulo: 'Mercado Livre Ads',
        href: '/servicos/mercado-livre-ads',
        icone: 'mercadoLivre',
      },
      { rotulo: 'Shopee Ads', href: '/servicos/shopee-ads', icone: 'shopee' },
      { rotulo: 'Amazon Ads', href: '/servicos/amazon-ads', icone: 'amazon' },
    ],
  },
  {
    slug: 'expansao-de-demanda',
    numero: '03',
    faixa: 'FULL FUNNEL MARKETING',
    titulo: 'Expansão de Demanda',
    objetivo: 'Aumente frequência, ticket e lifetime value.',
    descricao: 'Relacionamento que continua depois da primeira compra.',
    ferramentas: ['whatsapp', 'email', 'automacao'],
    servicos: [
      {
        rotulo: 'CRM: E-mail, SMS, Push, WhatsApp',
        href: '/servicos/crm-email-sms-push-whatsapp',
        icone: 'whatsapp',
      },
      {
        rotulo: 'Réguas de automação personalizadas',
        href: '/servicos/reguas-automacao-personalizadas',
        icone: 'automacao',
      },
      {
        rotulo: 'Reativação e programas de fidelização',
        href: '/servicos/reativacao-fidelizacao',
        icone: 'reativacao',
      },
      {
        rotulo: 'Programas de indicação / Reviews',
        href: '/servicos/programas-indicacao-reviews',
        icone: 'indicacao',
      },
    ],
  },
  {
    slug: 'inteligencia-e-operacao',
    numero: '04',
    faixa: 'TRANSVERSAL AOS TRÊS CICLOS',
    titulo: 'Inteligência & Operação',
    objetivo: 'Transforme dados em decisões de crescimento.',
    descricao: 'A base que conecta os três ciclos.',
    ferramentas: ['analytics', 'automacao', 'growth'],
    servicos: [
      { rotulo: 'Analytics & BI', href: '/servicos/analytics-bi', icone: 'analytics' },
    ],
  },
]

export default function Solucoes() {
  return (
    <section className="services" id="solucoes">
      <div className="wrap narrow services-layout">
        <div className="services-intro">
          <div className="eyebrow">
            <span />
            Nossas soluções
          </div>

          <h2>Soluções organizadas em Full Funnel Marketing.</h2>

          <p>
            Uma jornada completa para transformar marketing em receita real, do topo ao fundo
            do funil.
          </p>

          <a className="button" href="#contato">
            <span>Fale com especialista</span>
            <b aria-hidden="true">↗</b>
          </a>
        </div>

        <div>
          {SOLUCOES.map((s) => (
            <article className="solution" id={s.slug} key={s.slug}>
              <div className="solution-tools">
                {s.ferramentas.map((f) => (
                  <span key={f}>{icones[f]}</span>
                ))}
              </div>

              <div className="solution-overline">
                <span>{s.numero}</span>
                <span>{s.faixa}</span>
              </div>

              <h3>{s.titulo}</h3>

              <p className="objective">{s.objetivo}</p>

              <p className="description">{s.descricao}</p>

              <ul className="service-list">
                {s.servicos.map((sv) => (
                  <li key={sv.href}>
                    <Link href={sv.href}>
                      <span className="service-link-label">
                        {icones[sv.icone]}
                        <span>{sv.rotulo}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <Link className="learn" href={`/solucoes/${s.slug}`}>
                Ver solução completa <span>↗</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
