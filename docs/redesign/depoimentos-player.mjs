// Verificação do player de depoimentos da home.
//
// Confere que o vídeo abre DENTRO do site (iframe em modal), que o cartão
// responde a teclado, que o Escape fecha, que o foco volta para o cartão de
// origem e que nada navega para fora da página.
//
// SEGURANÇA: a rede externa é simulada. Tudo que não é o host local é
// interceptado; o embed do YouTube é respondido por um stub local, então
// nenhuma chamada real sai — nem para o YouTube, nem para GTM, nem para a
// telemetria interna.
//
// Uso:  node depoimentos-player.mjs [baseURL]
import { chromium } from 'playwright-core'

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'
const navegador = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })

let falhas = 0
const ok = (t) => console.log('  ok    ' + t)
const falha = (t) => { console.log('  FALHA ' + t); falhas++ }
const conferir = (cond, t) => (cond ? ok(t) : falha(t))

for (const [rotulo, largura, altura] of [['desktop', 1440, 900], ['celular', 390, 844]]) {
  console.log('\n== ' + rotulo + ' (' + largura + 'x' + altura + ')')
  const ctx = await navegador.newContext({ viewport: { width: largura, height: altura } })

  const externas = []
  await ctx.route('**/*', async (rota) => {
    const url = rota.request().url()
    if (url.startsWith(BASE) || url.startsWith('data:') || url.startsWith('about:')) return rota.continue()
    externas.push(url.split('?')[0])
    // O embed do YouTube responde por stub: o player não sai daqui
    if (/youtube\.com\/embed\//.test(url)) {
      return rota.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>player simulado</title><body style="background:#000">' })
    }
    return rota.abort()
  })

  const p = await ctx.newPage()
  const navegacoes = []
  p.on('framenavigated', (f) => { if (f === p.mainFrame()) navegacoes.push(f.url()) })
  const popups = []
  p.on('popup', (pp) => popups.push(pp.url()))

  await p.goto(BASE + '/', { waitUntil: 'load' })
  const urlInicial = p.url()
  // Espera a hidratação: antes dela o React ainda troca os nós da seção
  await p.waitForSelector('#depoimentos .proof-card')
  await p.waitForTimeout(1500)
  await p.locator('#depoimentos').scrollIntoViewIfNeeded()
  await p.waitForTimeout(300)

  const cartoes = p.locator('#depoimentos .proof-card')
  conferir((await cartoes.count()) === 4, '4 cartões na seção')
  conferir((await p.locator('#depoimentos a[href*="youtube.com"]').count()) === 0, 'nenhum link externo para o YouTube nos cartões')

  // ── 1. Abre por clique ────────────────────────────────────────────────────
  await cartoes.nth(0).click()
  await p.waitForTimeout(400)
  const modal = p.locator('.video-modal-dialog')
  conferir(await modal.isVisible(), 'clique abre o modal')
  conferir((await modal.getAttribute('role')) === 'dialog' && (await modal.getAttribute('aria-modal')) === 'true', 'modal é dialog com aria-modal')
  const src = await p.locator('.video-modal-dialog iframe').getAttribute('src')
  conferir(/^https:\/\/www\.youtube\.com\/embed\/MlDyvGg7rGs\?autoplay=1$/.test(src ?? ''), 'iframe usa o mesmo embed e o mesmo ID: ' + src)
  conferir(await p.evaluate(() => getComputedStyle(document.body).overflow === 'hidden'), 'rolagem do corpo travada')
  conferir(await p.evaluate(() => document.activeElement?.classList.contains('video-modal-close') ?? false), 'foco entrou no botão de fechar')

  // ── 2. Escape fecha e devolve o foco ──────────────────────────────────────
  await p.keyboard.press('Escape')
  await p.waitForTimeout(400)
  conferir((await p.locator('.video-modal-dialog').count()) === 0, 'Escape fecha o modal')
  conferir(await p.evaluate(() => document.activeElement?.classList.contains('proof-card') ?? false), 'foco voltou para o cartão de origem')
  conferir(await p.evaluate(() => getComputedStyle(document.body).overflow !== 'hidden'), 'rolagem do corpo liberada')

  // ── 3. Abre por teclado (Enter no cartão focado) ──────────────────────────
  await cartoes.nth(2).focus()
  await p.keyboard.press('Enter')
  await p.waitForTimeout(400)
  const src2 = await p.locator('.video-modal-dialog iframe').getAttribute('src')
  conferir(/xVdqhprwKWw/.test(src2 ?? ''), 'Enter no cartão abre o vídeo certo')

  // ── 4. Tab fica preso dentro do modal ─────────────────────────────────────
  await p.keyboard.press('Tab')
  await p.waitForTimeout(150)
  conferir(
    await p.evaluate(() => !!document.querySelector('.video-modal-dialog')?.contains(document.activeElement)),
    'Tab permanece dentro do modal'
  )

  // ── 5. Clique no fundo fecha ──────────────────────────────────────────────
  await p.locator('.video-modal').click({ position: { x: 5, y: 5 } })
  await p.waitForTimeout(400)
  conferir((await p.locator('.video-modal-dialog').count()) === 0, 'clique fora fecha o modal')

  // ── 6. Botão de fechar ────────────────────────────────────────────────────
  await cartoes.nth(1).click()
  await p.waitForTimeout(300)
  await p.locator('.video-modal-close').click()
  await p.waitForTimeout(400)
  conferir((await p.locator('.video-modal-dialog').count()) === 0, 'botão fechar funciona')

  // ── 7. Nada navegou para fora ─────────────────────────────────────────────
  conferir(p.url() === urlInicial, 'a página não navegou (' + p.url() + ')')
  const foraDaHome = navegacoes.filter((u) => u !== urlInicial)
  conferir(foraDaHome.length === 0, 'o documento principal nunca saiu da home' + (foraDaHome.length ? ': ' + foraDaHome.join(', ') : ''))
  conferir(popups.length === 0, 'nenhuma aba nova aberta')

  const naoEmbed = externas.filter((u) => !/youtube\.com\/embed\//.test(u))
  console.log('  externas interceptadas: ' + JSON.stringify([...new Set(externas)]))
  conferir(!naoEmbed.some((u) => /\/watch/.test(u)), 'nenhuma chamada a youtube.com/watch')

  await ctx.close()
}

await navegador.close()
console.log('\n' + (falhas ? falhas + ' FALHA(S)' : 'TUDO OK'))
process.exit(falhas ? 1 : 0)
