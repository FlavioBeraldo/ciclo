import Link from 'next/link'
import { simboloPorServico } from '../servicos/diagramas'

// Grade de cartões para "Continue explorando" (serviços) e "O que a Ciclo
// entrega" (soluções). O ícone de cada serviço é o mesmo símbolo do hero
// daquela página — SVG do kit, injetado como HTML porque é marcação fixa
// gerada no build, não conteúdo de usuário.

export default function CartoesDeServico({
  servicos,
}: {
  servicos: { slug: string; title: string; tagline: string }[]
}) {
  return (
    <div className="directory-grid">
      {servicos.map((s) => (
        <Link href={`/servicos/${s.slug}`} className="directory-card" key={s.slug}>
          <div
            className="card-icon"
            dangerouslySetInnerHTML={{ __html: simboloPorServico[s.slug] ?? '' }}
          />

          <h3>{s.title}</h3>

          <p>{s.tagline}</p>

          <span className="read-more">
            Conhecer solução <b>↗</b>
          </span>
        </Link>
      ))}
    </div>
  )
}
