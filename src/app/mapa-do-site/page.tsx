import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mapa do Site | Ciclo E-commerce',
  description: 'Todas as páginas do site da Ciclo E-commerce organizadas por categoria.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cicloecommerce.com.br/mapa-do-site' },
}

const sections = [
  {
    heading: 'Páginas principais',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Blog', href: '/blog' },
      { label: 'Depoimentos', href: '/depoimentos' },
    ],
  },
  {
    heading: 'Serviços especializados',
    links: [
      { label: 'TikTok Shop & Social Commerce', href: '/tiktok-shop' },
      { label: 'Consultoria para E-commerce', href: '/consultoria-para-e-commerce' },
    ],
  },
  {
    heading: 'Soluções de marketing',
    links: [
      { label: 'Geração de Demanda', href: '/solucoes/geracao-de-demanda' },
      { label: 'Captação de Demanda', href: '/solucoes/captacao-de-demanda' },
      { label: 'Expansão de Demanda', href: '/solucoes/expansao-de-demanda' },
      { label: 'Inteligência & Operação', href: '/solucoes/inteligencia-e-operacao' },
    ],
  },
  {
    heading: 'Geração de Demanda — serviços',
    links: [
      { label: 'Produção de Conteúdo para Redes Sociais', href: '/servicos/producao-conteudo-redes-sociais' },
      { label: 'TikTok Shop (Social Commerce)', href: '/tiktok-shop' },
      { label: 'Gestão de Creators e Influenciadores', href: '/servicos/gestao-creators-influenciadores' },
      { label: 'OOH Digital', href: '/servicos/ooh-digital' },
    ],
  },
  {
    heading: 'Captação de Demanda — serviços',
    links: [
      { label: 'Produção e criação de anúncios Social First', href: '/servicos/anuncios-social-first-conversao' },
      { label: 'Google Ads / Bing Ads', href: '/servicos/google-ads-bing-ads' },
      { label: 'Meta Ads / TikTok Ads', href: '/servicos/meta-ads-tiktok-ads' },
      { label: 'Programática / Pinterest Ads', href: '/servicos/programatica-pinterest-ads' },
      { label: 'Retail Media (Mercado Livre / Shopee / Amazon)', href: '/servicos/retail-media' },
    ],
  },
  {
    heading: 'Expansão de Demanda — serviços',
    links: [
      { label: 'CRM: E-mail, SMS, Push, WhatsApp', href: '/servicos/crm-email-sms-push-whatsapp' },
      { label: 'Réguas de automação personalizadas', href: '/servicos/reguas-automacao-personalizadas' },
      { label: 'Reativação e programas de fidelização', href: '/servicos/reativacao-fidelizacao' },
      { label: 'Programas de indicação / Reviews', href: '/servicos/programas-indicacao-reviews' },
    ],
  },
  {
    heading: 'Inteligência & Operação — serviços',
    links: [
      { label: 'Analytics & BI', href: '/servicos/analytics-bi' },
      { label: 'Processos e Playbooks', href: '/servicos/processos-playbooks' },
      { label: 'Growth Contínuo', href: '/servicos/growth-continuo' },
    ],
  },
]

export default function MapaDoSite() {
  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-4">Navegação</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Mapa do Site</h1>
          <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
            Todas as páginas e seções do site da Ciclo E-commerce organizadas por categoria.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-10">
          {sections.map((section) => (
            <div key={section.heading} className="bg-white/3 border border-white/8 rounded-2xl p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#A100FF] mb-5">
                {section.heading}
              </h2>
              <ul className="space-y-3">
                {section.links.map(({ label, href }) => (
                  <li key={href} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A100FF]/50 flex-shrink-0" />
                    <Link
                      href={href}
                      className="text-sm text-[#D4D4D8] hover:text-[#A100FF] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="text-sm text-[#A1A1AA] mb-4">
            Precisa de algo específico? Fale com um especialista.
          </p>
          <Link
            href="/#contato"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#A100FF] text-white font-semibold text-sm hover:bg-[#8800DD] transition-colors"
          >
            Entrar em contato
          </Link>
        </div>
      </div>
    </main>
  )
}
