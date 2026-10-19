// Seções práticas acrescentadas ao fim de artigos que já existem.
//
// Três pautas do plano de SEO já tinham artigo publicado com a mesma intenção
// de busca. Em vez de criar artigo novo e competir com o próprio conteúdo, o
// que entra é um complemento no fim da matéria.
//
// O complemento vive AQUI, e não dentro do artigo, de propósito: o corpo, o
// título, a data, o autor e o slug originais ficam intocados, byte a byte, em
// `src/data/wp-posts.json`. Dá para conferir com um diff.
//
// Não há campo de "data de atualização" no sistema, nem para post do WordPress
// nem no Keystatic, então nenhuma data foi inventada.

export interface BlocoDeComplemento {
  /** Pergunta ou tema, vira um h2 no fim da matéria */
  titulo: string
  paragrafos: string[]
  /** Lista de critérios, quando ajuda a decidir */
  lista?: string[]
}

export interface ComplementoDeArtigo {
  /** Rótulo da seção, igual em todos */
  eyebrow: string
  blocos: BlocoDeComplemento[]
  /** Links contextuais: o primeiro é sempre de serviço ou consultoria */
  links: { href: string; texto: string }[]
}

export const complementosPorSlug: Record<string, ComplementoDeArtigo> = {
  // ── Pauta 1: escolher agência de marketing para e-commerce ────────────────
  'qual-e-o-melhor-momento-de-contratar-uma-agencia-de-marketing-para-meu-e-commerce': {
    eyebrow: 'Na prática',
    blocos: [
      {
        titulo: 'Como comparar propostas de agência sem olhar só o preço',
        paragrafos: [
          'Duas propostas com o mesmo valor podem descrever trabalhos muito diferentes. Antes de comparar números, vale alinhar o que cada uma entrega, quem faz o quê e como o resultado será lido.',
        ],
        lista: [
          'O que será analisado antes de qualquer execução, e com quais acessos.',
          'Quais decisões o relatório precisa apoiar, além de mostrar números.',
          'Quem produz e aprova material, e em que prazo isso acontece.',
          'O que fica sob responsabilidade da sua equipe, inclusive dados e aprovações.',
          'Como a agência trata margem e custo de aquisição, e não só receita atribuída.',
        ],
      },
      {
        titulo: 'Perguntas que ajudam a decidir',
        paragrafos: [
          'Qual é o principal desafio hoje: atrair demanda, converter quem já chega, fazer o cliente voltar ou entender os dados? A resposta muda o tipo de trabalho e também o tipo de parceiro.',
          'Sua operação tem capacidade de absorver o que será combinado? Um plano que depende de material, estoque ou atendimento que a equipe não consegue sustentar trava na execução, independentemente da agência.',
        ],
      },
    ],
    links: [
      { href: '/consultoria-para-e-commerce', texto: 'Consultoria para e-commerce' },
      { href: '/blog/7-erros-que-gestores-de-e-commerce-cometem-ao-contratar-uma-agencia-de-marketing-de-performance', texto: '7 erros ao contratar uma agência de performance' },
      { href: '/blog/como-uma-agencia-especializada-pode-evitar-a-estagnacao-de-vendas-no-e-commerce', texto: 'Como uma agência especializada evita a estagnação de vendas' },
    ],
  },

  // ── Pauta 5: Google Ads × Meta Ads ────────────────────────────────────────
  'facebook-ads-google-ads-ou-tiktok-qual-escolher-em-2025': {
    eyebrow: 'Na prática',
    blocos: [
      {
        titulo: 'Google Ads ou Meta Ads: como decidir por onde começar',
        paragrafos: [
          'A escolha costuma ser menos sobre qual canal é melhor e mais sobre qual pergunta a operação precisa responder agora. Busca atende quem já está procurando. Social apresenta a marca para quem ainda não procurou.',
          'Se existe demanda pelo seu produto sendo pesquisada hoje, a busca tende a ser o caminho mais curto até a primeira venda. Se o produto precisa ser explicado ou desejado antes da compra, o trabalho começa em outro lugar.',
        ],
        lista: [
          'Há volume de busca para a sua categoria, ou a demanda ainda precisa ser criada?',
          'O catálogo está pronto para aparecer em Shopping, com atributos e imagens corretos?',
          'Existe material criativo suficiente para sustentar um canal que consome peça rápido?',
          'Quem vai produzir e aprovar esse material, e com que frequência?',
        ],
      },
      {
        titulo: 'Por que comparar o ROAS dos dois não resolve',
        paragrafos: [
          'Cada plataforma usa regras próprias de atribuição e janelas de conversão diferentes. Dois números com o mesmo nome podem estar medindo coisas distintas, e somar os dois costuma contar a mesma venda duas vezes.',
          'A leitura mais útil combina o que as plataformas mostram com o resultado comercial do período: receita, margem, custo de aquisição e participação de clientes novos.',
        ],
      },
    ],
    links: [
      { href: '/servicos/google-ads', texto: 'Gestão de Google Ads' },
      { href: '/servicos/meta-ads', texto: 'Gestão de Meta Ads' },
      { href: '/blog/como-diversificar-meus-canais-de-midia-paga-para-o-e-commerce', texto: 'Como diversificar os canais de mídia paga' },
    ],
  },

  // ── Pauta 6: ROAS × margem ────────────────────────────────────────────────
  'markup-ou-margem-de-contribuicao-qual-usar-no-e-commerce': {
    eyebrow: 'Na prática',
    blocos: [
      {
        titulo: 'ROAS ou margem: qual indicador deve guiar a decisão de mídia',
        paragrafos: [
          'ROAS responde quanto de receita veio para cada real investido em anúncio. Margem responde quanto sobra depois dos custos do produto, do canal e da operação. São perguntas diferentes, e a segunda é a que paga as contas.',
          'Uma campanha pode ter ROAS alto e ainda assim consumir a margem, se o produto que mais vende for justamente o de menor contribuição. O contrário também acontece.',
        ],
        lista: [
          'Qual é a margem de contribuição por produto, e não só a média da loja?',
          'O custo do canal está na conta, incluindo comissão, frete e cupom?',
          'A receita atribuída pela plataforma bate com a receita registrada na operação?',
          'A decisão olha o mix de produtos vendidos ou apenas o total da campanha?',
        ],
      },
      {
        titulo: 'Como levar isso para a rotina',
        paragrafos: [
          'O caminho prático é acompanhar os dois indicadores lado a lado, no mesmo período, e separar o que depende da publicidade do que depende de preço, estoque e condição de entrega.',
        ],
      },
    ],
    links: [
      { href: '/servicos/analytics-bi', texto: 'Analytics e BI para e-commerce' },
      { href: '/blog/margem-de-contribuicao-no-e-commerce-como-calcular-e-usar-na-precificacao', texto: 'Margem de contribuição: como calcular e usar na precificação' },
      { href: '/blog/como-calcular-o-roi-verdadeiro-das-campanhas-de-e-commerce-alem-do-roas', texto: 'Como calcular o ROI verdadeiro das campanhas' },
    ],
  },
}

export function complementoDoArtigo(slug: string): ComplementoDeArtigo | null {
  return complementosPorSlug[slug] ?? null
}
