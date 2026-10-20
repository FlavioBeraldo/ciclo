// A faixa de fotos do hero: onde entram os arquivos, o alt e o ponto focal.
//
// Esta é a única fonte da faixa. O componente não aceita foto por propriedade
// e não há faixa em nenhuma rota que não esteja listada aqui — por isso ela
// não aparece nas outras 16 páginas de serviço nem em qualquer outra página.
//
// COMO ADICIONAR AS FOTOS
//
// 1. Converta cada imagem para .webp e coloque em `public/faixa/<servico>/`.
//    O acervo é vertical, 9:16, que é a proporção do cartão: 720x1280 é o
//    tamanho dos originais e cobre com folga o maior cartão (190px num
//    monitor grande, 380px em tela de 2x). Duas peças vieram em 360x640 e
//    ficam assim mesmo — o otimizador nunca amplia um arquivo, e ampliar à
//    mão só inventaria pixel.
//    Foto de outra proporção não quebra nada: o cartão continua 9:16 e a
//    imagem é recortada por `object-fit: cover`, nunca esticada. Mas aí vale
//    conferir o recorte e, se precisar, acertar o `foco`.
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
  /**
   * Vídeo da mesma cena, opcional. Quando existe, o cartão toca o vídeo e a
   * imagem de cima vira o cartaz: é ela que aparece antes de o vídeo chegar,
   * se o vídeo falhar e sempre que o sistema pedir menos movimento.
   */
  video?: string
}

/**
 * As oito peças de UGC, na ordem definida para a faixa. A mesma lista serve
 * as duas rotas de UGC — é o mesmo acervo, e repetir os arquivos no disco só
 * duplicaria peso.
 */
const UGC: FotoDaFaixa[] = [
  {
    arquivo: '/faixa/ugc/ugc.webp',
    video: '/faixa/ugc/ugc.webm',
    alt: 'Criador de conteúdo gravando num píer de madeira à beira de um rio, no fim da tarde.',
  },
  {
    arquivo: '/faixa/ugc/ugc1.webp',
    video: '/faixa/ugc/ugc1.webm',
    alt: 'Criadora falando para a câmera do celular dentro de casa, em plano de rosto e ombros.',
  },
  {
    arquivo: '/faixa/ugc/ugc2.webp',
    video: '/faixa/ugc/ugc2.webm',
    alt: 'Criadora mostrando um frasco de cosmético ao lado do rosto, em luz natural.',
  },
  {
    arquivo: '/faixa/ugc/ugc3.webp',
    video: '/faixa/ugc/ugc3.webm',
    alt: 'Criadora ao ar livre, agachada numa calçada, com um sachê de suplemento numa das mãos e um copo de água na outra.',
  },
  {
    arquivo: '/faixa/ugc/ugc4.webp',
    video: '/faixa/ugc/ugc4.webm',
    alt: 'Close das mãos de uma criadora partindo um ovo de chocolate recheado diante da câmera.',
  },
  {
    arquivo: '/faixa/ugc/ugc5.webp',
    video: '/faixa/ugc/ugc5.webm',
    alt: 'Criadora sorrindo com três barras de proteína em leque nas mãos.',
  },
  {
    arquivo: '/faixa/ugc/ugc6.webp',
    video: '/faixa/ugc/ugc6.webm',
    alt: 'Criadora de vestido longo azul num provador de loja, em plano inteiro.',
  },
  {
    arquivo: '/faixa/ugc/ugc7.webp',
    video: '/faixa/ugc/ugc7.webm',
    alt: 'Câmera de ação montada em tripé com microfone e luz, pronta para a gravação.',
  },
]

/**
 * As três rotas que recebem a faixa. Uma chave por slug de serviço; nenhum
 * outro slug recebe faixa.
 */
export const FAIXA_POR_SERVICO: Record<string, FotoDaFaixa[]> = {
  'gestao-creators-influenciadores': UGC,
  'agencia-ugc': UGC,
  'creative-strategy': [
    {
      arquivo: '/faixa/creative-strategy/estrategiacriativa1.webp',
      video: '/faixa/creative-strategy/estrategiacriativa1.webm',
      alt: 'Celular erguido à frente de uma modelo, enquadrando o rosto dela na tela enquanto o corpo aparece atrás.',
    },
    {
      arquivo: '/faixa/creative-strategy/estrategiacriativa2.webp',
      video: '/faixa/creative-strategy/estrategiacriativa2.webm',
      alt: 'Página de produtos de um e-commerce projetada em tamanho grande sobre a fachada de uma loja, com uma cliente passando em frente.',
    },
    {
      arquivo: '/faixa/creative-strategy/estrategiacriativa3.webp',
      video: '/faixa/creative-strategy/estrategiacriativa3.webm',
      alt: 'Tela dividida numa cozinha, comparando duas rotinas lado a lado.',
    },
    {
      arquivo: '/faixa/creative-strategy/estrategiacriativa4.webp',
      video: '/faixa/creative-strategy/estrategiacriativa4.webm',
      alt: 'Criador numa cozinha mostrando para a câmera um pacote de snack de carne.',
    },
    {
      arquivo: '/faixa/creative-strategy/estrategiacriative5.webp',
      video: '/faixa/creative-strategy/estrategiacriative5.webm',
      alt: 'Modelo agachada ao lado de uma bolsa caída, com os produtos de beleza espalhados pelo chão.',
    },
    {
      arquivo: '/faixa/creative-strategy/estrategiacriativa08.webp',
      video: '/faixa/creative-strategy/estrategiacriativa08.webm',
      alt: 'Mão segurando uma câmera de ação diante de uma fotografia em preto e branco numa parede de galeria.',
    },
  ],
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
    if (foto.video && !/^\/faixa\/[\w./-]+\.webm$/.test(foto.video)) {
      throw new Error(
        `fotos-da-faixa: "${foto.video}" (${servico}) precisa ser um .webm dentro de /faixa/.`
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
