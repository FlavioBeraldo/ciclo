// O conteúdo mudou onde devia, e só onde devia.
//
// Esta rodada trocou os indicadores sem fonte das páginas de serviço e de
// solução pelos cases reais da Ciclo, acrescentou perguntas de FAQ, texto na
// home, complemento em três artigos e cinco artigos novos.
//
// O que este passo afirma:
//
//   1. não sobrou métrica fictícia em servicos.ts nem em solucoes.ts;
//   2. os quatro resultados vêm de cases.ts, com a marca no rótulo, e cases.ts
//      continua byte a byte igual à base de produção anterior;
//   3. o bloco de cases tem 3 cards, sem número, e nenhum valor do bloco de
//      resultados se repete nele;
//   4. conteúdo legado preservado: as FAQs antigas continuam lá, o playbook
//      está intocado e os três artigos complementados mantêm corpo e título;
//   5. todo link interno novo aponta para URL que existe;
//   6. o JSON-LD de FAQPage bate com as perguntas visíveis no HTML;
//   7. os cinco artigos novos respondem 200, com h1, canonical próprio e
//      autoria institucional.
//
// Sem rede externa e sem criar lead.
//
// Uso:  node conteudo-seo.mjs http://127.0.0.1:3100

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'
const RAIZ = process.env.RAIZ_CICLO ?? '/home/user/ciclo'

let falhas = 0
const ok = (t) => console.log('  ok    ' + t)
const falha = (t) => {
  console.log('  FALHA ' + t)
  falhas++
}
const conferir = (c, t) => (c ? ok(t) : falha(t))

const { readFileSync, readdirSync } = await import('node:fs')
const { execFileSync } = await import('node:child_process')

const servicos = readFileSync(`${RAIZ}/src/lib/servicos.ts`, 'utf8')
const solucoes = readFileSync(`${RAIZ}/src/lib/solucoes.ts`, 'utf8')

// ── 1. Nenhuma métrica fictícia sobrou ──────────────────────────────────────

console.log('\n1. Indicadores sem fonte')
{
  conferir(!/metric: '/.test(servicos), 'servicos.ts sem métrica escrita à mão')
  conferir(!/metric: '/.test(solucoes), 'solucoes.ts sem métrica escrita à mão')
  conferir(!/highlight: '/.test(servicos), 'servicos.ts sem destaque escrito à mão')
  conferir(
    (servicos.match(/results: resultadosDosCases/g) ?? []).length === 17,
    '17 serviços lendo os resultados da fonte central'
  )
  conferir(
    (servicos.match(/examples: narrativasDosCases/g) ?? []).length === 17,
    '17 serviços lendo as narrativas da fonte central'
  )
  conferir(
    (solucoes.match(/results: resultadosDosCasesSolucao/g) ?? []).length === 4,
    '4 soluções lendo os resultados da fonte central'
  )

  // As frases que foram corrigidas não podem voltar
  for (const frase of [
    'de 3 a 5 vezes mais',
    'entre 30% e 50% do potencial',
    'ROI médio de 4000%',
    'acima de 95%',
    '2-3x mais rápido',
    'R$50-200 de receita',
    'de 5 a 7 vezes menos',
    '40-60% maior',
  ]) {
    conferir(!servicos.includes(frase), `alegação removida continua fora: "${frase}"`)
  }
}

// ── 2. A fonte dos cases não foi tocada ─────────────────────────────────────

console.log('\n2. A fonte dos cases')
{
  const atual = readFileSync(`${RAIZ}/src/lib/cases.ts`)
  let base = null
  try {
    base = execFileSync('git', ['show', '7ae962b:src/lib/cases.ts'], {
      cwd: RAIZ,
      maxBuffer: 8e6,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
  } catch {
    // base indisponível
  }
  conferir(
    base !== null && Buffer.compare(atual, base) === 0,
    'src/lib/cases.ts continua byte a byte igual à base de produção anterior'
  )

  const conteudo = readFileSync(`${RAIZ}/src/lib/cases-conteudo.ts`, 'utf8')
  conferir(
    !/metric: '[+-]?\d/.test(conteudo),
    'cases-conteudo.ts não tem valor escrito à mão — tudo vem de cases.ts'
  )
  conferir(
    conteudo.includes("import { cases } from './cases'"),
    'cases-conteudo.ts lê a fonte única'
  )
}

// ── 3. O que aparece na página de serviço ───────────────────────────────────

console.log('\n3. Blocos de resultados e de cases, no HTML servido')
{
  const html = await (await fetch(`${BASE}/servicos/google-ads`)).text()
  const secaoResultados = html.split('id="resultados"')[1]?.split('</section>')[0] ?? ''
  const semTag = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&middot;|&#183;/g, '·')

  const resultados = semTag(secaoResultados)
  for (const [marca, valor] of [
    ['Mamô', '+200%'],
    ['GoPro', '+120%'],
    ['Jack Links', '+57%'],
    ['Gringa', '+35%'],
  ]) {
    conferir(
      resultados.includes(marca) && resultados.includes(valor),
      `resultado identificado: ${marca} ${valor}`
    )
  }
  conferir(
    resultados.includes('escopo próprio') && resultados.includes('não representa uma previsão'),
    'a ressalva de escopo está na página'
  )
  conferir(
    !/não temos dados|números removidos|sem atribuição comprovada|não verificad/i.test(html),
    'nenhuma linguagem interna de auditoria vazou para a interface'
  )

  const iCases = html.indexOf('Cases da Ciclo')
  const secaoCases = html.slice(iCases).split('</section>')[0]
  const cases = semTag(secaoCases)
  conferir(
    (secaoCases.match(/<article/g) ?? []).length === 3,
    `3 cards no bloco de cases (vieram ${(secaoCases.match(/<article/g) ?? []).length})`
  )
  conferir(
    !/[+-]\d+%|\d+x\b/.test(cases),
    'nenhum número no bloco de cases — os valores ficam só em resultados'
  )
  conferir(cases.includes('trajetória da Ciclo'), 'contexto público do bloco de cases')
  conferir(secaoCases.includes('href="/#cases"'), 'link para os cases da home')
  for (const marca of ['Mamô', 'GoPro', 'Jack Links']) {
    conferir(cases.includes(marca), `narrativa de ${marca}`)
  }

  // A página que nunca teve esses blocos continua sem eles
  const ugc = await (await fetch(`${BASE}/servicos/agencia-ugc`)).text()
  conferir(!ugc.includes('id="resultados"'), '/servicos/agencia-ugc segue sem bloco de resultados')
  conferir(!ugc.includes('Cases da Ciclo'), '/servicos/agencia-ugc segue sem bloco de cases')
}

// ── 4. Conteúdo legado preservado ───────────────────────────────────────────

console.log('\n4. O que já existia continua lá')
{
  // FAQs antigas, uma por serviço, escolhidas entre as que existiam antes
  for (const [rota, pergunta] of [
    ['/servicos/google-ads', 'Performance Max'],
    ['/servicos/crm-email-sms-push-whatsapp', 'segmentação'],
    ['/servicos/tiktok-shop-social-commerce', 'ticket'],
  ]) {
    const html = await (await fetch(BASE + rota)).text()
    conferir(html.includes(pergunta), `${rota} manteve o conteúdo anterior ("${pergunta}")`)
  }

  // Os três artigos complementados mantêm título e corpo
  for (const [slug, trecho] of [
    ['qual-e-o-melhor-momento-de-contratar-uma-agencia-de-marketing-para-meu-e-commerce', 'Melhor Momento'],
    ['facebook-ads-google-ads-ou-tiktok-qual-escolher-em-2025', 'Qual Escolher'],
    ['markup-ou-margem-de-contribuicao-qual-usar-no-e-commerce', 'Margem de Contribuição'],
  ]) {
    const html = await (await fetch(`${BASE}/blog/${slug}`)).text()
    const h1 = html.match(/<h1[^>]*>([^<]*)/)?.[1] ?? ''
    conferir(h1.includes(trecho), `/blog/${slug.slice(0, 34)}… manteve o título original`)
    conferir(html.includes('article-complemento'), '  e recebeu a seção complementar')
  }

  // O arquivo do acervo não foi editado
  let diff = ''
  try {
    diff = execFileSync('git', ['diff', '--stat', 'HEAD', '--', 'src/data/wp-posts.json'], {
      cwd: RAIZ,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
  } catch {}
  conferir(diff.trim() === '', 'src/data/wp-posts.json não foi editado')
}

// ── 5. Links internos novos ─────────────────────────────────────────────────

console.log('\n5. Todo link novo aponta para página que existe')
{
  const complementos = readFileSync(`${RAIZ}/src/lib/blog-complementos.ts`, 'utf8')
  const novos = readdirSync(`${RAIZ}/content/blog`)
    .filter((n) => n.endsWith('.mdoc'))
    .map((n) => readFileSync(`${RAIZ}/content/blog/${n}`, 'utf8'))
    .join('\n')

  const urls = new Set([
    ...[...complementos.matchAll(/href: '(\/[a-z0-9/-]+)'/g)].map((m) => m[1]),
    ...[...novos.matchAll(/\]\((\/[a-z0-9/-]+)\)/g)].map((m) => m[1]),
  ])
  conferir(urls.size > 15, `${urls.size} URLs internas distintas para conferir`)

  const quebradas = []
  for (const u of urls) {
    const r = await fetch(BASE + u, { redirect: 'follow' })
    if (r.status !== 200) quebradas.push(`${u} -> ${r.status}`)
  }
  conferir(quebradas.length === 0, `nenhuma URL interna quebrada (${quebradas.length})`)
  for (const q of quebradas.slice(0, 10)) console.log('        ' + q)

  // Os links da home
  const home = await (await fetch(BASE)).text()
  conferir(home.includes('href="#solucoes"'), 'home: link para #solucoes')
  conferir(home.includes('href="/consultoria-para-e-commerce"'), 'home: link para a consultoria')
  conferir(
    home.includes('agência de marketing para e-commerce que conecta'),
    'home: parágrafo institucional publicado'
  )
}

// ── 6. JSON-LD bate com o HTML ──────────────────────────────────────────────

console.log('\n6. FAQPage consistente com o que a página mostra')
for (const rota of ['/servicos/google-ads', '/servicos/crm-email-sms-push-whatsapp', '/tiktok-shop']) {
  const html = await (await fetch(BASE + rota)).text()
  // A ordem dos atributos varia: /tiktok-shop põe o id antes do type.
  const blocos = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>(.*?)<\/script>/gs)].map(
    (m) => m[1]
  )
  const faq = blocos
    .map((b) => {
      try {
        return JSON.parse(b)
      } catch {
        return null
      }
    })
    .find((j) => j && j['@type'] === 'FAQPage')
  if (!faq) {
    falha(`${rota} sem FAQPage no JSON-LD`)
    continue
  }
  const visiveis = html.replace(/<[^>]+>/g, ' ')
  const fora = faq.mainEntity.filter((q) => {
    const limpo = q.name.replace(/&/g, '&amp;')
    return !visiveis.includes(q.name) && !visiveis.includes(limpo)
  })
  conferir(
    fora.length === 0,
    `${rota}: as ${faq.mainEntity.length} perguntas do JSON-LD aparecem no HTML`
  )
  conferir(
    !faq.mainEntity.some((q) => /4000%|de 3 a 5 vezes|acima de 95%/.test(q.acceptedAnswer.text)),
    `${rota}: nenhuma alegação removida sobrou no JSON-LD`
  )
}

// ── 7. Os artigos novos ─────────────────────────────────────────────────────

console.log('\n7. Os cinco artigos novos')
{
  const NOVOS = [
    'quanto-custa-uma-agencia-de-marketing-para-e-commerce',
    'agencia-equipe-interna-ou-consultoria-para-e-commerce',
    'quando-trocar-de-agencia-de-marketing-no-e-commerce',
    'como-escolher-uma-agencia-de-tiktok-shop',
    'como-medir-o-resultado-do-crm-alem-da-taxa-de-abertura',
  ]
  for (const slug of NOVOS) {
    const r = await fetch(`${BASE}/blog/${slug}`)
    const html = await r.text()
    const h1 = html.match(/<h1[^>]*>([^<]*)/)?.[1] ?? ''
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? ''
    conferir(
      r.status === 200 && h1.length > 10 && canonical.endsWith(`/blog/${slug}`),
      `${slug.slice(0, 44)}… ${r.status}, h1 e canonical próprio`
    )
    conferir(html.includes('Time Ciclo'), '  autoria institucional, sem pessoa real como revisora')
  }

  // Todos entram no sitemap
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text()
  const faltando = NOVOS.filter((s) => !xml.includes(`/blog/${s}<`))
  conferir(faltando.length === 0, `os 5 artigos estão no sitemap (${faltando.length} fora)`)
}

console.log(
  '\n' +
    (falhas
      ? `${falhas} FALHA(S)`
      : 'TUDO OK — indicadores sem fonte fora, cases reais no lugar, legado preservado e links de pé')
)
process.exit(falhas ? 1 : 0)
