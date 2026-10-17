// Verificação do menu móvel do cabeçalho compartilhado do redesign.
//
// A auditoria de 17/10 reproduziu em 390×844: o menu abria, o botão Fechar
// fechava, mas o Escape não. Este teste cobre o caminho inteiro em todas as
// rotas já redesenhadas, porque o cabeçalho é o mesmo em todas.
//
// SEGURANÇA: só o host local responde; tudo que é externo é interceptado.
// Nenhuma chamada de conversão, CRM ou telemetria sai daqui.
//
// Uso:  node menu-movel.mjs [baseURL]

import { chromium } from 'playwright-core'

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'
const ROTAS = [
  '/',
  '/servicos/meta-ads',
  '/solucoes/captacao-de-demanda',
  '/blog',
  '/blog/meta-creator-marketing-hub',
]

let falhas = 0
const ok = (t) => console.log('  ok    ' + t)
const falha = (t) => {
  console.log('  FALHA ' + t)
  falhas++
}
const conferir = (cond, t) => (cond ? ok(t) : falha(t))

const navegador = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })

for (const rota of ROTAS) {
  console.log('\n== ' + rota + ' (390x844)')
  const ctx = await navegador.newContext({ viewport: { width: 390, height: 844 } })
  await ctx.route('**/*', (r) =>
    r.request().url().startsWith(BASE) || r.request().url().startsWith('data:')
      ? r.continue()
      : r.abort()
  )
  const p = await ctx.newPage()
  await p.goto(BASE + rota, { waitUntil: 'load' })
  await p.waitForSelector('.menu-btn')
  await p.waitForTimeout(1200)

  const botao = p.locator('.menu-btn')
  const menu = p.locator('#mobile-nav')
  const aberto = async () => (await botao.getAttribute('aria-expanded')) === 'true'

  conferir(await botao.isVisible(), 'botão de menu visível no celular')
  conferir(!(await aberto()), 'menu começa fechado')

  // ── 1. Abre e o foco entra no menu ────────────────────────────────────────
  await botao.click()
  await p.waitForTimeout(300)
  conferir(await aberto(), 'clique abre o menu')
  conferir(await menu.isVisible(), 'painel do menu visível')
  conferir(
    await p.evaluate(() => document.querySelector('#mobile-nav')?.contains(document.activeElement)),
    'foco entrou no menu'
  )

  // ── 2. Escape fecha e devolve o foco ──────────────────────────────────────
  await p.keyboard.press('Escape')
  await p.waitForTimeout(300)
  conferir(!(await aberto()), 'Escape fecha o menu')
  conferir(
    await p.evaluate(() => document.activeElement?.classList.contains('menu-btn')),
    'foco voltou para o botão de menu'
  )

  // ── 3. Escape com o foco no próprio botão Fechar — o caso da auditoria ────
  await botao.click()
  await p.waitForTimeout(300)
  await botao.focus()
  await p.keyboard.press('Escape')
  await p.waitForTimeout(300)
  conferir(!(await aberto()), 'Escape com foco no botão Fechar também fecha')

  // ── 4. Tab e Shift+Tab ficam dentro do menu ───────────────────────────────
  await botao.click()
  await p.waitForTimeout(300)
  const dentro = async () =>
    p.evaluate(() => {
      const el = document.activeElement
      return (
        !!document.querySelector('#mobile-nav')?.contains(el) ||
        !!el?.classList.contains('menu-btn')
      )
    })
  let presos = true
  for (let i = 0; i < 9; i++) {
    await p.keyboard.press('Tab')
    await p.waitForTimeout(60)
    if (!(await dentro())) presos = false
  }
  conferir(presos, 'Tab dá a volta sem sair do menu')
  presos = true
  for (let i = 0; i < 9; i++) {
    await p.keyboard.press('Shift+Tab')
    await p.waitForTimeout(60)
    if (!(await dentro())) presos = false
  }
  conferir(presos, 'Shift+Tab dá a volta sem sair do menu')

  // ── 5. Escolher um destino fecha o menu e o destino existe ────────────────
  const destinos = await menu.locator('a').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
  conferir(destinos.length === 6, `menu com 6 destinos (tem ${destinos.length})`)
  conferir(
    destinos.every((h) => h && (h.startsWith('/') || h.startsWith('#'))),
    'todos os destinos são internos: ' + destinos.join(' ')
  )

  await menu.locator('a').first().click()
  await p.waitForTimeout(500)
  conferir(!(await aberto()), 'escolher um destino fecha o menu')

  // ── 6. Âncoras do menu têm alvo na página de destino ──────────────────────
  for (const href of destinos) {
    if (!href.includes('#')) continue
    const [caminho, id] = href.split('#')
    const alvo = await p.evaluate(
      async ([c, i, base]) => {
        const r = await fetch(base + (c || '/'))
        const t = await r.text()
        return r.status === 200 && (t.includes(`id="${i}"`) || t.includes(`id='${i}'`))
      },
      [caminho, id, BASE]
    )
    conferir(alvo, `âncora ${href} tem destino`)
  }

  await ctx.close()
}

await navegador.close()
console.log('\n' + (falhas ? falhas + ' FALHA(S)' : 'TUDO OK'))
process.exit(falhas ? 1 : 0)
