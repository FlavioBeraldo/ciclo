// O título da página tem de estar no h1.
//
// Pedido do Flávio em 17/10/2026: o nome da página abre o `<h1>`, pequeno,
// acima da chamada grande — que continua dentro do mesmo h1, para não sumir
// do índice de títulos de quem navega por cabeçalho.
//
// Cada rota declara aqui o começo esperado do h1. Nas páginas de artigo a
// regra não se aplica: lá o h1 já é o título do artigo.
//
// Uso:  node --experimental-strip-types h1-das-paginas.mjs [baseURL]

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'
const RAIZ = process.env.RAIZ_CICLO ?? '/home/user/ciclo'

const { servicos } = await import(`${RAIZ}/src/lib/servicos.ts`)
const { solucoes } = await import(`${RAIZ}/src/lib/solucoes.ts`)

let falhas = 0
const problemas = []
const conferir = (cond, rota, oque) => {
  if (!cond) {
    falhas++
    problemas.push(`${rota}: ${oque}`)
  }
}

const texto = (html) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()

const CASOS = [
  { rota: '/', comeca: 'Agência de Marketing para E-commerce - Full Funnel' },
  { rota: '/blog', comeca: 'Blog de E-commerce · Ciclo Insights' },
  { rota: '/tiktok-shop', comeca: 'Agência TikTok Shop' },
  { rota: '/depoimentos', comeca: 'Depoimentos' },
  { rota: '/mapa-do-site', comeca: 'Mapa do Site' },
  // Exceção registrada: na política o rótulo pequeno continua sendo
  // "Conformidade Legal", que era o texto que já estava na página. Trocá-lo
  // pelo título apagaria copy existente; o nome da página vem logo depois,
  // dentro do mesmo h1.
  { rota: '/politica-de-privacidade', comeca: 'Conformidade Legal Política de Privacidade' },
  ...servicos.map((s) => ({ rota: `/servicos/${s.slug}`, comeca: s.title })),
  ...solucoes.map((s) => ({ rota: `/solucoes/${s.slug}`, comeca: s.heroSub })),
]

for (const { rota, comeca } of CASOS) {
  const r = await fetch(BASE + rota)
  conferir(r.status === 200, rota, `respondeu ${r.status}`)
  if (r.status !== 200) continue
  const html = await r.text()

  const achados = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)]
  conferir(achados.length === 1, rota, `tem ${achados.length} h1, deveria ter 1`)
  if (!achados.length) continue

  const conteudo = texto(achados[0][1])
  conferir(
    conteudo.startsWith(texto(comeca)),
    rota,
    `h1 deveria começar por "${texto(comeca)}" e começa por "${conteudo.slice(0, 70)}"`
  )
}

// Nos artigos o h1 é o próprio título, e continua único
for (const rota of [
  '/blog/meta-creator-marketing-hub',
  '/blog/full-funnel-marketing-por-que-sua-marca-perde-dinheiro',
  '/blog/advantage-shopping-guia',
]) {
  const html = await (await fetch(BASE + rota)).text()
  const achados = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)]
  conferir(achados.length === 1, rota, `tem ${achados.length} h1, deveria ter 1`)
  if (achados.length) {
    const titulo = texto((html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? '')
    conferir(
      titulo.startsWith(texto(achados[0][1])),
      rota,
      'o h1 do artigo deveria ser o título do artigo'
    )
  }
}

const total = CASOS.length + 3
if (falhas) {
  console.log(`${falhas} FALHA(S) em ${total} páginas:`)
  for (const p of problemas.slice(0, 30)) console.log('  ' + p)
  process.exit(1)
}
console.log(`TUDO OK — ${total} páginas com um h1 só, começando pelo título da página`)
