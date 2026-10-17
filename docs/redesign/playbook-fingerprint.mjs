// Impressão digital do /playbook-social-commerce: fontes realmente carregadas,
// estados da página e estilo computado, em desktop e celular.
//
// Hash de arquivo não cobre efeito de CSS global, por isso a comparação é feita
// sobre o que o navegador computa de fato.
//
// SEGURANÇA: toda saída que não seja o host local é bloqueada. Nenhuma chamada
// de conversão, CRM ou telemetria sai daqui. O estado de erro usa só validação
// do cliente, que não dispara rede.
//
// Uso:  node playbook-fingerprint.mjs antes|depois  [baseURL]
import { chromium } from 'playwright-core'
import { writeFileSync } from 'node:fs'

const TAG = process.argv[2] ?? 'antes'
const BASE = process.argv[3] ?? process.env.BASE ?? 'http://127.0.0.1:3100'
const ROTA = '/playbook-social-commerce'

const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }, false],
  ['celular', { width: 390, height: 844 }, true],
]

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const saida = { tag: TAG, base: BASE, rota: ROTA, capturadoEm: new Date().toISOString(), bloqueadas: [], viewports: {} }

for (const [nome, vp, mobile] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: vp, isMobile: mobile, hasTouch: mobile })

  // Nada sai para fora do host local
  await page.route('**', (route) => {
    const url = route.request().url()
    if (url.startsWith(BASE)) return route.continue()
    saida.bloqueadas.push(url.split('?')[0])
    return route.abort()
  })

  await page.goto(BASE + ROTA, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(600)

  const comum = await page.evaluate(() => {
    const cs = (sel, props) => {
      const el = document.querySelector(sel)
      if (!el) return null
      const s = getComputedStyle(el)
      return Object.fromEntries(props.map((p) => [p, s[p]]))
    }
    return {
      // Fontes que o navegador REALMENTE carregou, não as declaradas
      fontesCarregadas: [...document.fonts]
        .filter((f) => f.status === 'loaded')
        .map((f) => `${f.family} ${f.style} ${f.weight}`)
        .sort(),
      // Herança do CSS global: é aqui que um redesign vaza
      html: cs('html', ['scrollBehavior']),
      body: cs('body', ['backgroundColor', 'color', 'fontFamily']),
      raiz: cs('.lp-playbook', ['backgroundColor', 'color', 'fontFamily']),
      h1: cs('h1', ['fontFamily', 'fontSize', 'fontWeight', 'color', 'lineHeight']),
      serif: cs('.font-serif-lp', ['fontFamily', 'fontStyle', 'fontWeight']),
      submit: cs('button[type="submit"]', ['backgroundColor', 'color', 'borderRadius', 'fontSize', 'padding']),
      telefone: cs('.ciclo-phone-input', ['backgroundColor', 'borderColor', 'borderRadius', 'padding']),
      // Estrutura: pega remoção ou reordenação acidental
      titulos: [...document.querySelectorAll('h1,h2,h3')].map((h) => `${h.tagName}|${h.textContent.trim().slice(0, 70)}`),
      campos: [...document.querySelectorAll('input,select,textarea')].map((i) => `${i.tagName}|${i.getAttribute('name') ?? i.id ?? ''}|${i.type ?? ''}`),
      botoes: [...document.querySelectorAll('button')].map((b) => b.textContent.trim().slice(0, 40)).filter(Boolean),
      links: [...document.querySelectorAll('a')].map((a) => a.getAttribute('href')),
      imagens: [...document.querySelectorAll('img')].map((i) => `${(i.getAttribute('src') ?? '').split('/').pop().split('?')[0]}|${i.naturalWidth}x${i.naturalHeight}`),
      metaRobots: document.querySelector('meta[name="robots"]')?.content ?? null,
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
      jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent)['@type']),
      alturaDoc: document.body.scrollHeight,
      larguraDoc: document.documentElement.scrollWidth,
      larguraJanela: window.innerWidth,
    }
  })

  const estados = {}

  // 1. inicial, no topo
  await page.screenshot({ path: `playbook-${TAG}-${nome}-1-inicial.png`, fullPage: true })
  estados.inicial = { ok: true }

  // 2. rolado: o CTA fixo aparece
  await page.evaluate(() => window.scrollTo(0, 1600))
  await page.waitForTimeout(900)
  estados.rolado = await page.evaluate(() => {
    const sticky = document.querySelector('[class*="fixed"][class*="bottom"], [class*="sticky"]')
    return {
      ctaFixoVisivel: sticky ? getComputedStyle(sticky).visibility !== 'hidden' && getComputedStyle(sticky).opacity !== '0' : null,
      scrollY: Math.round(window.scrollY),
    }
  })
  await page.screenshot({ path: `playbook-${TAG}-${nome}-2-rolado.png` })

  // 3. erro de validação: só cliente, nenhuma rede
  const submit = page.locator('button[type="submit"]').first()
  if (await submit.count()) {
    await submit.scrollIntoViewIfNeeded()
    await submit.click()
    await page.waitForTimeout(700)
    estados.erroDeValidacao = await page.evaluate(() => {
      const msgs = [...document.querySelectorAll('p,span')]
        .map((e) => e.textContent.trim())
        .filter((t) => /obrigat|inválid|aceite|mínimo|dígitos|caracteres/i.test(t) && t.length < 90)
      return { mensagens: [...new Set(msgs)].sort() }
    })
    await page.screenshot({ path: `playbook-${TAG}-${nome}-3-erro.png` })
  }

  saida.viewports[nome] = { viewport: vp, isMobile: mobile, ...comum, estados }
  await page.close()
}

saida.bloqueadas = [...new Set(saida.bloqueadas)].sort()
writeFileSync(`playbook-${TAG}.json`, JSON.stringify(saida, null, 1))

console.log(`playbook-${TAG}.json gravado`)
for (const [n, v] of Object.entries(saida.viewports)) {
  console.log(`${n.padEnd(8)} altura ${v.alturaDoc} | overflow ${v.larguraDoc > v.larguraJanela ? 'SIM' : 'não'} | títulos ${v.titulos.length} | campos ${v.campos.length} | fontes ${v.fontesCarregadas.length}`)
  console.log(`         fontes: ${v.fontesCarregadas.join(', ')}`)
  console.log(`         body: ${JSON.stringify(v.body)}`)
  console.log(`         raiz: ${JSON.stringify(v.raiz)}`)
  console.log(`         erros de validação: ${v.estados.erroDeValidacao?.mensagens.length ?? 0}`)
}
console.log('saídas externas bloqueadas:', saida.bloqueadas.length ? saida.bloqueadas.join(', ') : 'nenhuma tentativa')
await browser.close()
