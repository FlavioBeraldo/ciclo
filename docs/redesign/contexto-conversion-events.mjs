// O registro em `conversion_events` precisa amarrar o envio ao negócio.
//
// Três rotas mandam `Lead` para a Meta. Até agora só `/api/pipedrive`
// passava `context`, e por isso só os envios dela apareciam numa consulta
// por `deal_id` ou por `person_id`. Os de `/api/link-bio` e `/api/aplicacao`
// iam para o banco com os três campos NULL — o envio acontecia, mas ficava
// invisível para auditoria. Foi exatamente o que escondeu os negócios 3649 e
// 3650.
//
// Este teste chama as rotas de verdade, com o `fetch` global trocado por
// mock, e confere DUAS coisas:
//
//   1. que `deal_id`, `person_id` e `uid` chegam ao log com os ids reais;
//   2. que NADA MAIS mudou — nome do evento, `event_id`, `action_source` e
//      `custom_data` continuam idênticos. A correção é de rastreabilidade,
//      não de mensuração.
//
// SEGURANÇA: nenhuma chamada sai. Nenhum lead é criado em lugar nenhum. Os
// ids são fabricados aqui e os e-mails usam `@exemplo.test`, domínio
// reservado.
//
// Uso:  node --experimental-strip-types --import ./resolve-ts.mjs contexto-conversion-events.mjs

const RAIZ = process.env.RAIZ_CICLO ?? '/home/user/ciclo'

let falhas = 0
const ok = (t) => console.log('  ok    ' + t)
const falha = (t) => {
  console.log('  FALHA ' + t)
  falhas++
}
const conferir = (c, t) => (c ? ok(t) : falha(t))

// ── Ambiente de mentira ─────────────────────────────────────────────────────
process.env.PIPEDRIVE_API_TOKEN = 'token-de-teste-nao-real'
process.env.SUPABASE_URL = 'https://supabase.exemplo.test'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'chave-de-teste-nao-real'
process.env.META_PIXEL_ID = '000000000000000'
process.env.META_CAPI_TOKEN = 'token-meta-de-teste'
process.env.LINK_BIO_SECRET = 'segredo-de-teste-nao-real'
process.env.APLICACAO_SECRET = 'segredo-de-teste-nao-real'
process.env.SESSION_SECRET = 'segredo-de-teste-nao-real'

const DEAL = 9001
const PERSON = 9002
const ORG = 9003

const json = (corpo, status = 200) =>
  new Response(JSON.stringify(corpo), { status, headers: { 'content-type': 'application/json' } })

/** Instala o fetch de mentira e devolve o registro das gravações. */
function mundo() {
  const registros = []
  const metaEnvios = []

  globalThis.fetch = async (url, init = {}) => {
    const u = String(url)
    const metodo = init.method ?? 'GET'
    let corpo = null
    try {
      corpo = init.body ? JSON.parse(init.body) : null
    } catch {}

    // ── Supabase ──
    if (u.includes('supabase.exemplo.test')) {
      if (u.includes('/conversion_events') && metodo === 'POST') registros.push(corpo)
      if (u.includes('select=id')) return json([])
      return json([])
    }

    // ── Meta ──
    if (u.includes('facebook.com')) {
      metaEnvios.push(corpo)
      return json({ events_received: 1, fbtrace_id: 'teste' })
    }

    // ── Pipedrive ──
    if (u.includes('/persons/search')) return json({ success: true, data: { items: [] } })
    if (u.includes('/organizations/search')) return json({ success: true, data: { items: [] } })
    if (u.includes('/v1/persons')) return json({ success: true, data: { id: PERSON } })
    if (u.includes('/v1/organizations')) return json({ success: true, data: { id: ORG } })
    if (u.includes('/v1/users')) return json({ success: true, data: [{ id: 1, name: 'Felipe' }] })
    if (u.includes('/v1/pipelines')) {
      return json({ success: true, data: [{ id: 2, name: '1 - Site/Whats (Passivo)' }] })
    }
    if (u.includes('/v1/stages')) {
      return json({ success: true, data: [{ id: 8, name: 'Entrada', pipeline_id: 2, order_nr: 1 }] })
    }
    if (u.includes('/v1/deals')) return json({ success: true, data: { id: DEAL } })
    if (u.includes('/v1/itemSearch') || u.includes('/v1/notes')) return json({ success: true, data: [] })

    // ── Claude, usado pelo enriquecimento ──
    if (u.includes('anthropic.com')) return json({ content: [{ text: '{}' }] })

    return json({ success: true, data: {} })
  }

  return { registros, metaEnvios }
}

mundo()
const { NextRequest } = await import('next/server')
const { POST: aplicacaoPost } = await import(`${RAIZ}/src/app/api/aplicacao/route.ts`)
const { POST: linkBioPost } = await import(`${RAIZ}/src/app/api/link-bio/route.ts`)

const metaDoLog = (registros) => registros.filter((r) => r?.platform === 'meta')

// ── /api/aplicacao ──────────────────────────────────────────────────────────

console.log('\n/api/aplicacao')
{
  const { registros, metaEnvios } = mundo()
  const corpo = {
    empresa: 'Loja de Teste',
    site: 'lojadeteste.exemplo.test',
    cargo: 'Head de Marketing',
    faturamento: 'R$ 5 a R$ 10 milhões/ano',
    desafio: 'Este é um desafio de teste com mais de vinte caracteres.',
    nome: 'Pessoa De Teste',
    email: 'contato@exemplo.test',
    whatsapp: '+5511999990000',
    attribution: { source: 'qa', medium: 'teste', campaign: 'qa-contexto' },
    event_id: 'evt-aplicacao-teste',
    page_url: 'https://cicloecommerce.com.br/aplicacao',
  }
  const req = new NextRequest('https://cicloecommerce.com.br/api/aplicacao', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://cicloecommerce.com.br' },
    body: JSON.stringify(corpo),
  })
  const res = await aplicacaoPost(req)
  conferir(res.status === 200, `rota respondeu ${res.status}`)

  const linhas = metaDoLog(registros)
  conferir(linhas.length === 1, `1 gravação da Meta em conversion_events (vieram ${linhas.length})`)

  if (linhas.length) {
    const l = linhas[0]
    conferir(l.deal_id === DEAL, `deal_id = ${l.deal_id}, esperado ${DEAL}`)
    conferir(l.person_id === PERSON, `person_id = ${l.person_id}, esperado ${PERSON}`)
    conferir('uid' in l, 'uid presente no registro')
    conferir(l.event_name === 'Lead', `event_name = ${l.event_name}`)
    conferir(l.event_id === 'evt-aplicacao-teste', `event_id preservado: ${l.event_id}`)
    conferir(l.action_source === 'website', `action_source = ${l.action_source}`)
    conferir(l.status === 'sent', `status = ${l.status}`)
  }

  // Nada do que vai para a Meta pode ter mudado
  conferir(metaEnvios.length === 1, `1 envio à Meta (vieram ${metaEnvios.length})`)
  if (metaEnvios.length) {
    const e = metaEnvios[0].data[0]
    conferir(e.event_name === 'Lead', `evento enviado: ${e.event_name}`)
    conferir(e.event_id === 'evt-aplicacao-teste', 'event_id do envio inalterado — a dedup depende dele')
    conferir(
      e.custom_data?.content_name === 'consultoria_ecom_shift' && e.custom_data?.deal_id === DEAL,
      'custom_data inalterado'
    )
    conferir(!('context' in e), 'o `context` NÃO vaza para o corpo enviado à Meta')
  }
}

// ── /api/link-bio ───────────────────────────────────────────────────────────

console.log('\n/api/link-bio — as 5 etapas, até concluir')
{
  const { registros, metaEnvios } = mundo()
  const ETAPAS = [
    ['email', { email: 'contato@exemplo.test' }],
    ['whatsapp', { whatsapp: '+5511999990000' }],
    ['empresa', { empresa: 'Loja de Teste' }],
    ['cargo', { cargo: 'Head de Marketing' }],
    ['faturamento', { faturamento: 'R$ 5 a R$ 10 milhões/ano' }],
  ]

  // A sessão do link-bio vive num cookie assinado, e a resposta pode trazer
  // mais de um Set-Cookie (sessão e uid). Por isso o acúmulo é por par, lendo
  // o array, e não `headers.get('set-cookie')`, que vem concatenado.
  const cookies = new Map()
  let problema = false
  for (const [step, data] of ETAPAS) {
    const completo = step === 'faturamento'
    const headers = {
      'content-type': 'application/json',
      origin: 'https://cicloecommerce.com.br',
    }
    if (cookies.size) {
      headers.cookie = [...cookies].map(([k, v]) => `${k}=${v}`).join('; ')
    }
    const req = new NextRequest('https://cicloecommerce.com.br/api/link-bio', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        step,
        data,
        attribution: { source: 'qa', medium: 'teste', campaign: 'qa-contexto' },
        complete: completo,
        event_id: 'evt-linkbio-teste',
        page_url: 'https://cicloecommerce.com.br/link-bio',
      }),
    })
    const res = await linkBioPost(req)
    if (res.status !== 200) {
      falha(`etapa ${step} respondeu ${res.status}`)
      problema = true
    }
    for (const bruto of res.headers.getSetCookie?.() ?? []) {
      const [par] = bruto.split(';')
      const i = par.indexOf('=')
      if (i > 0) cookies.set(par.slice(0, i).trim(), par.slice(i + 1).trim())
    }
  }
  if (!problema) ok('as 5 etapas responderam 200')

  const linhas = metaDoLog(registros)
  conferir(linhas.length === 1, `1 gravação da Meta, só na conclusão (vieram ${linhas.length})`)

  if (linhas.length) {
    const l = linhas[0]
    conferir(l.deal_id === DEAL, `deal_id = ${l.deal_id}, esperado ${DEAL}`)
    conferir(l.person_id === PERSON, `person_id = ${l.person_id}, esperado ${PERSON}`)
    conferir('uid' in l, 'uid presente no registro')
    conferir(l.event_name === 'Lead', `event_name = ${l.event_name}`)
    conferir(l.action_source === 'website', `action_source = ${l.action_source}`)
  }

  conferir(metaEnvios.length === 1, `1 envio à Meta (vieram ${metaEnvios.length})`)
  if (metaEnvios.length) {
    const e = metaEnvios[0].data[0]
    conferir(
      e.custom_data?.content_name === 'link-bio' && e.custom_data?.deal_id === DEAL,
      'custom_data inalterado'
    )
    conferir(!('context' in e), 'o `context` NÃO vaza para o corpo enviado à Meta')
  }
}

// ── O contrato de /api/pipedrive não pode ter mudado ────────────────────────

console.log('\n/api/pipedrive — o que já funcionava continua igual')
{
  const { registros } = mundo()
  const { POST: pipedrivePost } = await import(`${RAIZ}/src/app/api/pipedrive/route.ts`)
  const req = new NextRequest('https://cicloecommerce.com.br/api/pipedrive', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://cicloecommerce.com.br' },
    body: JSON.stringify({
      name: 'Pessoa De Teste',
      email: 'contato@exemplo.test',
      company: 'Loja de Teste',
      phone: '+5511999990000',
      message: 'Teste de contexto com mais de vinte caracteres.',
      attribution: { source: 'qa', medium: 'teste', campaign: 'qa-contexto' },
      event_id: 'evt-contato-teste',
      page_url: 'https://cicloecommerce.com.br/',
    }),
  })
  await pipedrivePost(req)
  const linhas = metaDoLog(registros)
  conferir(linhas.length === 1, `1 gravação da Meta (vieram ${linhas.length})`)
  if (linhas.length) {
    conferir(linhas[0].deal_id === DEAL, `deal_id = ${linhas[0].deal_id} — como já era`)
    conferir(linhas[0].person_id === PERSON, `person_id = ${linhas[0].person_id} — como já era`)
  }
}

console.log(
  '\n' +
    (falhas
      ? `${falhas} FALHA(S)`
      : 'TUDO OK — as três rotas amarram o envio ao negócio, e nada do que vai à Meta mudou')
)
process.exit(falhas ? 1 : 0)
