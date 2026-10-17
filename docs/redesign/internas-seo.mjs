// Preservação de conteúdo, URLs e SEO das páginas internas de serviço e solução.
//
// Confere, para os 19 serviços e as 4 soluções, que o HTML servido continua
// trazendo exatamente o que @/lib/servicos e @/lib/solucoes definem: title,
// description, keywords, canonical, robots, o JSON-LD de FAQPage com as mesmas
// perguntas e respostas, e cada item de processo, entrega, resultado, exemplo
// e link de serviço. É o que prova que o redesign trocou a casca e não o
// conteúdo.
//
// Lê os dados direto do TypeScript, com o type stripping do Node, para não
// haver uma segunda cópia da verdade neste arquivo.
//
// Uso:  node --experimental-strip-types internas-seo.mjs [baseURL]

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'
const RAIZ = process.env.RAIZ_CICLO ?? '/home/user/ciclo'

const { servicos } = await import(`${RAIZ}/src/lib/servicos.ts`)
const { solucoes } = await import(`${RAIZ}/src/lib/solucoes.ts`)

let falhas = 0
const problemas = []
function conferir(cond, pagina, oque) {
  if (!cond) {
    falhas++
    problemas.push(`${pagina}: ${oque}`)
  }
}

// O HTML do Next escapa as aspas e os acentos de algumas formas; normaliza
// antes de procurar o texto.
function normalizar(s) {
  return String(s)
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
}

function pegar(html, re) {
  const m = html.match(re)
  return m ? normalizar(m[1]).trim() : null
}

function jsonLdFaq(html) {
  for (const m of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  )) {
    try {
      const o = JSON.parse(m[1])
      if (o['@type'] === 'FAQPage') return o
    } catch {
      /* outro bloco de JSON-LD */
    }
  }
  return null
}

async function conferirPagina({ rota, seo, faq, textos, links }) {
  const r = await fetch(BASE + rota)
  conferir(r.status === 200, rota, `respondeu ${r.status}`)
  if (r.status !== 200) return
  const bruto = await r.text()
  const html = normalizar(bruto)

  // ── SEO ──
  conferir(pegar(bruto, /<title>([^<]*)<\/title>/) === seo.title, rota, 'title mudou')
  conferir(
    pegar(bruto, /<meta name="description" content="([^"]*)"/) === normalizar(seo.description),
    rota,
    'description mudou'
  )
  conferir(
    pegar(bruto, /<link rel="canonical" href="([^"]*)"/) ===
      `https://cicloecommerce.com.br${rota}`,
    rota,
    'canonical mudou'
  )
  // O Next junta as keywords com vírgula sem espaço
  const keywords = pegar(bruto, /<meta name="keywords" content="([^"]*)"/)
  conferir(keywords === normalizar(seo.keywords.join(',')), rota, 'keywords mudaram')
  conferir(/index, ?follow/.test(bruto), rota, 'robots não é index,follow')

  // ── JSON-LD de FAQPage ──
  const ld = jsonLdFaq(bruto)
  conferir(!!ld, rota, 'sem JSON-LD de FAQPage')
  if (ld) {
    conferir(ld.mainEntity.length === faq.length, rota, 'número de perguntas no JSON-LD mudou')
    for (const { q, a } of faq) {
      const achou = ld.mainEntity.find((e) => e.name === q)
      conferir(!!achou, rota, `pergunta fora do JSON-LD: ${q.slice(0, 50)}`)
      conferir(achou?.acceptedAnswer?.text === a, rota, `resposta mudou: ${q.slice(0, 50)}`)
    }
  }

  // ── Conteúdo visível ──
  for (const t of textos) {
    conferir(html.includes(normalizar(t)), rota, `texto sumiu: ${String(t).slice(0, 60)}`)
  }

  // ── Links preservados ──
  for (const href of links) {
    conferir(html.includes(`href="${href}"`), rota, `link sumiu: ${href}`)
  }
}

for (const s of servicos) {
  await conferirPagina({
    rota: `/servicos/${s.slug}`,
    seo: s.seo,
    faq: s.faq,
    textos: [
      s.heroHeadline,
      s.tagline,
      s.heroDescription,
      s.what,
      ...s.howItWorks.flatMap(({ step, detail }) => [step, detail]),
      ...s.deliverables,
      ...s.results.flatMap(({ metric, label }) => [metric, label]),
      ...s.examples.flatMap(({ title, description, highlight }) => [
        title,
        description,
        highlight,
      ]),
      ...s.faq.flatMap(({ q, a }) => [q, a]),
    ],
    links: [`/solucoes/${s.parentSlug}`, ...s.relatedSlugs.map((r) => `/servicos/${r}`)],
  })
}

for (const s of solucoes) {
  await conferirPagina({
    rota: `/solucoes/${s.slug}`,
    seo: s.seo,
    faq: s.faq,
    textos: [
      s.heroHeadline,
      s.heroSub,
      s.heroDescription,
      s.whatIs,
      ...s.howItWorks.flatMap(({ step, description }) => [step, description]),
      ...s.results.flatMap(({ metric, description }) => [metric, description]),
      ...s.faq.flatMap(({ q, a }) => [q, a]),
    ],
    links: s.serviceLinks.map(({ slug }) => `/servicos/${slug}`),
  })
}

const total = servicos.length + solucoes.length
if (falhas) {
  console.log(`${falhas} FALHA(S) em ${total} páginas:`)
  for (const p of problemas.slice(0, 40)) console.log('  ' + p)
  process.exit(1)
}
console.log(`TUDO OK — ${total} páginas internas com conteúdo, URLs e SEO preservados`)
