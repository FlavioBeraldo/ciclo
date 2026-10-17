// Os indicadores de case não podem sair do cartão nem da própria célula.
//
// O bug que motivou este teste: no cartão da Gringa, "120→55 dias" tinha
// `white-space: nowrap` e 29px de corpo numa célula de ~124px. Precisava de
// 162px e vazava por fora da borda do cartão.
//
// Aqui a medição é por ELEMENTO, não pela página: um `scrollWidth` maior que
// o `clientWidth` do próprio contêiner já reprova, mesmo que a página inteira
// não ganhe barra de rolagem. É esse o caso que passava despercebido.
//
// Também confere que nenhum número foi abreviado: o texto de cada resultado
// tem de bater, caractere a caractere, com `src/lib/cases.ts`.
//
// E confere o ESTILO NO NÓ QUE CONTÉM OS DÍGITOS, não no elemento em volta.
// A primeira versão deste teste media o `strong` e deu tudo verde enquanto o
// número aparecia a 10px na cor da legenda: a regra `.case-results span` do
// kit estava pegando o span do número. Medir o contêiner não serve; tem de
// ser o nó com o texto.
//
// Uso:  node --experimental-strip-types cases-indicadores.mjs [baseURL]

import { chromium } from 'playwright-core'

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'
const RAIZ = process.env.RAIZ_CICLO ?? '/home/user/ciclo'

const { cases } = await import(`${RAIZ}/src/lib/cases.ts`)

let falhas = 0
const ok = (t) => console.log('  ok    ' + t)
const falha = (t) => {
  console.log('  FALHA ' + t)
  falhas++
}
const conferir = (c, t) => (c ? ok(t) : falha(t))

// Larguras pedidas na revisão, mais a ampliação de texto.
const CENARIOS = [
  { nome: '320', largura: 320, zoom: 1 },
  { nome: '390', largura: 390, zoom: 1 },
  { nome: '768', largura: 768, zoom: 1 },
  { nome: '1024', largura: 1024, zoom: 1 },
  { nome: '1440', largura: 1440, zoom: 1 },
  { nome: '1440 com texto a 150%', largura: 1440, zoom: 1.5 },
  { nome: '390 com texto a 200%', largura: 390, zoom: 2 },
]

// Onde os resultados de case aparecem
const ROTAS = [
  { rota: '/', seletor: '.case-results' },
  { rota: '/obrigado', seletor: '.case-results' },
  { rota: '/consultoria-ecom-shift', seletor: '.metricas-case' },
]

// Comparo sem espaço nenhum: o valor e o rótulo são elementos irmãos, e o
// navegador não insere espaço entre eles. O que importa é que cada caractere
// do número e do rótulo esteja lá — nada abreviado, nada cortado.
const semEspaco = (t) => t.replace(/\s+/g, '')
const esperados = cases.flatMap((c) => c.metrics.map((m) => `${m.value} ${m.label}`))
const esperadosNus = esperados.map(semEspaco)

const navegador = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })

for (const { rota, seletor } of ROTAS) {
  for (const cen of CENARIOS) {
    const ctx = await navegador.newContext({ viewport: { width: cen.largura, height: 900 } })
    const p = await ctx.newPage()
    await p.route('**', (r) =>
      r.request().url().startsWith(BASE) ? r.continue() : r.fulfill({ status: 204, body: '' })
    )
    await p.goto(BASE + rota, { waitUntil: 'domcontentloaded' })

    // Ampliação de texto do navegador: só o tamanho da fonte, não zoom de
    // página — é assim que a pessoa que precisa de texto maior configura.
    if (cen.zoom !== 1) {
      await p.addStyleTag({ content: `html { font-size: ${16 * cen.zoom}px }` })
      // Ampliação de texto do navegador aumenta TODAS as fontes, inclusive a
      // do contêiner da grade — é isso que permite a grade reagir. Simular só
      // o número seria mais severo do que a realidade e esconderia a adaptação.
      await p.evaluate((z) => {
        const alvos = document.querySelectorAll(
          '.case-results, .case-results strong, .case-results > div > span, .metricas-case, .metricas-case dt, .metricas-case dd'
        )
        for (const e of alvos) {
          const atual = parseFloat(getComputedStyle(e).fontSize)
          e.style.fontSize = `${atual * z}px`
        }
      }, cen.zoom)
    }

    await p.waitForTimeout(600)

    const medida = await p.evaluate(
      ({ seletor }) => {
        const vazou = []
        const textos = []
        const tipografia = []
        for (const grupo of document.querySelectorAll(seletor)) {
          for (const celula of grupo.children) {
            const caixa = celula.getBoundingClientRect()
            for (const filho of celula.querySelectorAll('*')) {
              const f = filho.getBoundingClientRect()
              // margem de 1px para arredondamento do navegador
              if (f.right > caixa.right + 1 || f.left < caixa.left - 1) {
                vazou.push({
                  tag: filho.tagName,
                  texto: (filho.textContent || '').trim().slice(0, 28),
                  celula: Math.round(caixa.width),
                  elemento: Math.round(f.width),
                })
              }
            }
            // scrollWidth maior que clientWidth = conteúdo cortado ou vazando
            if (celula.scrollWidth > celula.clientWidth + 1) {
              vazou.push({
                tag: 'CELULA',
                texto: (celula.textContent || '').trim().slice(0, 28),
                celula: celula.clientWidth,
                elemento: celula.scrollWidth,
              })
            }
            textos.push((celula.textContent || '').replace(/\s+/g, ' ').trim())

            // O nó que REALMENTE contém os dígitos, e a legenda ao lado dele.
            const numero =
              celula.querySelector('.valor-numero') ?? celula.querySelector('strong, dt')
            const legenda = celula.querySelector(':scope > span, :scope > dd')
            const ler = (e) => {
              if (!e) return null
              const s = getComputedStyle(e)
              return {
                texto: (e.textContent || '').trim(),
                px: parseFloat(s.fontSize),
                peso: Number(s.fontWeight),
                cor: s.color,
                display: s.display,
              }
            }
            tipografia.push({ numero: ler(numero), legenda: ler(legenda) })
          }
        }
        const doc = document.documentElement
        return { vazou, textos, tipografia, estouroPagina: doc.scrollWidth - doc.clientWidth }
      },
      { seletor }
    )

    const rotulo = `${rota} @ ${cen.nome}`
    conferir(
      medida.vazou.length === 0,
      `${rotulo} — nenhum indicador vaza da célula` +
        (medida.vazou.length
          ? ' — ' +
            medida.vazou
              .slice(0, 3)
              .map((v) => `${v.tag} "${v.texto}" ${v.elemento}px em ${v.celula}px`)
              .join(' | ')
          : '')
    )
    conferir(
      medida.estouroPagina <= 1,
      `${rotulo} — sem estouro horizontal na página (${medida.estouroPagina}px)`
    )

    // Conteúdo preservado: nenhum número abreviado nem rótulo perdido
    const nus = medida.textos.map(semEspaco)
    const faltando = esperados.filter((e, i) => !nus.includes(esperadosNus[i]))
    conferir(
      faltando.length === 0,
      `${rotulo} — os ${esperados.length} indicadores aparecem inteiros` +
        (faltando.length ? ` — faltam: ${faltando.slice(0, 3).join(' / ')}` : '')
    )

    // ── Tipografia: o número tem de parecer número, não legenda ───────────
    const minimo = 14 * cen.zoom
    const miudos = medida.tipografia.filter((t) => t.numero && t.numero.px < minimo)
    conferir(
      miudos.length === 0,
      `${rotulo} — nenhum número menor que ${minimo}px` +
        (miudos.length
          ? ' — ' + miudos.slice(0, 3).map((t) => `"${t.numero.texto}" ${t.numero.px}px`).join(' | ')
          : ` (menor: ${Math.min(...medida.tipografia.map((t) => t.numero?.px ?? 999))}px)`)
    )

    const invertidos = medida.tipografia.filter(
      (t) => t.numero && t.legenda && t.numero.px <= t.legenda.px
    )
    conferir(
      invertidos.length === 0,
      `${rotulo} — o número é maior que a legenda em todas as células` +
        (invertidos.length
          ? ' — ' +
            invertidos
              .slice(0, 3)
              .map((t) => `"${t.numero.texto}" ${t.numero.px}px vs legenda ${t.legenda.px}px`)
              .join(' | ')
          : '')
    )

    const palidos = medida.tipografia.filter(
      (t) => t.numero && t.legenda && t.numero.cor === t.legenda.cor
    )
    conferir(
      palidos.length === 0,
      `${rotulo} — o número não usa a cor da legenda` +
        (palidos.length ? ` — ${palidos.length} célula(s) com a mesma cor` : '')
    )

    const leves = medida.tipografia.filter(
      (t) => t.numero && t.legenda && t.numero.peso < t.legenda.peso
    )
    conferir(leves.length === 0, `${rotulo} — o número não é mais leve que a legenda`)

    await ctx.close()
  }
}

// ── Captura de tela do cartão com três resultados, para olho humano ────────
{
  for (const [tag, largura] of [['desktop', 1440], ['celular', 390]]) {
    const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 } })
    const p = await ctx.newPage()
    await p.route('**', (r) =>
      r.request().url().startsWith(BASE) ? r.continue() : r.fulfill({ status: 204, body: '' })
    )
    await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' })
    await p.waitForTimeout(1200)
    const cartao = p.locator('#case-3')
    await cartao.scrollIntoViewIfNeeded()
    await p.waitForTimeout(500)
    const destino = `${process.env.SAIDA_CASES ?? '.'}/cases-gringa-${tag}.png`
    await cartao.screenshot({ path: destino })
    ok(`captura do cartão de três resultados em ${tag}: ${destino}`)
    await ctx.close()
  }
}

await navegador.close()
console.log(
  '\n' +
    (falhas
      ? `${falhas} FALHA(S)`
      : `TUDO OK — ${esperados.length} indicadores inteiros e dentro da célula em ${CENARIOS.length} cenários, em 3 rotas, com número legível e acima da legenda`)
)
process.exit(falhas ? 1 : 0)
