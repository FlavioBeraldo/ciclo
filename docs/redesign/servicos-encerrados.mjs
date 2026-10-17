// Os dois serviços encerrados em 17/10/2026.
//
// `/servicos/processos-playbooks` e `/servicos/growth-continuo` saíram do ar.
// Este teste cobre o que precisa ser verdade depois disso:
//
//   1. As duas rotas respondem com redirecionamento permanente.
//   2. O destino é a solução Inteligência & Operação, que já cobre os dois
//      temas em "como funciona" e no FAQ.
//   3. O destino responde 200 na primeira tentativa: sem 404, sem laço e sem
//      cadeia de redirecionamento.
//   4. Nenhuma página do site ainda aponta para as rotas encerradas.
//   5. O sitemap não as lista.
//   6. As 17 páginas de serviço que ficaram continuam respondendo.
//
// Uso:  node --experimental-strip-types servicos-encerrados.mjs [baseURL]

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'
const RAIZ = process.env.RAIZ_CICLO ?? '/home/user/ciclo'

const { servicos } = await import(`${RAIZ}/src/lib/servicos.ts`)
const { solucoes } = await import(`${RAIZ}/src/lib/solucoes.ts`)

const ENCERRADOS = ['processos-playbooks', 'growth-continuo']
const DESTINO = '/solucoes/inteligencia-e-operacao'

let falhas = 0
const ok = (t) => console.log('  ok    ' + t)
const falha = (t) => {
  console.log('  FALHA ' + t)
  falhas++
}
const conferir = (cond, t) => (cond ? ok(t) : falha(t))

// ── 1 a 3. Redirecionamento permanente, direto, para destino vivo ───────────
for (const slug of ENCERRADOS) {
  const rota = `/servicos/${slug}`
  const r = await fetch(BASE + rota, { redirect: 'manual' })
  conferir(r.status === 308 || r.status === 301, `${rota} responde ${r.status}, permanente`)
  const destino = (r.headers.get('location') ?? '').replace(BASE, '')
  conferir(destino === DESTINO, `${rota} aponta para ${DESTINO} (foi para ${destino})`)

  // O destino tem de ser final: 200 de primeira, sem outra parada
  const d = await fetch(BASE + destino, { redirect: 'manual' })
  conferir(d.status === 200, `${destino} responde 200 sem encadear (${d.status})`)

  // A forma com barra no fim é normalizada pelo Next antes das regras, em
  // todo o site — não é um salto a mais destas duas rotas. O que se confere
  // aqui é que ela termina no mesmo lugar, sem laço.
  const comBarra = await fetch(`${BASE}${rota}/`, { redirect: 'follow' })
  conferir(
    comBarra.status === 200 && new URL(comBarra.url).pathname === DESTINO,
    `${rota}/ termina em ${DESTINO} (terminou em ${new URL(comBarra.url).pathname})`
  )
}

// ── 4. Ninguém mais aponta para as rotas encerradas ─────────────────────────
const paginas = [
  '/',
  '/mapa-do-site',
  DESTINO,
  ...servicos.map((s) => `/servicos/${s.slug}`),
  ...solucoes.map((s) => `/solucoes/${s.slug}`),
]
const comLinkMorto = []
for (const rota of paginas) {
  const html = await (await fetch(BASE + rota)).text()
  for (const slug of ENCERRADOS) {
    if (html.includes(`/servicos/${slug}`)) comLinkMorto.push(`${rota} -> ${slug}`)
  }
}
conferir(
  comLinkMorto.length === 0,
  comLinkMorto.length
    ? `ainda há link para as rotas encerradas: ${comLinkMorto.slice(0, 6).join(', ')}`
    : `nenhuma das ${paginas.length} páginas aponta para as rotas encerradas`
)

// ── 5. Fora do sitemap ──────────────────────────────────────────────────────
const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text()
conferir(
  ENCERRADOS.every((s) => !sitemap.includes(`/servicos/${s}`)),
  'as rotas encerradas não estão no sitemap'
)
conferir(sitemap.includes(DESTINO), 'o destino está no sitemap')

// ── 6. Os serviços que ficaram continuam de pé ──────────────────────────────
conferir(servicos.length === 17, `restaram ${servicos.length} serviços (esperado 17)`)
let vivos = 0
for (const s of servicos) {
  const r = await fetch(`${BASE}/servicos/${s.slug}`, { redirect: 'manual' })
  if (r.status === 200) vivos++
  else falha(`/servicos/${s.slug} responde ${r.status}`)
}
conferir(vivos === servicos.length, `${vivos} páginas de serviço respondendo 200`)

console.log('\n' + (falhas ? `${falhas} FALHA(S)` : 'TUDO OK — dois serviços encerrados sem 404, laço ou cadeia'))
process.exit(falhas ? 1 : 0)
