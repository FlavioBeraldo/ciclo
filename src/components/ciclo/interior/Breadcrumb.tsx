import Link from 'next/link'

// Caminho da página das internas, conforme o kit. A última etapa é texto, não
// link, e leva `aria-current`. A cadeia é a mesma que as páginas já tinham.

export interface Etapa {
  rotulo: string
  href?: string
}

export default function Breadcrumb({ etapas }: { etapas: Etapa[] }) {
  return (
    <nav className="breadcrumb" aria-label="Caminho da página">
      {etapas.map((e, i) => (
        <span key={e.rotulo} style={{ display: 'contents' }}>
          {e.href ? (
            <Link href={e.href}>{e.rotulo}</Link>
          ) : (
            <span aria-current="page">{e.rotulo}</span>
          )}
          {i < etapas.length - 1 && <span aria-hidden="true">/</span>}
        </span>
      ))}
    </nav>
  )
}
