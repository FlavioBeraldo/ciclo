import { Mail, Globe } from 'lucide-react'

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

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-ciclo.png" alt="Ciclo E-commerce" className="h-12 w-auto" />
          </div>

          {/* Contact */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-[#A1A1AA]">
            <a
              href="https://www.cicloecommerce.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
              www.cicloecommerce.com.br
            </a>
            <a
              href="mailto:vendamais@cicloecommerce.com.br"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              vendamais@cicloecommerce.com.br
            </a>
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
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="grid grid-cols-3 gap-6 text-center sm:text-left text-xs text-[#A1A1AA]">
            <div>
              <p className="font-semibold text-white mb-1">Resposta em até</p>
              <p>48 horas úteis</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Reunião estratégica</p>
              <p>sem compromisso</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Análise personalizada</p>
              <p>do seu negócio</p>
            </div>
          </div>
          <p className="text-xs text-[#A1A1AA]">
            © {new Date().getFullYear()} Ciclo E-commerce. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
