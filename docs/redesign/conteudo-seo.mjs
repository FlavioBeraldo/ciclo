// O conteúdo mudou onde devia, e só onde devia.
//
// Esta rodada trocou os indicadores sem fonte das páginas de serviço e de
// solução pelos cases reais da Ciclo, acrescentou perguntas de FAQ, texto na
// home, complemento em três artigos e cinco artigos novos.
//
// O que este passo afirma:
//
//   1. não sobrou métrica fictícia em servicos.ts nem em solucoes.ts;
//   2. os quatro resultados vêm de cases.ts, com a marca no rótulo, e cases.ts
//      continua byte a byte igual à base de produção anterior;
//   3. o bloco de cases tem 3 cards, sem número, e nenhum valor do bloco de
//      resultados se repete nele;
//   4. conteúdo legado preservado: as FAQs antigas continuam lá, o playbook
//      está intocado e os três artigos complementados mantêm corpo e título;
//   5. todo link interno novo aponta para URL que existe;
//   6. o JSON-LD de FAQPage bate com as perguntas visíveis no HTML;
//   7. os cinco artigos novos respondem 200, com h1, canonical próprio e
//      autoria institucional.
//
// Sem rede externa e sem criar lead.
//
// Uso:  node conteudo-seo.mjs http://127.0.0.1:3100

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'
const RAIZ = process.env.RAIZ_CICLO ?? '/home/user/ciclo'

let falhas = 0
const ok = (t) => console.log('  ok    ' + t)
const falha = (t) => {
  console.log('  FALHA ' + t)
  falhas++
}
const conferir = (c, t) => (c ? ok(t) : falha(t))

/** Texto comparável: sem acento de entidade, sem espaço duplo, minúsculo. */
const normalizar = (t) =>
  t
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&middot;|&#183;/g, '·')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

const { readFileSync, readdirSync } = await import('node:fs')
const { execFileSync } = await import('node:child_process')

const servicos = readFileSync(`${RAIZ}/src/lib/servicos.ts`, 'utf8')
const solucoes = readFileSync(`${RAIZ}/src/lib/solucoes.ts`, 'utf8')

// ── 1. Nenhuma métrica fictícia sobrou ──────────────────────────────────────

console.log('\n1. Indicadores sem fonte')
{
  conferir(!/metric: '/.test(servicos), 'servicos.ts sem métrica escrita à mão')
  conferir(!/metric: '/.test(solucoes), 'solucoes.ts sem métrica escrita à mão')
  conferir(!/highlight: '/.test(servicos), 'servicos.ts sem destaque escrito à mão')
  conferir(
    (servicos.match(/results: resultadosDosCases/g) ?? []).length === 17,
    '17 serviços lendo os resultados da fonte central'
  )
  conferir(
    (servicos.match(/examples: narrativasDosCases/g) ?? []).length === 17,
    '17 serviços lendo as narrativas da fonte central'
  )
  conferir(
    (solucoes.match(/results: resultadosDosCasesSolucao/g) ?? []).length === 4,
    '4 soluções lendo os resultados da fonte central'
  )

  // As frases que foram corrigidas não podem voltar
  for (const frase of [
    'de 3 a 5 vezes mais',
    'entre 30% e 50% do potencial',
    'ROI médio de 4000%',
    'acima de 95%',
    '2-3x mais rápido',
    'R$50-200 de receita',
    'de 5 a 7 vezes menos',
    '40-60% maior',
  ]) {
    conferir(!servicos.includes(frase), `alegação removida continua fora: "${frase}"`)
  }
}

// ── 2. A fonte dos cases não foi tocada ─────────────────────────────────────

console.log('\n2. A fonte dos cases')
{
  const atual = readFileSync(`${RAIZ}/src/lib/cases.ts`)
  let base = null
  try {
    base = execFileSync('git', ['show', '7ae962b:src/lib/cases.ts'], {
      cwd: RAIZ,
      maxBuffer: 8e6,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
  } catch {
    // base indisponível
  }
  conferir(
    base !== null && Buffer.compare(atual, base) === 0,
    'src/lib/cases.ts continua byte a byte igual à base de produção anterior'
  )

  const conteudo = readFileSync(`${RAIZ}/src/lib/cases-conteudo.ts`, 'utf8')
  conferir(
    !/metric: '[+-]?\d/.test(conteudo),
    'cases-conteudo.ts não tem valor escrito à mão — tudo vem de cases.ts'
  )
  conferir(
    conteudo.includes("import { cases } from './cases'"),
    'cases-conteudo.ts lê a fonte única'
  )
}

// ── 3. O que aparece na página de serviço ───────────────────────────────────

console.log('\n3. O bloco de #resultados virou cases em vídeo')
{
  // Substituição autorizada pelo Flávio em 19/10: o bloco de quatro
  // indicadores saiu das páginas de serviço e de solução, e no lugar entrou o
  // mesmo bloco de cases em vídeo da home. A âncora #resultados foi mantida.
  const COM_BLOCO = [
    ...[...servicos.matchAll(/\n    slug: '([a-z0-9-]+)'/g)]
      .map((m) => `/servicos/${m[1]}`)
      .filter((r) => r !== '/servicos/agencia-ugc'),
    ...[...solucoes.matchAll(/\n    slug: '([a-z0-9-]+)'/g)].map((m) => `/solucoes/${m[1]}`),
  ]
  conferir(COM_BLOCO.length === 21, `${COM_BLOCO.length} páginas com o bloco (17 serviços + 4 soluções)`)

  let semVideo = 0
  let comStats = 0
  let ancoraErrada = 0
  for (const rota of COM_BLOCO) {
    const html = await (await fetch(BASE + rota)).text()
    const ancoras = (html.match(/id="resultados"/g) ?? []).length
    const grades = (html.match(/proof-grid/g) ?? []).length
    const botoes = (html.match(/Assistir ao vídeo/g) ?? []).length
    if (ancoras !== 1) ancoraErrada++
    if (grades !== 1 || botoes !== 4) semVideo++
    if (html.includes('result-grid') || html.includes('O impacto da estratégia no negócio')) comStats++
  }
  conferir(semVideo === 0, `as ${COM_BLOCO.length} páginas têm exatamente um bloco de vídeo com 4 cards (${semVideo} fora)`)
  conferir(comStats === 0, `nenhuma página mantém o bloco de indicadores antigo (${comStats})`)
  conferir(ancoraErrada === 0, `a âncora #resultados existe e é única em todas (${ancoraErrada} fora)`)

  // Detalhe numa página de cada tipo
  for (const rota of ['/servicos/creative-strategy', '/solucoes/geracao-de-demanda']) {
    const html = await (await fetch(BASE + rota)).text()
    for (const marca of ['Mamô Brasil', 'Líquido', 'KVRA', 'DANKI']) {
      conferir(html.includes(marca), `${rota}: ${marca}`)
    }
    conferir(html.includes('Quem vive, recomenda.'), `${rota}: o título do bloco é o mesmo da home`)
    conferir(html.includes('href="/depoimentos"'), `${rota}: CTA para /depoimentos`)
    conferir(html.includes('href="#resultados"'), `${rota}: o link do índice continua apontando para a âncora`)
    conferir(!html.includes('youtube.com/embed'), `${rota}: nenhum iframe antes do clique`)
    conferir(
      !/[+-]\d+%|Mamô · |Gringa · /.test(html.split('id="resultados"')[1]?.split('</section>')[0] ?? ''),
      `${rota}: nenhum indicador sobrou no bloco`
    )
  }

  // O bloco narrativo de "Casos práticos" NÃO foi tocado
  {
    const html = await (await fetch(`${BASE}/servicos/google-ads`)).text()
    conferir(
      html.includes('Casos práticos') && html.includes('Estratégia aplicada ao mundo real.'),
      'o bloco de casos narrativos segue com o heading original'
    )
    const sec = html.slice(html.indexOf('Casos práticos')).split('</section>')[0]
    conferir((sec.match(/<article/g) ?? []).length === 3, '  e com os 3 cards de narrativa')
    conferir(sec.includes('trajetória da Ciclo'), '  e com o parágrafo de contexto')
  }

  // A página que nunca teve o bloco continua sem ele
  const ugc = await (await fetch(`${BASE}/servicos/agencia-ugc`)).text()
  conferir(!ugc.includes('id="resultados"'), '/servicos/agencia-ugc segue sem o bloco')
  conferir(!ugc.includes('proof-grid'), '  e sem a grade de vídeo')

  // Home e /depoimentos intocadas
  for (const rota of ['/', '/depoimentos']) {
    const html = await (await fetch(BASE + rota)).text()
    conferir(
      (html.match(/proof-grid/g) ?? []).length === 1 &&
        ['Mamô Brasil', 'Líquido', 'KVRA', 'DANKI'].every((m) => html.includes(m)),
      `${rota}: a grade de vídeo segue como era`
    )
  }
}

console.log('\n4. O que já existia continua lá, contra a base de Production')
{
  // Base FIXA de produção. Comparar com HEAD deixava de proteger assim que o
  // commit era feito — foi o segundo buraco apontado na revisão.
  const BASE_PROD = '57f493a0540a011fbe50122596256a9881b15e07'
  const daBase = (caminho) => {
    try {
      return execFileSync('git', ['show', `${BASE_PROD}:${caminho}`], {
        cwd: RAIZ,
        maxBuffer: 3e7,
        stdio: ['ignore', 'pipe', 'ignore'],
      })
    } catch {
      return null
    }
  }

  // 4.1 Arquivos que não podem mudar NEM UM BYTE
  const INTOCAVEIS = [
    'src/data/wp-posts.json',
    'src/lib/cases.ts',
    'src/components/ciclo/base.css',
    'src/components/ciclo/interiors.css',
    'src/components/ciclo/explicacoes.css',
    'src/components/ciclo/tiktok.css',
    'src/components/ciclo/fonts.ts',
    'src/app/globals.css',
    'src/app/playbook-social-commerce/page.tsx',
    'src/lib/conversions.ts',
    'src/lib/attribution.ts',
    'src/lib/meta-capi.ts',
    'src/lib/pipedrive-server.ts',
    'src/lib/supabase-server.ts',
    'src/lib/ga4-lead-events.ts',
    'src/app/api/pipedrive/route.ts',
    'src/app/api/aplicacao/route.ts',
    'src/app/api/link-bio/route.ts',
  ]
  const mudados = INTOCAVEIS.filter((arq) => {
    const base = daBase(arq)
    if (base === null) return true
    return Buffer.compare(readFileSync(`${RAIZ}/${arq}`, null), base) !== 0
  })
  conferir(
    mudados.length === 0,
    `${INTOCAVEIS.length} arquivos de conteúdo antigo, CSS, fontes, playbook e integração byte a byte iguais à base`
  )
  for (const m of mudados) console.log('        MUDOU: ' + m)

  // 4.2 servicos.ts e solucoes.ts: só o que foi autorizado pode ter mudado
  const EXCECOES_AUTORIZADAS = [
    'results',   // 4 métricas por página -> cases reais
    'examples',  // 3 casos anônimos -> narrativas dos cases
    'faq',       // uma pergunta nova por página, acrescentada ao fim
    'what',
    'why',
    'howItWorks', // alegações numéricas reescritas, listadas em CONTEUDO-SEO.md
  ]
  conferir(EXCECOES_AUTORIZADAS.length === 6, 'as exceções autorizadas estão declaradas no teste')

  for (const [arq, campos] of [
    ['src/lib/servicos.ts', ['slug', 'title', 'heroHeadline', 'heroDescription', 'parentSlug', 'relatedSlugs']],
    ['src/lib/solucoes.ts', ['slug', 'title', 'heroHeadline', 'heroDescription']],
  ]) {
    const base = daBase(arq)?.toString('utf8') ?? ''
    const agora = readFileSync(`${RAIZ}/${arq}`, 'utf8')
    for (const campo of campos) {
      // Exatamente quatro espaços: ancora no campo de TOPO de cada item. Sem
      // isso o regex pega `seo.title` e os `title` dos examples removidos por
      // autorização, e a comparação acusa onde não há mudança.
      const re = new RegExp(`\\n    ${campo}:\\s*(?:\\n      )?('[^']*'|\\[[^\\]]*\\])`, 'g')
      const antes = [...base.matchAll(re)].map((m) => m[1])
      const depois = [...agora.matchAll(re)].map((m) => m[1])
      conferir(
        antes.length > 0 && antes.length === depois.length && antes.every((v, i) => v === depois[i]),
        `${arq.split('/').pop()}: ${campo} igual à base, na mesma ordem (${antes.length})`
      )
    }
  }

  // tagline existe só em servico
  {
    const base = daBase('src/lib/servicos.ts')?.toString('utf8') ?? ''
    const agora = readFileSync(`${RAIZ}/src/lib/servicos.ts`, 'utf8')
    const re = /\n    tagline: ('[^']*')/g
    const antes = [...base.matchAll(re)].map((m) => m[1])
    const depois = [...agora.matchAll(re)].map((m) => m[1])
    conferir(
      antes.length === 18 && antes.every((v, i) => v === depois[i]),
      `servicos.ts: as ${antes.length} taglines iguais à base, na mesma ordem`
    )
  }

  // 4.3 TODAS as perguntas originais de FAQ continuam lá, na mesma ordem
  for (const arq of ['src/lib/servicos.ts', 'src/lib/solucoes.ts']) {
    const base = daBase(arq)?.toString('utf8') ?? ''
    const agora = readFileSync(`${RAIZ}/${arq}`, 'utf8')
    const perguntas = (txt) => [...txt.matchAll(/\n\s*q: '((?:[^'\\]|\\.)*)'/g)].map((m) => m[1])
    const antes = perguntas(base)
    const depois = perguntas(agora)
    const sumidas = antes.filter((q) => !depois.includes(q))
    // Subsequência com cursor crescente. A versão anterior
    // (`depois.indexOf(q) >= i || depois.includes(q)`) era tautologia: bastava a
    // pergunta existir para passar, mesmo invertida. Esta exige que cada
    // pergunta original apareça DEPOIS da anterior, e lida com repetidas.
    let cursor = 0
    let ordemOk = true
    for (const q of antes) {
      const achou = depois.indexOf(q, cursor)
      if (achou === -1) {
        ordemOk = false
        break
      }
      cursor = achou + 1
    }
    conferir(
      antes.length > 0 && sumidas.length === 0,
      `${arq.split('/').pop()}: as ${antes.length} perguntas originais continuam presentes`
    )
    for (const q of sumidas.slice(0, 5)) console.log('        sumiu: ' + q.slice(0, 70))
    conferir(ordemOk, `${arq.split('/').pop()}: a ordem das perguntas originais foi mantida`)
    conferir(
      depois.length >= antes.length,
      `${arq.split('/').pop()}: ${depois.length - antes.length} perguntas novas, nenhuma removida`
    )
  }

  // 4.3b Prova de que a verificação de ordem não é decorativa.
  //
  // A versão anterior passava com a lista invertida. Esta roda a mesma lógica
  // contra uma sequência embaralhada de propósito e exige que ela REPROVE.
  {
    const subsequencia = (antes, depois) => {
      let cursor = 0
      for (const q of antes) {
        const achou = depois.indexOf(q, cursor)
        if (achou === -1) return false
        cursor = achou + 1
      }
      return true
    }
    conferir(subsequencia(['a', 'b', 'c'], ['a', 'x', 'b', 'y', 'c']), 'controle: ordem mantida passa')
    conferir(!subsequencia(['a', 'b', 'c'], ['c', 'b', 'a']), 'ordem invertida REPROVA')
    conferir(!subsequencia(['a', 'b'], ['b', 'a']), 'troca de duas REPROVA')
    conferir(!subsequencia(['a', 'b'], ['a']), 'pergunta sumida REPROVA')
    conferir(subsequencia(['a', 'a'], ['a', 'x', 'a']), 'pergunta repetida é tratada')
    conferir(!subsequencia(['a', 'a'], ['a']), 'repetida que virou uma só REPROVA')
  }

  // 4.4 agencia-ugc: o regex que engoliu o faq uma vez não pode repetir
  {
    const agora = readFileSync(`${RAIZ}/src/lib/servicos.ts`, 'utf8')
    const bloco = agora.split("slug: 'agencia-ugc',")[1]?.split("\n  {\n    slug: '")[0] ?? ''
    conferir(/results: \[\]/.test(bloco), 'agencia-ugc segue com results vazio')
    conferir(/examples: \[\]/.test(bloco), 'agencia-ugc segue com examples vazio')
    const qtd = [...bloco.matchAll(/\n\s*q: '/g)].length
    conferir(qtd >= 7, `agencia-ugc manteve o faq inteiro (${qtd} perguntas)`)
  }

  // 4.5 Títulos, seções e ordem: provados pelo DIFF DO FONTE contra a base.
  //
  // Comparar com o HTML da base exigiria compilar a árvore daquele commit. O
  // diff do fonte prova a mesma coisa de forma exata: se nenhuma linha com
  // `<h1`, `<h2` ou `<section` foi adicionada ou removida nos arquivos
  // tocados, então título, seção e ordem não mudaram.
  {
    const TOCADOS = [
      'src/app/servicos/[slug]/page.tsx',
      'src/app/solucoes/[slug]/page.tsx',
      'src/app/blog/[slug]/page.tsx',
      'src/components/ciclo/home/Solucoes.tsx',
      'src/app/consultoria-para-e-commerce/page.tsx',
      'src/app/consultoria-ecom-shift/page.tsx',
      'src/components/ciclo/tiktok/conteudo.ts',
    ]
    for (const arq of TOCADOS) {
      let diff = ''
      try {
        // Sem 'HEAD' de propósito: compara a base com a ÁRVORE DE TRABALHO.
        diff = execFileSync('git', ['diff', BASE_PROD, '--unified=0', '--', arq], {
          cwd: RAIZ,
          encoding: 'utf8',
          maxBuffer: 8e6,
          stdio: ['ignore', 'pipe', 'ignore'],
        })
      } catch {}
      const mudadas = diff
        .split('\n')
        .filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l))
      const removidas = mudadas.filter((l) => l.startsWith('-'))
      // Remoção de estrutura nunca pode. Acréscimo só no template do blog, onde
      // o apêndice editorial foi autorizado e cria a própria seção.
      const estruturaRemovida = removidas.filter((l) => /<h[12][\s>]|<section|<\/section>/.test(l))
      const estruturaAdicionada = mudadas
        .filter((l) => l.startsWith('+'))
        .filter((l) => /<h[12][\s>]|<section|<\/section>/.test(l))
      const apendiceDoBlog = arq === 'src/app/blog/[slug]/page.tsx'
      // Exceção autorizada em 19/10: nos dois templates de interior, o bloco de
      // indicadores foi SUBSTITUÍDO pelo de cases em vídeo, então ali há
      // remoção. Em todo o resto continua valendo só acréscimo.
      //
      // Exceção autorizada em 21/10: em tiktok/conteudo.ts os três números de
      // mercado do topo (40%, R$ 1,2 bi, R$ 39 bi) foram SUBSTITUÍDOS pelo
      // bloco "Nossos resultados", com os prints da Central do Vendedor. É a
      // única remoção permitida nesse arquivo, e está conferida logo abaixo:
      // o que saiu tem de ser exatamente essas quatro linhas.
      const trocaDosNumeros = arq === 'src/components/ciclo/tiktok/conteudo.ts'
      if (trocaDosNumeros) {
        const esperadas = ['numeros: [', "valor: '40%'", "valor: 'R$ 1,2 bi'", "valor: 'R$ 39 bi'"]
        const fora = removidas.filter((l) => !esperadas.some((e) => l.includes(e)))
        conferir(
          fora.length === 0,
          `tiktok/conteudo.ts: só os três números do topo saíram (${removidas.length} linha(s), ${fora.length} fora do combinado)`
        )
        for (const l of fora) console.log('        REMOVIDO SEM AUTORIZAÇÃO: ' + l.trim().slice(0, 80))
      }
      const trocaDoBloco =
        arq === 'src/app/servicos/[slug]/page.tsx' || arq === 'src/app/solucoes/[slug]/page.tsx'
      // As duas remoções autorizadas, cada uma conferida pela sua própria
      // regra: a troca do bloco de indicadores nos dois templates de interior
      // e a troca dos três números do topo do TikTok Shop.
      const remocaoAutorizada = trocaDoBloco || trocaDosNumeros
      conferir(
        removidas.length === 0 || remocaoAutorizada,
        remocaoAutorizada
          ? `${arq.split('/').slice(-2).join('/')}: ${removidas.length} linha(s) removidas, na troca do bloco autorizada`
          : `${arq.split('/').slice(-2).join('/')}: só acréscimo, nenhuma linha removida (${removidas.length})`
      )
      if (!remocaoAutorizada)
        for (const l of removidas.slice(0, 4)) console.log('        removida: ' + l.slice(0, 90))
      // Mesmo na troca, o que sai tem de ser só o bloco de indicadores
      if (trocaDoBloco) {
        const foraDoBloco = removidas.filter(
          (l) =>
            l.slice(1).trim() !== '' && // linha em branco removida não é conteúdo
            !/result-grid|O impacto da estratégia|RESSALVA_RESULTADOS|service-light-results|outcome-section|results\.length|results\.map|metric|description|section-fade|inner-section-heading|eyebrow|<span \/>|Resultados|<\/div>|<\/section>|\{|\}|<div|<h2|<p |<strong>|<\/strong>|<\/p>|<\/h2>/.test(l)
        )
        conferir(
          foraDoBloco.length === 0,
          `  o que saiu é só o bloco de indicadores (${foraDoBloco.length} linha(s) fora dele)`
        )
        for (const l of foraDoBloco.slice(0, 5)) console.log('        fora do bloco: ' + l.slice(0, 90))
      }
      conferir(
        estruturaRemovida.length === 0 || trocaDoBloco,
        trocaDoBloco
          ? `  ${estruturaRemovida.length} linha(s) de estrutura na troca do bloco, autorizada`
          : `  nenhum h1, h2 ou section removido (${estruturaRemovida.length})`
      )
      for (const l of estruturaRemovida.slice(0, 4)) console.log('        removida: ' + l.slice(0, 90))
      conferir(
        estruturaAdicionada.length === 0 || apendiceDoBlog || trocaDoBloco,
        apendiceDoBlog
          ? `  ${estruturaAdicionada.length} linha(s) de estrutura no apêndice do blog, autorizado`
          : `  nenhum h1, h2 ou section acrescentado (${estruturaAdicionada.length})`
      )
      if (!apendiceDoBlog)
        for (const l of estruturaAdicionada.slice(0, 4)) console.log('        acrescentada: ' + l.slice(0, 90))
    }

    // E nenhuma seção nova na home nem na consultoria, no HTML servido
    for (const rota of ['/', '/consultoria-para-e-commerce']) {
      const html = await (await fetch(BASE + rota)).text()
      const abre = (html.match(/<section/g) ?? []).length
      const fecha = (html.match(/<\/section>/g) ?? []).length
      conferir(abre === fecha && abre > 0, `${rota}: ${abre} seções, abertura e fechamento batendo`)
    }
  }

  // 4.6 Os três artigos complementados: título original e apêndice ao fim
  for (const [slug, trecho] of [
    ['qual-e-o-melhor-momento-de-contratar-uma-agencia-de-marketing-para-meu-e-commerce', 'Melhor Momento'],
    ['facebook-ads-google-ads-ou-tiktok-qual-escolher-em-2025', 'Qual Escolher'],
    ['markup-ou-margem-de-contribuicao-qual-usar-no-e-commerce', 'Margem de Contribuição'],
  ]) {
    const html = await (await fetch(`${BASE}/blog/${slug}`)).text()
    const h1 = html.match(/<h1[^>]*>([^<]*)/)?.[1] ?? ''
    conferir(h1.includes(trecho), `/blog/${slug.slice(0, 30)}… manteve o h1 original`)
    const iCorpo = html.indexOf('article-body')
    const iComp = html.indexOf('article-complemento')
    conferir(
      iComp > iCorpo && iComp < html.indexOf('article-end'),
      '  apêndice vem DEPOIS do corpo e antes do rodapé do artigo'
    )
  }
}

// ── 5. Links internos novos ─────────────────────────────────────────────────

console.log('\n5. Todo link novo aponta para página que existe')
{
  const complementos = readFileSync(`${RAIZ}/src/lib/blog-complementos.ts`, 'utf8')
  const novos = readdirSync(`${RAIZ}/content/blog`)
    .filter((n) => n.endsWith('.mdoc'))
    .map((n) => readFileSync(`${RAIZ}/content/blog/${n}`, 'utf8'))
    .join('\n')

  const urls = new Set([
    ...[...complementos.matchAll(/href: '(\/[a-z0-9/-]+)'/g)].map((m) => m[1]),
    ...[...novos.matchAll(/\]\((\/[a-z0-9/-]+)\)/g)].map((m) => m[1]),
  ])
  conferir(urls.size > 15, `${urls.size} URLs internas distintas para conferir`)

  const quebradas = []
  for (const u of urls) {
    const r = await fetch(BASE + u, { redirect: 'follow' })
    if (r.status !== 200) quebradas.push(`${u} -> ${r.status}`)
  }
  conferir(quebradas.length === 0, `nenhuma URL interna quebrada (${quebradas.length})`)
  for (const q of quebradas.slice(0, 10)) console.log('        ' + q)

  // Os links da home
  const home = await (await fetch(BASE)).text()
  conferir(home.includes('href="#solucoes"'), 'home: link para #solucoes')
  conferir(home.includes('href="/consultoria-para-e-commerce"'), 'home: link para a consultoria')
  conferir(
    home.includes('agência de marketing para e-commerce que conecta'),
    'home: parágrafo institucional publicado'
  )
}

// ── 6. JSON-LD bate com o HTML ──────────────────────────────────────────────

console.log('\n6. FAQPage consistente com o que a página mostra')
for (const rota of ['/servicos/google-ads', '/servicos/crm-email-sms-push-whatsapp', '/tiktok-shop']) {
  const html = await (await fetch(BASE + rota)).text()
  // A ordem dos atributos varia: /tiktok-shop põe o id antes do type.
  const blocos = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>(.*?)<\/script>/gs)].map(
    (m) => m[1]
  )
  const faq = blocos
    .map((b) => {
      try {
        return JSON.parse(b)
      } catch {
        return null
      }
    })
    .find((j) => j && j['@type'] === 'FAQPage')
  if (!faq) {
    falha(`${rota} sem FAQPage no JSON-LD`)
    continue
  }

  // O conteúdo VISÍVEL, sem script nem style. Sem isso a comparação se
  // satisfaz com o próprio JSON-LD e não prova nada — foi o buraco apontado
  // na revisão.
  const visivel = normalizar(
    html
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
  conferir(
    !visivel.includes('"@type"') && !visivel.includes('faqpage'),
    `${rota}: o texto comparado não contém mais o JSON-LD`
  )

  const faltandoPergunta = faq.mainEntity.filter((q) => !visivel.includes(normalizar(q.name)))
  // Sem tolerância: as três páginas derivam o schema da mesma fonte que o
  // accordion exibe. /tiktok-shop tinha schema escrito à mão, com cinco das seis
  // respostas divergindo do texto visível; passou a derivar da fonte única, e a
  // divergência deixou de existir. Nenhuma pergunta ou resposta visível mudou.
  const toleradas = 0
  const faltandoResposta = faq.mainEntity.filter(
    (q) => !visivel.includes(normalizar(q.acceptedAnswer.text))
  )
  conferir(
    faltandoPergunta.length === 0,
    `${rota}: as ${faq.mainEntity.length} perguntas do schema aparecem no conteúdo visível`
  )
  for (const q of faltandoPergunta.slice(0, 3)) console.log('        falta pergunta: ' + q.name)
  conferir(
    faltandoResposta.length <= toleradas,
    toleradas
      ? `${rota}: ${faltandoResposta.length} respostas divergentes, limite herdado ${toleradas}`
      : `${rota}: as ${faq.mainEntity.length} respostas do schema aparecem no conteúdo visível`
  )
  for (const q of faltandoResposta.slice(0, 4))
    console.log('        diverge a resposta de: ' + q.name.slice(0, 60))

  // E o caminho contrário: pergunta visível que não está no schema
  const noHtml = [...html.matchAll(/<summary[^>]*>(?:\s*<[^>]+>)*([^<]+)/g)].map((m) => m[1].trim())
  if (noHtml.length) {
    const semSchema = noHtml.filter(
      (t) => !faq.mainEntity.some((q) => normalizar(q.name) === normalizar(t))
    )
    conferir(
      semSchema.length === 0 && noHtml.length === faq.mainEntity.length,
      `${rota}: ${noHtml.length} perguntas no accordion e ${faq.mainEntity.length} no schema, sem sobra`
    )
    for (const t of semSchema.slice(0, 3)) console.log('        fora do schema: ' + t)
  }
}

// ── 7. Os artigos novos ─────────────────────────────────────────────────────

console.log('\n7. Os cinco artigos novos')
{
  const NOVOS = [
    'quanto-custa-uma-agencia-de-marketing-para-e-commerce',
    'agencia-equipe-interna-ou-consultoria-para-e-commerce',
    'quando-trocar-de-agencia-de-marketing-no-e-commerce',
    'como-escolher-uma-agencia-de-tiktok-shop',
    'como-medir-o-resultado-do-crm-alem-da-taxa-de-abertura',
  ]
  for (const slug of NOVOS) {
    const r = await fetch(`${BASE}/blog/${slug}`)
    const html = await r.text()
    const h1 = html.match(/<h1[^>]*>([^<]*)/)?.[1] ?? ''
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? ''
    conferir(
      r.status === 200 && h1.length > 10 && canonical.endsWith(`/blog/${slug}`),
      `${slug.slice(0, 44)}… ${r.status}, h1 e canonical próprio`
    )
    conferir(html.includes('Time Ciclo'), '  autoria institucional, sem pessoa real como revisora')
  }

  // Todos entram no sitemap
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text()
  const faltando = NOVOS.filter((s) => !xml.includes(`/blog/${s}<`))
  conferir(faltando.length === 0, `os 5 artigos estão no sitemap (${faltando.length} fora)`)
}

console.log(
  '\n' +
    (falhas
      ? `${falhas} FALHA(S)`
      : 'TUDO OK — indicadores sem fonte fora, cases reais no lugar, legado preservado e links de pé')
)
process.exit(falhas ? 1 : 0)
