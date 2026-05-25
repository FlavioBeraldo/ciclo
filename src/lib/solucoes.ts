export interface Solucao {
  slug: string
  title: string
  shortTitle: string
  heroHeadline: string
  heroSub: string
  heroDescription: string
  whatIs: string
  howItWorks: { step: string; description: string }[]
  services: string[]
  results: { metric: string; description: string }[]
  faq: { q: string; a: string }[]
  seo: { title: string; description: string; keywords: string[] }
}

export const solucoes: Solucao[] = [
  {
    slug: 'geracao-de-demanda',
    title: 'Geração de Demanda',
    shortTitle: 'Geração de Demanda',
    heroHeadline: 'Faça sua marca ser lembrada antes de a compra acontecer',
    heroSub: 'Geração de Demanda para E-commerce',
    heroDescription:
      'A maioria das marcas investe só em conversão. Marcas que criam demanda chegam como primeira escolha — e pagam menos por cada venda.',
    whatIs:
      'Geração de Demanda é o conjunto de estratégias que constroem desejo, relevância e preferência pela sua marca antes do momento de compra. É o topo do funil que alimenta tudo que vem depois: mais conversão, menor CAC e maior LTV.',
    howItWorks: [
      {
        step: 'Diagnóstico de marca',
        description:
          'Analisamos como sua marca é percebida e onde existem gaps de reconhecimento e preferência.',
      },
      {
        step: 'Estratégia de conteúdo',
        description:
          'Definimos os formatos, canais e narrativas que vão construir desejo pelo seu produto.',
      },
      {
        step: 'Produção e distribuição',
        description:
          'Produzimos e roteirizamos conteúdo validado para performance em cada plataforma.',
      },
      {
        step: 'Mensuração e otimização',
        description:
          'Acompanhamos métricas de alcance, engajamento e impacto no CAC para iterar continuamente.',
      },
    ],
    services: [
      'Produção e roteirização de conteúdo validado para redes sociais',
      'TikTok Shop (Social Commerce)',
      'Gestão de Creators e Influenciadores',
      'OOH Digital',
    ],
    results: [
      {
        metric: '+104%',
        description: 'de faturamento para marcas que investiram em geração de demanda',
      },
      {
        metric: '-23%',
        description: 'de custo por aquisição após 6 meses de estratégia ativa',
      },
      {
        metric: '3x',
        description: 'mais recall de marca em pesquisas pós-campanha de conteúdo',
      },
      {
        metric: '+48%',
        description: 'de engajamento orgânico com estratégia de creators',
      },
    ],
    faq: [
      {
        q: 'O que é geração de demanda no e-commerce?',
        a: 'Geração de demanda é o processo de criar consciência, desejo e preferência pela sua marca antes do momento em que o cliente está pronto para comprar. Inclui produção de conteúdo, social commerce, gestão de influenciadores e presença digital estratégica.',
      },
      {
        q: 'Quanto tempo leva para ver resultados com geração de demanda?',
        a: 'Os primeiros indicadores aparecem em 30 a 60 dias — alcance, engajamento e tráfego qualificado. O impacto no CAC e na receita fica evidente entre 3 e 6 meses, conforme a demanda gerada alimenta o fundo do funil.',
      },
      {
        q: 'TikTok Shop funciona para o meu segmento?',
        a: 'TikTok Shop tem performance comprovada em moda, beleza, saúde, pet e lifestyle. Para segmentos de ticket alto ou B2B, a estratégia é adaptar o formato para geração de leads qualificados.',
      },
      {
        q: 'Como a Ciclo mede o retorno de uma estratégia de conteúdo?',
        a: 'Medimos o impacto no CAC blended, o volume de tráfego de marca (branded search), o engajamento por canal e a contribuição do conteúdo no funil de conversão via atribuição multi-touch.',
      },
    ],
    seo: {
      title: 'Geração de Demanda para E-commerce | Ciclo E-commerce',
      description:
        'Estratégias de geração de demanda para marcas de e-commerce: produção de conteúdo, TikTok Shop, gestão de creators e OOH digital. Agende uma conversa.',
      keywords: [
        'geração de demanda ecommerce',
        'social commerce brasil',
        'gestão de creators influenciadores',
        'tiktok shop brasil',
        'marketing de conteúdo ecommerce',
      ],
    },
  },
  {
    slug: 'captacao-de-demanda',
    title: 'Captação de Demanda',
    shortTitle: 'Captação de Demanda',
    heroHeadline: 'Converta interesse em receita com mídia que realmente performa',
    heroSub: 'Captação de Demanda para E-commerce',
    heroDescription:
      'Performance não é só apertar botão. É criar anúncios que vendem, distribuir no lugar certo e otimizar com inteligência — para cada canal e cada etapa da jornada.',
    whatIs:
      'Captação de Demanda é o conjunto de estratégias pagas que convertem intenção de compra em pedidos reais. Vai muito além de subir campanhas: envolve criação de anúncios social first, distribuição multicanal e otimização contínua baseada em dados.',
    howItWorks: [
      {
        step: 'Auditoria de mídia',
        description:
          'Analisamos suas campanhas atuais, identificamos desperdício e oportunidades de otimização imediata.',
      },
      {
        step: 'Criação de anúncios',
        description:
          'Produzimos criativos social first — pensados primeiro para o comportamento nativo de cada plataforma.',
      },
      {
        step: 'Distribuição multicanal',
        description:
          'Ativamos Google, Meta, TikTok, Programática, Pinterest e Retail Media com estratégia integrada.',
      },
      {
        step: 'Otimização contínua',
        description:
          'Testamos, mensuramos e otimizamos semanalmente para maximizar ROAS e reduzir CAC.',
      },
    ],
    services: [
      'Produção e criação de anúncios no formato social first e validado para conversão',
      'Google Ads / Bing Ads',
      'Meta Ads / TikTok Ads',
      'Programática / Pinterest Ads',
      'Retail Media (Mercado/Shopee/Amazon)',
    ],
    results: [
      {
        metric: '-32%',
        description: 'de CAC médio após reestruturação de campanhas',
      },
      {
        metric: '+197%',
        description: 'de faturamento com estratégia multicanal',
      },
      {
        metric: '4,2x',
        description: 'de ROAS médio nos clientes Ciclo',
      },
      {
        metric: '85%',
        description: 'dos clientes reduzem CPL no primeiro trimestre',
      },
    ],
    faq: [
      {
        q: 'O que é mídia social first?',
        a: 'Social first é uma abordagem de criação de anúncios pensada para o comportamento nativo de plataformas como TikTok, Instagram e Reels. Em vez de adaptar peças de outros formatos, o criativo é concebido para se parecer com conteúdo orgânico — o que aumenta o tempo de visualização e a conversão.',
      },
      {
        q: 'Qual a diferença entre Google Ads e Meta Ads para e-commerce?',
        a: 'Google Ads captura demanda existente — pessoas que já estão buscando seu produto ou categoria. Meta Ads cria demanda — impacta usuários que não estão necessariamente buscando, mas têm perfil de compra. A combinação dos dois é o que gera crescimento consistente.',
      },
      {
        q: 'O que é Retail Media e por que importa?',
        a: 'Retail Media são os anúncios dentro de marketplaces como Mercado Livre, Shopee e Amazon. O diferencial é que o usuário já está em modo de compra, o que resulta em taxas de conversão muito superiores às do tráfego externo.',
      },
      {
        q: 'Como a Ciclo garante que os criativos vão performar?',
        a: 'Combinamos dados de desempenho histórico, testes A/B estruturados e análise de comportamento por plataforma. Todo criativo é testado em pequena escala antes de receber investimento maior.',
      },
    ],
    seo: {
      title: 'Captação de Demanda para E-commerce | Ciclo E-commerce',
      description:
        'Gestão de mídia paga para e-commerce: Google Ads, Meta Ads, TikTok Ads, Retail Media e muito mais. CAC menor, ROAS maior. Fale com a Ciclo.',
      keywords: [
        'captação de demanda ecommerce',
        'gestão de tráfego pago ecommerce',
        'google ads ecommerce',
        'meta ads ecommerce',
        'retail media mercado livre',
      ],
    },
  },
  {
    slug: 'expansao-de-demanda',
    title: 'Expansão de Demanda',
    shortTitle: 'Expansão de Demanda',
    heroHeadline: 'Faça cada cliente valer mais sem aumentar o investimento em mídia',
    heroSub: 'Expansão de Demanda para E-commerce',
    heroDescription:
      'Recompra, fidelização e LTV são as alavancas mais rentáveis do e-commerce. São também as mais ignoradas. A Ciclo transforma compradores únicos em clientes recorrentes.',
    whatIs:
      'Expansão de Demanda é a estratégia de aumentar a frequência de compra, o ticket médio e o tempo de retenção dos clientes existentes. É o terceiro ciclo do funil — e o que mais impacta a lucratividade de longo prazo sem elevar o CAC.',
    howItWorks: [
      {
        step: 'Diagnóstico de LTV',
        description:
          'Calculamos seu LTV atual segmentado por canal, produto e período para identificar onde estão as maiores oportunidades.',
      },
      {
        step: 'Estratégia de CRM',
        description:
          'Desenhamos a jornada pós-compra ideal: fluxos de e-mail, SMS, WhatsApp e push alinhados ao ciclo de consumo do produto.',
      },
      {
        step: 'Ativação de réguas',
        description:
          'Implementamos as automações e campanhas de reativação, fidelização e indicação na plataforma escolhida.',
      },
      {
        step: 'Mensuração de incremento',
        description:
          'Acompanhamos receita atribuída ao CRM, taxa de recompra e evolução do LTV como KPIs centrais.',
      },
    ],
    services: [
      'CRM: E-mail, SMS, Push, WhatsApp',
      'Réguas de automação personalizadas',
      'Reativação e programas de fidelização',
      'Programas de indicação / Reviews',
    ],
    results: [
      {
        metric: '2,7x',
        description: 'de aumento médio no LTV dos clientes após 12 meses',
      },
      {
        metric: '+48%',
        description: 'de receita atribuída ao CRM nos primeiros 6 meses',
      },
      {
        metric: '35%',
        description: 'de aumento na taxa de recompra em 90 dias',
      },
      {
        metric: '-40%',
        description: 'de clientes inativos com régua de reativação ativa',
      },
    ],
    faq: [
      {
        q: 'O que é LTV e por que é a métrica mais importante do e-commerce?',
        a: 'LTV (Lifetime Value) é o valor total que um cliente gera durante toda sua relação com a marca. É a métrica mais importante porque define quanto você pode investir para adquirir um cliente e ainda ser rentável. CAC alto com LTV alto é sustentável; CAC baixo com LTV baixo não é.',
      },
      {
        q: 'Qual plataforma de CRM a Ciclo recomenda para e-commerce?',
        a: 'Depende do volume da base e dos canais prioritários. Para e-commerces com foco em e-mail e SMS, Klaviyo e RD Station são referências. Para WhatsApp como canal principal, trabalhamos com plataformas nativas do ecossistema Meta. O importante é a estratégia — a ferramenta é a execução.',
      },
      {
        q: 'Como funciona um programa de indicação para e-commerce?',
        a: 'Programas de indicação (referral) incentivam clientes satisfeitos a recomendar a marca para sua rede. Clientes indicados convertem 3 a 5 vezes mais e têm LTV superior ao cliente médio. Estruturamos a mecânica, o incentivo e a comunicação para maximizar a adesão.',
      },
      {
        q: 'O que é uma régua de automação?',
        a: 'É uma sequência de mensagens automáticas disparadas a partir de eventos específicos: uma compra realizada, um carrinho abandonado, uma data de aniversário, o ciclo de consumo de um produto. Cada régua tem um objetivo — recompra, upsell, reativação — e é mensurada individualmente.',
      },
    ],
    seo: {
      title: 'Expansão de Demanda e CRM para E-commerce | Ciclo E-commerce',
      description:
        'Estratégias de CRM, automação, fidelização e expansão de demanda para e-commerce. Aumente LTV e recompra sem elevar CAC. Fale com a Ciclo.',
      keywords: [
        'expansão de demanda ecommerce',
        'crm ecommerce',
        'fidelização clientes ecommerce',
        'ltv ecommerce',
        'automação de marketing ecommerce',
      ],
    },
  },
  {
    slug: 'inteligencia-e-operacao',
    title: 'Inteligência & Operação',
    shortTitle: 'Inteligência & Operação',
    heroHeadline: 'Tome decisões de crescimento com dados, não com achismo',
    heroSub: 'Inteligência & Operação para E-commerce',
    heroDescription:
      'Crescer sem dados é andar no escuro. A Ciclo estrutura a inteligência operacional que transforma números em decisões, e decisões em crescimento previsível.',
    whatIs:
      'Inteligência & Operação é a infraestrutura analítica e processual que sustenta todo o restante do funil. Sem dados confiáveis e processos estruturados, qualquer estratégia de marketing fica comprometida. É a base que torna o crescimento replicável.',
    howItWorks: [
      {
        step: 'Diagnóstico de dados',
        description:
          'Auditamos suas fontes de dados, integrações e KPIs para identificar gaps e inconsistências que prejudicam a tomada de decisão.',
      },
      {
        step: 'Estruturação de analytics',
        description:
          'Implementamos a infraestrutura de BI e analytics para que as métricas certas estejam sempre disponíveis e confiáveis.',
      },
      {
        step: 'Processos e playbooks',
        description:
          'Documentamos os processos operacionais e criamos playbooks que permitem escalar sem perder qualidade.',
      },
      {
        step: 'Growth Contínuo',
        description:
          'Estabelecemos cadências de revisão, testes e otimização que garantem melhoria contínua em todas as frentes.',
      },
    ],
    services: ['Analytics & BI', 'Processos e Playbooks', 'Growth Contínuo'],
    results: [
      {
        metric: '100%',
        description: 'de visibilidade do funil completo com dashboards integrados',
      },
      {
        metric: '-60%',
        description: 'de tempo em relatórios manuais com BI automatizado',
      },
      {
        metric: '3x',
        description: 'mais velocidade de teste e aprendizado com processos estruturados',
      },
      {
        metric: '+25%',
        description: 'de eficiência operacional no primeiro trimestre',
      },
    ],
    faq: [
      {
        q: 'O que é Analytics & BI para e-commerce?',
        a: 'Analytics & BI para e-commerce é a estruturação de dados de vendas, tráfego, comportamento e marketing em dashboards integrados que permitem tomar decisões com velocidade e precisão. Inclui desde a configuração correta do GA4 até a construção de data warehouses e relatórios customizados.',
      },
      {
        q: 'O que são Playbooks de marketing?',
        a: 'Playbooks são documentos que descrevem como executar processos repetíveis: como lançar uma campanha, como responder a uma queda de ROAS, como onboardar um novo canal. Eles permitem que a operação escale sem depender de conhecimento tácito de pessoas específicas.',
      },
      {
        q: 'O que é Growth Contínuo?',
        a: 'Growth Contínuo é a prática estruturada de testar hipóteses de crescimento em ciclos curtos — semanas, não meses. Cada ciclo tem uma hipótese, um experimento e uma conclusão que alimenta o próximo ciclo. É o método que permite aprender rápido e crescer de forma consistente.',
      },
      {
        q: 'A Ciclo cuida da implementação técnica de ferramentas?',
        a: 'Sim. Nossa equipe estrutura integrações entre plataformas de e-commerce, ferramentas de analytics, CRM e mídia para garantir que os dados fluam de forma confiável por todo o ecossistema.',
      },
    ],
    seo: {
      title: 'Inteligência e Operação para E-commerce | Ciclo E-commerce',
      description:
        'Analytics, BI, processos e growth contínuo para e-commerces que querem crescer com dados e eficiência operacional. Fale com a Ciclo.',
      keywords: [
        'analytics bi ecommerce',
        'inteligência de dados ecommerce',
        'growth hacking ecommerce',
        'processos ecommerce',
        'dashboard ecommerce',
      ],
    },
  },
]

export function getSolucaoBySlug(slug: string): Solucao | undefined {
  return solucoes.find((s) => s.slug === slug)
}

export function getAllSolucaoSlugs(): string[] {
  return solucoes.map((s) => s.slug)
}
