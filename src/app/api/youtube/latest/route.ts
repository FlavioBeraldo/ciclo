import { NextResponse } from 'next/server'
import { buscarEpisodios } from '@/lib/youtube-server'

// Mesmo contrato de antes: um array de YouTubeVideo, com as mesmas janelas de
// cache. A regra de busca e de fallback saiu daqui para `lib/youtube-server`,
// porque agora as páginas também a usam — e duas cópias divergiriam.
export async function GET() {
  const { lista, origem } = await buscarEpisodios()

  return NextResponse.json(lista, {
    headers: {
      'Cache-Control':
        origem === 'api'
          ? 'public, s-maxage=600, stale-while-revalidate=600'
          : 'public, s-maxage=3600',
    },
  })
}
