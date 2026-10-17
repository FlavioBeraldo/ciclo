// Roda antes do `next build`. Grava em src/data/episodios-fator-m.ts o último
// conjunto REAL de episódios de "O Fator M".
//
// Esse arquivo é o fallback do site: é o que aparece quando a API do YouTube
// não responde em tempo de execução. Antes o passo existia mas ninguém lia o
// resultado, e o fallback de verdade era uma lista fixa de vídeos de
// depoimento de cliente reetiquetados como episódio. Agora src/lib/youtube.ts
// lê este módulo, então o fallback é um retrato real do canal, do dia do
// build. É .ts e não .json para o teste do passo 18 conseguir importá-lo sem
// o resolvedor do Next.
//
// O filtro aqui é O MESMO de src/lib/youtube-server.ts (nada abaixo de 300s,
// nada marcado como short, nada vertical). Se divergirem, o fallback mostra
// uma lista que o site nunca mostraria.
//
// Sem YOUTUBE_API_KEY, ou com a API fora do ar, o arquivo existente fica como
// está — nunca é apagado nem substituído por conteúdo inventado.
const { writeFileSync } = require('fs')
const { join } = require('path')

const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE || '@ofatorm'
const OUT = join(__dirname, '..', 'src', 'data', 'episodios-fator-m.ts')

function segundos(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return 0
  return parseInt(m[1] || '0') * 3600 + parseInt(m[2] || '0') * 60 + parseInt(m[3] || '0')
}

async function pedir(url, oque) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${oque}: HTTP ${r.status}`)
  return r.json()
}

// Escreve o módulo com o mesmo formato que src/lib/youtube.ts espera.
//
// Os valores saem por JSON.stringify, não por aspas montadas à mão. Descrição
// de vídeo do YouTube tem quebra de linha, aspas e emoji; uma versão anterior
// disto montava a string na unha e gerava TypeScript inválido assim que a
// primeira descrição real chegava — o build local passava porque sem chave o
// script nem roda, e quebrava no Preview, que tem chave. Literal JSON é
// literal JavaScript válido, e escapa tudo.
function moduloTs(episodios) {
  const aspas = (v) => JSON.stringify(String(v ?? ''))
  const item = (e) =>
    '  {\n' +
    ['id', 'title', 'description', 'publishedAt', 'thumbnail', 'url']
      .map((k) => `    ${k}: ${aspas(e[k])},`)
      .join('\n') +
    '\n  },'
  return [
    '// GERADO POR scripts/fetch-youtube.js antes do `next build`. Não edite à mão:',
    '// o próximo build sobrescreve.',
    '//',
    '// Último conjunto REAL de episódios de "O Fator M". É o que o site mostra',
    '// quando a API do YouTube não responde. Era um arquivo .json; virou módulo',
    '// para o teste do passo 18 conseguir importá-lo sem o resolvedor do Next.',
    '',
    'export interface EpisodioGravado {',
    '  id: string',
    '  title: string',
    '  description: string',
    '  publishedAt: string',
    '  thumbnail: string',
    '  url: string',
    '}',
    '',
    'export const EPISODIOS: EpisodioGravado[] = [',
    ...episodios.map(item),
    ']',
    '',
  ].join('\n')
}

async function main() {
  if (!API_KEY) {
    console.log('[youtube] YOUTUBE_API_KEY ausente — mantendo o snapshot atual.')
    return
  }

  try {
    const canal = await pedir(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${CHANNEL_HANDLE}&key=${API_KEY}`,
      'canal'
    )
    const uploads = canal.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
    if (!uploads) throw new Error('playlist de uploads não encontrada')

    const playlist = await pedir(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploads}&maxResults=30&key=${API_KEY}`,
      'playlist'
    )
    const ids = (playlist.items || []).map((i) => i.snippet.resourceId.videoId).join(',')
    if (!ids) throw new Error('playlist vazia')

    const detalhes = await pedir(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,player&id=${ids}&key=${API_KEY}`,
      'detalhes'
    )

    const episodios = (detalhes.items || [])
      .filter((v) => {
        const titulo = v.snippet?.title?.toLowerCase() || ''
        const vertical = (v.player?.embedHeight ?? 0) > (v.player?.embedWidth ?? 1)
        return !(
          segundos(v.contentDetails?.duration || '') < 300 ||
          titulo.includes('#short') ||
          titulo.includes('#shorts') ||
          vertical
        )
      })
      .slice(0, 8)
      .map((v) => ({
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

    // Lista vazia não substitui o snapshot: seria trocar episódio real por
    // nada, e o site passaria a mostrar "indisponível" por causa do build.
    if (!episodios.length) throw new Error('nenhum episódio horizontal na resposta')

    writeFileSync(OUT, moduloTs(episodios))
    console.log(`[youtube] snapshot atualizado com ${episodios.length} episódios.`)
  } catch (err) {
    console.warn('[youtube] falhou, mantendo o snapshot atual:', err.message)
  }
}

main()
