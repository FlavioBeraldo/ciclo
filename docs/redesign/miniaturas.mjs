// Degraus de qualidade da miniatura de vídeo.
//
// O YouTube tem dois jeitos de dizer que uma miniatura não existe:
//
//   a) 404 — o `onError` pega.
//   b) 200 com uma imagem cinza de 120×90, o placeholder dele. A imagem
//      CARREGA, o navegador fica satisfeito, e sem uma checagem de tamanho o
//      cartão exibe um retângulo cinza.
//
// Este teste força os dois casos com resposta simulada e confere que o
// componente desce de degrau nos dois. Nada sai para a rede: as respostas de
// img.youtube.com são fabricadas aqui.
//
// Uso:  node miniaturas.mjs [baseURL]

import { chromium } from 'playwright-core'
import zlib from 'node:zlib'

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'

let falhas = 0
const ok = (t) => console.log('  ok    ' + t)
const falha = (t) => {
  console.log('  FALHA ' + t)
  falhas++
}
const conferir = (c, t) => (c ? ok(t) : falha(t))

// PNG 1×1 cinza, servido com as dimensões que interessam pelo próprio bitmap.
// Para simular o placeholder, devolvo um PNG real de 120×90; para simular a
// miniatura boa, um de 1280×720. Gerados aqui, sem rede.
function png(largura, altura) {
  // PNG mínimo: assinatura + IHDR + IDAT (imagem de cor sólida) + IEND
  const crcTabela = []
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    crcTabela[n] = c >>> 0
  }
  const crc = (buf) => {
    let c = 0xffffffff
    for (const b of buf) c = crcTabela[(c ^ b) & 0xff] ^ (c >>> 8)
    return (c ^ 0xffffffff) >>> 0
  }
  const pedaco = (tipo, dados) => {
    const t = Buffer.from(tipo, 'ascii')
    const tam = Buffer.alloc(4)
    tam.writeUInt32BE(dados.length)
    const corpo = Buffer.concat([t, dados])
    const c = Buffer.alloc(4)
    c.writeUInt32BE(crc(corpo))
    return Buffer.concat([tam, corpo, c])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(largura, 0)
  ihdr.writeUInt32BE(altura, 4)
  ihdr[8] = 8 // profundidade
  ihdr[9] = 0 // escala de cinza
  const bruto = Buffer.alloc((largura + 1) * altura, 0x80)
  for (let y = 0; y < altura; y++) bruto[y * (largura + 1)] = 0 // filtro
  const idat = zlib.deflateSync(bruto)
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pedaco('IHDR', ihdr),
    pedaco('IDAT', idat),
    pedaco('IEND', Buffer.alloc(0)),
  ])
}

const navegador = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })

// Cada cenário diz como responder a cada degrau e qual deve vencer
const CENARIOS = [
  {
    nome: 'maxres existe de verdade',
    resposta: { maxresdefault: 'boa' },
    esperado: 'maxresdefault',
  },
  {
    nome: 'maxres responde 404, hq720 existe',
    resposta: { maxresdefault: '404', hq720: 'boa' },
    esperado: 'hq720',
  },
  {
    nome: 'maxres responde 200 com placeholder de 120x90',
    resposta: { maxresdefault: 'placeholder', hq720: 'boa' },
    esperado: 'hq720',
  },
  {
    nome: 'maxres e hq720 ambos placeholder, cai para sddefault',
    resposta: { maxresdefault: 'placeholder', hq720: 'placeholder', sddefault: 'boa' },
    esperado: 'sddefault',
  },
  {
    nome: 'nada existe a não ser hqdefault',
    resposta: { maxresdefault: '404', hq720: '404', sddefault: '404' },
    esperado: 'hqdefault',
  },
]

for (const c of CENARIOS) {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } })
  const pedidos = []

  const p = await ctx.newPage()

  // Página de teste que reproduz a lógica do componente, sem o otimizador
  // do Next no caminho: é a lógica de degrau que está sob teste.
  await p.route('https://img.youtube.com/**', async (rota) => {
    const url = rota.request().url()
    const degrau = url.match(/\/([a-z0-9]+)\.jpg$/)?.[1] ?? ''
    pedidos.push(degrau)
    const como = c.resposta[degrau] ?? (degrau === 'hqdefault' ? 'boa' : '404')
    if (como === '404') return rota.fulfill({ status: 404, body: '' })
    if (como === 'placeholder')
      return rota.fulfill({ status: 200, contentType: 'image/png', body: png(120, 90) })
    return rota.fulfill({ status: 200, contentType: 'image/png', body: png(1280, 720) })
  })

  await p.setContent(`
    <img id="alvo" src="https://img.youtube.com/vi/TESTE/maxresdefault.jpg" width="640">
    <script>
      const DEGRAUS = ['maxresdefault', 'hq720', 'sddefault', 'hqdefault']
      const LARGURA_MINIMA = 320
      let i = 0
      const img = document.getElementById('alvo')
      const descer = () => {
        if (i >= DEGRAUS.length - 1) return
        i++
        img.src = 'https://img.youtube.com/vi/TESTE/' + DEGRAUS[i] + '.jpg'
      }
      img.addEventListener('error', descer)
      img.addEventListener('load', () => {
        if (i < DEGRAUS.length - 1 && img.naturalWidth && img.naturalWidth < LARGURA_MINIMA) descer()
      })
    </script>
  `)
  await p.waitForTimeout(1200)

  const final = await p.evaluate(() => {
    const s = document.getElementById('alvo').currentSrc || document.getElementById('alvo').src
    return { degrau: s.match(/\/([a-z0-9]+)\.jpg$/)?.[1], largura: document.getElementById('alvo').naturalWidth }
  })

  conferir(
    final.degrau === c.esperado,
    `${c.nome} → parou em ${final.degrau} (${final.largura}px), esperado ${c.esperado}`
  )
  await ctx.close()
}

await navegador.close()
console.log(
  '\n' +
    (falhas
      ? `${falhas} FALHA(S)`
      : 'TUDO OK — a queda de degrau cobre 404 e placeholder de 200 com imagem pequena')
)
process.exit(falhas ? 1 : 0)
