#!/usr/bin/env node
/**
 * Extrai os diagramas das páginas de serviço do kit de layouts.
 *
 * Cada página traz dois capítulos ilustrados ("A lógica" e "O ciclo"), com SVG
 * gerado pelo build do kit a partir de `src/service-visuals.json`. Em vez de
 * reimplementar o gerador, leio o HTML já aprovado e guardo o resultado.
 *
 * Uso: node extrair-diagramas.mjs <dir do kit> <arquivo de saída .ts>
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const [kit, saida] = process.argv.slice(2)
const dir = join(kit, 'dist', 'servicos')

function pegar(html, re) {
  const m = html.match(re)
  return m ? m[1].trim() : null
}

const dados = {}
const simbolos = {}
for (const slug of readdirSync(dir).sort()) {
  const html = readFileSync(join(dir, slug, 'index.html'), 'utf8')

  // O ícone do serviço: aparece no símbolo do hero e, idêntico, nos cartões
  // de "Continue explorando" das outras páginas
  const simbolo = pegar(html, /<div class="symbol-logo">([\s\S]*?)<\/div>/)
  if (simbolo) simbolos[slug] = simbolo

  const bloco = html.match(/<div class="service-explanations">([\s\S]*?)<\/div><\/div><\/section>/)
  if (!bloco) { console.log('sem diagramas: ' + slug); continue }

  const capitulos = [...bloco[1].matchAll(/<article class="visual-chapter">([\s\S]*?)<\/article>/g)]
  dados[slug] = capitulos.map((c) => {
    const t = c[1]
    return {
      numero: pegar(t, /<span class="chapter-number">([^<]*)<\/span>/),
      titulo: pegar(t, /<h3>([\s\S]*?)<\/h3>/),
      texto: pegar(t, /<p>([\s\S]*?)<\/p>/),
      chave: pegar(t, /<div class="visual-key">([\s\S]*?)<\/div>/),
      legenda: pegar(t, /<figcaption>([\s\S]*?)<\/figcaption>/),
      svg: pegar(t, /(<svg class="explanation-svg"[\s\S]*?<\/svg>)/) ?? '',
    }
  })
}

// As quatro soluções também têm símbolo no hero, mas não têm capítulos
const dirSolucoes = join(kit, 'dist', 'solucoes')
const simbolosSolucao = {}
for (const slug of readdirSync(dirSolucoes).sort()) {
  const html = readFileSync(join(dirSolucoes, slug, 'index.html'), 'utf8')
  const s = pegar(html, /<div class="symbol-logo">([\s\S]*?)<\/div>/)
  if (s) simbolosSolucao[slug] = s
}

const cabecalho = `// GERADO por docs/redesign/extrair-diagramas.mjs a partir do kit de layouts.
// Não editar à mão: rode o script de novo se o kit mudar.
//
// São os dois capítulos ilustrados de cada página de serviço — "A lógica", que
// é própria de cada canal, e "O ciclo", que repete a mesma estrutura com os
// rótulos do serviço. O traçado dos SVG veio do HTML aprovado, sem alteração.

export interface CapituloVisual {
  numero: string
  titulo: string
  texto: string
  chave: string
  legenda: string
  /** SVG do kit, HTML literal. Entra via dangerouslySetInnerHTML, sem
   *  conversão para JSX: as classes e os ids internos são os mesmos que o
   *  CSS de explicações espera. */
  svg: string
}

export const diagramasPorServico: Record<string, CapituloVisual[]> = `

const rodape = `

/** Ícone de cada serviço: símbolo do hero e, igual, o dos cartões de "Continue
 *  explorando". HTML literal, pelo mesmo motivo dos diagramas. */
export const simboloPorServico: Record<string, string> = `

const rodape2 = `

/** Mesma coisa para as quatro soluções. */
export const simboloPorSolucao: Record<string, string> = `

writeFileSync(
  saida,
  cabecalho + JSON.stringify(dados, null, 2) +
  rodape + JSON.stringify(simbolos, null, 2) +
  rodape2 + JSON.stringify(simbolosSolucao, null, 2) + '\n'
)
console.log(
  Object.keys(dados).length + ' serviços, ' + Object.values(dados).flat().length +
  ' capítulos, ' + Object.keys(simbolos).length + ' símbolos de serviço, ' +
  Object.keys(simbolosSolucao).length + ' de solução'
)
