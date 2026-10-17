// Sumário do artigo, montado a partir dos próprios títulos de seção.
//
// O kit mostra uma barra lateral fixa com os `h2` do texto. O HTML que vem do
// Keystatic e do acervo WordPress não traz `id` nesses títulos, então aqui eles
// ganham um, sem que nada do texto mude. É só uma âncora a mais.

export interface ItemDeSumario {
  id: string
  texto: string
}

/** Tira as tags e devolve o texto limpo de um título. */
function soTexto(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Devolve o HTML com `id` em cada `h2` e a lista de títulos para o sumário.
 * Um `h2` que já tenha `id` mantém o seu.
 */
export function comSumario(html: string): { html: string; sumario: ItemDeSumario[] } {
  const sumario: ItemDeSumario[] = []
  let n = 0

  const saida = html.replace(
    /<h2([^>]*)>([\s\S]*?)<\/h2>/g,
    (inteiro, atributos: string, conteudo: string) => {
      const texto = soTexto(conteudo)
      if (!texto) return inteiro

      n += 1
      const idExistente = atributos.match(/\bid="([^"]+)"/)
      const id = idExistente ? idExistente[1] : `secao-${n}`
      sumario.push({ id, texto })

      return idExistente
        ? inteiro
        : `<h2${atributos} id="${id}">${conteudo}</h2>`
    }
  )

  return { html: saida, sumario }
}
