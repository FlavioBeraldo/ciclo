// Os cases da Ciclo, no formato que as páginas de serviço e de solução usam.
//
// Antes, cada serviço trazia quatro métricas e três "casos práticos" com nome
// genérico ("E-commerce de eletrônicos", "Moda feminina") e números próprios.
// Eram 68 métricas e 51 casos sem origem — texto gerado para preencher o
// template, não resultado de projeto. Saíram.
//
// No lugar entram os MESMOS cases que a home já publica, por pedido explícito
// do Flávio em 19/10/2026. Nada é recalculado, nada é inventado e nada é
// digitado de novo: tudo vem de `./cases`, que é a fonte única, e qualquer
// ajuste lá aparece aqui e na home ao mesmo tempo.
//
// LIMITE, registrado porque importa: este módulo reutiliza conteúdo que já
// estava aprovado e publicado antes do redesign (`src/lib/cases.ts` é byte a
// byte igual à base de produção anterior). A autorização editorial para
// reutilizá-lo é o pedido do Flávio. **Isso não é, e não pretende ser,
// verificação dos valores** — nenhuma auditoria de dado de cliente foi feita,
// e não cabia a esta tarefa fazer. Ver docs/redesign/CONTEUDO-SEO.md.

import { cases } from './cases'

/**
 * Um indicador por case, escolhido entre os que o próprio case já tem.
 *
 * Quatro marcas, quatro indicadores, na ordem em que a home os apresenta — é
 * o que preenche as quatro células do bloco de resultados sem mudar a
 * quantidade de cards nem as classes.
 */
const INDICADOR_POR_MARCA: Record<string, string> = {
  'Mamô Brasil': 'Vendas YoY',
  'GoPro Brasil': 'Vendas YoY',
  'Jack Links': 'Branded Search YoY',
  Gringa: 'Taxa de Recompra YoY',
}

/** Nome curto, para o rótulo não estourar a célula. */
const NOME_CURTO: Record<string, string> = {
  'Mamô Brasil': 'Mamô',
  'GoPro Brasil': 'GoPro',
  'Jack Links': 'Jack Links',
  Gringa: 'Gringa',
}

export interface ResultadoDeCase {
  metric: string
  label: string
}

/**
 * Os quatro resultados, com a marca identificada no rótulo.
 *
 * Se alguém mexer no nome de um indicador em `cases.ts`, isto quebra o build
 * em vez de publicar célula vazia — é de propósito.
 */
export const resultadosDosCases: ResultadoDeCase[] = cases.map((caso) => {
  const nomeIndicador = INDICADOR_POR_MARCA[caso.brand]
  const indicador = caso.metrics.find((m) => m.label === nomeIndicador)
  if (!indicador) {
    throw new Error(
      `cases-conteudo: o case "${caso.brand}" não tem mais o indicador "${nomeIndicador}". ` +
        'Atualize INDICADOR_POR_MARCA em src/lib/cases-conteudo.ts.'
    )
  }
  return {
    metric: indicador.value,
    label: `${NOME_CURTO[caso.brand] ?? caso.brand} · ${indicador.label}`,
  }
})

// A ressalva de escopo que acompanhava o bloco de indicadores saiu junto com
// ele em 19/10: sem número na página, não há o que ressalvar. Se o bloco de
// indicadores voltar, a frase volta com ele.

export interface NarrativaDeCase {
  title: string
  description: string
  highlight: string
}

/**
 * Três narrativas curtas, de desafio e ação, sem nenhum número.
 *
 * Os números ficam só no bloco de resultados: repetir os mesmos valores aqui
 * embaixo seria dizer duas vezes a mesma coisa. E a ação é descrita como a
 * atuação da Ciclo no projeto, sem sugerir que o resultado veio do serviço
 * desta página — a maioria desses projetos é full funnel.
 */
export const narrativasDosCases: NarrativaDeCase[] = cases.slice(0, 3).map((caso) => ({
  title: NOME_CURTO[caso.brand] ?? caso.brand,
  description: `${caso.challenge} ${caso.action}`,
  highlight: caso.category,
}))

/** Contexto do bloco de cases, sem linguagem de auditoria. */
export const CONTEXTO_CASES = 'Conheça marcas que fazem parte da trajetória da Ciclo.'

/**
 * Mesmos quatro resultados, no formato das páginas de solução, que chamam o
 * segundo campo de `description` em vez de `label`. Mesma fonte, mesmo valor.
 */
export const resultadosDosCasesSolucao = resultadosDosCases.map(({ metric, label }) => ({
  metric,
  description: label,
}))
