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
    <footer className="bg-[#050505] border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-ciclo.png" alt="Ciclo E-commerce" className="h-[60px] w-auto" />
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
