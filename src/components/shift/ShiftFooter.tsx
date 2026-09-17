import Image from 'next/image'
import Link from 'next/link'

// Rodapé exclusivo da landing da Consultoria E-com Shift: marca, dados legais,
// política de privacidade e os perfis reais da Ciclo. Sem a grade de ofertas e
// treinamentos do rodapé global, que desviaria da aplicação.

const SOCIALS = [
  { abbr: 'IG', label: 'Instagram da Ciclo E-commerce', href: 'https://www.instagram.com/cicloecommerce/' },
  { abbr: 'IN', label: 'LinkedIn da Ciclo E-commerce', href: 'https://www.linkedin.com/company/ciclo-ecommerce' },
  { abbr: 'YT', label: 'YouTube da Ciclo E-commerce', href: 'https://www.youtube.com/@ofatorm/videos' },
]

export default function ShiftFooter() {
  return (
    <footer className="shift-footer">
      <div className="shift-container">
        <hr className="shift-rule" />
        <div className="shift-footer-top">
          <Link href="/" aria-label="Ciclo E-commerce — página inicial">
            <Image
              src="/logo-ciclo-white.png"
              alt="Ciclo E-commerce"
              width={1010}
              height={250}
              className="h-5 w-auto"
            />
          </Link>

          <div className="shift-footer-socials">
            {SOCIALS.map((social) => (
              <a
                key={social.abbr}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                {social.abbr}
              </a>
            ))}
          </div>
        </div>

        <div className="shift-footer-legal">
          <p className="shift-body">
            © {new Date().getFullYear()} Ciclo E-commerce. Todos os direitos reservados.
          </p>
          <p className="shift-body">
            CNPJ 23.757.895/0001-09 — Ciclo - Assessoria de Marketing e Inteligencia Digital Para
            E-Commerce LTDA
          </p>
          <p className="shift-body">
            <a href="/politica-de-privacidade">Política de Privacidade</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
