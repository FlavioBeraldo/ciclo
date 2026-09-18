import Image from 'next/image'
import Link from 'next/link'

// Cabeçalho exclusivo da landing da Consultoria E-com Shift.
// Enxuto de propósito: só a marca, as âncoras da própria página e um CTA.
// Não substitui nem altera o Header global do site.

const ANCHORS = [
  { label: 'Método', href: '#metodo' },
  { label: 'A consultoria', href: '#a-consultoria' },
  { label: 'Quem conduz', href: '#quem-conduz' },
]

export default function ShiftHeader() {
  return (
    <header className="shift-header">
      <div className="shift-container shift-header-inner">
        {/* A landing é fechada: a marca volta ao topo desta página, não ao site */}
        <a href="#topo" aria-label="Voltar ao topo da página">
          <Image
            src="/logo-ciclo-white.png"
            alt="Ciclo E-commerce"
            width={1010}
            height={250}
            className="h-5 w-auto"
            priority
          />
        </a>

        <nav className="shift-header-nav" aria-label="Seções da consultoria">
          {ANCHORS.map((anchor) => (
            <a key={anchor.href} href={anchor.href}>
              {anchor.label}
            </a>
          ))}
        </nav>

        <Link href="/aplicacao" className="shift-cta shift-cta--sm">
          Aplicar
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </header>
  )
}
