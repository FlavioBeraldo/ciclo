// Confere que o escopo `.ciclo2026` usa apenas Inter.
//
// Ordem do Flávio em 17/10/2026: a hierarquia editorial passa a ser feita com
// peso, tamanho e espaço, não com troca de família. Este teste percorre cada
// elemento com texto das rotas já redesenhadas e reprova qualquer fonte
// computada que não seja Inter.
//
// O /playbook-social-commerce fica de fora de propósito: ele está congelado e
// continua com a tipografia que tem.
//
// Uso:  node so-inter.mjs [baseURL]

import { chromium } from 'playwright-core'

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'
const ROTAS = [
  '/',
  '/servicos/meta-ads',
  '/servicos/analytics-bi',
  '/solucoes/captacao-de-demanda',
  '/solucoes/inteligencia-e-operacao',
  '/blog',
  '/blog/meta-creator-marketing-hub',
  '/blog/full-funnel-marketing-por-que-sua-marca-perde-dinheiro',
  '/tiktok-shop',
  '/depoimentos',
  '/mapa-do-site',
  '/politica-de-privacidade',
]

const navegador = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
let falhas = 0

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

  const achados = await p.evaluate(() => {
    const escopo = document.querySelector('.ciclo2026')
    if (!escopo) return [{ erro: 'sem escopo .ciclo2026 na página' }]
    const fora = []
    const IGNORAR = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'])
    for (const el of escopo.querySelectorAll('*')) {
      if (IGNORAR.has(el.tagName)) continue
      // Só o que realmente pinta texto
      const temTexto = [...el.childNodes].some(
        (n) => n.nodeType === 3 && n.textContent.trim().length > 0
      )
      if (!temTexto) continue
      const s = getComputedStyle(el)
      const familia = s.fontFamily
      // Vale a PRIMEIRA família da pilha: é a que o navegador tenta antes.
      // `sans-serif` no fim da lista é o fallback genérico, não uma serifa.
      const primeira = familia.split(',')[0].trim().replace(/^["']|["']$/g, '')
      if (!/^inter$/i.test(primeira)) {
        fora.push({
          tag: el.tagName.toLowerCase(),
          cls: String(el.className).slice(0, 48),
          familia,
          estilo: s.fontStyle,
          txt: el.textContent.trim().slice(0, 48),
        })
      }
    }
    return fora
  })

  if (achados.length) {
    falhas += achados.length
    console.log(`  FALHA ${rota} — ${achados.length} elemento(s) fora da Inter`)
    for (const a of achados.slice(0, 6)) console.log('        ' + JSON.stringify(a))
  } else {
    console.log(`  ok    ${rota}`)
  }
  await ctx.close()
}

// ── O popup do playbook, que aparece sobre as rotas do blog ────────────────
//
// Ele é montado no layout do blog, FORA do escopo `.ciclo2026`, então não
// entra na varredura acima. Aparece depois de 10 segundos, por isso o teste
// espera. A página /playbook-social-commerce é outra rota, está congelada e
// continua com a Playfair dela — aqui só se olha o popup.
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
        if (!/^inter$/i.test(f)) ruins.push({ familia: f, txt: el.textContent.trim().slice(0, 44) })
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
console.log(falhas ? `\n${falhas} FALHA(S)` : `\nTUDO OK — ${ROTAS.length} rotas e o popup do blog, só com Inter`)
process.exit(falhas ? 1 : 0)
