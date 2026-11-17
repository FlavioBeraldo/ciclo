import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PaginaDeCase from '@/components/ciclo/case/PaginaDeCase'
import { getAllEstudoDeCaseSlugs, getEstudoDeCase } from '@/data/estudos-de-caso'
import { playfair2026 } from '@/components/ciclo/fonts'
import '@/components/ciclo/base.css'
import '@/components/ciclo/interiors.css'
import '@/components/ciclo/case/case.css'

// Páginas completas de case: /cases/mamo, /cases/gringa, /cases/gopro.
//
// Só os slugs de `@/data/estudos-de-caso` existem; qualquer outro é 404. O
// `/cases` sozinho continua no redirect para /depoimentos (next.config.ts), e
// as fotos em /public/cases/*.jpg seguem servidas como arquivo estático.

const BASE = 'https://cicloecommerce.com.br'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllEstudoDeCaseSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const caso = getEstudoDeCase(slug)
  if (!caso) return { title: 'Não encontrado | Ciclo E-commerce' }

  const url = `${BASE}/cases/${slug}`
  const imagem = {
    url: `${BASE}${caso.hero.foto.src}`,
    width: caso.hero.foto.largura,
    height: caso.hero.foto.altura,
    alt: caso.hero.foto.alt,
  }

  return {
    title: caso.seo.titulo,
    description: caso.seo.descricao,
    openGraph: {
      title: caso.seo.titulo,
      description: caso.seo.descricao,
      url,
      type: 'article',
      locale: 'pt_BR',
      siteName: 'Ciclo E-commerce',
      images: [imagem],
    },
    twitter: {
      card: 'summary_large_image',
      title: caso.seo.titulo,
      description: caso.seo.descricao,
      images: [imagem.url],
    },
    robots: { index: true, follow: true },
    alternates: { canonical: url },
  }
}

export default async function CasePage({ params }: PageProps) {
  const { slug } = await params
  const caso = getEstudoDeCase(slug)
  if (!caso) notFound()

  return (
    <div className={`ciclo2026 ${playfair2026.variable}`}>
      <PaginaDeCase caso={caso} />
    </div>
  )
}
