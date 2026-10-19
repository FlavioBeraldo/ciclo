// Os redirects precisam levar a algum lugar, em um salto só.
//
// A auditoria do Search Console apontou 67 URLs em 404. Este teste não
// confere o relatório (ele está atrasado e é agregado); ele confere o que o
// código REALMENTE responde, para cada origem declarada em next.config.ts e
// para a lista de 404 confirmados na inspeção individual.
//
// O que ele afirma:
//
//   1. toda origem literal de redirect termina em 200 — nada aponta para 404;
//   2. em UM salto, fora a normalização de barra final que o Next faz sozinho;
//   3. nenhum laço;
//   4. os 404 confirmados deixaram de ser 404;
//   5. o destino tem canonical próprio, e não o da origem;
//   6. quem era noindex continua noindex — a intenção não se perde;
//   7. o sitemap não lista origem de redirect nem página noindex.
//
// Não faz rede externa, não cria lead, não mexe em mensuração. Só HTTP
// contra o servidor local servindo a árvore do commit.
//
// Uso:  node seo-redirects.mjs http://127.0.0.1:3100

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'
const RAIZ = process.env.RAIZ_CICLO ?? '/home/user/ciclo'

let falhas = 0
const ok = (t) => console.log('  ok    ' + t)
const falha = (t) => {
  console.log('  FALHA ' + t)
  falhas++
}
const conferir = (c, t) => (c ? ok(t) : falha(t))

const { readFileSync } = await import('node:fs')

// ── As origens declaradas no next.config.ts ─────────────────────────────────
// Leitura por texto, de propósito: importar o config exigiria o resolvedor do
// Next (ele importa JSON sem attribute). O formato das regras é estável.
function regrasLiterais() {
  const cfg = readFileSync(`${RAIZ}/next.config.ts`, 'utf8')
  const regras = []
  const re = /\{\s*source:\s*'([^']+)'\s*,\s*destination:\s*'([^']+)'\s*,\s*permanent:\s*true\s*\}/g
  for (const m of cfg.matchAll(re)) {
    const [, source, destination] = m
    if (source.includes(':')) continue // curingas são testados à parte
    regras.push({ source, destination })
  }
  return regras
}

/** Segue a cadeia e devolve cada parada. */
async function cadeia(caminho, limite = 6) {
  const paradas = []
  let url = BASE + caminho
  for (let i = 0; i < limite; i++) {
    const r = await fetch(url, { redirect: 'manual' })
    const destino = r.headers.get('location')
    paradas.push({ url: url.replace(BASE, ''), status: r.status, destino })
    if (r.status < 300 || r.status >= 400 || !destino) break
    url = destino.startsWith('http') ? destino : BASE + destino
  }
  return paradas
}

// Tira a barra final DO CAMINHO, não da URL inteira: com query a barra fica no
// meio (`/rota/?utm=...`), e a versão anterior desta função não a enxergava —
// a normalização do Next passava a ser contada como salto real, e o teste
// acusava cadeia onde não havia. O defeito era aqui, não no redirect.
const semBarra = (u) => {
  const i = u.indexOf('?')
  const caminho = i === -1 ? u : u.slice(0, i)
  const resto = i === -1 ? '' : u.slice(i)
  return (caminho.length > 1 && caminho.endsWith('/') ? caminho.slice(0, -1) : caminho) + resto
}

/**
 * Saltos que contam. A normalização de `/rota/` para `/rota` é do Next e
 * acontece em todo o site; ela não é uma parada de SEO que dê para evitar,
 * então sai da conta — mas tudo depois dela conta.
 */
function saltosReais(paradas) {
  return paradas.filter((p, i) => {
    if (p.status < 300 || p.status >= 400) return false
    const proximo = p.destino?.replace(BASE, '')
    return !(i === 0 && proximo === semBarra(p.url))
  }).length
}

// ── 1. Toda origem declarada chega a 200, em um salto ───────────────────────

console.log('\n1. Origens declaradas em next.config.ts')
{
  const regras = regrasLiterais()
  // ESCOPO, porque já escondeu uma cadeia: este bloco cobre só as regras
  // LITERAIS do next.config.ts. Os ~1554 redirects gerados de wp-slugs.json
  // não entram aqui — eles são conferidos por amostra no bloco 4 e, no caso
  // dos posts com sucessor, no bloco 2c.
  console.log(`  (${regras.length} regras literais; os gerados de wp-slugs ficam nos blocos 2c e 4)`)
  const quebradas = []
  const longas = []
  const lacos = []

  for (const { source, destination } of regras) {
    const paradas = await cadeia(source)
    const fim = paradas[paradas.length - 1]
    const vistos = new Set()
    for (const p of paradas) {
      if (vistos.has(p.url)) lacos.push(source)
      vistos.add(p.url)
    }
    if (fim.status !== 200) quebradas.push(`${source} -> ${paradas.map((p) => `${p.status}`).join('>')} (${fim.url})`)
    if (saltosReais(paradas) > 1) longas.push(`${source} -> ${paradas.map((p) => p.url).join(' > ')}`)
    if (paradas.length === 1 && paradas[0].status === 200) {
      // origem que responde 200 direto: a regra virou letra morta
    }
    void destination
  }

  conferir(quebradas.length === 0, `todas as origens terminam em 200 (${quebradas.length} quebradas)`)
  for (const q of quebradas.slice(0, 15)) console.log('        ' + q)
  conferir(longas.length === 0, `nenhuma cadeia com mais de um salto (${longas.length} longas)`)
  for (const l of longas.slice(0, 15)) console.log('        ' + l)
  conferir(lacos.length === 0, `nenhum laço (${lacos.length})`)
  for (const l of lacos.slice(0, 10)) console.log('        ' + l)
}

// ── 2. Os 404 confirmados na inspeção individual ────────────────────────────

// Têm equivalente comprovado, então têm que resolver.
const CONFIRMADOS_404 = [
  '/gestao-de-trafego-pago-para-e-commerce-aumente-suas-vendas/',
  '/google-ads-para-e-commerce-impulsione-suas-vendas-com-ciclo-e-commerce/',
  '/retail-media-para-e-commerce-amplie-suas-vendas-com-ciclo-e-commerce/',
  '/blog/como-atrair-clientes',
]

// Não têm equivalente: o site novo não tem página por segmento e o acervo não
// tem conteúdo do segmento. **404 é a resposta certa**, e o teste existe para
// alguém não "consertar" isso por reflexo depois.
const SEGMENTO_SEM_EQUIVALENTE = [
  '/marketing-para-loja-de-semijoias-aumente-suas-vendas-com-ciclo-e-commerce',
  '/marketing-para-loja-de-suplementos-aumente-suas-vendas-com-ciclo-e-commerce',
  '/marketing-para-loja-de-papeis-de-parede-aumente-suas-vendas-com-ciclo-e-commerce',
  '/marketing-para-loja-de-saude-e-bem-estar-aumente-suas-vendas-com-ciclo-e-commerce',
  '/marketing-para-loja-de-luxo-aumente-suas-vendas-com-ciclo-e-commerce',
  '/marketing-para-dnvbs-aumente-suas-vendas-com-ciclo-e-commerce',
  '/marketing-para-marcas-nativas-digitais-aumente-suas-vendas-com-ciclo-e-commerce',
]

console.log('\n2a. Landing por segmento: 404 é a resposta certa, e é deliberada')
for (const u of SEGMENTO_SEM_EQUIVALENTE) {
  const paradas = await cadeia(u)
  const fim = paradas[paradas.length - 1]
  conferir(fim.status === 404, `${u.slice(0, 62)} -> ${fim.status}`)
}

console.log('\n2. Os 404 com equivalente comprovado (com e sem barra)')
for (const u of CONFIRMADOS_404) {
  for (const variante of [u, semBarra(u)]) {
    const paradas = await cadeia(variante)
    const fim = paradas[paradas.length - 1]
    conferir(
      fim.status === 200,
      `${variante} -> ${paradas.map((p) => p.status).join('>')} ${fim.url}`
    )
  }
}

// ── 3. Podcast legado ───────────────────────────────────────────────────────

// ── 2b. A query sobrevive ao redirect ───────────────────────────────────────
//
// A doc do Next que vem no projeto é explícita: "When a redirect is applied,
// any query values provided in the request will be passed through to the
// redirect destination"
// (01-app/03-api-reference/05-config/01-next-config-js/redirects.md).
//
// Isso importa porque muita URL antiga chega com utm_* de campanha ou com
// ?amp de AMP. Se a query caísse no caminho, a visita perderia a atribuição —
// seria mudança de mensuração por via travessa, vinda de um patch de SEO.

console.log('\n2b. UTM e amp sobrevivem aos redirects novos e aos de canal')
{
  const QUERY = '?utm_source=teste&utm_medium=qa&utm_campaign=seo-check&amp'
  const COM_QUERY = [
    ['/google-ads-para-e-commerce-impulsione-suas-vendas-com-ciclo-e-commerce', '/servicos/google-ads'],
    ['/gestao-de-trafego-pago-para-e-commerce-aumente-suas-vendas', '/solucoes/captacao-de-demanda'],
    ['/retail-media-para-e-commerce-amplie-suas-vendas-com-ciclo-e-commerce', '/solucoes/captacao-de-demanda'],
    ['/blog/como-atrair-clientes', '/blog/como-atrair-clientes-qualificados-para-o-e-commerce'],
    ['/gestao-de-amazon-ads-impulsione-suas-vendas-na-amazon-com-ciclo-e-commerce', '/servicos/amazon-ads'],
    ['/gestao-de-shopee-ads-potencialize-suas-vendas-na-shopee-com-ciclo-e-commerce', '/servicos/shopee-ads'],
    ['/podcast/o-fator-m-episodio-1', '/ofatorm'],
  ]
  for (const [origem, destinoEsperado] of COM_QUERY) {
    const paradas = await cadeia(origem + QUERY)
    const fim = paradas[paradas.length - 1]
    const [caminho, query] = fim.url.split('?')
    const temTudo =
      query &&
      ['utm_source=teste', 'utm_medium=qa', 'utm_campaign=seo-check', 'amp'].every((par) =>
        query.includes(par.split('=')[0])
      )
    conferir(
      fim.status === 200 && caminho === destinoEsperado && temTudo,
      `${origem.slice(0, 46)} -> ${fim.status} ${caminho} ${temTudo ? '(query inteira)' : '(QUERY PERDIDA: ' + (query ?? 'nenhuma') + ')'}`
    )
  }
}

// ── 2c. Post com sucessor: um salto, não três ───────────────────────────────

console.log('\n2c. Post com sucessor — a cadeia dos redirects gerados')
{
  const QUERY = '?utm_source=teste&utm_medium=qa&utm_campaign=seo-check'
  const ORIGEM = '/ferramentas-de-e-mail-marketing-para-e-commerce'
  const DESTINO = '/blog/email-marketing-para-ecommerce'

  for (const variante of [ORIGEM, ORIGEM + '/', ORIGEM + QUERY, ORIGEM + '/' + QUERY]) {
    const paradas = await cadeia(variante)
    const fim = paradas[paradas.length - 1]
    const [caminho, query] = fim.url.split('?')
    const temQuery = !variante.includes('utm_') || (query && query.includes('utm_source'))
    conferir(
      fim.status === 200 && caminho === DESTINO && saltosReais(paradas) === 1 && temQuery,
      `${variante.replace(ORIGEM, '…e-mail-marketing…')} -> ${paradas.map((p) => p.status).join('>')} ${caminho}` +
        ` | saltos reais: ${saltosReais(paradas)}${variante.includes('utm_') ? (temQuery ? ' | query inteira' : ' | QUERY PERDIDA') : ''}`
    )
  }

  // O outro par de supersededWpPosts fica FORA do escopo deste patch, por
  // decisão. Medido e impresso para ninguém descobrir isso de novo do zero.
  const outro = await cadeia('/pinterest-ads-para-e-commerce-como-vender-mais-na-plataforma')
  console.log(
    `  nota  fora de escopo, mesma classe: /pinterest-ads-para-e-commerce-… -> ` +
      `${outro.map((p) => p.status).join('>')} ${outro[outro.length - 1].url} | saltos reais: ${saltosReais(outro)}`
  )
}

console.log('\n3. Podcast legado — inclusive slug com emoji')
for (const u of [
  '/podcast',
  '/podcast/',
  '/podcast/o-fator-m-episodio-1',
  '/podcast/epis%C3%B3dio-%F0%9F%8E%A7-teste',
]) {
  const paradas = await cadeia(u)
  const fim = paradas[paradas.length - 1]
  conferir(fim.status === 200, `${u} -> ${paradas.map((p) => p.status).join('>')} ${fim.url}`)
}

// ── 4. Amostra dos posts do WordPress ───────────────────────────────────────

console.log('\n4. Amostra de posts do WordPress')
{
  const slugs = JSON.parse(readFileSync(`${RAIZ}/src/data/wp-slugs.json`, 'utf8'))
  const amostra = [slugs[0], slugs[Math.floor(slugs.length / 2)], slugs[slugs.length - 1]]
  for (const slug of amostra) {
    const paradas = await cadeia(`/${slug}`)
    const fim = paradas[paradas.length - 1]
    conferir(
      fim.status === 200 && fim.url === `/blog/${slug}`,
      `/${slug.slice(0, 50)} -> ${fim.status} ${fim.url.slice(0, 60)}`
    )
  }
}

// ── 5. Canonical dos destinos ───────────────────────────────────────────────

console.log('\n5. O destino tem canonical próprio')
{
  const DESTINOS = [
    '/servicos/google-ads',
    '/servicos/amazon-ads',
    '/servicos/shopee-ads',
    '/solucoes/captacao-de-demanda',
    '/consultoria-para-e-commerce',
    '/ofatorm',
    '/blog',
    '/',
  ]
  for (const d of DESTINOS) {
    const html = await (await fetch(BASE + d)).text()
    const m = html.match(/<link rel="canonical" href="([^"]+)"/)
    const esperado = d === '/' ? 'https://cicloecommerce.com.br' : `https://cicloecommerce.com.br${d}`
    conferir(
      !!m && (m[1] === esperado || m[1] === esperado + '/'),
      `${d} canonical = ${m?.[1] ?? '(ausente)'}`
    )
  }
}

// ── 6. A intenção de noindex não se perde ───────────────────────────────────

console.log('\n6. noindex preservado onde já era')
for (const [rota, esperado] of [
  ['/aplicacao', 'noindex'],
  ['/link-bio', 'noindex'],
  ['/obrigado', 'noindex'],
  ['/', 'index'],
  ['/consultoria-ecom-shift', 'index'],
]) {
  const html = await (await fetch(BASE + rota)).text()
  const m = html.match(/<meta name="robots" content="([^"]+)"/)
  const conteudo = m?.[1] ?? '(ausente)'
  const temNoindex = /noindex/.test(conteudo)
  conferir(
    esperado === 'noindex' ? temNoindex : !temNoindex,
    `${rota} robots = ${conteudo}`
  )
}

// ── 7. robots.txt ───────────────────────────────────────────────────────────

console.log('\n7. robots.txt')
{
  const txt = await (await fetch(BASE + '/robots.txt')).text()
  conferir(!/^Disallow:\s*\/$/m.test(txt), 'não há bloqueio global')
  conferir(/Disallow:.*\/api\//.test(txt), '/api/ continua bloqueado')
  conferir(/Disallow:.*\/obrigado/.test(txt), '/obrigado continua bloqueado')
  conferir(/Allow:.*\/_next\/static\//.test(txt), 'os estáticos do Next são liberados (fontes, CSS e JS)')
  conferir(/Sitemap:.*\/sitemap\.xml/.test(txt), 'sitemap declarado')
}

// ── 8. Sitemap ──────────────────────────────────────────────────────────────

console.log('\n8. Sitemap')
{
  const r = await fetch(BASE + '/sitemap.xml')
  conferir(r.status === 200, `sitemap.xml responde ${r.status}`)
  const xml = await r.text()
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  conferir(urls.length > 100, `${urls.length} URLs no sitemap`)

  const caminhos = new Set(urls.map((u) => u.replace('https://cicloecommerce.com.br', '') || '/'))
  for (const proibido of ['/aplicacao', '/link-bio', '/obrigado']) {
    conferir(!caminhos.has(proibido), `${proibido} (noindex) fora do sitemap`)
  }
  const origens = regrasLiterais().map((r) => semBarra(r.source))
  const vazadas = origens.filter((o) => caminhos.has(o))
  conferir(vazadas.length === 0, `nenhuma origem de redirect no sitemap (${vazadas.length})`)
  for (const v of vazadas.slice(0, 10)) console.log('        ' + v)
}

console.log(
  '\n' +
    (falhas
      ? `${falhas} FALHA(S)`
      : 'TUDO OK — origens em 200 num salto, 404 confirmados resolvidos, canonical, noindex, robots e sitemap')
)
process.exit(falhas ? 1 : 0)
