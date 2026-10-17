import { chromium } from 'playwright-core'
const BASE = process.argv[2]
const ROTAS = process.argv.slice(3)
const nav = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
let ruim = 0
for (const rota of ROTAS) {
  for (const [tag, w] of [['desktop', 1440], ['celular', 390]]) {
    const ctx = await nav.newContext({ viewport: { width: w, height: 900 } })
    const p = await ctx.newPage()
    await p.route('**', (r) => (r.request().url().startsWith(BASE) ? r.continue() : r.fulfill({ status: 204, body: '' })))
    await p.goto(BASE + rota, { waitUntil: 'domcontentloaded' })
    await p.waitForTimeout(1200)
    const m = await p.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      culpados: [...document.querySelectorAll('body *')]
        .filter((e) => e.getBoundingClientRect().right > document.documentElement.clientWidth + 2)
        .slice(0, 3)
        .map((e) => e.tagName + '.' + String(e.className).slice(0, 40)),
      h1: document.querySelectorAll('h1').length,
    }))
    const ok = m.scrollW <= m.clientW + 2 && m.h1 === 1
    if (!ok) ruim++
    console.log(`${ok ? 'ok   ' : 'FALHA'} ${rota} ${tag} ${m.scrollW}/${m.clientW} h1=${m.h1} ${m.culpados.join(' ')}`)
    await ctx.close()
  }
}
await nav.close()
process.exit(ruim ? 1 : 0)
