import { EPISODIOS_SNAPSHOT, type YouTubeVideo } from './youtube'

// Busca dos episódios de "O Fator M" no servidor.
//
// Antes esta lógica vivia dentro de `/api/youtube/latest` e as páginas a
// chamavam do navegador, depois da montagem. O HTML servido saía sempre com o
// fallback, e só o JavaScript trocava pelo conteúdo real — quem rastreia sem
// executar script via o fallback. Agora a página chama esta função no
// servidor e o HTML já sai com episódio de verdade; a rota continua existindo
// e usa exatamente esta mesma função, para não haver duas versões da regra.

// Lidas por chamada, não no carregamento do módulo: assim o teste consegue
// exercitar "sem chave" e "com chave" sem recarregar nada.
const chave = () => process.env.YOUTUBE_API_KEY
const canal = () => process.env.YOUTUBE_CHANNEL_HANDLE || '@ofatorm'

// Mesma janela de cache de sempre. A home revalida a cada 900s e consulta o
// cache de dados do Next; não há mais uma chamada por visitante.
const CACHE = { next: { revalidate: 600 } } as const

// Tempo limite por chamada.
//
// Isto existe porque a busca agora roda DENTRO da renderização da página: sem
// limite, uma API do YouTube lenta seguraria a regeneração da home até o
// tempo limite da plataforma. Com limite, ela desiste rápido e cai para o
// snapshot — o visitante vê episódio real de qualquer jeito.
//
// São três chamadas em série, então o pior caso é ~3× este valor.
const TEMPO_LIMITE_MS = 3500

/** De onde veio a lista que está na tela. */
export type OrigemEpisodios =
  /** API do YouTube, dado do momento */
  | 'api'
  /** Último conjunto real gravado no build, porque a API não respondeu */
  | 'snapshot'
  /** Nem API nem snapshot: quem consome mostra indisponível */
  | 'vazio'

export interface Episodios {
  lista: YouTubeVideo[]
  origem: OrigemEpisodios
}

function segundos(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return 0
  return parseInt(m[1] || '0') * 3600 + parseInt(m[2] || '0') * 60 + parseInt(m[3] || '0')
}

async function pedir(url: string, oque: string) {
  // `signal` desliga a memoização do fetch do Next (dedup dentro de um mesmo
  // render), não o cache de dados. Aqui as três URLs são diferentes, então a
  // memoização não fazia diferença.
  const r = await fetch(url, { ...CACHE, signal: AbortSignal.timeout(TEMPO_LIMITE_MS) })
  if (!r.ok) {
    // 403 costuma ser cota estourada ou chave sem permissão; o motivo entra
    // no log para a falha não virar "sumiu o podcast" sem explicação.
    throw new Error(`${oque}: HTTP ${r.status}`)
  }
  return r.json()
}

async function daApi(): Promise<YouTubeVideo[]> {
  const API_KEY = chave()
  if (!API_KEY) throw new Error('YOUTUBE_API_KEY ausente')

  const dadosDoCanal = await pedir(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${canal()}&key=${API_KEY}`,
    'canal'
  )
  const uploads = dadosDoCanal.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!uploads) throw new Error('playlist de uploads não encontrada')

  // Pede mais do que precisa porque os Shorts são descartados depois.
  const playlist = await pedir(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploads}&maxResults=30&key=${API_KEY}`,
    'playlist'
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ids = (playlist.items || []).map((i: any) => i.snippet.resourceId.videoId).join(',')
  if (!ids) throw new Error('playlist vazia')

  const detalhes = await pedir(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,player&id=${ids}&key=${API_KEY}`,
    'detalhes'
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const horizontais = (detalhes.items || []).filter((v: any) => {
    const titulo = v.snippet?.title?.toLowerCase() || ''
    const vertical = (v.player?.embedHeight ?? 0) > (v.player?.embedWidth ?? 1)
    const curto =
      segundos(v.contentDetails?.duration || '') < 300 ||
      titulo.includes('#short') ||
      titulo.includes('#shorts') ||
      vertical
    return !curto
  })

  if (!horizontais.length) throw new Error('nenhum episódio horizontal na resposta')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return horizontais.slice(0, 8).map((v: any) => ({
    id: v.id,
    title: v.snippet.title,
    description: v.snippet.description,
    publishedAt: v.snippet.publishedAt,
    thumbnail:
      v.snippet.thumbnails?.high?.url ||
      v.snippet.thumbnails?.medium?.url ||
      `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
    url: `https://www.youtube.com/watch?v=${v.id}`,
  }))
}

/**
 * Os episódios mais recentes, com a origem explícita.
 *
 * Nunca lança: chave ausente, API fora do ar, cota estourada ou resposta
 * vazia caem para o snapshot, e o snapshot vazio vira `vazio`. Isso importa
 * porque a função é chamada durante a renderização da página — uma exceção
 * aqui derrubaria a home inteira.
 */
export async function buscarEpisodios(
  // O snapshot entra por parâmetro só para o teste conseguir exercitar o caso
  // "sem snapshot nenhum". Em produção ninguém passa nada.
  snapshot: YouTubeVideo[] = EPISODIOS_SNAPSHOT
): Promise<Episodios> {
  try {
    return { lista: await daApi(), origem: 'api' }
  } catch (err) {
    console.warn('[youtube] usando snapshot:', err instanceof Error ? err.message : err)
    return snapshot.length
      ? { lista: snapshot, origem: 'snapshot' }
      : { lista: [], origem: 'vazio' }
  }
}
