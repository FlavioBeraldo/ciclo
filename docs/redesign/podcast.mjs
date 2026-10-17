// O Fator M: o HTML servido precisa trazer episódio REAL, sem JavaScript.
//
// Antes a busca era no navegador: o HTML saía com `FALLBACK_VIDEOS`, que eram
// quatro VÍDEOS DE DEPOIMENTO DE CLIENTE reetiquetados como episódio, com
// títulos que não existem. Só depois da montagem o JavaScript trocava pela
// lista real. Quem rastreia sem executar script — buscador, prévia de link,
// leitor — via os títulos falsos.
//
// Este teste não executa JavaScript: pede o HTML cru e confere
//
//   a) que os episódios do snapshot REAL estão lá, na home e em /ofatorm;
//   b) que nenhum dos quatro títulos reetiquetados aparece em lugar nenhum;
//   c) que nenhum dos quatro vídeos de depoimento aparece DENTRO da seção do
//      podcast (fora dela eles são legítimos: são os depoimentos mesmo);
//   d) que /api/youtube/latest continua devolvendo o mesmo contrato.
//
// Uso:  node podcast.mjs [baseURL]

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'
const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

const snapshot = JSON.parse(readFileSync(join(RAIZ, 'src/data/youtube-videos.json'), 'utf8'))

// Os quatro que ESTAVAM no fallback, com o título inventado para cada um.
const REETIQUETADOS = [
  ['djykk9EFghg', 'Líquido - Crescimento E-commerce'],
  ['xVdqhprwKWw', 'KVRA - Estratégia de Crescimento'],
  ['6B2XYATbK3Q', 'DANKI - Resultados Full Funnel'],
  ['EhnxUiDMMRg', 'Mamô Brasil - E-commerce de Sucesso'],
]

let falhas = 0
const ok = (t) => console.log('  ok    ' + t)
const falha = (t) => {
  console.log('  FALHA ' + t)
  falhas++
}
const conferir = (c, t) => (c ? ok(t) : falha(t))

// O HTML escapa aspas e & nos textos; comparo sobre o texto desescapado.
const texto = (html) =>
  html
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

async function pegar(rota) {
  const r = await fetch(BASE + rota)
  if (!r.ok) throw new Error(`${rota} respondeu ${r.status}`)
  return texto(await r.text())
}

// ── a) episódios reais no HTML cru ──────────────────────────────────────────

const home = await pegar('/')
const ofatorm = await pegar('/ofatorm')

const naHome = snapshot.slice(0, 6)
const faltamHome = naHome.filter((e) => !home.includes(e.title))
conferir(
  faltamHome.length === 0,
  `home traz os ${naHome.length} episódios no HTML servido, sem JavaScript` +
    (faltamHome.length ? ` — faltam: ${faltamHome.map((e) => e.id).join(', ')}` : '')
)

const noFatorM = snapshot.slice(0, 6)
const faltamFatorM = noFatorM.filter((e) => !ofatorm.includes(e.title))
conferir(
  faltamFatorM.length === 0,
  `/ofatorm traz os ${noFatorM.length} episódios no HTML servido, sem JavaScript` +
    (faltamFatorM.length ? ` — faltam: ${faltamFatorM.map((e) => e.id).join(', ')}` : '')
)

// A data mais recente do snapshot tem de estar no HTML como link do vídeo:
// prova que o id veio do snapshot e não de uma lista escrita à mão na página.
conferir(
  home.includes(`youtube.com/vi/${snapshot[0].id}/`) ||
    home.includes(`watch?v=${snapshot[0].id}`),
  `home aponta para o episódio mais recente (${snapshot[0].id})`
)

// ── b) nenhum título reetiquetado ───────────────────────────────────────────

for (const [, titulo] of REETIQUETADOS) {
  conferir(
    !home.includes(titulo) && !ofatorm.includes(titulo),
    `título inventado fora do ar: "${titulo}"`
  )
}

// ── c) nenhum vídeo de depoimento dentro da seção do podcast ────────────────

// Recorta do <section id="podcast"> até o próximo <section.
function secaoPodcast(html) {
  const i = html.indexOf('id="podcast"')
  if (i < 0) return null
  const inicio = html.lastIndexOf('<section', i)
  const fim = html.indexOf('<section', i)
  return html.slice(inicio, fim < 0 ? html.length : fim)
}

const secao = secaoPodcast(home)
if (!secao) {
  falha('não achei a seção #podcast na home')
} else {
  const intrusos = REETIQUETADOS.filter(([id]) => secao.includes(id))
  conferir(
    intrusos.length === 0,
    'seção #podcast sem vídeo de depoimento' +
      (intrusos.length ? ` — achei ${intrusos.map(([id]) => id).join(', ')}` : '')
  )
}

// ── d) contrato da rota ─────────────────────────────────────────────────────

const r = await fetch(BASE + '/api/youtube/latest')
const lista = await r.json()
const formaOk =
  Array.isArray(lista) &&
  lista.length > 0 &&
  lista.every(
    (v) =>
      typeof v.id === 'string' &&
      typeof v.title === 'string' &&
      typeof v.description === 'string' &&
      typeof v.publishedAt === 'string' &&
      typeof v.thumbnail === 'string' &&
      typeof v.url === 'string'
  )
conferir(formaOk, `/api/youtube/latest devolve ${lista.length} itens com os 6 campos de sempre`)
conferir(
  r.headers.get('cache-control')?.includes('s-maxage='),
  `cache-control preservado: ${r.headers.get('cache-control')}`
)
conferir(
  !lista.some((v) => REETIQUETADOS.some(([id]) => id === v.id)),
  'a rota não devolve vídeo de depoimento'
)

console.log(
  '\n' +
    (falhas
      ? `${falhas} FALHA(S)`
      : 'TUDO OK — episódio real no HTML servido, sem depoimento reetiquetado')
)
process.exit(falhas ? 1 : 0)
