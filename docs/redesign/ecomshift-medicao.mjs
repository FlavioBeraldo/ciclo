// /ecomshift: o `begin_checkout` tem de continuar idêntico.
//
// A página manda para o checkout da Hubla, e cada clique empurra um
// `begin_checkout` para o dataLayer com valor, moeda, atribuição e um
// `placement` que diz de qual botão veio. O redesign reconstruiu a página
// inteira; este teste prova que o evento não mudou.
//
// Nada sai para a rede: o navegador só fala com o host local, e o clique é
// impedido de navegar para a Hubla.
//
// Uso:  node ecomshift-medicao.mjs [baseURL]

import { chromium } from 'playwright-core'

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'

let falhas = 0
const ok = (t) => console.log('  ok    ' + t)
const falha = (t) => {
  console.log('  FALHA ' + t)
  falhas++
}
const conferir = (c, t) => (c ? ok(t) : falha(t))

// O contrato: nome do evento e chaves do payload, como estavam na base.
const CHAVES = [
  'event',
  'event_id',
  'value',
  'currency',
  'content_name',
  'placement',
  'items_count',
]

const navegador = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } })
const p = await ctx.newPage()

await p.route('**', (r) => {
  const u = r.request().url()
  return u.startsWith(BASE) ? r.continue() : r.fulfill({ status: 204, body: '' })
})

// O dataLayer antes de qualquer script da página, e nenhuma navegação para fora.
await p.addInitScript(() => {
  window.dataLayer = window.dataLayer || []
  document.addEventListener(
    'click',
    (e) => {
      const a = e.target instanceof Element ? e.target.closest('a[href^="http"]') : null
      if (a) e.preventDefault()
    },
    true
  )
})

await p.goto(BASE + '/ecomshift', { waitUntil: 'domcontentloaded' })
await p.waitForTimeout(800)

// ── 1. O botão da abertura: placement 'cta' ─────────────────────────────────

const botoes = p.locator('a.action-link:has-text("Quero acessar")')
const quantos = await botoes.count()
conferir(quantos >= 4, `${quantos} botões de checkout na página`)

await botoes.first().click()
await p.waitForTimeout(300)

const eventos = async () =>
  p.evaluate(() => (window.dataLayer || []).filter((e) => e && e.event === 'begin_checkout'))

let lista = await eventos()
conferir(lista.length === 1, `1 begin_checkout após o primeiro clique (vieram ${lista.length})`)

if (lista.length) {
  const e = lista[0]
  const faltando = CHAVES.filter((k) => !(k in e))
  conferir(faltando.length === 0, `payload com as 7 chaves de sempre${faltando.length ? ' — faltam ' + faltando.join(', ') : ''}`)
  conferir(e.value === 37.9, `value = ${e.value}, esperado 37.9`)
  conferir(e.currency === 'BRL', `currency = ${e.currency}`)
  conferir(e.content_name === 'ecomshift', `content_name = ${e.content_name}`)
  conferir(e.items_count === 1, `items_count = ${e.items_count}`)
  conferir(e.placement === 'cta', `placement = ${e.placement}, esperado cta`)
  conferir(typeof e.event_id === 'string' && e.event_id.length > 8, 'event_id presente')
}

// ── 2. A barra flutuante: placement 'header' ────────────────────────────────

// Ela aparece quando a abertura sai da tela e some quando o fechamento entra:
// rolo até o meio da página, não até o fim.
await p.evaluate(() => window.scrollTo(0, Math.round(document.body.scrollHeight * 0.45)))
await p.waitForTimeout(900)

const flutuante = p.locator('.cta-flutuante a.action-link')
const apareceu = await flutuante.count()
conferir(apareceu === 1, `barra flutuante visível no meio da página (achei ${apareceu})`)

if (apareceu) {
  await flutuante.click()
  await p.waitForTimeout(300)
  lista = await eventos()
  const ultimo = lista[lista.length - 1]
  conferir(lista.length === 2, `2 begin_checkout depois do segundo clique (vieram ${lista.length})`)
  conferir(ultimo?.placement === 'header', `placement do segundo = ${ultimo?.placement}, esperado header`)
  conferir(
    lista[0]?.event_id !== ultimo?.event_id,
    'cada clique gera um event_id próprio'
  )
}

// ── 3. Os vídeos abrem dentro da página ─────────────────────────────────────

const gatilhos = p.locator('button.video-trigger')
const nVideos = await gatilhos.count()
conferir(nVideos === 2, `${nVideos} vídeos com player interno, esperado 2`)

if (nVideos) {
  await gatilhos.first().click()
  await p.waitForTimeout(500)
  const src = await p.locator('iframe.video-embed').first().getAttribute('src')
  conferir(
    src === 'https://www.youtube.com/embed/oJBr4hIaW8k?autoplay=1',
    `o vídeo abre no mesmo embed de antes: ${src}`
  )
}

await navegador.close()
console.log(
  '\n' +
    (falhas
      ? `${falhas} FALHA(S)`
      : 'TUDO OK — begin_checkout idêntico nos dois placements e vídeos no player interno')
)
process.exit(falhas ? 1 : 0)
