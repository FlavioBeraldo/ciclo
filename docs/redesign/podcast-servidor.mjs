// `buscarEpisodios()` sob condições que não dá para provocar na tela.
//
// O passo 13 olha o HTML servido e confirma que ele traz episódio real. Isso
// NÃO distingue API de snapshot: hoje os dois coincidem, e os dois são reais.
// Este teste ataca a função direto, com o `fetch` global trocado por um mock,
// e separa os casos.
//
// Importa `src/lib/youtube-server.ts` com `--experimental-strip-types`. É por
// isso que o snapshot virou módulo `.ts` com importação relativa: assim o
// arquivo carrega sem o resolvedor de `@/` do Next.
//
// SEGURANÇA: nenhuma chamada sai. O `globalThis.fetch` é substituído antes de
// o módulo ser carregado, e toda URL é respondida aqui dentro.
//
// Uso:  node --experimental-strip-types podcast-servidor.mjs

const RAIZ = process.env.RAIZ_CICLO ?? '/home/user/ciclo'

let falhas = 0
const ok = (t) => console.log('  ok    ' + t)
const falha = (t) => {
  console.log('  FALHA ' + t)
  falhas++
}
const conferir = (c, t) => (c ? ok(t) : falha(t))

// ── Respostas de mentira, no formato da API do YouTube ──────────────────────

const canal = {
  items: [{ contentDetails: { relatedPlaylists: { uploads: 'UU-teste' } } }],
}
const playlist = (ids) => ({
  items: ids.map((id) => ({ snippet: { resourceId: { videoId: id } } })),
})
const detalhes = (videos) => ({
  items: videos.map((v) => ({
    id: v.id,
    contentDetails: { duration: v.duracao ?? 'PT30M0S' },
    player: { embedWidth: 1280, embedHeight: 720 },
    snippet: {
      title: v.titulo,
      description: '',
      publishedAt: v.data ?? '2026-10-16T12:00:00Z',
      thumbnails: { high: { url: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` } },
    },
  })),
})

/** Troca o fetch global por um roteador de mentira e devolve o registro. */
function instalarMock(responder) {
  const chamadas = []
  globalThis.fetch = async (url, init) => {
    chamadas.push(String(url))
    return responder(String(url), init, chamadas.length)
  }
  return chamadas
}

const json = (corpo) =>
  new Response(JSON.stringify(corpo), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })

/** Resposta padrão: canal → playlist → detalhes, com os vídeos pedidos. */
const respostaNormal = (videos) => (url) => {
  if (url.includes('/channels?')) return json(canal)
  if (url.includes('/playlistItems?')) return json(playlist(videos.map((v) => v.id)))
  if (url.includes('/videos?')) return json(detalhes(videos))
  throw new Error('URL inesperada: ' + url)
}

process.env.YOUTUBE_API_KEY = 'chave-de-teste'
process.env.YOUTUBE_CHANNEL_HANDLE = '@ofatorm'

const { buscarEpisodios } = await import(`${RAIZ}/src/lib/youtube-server.ts`)
const { EPISODIOS_SNAPSHOT } = await import(`${RAIZ}/src/lib/youtube.ts`)

// ── 1. A API responde ───────────────────────────────────────────────────────

{
  instalarMock(
    respostaNormal([
      { id: 'novo-1', titulo: 'Episódio novo 1' },
      { id: 'novo-2', titulo: 'Episódio novo 2' },
    ])
  )
  const r = await buscarEpisodios()
  conferir(r.origem === 'api', `API respondendo → origem "${r.origem}", esperado "api"`)
  conferir(r.lista[0]?.id === 'novo-1', `a lista vem da API: ${r.lista.map((e) => e.id).join(', ')}`)
}

// ── 2. Episódio novo depois de a janela expirar ─────────────────────────────
//
// Duas chamadas, com a API devolvendo coisa diferente na segunda. Prova que a
// função não guarda nada por conta própria: assim que o cache de dados do
// Next expira e ela é chamada de novo, o episódio novo aparece.
//
// NÃO prova a janela de 600s do cache do Next nem a revalidação da página:
// isso é do framework e da plataforma, e só se observa com o tempo passando.

{
  let rodada = 0
  globalThis.fetch = async (url) => {
    const u = String(url)
    if (u.includes('/channels?')) return json(canal)
    const videos =
      rodada === 0
        ? [{ id: 'antes-1', titulo: 'Episódio de ontem' }]
        : [
            { id: 'depois-1', titulo: 'Episódio publicado agora' },
            { id: 'antes-1', titulo: 'Episódio de ontem' },
          ]
    if (u.includes('/playlistItems?')) return json(playlist(videos.map((v) => v.id)))
    if (u.includes('/videos?')) {
      rodada++
      return json(detalhes(videos))
    }
    throw new Error('URL inesperada: ' + u)
  }

  const antes = await buscarEpisodios()
  const depois = await buscarEpisodios()
  conferir(antes.lista[0]?.id === 'antes-1', `1ª chamada traz o episódio de ontem`)
  conferir(
    depois.lista[0]?.id === 'depois-1',
    `2ª chamada traz o episódio novo: ${depois.lista[0]?.id}`
  )
  conferir(depois.lista.length === 2, `a lista cresceu de 1 para ${depois.lista.length}`)
}

// ── 3. A API trava: o tempo limite tem de cortar ────────────────────────────

{
  // O mock respeita o `signal`: só rejeita quando o tempo limite dispara.
  globalThis.fetch = (url, init) =>
    new Promise((_, rejeitar) => {
      init?.signal?.addEventListener('abort', () =>
        rejeitar(Object.assign(new Error('The operation was aborted'), { name: 'TimeoutError' }))
      )
    })

  // `AbortSignal.timeout` usa timer sem referência: sozinho, ele não segura o
  // laço de eventos, e este processo de teste sairia calado antes de o tempo
  // limite disparar. Num servidor isso não acontece, porque sempre há algo
  // pendente. Aqui eu seguro o laço à mão enquanto espero.
  const segura = setInterval(() => {}, 100)
  const comecou = Date.now()
  const r = await buscarEpisodios()
  const levou = Date.now() - comecou
  clearInterval(segura)

  conferir(r.origem === 'snapshot', `API travada → origem "${r.origem}", esperado "snapshot"`)
  conferir(
    levou < 8000,
    `desistiu em ${levou}ms, sem segurar a renderização (limite do código: 3500ms por chamada)`
  )
  conferir(
    r.lista.length === EPISODIOS_SNAPSHOT.length,
    `caiu para o snapshot inteiro: ${r.lista.length} episódios`
  )
}

// ── 4. Cota estourada (403) ─────────────────────────────────────────────────

{
  instalarMock(async () => new Response('quota', { status: 403 }))
  const r = await buscarEpisodios()
  conferir(r.origem === 'snapshot', `403 → origem "${r.origem}", esperado "snapshot"`)
}

// ── 5. Sem chave ────────────────────────────────────────────────────────────

{
  const guardada = process.env.YOUTUBE_API_KEY
  delete process.env.YOUTUBE_API_KEY
  const chamadas = instalarMock(async () => json(canal))
  const r = await buscarEpisodios()
  conferir(r.origem === 'snapshot', `sem chave → origem "${r.origem}", esperado "snapshot"`)
  conferir(chamadas.length === 0, `sem chave, nenhuma chamada sai (saíram ${chamadas.length})`)
  process.env.YOUTUBE_API_KEY = guardada
}

// ── 6. A API responde, mas só com Shorts ────────────────────────────────────

{
  instalarMock(
    respostaNormal([
      { id: 'curto-1', titulo: 'Corte rápido', duracao: 'PT1M30S' },
      { id: 'curto-2', titulo: 'Clipe #shorts', duracao: 'PT0M45S' },
    ])
  )
  const r = await buscarEpisodios()
  conferir(r.origem === 'snapshot', `só Shorts → origem "${r.origem}", esperado "snapshot"`)
  conferir(
    !r.lista.some((e) => e.id.startsWith('curto-')),
    'nenhum Short entra na lista de episódios'
  )
}

// ── 7. Nem API nem snapshot ─────────────────────────────────────────────────

{
  instalarMock(async () => new Response('erro', { status: 500 }))
  const r = await buscarEpisodios([])
  conferir(r.origem === 'vazio', `sem API e sem snapshot → origem "${r.origem}"`)
  conferir(r.lista.length === 0, 'lista vazia, para a página mostrar o estado de indisponível')
}

// ── 8. O snapshot não tem depoimento reetiquetado ───────────────────────────

{
  const depoimentos = ['djykk9EFghg', 'xVdqhprwKWw', '6B2XYATbK3Q', 'EhnxUiDMMRg']
  conferir(
    !EPISODIOS_SNAPSHOT.some((e) => depoimentos.includes(e.id)),
    'o snapshot gravado não contém nenhum vídeo de depoimento'
  )
  conferir(
    EPISODIOS_SNAPSHOT.every((e) => e.publishedAt !== '2024-01-01T00:00:00Z'),
    'nenhuma data de marcador 2024-01-01 no snapshot'
  )
}

console.log(
  '\n' +
    (falhas
      ? `${falhas} FALHA(S)`
      : 'TUDO OK — API, episódio novo, tempo limite, cota, sem chave, só Shorts e sem snapshot')
)
process.exit(falhas ? 1 : 0)
