// O que dá para provar do cron SEM disparar o cron.
//
// `/api/cron/site-digest` roda 0 12 * * * UTC — 09:00 BRT — e ESCREVE: cria
// Note na pessoa e no negócio aberto mais recente, e marca `last_digest_at`
// no visitante. Por isso ele não é executado aqui, nem contra produção.
//
// O que este teste faz é exercitar a rota de verdade com `fetch` trocado por
// mock: nada sai, nada é criado, e dá para afirmar o contrato — autenticação,
// a trava de repetição, o conteúdo do resumo e quantas escritas acontecem.
//
// O que ele NÃO prova, e nenhum teste local prova: que a Vercel realmente
// invoca o agendamento, que o CRON_SECRET de produção confere, e que há
// visitante com navegação na janela. Isso é a execução natural.
//
// Uso:  node --experimental-strip-types --import ./resolve-ts.mjs cron-digest.mjs

const RAIZ = process.env.RAIZ_CICLO ?? '/home/user/ciclo'

let falhas = 0
const ok = (t) => console.log('  ok    ' + t)
const falha = (t) => {
  console.log('  FALHA ' + t)
  falhas++
}
const conferir = (c, t) => (c ? ok(t) : falha(t))

process.env.SUPABASE_URL = 'https://supabase.exemplo.test'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'chave-de-teste-nao-real'
process.env.CRON_SECRET = 'segredo-de-teste-nao-real'
process.env.PIPEDRIVE_API_TOKEN = 'token-de-teste-nao-real'

const json = (corpo, status = 200) =>
  new Response(JSON.stringify(corpo), { status, headers: { 'content-type': 'application/json' } })

const PESSOA = 9002
const NEGOCIO = 9001

/** `fetch` de mentira; devolve tudo o que a rota tentou escrever. */
function mundo({ visitantes, eventos }) {
  const notas = []
  const upserts = []
  globalThis.fetch = async (url, init = {}) => {
    const u = String(url)
    const metodo = init.method ?? 'GET'
    const corpo = (() => {
      try {
        return init.body ? JSON.parse(init.body) : null
      } catch {
        return null
      }
    })()

    if (u.includes('/site_visitors')) {
      if (metodo === 'GET') return json(visitantes)
      upserts.push(corpo)
      return json([{}])
    }
    if (u.includes('/site_events')) return json(eventos)
    if (u.includes('/deals')) return json({ success: true, data: [{ id: NEGOCIO, add_time: '2026-10-17 10:00:00' }] })
    if (u.includes('/notes')) {
      notas.push(corpo)
      return json({ success: true, data: { id: 1 } })
    }
    return json({ success: true, data: {} })
  }
  return { notas, upserts }
}

const { NextRequest } = await import('next/server')
const { GET } = await import(`${RAIZ}/src/app/api/cron/site-digest/route.ts`)
const { buildDigestNote } = await import(`${RAIZ}/src/lib/pipedrive-activity.ts`)

const pedir = (auth) =>
  GET(
    new NextRequest('https://cicloecommerce.com.br/api/cron/site-digest', {
      headers: auth ? { authorization: auth } : {},
    })
  )

// ── Agendamento ─────────────────────────────────────────────────────────────

console.log('\n1. O agendamento registrado')
{
  const { readFileSync } = await import('node:fs')
  const vercel = JSON.parse(readFileSync(`${RAIZ}/vercel.json`, 'utf8'))
  const cron = (vercel.crons ?? []).find((c) => c.path === '/api/cron/site-digest')
  conferir(!!cron, 'o cron está declarado em vercel.json')
  conferir(cron?.schedule === '0 12 * * *', `agenda = ${cron?.schedule} (UTC) = 09:00 BRT`)
  conferir((vercel.crons ?? []).length === 1, 'é o único cron do projeto')
}

// ── Autenticação ────────────────────────────────────────────────────────────

console.log('\n2. Quem não tem o segredo não entra')
{
  mundo({ visitantes: [], eventos: [] })
  for (const [rotulo, auth] of [
    ['sem cabeçalho', undefined],
    ['Bearer errado', 'Bearer nao-e-o-segredo'],
    ['segredo sem Bearer', 'segredo-de-teste-nao-real'],
  ]) {
    const res = await pedir(auth)
    conferir(res.status === 401, `${rotulo}: ${res.status}`)
  }
  const res = await pedir('Bearer segredo-de-teste-nao-real')
  conferir(res.status === 200, `segredo certo: ${res.status}`)
}

console.log('\n3. Sem token do Pipedrive, desiste antes de escrever')
{
  const { notas } = mundo({ visitantes: [{ uid: 'u1', pipedrive_person_id: PESSOA }], eventos: [] })
  const guardado = process.env.PIPEDRIVE_API_TOKEN
  delete process.env.PIPEDRIVE_API_TOKEN
  const res = await pedir('Bearer segredo-de-teste-nao-real')
  const corpo = await res.json()
  process.env.PIPEDRIVE_API_TOKEN = guardado
  conferir(corpo.reason === 'pipedrive_env_missing', `motivo = ${corpo.reason}`)
  conferir(notas.length === 0, 'nenhuma Note criada')
}

// ── A trava de repetição ────────────────────────────────────────────────────

console.log('\n4. Não resume duas vezes no mesmo dia')
{
  const agora = Date.now()
  const { notas, upserts } = mundo({
    visitantes: [
      { uid: 'ja-resumido', pipedrive_person_id: PESSOA, last_digest_at: new Date(agora - 2 * 3600e3).toISOString() },
    ],
    eventos: [],
  })
  const corpo = await (await pedir('Bearer segredo-de-teste-nao-real')).json()
  conferir(corpo.skipped === 1 && corpo.processed === 0, `pulado: ${JSON.stringify(corpo)}`)
  conferir(notas.length === 0 && upserts.length === 0, 'nada escrito para quem já tem resumo de 2h atrás')
}

console.log('\n5. Resumo de 21h atrás já pode ser refeito')
{
  const agora = Date.now()
  const base = new Date(agora - 3 * 3600e3).getTime()
  const { notas } = mundo({
    visitantes: [
      { uid: 'u1', pipedrive_person_id: PESSOA, last_digest_at: new Date(agora - 21 * 3600e3).toISOString() },
    ],
    eventos: [
      { occurred_at: new Date(base).toISOString(), type: 'page_view', path: '/', title: 'Início', source: 'google', medium: 'cpc' },
    ],
  })
  const corpo = await (await pedir('Bearer segredo-de-teste-nao-real')).json()
  conferir(corpo.processed === 1, `processado: ${JSON.stringify(corpo)}`)
  conferir(notas.length === 1, '1 Note criada')
}

// ── O que a Note diz ────────────────────────────────────────────────────────

console.log('\n6. Uma Note por visitante, na pessoa e no negócio aberto')
{
  const base = Date.now() - 4 * 3600e3
  const min = (n) => new Date(base + n * 60000).toISOString()
  const { notas, upserts } = mundo({
    visitantes: [{ uid: 'u1', pipedrive_person_id: PESSOA }],
    eventos: [
      { occurred_at: min(0), type: 'page_view', path: '/', title: 'Início', source: 'google', medium: 'cpc' },
      { occurred_at: min(5), type: 'page_view', path: '/aplicacao', title: 'Aplicação' },
      { occurred_at: min(9), type: 'page_view', path: '/aplicacao', title: 'Aplicação' },
      // Fora da visita: intervalo maior que 30 min abre outra
      { occurred_at: min(100), type: 'page_view', path: '/obrigado', title: 'Obrigado' },
      { occurred_at: min(104), type: 'page_view', path: '/blog', title: 'Blog' },
      { occurred_at: min(106), type: 'click', path: '/blog', title: 'Blog' },
    ],
  })
  const corpo = await (await pedir('Bearer segredo-de-teste-nao-real')).json()
  conferir(corpo.processed === 1 && corpo.skipped === 0, `resultado: ${JSON.stringify(corpo)}`)
  conferir(notas.length === 1, `exatamente 1 Note (vieram ${notas.length})`)

  const nota = notas[0] ?? {}
  conferir(nota.person_id === PESSOA, `Note na pessoa ${nota.person_id}`)
  conferir(nota.deal_id === NEGOCIO, `Note também no negócio aberto ${nota.deal_id}`)
  conferir(/4 páginas em 2 visitas/.test(nota.content ?? ''), 'conta páginas e visitas')
  conferir(/\/aplicacao\) ×2/.test(nota.content ?? ''), 'agrupa repetição da mesma página')
  conferir(!/\/obrigado/.test(nota.content ?? ''), '/obrigado fica de fora da lista')
  conferir(/Origem: google \/ cpc/.test(nota.content ?? ''), 'traz a origem')
  conferir(/Tempo estimado/.test(nota.content ?? ''), 'traz o tempo estimado')
  conferir(!/click/.test(nota.content ?? ''), 'só page_view entra')

  conferir(upserts.length === 1 && !!upserts[0]?.last_digest_at, 'marca last_digest_at para não repetir')
}

console.log('\n7. Sem navegação na janela, não cria Note')
{
  const { notas, upserts } = mundo({
    visitantes: [{ uid: 'u1', pipedrive_person_id: PESSOA }],
    eventos: [{ occurred_at: new Date().toISOString(), type: 'click', path: '/', title: 'Início' }],
  })
  const corpo = await (await pedir('Bearer segredo-de-teste-nao-real')).json()
  conferir(corpo.processed === 0 && corpo.skipped === 1, `pulado: ${JSON.stringify(corpo)}`)
  conferir(notas.length === 0 && upserts.length === 0, 'nada escrito')
}

console.log('\n8. Só visitante vinculado e sem opt-out entra na consulta')
{
  let consulta = ''
  globalThis.fetch = async (url) => {
    const u = String(url)
    if (u.includes('/site_visitors')) {
      consulta = u
      return json([])
    }
    return json([])
  }
  await pedir('Bearer segredo-de-teste-nao-real')
  conferir(consulta.includes('pipedrive_person_id=not.is.null'), 'filtra quem não tem pessoa vinculada')
  conferir(consulta.includes('opted_out=eq.false'), 'respeita o opt-out')
  conferir(consulta.includes('limit=500'), 'limite de 500 por execução')
}

console.log('\n9. A função do resumo, isolada')
{
  conferir(buildDigestNote([], new Date()) === null, 'sem evento, não há Note')
  conferir(
    buildDigestNote(
      [{ occurred_at: new Date().toISOString(), type: 'page_view', path: '/obrigado', title: 'Obrigado' }],
      new Date()
    ) === null,
    'só /obrigado, não há Note'
  )
}

console.log(
  '\n' +
    (falhas
      ? `${falhas} FALHA(S)`
      : 'TUDO OK — agendamento, autenticação, trava de repetição e conteúdo do resumo, sem disparar o cron')
)
process.exit(falhas ? 1 : 0)
