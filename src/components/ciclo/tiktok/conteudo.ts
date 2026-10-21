// Conteúdo da página /tiktok-shop.
//
// Tudo aqui é o texto que já estava no ar, palavra por palavra. O redesign
// trocou a casca; nenhuma frase, número ou pergunta foi reescrita, cortada ou
// inventada. O que mudou foi a ORGANIZAÇÃO: os cinco serviços que viviam numa
// grade de cartões iguais passam a ser quatro frentes de uma operação só,
// conforme a direção do Flávio.

export const HERO = {
  selo: 'TikTok Shop — Discovery Commerce',
  titulo: 'A era do Discovery Commerce chegou. Sua marca está pronta?',
  lead:
    'A Ciclo E-commerce é o seu parceiro de Full Funnel Marketing no TikTok Shop — ' +
    'da configuração à escala, cuidamos de tudo para você vender mais.',
  ctaPrimario: 'Quero acelerar minhas vendas',
  ctaSecundario: 'Entender como funciona',
}

/**
 * Os três prints da Central do Vendedor que o Flávio autorizou em 21/10, no
 * lugar dos três números de mercado que abriam a página.
 *
 * Os três são a MESMA operação, no MESMO período: são três telas do mesmo
 * painel, não três clientes. Por isso os valores não se somam, e a página diz
 * isso em uma linha — sem essa frase, três cartões lado a lado se leem como
 * três cases.
 *
 * Nenhum número foi digitado aqui: o que está escrito na página são os
 * rótulos da própria ferramenta e o período. Os valores ficam onde sempre
 * estiveram, dentro da imagem. A descrição alternativa repete o que a tela
 * mostra, para quem não enxerga o print.
 *
 * As dimensões são as dos arquivos originais, conferidas na importação, e
 * existem para o navegador reservar o espaço antes de a imagem chegar.
 */
export const RESULTADOS = {
  eyebrow: 'Nossos resultados',
  titulo: 'Uma semana de operação, vista por dentro',
  periodo: '15 a 21 de outubro de 2026',
  nota:
    'Três telas da mesma operação, no mesmo período — recortes diferentes do ' +
    'mesmo painel, não operações distintas.',
  prints: [
    {
      arquivo: '/tiktok-resultados/case-tiktok-min.jpg',
      largura: 1508,
      altura: 1043,
      rotulo: 'Visão geral',
      alt:
        'Central do Vendedor do TikTok Shop, aba Visão geral, período de 15 a 21 de outubro ' +
        'de 2026: GMV de R$ 286.419,80, 3.189 SKUs pedidos e 2.415 compradores, com o ' +
        'gráfico de GMV por dia.',
    },
    {
      arquivo: '/tiktok-resultados/case-tiktok2-min.jpg',
      largura: 1448,
      altura: 1086,
      rotulo: 'Vendas',
      alt:
        'Central do Vendedor do TikTok Shop, aba Vendas, mesmo período: vendas brutas de ' +
        'R$ 319.842,70, GMV de R$ 286.419,80, 2.736 pedidos, 4.062 unidades vendidas, com a ' +
        'distribuição entre LIVE, vídeo e cartão de produto.',
    },
    {
      arquivo: '/tiktok-resultados/case-tiktkok3-min.jpg',
      largura: 1429,
      altura: 1100,
      rotulo: 'Distribuição',
      alt:
        'Central do Vendedor do TikTok Shop, mesma visão de vendas do período, com o ' +
        'gráfico de distribuição por dia da semana entre LIVE, vídeo e cartão de produto.',
    },
  ],
}

/** Os três pilares da plataforma, da seção "Entenda o ecossistema". */
export const PILARES = [
  {
    titulo: 'Plataforma de Entretenimento',
    texto:
      'Bilhões de vídeos consumidos diariamente. O conteúdo é rei e gera descoberta orgânica de produtos.',
  },
  {
    titulo: 'Plataforma de Anúncios',
    texto:
      'TikTok Ads com segmentação avançada e formatos nativos que se integram ao feed sem interromper a experiência.',
  },
  {
    titulo: 'TikTok Shop',
    texto:
      'O marketplace nativo dentro do app. Da descoberta à compra sem sair da plataforma — zero atrito.',
  },
]

/**
 * As quatro frentes da operação, como o Flávio desenhou: um núcleo no centro e
 * as frentes conectadas em volta. Os entregáveis de cada uma são os mesmos
 * que já estavam nos cartões de serviço e no "Start & Ongoing" do roadmap.
 */
export const FRENTES = [
  {
    id: 'afiliacao-creators',
    numero: '01',
    titulo: 'Afiliação e creators',
    servicos: [
      {
        titulo: 'Campanhas com Creators',
        texto:
          'Selecionamos creators com fit para o seu negócio, cocriamos as campanhas e monitoramos a performance em tempo real.',
        entregaveis: [
          'Seleção com fit para o negócio',
          'Monitoramento de performance',
          'Co-criação das campanhas',
        ],
      },
      {
        titulo: 'Gestão de Programa de Afiliação',
        texto:
          'Criamos o plano de afiliação com base nas estratégias do negócio e fazemos a gestão completa do programa.',
        entregaveis: ['Plano estratégico de afiliação', 'Gestão contínua do programa'],
      },
    ],
  },
  {
    id: 'operacao-da-loja',
    numero: '02',
    titulo: 'Operação da loja',
    servicos: [
      {
        titulo: 'Criação e Integração do TikTok Shop',
        texto:
          'Configuramos toda a estrutura da sua loja no TikTok Shop e integramos com os principais conectores, ERPs e gerenciadores do mercado.',
        entregaveis: ['Conectores', 'ERPs', 'Gerenciadores'],
      },
      {
        titulo: 'Criação e Gestão de Promoções',
        texto:
          'Desenvolvemos promoções e campanhas estratégicas para maximizar o GMV e a visibilidade dos seus produtos.',
        entregaveis: ['Criação de promoções', 'Criação de campanhas'],
      },
    ],
  },
  {
    id: 'conteudo-e-lives',
    numero: '03',
    titulo: 'Conteúdo e lives',
    servicos: [
      {
        titulo: 'Conteúdo, lives e campanhas',
        texto:
          'Creators autênticos geram confiança. Confiança gera conversão. E conversão gera escala para o seu negócio. É a rotina de conteúdo que sustenta a operação depois que a loja está de pé.',
        entregaveis: ['Criação de conteúdo', 'Live Commerce', 'Participação em campanhas'],
      },
    ],
  },
  {
    id: 'midia',
    numero: '04',
    titulo: 'Mídia',
    servicos: [
      {
        titulo: 'Gestão de Anúncios GMV Max',
        texto:
          'Anúncios para potencializar a divulgação dos seus produtos — similar a anunciar no Mercado Livre e Shopee, mas dentro do TikTok.',
        entregaveis: ['GMV Max Ads', 'Otimização contínua'],
      },
    ],
  },
]

/** Comparação de conversão e o caminho da compra dentro do app. */
export const CONVERSAO = {
  eyebrow: 'O que torna o TikTok Shop diferente?',
  titulo: 'Conversão até 24x maior que o e-commerce tradicional',
  texto:
    'A taxa de conversão do TikTok Shop pode atingir até 40%, enquanto o e-commerce brasileiro gira em torno de 1,65%. O segredo é a compra sem atrito: o usuário descobre, se interessa e compra sem sair do app.',
  barras: [
    { rotulo: 'TikTok Shop', valor: '40%', proporcao: 100 },
    { rotulo: 'E-commerce Brasil (média)', valor: '1,65%', proporcao: 4 },
  ],
  jornada: [
    { numero: '01', rotulo: 'Assiste ao vídeo' },
    { numero: '02', rotulo: 'Descobre o produto' },
    { numero: '03', rotulo: 'Adiciona ao carrinho' },
    { numero: '04', rotulo: 'Compra sem sair do app' },
  ],
}

export const NUMEROS = {
  eyebrow: 'Os números não mentem',
  titulo: 'Big Numbers do TikTok Shop',
  lead: 'Os números que validam o TikTok Shop como meio de alavancar as vendas da sua marca.',
  destaque: { valor: 'R$ 1,2 bi', rotulo: 'GMV fechado em 2025 no Brasil' },
  cartoes: [
    { valor: 'R$ 39 bi', rotulo: 'Potencial movimentado até 2028', fonte: 'Estudo Santander' },
    {
      valor: '5% a 9%',
      rotulo: 'Do e-commerce brasileiro nos primeiros 3 anos',
      fonte: 'Projeção Santander',
    },
    { valor: '40%', rotulo: 'Taxa de conversão máxima (vs 1,65% do mercado)', fonte: null },
  ],
  nota: {
    titulo: 'A lógica do TikTok Shop é colaboração e criação de conteúdo',
    texto:
      'Creators autênticos geram confiança. Confiança gera conversão. E conversão gera escala para o seu negócio.',
  },
}

export const ROADMAP = {
  eyebrow: 'Como funciona na prática',
  titulo: 'Roadmap do TikTok Shop',
  lead: 'Passo a passo para iniciar e escalar as vendas no TikTok Shop.',
  passos: [
    {
      numero: '01',
      titulo: 'Cadastro e aprovação',
      texto: 'Fazemos o cadastro completo da sua marca e garantimos a aprovação no TikTok Shop.',
    },
    {
      numero: '02',
      titulo: 'Produtos, ofertas e comissionamento',
      texto:
        'Criamos e configuramos seus produtos, ofertas especiais e programa de comissionamento para criadores.',
    },
    {
      numero: '03',
      titulo: 'Integração do catálogo',
      texto: 'Integramos o seu catálogo de produtos via integrador ou ERP de forma rápida e eficiente.',
    },
    {
      numero: '04',
      titulo: 'Start & Ongoing',
      texto: null,
      lista: [
        'Gestão de creators',
        'Live Commerce',
        'Participação em campanhas',
        'Criação de conteúdo',
        'GMV Ads',
      ],
    },
  ],
}

/**
 * As seis perguntas, exatamente como estavam na página. O schema FAQPage em
 * page.tsx tem respostas um pouco mais longas em três delas; as duas versões
 * já conviviam assim antes do redesign e continuam como estavam.
 */
export const FAQ = [
  {
    q: 'O que é TikTok Shop e como funciona para e-commerces?',
    a: 'TikTok Shop é o canal de social commerce do TikTok que permite vender diretamente dentro da plataforma. Para e-commerces, funciona como uma loja integrada ao feed de conteúdo: os produtos aparecem em vídeos, lives e vitrine da marca, e o usuário compra sem sair do app. É o modelo de Discovery Commerce — a venda acontece antes que o consumidor perceba que estava comprando.',
  },
  {
    q: 'Quais marcas e e-commerces se beneficiam mais do TikTok Shop?',
    a: 'Marcas de beleza, moda, saúde, casa e alimentação têm os melhores resultados, especialmente as que vendem produtos com apelo visual ou que se beneficiam de demonstração em vídeo. E-commerces com ticket médio entre R$30 e R$300 e que já possuem presença digital tendem a escalar mais rápido.',
  },
  {
    q: 'A Ciclo E-commerce faz toda a gestão do TikTok Shop?',
    a: 'Sim. A Ciclo oferece gestão completa: setup e integração da loja, curadoria e gestão de creators e afiliados, criação de conteúdo otimizado para conversão, campanhas GMV Max, TikTok Ads e análise contínua de performance. A operação é gerenciada de ponta a ponta — seu time não precisa aprender a plataforma do zero.',
  },
  {
    q: 'Qual a diferença entre TikTok Ads e TikTok Shop?',
    a: 'TikTok Ads é a plataforma de mídia paga para anúncios. TikTok Shop é o canal de social commerce nativo onde os produtos são vendidos dentro do app via conteúdo orgânico, lives e creators. A maior potência está na combinação: TikTok Shop como canal de vendas e TikTok Ads (especialmente GMV Max) para escalar o volume de pedidos.',
  },
  {
    q: 'Como funciona a gestão de creators e afiliados no TikTok Shop?',
    a: 'A Ciclo identifica creators alinhados ao seu nicho via TikTok Creator Marketplace, negocia parcerias, orienta a criação de conteúdo e acompanha a performance de cada creator. Para afiliados, estruturamos o programa de comissões, recrutamos os criadores certos e gerenciamos o relacionamento contínuo.',
  },
  {
    q: 'Quanto tempo leva para ter resultados no TikTok Shop?',
    a: 'Os primeiros resultados aparecem nas primeiras 4 a 8 semanas — fase de setup, integração e onboarding de creators. A escala consistente costuma acontecer entre 2 e 4 meses, quando já há dados suficientes de creators, produtos e formatos para otimizar a operação.',
  },
  {
    q: 'O que avaliar antes de contratar uma agência de TikTok Shop?',
    a: 'Entenda como o trabalho conecta catálogo, conteúdo, creators e operação da loja. Confirme as responsabilidades por estoque, pedidos, comissões e atendimento, além da forma de acompanhar as vendas. O plano precisa considerar o produto, a capacidade da operação e a margem disponível.',
  },
]

export const CTA_FINAL = {
  eyebrow: 'Pronto para começar?',
  titulo: 'Acelere suas vendas no TikTok Shop agora mesmo',
  texto:
    'Fale com nossos especialistas e descubra como a Ciclo E-commerce pode transformar o TikTok Shop em um canal de vendas previsível para a sua marca.',
  botao: 'Quero uma proposta',
}
