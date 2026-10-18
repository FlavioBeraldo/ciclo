// A sessão do GA4 tem que vir da NOSSA propriedade.
//
// O que aconteceu: no Tag Assistant, às 22:16 de 17/10, o hit de `page_view`
// saiu com `tid=G-EY1FLE5C0J` e `sid=1792277136` — sessão iniciada 17/10
// 19:45:36 BRT. O negócio 3646, do mesmo navegador (mesmo `cid`), tinha
// `ga_session_id=1789481472` — 15/09/2026 11:11:12 BRT. Mesmo cliente, sessão
// de um mês antes.
//
// A causa está no código: tanto o cliente quanto o servidor pegavam o PRIMEIRO
// cookie começado em `_ga_`. A ordem de `document.cookie` é do navegador —
// caminho mais específico primeiro, depois ordem de criação — e não tem
// relação com a propriedade. Com mais de um `_ga_*` no domínio, o id vinha de
// onde calhasse.
//
// Este teste fixa o contrato da escolha. Não faz rede, não cria lead, não
// toca em primeiro toque, evento, formulário nem playbook.
//
// Uso:  node --experimental-strip-types --import ./resolve-ts.mjs sessao-ga4.mjs

const RAIZ = process.env.RAIZ_CICLO ?? '/home/user/ciclo'

let falhas = 0
const ok = (t) => console.log('  ok    ' + t)
const falha = (t) => {
  console.log('  FALHA ' + t)
  falhas++
}
const conferir = (c, t) => (c ? ok(t) : falha(t))

const {
  GA4_MEASUREMENT_ID,
  GA4_SESSION_COOKIE,
  parseGaSessionId,
  pickGaSessionId,
  cookiesFromDocument,
} = await import(`${RAIZ}/src/lib/ga4-session.ts`)

// Os valores reais da evidência, para o teste falar a mesma língua do achado.
const NOSSA = '1792277136' // 17/10 19:45:36 BRT — a sessão verdadeira
const OUTRA = '1789481472' // 15/09 11:11:12 BRT — a que foi parar no CRM

console.log('\n1. O cookie certo')
conferir(GA4_MEASUREMENT_ID === 'G-EY1FLE5C0J', `propriedade = ${GA4_MEASUREMENT_ID}`)
conferir(GA4_SESSION_COOKIE === '_ga_EY1FLE5C0J', `cookie de sessão = ${GA4_SESSION_COOKIE}`)

console.log('\n2. Formatos de valor — GS1 e GS2')
conferir(
  parseGaSessionId(`GS1.1.${NOSSA}.1.1.1792277200.0.0.0`) === NOSSA,
  'GS1: a sessão é o terceiro campo'
)
conferir(
  parseGaSessionId(`GS2.1.s${NOSSA}$o3$g1$t1792277400$j60$l0$h0`) === NOSSA,
  'GS2: a sessão vem com prefixo s e termina no $'
)
conferir(parseGaSessionId('GS1.1') === undefined, 'valor truncado não vira sessão')
conferir(parseGaSessionId('') === undefined, 'valor vazio não vira sessão')
conferir(parseGaSessionId('GS1.1.abc.1') === undefined, 'valor não numérico é recusado')
conferir(parseGaSessionId('GS2.1.s$o1') === undefined, 'GS2 sem número é recusado')

console.log('\n3. Mais de uma propriedade no domínio — o caso do achado')
{
  // Ordem de propósito "errada": a outra propriedade vem primeiro, como viria
  // num navegador onde aquele cookie foi criado antes.
  const cookies = [
    { name: '_ga', value: 'GA1.1.236604966.1789393663' },
    { name: '_ga_XXXXXXXXXX', value: `GS1.1.${OUTRA}.1.1.1789481500.0.0.0` },
    { name: '_ga_EY1FLE5C0J', value: `GS2.1.s${NOSSA}$o3$g1$t1792277400$j60$l0$h0` },
  ]
  const escolhida = pickGaSessionId(cookies)
  conferir(escolhida === NOSSA, `escolheu ${escolhida}, a sessão de hoje`)
  conferir(escolhida !== OUTRA, 'NÃO escolheu a sessão de setembro da outra propriedade')
}

console.log('\n4. Duas cópias do MESMO cookie — ambiguidade, não palpite')
{
  // O navegador pode mandar o mesmo nome mais de uma vez, quando há cópia em
  // outro caminho ou domínio, e `document.cookie` não diz de qual escopo cada
  // uma veio. Qual o gtag está realmente escrevendo é HIPÓTESE — não medido.
  // Então, com valores diferentes, nenhum é escolhido.
  const divergentes = [
    { name: '_ga_EY1FLE5C0J', value: `GS1.1.${OUTRA}.1.1.1789481500.0.0.0` },
    { name: '_ga_EY1FLE5C0J', value: `GS1.1.${NOSSA}.4.1.1792277400.0.0.0` },
  ]
  const r = pickGaSessionId(divergentes)
  conferir(r === undefined, `valores diferentes no mesmo nome: devolveu ${r}, esperado vazio`)
  conferir(r !== NOSSA && r !== OUTRA, 'não escolhe nem a mais recente nem a mais antiga')

  // Mesma coisa dita duas vezes não é ambiguidade: é uma resposta só.
  const iguais = [
    { name: '_ga_EY1FLE5C0J', value: `GS1.1.${NOSSA}.4.1.1792277400.0.0.0` },
    { name: '_ga_EY1FLE5C0J', value: `GS2.1.s${NOSSA}$o4$g1$t1792277500$j60$l0$h0` },
  ]
  conferir(pickGaSessionId(iguais) === NOSSA, 'cópias que concordam, mesmo em formatos diferentes, devolvem o valor')

  // Uma cópia ilegível não inventa divergência com a válida.
  const comLixo = [
    { name: '_ga_EY1FLE5C0J', value: 'lixo' },
    { name: '_ga_EY1FLE5C0J', value: `GS1.1.${NOSSA}.4.1.1792277400.0.0.0` },
  ]
  conferir(pickGaSessionId(comLixo) === NOSSA, 'cópia ilegível é descartada, não vira divergência')

  // Três cópias, duas concordando e uma não: continua ambíguo.
  const tres = [...iguais, { name: '_ga_EY1FLE5C0J', value: `GS1.1.${OUTRA}.1.1.1789481500.0.0.0` }]
  conferir(pickGaSessionId(tres) === undefined, 'maioria não decide: duas contra uma continua ambíguo')
}

console.log('\n5. Ausência')
conferir(pickGaSessionId([]) === undefined, 'sem cookie nenhum, não inventa sessão')
conferir(
  pickGaSessionId([{ name: '_ga', value: 'GA1.1.236604966.1789393663' }]) === undefined,
  'só o _ga (client id), sem sessão'
)
conferir(
  pickGaSessionId([{ name: '_ga_XXXXXXXXXX', value: `GS1.1.${OUTRA}.1.1.1789481500.0.0.0` }]) === undefined,
  'só outra propriedade: devolve vazio em vez da sessão errada'
)
conferir(
  pickGaSessionId([{ name: '_ga_EY1FLE5C0J', value: 'lixo' }]) === undefined,
  'cookie da nossa propriedade com valor inválido: vazio'
)

console.log('\n6. Leitura de document.cookie')
{
  const bruto = `_ga=GA1.1.236604966.1789393663; _ga_XXXXXXXXXX=GS1.1.${OUTRA}.1.1.1789481500.0.0.0; _ga_EY1FLE5C0J=GS2.1.s${NOSSA}%24o3%24g1%24t1792277400%24j60%24l0%24h0; ciclo_uid=abc`
  const pares = cookiesFromDocument(bruto)
  conferir(pares.length === 4, `4 cookies lidos (vieram ${pares.length})`)
  conferir(
    pickGaSessionId(pares) === NOSSA,
    'valor percent-encoded é decodificado antes de separar o $'
  )
  conferir(
    cookiesFromDocument('').length === 0 && pickGaSessionId(cookiesFromDocument('')) === undefined,
    'document.cookie vazio não quebra'
  )
}

// ── O que NÃO pode ter mudado ───────────────────────────────────────────────

console.log('\n7. Primeiro toque, eventos, formulários e playbook intactos')
{
  const fonte = await import('node:fs').then((fs) =>
    fs.readFileSync(`${RAIZ}/src/lib/attribution.ts`, 'utf8')
  )

  // O primeiro toque continua sendo gravado uma única vez, com os mesmos
  // campos e a mesma validade. Nada de sessão entra no cookie histórico.
  conferir(fonte.includes("const COOKIE_NAME = 'ciclo_attr'"), 'cookie de primeiro toque inalterado')
  conferir(fonte.includes('const COOKIE_DAYS = 90'), 'validade de 90 dias inalterada')
  conferir(
    fonte.includes('if (readStored()) return'),
    'primeiro toque continua só gravando se ainda não existir'
  )
  conferir(
    !/ga_session_id/.test(fonte.split('export function collectAttribution')[1].split('export')[0]),
    'o cookie histórico continua SEM id de sessão'
  )

  // O payload do submit continua com a mesma forma.
  const payload = fonte.split('export function getAttributionPayload')[1]
  for (const campo of ['ga_client_id', 'ga_session_id', 'fbp', 'fbc']) {
    conferir(payload.includes(`${campo}:`), `payload do submit ainda tem ${campo}`)
  }
  conferir(payload.includes('...stored'), 'payload ainda parte do primeiro toque guardado')

  // O client id vem do _ga e não foi tocado.
  conferir(
    fonte.includes("const raw = readCookie('_ga')"),
    'client id continua lido do cookie _ga, sem mudança'
  )
}

console.log('\n8. Contrato do servidor')
{
  const { attributionFromRequestCookies, attributionDealProps } = await import(
    `${RAIZ}/src/lib/pipedrive-server.ts`
  )
  const loja = [
    { name: 'ciclo_attr', value: encodeURIComponent(JSON.stringify({ source: 'google', medium: 'cpc' })) },
    { name: '_ga', value: 'GA1.1.236604966.1789393663' },
    { name: '_ga_XXXXXXXXXX', value: `GS1.1.${OUTRA}.1.1.1789481500.0.0.0` },
    { name: '_ga_EY1FLE5C0J', value: `GS2.1.s${NOSSA}$o3$g1$t1792277400$j60$l0$h0` },
  ]
  const cookies = {
    get: (n) => loja.find((c) => c.name === n),
    getAll: () => loja,
  }
  const attr = attributionFromRequestCookies(cookies)
  conferir(attr.ga_session_id === NOSSA, `servidor escolheu ${attr.ga_session_id}`)
  conferir(attr.ga_client_id === '236604966.1789393663', 'client id do servidor inalterado')
  conferir(attr.source === 'google' && attr.medium === 'cpc', 'primeiro toque do cookie preservado')

  // Sem o nosso cookie, o campo some em vez de vir errado.
  const semNosso = {
    get: (n) => loja.find((c) => c.name === n),
    getAll: () => loja.filter((c) => c.name !== '_ga_EY1FLE5C0J'),
  }
  conferir(
    attributionFromRequestCookies(semNosso).ga_session_id === undefined,
    'sem o cookie da nossa propriedade, o campo fica vazio'
  )

  // O mapeamento para o negócio não mudou.
  const props = attributionDealProps({ ...attr })
  const valores = Object.values(props)
  conferir(valores.includes(NOSSA), 'a sessão escolhida chega às propriedades do negócio')
  conferir(!valores.includes(OUTRA), 'a sessão de setembro não chega ao negócio')
}

console.log(
  '\n' +
    (falhas
      ? `${falhas} FALHA(S)`
      : 'TUDO OK — a sessão vem do cookie da nossa propriedade, e o primeiro toque, o payload e o negócio seguem iguais')
)
process.exit(falhas ? 1 : 0)
