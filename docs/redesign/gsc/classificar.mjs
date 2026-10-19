// Classifica cada URL do Search Console contra o ESTADO ATUAL do código.
//
// O relatório agregado da GSC está atrasado e mostra o que o Google viu na
// última passada, não o que o site responde hoje. Este script faz a pergunta
// certa, URL por URL: **o que a árvore deste commit responde agora?**
//
// Para cada URL ele registra: categoria, estado verificado (cadeia de status
// até o destino final) e se existe conteúdo original no acervo — em
// `wp-posts.json` (777 posts) ou nos posts do Keystatic.
//
// Não faz rede externa. Só HTTP contra o servidor local.
//
// Uso:  node classificar.mjs http://127.0.0.1:3100 > inventario.tsv

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'
const RAIZ = process.env.RAIZ_CICLO ?? '/home/user/ciclo'

const { readFileSync, readdirSync, existsSync } = await import('node:fs')

const wpSlugs = new Set(JSON.parse(readFileSync(`${RAIZ}/src/data/wp-slugs.json`, 'utf8')))
const wpPosts = JSON.parse(readFileSync(`${RAIZ}/src/data/wp-posts.json`, 'utf8'))
const wpPorSlug = new Map(wpPosts.map((p) => [p.slug, p]))

const ksDir = `${RAIZ}/content/blog`
const ksSlugs = new Set(
  existsSync(ksDir)
    ? readdirSync(ksDir).map((n) => n.replace(/\.(mdoc|md|yaml)$/, '').replace(/\/index$/, ''))
    : []
)

// ── Normalização de título, para casar episódio com artigo do acervo ────────
const semAcento = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const PARAR = new Set(
  ('de da do das dos e o a as os um uma no na nos nas em para por com que como se seu sua' +
    ' ao aos the of to and is are um dois tres mais menos muito sobre entre ate pelo pela')
    .split(' ')
)

const palavras = (s) =>
  semAcento(s)
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter((p) => p.length > 3 && !PARAR.has(p))

// Índice de palavras -> posts do acervo
const indice = new Map()
for (const p of wpPosts) {
  for (const w of new Set(palavras(p.title))) {
    if (!indice.has(w)) indice.set(w, [])
    indice.get(w).push(p.slug)
  }
}

/** Melhor artigo do acervo para um texto, com a força do casamento. */
function melhorArtigo(texto) {
  const ws = new Set(palavras(texto))
  const contagem = new Map()
  for (const w of ws) {
    for (const slug of indice.get(w) ?? []) {
      contagem.set(slug, (contagem.get(slug) ?? 0) + 1)
    }
  }
  let melhor = null
  let maior = 0
  for (const [slug, n] of contagem) {
    const tituloWs = new Set(palavras(wpPorSlug.get(slug).title))
    // Jaccard: penaliza casar por uma palavra comum só
    const uniao = new Set([...ws, ...tituloWs]).size
    const score = n / uniao
    if (score > maior) {
      maior = score
      melhor = slug
    }
  }
  return { slug: melhor, score: Number(maior.toFixed(3)) }
}

// ── Estado atual, medido ────────────────────────────────────────────────────
async function cadeia(caminho, limite = 6) {
  const paradas = []
  let url = BASE + caminho
  for (let i = 0; i < limite; i++) {
    let r
    try {
      r = await fetch(url, { redirect: 'manual' })
    } catch {
      paradas.push({ url, status: 'ERRO' })
      break
    }
    const destino = r.headers.get('location')
    paradas.push({ url: url.replace(BASE, ''), status: r.status })
    if (r.status < 300 || r.status >= 400 || !destino) break
    url = destino.startsWith('http') ? destino : BASE + destino
  }
  return paradas
}

// ── Categoria, só por forma da URL ──────────────────────────────────────────
function categoria(host, caminho) {
  if (host !== 'cicloecommerce.com.br') return 'subdominio-fora-do-repo'
  const p = decodeURIComponent(caminho.split('?')[0])
  if (/^\/podcast\//.test(p)) return 'podcast-episodio'
  if (/^\/(categoria|category|tag|author)\//.test(p)) return 'taxonomia-wp'
  if (/\/page\/\d+/.test(p) || /[?&]page=/.test(caminho)) return 'paginacao'
  if (/[?&](fbclid|amp|utm_)/.test(caminho)) return 'url-com-parametro'
  if (/^\/upload\//.test(p)) return 'arquivo-de-midia'
  if (/^\/favicon\.ico/.test(caminho)) return 'asset'
  if (/^\/servicos\//.test(p)) return 'pagina-de-servico'
  if (/^\/solucoes\//.test(p)) return 'pagina-de-solucao'
  if (/^\/solucao\//.test(p)) return 'solucao-wp-antiga'
  if (/^\/case\//.test(p)) return 'case-wp-antigo'
  if (/^\/blog\//.test(p)) return 'post-do-blog'
  if (/^\/marketing-para-/.test(p)) return 'landing-por-segmento'
  if (/-com-ciclo-e-commerce\/?$/.test(p) || /^\/(gestao|google-ads|meta-ads|tiktok-ads|crm|retail-media)-/.test(p))
    return 'landing-de-servico'
  return 'pagina-wp-avulsa'
}

// ── Relatório ───────────────────────────────────────────────────────────────
const ARQUIVOS = [
  ['not_found', 'not-found-67.txt'],
  ['crawled_not_indexed', 'crawled-not-indexed-266.txt'],
  ['discovered', 'discovered-10.txt'],
]

console.log(
  ['gsc', 'url', 'categoria', 'estado_atual', 'destino_final', 'acervo', 'artigo_sugerido', 'score'].join('\t')
)

for (const [gsc, arquivo] of ARQUIVOS) {
  const linhas = readFileSync(`${RAIZ}/docs/redesign/gsc/${arquivo}`, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  for (const bruta of linhas) {
    let u
    try {
      u = new URL(bruta)
    } catch {
      console.log([gsc, bruta, 'url-invalida', '', '', '', '', ''].join('\t'))
      continue
    }
    const caminho = u.pathname + u.search
    const cat = categoria(u.hostname, caminho)

    let estado = 'nao-medido'
    let destino = ''
    if (cat !== 'subdominio-fora-do-repo') {
      const paradas = await cadeia(caminho)
      estado = paradas.map((p) => p.status).join('>')
      destino = paradas[paradas.length - 1].url
    } else {
      estado = 'fora-do-repo'
    }

    // Conteúdo original no acervo?
    const slugNu = decodeURIComponent(u.pathname).replace(/^\/|\/$/g, '').split('/').pop() ?? ''
    let acervo = ''
    if (wpSlugs.has(slugNu)) acervo = 'wp-slug'
    else if (wpPorSlug.has(slugNu)) acervo = 'wp-post'
    else if (ksSlugs.has(slugNu)) acervo = 'keystatic'

    // Para episódio sem artigo direto, procura o artigo equivalente
    let sugerido = ''
    let score = ''
    if (cat === 'podcast-episodio' && !acervo) {
      const limpo = decodeURIComponent(u.pathname)
        .replace(/^\/podcast\//, '')
        .replace(/\/$/, '')
        .replace(/roi-com-cast-\d+$/, '')
        .replace(/-\d+$/, '')
        .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}️]/gu, '')
      const m = melhorArtigo(limpo)
      if (m.slug && m.score >= 0.2) {
        sugerido = m.slug
        score = m.score
      }
    }

    console.log([gsc, bruta, cat, estado, destino, acervo, sugerido, score].join('\t'))
  }
}
