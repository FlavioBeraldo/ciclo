// Baseline do /playbook-social-commerce: screenshots + impressão digital de
// estilo computado. Serve de referência para provar, depois do redesign, que a
// página não mudou. Rodar antes e depois e comparar os dois JSON.
import { chromium } from 'playwright-core'
import { writeFileSync } from 'node:fs'

const B = process.env.BASE ?? 'http://127.0.0.1:3100'
const TAG = process.argv[2] ?? 'antes'

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const out = { tag: TAG, base: B, capturadoEm: new Date().toISOString(), viewports: {} }

for (const [key, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport: vp, isMobile: key === 'mobile', hasTouch: key === 'mobile' })
  await page.goto(B + '/playbook-social-commerce', { waitUntil: 'networkidle' })
  const total = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < total; y += 600) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(60) }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(700)

  const fp = await page.evaluate(() => {
    const cs = (sel, props) => {
      const el = document.querySelector(sel)
      if (!el) return null
      const s = getComputedStyle(el)
      return Object.fromEntries(props.map((p) => [p, s[p]]))
    }
    const texto = (sel) => document.querySelector(sel)?.textContent.trim().slice(0, 90) ?? null
    return {
      altura: document.body.scrollHeight,
      larguraDoc: document.documentElement.scrollWidth,
      body: cs('body', ['backgroundColor', 'color', 'fontFamily']),
      raiz: cs('.lp-playbook', ['backgroundColor', 'color', 'minHeight']),
      h1: { estilo: cs('h1', ['fontFamily', 'fontSize', 'fontWeight', 'color']), texto: texto('h1') },
      serif: cs('.font-serif-lp', ['fontFamily', 'fontStyle']),
      botaoPrincipal: cs('button[type="submit"]', ['backgroundColor', 'color', 'borderRadius', 'fontSize']),
      campoTelefone: cs('.ciclo-phone-input', ['backgroundColor', 'borderColor', 'borderRadius']),
      // tudo que a página renderiza, para pegar remoção acidental
      titulos: [...document.querySelectorAll('h1,h2,h3')].map((h) => h.tagName + '|' + h.textContent.trim().slice(0, 60)),
      campos: [...document.querySelectorAll('input,select,textarea')].map((i) => `${i.tagName}|${i.getAttribute('name') ?? i.id ?? ''}|${i.type ?? ''}`),
      botoes: [...document.querySelectorAll('button,a[class*="bg-"]')].map((b) => b.textContent.trim().slice(0, 40)).filter(Boolean),
      links: [...document.querySelectorAll('a')].map((a) => a.getAttribute('href')),
      imagens: [...document.querySelectorAll('img')].map((i) => `${(i.getAttribute('src') ?? '').split('/').pop()}|${i.naturalWidth}x${i.naturalHeight}`),
      metaRobots: document.querySelector('meta[name="robots"]')?.content ?? null,
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
      jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent)['@type']),
    }
  })
  out.viewports[key] = fp
  await page.screenshot({ path: `playbook-${TAG}-${key}.png`, fullPage: true })
  await page.close()
}

writeFileSync(`playbook-${TAG}.json`, JSON.stringify(out, null, 1))
console.log(`playbook-${TAG}.json gravado`)
console.log('desktop  altura:', out.viewports.desktop.altura, '| títulos:', out.viewports.desktop.titulos.length, '| campos:', out.viewports.desktop.campos.length)
console.log('mobile   altura:', out.viewports.mobile.altura)
console.log('body:', JSON.stringify(out.viewports.desktop.body))
console.log('raiz:', JSON.stringify(out.viewports.desktop.raiz))
await browser.close()
