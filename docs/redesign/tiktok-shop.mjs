// Preservação da página /tiktok-shop no redesign.
//
// O Flávio confirmou que o FAQ precisa ficar por causa do SEO, e a ordem é
// preservar URL, metadata, canonical, os três JSON-LD e todo o conteúdo. Este
// teste confere exatamente isso, mais o que o redesign acrescentou: o
// diagrama das quatro frentes com texto de verdade, legível no celular.
//
// A lista de textos vem de @/components/ciclo/tiktok/conteudo.ts, que é a
// transcrição literal do que estava no ar. A conferência de que nada se
// perdeu na transcrição foi feita contra o arquivo antigo no momento da
// migração; daqui em diante este arquivo é a referência.
//
// Uso:  node --experimental-strip-types tiktok-shop.mjs [baseURL]

import { chromium } from 'playwright-core'

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'
const RAIZ = process.env.RAIZ_CICLO ?? '/home/user/ciclo'
const ROTA = '/tiktok-shop'

const c = await import(`${RAIZ}/src/components/ciclo/tiktok/conteudo.ts`)

let falhas = 0
const ok = (t) => console.log('  ok    ' + t)
const falha = (t) => {
  console.log('  FALHA ' + t)
  falhas++
}
const conferir = (cond, t) => (cond ? ok(t) : falha(t))

const normalizar = (s) =>
  String(s)
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()

// ── HTML servido: metadata, schema e conteúdo ───────────────────────────────
const bruto = await (await fetch(BASE + ROTA)).text()
const html = normalizar(bruto)

const pegar = (re) => {
  const m = bruto.match(re)
  return m ? normalizar(m[1]) : null
}

conferir(
  pegar(/<title>([^<]*)<\/title>/) ===
    'Agência TikTok Shop | Gestão e Escala no Social Commerce — Ciclo E-commerce',
  'title preservado'
)
conferir(
  pegar(/<link rel="canonical" href="([^"]*)"/) === 'https://cicloecommerce.com.br/tiktok-shop',
  'canonical preservado'
)
conferir(/index, ?follow/.test(bruto), 'robots index,follow')
conferir(
  (pegar(/<meta name="description" content="([^"]*)"/) ?? '').startsWith(
    'Agência especializada em TikTok Shop no Brasil'
  ),
  'description preservada'
)
conferir(
  (pegar(/<meta name="keywords" content="([^"]*)"/) ?? '').split(',').length === 14,
  'as 14 keywords continuam'
)

// Os três JSON-LD
const blocos = [...bruto.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)]
  .map((m) => {
    try {
      return JSON.parse(m[1])
    } catch {
      return null
    }
  })
  .filter(Boolean)
const tipos = blocos.map((b) => b['@type'])
conferir(tipos.includes('Service'), 'JSON-LD Service presente')
conferir(tipos.includes('BreadcrumbList'), 'JSON-LD BreadcrumbList presente')
const faqLd = blocos.find((b) => b['@type'] === 'FAQPage')
conferir(!!faqLd, 'JSON-LD FAQPage presente')
// Eram 6 na base do redesign. Em 19/10 entrou UMA pergunta complementar, por
// autorização do Flávio, no accordion e no schema ao mesmo tempo — a página tem
// duas fontes de FAQ, e a primeira tentativa atualizou só uma delas. O número
// aqui sobe junto, e o que o teste continua garantindo é que as duas fontes
// batem: toda pergunta do accordion está no schema, e o schema não tem sobra.
conferir(faqLd?.mainEntity?.length === 7, `FAQPage com 7 perguntas (tem ${faqLd?.mainEntity?.length})`)
conferir(
  faqLd?.mainEntity?.length === c.FAQ.length,
  `schema e accordion com a mesma quantidade (${faqLd?.mainEntity?.length} e ${c.FAQ.length})`
)

// O FAQ visível: as perguntas E as respostas
let faqOk = true
for (const { q, a } of c.FAQ) {
  if (!html.includes(normalizar(q))) {
    faqOk = false
    falha(`pergunta sumiu do FAQ: ${q.slice(0, 60)}`)
  }
  if (!html.includes(normalizar(a))) {
    faqOk = false
    falha(`resposta sumiu do FAQ: ${q.slice(0, 60)}`)
  }
}
if (faqOk) ok('as 6 perguntas e as 6 respostas do FAQ, na íntegra')

// Todo o resto do conteúdo
const textos = [
  c.HERO.titulo,
  c.HERO.lead,
  c.HERO.selo,
  c.HERO.ctaPrimario,
  c.HERO.ctaSecundario,
  ...c.HERO.numeros.flatMap((n) => [n.valor, n.rotulo]),
  ...c.PILARES.flatMap((p) => [p.titulo, p.texto]),
  ...c.FRENTES.flatMap((f) => [
    f.titulo,
    ...f.servicos.flatMap((s) => [s.titulo, s.texto, ...s.entregaveis]),
  ]),
  c.CONVERSAO.titulo,
  c.CONVERSAO.texto,
  ...c.CONVERSAO.barras.flatMap((b) => [b.rotulo, b.valor]),
  ...c.CONVERSAO.jornada.map((j) => j.rotulo),
  c.NUMEROS.titulo,
  c.NUMEROS.lead,
  c.NUMEROS.destaque.valor,
  c.NUMEROS.destaque.rotulo,
  ...c.NUMEROS.cartoes.flatMap((x) => [x.valor, x.rotulo, x.fonte].filter(Boolean)),
  c.NUMEROS.nota.titulo,
  c.NUMEROS.nota.texto,
  c.ROADMAP.titulo,
  c.ROADMAP.lead,
  ...c.ROADMAP.passos.flatMap((p) => [p.titulo, p.texto, ...(p.lista ?? [])].filter(Boolean)),
  c.CTA_FINAL.titulo,
  c.CTA_FINAL.texto,
  c.CTA_FINAL.botao,
]
const sumidos = textos.filter((t) => !html.includes(normalizar(t)))
conferir(
  sumidos.length === 0,
  sumidos.length
    ? `${sumidos.length} texto(s) sumiram: ${sumidos.slice(0, 4).map((t) => t.slice(0, 40)).join(' | ')}`
    : `os ${textos.length} textos da página continuam no HTML`
)

// Um h1 só, abrindo pelo nome da página
const h1 = [...bruto.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)]
conferir(h1.length === 1, `um h1 só (tem ${h1.length})`)
conferir(
  normalizar((h1[0]?.[1] ?? '').replace(/<[^>]+>/g, ' ')).startsWith('Agência TikTok Shop'),
  'o h1 abre com "Agência TikTok Shop"'
)

// ── No navegador: diagrama acessível e celular sem rolagem lateral ──────────
const navegador = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })

for (const [rotulo, largura] of [['desktop', 1440], ['celular', 390]]) {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 } })
  await ctx.route('**/*', (r) =>
    r.request().url().startsWith(BASE) || r.request().url().startsWith('data:')
      ? r.continue()
      : r.abort()
  )
  const p = await ctx.newPage()
  await p.goto(BASE + ROTA, { waitUntil: 'load' })
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 800) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 40))
    }
    window.scrollTo(0, 0)
  })
  await p.waitForTimeout(700)

  conferir(
    !(await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)),
    `${rotulo}: sem rolagem lateral`
  )

  // O diagrama tem texto de verdade, não imagem
  const frentes = await p.locator('.tts-frente').count()
  conferir(frentes === 4, `${rotulo}: as 4 frentes estão na página (${frentes})`)
  // O núcleo do diagrama. Era `.tts-nucleo` no esquema branco; em 21/10 o
  // bloco virou o painel escuro e o núcleo passou a ser `.tts-centro`. O que
  // se exige continua sendo o mesmo: o centro do diagrama visível, com texto.
  conferir(
    await p.locator('.tts-centro strong').first().isVisible(),
    `${rotulo}: o núcleo do diagrama está visível`
  )
  conferir(
    (await p.locator('.tts-centro strong').first().innerText()).trim() === 'TikTok Shop',
    `${rotulo}: o núcleo nomeia a operação`
  )
  conferir(
    (await p.locator('.tts-frente h3').allInnerTexts()).join(' ').includes('Afiliação e creators'),
    `${rotulo}: os títulos das frentes são texto`
  )

  // Nada de texto miúdo no celular
  if (largura === 390) {
    const miudo = await p.evaluate(() => {
      const ruins = []
      for (const el of document.querySelectorAll('.tts-painel *, .section-index a')) {
        const temTexto = [...el.childNodes].some(
          (n) => n.nodeType === 3 && n.textContent.trim().length > 0
        )
        if (!temTexto) continue
        const t = parseFloat(getComputedStyle(el).fontSize)
        if (t < 11) ruins.push({ t, txt: el.textContent.trim().slice(0, 30) })
      }
      return ruins
    })
    conferir(miudo.length === 0, `celular: nenhum texto abaixo de 11px no diagrama (${miudo.length})`)

    // O diagrama empilha: nenhuma frente lado a lado
    const colunas = await p.evaluate(
      () => new Set([...document.querySelectorAll('.tts-frente')].map((e) => Math.round(e.getBoundingClientRect().left))).size
    )
    conferir(colunas === 1, `celular: as frentes ficam empilhadas numa coluna (${colunas})`)
  }

  // As âncoras do índice da página existem
  const ancoras = await p.locator('.section-index a').evaluateAll((as) =>
    as.map((a) => a.getAttribute('href'))
  )
  const semAlvo = await p.evaluate(
    (hrefs) => hrefs.filter((h) => h?.startsWith('#') && !document.querySelector(h)),
    ancoras
  )
  conferir(semAlvo.length === 0, `${rotulo}: as ${ancoras.length} âncoras do índice têm destino`)

  await ctx.close()
}

await navegador.close()
console.log('\n' + (falhas ? `${falhas} FALHA(S)` : 'TUDO OK — /tiktok-shop com conteúdo, SEO e schema preservados'))
process.exit(falhas ? 1 : 0)
