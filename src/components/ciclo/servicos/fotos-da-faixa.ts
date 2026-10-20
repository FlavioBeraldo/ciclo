// A faixa de fotos do hero: onde entram os arquivos, o alt e o ponto focal.
//
// Esta é a única fonte da faixa. O componente não aceita foto por propriedade
// e não há faixa em nenhuma rota que não esteja listada aqui — por isso ela
// não aparece nas outras 16 páginas de serviço nem em qualquer outra página.
//
// COMO ADICIONAR AS FOTOS
//
// 1. Converta cada imagem para .webp e coloque em `public/faixa/<servico>/`.
//    O arquivo precisa ter pelo menos 840px de largura (é o maior tamanho que
//    o cartão pede num monitor grande, 420px em telas de 2x). Mais que
//    1200px é peso jogado fora: o cartão nunca passa de 420px de largura.
//    A proporção do arquivo não precisa ser 4:3 — o cartão é 4:3 e a foto é
//    recortada por `object-fit: cover`, sem nenhuma distorção.
//
// 2. Acrescente uma linha na lista do serviço, com:
//
//      arquivo — o caminho a partir de `public`, começando com "/".
//      alt     — o que a foto mostra, em uma frase, para quem não a vê.
//                Descreva a cena, não o resultado: nada de número, métrica,
//                nome de cliente que não possa ser citado ou promessa.
//                Foto decorativa não existe nesta faixa: se não dá para
//                descrever, a foto não entra.
//      foco    — opcional. O ponto da imagem que precisa sobreviver ao
//                recorte, no formato de `object-position`: "50% 50%" é o
//                centro (padrão), "50% 25%" puxa para o alto (rosto no terço
//                superior), "70% 50%" puxa para a direita.
//
// 3. A faixa só aparece quando a lista tem pelo menos uma foto. Com a lista
//    vazia o componente não renderiza nada — nem moldura, nem placeholder.
//
// O build quebra, de propósito, se um arquivo não for .webp sob `/faixa/` ou
// se o alt estiver vazio: é melhor falhar na verificação do que publicar uma
// imagem sem descrição.

export interface FotoDaFaixa {
  /** Caminho a partir de `public`, começando com "/". */
  arquivo: string
  /** Descrição da cena, obrigatória. */
  alt: string
  /** `object-position` do recorte. Padrão: centro. */
  foco?: string
}

/**
 * As três rotas que o Flávio pediu em 20/10. Uma chave por slug de serviço;
 * nenhum outro slug recebe faixa.
 */
export const FAIXA_POR_SERVICO: Record<string, FotoDaFaixa[]> = {
  'gestao-creators-influenciadores': [],
  'agencia-ugc': [],
  'creative-strategy': [],
}

// Conferência de forma, no carregamento do módulo: roda no build de cada uma
// das páginas e no servidor, antes de qualquer publicação.
for (const [servico, fotos] of Object.entries(FAIXA_POR_SERVICO)) {
  const vistos = new Set<string>()
  for (const foto of fotos) {
    if (!/^\/faixa\/[\w./-]+\.webp$/.test(foto.arquivo)) {
      throw new Error(
        `fotos-da-faixa: "${foto.arquivo}" (${servico}) precisa ser um .webp dentro de /faixa/.`
      )
    }
    if (!foto.alt || foto.alt.trim().length < 10) {
      throw new Error(
        `fotos-da-faixa: a foto "${foto.arquivo}" (${servico}) está sem alt descritivo.`
      )
    }
    if (vistos.has(foto.arquivo)) {
      throw new Error(`fotos-da-faixa: "${foto.arquivo}" aparece duas vezes em ${servico}.`)
    }
    vistos.add(foto.arquivo)
  }
}

/** As fotos de um serviço, ou lista vazia — que o componente lê como "sem faixa". */
export function fotosDaFaixa(slug: string): FotoDaFaixa[] {
  return FAIXA_POR_SERVICO[slug] ?? []
}
