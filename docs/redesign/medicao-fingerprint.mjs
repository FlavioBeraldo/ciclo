// Baseline de mensuração dos quatro formulários.
//
// Percorre cada formulário com a API INTERCEPTADA e registra, por formulário:
// os nomes de evento publicados no dataLayer, as chaves de cada evento e as
// chaves do payload enviado ao servidor. É o que se compara campo a campo
// depois do redesign.
//
// SEGURANÇA: nenhuma chamada sai do host local. As rotas /api/* são respondidas
// por mock, então Pipedrive, Meta CAPI, GA4, GTM e a telemetria interna nunca
// recebem nada. Nenhum lead de teste é criado.
//
// Uso:  node medicao-fingerprint.mjs antes|depois  [baseURL]
import { chromium } from 'playwright-core'
import { writeFileSync } from 'node:fs'

const TAG = process.argv[2] ?? 'antes'
const BASE = process.argv[3] ?? process.env.BASE ?? 'http://127.0.0.1:3100'

const DADOS = {
  nome: 'QA Teste Interno',
  email: 'qa.redesign@exemplo-teste.invalid',
  telefone: '+5511900000000',
  empresa: 'Loja Exemplo Teste',
  site: 'exemplo-teste.invalid',
  texto: 'Texto de teste com mais de vinte caracteres para passar na validação do campo.',
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const saida = { tag: TAG, base: BASE, capturadoEm: new Date().toISOString(), formularios: {}, externasBloqueadas: [] }

async function novaPagina(rota) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  const posts = []

  // Primeiro: corta tudo que não é local
  await page.route('**', (route) => {
    const url = route.request().url()
    if (url.startsWith(BASE)) return route.continue()
    saida.externasBloqueadas.push(url.split('?')[0])
    return route.abort()
  })
  // Depois: intercepta as rotas de API (handler mais recente tem prioridade)
  await page.route('**/api/**', async (route) => {
    const req = route.request()
    if (req.method() === 'POST') {
      let body = {}
      try { body = JSON.parse(req.postData() ?? '{}') } catch { body = { naoJson: true } }
      posts.push({ rota: new URL(req.url()).pathname, chaves: Object.keys(body).sort(), amostra: resumir(body) })
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, event_id: 'mock-event-id' }) })
  })

  await page.addInitScript(() => {
    window.dataLayer = window.dataLayer || []
    window.__eventos = []
    const original = window.dataLayer.push.bind(window.dataLayer)
    window.dataLayer.push = (obj) => { window.__eventos.push(obj); return original(obj) }
  })

  await page.goto(BASE + rota, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(700)
  return { page, posts }
}

function resumir(obj) {
  // Guarda a FORMA do payload, nunca valores pessoais
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) out[k] = 'nulo'
    else if (typeof v === 'object') out[k] = Array.isArray(v) ? `array[${v.length}]` : `objeto{${Object.keys(v).sort().join(',')}}`
    else out[k] = typeof v
  }
  return out
}

async function colherEventos(page) {
  const brutos = await page.evaluate(() => window.__eventos.map((e) => {
    const { eventCallback, eventTimeout, ...resto } = e
    return resto
  }))
  return brutos
    .filter((e) => e.event && e.event !== 'gtm.js' && !String(e.event).startsWith('gtm.'))
    .map((e) => ({ evento: e.event, chaves: Object.keys(e).filter((k) => k !== 'event').sort() }))
}

// ── 1. LeadForm, na home ────────────────────────────────────────────────────
{
  const { page, posts } = await novaPagina('/#contato')
  await page.locator('#contato').scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  await page.fill('input[name="name"]', DADOS.nome)
  await page.fill('input[name="email"]', DADOS.email)
  await page.fill('input[name="company"]', DADOS.empresa)
  await page.locator('.PhoneInputInput, input[type="tel"]').first().fill(DADOS.telefone)
  await page.selectOption('select[name="annualRevenue"]', { index: 1 })
  await page.selectOption('select[name="segment"]', { index: 1 })
  await page.fill('textarea[name="message"]', DADOS.texto)
  await page.check('input[type="checkbox"]')
  await page.locator('button[type="submit"]').first().click()
  await page.waitForTimeout(2500)
  saida.formularios.leadForm = { rota: '/#contato', eventos: await colherEventos(page), posts }
  await page.close()
}

// ── 2. PlaybookForm (NÃO entra no redesign, mas o baseline vale) ────────────
{
  const { page, posts } = await novaPagina('/playbook-social-commerce')
  await page.locator('button[type="submit"]').first().scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  await page.fill('input[name="name"]', DADOS.nome)
  await page.fill('input[name="email"]', DADOS.email)
  await page.fill('input[name="company"]', DADOS.empresa)
  await page.locator('.PhoneInputInput, input[type="tel"]').first().fill(DADOS.telefone)
  const check = page.locator('input[type="checkbox"]')
  if (await check.count()) await check.first().check()
  await page.locator('button[type="submit"]').first().click()
  await page.waitForTimeout(2500)
  saida.formularios.playbookForm = { rota: '/playbook-social-commerce', eventos: await colherEventos(page), posts }
  await page.close()
}

// ── 3. LinkBioForm: 5 etapas, envio por etapa ───────────────────────────────
{
  const { page, posts } = await novaPagina('/link-bio')
  const passo = async (valor, tipo) => {
    if (tipo === 'escolha') await page.getByRole('button', { name: valor }).click()
    else if (tipo === 'telefone') {
      await page.locator('.PhoneInputInput, input[type="tel"]').first().fill(valor)
      await page.getByRole('button', { name: /Continuar/ }).click()
    } else {
      await page.locator('input:visible').first().fill(valor)
      await page.getByRole('button', { name: /Continuar/ }).click()
    }
    await page.waitForTimeout(500)
  }
  await passo(DADOS.email, 'texto')
  await passo(DADOS.telefone, 'telefone')
  await passo(DADOS.empresa, 'texto')
  await passo('Head de Marketing', 'texto')
  await page.getByRole('button', { name: 'R$ 10 a R$ 30 milhões/ano' }).click()
  await page.waitForTimeout(2500)
  saida.formularios.linkBioForm = { rota: '/link-bio', eventos: await colherEventos(page), posts }
  await page.close()
}

// ── 4. AplicacaoForm: 8 etapas, envio único no fim ──────────────────────────
{
  const { page, posts } = await novaPagina('/aplicacao')
  const avancar = async (valor, tipo) => {
    if (tipo === 'escolha') await page.getByRole('button', { name: valor }).click()
    else if (tipo === 'telefone') await page.locator('.PhoneInputInput, input[type="tel"]').first().fill(valor)
    else await page.locator('input:visible, textarea:visible').first().fill(valor)
    if (tipo !== 'escolha') await page.getByRole('button', { name: /Continuar|Enviar minha/ }).click()
    await page.waitForTimeout(400)
  }
  await avancar(DADOS.empresa, 'texto')
  await avancar(DADOS.site, 'texto')
  await avancar('Dono, sócio ou fundador', 'escolha')
  await avancar('R$ 10 a R$ 30 milhões/ano', 'escolha')
  await avancar(DADOS.texto, 'texto')
  await avancar(DADOS.nome, 'texto')
  await avancar(DADOS.email, 'texto')
  await page.locator('.PhoneInputInput, input[type="tel"]').first().fill(DADOS.telefone)
  await page.locator('input[type="checkbox"]').check()
  await page.getByRole('button', { name: /Enviar minha/ }).click()
  await page.waitForTimeout(2500)
  saida.formularios.aplicacaoForm = { rota: '/aplicacao', eventos: await colherEventos(page), posts }
  await page.close()
}

saida.externasBloqueadas = [...new Set(saida.externasBloqueadas)].sort()
writeFileSync(`medicao-${TAG}.json`, JSON.stringify(saida, null, 1))

console.log(`medicao-${TAG}.json gravado\n`)
for (const [nome, f] of Object.entries(saida.formularios)) {
  console.log(`${nome} (${f.rota})`)
  console.log(`  eventos: ${f.eventos.map((e) => e.evento).join(', ') || 'NENHUM'}`)
  for (const p of f.posts) console.log(`  POST ${p.rota} -> ${p.chaves.join(', ')}`)
  console.log()
}
console.log('externas bloqueadas:', saida.externasBloqueadas.join(', ') || 'nenhuma tentativa')
await browser.close()
