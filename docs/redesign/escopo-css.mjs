#!/usr/bin/env node
/**
 * Dá escopo ao CSS do kit de layouts usando PostCSS.
 *
 * Cada seletor passa a exigir `.ciclo2026` na raiz da página, para o design
 * novo não alcançar nada que não receba a classe — em especial o
 * /playbook-social-commerce, que fica fora do redesign.
 *
 * Tratamentos:
 *   :root, body   -> .ciclo2026        (variáveis, fundo, cor e fonte do escopo)
 *   html          -> descartado        (o projeto já define o seu)
 *   @font-face    -> descartado        (as fontes vêm do next/font)
 *   demais        -> .ciclo2026 <sel>
 *
 * Uso: node escopo-css.mjs entrada.css saida.css
 */
import { readFileSync, writeFileSync } from 'node:fs'
import postcss from 'postcss'

const ESCOPO = '.ciclo2026'

function prefixar(seletor) {
  return seletor
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      if (s === ':root' || s === 'body' || s === 'html') return ESCOPO
      if (s === '*') return `${ESCOPO} *`
      if (s.startsWith('body ')) return `${ESCOPO} ${s.slice(5)}`
      if (s.startsWith('html ')) return `${ESCOPO} ${s.slice(5)}`
      return `${ESCOPO} ${s}`
    })
    // :root e body podem colidir depois do mapeamento
    .filter((s, i, arr) => arr.indexOf(s) === i)
    .join(',')
}

const [entrada, saida] = process.argv.slice(2)
const bruto = readFileSync(entrada, 'utf8')
const raiz = postcss.parse(bruto)

let regras = 0
let descartadas = 0

raiz.walkAtRules((at) => {
  // As fontes do kit apontam para /assets do protótipo; no projeto vêm do next/font
  if (at.name === 'font-face') {
    at.remove()
    descartadas++
  }
})

raiz.walkRules((regra) => {
  // Dentro de @keyframes os "seletores" são percentuais, não seletores CSS
  const pai = regra.parent
  if (pai && pai.type === 'atrule' && /keyframes/.test(pai.name)) return
  regra.selector = prefixar(regra.selector)
  regras++
})

const resultado = raiz.toString()
writeFileSync(saida, resultado)

// Conferência: nenhuma regra pode ter sobrado fora do escopo
const forasDoEscopo = []
postcss.parse(resultado).walkRules((r) => {
  const pai = r.parent
  if (pai && pai.type === 'atrule' && /keyframes/.test(pai.name)) return
  for (const s of r.selectors) if (!s.startsWith(ESCOPO)) forasDoEscopo.push(s)
})

console.log(`${entrada} -> ${saida}`)
console.log(`  ${regras} regras com escopo, ${descartadas} @font-face descartados`)
console.log(`  seletores fora do escopo: ${forasDoEscopo.length}`)
if (forasDoEscopo.length) {
  console.log('  ' + forasDoEscopo.slice(0, 10).join('\n  '))
  process.exit(1)
}
