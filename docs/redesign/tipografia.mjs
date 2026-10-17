// Tipografia do escopo `.ciclo2026`.
//
// Padrão definido pelo Flávio: Inter estrutura e informa; Playfair Display em
// itálico entra só nas frases curtas de voz editorial — a segunda linha de uma
// chamada, a assinatura de uma página, um destaque de abertura.
//
// Este teste substitui o antigo `so-inter.mjs`, que exigia Inter em tudo. Ele
// confere as duas pontas da regra:
//
//   1. Os ganchos editoriais (.editorial-accent, .hero-sub, .inner-signature,
//      <em> dentro de .inner fora do corpo de artigo) estão em Playfair.
//   2. Todo o resto está em Inter — inclusive o <em> do corpo do artigo, que
//      é ênfase de quem escreveu e não ornamento.
//
// O /playbook-social-commerce fica de fora: está congelado e tem a Playfair
// dele, carregada por outra variável.
//
// Uso:  node tipografia.mjs [baseURL]

import { chromium } from 'playwright-core'

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'
const ROTAS = [
  '/',
  '/servicos/meta-ads',
  '/servicos/agencia-ugc',
  '/solucoes/captacao-de-demanda',
  '/blog',
  '/blog/meta-creator-marketing-hub',
  '/blog/full-funnel-marketing-por-que-sua-marca-perde-dinheiro',
  '/tiktok-shop',
  '/depoimentos',
  '/ofatorm',
  '/ecomshift',
  '/consultoria-para-e-commerce',
  '/consultoria-ecom-shift',
  '/obrigado',
  '/aplicacao',
  '/link-bio',
  '/mapa-do-site',
  '/politica-de-privacidade',
]

const navegador = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
let falhas = 0
let editoriais = 0

for (const rota of ROTAS) {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 1000 } })
  await ctx.route('**/*', (r) =>
    r.request().url().startsWith(BASE) || r.request().url().startsWith('data:')
      ? r.continue()
      : r.abort()
  )
  const p = await ctx.newPage()
  await p.goto(BASE + rota, { waitUntil: 'load' })
  await p.waitForTimeout(900)

  const r = await p.evaluate(() => {
    const escopo = document.querySelector('.ciclo2026')
    if (!escopo) return { erro: 'sem escopo .ciclo2026' }

    const IGNORAR = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'])
    const primeiraFamilia = (el) =>
      getComputedStyle(el).fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '')

    // Um gancho editorial é o que o CSS marca como voz da marca
    const ehEditorial = (el) =>
      el.classList.contains('editorial-accent') ||
      el.classList.contains('hero-sub') ||
      el.classList.contains('inner-signature') ||
      (el.tagName === 'EM' && el.closest('.inner') && !el.closest('.article-body')) ||
      (el.tagName === 'BLOCKQUOTE' && el.closest('.special-module'))

    const semSerifa = []
    const comSerifaIndevida = []
    let achadosEditoriais = 0

    for (const el of escopo.querySelectorAll('*')) {
      if (IGNORAR.has(el.tagName)) continue
      const temTexto = [...el.childNodes].some(
        (n) => n.nodeType === 3 && n.textContent.trim().length > 0
      )
      if (!temTexto) continue

      const familia = primeiraFamilia(el)
      const resumo = {
        tag: el.tagName.toLowerCase(),
        cls: String(el.className).slice(0, 40),
        familia,
        txt: el.textContent.trim().slice(0, 44),
      }

      if (ehEditorial(el)) {
        achadosEditoriais++
        if (!/playfair/i.test(familia)) semSerifa.push(resumo)
      } else if (/playfair|georgia|times/i.test(familia)) {
        comSerifaIndevida.push(resumo)
      }
    }
    return { semSerifa, comSerifaIndevida, achadosEditoriais }
  })

  if (r.erro) {
    falhas++
    console.log(`  FALHA ${rota} — ${r.erro}`)
  } else if (r.semSerifa.length || r.comSerifaIndevida.length) {
    falhas += r.semSerifa.length + r.comSerifaIndevida.length
    console.log(`  FALHA ${rota}`)
    for (const a of r.semSerifa.slice(0, 4))
      console.log('        editorial sem Playfair: ' + JSON.stringify(a))
    for (const a of r.comSerifaIndevida.slice(0, 4))
      console.log('        serifa onde não devia:  ' + JSON.stringify(a))
  } else {
    editoriais += r.achadosEditoriais
    console.log(`  ok    ${rota} — ${r.achadosEditoriais} frase(s) editorial(is) em Playfair`)
  }
  await ctx.close()
}

// ── O popup do playbook, sobre as rotas do blog ─────────────────────────────
//
// Fica fora do escopo `.ciclo2026` e deve seguir inteiro em Inter: é um aviso
// de interface, não voz editorial. A página congelada é outra rota.
{
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 1000 } })
  await ctx.route('**/*', (r) =>
    r.request().url().startsWith(BASE) || r.request().url().startsWith('data:')
      ? r.continue()
      : r.abort()
  )
  const p = await ctx.newPage()
  await p.goto(BASE + '/blog', { waitUntil: 'load' })
  await p.evaluate(() => {
    try {
      localStorage.removeItem('ciclo-playbook-popup-dismissed-at')
    } catch {
      /* sem armazenamento, o popup aparece do mesmo jeito */
    }
  })
  await p.reload({ waitUntil: 'load' })

  const dialogo = p.locator('[role="dialog"][aria-label="Playbook gratuito de Social Commerce"]')
  let apareceu = true
  try {
    await dialogo.waitFor({ state: 'visible', timeout: 15000 })
  } catch {
    apareceu = false
  }

  if (!apareceu) {
    console.log('  nota  popup do playbook não apareceu em 15s; nada a conferir nesta rodada')
  } else {
    const fora = await dialogo.evaluate((raiz) => {
      const ruins = []
      for (const el of raiz.querySelectorAll('*')) {
        const temTexto = [...el.childNodes].some(
          (n) => n.nodeType === 3 && n.textContent.trim().length > 0
        )
        if (!temTexto) continue
        const f = getComputedStyle(el).fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '')
        if (!/^inter$/i.test(f)) ruins.push({ familia: f, txt: el.textContent.trim().slice(0, 40) })
      }
      return ruins
    })
    if (fora.length) {
      falhas += fora.length
      console.log(`  FALHA popup do playbook — ${fora.length} elemento(s) fora da Inter`)
      for (const a of fora.slice(0, 4)) console.log('        ' + JSON.stringify(a))
    } else {
      console.log('  ok    popup do playbook sobre /blog, só com Inter')
    }
  }
  await ctx.close()
}

await navegador.close()
console.log(
  falhas
    ? `\n${falhas} FALHA(S)`
    : `\nTUDO OK — ${ROTAS.length} rotas: Inter na estrutura, Playfair em ${editoriais} frases editoriais`
)
process.exit(falhas ? 1 : 0)
