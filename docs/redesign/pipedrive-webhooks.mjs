// As regras dos dois webhooks do Pipedrive, em isolamento total.
//
// Por que existe: `/api/pipedrive/webhook` é o que transforma movimento
// comercial em `qualify_lead`, `close_convert_lead`, `purchase` e nos eventos
// de funil da Meta. É a mensuração que o Flávio mais faz questão de
// preservar, e é a única parte do sistema que o redesign não podia tocar.
// Os arquivos estão byte a byte iguais à base — este teste prova que o
// COMPORTAMENTO também está, exercitando cada regra.
//
// SEGURANÇA, e isto não é detalhe:
//   · nenhuma chamada sai. `globalThis.fetch` é substituído antes de os
//     módulos carregarem, e toda URL é respondida aqui dentro;
//   · nenhum registro real é movido: os negócios, as pessoas e as etapas são
//     fabricados neste arquivo;
//   · nenhum contato inventado é usado como se fosse real — os e-mails são
//     `@exemplo.test`, domínio reservado que não existe;
//   · as variáveis de ambiente recebem valores de mentira, explicitamente
//     marcados. Nenhum token real é lido.
//
// Os resultados esperados saem do CÓDIGO DA BASE, não de regra inventada:
//
//   lib/ga4-lead-events.ts     funis {2: etapa 11, 13: etapa 96}; "chegar na
//                              etapa" inclui pular por cima (compara order_nr);
//                              ganho manda os dois eventos; idempotente por
//                              (deal, evento) em conversion_events.
//   lib/pipedrive-funnel-events.ts  nome da etapa -> evento da Meta por regex.
//   api/pipedrive/webhook      stageChanged exige a chave stage_id em
//                              `previous`; becameWon exige status em
//                              `previous` e current.status === 'won';
//                              Meta de funil só quando muda etapa E não é
//                              ganho; purchase no GA4 só com ga_client_id.
//   lib/webhook-auth           Basic "pipedrive:<segredo>" ou ?secret=.
//
// Uso:  node --experimental-strip-types --import ./resolve-ts.mjs pipedrive-webhooks.mjs

const RAIZ = process.env.RAIZ_CICLO ?? '/home/user/ciclo'

let falhas = 0
const ok = (t) => console.log('  ok    ' + t)
const falha = (t) => {
  console.log('  FALHA ' + t)
  falhas++
}
const conferir = (c, t) => (c ? ok(t) : falha(t))

// ── Ambiente de mentira. Nenhum valor real. ────────────────────────────────
process.env.PIPEDRIVE_WEBHOOK_SECRET = 'segredo-de-teste-nao-real'
process.env.PIPEDRIVE_API_TOKEN = 'token-de-teste-nao-real'
process.env.GA4_API_SECRET = 'segredo-ga4-de-teste'
process.env.GA4_MEASUREMENT_ID = 'G-TESTE00000'
process.env.SUPABASE_URL = 'https://supabase.exemplo.test'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'chave-de-teste-nao-real'
process.env.META_PIXEL_ID = '000000000000000'
process.env.META_CAPI_TOKEN = 'token-meta-de-teste'
delete process.env.GA4_LEAD_QUALIFY_STAGES

// ── Mundo de mentira ───────────────────────────────────────────────────────

// Etapas: id -> {pipeline, ordem, nome}. Os nomes seguem os do funil real,
// porque é o nome que decide o evento da Meta.
const ETAPAS = {
  9: { pipeline_id: 2, order_nr: 1, name: 'Entrada' },
  10: { pipeline_id: 2, order_nr: 2, name: 'Reunião Agendada' },
  11: { pipeline_id: 2, order_nr: 3, name: 'Lead Qualificado' },
  12: { pipeline_id: 2, order_nr: 4, name: 'Proposta' },
  96: { pipeline_id: 13, order_nr: 3, name: 'SQL / Oportunidade' },
  95: { pipeline_id: 13, order_nr: 1, name: 'Entrada Playbook' },
  700: { pipeline_id: 7, order_nr: 1, name: 'Entrada de outro funil' },
}

const CHAVE_CLIENT_ID = 'f1be9c93fa7a0d8c092e25b3ec924e69e458e0b3'

function negocio({ id = 5001, pipeline = 2, etapa = 11, status = 'open', clientId = 'GA1.1.123.456', valor = 1000 } = {}) {
  return {
    id,
    title: `Negócio de teste ${id}`,
    pipeline_id: pipeline,
    stage_id: etapa,
    status,
    value: valor,
    currency: 'BRL',
    person_id: 9001,
    [CHAVE_CLIENT_ID]: clientId,
  }
}

/** Instala o fetch de mentira e devolve o registro de chamadas. */
function mundo({ deal, jaEnviados = [] } = {}) {
  const chamadas = []
  const json = (corpo, status = 200) =>
    new Response(JSON.stringify(corpo), { status, headers: { 'content-type': 'application/json' } })

  globalThis.fetch = async (url, init = {}) => {
    const u = String(url)
    const metodo = init.method ?? 'GET'
    let corpo = null
    try {
      corpo = init.body ? JSON.parse(init.body) : null
    } catch {}
    chamadas.push({ url: u, metodo, corpo })

    // ── Pipedrive ──
    if (u.includes('/v1/deals/')) return json({ success: true, data: deal })
    if (u.includes('/v1/stages/')) {
      const id = Number(u.match(/\/stages\/(\d+)/)?.[1])
      const e = ETAPAS[id]
      return e ? json({ success: true, data: { id, ...e } }) : json({ success: false }, 404)
    }
    if (u.includes('/v1/persons/')) {
      return json({
        success: true,
        data: {
          id: 9001,
          name: 'Pessoa De Teste',
          // domínio reservado: não existe e não é de ninguém
          email: [{ value: 'contato@exemplo.test', primary: true }],
          phone: [{ value: '+5511999990000', primary: true }],
        },
      })
    }

    // ── Supabase ──
    if (u.includes('supabase.exemplo.test')) {
      if (u.includes('/conversion_events') && metodo === 'GET') {
        const evento = decodeURIComponent(u.match(/event_name=eq\.([^&]+)/)?.[1] ?? '')
        const plataforma = u.match(/platform=eq\.([^&]+)/)?.[1] ?? ''
        return json(jaEnviados.includes(`${plataforma}:${evento}`) ? [{ id: 1 }] : [])
      }
      return json([])
    }

    // ── GA4 Measurement Protocol ──
    if (u.includes('google-analytics.com')) return new Response(null, { status: 204 })

    // ── Meta CAPI ──
    if (u.includes('facebook.com')) return json({ events_received: 1, fbtrace_id: 'teste' })

    throw new Error('URL inesperada no teste: ' + u)
  }

  return chamadas
}

const eventosGa4 = (chamadas) =>
  chamadas
    .filter((c) => c.url.includes('google-analytics.com'))
    .flatMap((c) => (c.corpo?.events ?? []).map((e) => e.name))

const eventosMeta = (chamadas) =>
  chamadas
    .filter((c) => c.url.includes('facebook.com'))
    .flatMap((c) => (c.corpo?.data ?? []).map((e) => e.event_name))

const buscouNegocio = (chamadas) => chamadas.some((c) => c.url.includes('/v1/deals/'))

// ── Carrega as rotas DEPOIS de o fetch de mentira existir ──────────────────
mundo({ deal: negocio() })
const { POST: webhookPost } = await import(`${RAIZ}/src/app/api/pipedrive/webhook/route.ts`)
const { POST: enrichPost } = await import(`${RAIZ}/src/app/api/pipedrive/enrich/route.ts`)
const { NextRequest } = await import('next/server')

const URL_WEBHOOK = 'https://cicloecommerce.com.br/api/pipedrive/webhook'
const URL_ENRICH = 'https://cicloecommerce.com.br/api/pipedrive/enrich'

function pedido(url, corpo, { autorizado = true, basic = false } = {}) {
  const segredo = process.env.PIPEDRIVE_WEBHOOK_SECRET
  let endereco = url
  const headers = { 'content-type': 'application/json' }
  if (autorizado && basic) {
    headers.authorization = 'Basic ' + Buffer.from(`pipedrive:${segredo}`).toString('base64')
  } else if (autorizado) {
    endereco = `${url}?secret=${encodeURIComponent(segredo)}`
  }
  return new NextRequest(endereco, { method: 'POST', headers, body: JSON.stringify(corpo) })
}

/** Dispara o webhook num mundo novo e devolve resposta + chamadas. */
async function disparar(corpoWebhook, { deal, jaEnviados, autorizado = true, basic = false } = {}) {
  const chamadas = mundo({ deal, jaEnviados })
  const res = await webhookPost(pedido(URL_WEBHOOK, corpoWebhook, { autorizado, basic }))
  const corpo = await res.json().catch(() => null)
  return { status: res.status, corpo, chamadas }
}

// Payload v1 e v2 para a mesma mudança
const v1 = (current, previous) => ({ event: 'updated.deal', current, previous })
const v2 = (current, previous) => ({ meta: { action: 'change', entity: 'deal' }, data: current, previous })

console.log('\nAutenticação')
{
  const r = await disparar(v1(negocio(), { stage_id: 10 }), { deal: negocio(), autorizado: false })
  conferir(r.status === 401, `sem segredo → ${r.status}, esperado 401`)
  conferir(!buscouNegocio(r.chamadas), 'sem segredo, nada é consultado no Pipedrive')

  const b = await disparar(v1(negocio(), { stage_id: 10 }), { deal: negocio(), basic: true })
  conferir(b.status === 200, `Basic pipedrive:<segredo> → ${b.status}`)
}

console.log('\nFiltros: o que NÃO deve disparar nada')
{
  // mudança que não é de etapa nem de status
  const r = await disparar(v1({ ...negocio(), title: 'novo título' }, { title: 'antigo' }), { deal: negocio() })
  conferir(r.corpo?.skipped === true, 'mudança de título é ignorada')
  conferir(!buscouNegocio(r.chamadas), 'e nem busca o negócio no Pipedrive')

  // v2 sem a chave stage_id em previous: o Pipedrive só manda o que mudou
  const semChave = await disparar(v2(negocio(), { status: 'open' }), { deal: negocio() })
  conferir(semChave.corpo?.skipped === true, 'previous sem a chave stage_id não conta como mudança de etapa')

  // sem id
  const semId = await disparar(v1({ stage_id: 11 }, { stage_id: 10 }), { deal: negocio() })
  conferir(semId.corpo?.skipped === true, 'payload sem id do negócio é ignorado')
}

console.log('\nEtapa não qualificadora (teste negativo)')
{
  const d = negocio({ etapa: 10 }) // Reunião Agendada, order 2 < 3
  const r = await disparar(v1(d, { stage_id: 9 }), { deal: d })
  conferir(
    !eventosGa4(r.chamadas).includes('qualify_lead'),
    `etapa 10 não gera qualify_lead (GA4: ${eventosGa4(r.chamadas).join(', ') || 'nenhum'})`
  )
  conferir(
    eventosMeta(r.chamadas).includes('Schedule'),
    `mas gera o evento de funil da Meta pelo nome da etapa: ${eventosMeta(r.chamadas).join(', ')}`
  )
}

console.log('\nNegócio não elegível: funil fora da regra (teste negativo)')
{
  const d = negocio({ pipeline: 7, etapa: 700 })
  const r = await disparar(v1(d, { stage_id: 9 }), { deal: d })
  conferir(
    eventosGa4(r.chamadas).length === 0,
    `funil 7 não gera evento de lead no GA4 (${eventosGa4(r.chamadas).join(', ') || 'nenhum'})`
  )
}

console.log('\nChegou na etapa de qualificação')
{
  const d = negocio({ etapa: 11 })
  const r = await disparar(v1(d, { stage_id: 10 }), { deal: d })
  const ga4 = eventosGa4(r.chamadas)
  conferir(ga4.includes('qualify_lead'), `etapa 11 do funil 2 → qualify_lead (${ga4.join(', ')})`)
  conferir(!ga4.includes('close_convert_lead'), 'sem close_convert_lead numa mudança de etapa')
  conferir(
    eventosMeta(r.chamadas).includes('QualifiedLead'),
    `e QualifiedLead na Meta (${eventosMeta(r.chamadas).join(', ')})`
  )
}

console.log('\nPulou por cima da etapa de qualificação')
{
  const d = negocio({ etapa: 12 }) // Proposta, order 4 > 3
  const r = await disparar(v1(d, { stage_id: 9 }), { deal: d })
  conferir(
    eventosGa4(r.chamadas).includes('qualify_lead'),
    'pular direto para Proposta também gera qualify_lead'
  )
  conferir(
    eventosMeta(r.chamadas).includes('ProposalSent'),
    `e ProposalSent na Meta (${eventosMeta(r.chamadas).join(', ')})`
  )
}

console.log('\nFunil Playbooks (13), etapa 96')
{
  const d = negocio({ pipeline: 13, etapa: 96 })
  const r = await disparar(v1(d, { stage_id: 95 }), { deal: d })
  conferir(
    eventosGa4(r.chamadas).includes('qualify_lead'),
    'etapa 96 do funil 13 → qualify_lead'
  )
  conferir(
    eventosMeta(r.chamadas).includes('Opportunity'),
    `e Opportunity na Meta pelo nome "SQL / Oportunidade" (${eventosMeta(r.chamadas).join(', ')})`
  )
}

console.log('\nGanho SEM qualify anterior: manda os dois')
{
  const d = negocio({ etapa: 11, status: 'won' })
  const r = await disparar(v1(d, { status: 'open' }), { deal: d })
  const ga4 = eventosGa4(r.chamadas)
  conferir(ga4.includes('qualify_lead'), 'qualify_lead é enviado junto')
  conferir(ga4.includes('close_convert_lead'), 'close_convert_lead é enviado')
  conferir(ga4.includes('purchase'), 'purchase é enviado (há GA Client ID no negócio)')
  conferir(
    eventosMeta(r.chamadas).includes('Purchase'),
    `Purchase na Meta (${eventosMeta(r.chamadas).join(', ')})`
  )
  conferir(
    !eventosMeta(r.chamadas).includes('QualifiedLead'),
    'e NÃO manda evento de funil por etapa quando é ganho'
  )
}

console.log('\nGanho DEPOIS de já ter qualificado: idempotência')
{
  const d = negocio({ etapa: 12, status: 'won' })
  const r = await disparar(v1(d, { status: 'open' }), {
    deal: d,
    jaEnviados: ['ga4:qualify_lead'],
  })
  const ga4 = eventosGa4(r.chamadas)
  conferir(
    !ga4.includes('qualify_lead'),
    `qualify_lead já enviado não repete (GA4: ${ga4.join(', ')})`
  )
  conferir(ga4.includes('close_convert_lead'), 'mas close_convert_lead vai')
  conferir(
    r.corpo?.ga4?.qualify_lead?.skipped === 'already_sent',
    `e a resposta diz por quê: ${r.corpo?.ga4?.qualify_lead?.skipped}`
  )
}

console.log('\nRepetição do mesmo webhook: deduplicação')
{
  const d = negocio({ etapa: 11 })
  const corpoWh = v1(d, { stage_id: 10 })
  const primeira = await disparar(corpoWh, { deal: d })
  const segunda = await disparar(corpoWh, { deal: d, jaEnviados: ['ga4:qualify_lead'] })
  conferir(
    eventosGa4(primeira.chamadas).includes('qualify_lead') &&
      !eventosGa4(segunda.chamadas).includes('qualify_lead'),
    'o mesmo webhook entregue duas vezes conta uma vez só'
  )
  const grava = primeira.chamadas.filter(
    (c) => c.url.includes('/conversion_events') && c.metodo === 'POST'
  )
  conferir(grava.length >= 1, `o envio é registrado em conversion_events (${grava.length} gravação)`)
  conferir(
    grava.every((g) => g.corpo?.platform && g.corpo?.event_name && g.corpo?.deal_id),
    'com plataforma, nome do evento e deal_id — as três chaves da idempotência'
  )
}

console.log('\nGanho SEM GA Client ID: purchase não vai ao GA4')
{
  const d = negocio({ etapa: 11, status: 'won', clientId: '' })
  const r = await disparar(v1(d, { status: 'open' }), { deal: d })
  conferir(
    !eventosGa4(r.chamadas).includes('purchase'),
    'sem ga_client_id o purchase não é reportado'
  )
  conferir(
    r.corpo?.reason === 'no_ga_client_id',
    `e a resposta diz por quê: ${r.corpo?.reason}`
  )
  conferir(
    eventosMeta(r.chamadas).includes('Purchase'),
    'o Purchase da Meta vai mesmo assim — ele não depende do Client ID'
  )
}

console.log('\nPayload v2 do Pipedrive')
{
  const d = negocio({ etapa: 11 })
  const r = await disparar(v2(d, { stage_id: 10 }), { deal: d })
  conferir(
    eventosGa4(r.chamadas).includes('qualify_lead'),
    'v2 ({meta, data, previous}) é lido igual ao v1'
  )
}

console.log('\n/api/pipedrive/enrich')
{
  const chamadas = mundo({ deal: negocio() })
  const naoAutorizado = await enrichPost(
    pedido(URL_ENRICH, { event: 'added.deal', current: { id: 5001 } }, { autorizado: false })
  )
  conferir(naoAutorizado.status === 401, `sem segredo → ${naoAutorizado.status}, esperado 401`)

  const outro = await enrichPost(pedido(URL_ENRICH, { event: 'updated.deal', current: { id: 5001 } }))
  const corpoOutro = await outro.json()
  conferir(corpoOutro?.skipped === true, 'evento que não é added.deal é ignorado')

  conferir(chamadas.length === 0, `e nada sai para o Pipedrive (${chamadas.length} chamadas)`)
}

console.log('\nChaves de atribuição: as 8 continuam as mesmas')
{
  const { attributionFieldKeys } = await import(`${RAIZ}/src/lib/pipedrive-server.ts`)
  const chaves = attributionFieldKeys()
  const esperadas = [
    'campaign', 'extra', 'ga_client_id', 'ga_session_id', 'gclid', 'landing_page', 'medium', 'source',
  ]
  conferir(
    JSON.stringify(Object.keys(chaves).sort()) === JSON.stringify(esperadas),
    `8 campos de atribuição: ${Object.keys(chaves).sort().join(', ')}`
  )
  conferir(
    Object.values(chaves).every((v) => /^[0-9a-f]{40}$/.test(v)),
    'todas as chaves continuam com o formato de hash de 40 caracteres do Pipedrive'
  )
}

console.log('\nHashes do backend de mensuração e atribuição, contra a base de produção')
{
  const { execFileSync } = await import('node:child_process')
  const { createHash } = await import('node:crypto')
  const { readFileSync } = await import('node:fs')

  const BASE_PROD = '7ae962bad1758ef0c77e775af6a683e7e5a0e280'
  const ARQUIVOS = [
    'src/app/api/pipedrive/webhook/route.ts',
    'src/app/api/pipedrive/enrich/route.ts',
    'src/lib/ga4-lead-events.ts',
    'src/lib/pipedrive-funnel-events.ts',
    'src/lib/pipedrive-server.ts',
    'src/lib/pipedrive-fields.ts',
    'src/lib/meta-capi.ts',
    'src/lib/attribution.ts',
    'src/lib/conversions.ts',
    'src/lib/supabase-server.ts',
    'src/lib/webhook-auth.ts',
  ]
  // Mudança nesta camada só passa com autorização registrada em
  // hashes-excecoes.txt. O teste não deixa de ver a diferença: ele exige que
  // ela esteja declarada, e afirma que o RESTO continua intocado.
  const AUTORIZADOS = [
    // Escolha do cookie de sessão do GA4 pela propriedade certa (18/10).
    'src/lib/attribution.ts',
    'src/lib/pipedrive-server.ts',
  ]
  const excecoes = readFileSync(`${RAIZ}/docs/redesign/hashes-excecoes.txt`, 'utf8')
  const sha = (b) => createHash('sha256').update(b).digest('hex')

  let diferentes = 0
  let naoDeclarados = 0
  for (const arq of ARQUIVOS) {
    const agora = sha(readFileSync(`${RAIZ}/${arq}`))
    let antes = null
    try {
      antes = sha(execFileSync('git', ['show', `${BASE_PROD}:${arq}`], { cwd: RAIZ, maxBuffer: 8e6 }))
    } catch {
      // arquivo não existia na base
    }
    if (antes === agora) continue
    if (AUTORIZADOS.includes(arq) && excecoes.includes(arq)) {
      console.log(`        ${arq} — mudou, com autorização registrada`)
      continue
    }
    diferentes++
    naoDeclarados++
    console.log(`        ${arq}\n          base  ${antes ?? '(não existia)'}\n          agora ${agora}`)
  }
  conferir(
    diferentes === 0,
    `dos ${ARQUIVOS.length} arquivos de mensuração e atribuição, ${ARQUIVOS.length - AUTORIZADOS.length} seguem byte a byte iguais à base ${BASE_PROD.slice(0, 7)} e ${AUTORIZADOS.length} mudaram com autorização declarada` +
      (naoDeclarados ? ` — ${naoDeclarados} mudou SEM declaração` : '')
  )
}

console.log(
  '\n' +
    (falhas
      ? `${falhas} FALHA(S)`
      : 'TUDO OK — autenticação, filtros, etapas, ganho, idempotência, v1/v2, enrich e hashes contra a base')
)
process.exit(falhas ? 1 : 0)
