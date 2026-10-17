// Preservação de conteúdo e SEO do blog.
//
// Confere a listagem (filtro por categoria, paginação e busca, todos no
// servidor) e os artigos das três fontes — curados, acervo WordPress e
// Keystatic. Em cada artigo: title, description, canonical, robots, o JSON-LD
// de Article com os mesmos campos de antes, o de FAQPage quando o texto tem
// perguntas, e o corpo do artigo presente.
//
// Os posts do WordPress são 800 e poucos; conferir todos a cada rodada levaria
// minutos. A amostra é determinística — um a cada N, sempre os mesmos — e os
// curados e os do Keystatic entram inteiros.
//
// Uso:  node --experimental-strip-types blog-seo.mjs [baseURL]

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'
const RAIZ = process.env.RAIZ_CICLO ?? '/home/user/ciclo'
const PASSO_WP = Number(process.env.PASSO_WP ?? 20)

const blog = await import(`${RAIZ}/src/lib/blog.ts`)

// Os posts do Keystatic são lidos direto dos .mdoc. O módulo
// `keystatic-posts.ts` importa a config do Keystatic, que o type stripping do
// Node não resolve — e o frontmatter é a mesma fonte da verdade que ele lê.
async function lerKeystatic() {
  const { readdir, readFile } = await import('node:fs/promises')
  const dir = `${RAIZ}/content/blog`
  const arquivos = (await readdir(dir)).filter((f) => f.endsWith('.mdoc')).sort()
  const saida = []
  for (const arquivo of arquivos) {
    const texto = await readFile(`${dir}/${arquivo}`, 'utf8')
    const fm = texto.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!fm) continue
    const campos = {}
    // Frontmatter simples: chave, valor em linha, aspas ou bloco com >-
    for (const bloco of fm[1].split(/\n(?=\S)/)) {
      const m = bloco.match(/^([a-zA-Z]+):\s*([\s\S]*)$/)
      if (!m) continue
      let v = m[2].trim()
      if (v.startsWith('>-') || v.startsWith('>')) {
        v = v.replace(/^>-?\s*/, '').split('\n').map((l) => l.trim()).join(' ')
      }
      v = v.replace(/^'(.*)'$/s, '$1').replace(/^"(.*)"$/s, '$1').replace(/''/g, "'")
      campos[m[1]] = v.trim()
    }
    const hoje = new Date().toISOString().slice(0, 10)
    // Post agendado para o futuro ainda não está no ar
    if (campos.date > hoje) continue
    saida.push({
      slug: arquivo.replace(/\.mdoc$/, ''),
      title: campos.title,
      excerpt: campos.excerpt,
      date: campos.date,
      category: campos.category,
      corpo: fm[2],
    })
  }
  return saida
}

let falhas = 0
const problemas = []
const conferir = (cond, pagina, oque) => {
  if (!cond) {
    falhas++
    problemas.push(`${pagina}: ${oque}`)
  }
}

const normalizar = (s) =>
  String(s)
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')

const pegar = (html, re) => {
  const m = html.match(re)
  return m ? normalizar(m[1]).trim() : null
}

function jsonLd(html, tipo) {
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const o = JSON.parse(m[1].replace(/\\u003c/g, '<'))
      if (o['@type'] === tipo) return o
    } catch {
      /* outro bloco */
    }
  }
  return null
}

// ── Listagem ────────────────────────────────────────────────────────────────
{
  const r = await fetch(`${BASE}/blog`)
  conferir(r.status === 200, '/blog', `respondeu ${r.status}`)
  const html = await r.text()
  conferir(
    pegar(html, /<link rel="canonical" href="([^"]*)"/) === 'https://cicloecommerce.com.br/blog',
    '/blog',
    'canonical mudou'
  )
  conferir(/index, ?follow/.test(html), '/blog', 'robots não é index,follow')
  conferir(
    pegar(html, /<title>([^<]*)<\/title>/) ===
      'Blog de E-commerce | Estratégias de Full Funnel Marketing e Growth | Ciclo',
    '/blog',
    'title mudou'
  )

  // A listagem precisa continuar renderizada no servidor, sem depender de JS
  const cartoes = (html.match(/class="article-card"/g) ?? []).length
  conferir(cartoes === 24, '/blog', `deveria trazer 24 cartões no HTML, trouxe ${cartoes}`)

  // Filtro, paginação e busca, todos no servidor
  for (const [rota, oque] of [
    ['/blog?cat=SEO', 'filtro por categoria'],
    ['/blog?page=2', 'paginação'],
    ['/blog?q=tiktok', 'busca'],
  ]) {
    const rr = await fetch(BASE + rota)
    const hh = await rr.text()
    conferir(rr.status === 200, rota, `${oque} respondeu ${rr.status}`)
    conferir(/class="article-card"/.test(hh), rota, `${oque} não renderizou cartão no servidor`)
    conferir(
      pegar(hh, /<link rel="canonical" href="([^"]*)"/) === 'https://cicloecommerce.com.br/blog',
      rota,
      'canonical da variante deveria apontar para /blog'
    )
  }

  // Categoria inexistente: estado vazio, não erro
  const vazio = await fetch(`${BASE}/blog?cat=NaoExiste`)
  const hVazio = await vazio.text()
  conferir(vazio.status === 200, '/blog?cat=NaoExiste', `respondeu ${vazio.status}`)
  conferir(/empty-state/.test(hVazio), '/blog?cat=NaoExiste', 'sem estado vazio')

  // ── Regressão: o artigo de destaque faz parte do acervo ──────────────────
  //
  // Ele ficava fora da coleção, então a busca e o filtro de categoria nunca o
  // encontravam: procurar por "full funnel" devolvia zero enquanto o artigo
  // era justamente o destaque da página.
  const destaque = blog.posts[0]
  const contar = (h) => (h.match(/class="article-card"/g) ?? []).length

  const termo = destaque.title.split(':')[0].slice(0, 20)
  const hBusca = await (await fetch(`${BASE}/blog?q=${encodeURIComponent(termo)}`)).text()
  conferir(
    hBusca.includes(normalizar(destaque.title)),
    `/blog?q=${termo}`,
    'a busca não encontra o artigo de destaque'
  )
  conferir(contar(hBusca) >= 1, `/blog?q=${termo}`, 'busca pelo destaque não devolveu cartão')

  const cat = encodeURIComponent(destaque.category)
  const hCat = await (await fetch(`${BASE}/blog?cat=${cat}`)).text()
  conferir(
    hCat.includes(normalizar(destaque.title)),
    `/blog?cat=${destaque.category}`,
    'o filtro de categoria não encontra o artigo de destaque'
  )

  // Na primeira página sem filtro ele é o bloco de destaque e NÃO se repete
  // na grade
  const hHome = await (await fetch(`${BASE}/blog`)).text()
  const noHtml = (hHome.match(new RegExp(`href="/blog/${destaque.slug}"`, 'g')) ?? []).length
  conferir(noHtml === 1, '/blog', `o destaque aparece ${noHtml}x no HTML, deveria ser 1`)

  // Paginação: a última página existe e traz pelo menos um cartão
  const ultima = await fetch(`${BASE}/blog?page=35`)
  conferir(ultima.status === 200, '/blog?page=35', `respondeu ${ultima.status}`)
  conferir(contar(await ultima.text()) > 0, '/blog?page=35', 'última página sem cartão')
}

// ── Artigos ─────────────────────────────────────────────────────────────────
const curados = blog.posts
const ks = await lerKeystatic()
// `getWpPosts` usa `require`, que não existe no contexto ESM deste script e
// devolveria uma lista vazia sem avisar. Lê-se o mesmo JSON direto.
const wp = JSON.parse(
  await (await import('node:fs/promises')).readFile(`${RAIZ}/src/data/wp-posts.json`, 'utf8')
)
const amostraWp = wp.filter((_, i) => i % PASSO_WP === 0)

const alvos = [
  ...curados.map((p) => ({ fonte: 'curado', p })),
  ...ks.map((p) => ({ fonte: 'keystatic', p })),
  ...amostraWp.map((p) => ({ fonte: 'wp', p })),
]

for (const { fonte, p } of alvos) {
  const rota = `/blog/${p.slug}`
  const r = await fetch(BASE + rota, { redirect: 'manual' })

  // Post substituído redireciona com 308 para o sucessor — comportamento a manter
  if (r.status === 308) {
    const destino = r.headers.get('location')
    conferir(
      !!blog.supersededWpPosts[p.slug] && destino?.includes(blog.supersededWpPosts[p.slug]),
      rota,
      `308 inesperado para ${destino}`
    )
    continue
  }

  conferir(r.status === 200, rota, `respondeu ${r.status}`)
  if (r.status !== 200) continue
  const bruto = await r.text()
  const html = normalizar(bruto)

  conferir(
    pegar(bruto, /<title>([^<]*)<\/title>/) === normalizar(`${p.title} | Ciclo Blog`),
    rota,
    'title mudou'
  )
  conferir(
    pegar(bruto, /<meta name="description" content="([^"]*)"/) === normalizar(p.excerpt),
    rota,
    'description mudou'
  )
  conferir(
    pegar(bruto, /<link rel="canonical" href="([^"]*)"/) ===
      `https://cicloecommerce.com.br/blog/${p.slug}`,
    rota,
    'canonical mudou'
  )
  conferir(/index, ?follow/.test(bruto), rota, 'robots não é index,follow')

  const art = jsonLd(bruto, 'Article')
  conferir(!!art, rota, 'sem JSON-LD de Article')
  if (art) {
    conferir(art.headline === p.title, rota, 'headline do Article mudou')
    conferir(art.description === p.excerpt, rota, 'description do Article mudou')
    conferir(art.datePublished === p.date, rota, 'datePublished mudou')
    conferir(art.inLanguage === 'pt-BR', rota, 'inLanguage mudou')
    conferir(
      art.mainEntityOfPage?.['@id'] === `https://cicloecommerce.com.br/blog/${p.slug}`,
      rota,
      'mainEntityOfPage mudou'
    )
    conferir(art.publisher?.name === 'Ciclo E-commerce', rota, 'publisher mudou')
  }

  // FAQPage só existe quando o texto traz perguntas em negrito. No acervo
  // WordPress o padrão já vem em HTML; no Keystatic, em markdown no começo do
  // parágrafo. Os curados não entram no extrator, então nunca têm FAQPage.
  // Mesma regra do extrator da página: além da pergunta em negrito, precisa
  // haver resposta. Pergunta solta, sem texto depois, não vira FAQPage.
  const temResposta = (html) => {
    const re = /<p><strong>([^<]+\?)<\/strong>\s*([\s\S]*?)<\/p>/g
    let m
    while ((m = re.exec(html))) {
      if (m[2].replace(/<[^>]+>/g, ' ').trim()) return true
    }
    return false
  }
  const temFaq =
    fonte === 'wp'
      ? temResposta(p.html ?? '')
      : fonte === 'keystatic'
        ? /^\*\*[^*]+\?\*\*\s*\S/m.test(p.corpo ?? '')
        : false
  conferir(
    temFaq === !!jsonLd(bruto, 'FAQPage'),
    rota,
    temFaq ? 'perdeu o JSON-LD de FAQPage' : 'ganhou um FAQPage que não existia'
  )

  // O corpo do artigo precisa estar na página
  conferir(/class="article-body"/.test(bruto), rota, 'sem corpo de artigo')
  conferir(html.includes(normalizar(p.title)), rota, 'título fora do HTML')

  // O sumário tem de bater com os h2 do corpo
  const h2 = (bruto.match(/<h2[^>]*id="secao-/g) ?? []).length
  const itens = (bruto.match(/<a href="#secao-/g) ?? []).length
  conferir(h2 === itens, rota, `sumário com ${itens} itens para ${h2} seções`)
}

const total = alvos.length
if (falhas) {
  console.log(`${falhas} FALHA(S) em ${total} artigos + listagem:`)
  for (const x of problemas.slice(0, 40)) console.log('  ' + x)
  process.exit(1)
}
console.log(
  `TUDO OK — listagem e ${total} artigos (${curados.length} curados, ${ks.length} Keystatic, ` +
    `${amostraWp.length} de ${wp.length} do WordPress) com conteúdo e SEO preservados`
)
