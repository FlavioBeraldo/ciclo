import Link from 'next/link'
import Image from 'next/image'

const socials = [
  {
    label: 'Instagram da Ciclo E-commerce',
    href: 'https://www.instagram.com/cicloecommerce/',
    abbr: 'IG',
  },
  {
    label: 'LinkedIn da Ciclo E-commerce',
    href: 'https://www.linkedin.com/company/ciclo-ecommerce',
    abbr: 'IN',
  },
  {
    label: 'YouTube da Ciclo E-commerce',
    href: 'https://www.youtube.com/@ofatorm/videos',
    abbr: 'YT',
  },
]

const footerLinks = [
  {
    heading: 'Soluções',
    links: [
      { label: 'Geração de Demanda', href: '/solucoes/geracao-de-demanda' },
      { label: 'Captação de Demanda', href: '/solucoes/captacao-de-demanda' },
      { label: 'Expansão de Demanda', href: '/solucoes/expansao-de-demanda' },
      { label: 'Inteligência & Operação', href: '/solucoes/inteligencia-e-operacao' },
    ],
  },
  {
    heading: 'Serviços',
    links: [
      { label: 'TikTok Shop', href: '/tiktok-shop' },
      { label: 'Consultoria para E-commerce', href: '/consultoria-para-e-commerce' },
      { label: 'Google Ads / Bing Ads', href: '/servicos/google-ads-bing-ads' },
      { label: 'Meta Ads / TikTok Ads', href: '/servicos/meta-ads-tiktok-ads' },
      { label: 'CRM & Automação', href: '/servicos/crm-email-sms-push-whatsapp' },
      { label: 'Analytics & BI', href: '/servicos/analytics-bi' },
    ],
  },
  {
    heading: 'Conteúdo',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Cases de Sucesso', href: '/#cases' },
      { label: 'O Fator M — Podcast', href: '/ofatorm' },
      { label: 'ECOM Shift — Treinamento', href: '/ecomshift' },
    ],
  },
  {
    heading: 'Links úteis',
    links: [
      { label: 'Mapa do Site', href: '/mapa-do-site' },
      { label: 'Falar com especialista', href: '/#contato' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5">
      {/* Link grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-bold uppercase tracking-widest text-[#A100FF] mb-4">{col.heading}</p>
              <ul className="space-y-2.5">
                {col.links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-[#A1A1AA] hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div>
            <Image src="/logo-ciclo.png" alt="Ciclo E-commerce" width={160} height={60} className="h-[60px] w-auto" />
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {socials.map(({ label, href, abbr }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-[#A1A1AA] hover:border-[#A100FF] hover:text-[#A100FF] transition-all text-[10px] font-bold"
              >
                {abbr}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-[#A1A1AA]">
            © {new Date().getFullYear()} Ciclo E-commerce. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
