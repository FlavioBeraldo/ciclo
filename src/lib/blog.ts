export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  authorRole: string
  date: string
  readTime: number
  coverGradient: string
  content: BlogSection[]
}

export interface BlogSection {
  type: 'paragraph' | 'heading' | 'subheading' | 'list' | 'highlight' | 'divider'
  text?: string
  items?: string[]
}

export const posts: BlogPost[] = [
  {
    slug: 'full-funnel-marketing-por-que-sua-marca-perde-dinheiro',
    title: 'Full Funnel Marketing: por que sua marca está perdendo dinheiro sem ele',
    excerpt:
      'Investir só em conversão é como tentar encher um balde furado. Entenda como o Full Funnel cria crescimento previsível do topo ao fundo.',
    category: 'Estratégia',
    author: 'Time Ciclo',
    authorRole: 'Especialistas em Full Funnel Marketing',
    date: '2025-05-10',
    readTime: 7,
    coverGradient: 'from-[#1a0030] via-[#0d0020] to-[#050505]',
    content: [
      {
        type: 'paragraph',
        text: 'A maioria das marcas de e-commerce comete o mesmo erro: concentra quase todo o orçamento de marketing no fundo do funil — remarketing, campanhas de conversão, ofertas agressivas — e depois se pergunta por que o CAC só sobe.',
      },
      {
        type: 'heading',
        text: 'O problema da obsessão por conversão',
      },
      {
        type: 'paragraph',
        text: 'Quando você investe apenas no momento da conversão, está competindo pelo mesmo cliente que já está pronto para comprar — o mesmo cliente que seus concorrentes também estão disputando. O resultado é um leilão eterno que infla o custo por clique e reduz a margem.',
      },
      {
        type: 'highlight',
        text: 'Marcas que constroem demanda no topo do funil pagam menos por cada conversão no fundo, porque chegam como primeira escolha — não como mais uma opção.',
      },
      {
        type: 'heading',
        text: 'Os três ciclos que geram crescimento sustentável',
      },
      {
        type: 'subheading',
        text: '1. Criação de Demanda',
      },
      {
        type: 'paragraph',
        text: 'É a construção de marca, relevância e preferência. Sem isso, você depende eternamente de capturar demanda que outra marca criou. Social, conteúdo, vídeo e influência são os principais canais aqui.',
      },
      {
        type: 'subheading',
        text: '2. Captação de Demanda',
      },
      {
        type: 'paragraph',
        text: 'É onde a performance entra. Mas com uma diferença: quem já criou demanda converte mais barato. Campanhas de Search, Shopping e retargeting performam melhor quando o cliente já te conhece.',
      },
      {
        type: 'subheading',
        text: '3. Expansão de Demanda',
      },
      {
        type: 'paragraph',
        text: 'É a área mais negligenciada. CRM, pós-venda, recompra e upsell são responsáveis por aumentar o LTV sem elevar o CAC. Um cliente que compra três vezes custa o mesmo para adquirir que um que compra uma vez.',
      },
      {
        type: 'heading',
        text: 'Como mensurar se seu funil está equilibrado',
      },
      {
        type: 'list',
        items: [
          'Qual porcentagem do seu budget vai para cada etapa do funil?',
          'Seu CAC está caindo ou subindo trimestre a trimestre?',
          'Qual é a taxa de recompra dos seus clientes nos primeiros 90 dias?',
          'Quanto da sua receita vem de clientes novos versus recorrentes?',
          'Você consegue prever a receita do próximo mês com razoável precisão?',
        ],
      },
      {
        type: 'paragraph',
        text: 'Se o seu budget é mais de 70% performance de conversão, você tem um funil desequilibrado. Isso não é julgamento — é o padrão do mercado. E exatamente por isso quem equilibra o funil se diferencia.',
      },
      {
        type: 'highlight',
        text: 'Nos clientes da Ciclo que implementaram a estratégia Full Funnel completa, a redução média de CAC foi de 35% em 12 meses, com aumento de 2,7x no LTV.',
      },
    ],
  },
  {
    slug: 'cac-alto-como-reduzir-custo-aquisicao',
    title: 'CAC alto? Como identificar onde seu funil está sangrando',
    excerpt:
      'CAC alto raramente é um problema de mídia. Na maioria dos casos é um sintoma de um funil mal construído. Veja como diagnosticar e corrigir.',
    category: 'Performance',
    author: 'Time Ciclo',
    authorRole: 'Especialistas em Full Funnel Marketing',
    date: '2025-04-28',
    readTime: 6,
    coverGradient: 'from-[#001a10] via-[#000d08] to-[#050505]',
    content: [
      {
        type: 'paragraph',
        text: 'Quando o CAC sobe, o reflexo instintivo é cortar budget ou trocar a agência de mídia. Raramente essa é a solução. O CAC alto é quase sempre um sintoma — e o diagnóstico correto evita que você repita o erro com o próximo parceiro.',
      },
      {
        type: 'heading',
        text: 'As três causas reais de CAC elevado',
      },
      {
        type: 'subheading',
        text: 'Causa 1: Falta de demanda criada',
      },
      {
        type: 'paragraph',
        text: 'Se sua marca não é conhecida, cada clique de performance começa do zero em termos de confiança. O usuário nunca te viu, não conhece seus valores e precisa de muito mais pontos de contato para converter. Isso eleva o CPM efetivo e o custo por conversão.',
      },
      {
        type: 'subheading',
        text: 'Causa 2: Taxa de conversão abaixo do potencial',
      },
      {
        type: 'paragraph',
        text: 'Uma diferença de 1% para 2% na taxa de conversão do site corta o CAC pela metade. UX ruim, página lenta, falta de prova social, checkout complicado — qualquer um desses fatores desperdiça o investimento em mídia.',
      },
      {
        type: 'subheading',
        text: 'Causa 3: LTV baixo distorcendo o CAC aceitável',
      },
      {
        type: 'paragraph',
        text: 'Se seu cliente compra uma vez e não volta, cada aquisição precisa pagar o custo toda no primeiro pedido. Quando o LTV é alto, você pode se dar ao luxo de pagar mais para adquirir — e ainda ser rentável.',
      },
      {
        type: 'highlight',
        text: 'A fórmula é simples: CAC aceitável = LTV × margem de contribuição. Quem não conhece o LTV não sabe quanto pode gastar para adquirir um cliente.',
      },
      {
        type: 'heading',
        text: 'Diagnóstico rápido em 5 perguntas',
      },
      {
        type: 'list',
        items: [
          'Qual é o seu LTV médio nos 12 meses pós-primeira compra?',
          'Qual é a taxa de conversão do seu site por canal de entrada?',
          'Quantos pontos de contato um usuário tem antes de comprar pela primeira vez?',
          'Qual é o NPS dos seus clientes atuais?',
          'Qual porcentagem dos seus clientes faz a segunda compra em até 60 dias?',
        ],
      },
      {
        type: 'paragraph',
        text: 'Com essas respostas em mãos, fica claro se o problema está na aquisição, na conversão ou na retenção — e o tratamento correto para cada um deles é completamente diferente.',
      },
    ],
  },
  {
    slug: 'recompra-e-fidelizacao-o-ativo-que-marcas-ignoram',
    title: 'Recompra e fidelização: o ativo que as marcas ignoram',
    excerpt:
      'Adquirir um novo cliente custa 5x mais do que reter um existente. Mesmo assim, a maioria das marcas investe 90% do budget em aquisição.',
    category: 'Retenção',
    author: 'Time Ciclo',
    authorRole: 'Especialistas em Full Funnel Marketing',
    date: '2025-04-14',
    readTime: 8,
    coverGradient: 'from-[#1a001a] via-[#0d000d] to-[#050505]',
    content: [
      {
        type: 'paragraph',
        text: 'Todo mundo sabe que reter clientes é mais barato do que adquirir novos. Mesmo assim, a esmagadora maioria das marcas de e-commerce investe mais de 85% do orçamento de marketing em captação e menos de 15% em retenção. Por quê?',
      },
      {
        type: 'heading',
        text: 'O viés de aquisição',
      },
      {
        type: 'paragraph',
        text: 'Novos clientes aparecem nos dashboards de mídia com métricas claras: cliques, impressões, conversões. A retenção é mais difusa — CRM, fluxos de e-mail, programas de fidelidade. O que é difícil de medir tende a ser subestimado.',
      },
      {
        type: 'highlight',
        text: 'Um aumento de 5% na taxa de retenção pode aumentar a lucratividade em até 95%, segundo estudos da Bain & Company. Mesmo um incremento de 1% já muda o P&L de forma significativa.',
      },
      {
        type: 'heading',
        text: 'As alavancas de recompra que funcionam',
      },
      {
        type: 'subheading',
        text: 'Fluxos de pós-compra inteligentes',
      },
      {
        type: 'paragraph',
        text: 'O período pós-compra é quando o cliente está mais engajado com a marca. Um fluxo bem construído de e-mail e WhatsApp nos primeiros 30 dias aumenta significativamente a probabilidade de segunda compra.',
      },
      {
        type: 'subheading',
        text: 'Programas de recompra com gatilho de ciclo',
      },
      {
        type: 'paragraph',
        text: 'Se você vende produtos consumíveis — suplementos, cosméticos, pet food — o ciclo natural de consumo é previsível. Uma campanha ativada no momento certo do ciclo tem taxas de abertura e conversão muito superiores às campanhas genéricas.',
      },
      {
        type: 'subheading',
        text: 'Cross-sell baseado em comportamento',
      },
      {
        type: 'paragraph',
        text: 'Clientes que compram produto A têm uma probabilidade X de se interessar pelo produto B. Essa lógica, aplicada em automações de CRM, cria receita incremental sem custo adicional de aquisição.',
      },
      {
        type: 'list',
        items: [
          'Segmente sua base entre compradores únicos e recorrentes',
          'Calcule o tempo médio entre a primeira e segunda compra',
          'Crie um fluxo de reativação para quem passou desse prazo sem comprar',
          'Meça o impacto separadamente do budget de aquisição',
        ],
      },
    ],
  },
  {
    slug: 'crm-para-ecommerce-alem-do-email-marketing',
    title: 'CRM para e-commerce: além do e-mail marketing',
    excerpt:
      'CRM não é e-mail marketing. É a estratégia completa de relacionamento que transforma compradores ocasionais em clientes fiéis e embaixadores de marca.',
    category: 'CRM',
    author: 'Time Ciclo',
    authorRole: 'Especialistas em Full Funnel Marketing',
    date: '2025-03-30',
    readTime: 9,
    coverGradient: 'from-[#001020] via-[#00080d] to-[#050505]',
    content: [
      {
        type: 'paragraph',
        text: 'Quando falamos em CRM para a maioria das marcas, a resposta automática é "a gente faz e-mail marketing". CRM é muito mais do que isso. É a gestão do relacionamento com o cliente em todos os canais e em todos os momentos da jornada.',
      },
      {
        type: 'heading',
        text: 'O CRM como estratégia, não como ferramenta',
      },
      {
        type: 'paragraph',
        text: 'A ferramenta de CRM — seja Klaviyo, HubSpot, RD Station ou qualquer outra — é apenas a execução. A estratégia começa com uma pergunta mais fundamental: o que você quer que o cliente sinta, saiba e faça em cada etapa da relação com sua marca?',
      },
      {
        type: 'highlight',
        text: 'CRM eficaz não é sobre enviar mais e-mails. É sobre enviar a mensagem certa, para a pessoa certa, no momento certo — e pelo canal em que ela prefere ser contactada.',
      },
      {
        type: 'heading',
        text: 'Os quatro pilares de um CRM de alta performance',
      },
      {
        type: 'list',
        items: [
          'Dados: unificação da base de clientes com histórico completo de compras e comportamento',
          'Segmentação: grupos de clientes com comportamentos e necessidades similares',
          'Automação: fluxos que respondem a eventos específicos do cliente (comprou, abandonou, não comprou há X dias)',
          'Mensuração: atribuição correta da receita gerada por cada fluxo e campanha',
        ],
      },
      {
        type: 'heading',
        text: 'WhatsApp como canal de CRM',
      },
      {
        type: 'paragraph',
        text: 'O WhatsApp tem taxa de abertura de mais de 95%, contra 20-30% do e-mail. Para categorias com alta frequência de compra — beleza, saúde, pet, alimentos — o WhatsApp como canal de CRM é uma alavanca de receita subutilizada pela maioria das marcas.',
      },
      {
        type: 'paragraph',
        text: 'A combinação de e-mail para comunicações mais ricas e WhatsApp para mensagens curtas e acionáveis cria uma estratégia multicanal que aumenta alcance e conversão sem duplicar o esforço.',
      },
      {
        type: 'subheading',
        text: 'O que monitorar',
      },
      {
        type: 'list',
        items: [
          'Revenue atribuída ao CRM (e-mail + WhatsApp) como % da receita total',
          'Taxa de recompra 30/60/90 dias pós-primeira compra',
          'Taxa de abertura e clique por segmento',
          'Receita por e-mail enviado (RPE)',
          'Churn de base: quantos clientes ficaram inativos nos últimos 90 dias',
        ],
      },
    ],
  },
  {
    slug: 'social-commerce-como-integrar-ao-seu-funil',
    title: 'Social Commerce: como integrar ao seu funil de crescimento',
    excerpt:
      'Instagram, TikTok Shop e Pinterest estão mudando onde as decisões de compra são tomadas. Sua marca precisa estar onde o cliente decide.',
    category: 'Social',
    author: 'Time Ciclo',
    authorRole: 'Especialistas em Full Funnel Marketing',
    date: '2025-03-15',
    readTime: 6,
    coverGradient: 'from-[#1a0a00] via-[#0d0500] to-[#050505]',
    content: [
      {
        type: 'paragraph',
        text: 'O comportamento de compra mudou. Uma porcentagem crescente de decisões de compra começa e termina dentro de plataformas sociais — sem que o usuário nunca visite o site da marca. Para as marcas que não se adaptaram, isso significa receita invisível indo para concorrentes.',
      },
      {
        type: 'heading',
        text: 'O que é social commerce de verdade',
      },
      {
        type: 'paragraph',
        text: 'Social commerce não é só ter loja no Instagram. É a integração estratégica entre conteúdo orgânico, influência, anúncios e pontos de conversão dentro das plataformas sociais. É um canal com lógica própria, que exige uma abordagem diferente da loja convencional.',
      },
      {
        type: 'highlight',
        text: 'Marcas que integram social commerce ao funil reportam incremento de 20-40% em novos clientes, especialmente nas faixas etárias abaixo de 35 anos.',
      },
      {
        type: 'heading',
        text: 'Onde o social commerce se encaixa no funil',
      },
      {
        type: 'subheading',
        text: 'Topo: descoberta e desejo',
      },
      {
        type: 'paragraph',
        text: 'Reels, TikToks e conteúdo de criadores são o principal motor de descoberta para categorias como moda, beleza e lifestyle. O conteúdo não precisa vender — precisa criar desejo.',
      },
      {
        type: 'subheading',
        text: 'Meio: consideração e prova social',
      },
      {
        type: 'paragraph',
        text: 'Reviews, unboxings, comparações e lives são o conteúdo que move clientes da consideração para a decisão. A comunidade da marca é um ativo que poucas marcas cultivam com consistência.',
      },
      {
        type: 'subheading',
        text: 'Fundo: conversão dentro da plataforma',
      },
      {
        type: 'paragraph',
        text: 'Instagram Shopping, TikTok Shop e Pinterest Checkout permitem que a compra aconteça sem fricção, sem redirecionamento. A conversão in-app elimina o abandono causado pela troca de contexto.',
      },
      {
        type: 'list',
        items: [
          'Mapeie em quais plataformas seu cliente passa mais tempo',
          'Crie conteúdo nativo para cada plataforma — não recicle os mesmos criativos',
          'Ative o catálogo de produtos nativo de cada plataforma',
          'Meça a contribuição do social commerce separadamente do e-commerce direto',
        ],
      },
    ],
  },
  {
    slug: 'expansao-de-demanda-como-aumentar-ltv',
    title: 'Expansão de demanda: como aumentar LTV sem elevar o investimento em mídia',
    excerpt:
      'A terceira etapa do funil é onde marcas maduras jogam. Frequência, ticket e recorrência compõem o LTV — e todos os três podem ser otimizados sem R$1 a mais em aquisição.',
    category: 'Crescimento',
    author: 'Time Ciclo',
    authorRole: 'Especialistas em Full Funnel Marketing',
    date: '2025-02-28',
    readTime: 7,
    coverGradient: 'from-[#0a1a00] via-[#050d00] to-[#050505]',
    content: [
      {
        type: 'paragraph',
        text: 'LTV — Lifetime Value — é a métrica que separa marcas que crescem de forma sustentável das que ficam presas num ciclo de aquisição caro e margem apertada. E ao contrário do que parece, aumentar o LTV não exige mais investimento em mídia.',
      },
      {
        type: 'heading',
        text: 'A fórmula do LTV',
      },
      {
        type: 'highlight',
        text: 'LTV = Ticket Médio × Frequência de Compra × Tempo de Retenção. Para aumentar o LTV, você pode atuar em qualquer uma das três variáveis.',
      },
      {
        type: 'heading',
        text: 'Alavanca 1: aumentar o ticket médio',
      },
      {
        type: 'paragraph',
        text: 'Upsell no momento da compra, cross-sell no pós-compra, bundling estratégico de produtos e comunicação de valor percebido são as principais formas de elevar o ticket sem desconto. Desconto é a alavanca mais cara — use por último.',
      },
      {
        type: 'heading',
        text: 'Alavanca 2: aumentar a frequência',
      },
      {
        type: 'paragraph',
        text: 'Para produtos de consumo contínuo, a frequência é uma consequência do lembrete certo no momento certo. Fluxos de recompra baseados em ciclo de consumo — enviados antes do produto acabar — têm taxas de conversão muito superiores às campanhas genéricas.',
      },
      {
        type: 'heading',
        text: 'Alavanca 3: aumentar o tempo de retenção',
      },
      {
        type: 'paragraph',
        text: 'Clientes que se sentem conectados à marca ficam mais tempo. Comunidade, conteúdo exclusivo, atendimento de qualidade e programas de fidelidade criam vínculos que vão além da transação.',
      },
      {
        type: 'list',
        items: [
          'Calcule seu LTV atual segmentado por canal de aquisição',
          'Identifique quais canais trazem clientes com maior LTV — e invista mais neles',
          'Implemente um fluxo de recompra baseado no ciclo médio de consumo do seu produto',
          'Crie um programa de benefícios simples para compradores recorrentes',
          'Meça o incremento de LTV a cada trimestre como KPI de negócio',
        ],
      },
      {
        type: 'paragraph',
        text: 'Marcas que tratam LTV como KPI estratégico tomam decisões de aquisição melhores, porque sabem quanto podem investir por cliente e ainda crescer com rentabilidade.',
      },
    ],
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.slug)
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1, day)
  )
}

// ─── WordPress imported posts ──────────────────────────────────────────────

export interface WpPost {
  slug: string
  title: string
  date: string
  category: string
  excerpt: string
  html: string
}

const categoryGradients: Record<string, string> = {
  'SEO': 'from-[#001a10] via-[#000d08] to-[#050505]',
  'Mídia Paga': 'from-[#1a0a00] via-[#0d0500] to-[#050505]',
  'Redes Sociais': 'from-[#1a0010] via-[#0d0008] to-[#050505]',
  'Marketing de Conteúdo': 'from-[#001020] via-[#000810] to-[#050505]',
  'Marketing Digital': 'from-[#0a001a] via-[#05000d] to-[#050505]',
  'Gestão do E-commerce': 'from-[#0a1a00] via-[#050d00] to-[#050505]',
  'Vendas': 'from-[#1a0000] via-[#0d0000] to-[#050505]',
  'Logística': 'from-[#001a1a] via-[#000d0d] to-[#050505]',
  'Tecnologia e Inovação': 'from-[#00001a] via-[#00000d] to-[#050505]',
}

export function getCategoryGradient(category: string): string {
  return categoryGradients[category] ?? 'from-[#0d0020] via-[#080010] to-[#050505]'
}

let _wpPosts: WpPost[] | null = null

export function getWpPosts(): WpPost[] {
  if (_wpPosts) return _wpPosts
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const data = require('../../src/data/wp-posts.json') as WpPost[]
    _wpPosts = data
    return data
  } catch {
    return []
  }
}

export function getWpPostBySlug(slug: string): WpPost | undefined {
  return getWpPosts().find((p) => p.slug === slug)
}

export function getAllWpSlugs(): string[] {
  return getWpPosts().map((p) => p.slug)
}
