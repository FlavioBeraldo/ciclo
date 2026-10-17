// Os dois formulários em etapas: /aplicacao e /link-bio.
//
// Estas são as duas páginas em que o redesign mais poderia quebrar algo sem
// aparecer na tela: elas medem CADA etapa, somam uma conversão no fim e
// dependem de idempotência para não contar o mesmo lead duas vezes. Este
// teste percorre as duas do começo ao fim e confere evento por evento.
//
// SEGURANÇA: nada sai para a rede. O navegador só fala com o host local, e
// /api/aplicacao, /api/link-bio e /api/track são respondidos por mock aqui
// dentro. Nenhum lead é criado em lugar nenhum.
//
// Uso:  node formularios-etapas.mjs [baseURL]

import { chromium } from 'playwright-core'

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'

let falhas = 0
const ok = (t) => console.log('  ok    ' + t)
const falha = (t) => {
  console.log('  FALHA ' + t)
  falhas++
}
const conferir = (c, t) => (c ? ok(t) : falha(t))

const navegador = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })

/** Página isolada: só o host local responde, e as rotas de API são mock. */
async function abrir(rota, respostaAplicacao = { event_id: 'srv-teste-1', duplicate: false }) {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 1000 } })
  const p = await ctx.newPage()
  const posts = []

  await p.addInitScript(() => {
    window.dataLayer = window.dataLayer || []
  })

  await p.route('**', async (rota2) => {
    const req = rota2.request()
    const url = req.url()
    if (!url.startsWith(BASE)) return rota2.fulfill({ status: 204, body: '' })

    const caminho = new URL(url).pathname
    if (caminho.startsWith('/api/')) {
      if (req.method() === 'POST') {
        let corpo = {}
        try {
          corpo = JSON.parse(req.postData() ?? '{}')
        } catch {}
        posts.push({ caminho, corpo })
      }
      const resposta = caminho === '/api/aplicacao' ? respostaAplicacao : { ok: true }
      return rota2.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(resposta),
      })
    }
    return rota2.continue()
  })

  await p.goto(BASE + rota, { waitUntil: 'domcontentloaded' })
  // espera a hidratação, quando a página tem formulário
  if (await p.locator('.application-card').count()) {
    await p.locator('.application-card').first().waitFor({ state: 'visible' })
  }
  await p.waitForTimeout(1200)
  return { ctx, p, posts }
}

const eventos = (p) => p.evaluate(() => (window.dataLayer || []).filter((e) => e && e.event))

// Preenche o campo visível da etapa. Repete se o valor não "pegar": a página
// ainda pode estar hidratando, e um fill antes disso é descartado pelo React.
async function escrever(p, texto) {
  const campo = p.locator('.application-card input:visible, .application-card textarea:visible').first()
  for (let tentativa = 0; tentativa < 10; tentativa++) {
    await campo.fill(texto)
    await p.waitForTimeout(150)
    if ((await campo.inputValue()) === texto) return
  }
  throw new Error(`não consegui preencher o campo com "${texto}"`)
}

// O campo de telefone tem máscara: digitar é o único jeito de ele aceitar.
async function telefone(p, numero) {
  const campo = p.locator('.application-card input[type="tel"]').first()
  for (let tentativa = 0; tentativa < 10; tentativa++) {
    await campo.click()
    await campo.press('Control+a')
    await campo.press('Delete')
    // O número vai COM o código do país: o campo é internacional, e a
    // validação da etapa exige 12 dígitos ou mais.
    await campo.pressSequentially(numero, { delay: 25 })
    await p.waitForTimeout(250)
    if ((await campo.inputValue()).replace(/\D/g, '').length >= 12) return
  }
  throw new Error(`não consegui preencher o telefone (ficou "${await campo.inputValue()}")`)
}

async function continuar(p) {
  const botao = p.locator('.application-card button.next')
  await botao.waitFor({ state: 'visible' })
  await p.waitForFunction(
    () => !document.querySelector('.application-card button.next')?.disabled,
    undefined,
    { timeout: 10000 }
  )
  await botao.click()
  await p.waitForTimeout(400)
}

async function escolher(p, indice = 0) {
  await p.locator('.application-card .application-options button').nth(indice).click()
  await p.waitForTimeout(350)
}

// ─── /aplicacao ─────────────────────────────────────────────────────────────

console.log('\n/aplicacao — 8 etapas, conversão e idempotência')

async function percorrerAplicacao(resposta) {
  const { ctx, p, posts } = await abrir('/aplicacao', resposta)

  await escrever(p, 'Loja de Teste')      // 01 empresa
  await continuar(p)
  await escrever(p, 'lojadeteste.com.br') // 02 site
  await continuar(p)
  await escolher(p, 0)                    // 03 cargo (choice)
  await escolher(p, 0)                    // 04 faturamento (choice)
  await escrever(p, 'Este é um desafio de teste com mais de vinte caracteres.') // 05 desafio
  await continuar(p)
  await escrever(p, 'Pessoa de Teste')    // 06 nome
  await continuar(p)
  await escrever(p, 'teste@exemplo.test') // 07 email
  await continuar(p)

  await telefone(p, '+5511999998888')  // 08 whatsapp

  // Último passo: precisa do aceite da política antes de enviar
  const consentimento = p.locator('.application-consent input[type="checkbox"]')
  if (await consentimento.count()) await consentimento.check()
  await continuar(p)
  await p.waitForTimeout(800)

  return { ctx, p, posts }
}

{
  const { ctx, p, posts } = await percorrerAplicacao({
    event_id: 'srv-teste-1',
    duplicate: false,
  })

  const todos = await eventos(p)
  const views = todos.filter((e) => e.event === 'aplicacao_step_view')
  const completes = todos.filter((e) => e.event === 'aplicacao_step_complete')
  const conversao = todos.filter((e) => e.event === 'consultoria_ecom_shift_lead')

  conferir(views.length === 8, `8 aplicacao_step_view (vieram ${views.length})`)
  conferir(completes.length === 7, `7 aplicacao_step_complete (vieram ${completes.length})`)
  conferir(
    views.every((e) => e.form === 'consultoria_ecom_shift' && typeof e.step === 'string' && typeof e.step_number === 'number'),
    'cada step_view traz step, step_number e form'
  )
  conferir(
    views.map((e) => e.step).join(',') ===
      'empresa,site,cargo,faturamento,desafio,nome,email,whatsapp',
    `ordem das etapas preservada: ${views.map((e) => e.step).join(',')}`
  )

  const envio = posts.filter((x) => x.caminho === '/api/aplicacao')
  conferir(envio.length === 1, `1 POST para /api/aplicacao (vieram ${envio.length})`)
  if (envio.length) {
    const chaves = Object.keys(envio[0].corpo).sort()
    const esperadas = [
      'attribution', 'cargo', 'desafio', 'email', 'empresa',
      'event_id', 'faturamento', 'nome', 'page_url', 'site', 'whatsapp',
    ]
    conferir(
      JSON.stringify(chaves) === JSON.stringify(esperadas),
      `payload com as 11 chaves de sempre: ${chaves.join(', ')}`
    )
  }

  conferir(conversao.length === 1, `1 consultoria_ecom_shift_lead (vieram ${conversao.length})`)
  conferir(
    conversao[0]?.event_id === 'srv-teste-1',
    `a conversão usa o event_id canônico do servidor: ${conversao[0]?.event_id}`
  )
  conferir(
    await p.locator('text=Recebemos a sua aplicação.').count() === 1,
    'tela de sucesso exibida'
  )
  await ctx.close()
}

// Reenvio: o servidor diz que já conhece este lead
{
  const { ctx, p } = await percorrerAplicacao({ event_id: 'srv-teste-1', duplicate: true })
  const todos = await eventos(p)
  const conversao = todos.filter((e) => e.event === 'consultoria_ecom_shift_lead')

  conferir(
    conversao.length === 0,
    `IDEMPOTÊNCIA: com duplicate:true nenhuma conversão é contada (vieram ${conversao.length})`
  )
  conferir(
    await p.locator('text=Recebemos a sua aplicação.').count() === 1,
    'mesmo no reenvio, a pessoa vê a tela de sucesso'
  )
  await ctx.close()
}

// ─── /link-bio ──────────────────────────────────────────────────────────────

console.log('\n/link-bio — 5 etapas, um POST por etapa e generate_lead no fim')

{
  const { ctx, p, posts } = await abrir('/link-bio')

  await escrever(p, 'teste@exemplo.test') // 01 email
  await continuar(p)

  await telefone(p, '+5511999998888')        // 02 whatsapp
  await continuar(p)

  await escrever(p, 'Loja de Teste')      // 03 empresa
  await continuar(p)
  await escrever(p, 'Head de Marketing')  // 04 cargo
  await continuar(p)
  await escolher(p, 0)                    // 05 faturamento (choice)
  await p.waitForTimeout(900)

  const todos = await eventos(p)
  const views = todos.filter((e) => e.event === 'link_bio_step_view')
  const completes = todos.filter((e) => e.event === 'link_bio_step_complete')
  const lead = todos.filter((e) => e.event === 'generate_lead')

  conferir(views.length === 5, `5 link_bio_step_view (vieram ${views.length})`)
  conferir(completes.length === 5, `5 link_bio_step_complete (vieram ${completes.length})`)
  conferir(
    views.map((e) => e.step).join(',') === 'email,whatsapp,empresa,cargo,faturamento',
    `ordem das etapas preservada: ${views.map((e) => e.step).join(',')}`
  )

  const envios = posts.filter((x) => x.caminho === '/api/link-bio')
  conferir(envios.length === 5, `5 POST para /api/link-bio, um por etapa (vieram ${envios.length})`)
  if (envios.length === 5) {
    conferir(
      envios.slice(0, 4).every((e) => e.corpo.complete === false) && envios[4].corpo.complete === true,
      'só o último POST vem com complete: true'
    )
    const ids = new Set(envios.map((e) => e.corpo.event_id))
    conferir(ids.size === 1, `o mesmo event_id nas 5 etapas (achei ${ids.size})`)
  }

  conferir(lead.length === 1, `1 generate_lead no fim (vieram ${lead.length})`)
  conferir(lead[0]?.form === 'link-bio', `generate_lead com form = ${lead[0]?.form}`)
  conferir(
    lead[0]?.event_id === envios[4]?.corpo.event_id,
    'a conversão usa o mesmo event_id das etapas'
  )
  conferir(
    await p.locator('text=Recebemos sua aplicação.').count() === 1,
    'tela de sucesso exibida'
  )
  await ctx.close()
}

// ─── /obrigado ──────────────────────────────────────────────────────────────

console.log('\n/obrigado — não pode disparar conversão nenhuma')

{
  const { ctx, p } = await abrir('/obrigado')
  await p.waitForTimeout(1200)
  const todos = await eventos(p)
  const conversoes = todos.filter((e) =>
    ['generate_lead', 'consultoria_ecom_shift_lead', 'begin_checkout', 'purchase'].includes(e.event)
  )
  conferir(
    conversoes.length === 0,
    `nenhuma conversão ao carregar /obrigado (vieram ${conversoes.map((e) => e.event).join(', ') || 'nenhuma'})`
  )
  await ctx.close()
}

await navegador.close()
console.log(
  '\n' +
    (falhas
      ? `${falhas} FALHA(S)`
      : 'TUDO OK — etapas, conversão, idempotência e /obrigado sem contagem dupla')
)
process.exit(falhas ? 1 : 0)
