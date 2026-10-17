// Crawl local de todas as rotas públicas geradas.
//
// Percorre o sitemap e as páginas a partir da home, seguindo só links
// internos, e aponta: destino quebrado, âncora sem alvo, página órfã (gerada
// mas sem nenhum link apontando para ela) e ordem de títulos fora de
// hierarquia (h1 único, sem salto de nível).
//
// Nenhuma chamada externa sai: só o host local é buscado. Nenhum formulário é
// enviado — o crawl só faz GET.
//
// Uso:  node crawl.mjs [baseURL]

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'

const texto = (h) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

// ── 1. Universo de rotas: o sitemap é a fonte ───────────────────────────────
const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text()
const doSitemap = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(/^https:\/\/cicloecommerce\.com\.br/, ''))
  .map((u) => u || '/')

// Rotas públicas que não entram no sitemap mas existem
const extras = ['/obrigado', '/link-bio', '/aplicacao']
const universo = [...new Set([...doSitemap, ...extras])].sort()

console.log(`Rotas no sitemap: ${doSitemap.length} | universo conferido: ${universo.length}\n`)

// ── 2. Visita cada rota ─────────────────────────────────────────────────────
const paginas = new Map()
const quebrados = []
const ancorasSemAlvo = []
const hierarquia = []

for (const rota of universo) {
  const r = await fetch(BASE + rota, { redirect: 'manual' })
  if (r.status !== 200) {
    quebrados.push({ rota, status: r.status, de: 'sitemap' })
    continue
  }
  const html = await r.text()

  const links = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1])
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))

  // Hierarquia de títulos
  const titulos = [...html.matchAll(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => ({
    nivel: Number(m[1][1]),
    txt: texto(m[2]).slice(0, 50),
  }))
  const h1s = titulos.filter((t) => t.nivel === 1)
  if (h1s.length !== 1) hierarquia.push({ rota, problema: `${h1s.length} h1` })
  let anterior = 1
  for (const t of titulos) {
    if (t.nivel > anterior + 1) {
      hierarquia.push({ rota, problema: `salta h${anterior} → h${t.nivel} em "${t.txt}"` })
      break
    }
    anterior = t.nivel
  }

  // Âncoras da própria página
  for (const l of links) {
    if (l.startsWith('#') && l.length > 1 && !ids.has(l.slice(1))) {
      ancorasSemAlvo.push({ rota, ancora: l })
    }
  }

  paginas.set(rota, { links, ids })
}

// ── 3. Links internos: destino existe? ──────────────────────────────────────
const internos = new Map() // destino -> páginas que apontam
for (const [rota, { links }] of paginas) {
  for (const l of links) {
    if (!l.startsWith('/') || l.startsWith('//')) continue
    const [caminho, hash] = l.split('#')
    const destino = caminho || rota
    if (!internos.has(destino)) internos.set(destino, { origens: [], hashes: new Set() })
    internos.get(destino).origens.push(rota)
    if (hash) internos.get(destino).hashes.add(hash)
  }
}

const visitados = new Map()
for (const [destino, info] of internos) {
  if (['/sitemap.xml', '/robots.txt'].includes(destino)) continue
  let r = visitados.get(destino)
  if (!r) {
    const resp = await fetch(BASE + destino, { redirect: 'manual' })
    let html = ''
    let status = resp.status
    let finalUrl = destino
    if (status === 301 || status === 308 || status === 307 || status === 302) {
      // O Location pode vir absoluto (o servidor usa a origem do pedido).
      // Normaliza para caminho antes de seguir.
      const loc = resp.headers.get('location') ?? ''
      finalUrl = loc.startsWith('http') ? new URL(loc).pathname + new URL(loc).search : loc
      const seg = await fetch(BASE + finalUrl, { redirect: 'manual' })
      status = seg.status
      if (seg.status === 200) html = await seg.text()
    } else if (status === 200) {
      html = await resp.text()
    }
    r = { status, finalUrl, ids: new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])) }
    visitados.set(destino, r)
  }
  if (r.status !== 200) {
    quebrados.push({ rota: destino, status: r.status, de: info.origens.slice(0, 3).join(', ') })
  }
  for (const h of info.hashes) {
    if (!r.ids.has(h)) {
      ancorasSemAlvo.push({ rota: `${destino}#${h}`, ancora: h, de: info.origens.slice(0, 2).join(', ') })
    }
  }
}

// ── 4. Órfãs: geradas mas sem link apontando ────────────────────────────────
const orfas = universo.filter((r) => r !== '/' && !internos.has(r))

// ── 5. Relatório ────────────────────────────────────────────────────────────
const bloco = (titulo, itens, fmt) => {
  console.log(`\n== ${titulo}: ${itens.length}`)
  for (const i of itens.slice(0, 25)) console.log('   ' + fmt(i))
  if (itens.length > 25) console.log(`   … e mais ${itens.length - 25}`)
}

bloco('Destinos quebrados', quebrados, (q) => `${q.rota} → ${q.status}  (de: ${q.de})`)
bloco('Âncoras sem alvo', ancorasSemAlvo, (a) => `${a.rota}${a.de ? '  (de: ' + a.de + ')' : ''}`)
bloco('Páginas órfãs', orfas, (o) => o)
bloco('Hierarquia de títulos', hierarquia, (h) => `${h.rota}: ${h.problema}`)

const total = quebrados.length + ancorasSemAlvo.length + orfas.length + hierarquia.length
console.log(
  `\n${total === 0 ? 'TUDO OK' : total + ' PROBLEMA(S)'} — ${paginas.size} páginas visitadas, ` +
    `${internos.size} destinos internos distintos conferidos`
)
process.exit(total ? 1 : 0)
