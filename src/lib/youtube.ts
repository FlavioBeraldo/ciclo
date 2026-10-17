// Importação RELATIVA de propósito: assim o teste do passo 18 consegue
// carregar este módulo com `node --experimental-strip-types`, sem depender do
// resolvedor de `@/` do Next.
import { EPISODIOS } from '../data/episodios-fator-m'

export const CANAL_URL = 'https://www.youtube.com/@ofatorm'

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  publishedAt: string
  thumbnail: string
  url: string
}

// Último conjunto de episódios REAIS do canal @ofatorm, gravado em
// `src/data/episodios-fator-m.ts` por `scripts/fetch-youtube.js` antes do
// `next build`. É o que aparece quando a API do YouTube não responde.
//
// Antes daqui saíam quatro VÍDEOS DE DEPOIMENTO DE CLIENTE reetiquetados com
// títulos que não existem ("Líquido - Crescimento E-commerce") e data de
// marcador 2024-01-01. Isso significava anunciar como episódio do podcast
// algo que nunca foi episódio. O conteúdo atual são episódios de verdade,
// com o título e a data que o canal publicou.
//
// Se o snapshot estiver vazio, quem consome mostra o estado de indisponível
// com link para o canal — nunca inventa, nunca reaproveita depoimento.
export const EPISODIOS_SNAPSHOT: YouTubeVideo[] = EPISODIOS
