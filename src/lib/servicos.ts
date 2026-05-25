export interface Servico {
  slug: string
  parentSlug: string
  parentTitle: string
  title: string
  tagline: string
  heroHeadline: string
  heroDescription: string
  what: string
  why: string
  howItWorks: { step: string; detail: string }[]
  deliverables: string[]
  results: { metric: string; label: string }[]
  examples: { title: string; description: string; highlight: string }[]
  faq: { q: string; a: string }[]
  relatedSlugs: string[]
  seo: { title: string; description: string; keywords: string[] }
}

export const servicos: Servico[] = [
  // ── Geração de Demanda ────────────────────────────────────────────────────────
  {
    slug: 'producao-conteudo-redes-sociais',
    parentSlug: 'geracao-de-demanda',
    parentTitle: 'Geração de Demanda',
    title: 'Produção e Roteirização de Conteúdo para Redes Sociais',
    tagline: 'Conteúdo que constrói marca e converte — criado para cada plataforma',
    heroHeadline: 'Pare de publicar por obrigação. Comece a crescer com conteúdo.',
    heroDescription:
      'Produção e roteirização de conteúdo validado para performance no Instagram, TikTok, YouTube e mais. Do briefing ao post publicado.',
    what: 'Conteúdo para redes sociais é o principal ativo de geração de demanda orgânica de um e-commerce. A Ciclo produz e roteiriza conteúdo pensado nativamente para cada plataforma — não recicla peças entre canais — com foco em alcance, engajamento e impacto no CAC.',
    why: 'Marcas que publicam conteúdo consistente e relevante têm CAC até 40% menor que marcas que dependem exclusivamente de mídia paga. O conteúdo cria demanda que a performance captura — e a combinação dos dois é o que gera crescimento sustentável.',
    howItWorks: [
      {
        step: 'Imersão na marca',
        detail:
          'Analisamos posicionamento, público, concorrência e histórico de conteúdo para definir os pilares editoriais.',
      },
      {
        step: 'Calendário editorial',
        detail:
          'Planejamos os temas, formatos e frequência ideais para cada canal com base em dados de performance.',
      },
      {
        step: 'Roteirização',
        detail:
          'Criamos scripts e briefings detalhados para cada peça — Reels, TikToks, carrosséis, Stories — com gancho, desenvolvimento e CTA.',
      },
      {
        step: 'Produção e revisão',
        detail:
          'Produzimos o conteúdo com direção criativa alinhada à identidade da marca.',
      },
      {
        step: 'Publicação e análise',
        detail:
          'Publicamos, monitoramos desempenho e iteramos para melhorar continuamente os resultados.',
      },
    ],
    deliverables: [
      'Calendário editorial mensal',
      'Roteiros validados para vídeos (Reels/TikTok/YouTube Shorts)',
      'Carrosséis de alta performance para Instagram',
      'Stories com CTAs otimizados',
      'Relatório mensal de desempenho com insights',
    ],
    results: [
      { metric: '+40%', label: 'alcance orgânico médio' },
      { metric: '-28%', label: 'CAC com conteúdo ativo' },
      { metric: '3x', label: 'mais engajamento vs. média do mercado' },
      { metric: '+65%', label: 'de seguidores em 6 meses' },
    ],
    examples: [
      {
        title: 'Marca de beleza DTC',
        description:
          'Roteirizamos série de "antes e depois" de 30 dias. Resultado: 2,4M de visualizações orgânicas e +18% de receita no mês.',
        highlight: '2,4M views',
      },
      {
        title: 'E-commerce de moda',
        description:
          'Calendário editorial com pilares de educação, tendência e prova social. CAC caiu 32% em 4 meses.',
        highlight: 'CAC -32%',
      },
      {
        title: 'Suplementos',
        description:
          'Série de conteúdo educativo no Instagram. Taxa de recompra subiu de 18% para 34%.',
        highlight: 'Recompra +89%',
      },
    ],
    faq: [
      {
        q: 'Qual a diferença entre roteirizar para TikTok e para Instagram Reels?',
        a: 'TikTok favorece conteúdo mais cru, nativo e com narrativa sequencial — o gancho nos primeiros 2 segundos é determinante. Reels permite peças mais polidas e aproveita melhor o contexto do feed. Adaptamos o tom, o ritmo e o formato para maximizar a performance em cada plataforma.',
      },
      {
        q: 'Quantos posts por semana são necessários?',
        a: 'Depende do estágio da marca e dos canais prioritários. Em geral, recomendamos frequência mínima de 4 posts/semana no Instagram e 5 no TikTok. Consistência importa mais que volume.',
      },
      {
        q: 'A Ciclo faz a captação também ou só o roteiro?',
        a: 'Oferecemos roteirização, direção criativa e, conforme o modelo contratado, produção completa. Para marcas com equipe interna de produção, entregamos os roteiros e briefings detalhados.',
      },
      {
        q: 'Como o conteúdo orgânico impacta as campanhas pagas?',
        a: 'Conteúdo orgânico com bom desempenho é sinal de que o criativo ressoa com o público — o que é exatamente o que funciona em mídia paga. Reaproveitamos os formatos orgânicos que performam para campanhas de paid social.',
      },
    ],
    relatedSlugs: [
      'tiktok-shop-social-commerce',
      'gestao-creators-influenciadores',
      'meta-ads-tiktok-ads',
    ],
    seo: {
      title: 'Produção de Conteúdo para Redes Sociais | Ciclo E-commerce',
      description:
        'Produção e roteirização de conteúdo para Instagram, TikTok e YouTube. Estratégia de conteúdo para e-commerce que gera demanda e reduz CAC.',
      keywords: [
        'produção de conteúdo redes sociais',
        'roteirização conteúdo ecommerce',
        'conteúdo para instagram ecommerce',
        'tiktok para ecommerce',
        'estratégia de conteúdo digital',
      ],
    },
  },
  {
    slug: 'tiktok-shop-social-commerce',
    parentSlug: 'geracao-de-demanda',
    parentTitle: 'Geração de Demanda',
    title: 'TikTok Shop & Social Commerce',
    tagline: 'Venda onde seu cliente descobre — sem sair do feed',
    heroHeadline: 'TikTok Shop: a maior oportunidade do e-commerce brasileiro agora',
    heroDescription:
      'Social commerce integrado ao funil: do vídeo orgânico ao checkout dentro do TikTok. A Ciclo estrutura sua operação de TikTok Shop do zero ou otimiza o que você já tem.',
    what: 'TikTok Shop é a plataforma de social commerce nativa do TikTok que permite ao usuário comprar produtos sem sair do aplicativo. Combina o poder do conteúdo viral com a fricção mínima do checkout in-app — o que resulta em taxas de conversão muito superiores ao tráfego redirecionado para o site.',
    why: 'O TikTok tem mais de 100 milhões de usuários no Brasil, com altíssimo engajamento em categorias como beleza, moda, saúde e lifestyle. Marcas que entraram no TikTok Shop cedo têm vantagem de posicionamento que será muito mais cara de construir depois. Janela de oportunidade aberta agora.',
    howItWorks: [
      {
        step: 'Configuração da loja',
        detail:
          'Setup técnico do TikTok Shop: catálogo, integração com plataforma de e-commerce, políticas e aprovações.',
      },
      {
        step: 'Estratégia de conteúdo',
        detail:
          'Planejamos os formatos e frequência de conteúdo — Lives, vídeos de produto, shoppable content — para maximizar o alcance e as vendas.',
      },
      {
        step: 'Ativação de creators',
        detail:
          'Selecionamos e briefamos criadores para amplificar o alcance com conteúdo nativo e autêntico.',
      },
      {
        step: 'Campanhas de TikTok Ads',
        detail:
          'Ativamos campanhas de Shop Ads para amplificar o que está performando organicamente.',
      },
      {
        step: 'Análise e otimização',
        detail:
          'Acompanhamos GMV, taxa de conversão in-app e ROI por formato para otimizar continuamente.',
      },
    ],
    deliverables: [
      'Setup completo da TikTok Shop',
      'Estratégia de conteúdo e Lives',
      'Seleção e gestão de creators para a Shop',
      'Campanhas de TikTok Shop Ads',
      'Dashboard de GMV e performance',
    ],
    results: [
      { metric: '3x', label: 'GMV médio após 3 meses de operação' },
      { metric: '+180%', label: 'de alcance com creators no TikTok Shop' },
      { metric: '-35%', label: 'de custo por aquisição vs. e-commerce tradicional' },
      { metric: '68%', label: 'dos compradores são novos clientes' },
    ],
    examples: [
      {
        title: 'Marca de skincare',
        description:
          'Operação de TikTok Shop com 3 Lives semanais e rede de micro creators. Resultado: R$ 280K de GMV no primeiro trimestre.',
        highlight: 'R$280K GMV',
      },
      {
        title: 'E-commerce de moda feminina',
        description:
          'Estratégia de shoppable content com 12 creators. Taxa de conversão in-app 4x maior que do site.',
        highlight: 'Conversão 4x',
      },
      {
        title: 'Suplementos esportivos',
        description:
          'Integração TikTok Shop + Meta Ads. CAC blended caiu 28% com o canal TikTok complementando a mídia paga.',
        highlight: 'CAC -28%',
      },
    ],
    faq: [
      {
        q: 'Minha marca pode vender no TikTok Shop?',
        a: 'A maioria das categorias de consumo pode vender no TikTok Shop. Algumas categorias têm restrições — cosméticos precisam de aprovação de fórmula, por exemplo. Fazemos o diagnóstico de elegibilidade antes de iniciar.',
      },
      {
        q: 'Qual é o investimento mínimo para começar?',
        a: 'O TikTok Shop não exige investimento mínimo de anúncios para começar. A operação inicial pode ser 100% orgânica via conteúdo e Lives. Recomendamos combinar com um investimento em Shop Ads para acelerar os resultados.',
      },
      {
        q: 'TikTok Shop funciona para produtos de ticket alto?',
        a: 'Para ticket acima de R$300, a conversão in-app é mais baixa — o usuário prefere pesquisar antes de comprar. Nesse caso, o TikTok funciona melhor como canal de topo de funil que direciona para o site do que como canal de conversão direta.',
      },
      {
        q: 'Preciso de creators ou posso fazer com conteúdo da própria marca?',
        a: 'Os dois funcionam. Conteúdo da própria marca é mais controlado; creators têm maior alcance e credibilidade com audiências novas. A combinação dos dois é a estratégia de maior performance.',
      },
      {
        q: 'Como medir o ROI do TikTok Shop?',
        a: 'Medimos GMV total, GMV por formato (Lives vs. vídeos), custo de aquisição in-app, ticket médio e taxa de recompra dos compradores via TikTok Shop. Comparamos com os outros canais para calcular o incremento real.',
      },
    ],
    relatedSlugs: [
      'producao-conteudo-redes-sociais',
      'gestao-creators-influenciadores',
      'meta-ads-tiktok-ads',
    ],
    seo: {
      title: 'TikTok Shop para E-commerce | Ciclo E-commerce',
      description:
        'Estruture sua operação de TikTok Shop do zero: setup, conteúdo, creators e TikTok Ads. Social commerce que gera resultado real no Brasil.',
      keywords: [
        'tiktok shop brasil',
        'social commerce ecommerce',
        'tiktok para ecommerce',
        'tiktok shop setup',
        'vender no tiktok',
      ],
    },
  },
  {
    slug: 'gestao-creators-influenciadores',
    parentSlug: 'geracao-de-demanda',
    parentTitle: 'Geração de Demanda',
    title: 'Gestão de Creators e Influenciadores',
    tagline: 'Voz humana que converte — na escala certa para o seu e-commerce',
    heroHeadline: 'Creators certos, briefing certo, resultado mensurável',
    heroDescription:
      'Gestão estratégica de creators e influenciadores para e-commerces: seleção por dados, briefing orientado a conversão e mensuração de ROI real — não só reach.',
    what: 'Gestão de creators é a seleção, briefing, ativação e mensuração de criadores de conteúdo para amplificar a mensagem da marca com autenticidade e escala. Na Ciclo, a gestão de creators é orientada a performance — não apenas reach — com foco em impacto no funil.',
    why: 'O consumidor confia mais na recomendação de um creator do que em anúncio da marca. Creators geram conteúdo nativo que performa organicamente e pode ser reaproveitado como creative de mídia paga — o que reduz custo de produção e aumenta o ROAS.',
    howItWorks: [
      {
        step: 'Mapeamento e seleção',
        detail:
          'Identificamos creators com audiência qualificada para o seu produto: taxa de engajamento real, perfil demográfico e histórico de conversão.',
      },
      {
        step: 'Briefing e contratação',
        detail:
          'Desenvolvemos o briefing criativo que orienta o creator sem engessar a autenticidade — e cuidamos de toda a parte contratual.',
      },
      {
        step: 'Ativação e acompanhamento',
        detail:
          'Gerenciamos os prazos, revisões e publicações para garantir que o conteúdo saia no tempo certo e com a qualidade esperada.',
      },
      {
        step: 'Mensuração de impacto',
        detail:
          'Acompanhamos alcance, engajamento, cliques, conversões e impacto no CAC — não apenas likes.',
      },
      {
        step: 'Otimização contínua',
        detail:
          'Identificamos os creators e formatos que geram mais resultado e escalamos o que funciona.',
      },
    ],
    deliverables: [
      'Seleção de creators por dados (engajamento, audiência, histórico)',
      'Briefings criativos por creator',
      'Gestão de contratos e entregas',
      'Relatório de performance por creator',
      'Reaproveitamento de conteúdo para mídia paga',
    ],
    results: [
      { metric: '+48%', label: 'de engajamento vs. conteúdo da marca' },
      { metric: '2,8x', label: 'de ROAS em ads com UGC de creators' },
      { metric: '-30%', label: 'de CPM em anúncios com conteúdo de creator' },
      { metric: '+85%', label: 'de alcance incremental com micro creators' },
    ],
    examples: [
      {
        title: 'Marca de cosméticos DTC',
        description:
          'Rede de 40 micro creators (10k-100k seguidores). Custo por conversão 60% menor que influenciadores macro.',
        highlight: 'CPC -60%',
      },
      {
        title: 'Moda feminina',
        description:
          'UGC de creators reaproveitado como creative em Meta Ads. ROAS subiu de 2,1x para 3,8x.',
        highlight: 'ROAS +81%',
      },
      {
        title: 'Pet food premium',
        description:
          '3 creators especializados em pets geraram 180K visualizações orgânicas e 340 novos clientes rastreáveis.',
        highlight: '340 novos clientes',
      },
    ],
    faq: [
      {
        q: 'Qual o melhor tamanho de influenciador para e-commerce?',
        a: 'Depende do objetivo. Mega influenciadores (1M+) geram brand awareness em escala mas têm custo alto e taxas de conversão baixas. Micro creators (10k-100k) têm audiências mais nichadas, engajamento real e custo por resultado muito inferior. Para e-commerce, a estratégia de micro creators em escala é geralmente mais eficiente.',
      },
      {
        q: 'Como medir o ROI de uma campanha com influenciadores?',
        a: 'Usamos links rastreáveis, cupons exclusivos por creator, pixels de conversão e atribuição multi-touch para medir vendas diretas. Além disso, monitoramos o impacto no branded search e no tráfego orgânico como indicadores de longo prazo.',
      },
      {
        q: 'O conteúdo do creator pode ser usado em anúncios?',
        a: 'Sim, o chamado UGC (User Generated Content) é um dos formatos de melhor performance em mídia paga atualmente. Negociamos os direitos de uso no contrato para que a marca possa reaproveitar o conteúdo em Meta Ads, TikTok Ads e outros canais.',
      },
      {
        q: 'A Ciclo trabalha com influenciadores de quais segmentos?',
        a: 'Trabalhamos com creators em todos os segmentos de e-commerce: moda, beleza, saúde, pet, alimentos, casa e esportes. Nossa seleção é sempre baseada em dados de audiência e histórico de conversão — não em número de seguidores.',
      },
    ],
    relatedSlugs: [
      'producao-conteudo-redes-sociais',
      'tiktok-shop-social-commerce',
      'meta-ads-tiktok-ads',
    ],
    seo: {
      title: 'Gestão de Creators e Influenciadores para E-commerce | Ciclo',
      description:
        'Seleção, briefing e gestão de creators e influenciadores para e-commerce com foco em conversão e ROI mensurável. Fale com a Ciclo.',
      keywords: [
        'gestão de influenciadores ecommerce',
        'creators ecommerce',
        'influencer marketing ecommerce',
        'ugc para anúncios',
        'micro influenciadores brasil',
      ],
    },
  },
  {
    slug: 'ooh-digital',
    parentSlug: 'geracao-de-demanda',
    parentTitle: 'Geração de Demanda',
    title: 'OOH Digital',
    tagline: 'Presença de marca no mundo físico com inteligência digital',
    heroHeadline: 'Sua marca no outdoor certo, para a audiência certa, no momento certo',
    heroDescription:
      'OOH Digital (Out of Home) programático para e-commerces: painéis digitais com segmentação de audiência, geolocalização e mensuração de impacto no tráfego online.',
    what: 'OOH Digital é a publicidade em painéis e telas digitais fora de casa — shoppings, aeroportos, vias, academias, clínicas — comprada de forma programática, com segmentação por audiência e localização. Para e-commerces, o OOH digital complementa a estratégia online criando pontos de contato no mundo físico.',
    why: 'Marcas que combinam presença online com OOH digital têm recall até 3x maior que as que estão apenas nos canais digitais. O OOH digital de alto impacto é especialmente eficaz para lançamentos, datas sazonais e construção de marca em mercados-alvo específicos.',
    howItWorks: [
      {
        step: 'Definição de público e praças',
        detail:
          'Identificamos as regiões, contextos e perfis de audiência mais relevantes para a marca.',
      },
      {
        step: 'Seleção de inventário',
        detail:
          'Escolhemos os formatos e localizações com maior potencial de impacto: shoppings premium, vias de alto fluxo, ambientes de afinidade.',
      },
      {
        step: 'Criação dos materiais',
        detail:
          'Desenvolvemos criativos otimizados para cada formato e contexto de exibição.',
      },
      {
        step: 'Ativação programática',
        detail:
          'Compramos o inventário de forma programática para otimizar CPM e segmentação.',
      },
      {
        step: 'Mensuração de impacto',
        detail:
          'Correlacionamos as campanhas OOH com métricas digitais: branded search, tráfego direto e conversões georreferenciadas.',
      },
    ],
    deliverables: [
      'Planejamento de praças e formatos',
      'Criativos para painéis digitais',
      'Ativação programática de inventário',
      'Relatório de impacto com correlação digital',
    ],
    results: [
      { metric: '3x', label: 'de recall de marca vs. only digital' },
      { metric: '+22%', label: 'de branded search após campanhas OOH' },
      { metric: '85M', label: 'de impressões por campanha nacional' },
      { metric: '+18%', label: 'de conversão em praças com cobertura OOH' },
    ],
    examples: [
      {
        title: 'Lançamento de e-commerce nacional',
        description:
          'Campanha OOH digital em 12 capitais coordenada com Meta Ads. Branded search cresceu 45% durante o período.',
        highlight: 'Branded search +45%',
      },
      {
        title: 'Marca de moda premium',
        description:
          'Painéis em shoppings premium de SP e RJ durante coleção de inverno. Ticket médio online subiu 12% nas regiões cobertas.',
        highlight: 'Ticket +12%',
      },
      {
        title: 'Marca de saúde e bem-estar',
        description:
          'OOH em academias e clínicas + retargeting digital para quem passou pelos pontos. CTR do retargeting foi 3x maior.',
        highlight: 'CTR 3x',
      },
    ],
    faq: [
      {
        q: 'OOH digital é só para grandes marcas?',
        a: 'Não. A compra programática de OOH digital democratizou o acesso: é possível fazer campanhas a partir de budgets menores, com foco em praças e contextos específicos. Uma marca regional pode fazer OOH só na sua cidade.',
      },
      {
        q: 'Como medir o impacto do OOH no e-commerce?',
        a: 'Monitoramos branded search (crescimento de buscas pela marca), tráfego direto ao site, conversões georreferenciadas e, quando possível, uplift de vendas nas regiões cobertas pela campanha.',
      },
      {
        q: 'Qual a diferença entre OOH digital e OOH estático?',
        a: 'OOH digital permite trocar o criativo em tempo real, segmentar por horário e contexto, e comprar de forma programática. OOH estático é mais barato por impressão mas sem essas vantagens.',
      },
      {
        q: 'OOH funciona para e-commerce sem loja física?',
        a: 'Sim. O OOH digital para e-commerce puro serve como canal de brand awareness — cria o primeiro ponto de contato que alimenta os canais de captação online.',
      },
    ],
    relatedSlugs: [
      'producao-conteudo-redes-sociais',
      'anuncios-social-first-conversao',
      'gestao-creators-influenciadores',
    ],
    seo: {
      title: 'OOH Digital para E-commerce | Ciclo E-commerce',
      description:
        'OOH Digital programático para e-commerces: painéis digitais segmentados por audiência e localização que amplificam sua presença de marca.',
      keywords: [
        'ooh digital ecommerce',
        'mídia out of home digital',
        'publicidade programática ooh',
        'painel digital ecommerce',
        'brand awareness ecommerce',
      ],
    },
  },

  // ── Captação de Demanda ───────────────────────────────────────────────────────
  {
    slug: 'anuncios-social-first-conversao',
    parentSlug: 'captacao-de-demanda',
    parentTitle: 'Captação de Demanda',
    title: 'Produção de Anúncios Social First para Conversão',
    tagline: 'Criativos que param o scroll e convertem — nativos para cada plataforma',
    heroHeadline: 'O criativo é o maior alavancador de resultado em mídia paga. E o mais ignorado.',
    heroDescription:
      'Produção e criação de anúncios no formato social first: concebidos para o comportamento nativo de cada plataforma, testados por dados e otimizados para conversão.',
    what: 'Anúncios social first são criativos concebidos para parecer e funcionar como conteúdo nativo de cada plataforma — não peças de banner adaptadas para o feed. Um Reel de anúncio social first tem gancho nos primeiros 2 segundos, narrativa autêntica e CTA integrado ao contexto.',
    why: 'O criativo é responsável por 60-70% do resultado de uma campanha de mídia paga, segundo estudos do Meta e Nielsen. A maioria das marcas investe pesado no budget de mídia e pouco na qualidade do criativo — e deixa uma enorme quantidade de resultado na mesa.',
    howItWorks: [
      {
        step: 'Análise de criativos atuais',
        detail:
          'Auditamos o histórico de criativos para identificar o que funcionou e por quê.',
      },
      {
        step: 'Mapeamento de ângulos',
        detail:
          'Definimos os ângulos de mensagem — benefício, prova social, urgência, identificação — que vão ser testados.',
      },
      {
        step: 'Produção de variações',
        detail:
          'Produzimos múltiplas variações de cada ângulo para teste A/B estruturado.',
      },
      {
        step: 'Teste e validação',
        detail:
          'Ativamos os criativos com budget de teste controlado e coletamos dados de performance.',
      },
      {
        step: 'Escala dos vencedores',
        detail:
          'Os criativos que passam no teste recebem budget maior; os perdedores são descontinuados ou ajustados.',
      },
    ],
    deliverables: [
      'Criativos em vídeo (Reels, TikTok, YouTube)',
      'Estáticos e carrosséis para feed',
      'UGC roteirizado e produzido',
      'Biblioteca de criativos testados',
      'Relatório de performance por criativo',
    ],
    results: [
      { metric: '2,3x', label: 'de ROAS médio com criativos social first vs. banner' },
      { metric: '-40%', label: 'de CPM com formatos nativos' },
      { metric: '+85%', label: 'de view-through rate em vídeo' },
      { metric: '60%', label: 'dos criativos validados tornam-se top performers' },
    ],
    examples: [
      {
        title: 'Marca de cosméticos',
        description:
          'Substituímos banners por UGC roteirizado. CTR subiu 3,2x e o ROAS foi de 1,8x para 4,1x em 60 dias.',
        highlight: 'ROAS +128%',
      },
      {
        title: 'E-commerce de moda',
        description:
          'Série de Reels "social first" com prova social. CPA caiu 44% em 45 dias.',
        highlight: 'CPA -44%',
      },
      {
        title: 'Suplementos',
        description:
          '12 variações de criativo testadas simultaneamente. O criativo vencedor gerou 70% das conversões da conta.',
        highlight: '70% das conversões',
      },
    ],
    faq: [
      {
        q: 'O que é "social first" na prática?',
        a: 'Social first significa que o criativo é pensado do zero para o comportamento do usuário na plataforma — não é uma adaptação de uma peça de outro canal. Um anúncio social first para TikTok tem o mesmo ritmo e estética dos vídeos orgânicos do feed; para Instagram, aproveita a identidade visual premium da plataforma.',
      },
      {
        q: 'Quantas variações de criativo são necessárias?',
        a: 'Recomendamos testar pelo menos 3-5 variações por ângulo de mensagem. Em contas com volume maior, trabalhamos com 10-20 variações simultâneas.',
      },
      {
        q: 'A Ciclo faz a produção ou só a estratégia?',
        a: 'Fazemos os dois — estratégia de ângulos, roteirização, direção criativa e produção completa. Para marcas com equipe interna de produção, entregamos o briefing criativo e supervisionamos a execução.',
      },
      {
        q: 'Em quanto tempo vejo resultado?',
        a: 'Os primeiros dados de performance chegam em 7-14 dias de teste. A escala dos criativos vencedores começa entre 3-6 semanas do início.',
      },
    ],
    relatedSlugs: ['meta-ads-tiktok-ads', 'google-ads-bing-ads', 'producao-conteudo-redes-sociais'],
    seo: {
      title: 'Produção de Anúncios Social First para E-commerce | Ciclo',
      description:
        'Criativos social first que convertem: anúncios para Meta, TikTok e Google produzidos para o comportamento nativo de cada plataforma.',
      keywords: [
        'criativo social first ecommerce',
        'produção de anúncios ecommerce',
        'ugc para anúncios',
        'criativo para meta ads',
        'anúncios que convertem ecommerce',
      ],
    },
  },
  {
    slug: 'google-ads-bing-ads',
    parentSlug: 'captacao-de-demanda',
    parentTitle: 'Captação de Demanda',
    title: 'Google Ads & Bing Ads para E-commerce',
    tagline: 'Capture a intenção de compra no exato momento em que ela acontece',
    heroHeadline: 'Seu produto na frente de quem já quer comprar',
    heroDescription:
      'Gestão especializada de Google Ads e Bing Ads para e-commerce: Search, Shopping, Performance Max e Display com estrutura e otimização que realmente eleva o ROAS.',
    what: 'Google Ads captura demanda existente — usuários que já estão buscando seu produto ou categoria. Para e-commerce, Search e Shopping são os canais de maior intenção de compra disponíveis. A Ciclo gerencia toda a operação: estrutura de campanhas, lances, audiências, criativos e otimização contínua.',
    why: 'Usuários que chegam via Google Search convertem 3 a 5 vezes mais que usuários de outras fontes, porque a busca indica intenção ativa. Uma operação de Google Ads bem estruturada é o canal de captação com melhor relação custo-benefício para a maioria dos e-commerces.',
    howItWorks: [
      {
        step: 'Auditoria e estruturação',
        detail:
          'Auditamos a conta atual (ou construímos do zero), corrigindo estrutura, palavras-chave negativas e configurações que desperdiçam budget.',
      },
      {
        step: 'Configuração de Shopping',
        detail:
          'Otimizamos o feed de produtos para maximizar a elegibilidade e a relevância no Google Shopping.',
      },
      {
        step: 'Campanhas Search e Performance Max',
        detail:
          'Estruturamos campanhas com segmentação precisa e lances otimizados para cada etapa do funil.',
      },
      {
        step: 'Otimização contínua',
        detail:
          'Ajustamos lances, pausamos keywords de baixo desempenho e testamos novos segmentos semanalmente.',
      },
      {
        step: 'Relatórios e atribuição',
        detail:
          'Configuramos atribuição correta e entregamos relatórios com visão de ROAS, CPA e participação de impressões.',
      },
    ],
    deliverables: [
      'Auditoria completa da conta Google Ads',
      'Estrutura de campanhas Search + Shopping + PMax',
      'Configuração de feed de produtos',
      'Gestão mensal com otimizações semanais',
      'Relatório de ROAS por campanha e categoria',
    ],
    results: [
      { metric: '4,2x', label: 'ROAS médio nas contas gerenciadas' },
      { metric: '-35%', label: 'de CPA após reestruturação' },
      { metric: '+60%', label: 'de participação de impressões em Search' },
      { metric: '92%', label: 'dos clientes renovam após o primeiro trimestre' },
    ],
    examples: [
      {
        title: 'E-commerce de eletrônicos',
        description:
          'Reestruturação completa de Shopping + PMax. ROAS foi de 2,1x para 5,3x em 90 dias.',
        highlight: 'ROAS +152%',
      },
      {
        title: 'Moda feminina',
        description:
          'Campanhas de Search com segmentação por intenção de compra. CPA caiu 42% mantendo o volume de vendas.',
        highlight: 'CPA -42%',
      },
      {
        title: 'Casa e decoração',
        description:
          'Performance Max com sinais de audiência otimizados. Receita atribuída cresceu 78% em 6 meses.',
        highlight: 'Receita +78%',
      },
    ],
    faq: [
      {
        q: 'Qual a diferença entre Search, Shopping e Performance Max?',
        a: 'Search captura buscas por palavras-chave específicas. Shopping exibe produtos com foto e preço diretamente nos resultados. Performance Max usa IA do Google para distribuir em todos os canais automaticamente. Para a maioria dos e-commerces, a combinação dos três com estratégias complementares é o mais eficiente.',
      },
      {
        q: 'Por que meu ROAS cai com o tempo?',
        a: 'ROAS cai por saturação de audiência, aumento de concorrência, mudanças de sazonalidade ou deterioração do feed de produtos. A manutenção ativa da conta — não só "deixar a IA rodar" — é o que mantém a performance estável.',
      },
      {
        q: 'Google Ads ou Meta Ads? Qual priorizar?',
        a: 'São canais complementares, não concorrentes. Google captura quem já quer comprar; Meta cria desejo em quem não está buscando. Para e-commerces com CAC alto, geralmente começamos com Google para estabilizar a aquisição e depois escalamos Meta.',
      },
      {
        q: 'O feed de produtos impacta o desempenho?',
        a: 'Enormemente. Um feed mal configurado — sem atributos corretos, imagens de baixa qualidade, preços desatualizados — desperdiça entre 30-50% do potencial do Google Shopping.',
      },
    ],
    relatedSlugs: ['meta-ads-tiktok-ads', 'anuncios-social-first-conversao', 'retail-media'],
    seo: {
      title: 'Google Ads para E-commerce | Ciclo E-commerce',
      description:
        'Gestão de Google Ads e Bing Ads para e-commerce: Search, Shopping e Performance Max com ROAS elevado e gestão especializada.',
      keywords: [
        'google ads ecommerce',
        'google shopping ecommerce',
        'performance max ecommerce',
        'gestão google ads',
        'roas google ads',
      ],
    },
  },
  {
    slug: 'meta-ads-tiktok-ads',
    parentSlug: 'captacao-de-demanda',
    parentTitle: 'Captação de Demanda',
    title: 'Meta Ads & TikTok Ads para E-commerce',
    tagline: 'Mídia social que cria demanda e converte com escala',
    heroHeadline: 'Meta e TikTok: onde seu cliente passa o tempo e onde você precisa estar',
    heroDescription:
      'Gestão estratégica de Meta Ads (Facebook + Instagram) e TikTok Ads para e-commerce: criativos social first, segmentação avançada e otimização orientada a ROAS e CAC.',
    what: 'Meta Ads e TikTok Ads são os dois principais canais de paid social para e-commerce. Diferentemente do Google, eles criam demanda — impactam usuários que não estão buscando, mas têm perfil de compra. A combinação de segmentação, criativo e otimização é o que separa as contas que escalam das que ficam presas.',
    why: 'Meta ainda é o canal de paid social com maior volume de dados e capacidade de segmentação para e-commerce. TikTok tem crescimento explosivo e CPMs ainda abaixo da média do mercado — a janela de eficiência está aberta agora. A Ciclo opera os dois com especialização profunda.',
    howItWorks: [
      {
        step: 'Auditoria e estratégia',
        detail:
          'Analisamos a conta atual, o histórico de criativos e a estrutura de campanhas para identificar gargalos.',
      },
      {
        step: 'Estrutura de funil em paid social',
        detail:
          'Desenhamos campanhas para cada etapa: awareness, consideração, conversão e retenção.',
      },
      {
        step: 'Criação e teste de criativos',
        detail:
          'Produzimos e testamos criativos social first com metodologia de variação estruturada.',
      },
      {
        step: 'Otimização de audiências',
        detail:
          'Refinamos as audiências com base em comportamento, lookalikes e dados first-party.',
      },
      {
        step: 'Escala e diversificação',
        detail:
          'Escalamos o que performa e diversificamos criativos para evitar fadiga de anúncio.',
      },
    ],
    deliverables: [
      'Estrutura de campanhas Meta + TikTok',
      'Criativos social first testados',
      'Segmentação avançada com dados first-party',
      'Gestão semanal com otimizações',
      'Relatório de ROAS, CAC e frequência',
    ],
    results: [
      { metric: '3,8x', label: 'ROAS médio em Meta Ads' },
      { metric: '-32%', label: 'de CAC após reestruturação' },
      { metric: '+197%', label: 'de faturamento com escala em TikTok' },
      { metric: '5x', label: 'de ROAS em campanhas com UGC' },
    ],
    examples: [
      {
        title: 'Marca de beleza',
        description:
          'Reestruturação de Meta Ads com foco em UGC e lookalike de compradores. ROAS foi de 1,9x para 4,2x.',
        highlight: 'ROAS +121%',
      },
      {
        title: 'Moda feminina',
        description:
          'Entrada no TikTok Ads com criativos social first. CAC 35% menor que Meta no mesmo período.',
        highlight: 'CAC TikTok -35%',
      },
      {
        title: 'Fitness e lifestyle',
        description:
          'Funil completo Meta: awareness com Reels + conversão com Dynamic Ads. Receita cresceu 89% em 4 meses.',
        highlight: 'Receita +89%',
      },
    ],
    faq: [
      {
        q: 'iOS 14 ainda afeta as campanhas do Meta?',
        a: 'Sim, a depreciação de cookies e as restrições de tracking do iOS 14 reduziram a precisão da atribuição no Meta. A solução é implementar a Conversions API (CAPI) para enviar dados server-side — o que melhora a qualidade do sinal e a otimização dos algoritmos.',
      },
      {
        q: 'TikTok Ads funciona para qualquer e-commerce?',
        a: 'TikTok Ads tem melhor performance em categorias de consumo visual — moda, beleza, saúde, casa, pet. Para produtos de nicho muito específico ou ticket muito alto (acima de R$500), o CPL pode ser alto demais para ser eficiente como canal de conversão direto.',
      },
      {
        q: 'Qual o budget mínimo para Meta Ads?',
        a: 'Para ter dados suficientes para otimização, recomendamos no mínimo R$3-5K/mês em Meta Ads. Abaixo disso, o volume de conversões é insuficiente para o algoritmo aprender. Mas o mais importante é a estrutura e os criativos — não só o volume de budget.',
      },
      {
        q: 'Como evitar a fadiga de anúncio?',
        a: 'Fadiga acontece quando a mesma audiência vê o mesmo criativo muitas vezes. A solução é renovar criativos com frequência (a cada 2-4 semanas), diversificar ângulos de mensagem e usar múltiplos formatos.',
      },
    ],
    relatedSlugs: [
      'anuncios-social-first-conversao',
      'google-ads-bing-ads',
      'tiktok-shop-social-commerce',
    ],
    seo: {
      title: 'Meta Ads e TikTok Ads para E-commerce | Ciclo E-commerce',
      description:
        'Gestão de Meta Ads e TikTok Ads para e-commerce com foco em ROAS, CAC e escala. Criativos social first e estratégia de funil completo.',
      keywords: [
        'meta ads ecommerce',
        'tiktok ads ecommerce',
        'facebook ads ecommerce',
        'instagram ads ecommerce',
        'gestão mídia social paga',
      ],
    },
  },
  {
    slug: 'programatica-pinterest-ads',
    parentSlug: 'captacao-de-demanda',
    parentTitle: 'Captação de Demanda',
    title: 'Programática & Pinterest Ads',
    tagline: 'Alcance premium onde seus concorrentes ainda não chegaram',
    heroHeadline: 'Expanda para canais que seus concorrentes ainda não dominam',
    heroDescription:
      'Publicidade programática e Pinterest Ads para e-commerces que querem diversificar a aquisição além de Meta e Google — com CPMs competitivos e audiências qualificadas.',
    what: 'Programática é a compra automatizada de espaços publicitários em milhares de sites e apps via DSPs (Demand Side Platforms). Pinterest Ads é a mídia paga da plataforma com maior intenção de compra do mundo — usuários que chegam para se inspirar e descobrir produtos.',
    why: 'Marcas que dependem exclusivamente de Meta e Google ficam reféns dos leilões disputados nesses canais. Diversificar para programática e Pinterest expande o alcance, reduz o CPM médio e chega a audiências que não são alcançadas pelos canais principais.',
    howItWorks: [
      {
        step: 'Diagnóstico de diversificação',
        detail:
          'Analisamos a concentração de canais atual e identificamos onde a diversificação traz maior impacto.',
      },
      {
        step: 'Estratégia por canal',
        detail:
          'Definimos objetivos, formatos e audiências específicos para programática e Pinterest.',
      },
      {
        step: 'Criação de materiais',
        detail:
          'Produzimos os criativos adequados para cada ambiente: display rich media, vídeo programático e Pins patrocinados.',
      },
      {
        step: 'Ativação e otimização',
        detail:
          'Ativamos as campanhas com segmentação por contexto, audiência e intenção.',
      },
      {
        step: 'Mensuração e atribuição',
        detail:
          'Integramos a mensuração com os outros canais para ter visão completa do funil.',
      },
    ],
    deliverables: [
      'Estratégia de diversificação de mídia',
      'Campanhas programáticas com segmentação contextual',
      'Pinterest Ads com catálogo de produtos',
      'Criativos adequados a cada formato',
      'Relatório de alcance incremental',
    ],
    results: [
      { metric: '-25%', label: 'de CPM médio vs. Meta/Google' },
      { metric: '+40%', label: 'de alcance com mesmo budget' },
      { metric: '3x', label: 'de intenção de compra no Pinterest' },
      { metric: '+18%', label: 'de receita incremental atribuída' },
    ],
    examples: [
      {
        title: 'E-commerce de casa e decoração',
        description:
          'Pinterest Shopping Ads com catálogo completo. 35% dos compradores eram novos para a marca.',
        highlight: '35% novos clientes',
      },
      {
        title: 'Marca de moda premium',
        description:
          'Programática em editorial fashion + retargeting. CPM 40% menor que Meta para a mesma audiência.',
        highlight: 'CPM -40%',
      },
      {
        title: 'Alimentos e bebidas',
        description:
          'Pinterest Ads em receitas relacionadas ao produto. CTR 2,8x maior que benchmark da categoria.',
        highlight: 'CTR 2,8x',
      },
    ],
    faq: [
      {
        q: 'O que é uma DSP?',
        a: 'DSP (Demand Side Platform) é uma plataforma que permite comprar espaços publicitários de forma programática em múltiplos publishers simultaneamente. Exemplos: DV360, The Trade Desk, Xandr.',
      },
      {
        q: 'Pinterest funciona para qualquer categoria de produto?',
        a: 'Pinterest tem melhor performance em categorias de descoberta: casa, decoração, moda, beleza, culinária, fitness, casamentos. Para produtos de nicho técnico ou B2B, o Pinterest raramente é um canal eficiente.',
      },
      {
        q: 'Qual a diferença entre programática e display do Google?',
        a: 'Display do Google (GDN) atinge sites na rede do Google. Programática acessa um inventário muito maior — incluindo publishers premium fora da rede do Google — com segmentação mais sofisticada por contexto e audiência.',
      },
    ],
    relatedSlugs: ['meta-ads-tiktok-ads', 'google-ads-bing-ads', 'anuncios-social-first-conversao'],
    seo: {
      title: 'Programática e Pinterest Ads para E-commerce | Ciclo',
      description:
        'Publicidade programática e Pinterest Ads para diversificar a aquisição do seu e-commerce além de Meta e Google.',
      keywords: [
        'publicidade programática ecommerce',
        'pinterest ads ecommerce',
        'dsp ecommerce',
        'diversificação mídia paga',
        'display ads ecommerce',
      ],
    },
  },
  {
    slug: 'retail-media',
    parentSlug: 'captacao-de-demanda',
    parentTitle: 'Captação de Demanda',
    title: 'Retail Media (Mercado Livre, Shopee, Amazon)',
    tagline: 'Anuncie onde o cliente já está com o cartão na mão',
    heroHeadline: 'O canal com maior taxa de conversão do e-commerce está nos marketplaces',
    heroDescription:
      'Gestão de Retail Media no Mercado Livre, Shopee e Amazon: anúncios dentro dos marketplaces onde o usuário já está em modo de compra — com taxas de conversão muito superiores ao tráfego externo.',
    what: 'Retail Media é a publicidade dentro de marketplaces como Mercado Livre, Shopee e Amazon. O diferencial é o contexto: o usuário já está em modo de compra, pesquisando produtos, comparando preços. A intenção de compra é máxima — o que resulta em taxas de conversão muito acima dos canais de tráfego externo.',
    why: 'No Brasil, Mercado Livre concentra mais de 40% das compras online. Shopee domina as categorias de preço baixo e médio. Amazon cresce aceleradamente no segmento premium. Quem não está anunciando nesses canais está deixando o competitor aparecer primeiro para seu próprio cliente.',
    howItWorks: [
      {
        step: 'Auditoria de presença nos marketplaces',
        detail:
          'Analisamos a saúde das listings, a share of voice e as oportunidades de melhoria.',
      },
      {
        step: 'Otimização de listings',
        detail:
          'Melhoramos títulos, descrições, imagens e atributos para maximizar a relevância orgânica.',
      },
      {
        step: 'Estratégia de Retail Media',
        detail:
          'Definimos os produtos, categorias e keywords prioritários para investimento em anúncios.',
      },
      {
        step: 'Ativação de campanhas',
        detail:
          'Configuramos e gerenciamos os anúncios em cada plataforma com otimização contínua.',
      },
      {
        step: 'Análise de rentabilidade',
        detail:
          'Monitoramos ACoS (Custo de Anúncio sobre Vendas), TACoS (custo total) e margem por produto.',
      },
    ],
    deliverables: [
      'Auditoria de presença nos marketplaces',
      'Otimização de listings (título, bullet points, imagens)',
      'Gestão de campanhas de Retail Media',
      'Análise de ACoS e rentabilidade por produto',
      'Relatório mensal de share of voice',
    ],
    results: [
      { metric: '+156%', label: 'de GMV em marketplaces após 6 meses' },
      { metric: '-30%', label: 'de ACoS após otimização de campanhas' },
      { metric: '1ª posição', label: 'em keywords estratégicas para 80% dos clientes' },
      { metric: '+44%', label: 'de tráfego orgânico com listings otimizados' },
    ],
    examples: [
      {
        title: 'Marca de beleza no Mercado Livre',
        description:
          'Reestruturação de listings + campanhas de Product Ads. GMV cresceu 124% em 4 meses.',
        highlight: 'GMV +124%',
      },
      {
        title: 'Eletrônicos na Amazon',
        description:
          'Otimização de listings + Sponsored Products. ACoS caiu de 28% para 12%.',
        highlight: 'ACoS -57%',
      },
      {
        title: 'Moda na Shopee',
        description:
          'Campanhas de Shopee Ads com foco em categorias de maior margem. Receita cresceu 89% em 3 meses.',
        highlight: 'Receita +89%',
      },
    ],
    faq: [
      {
        q: 'Retail Media é diferente de vender no marketplace?',
        a: 'Sim. Você pode vender no Mercado Livre sem anunciar e vice-versa. Retail Media são os anúncios dentro do marketplace para aumentar a visibilidade dos seus produtos. Mas para anunciar, você precisa ter a listing do produto na plataforma.',
      },
      {
        q: 'O que é ACoS?',
        a: 'ACoS (Advertising Cost of Sales) é a porcentagem das vendas que foi para pagamento de anúncios. ACoS de 15% significa que para cada R$100 vendidos, R$15 foram para anúncios. O ACoS ideal varia por categoria e margem do produto.',
      },
      {
        q: 'Mercado Livre, Shopee ou Amazon: qual priorizar?',
        a: 'Depende da categoria e do ticket médio. Mercado Livre domina volume geral. Shopee domina preço baixo e médio (especialmente moda e casa). Amazon domina eletrônicos e produtos premium. Para a maioria das marcas, Mercado Livre é o primeiro passo.',
      },
      {
        q: 'Como Retail Media e Google Ads se complementam?',
        a: 'Retail Media captura quem já está no marketplace; Google Shopping captura quem pesquisa no Google e pode ir para qualquer lugar (marketplace ou site próprio). São canais complementares — o usuário que não converte no Google pode ser capturado no Mercado Livre.',
      },
    ],
    relatedSlugs: ['google-ads-bing-ads', 'meta-ads-tiktok-ads', 'anuncios-social-first-conversao'],
    seo: {
      title: 'Retail Media - Mercado Livre, Shopee e Amazon | Ciclo E-commerce',
      description:
        'Gestão de Retail Media no Mercado Livre, Shopee e Amazon. Anúncios dentro dos marketplaces com as maiores taxas de conversão do e-commerce.',
      keywords: [
        'retail media ecommerce',
        'anúncios mercado livre',
        'amazon ads brasil',
        'shopee ads',
        'gestão marketplace ecommerce',
      ],
    },
  },

  // ── Expansão de Demanda ────────────────────────────────────────────────────────
  {
    slug: 'crm-email-sms-push-whatsapp',
    parentSlug: 'expansao-de-demanda',
    parentTitle: 'Expansão de Demanda',
    title: 'CRM: E-mail, SMS, Push e WhatsApp',
    tagline: 'Comunicação certa, canal certo, momento certo — em escala',
    heroHeadline: 'Transforme sua base de clientes em motor de receita recorrente',
    heroDescription:
      'CRM multicanal para e-commerce: e-mail, SMS, push notifications e WhatsApp integrados em uma estratégia que aumenta recompra, LTV e engajamento da base.',
    what: 'CRM para e-commerce é a estratégia de comunicação com clientes existentes usando múltiplos canais — e-mail, SMS, push e WhatsApp — para aumentar frequência de compra, ticket médio e tempo de retenção. É o canal de maior ROI disponível para e-commerces com base ativa.',
    why: 'E-mail marketing tem ROI médio de 4000% (R$40 para cada R$1 investido). WhatsApp tem taxa de abertura acima de 95%. A combinação dos dois canais com SMS e push cria uma cobertura de comunicação que captura clientes em diferentes contextos — com custo marginal quase zero.',
    howItWorks: [
      {
        step: 'Diagnóstico da base',
        detail:
          'Analisamos saúde da lista, segmentação atual e potencial de receita não capturado.',
      },
      {
        step: 'Estratégia multicanal',
        detail:
          'Definimos a função de cada canal: e-mail para nutrição, WhatsApp para urgência, push para reativação, SMS para transacional.',
      },
      {
        step: 'Segmentação avançada',
        detail:
          'Criamos segmentos baseados em comportamento de compra, RFM e ciclo de consumo.',
      },
      {
        step: 'Implementação de fluxos',
        detail: 'Configuramos as automações e campanhas em cada plataforma.',
      },
      {
        step: 'Mensuração de receita',
        detail:
          'Acompanhamos receita atribuída ao CRM, taxa de abertura, conversão e unsubscribe rate.',
      },
    ],
    deliverables: [
      'Estratégia multicanal (e-mail + WhatsApp + SMS + push)',
      'Segmentação RFM da base',
      'Fluxos de automação configurados',
      'Calendário de campanhas mensais',
      'Dashboard de receita atribuída ao CRM',
    ],
    results: [
      { metric: '42%', label: 'de receita atribuída ao CRM nos clientes Ciclo' },
      { metric: '+68%', label: 'de taxa de recompra após CRM ativo' },
      { metric: '95%', label: 'de taxa de abertura média no WhatsApp' },
      { metric: 'R$40', label: 'de receita para cada R$1 investido em e-mail' },
    ],
    examples: [
      {
        title: 'Marca de cosméticos',
        description:
          'CRM multicanal com 8 fluxos de automação. 38% da receita passou a ser atribuída ao CRM.',
        highlight: '38% receita CRM',
      },
      {
        title: 'Suplementos',
        description:
          'WhatsApp para lembrete de reposição + e-mail de novidades. LTV cresceu 2,4x em 12 meses.',
        highlight: 'LTV +140%',
      },
      {
        title: 'Moda feminina',
        description:
          'Segmentação por frequência de compra + SMS de reativação. Taxa de recompra de 30 dias subiu de 12% para 29%.',
        highlight: 'Recompra +142%',
      },
    ],
    faq: [
      {
        q: 'Qual plataforma de CRM a Ciclo recomenda?',
        a: 'Depende do canal prioritário e do volume da base. Klaviyo e RD Station para e-mail-first. Zenvia ou Twilio para WhatsApp em escala. Para bases menores, soluções integradas com plataformas de e-commerce (VTEX, Shopify, Nuvemshop) podem ser suficientes.',
      },
      {
        q: 'E-mail marketing ainda funciona?',
        a: 'Sim, e com ROI crescente. O segredo é segmentação e personalização — e-mails segmentados têm taxa de abertura 3x maior e conversão 5x maior que disparos em massa. O problema não é o canal; é a estratégia.',
      },
      {
        q: 'Como evitar o e-mail ir para spam?',
        a: 'Mantenha a lista limpa (remova inativos regularmente), use autenticação SPF/DKIM/DMARC, envie para segmentos engajados primeiro para aquecer o domínio, e evite palavras de spam e excesso de imagens.',
      },
      {
        q: 'WhatsApp Business API é diferente do WhatsApp normal?',
        a: 'Sim. O WhatsApp Business API permite envio em escala, automações e integrações com CRM — mas exige aprovação de templates pelo Meta e tem custo por mensagem. O WhatsApp comum não é escalável para CRM.',
      },
    ],
    relatedSlugs: [
      'reguas-automacao-personalizadas',
      'reativacao-fidelizacao',
      'programas-indicacao-reviews',
    ],
    seo: {
      title: 'CRM para E-commerce: E-mail, SMS, WhatsApp | Ciclo',
      description:
        'CRM multicanal para e-commerce: e-mail, SMS, push e WhatsApp integrados para aumentar recompra, LTV e receita recorrente.',
      keywords: [
        'crm ecommerce',
        'email marketing ecommerce',
        'whatsapp marketing ecommerce',
        'sms ecommerce',
        'fidelização clientes ecommerce',
      ],
    },
  },
  {
    slug: 'reguas-automacao-personalizadas',
    parentSlug: 'expansao-de-demanda',
    parentTitle: 'Expansão de Demanda',
    title: 'Réguas de Automação Personalizadas',
    tagline: 'Comunicação no momento certo, sem esforço manual',
    heroHeadline: 'Automações que trabalham por você enquanto você dorme',
    heroDescription:
      'Réguas de automação personalizadas para e-commerce: fluxos de e-mail, WhatsApp e SMS disparados por eventos do cliente que aumentam recompra e LTV no piloto automático.',
    what: 'Réguas de automação são sequências de mensagens disparadas automaticamente quando o cliente executa (ou deixa de executar) uma ação específica: comprou pela primeira vez, abandonou o carrinho, não comprou há X dias, aniversário, ciclo de reposição. Cada régua tem um objetivo claro e é mensurada individualmente.',
    why: 'Automações bem configuradas geram receita 24/7 sem intervenção manual. Um fluxo de boas-vindas bem construído pode gerar R$50-200 de receita adicional por novo cliente. Multiplicado pelo volume de aquisição, o impacto no faturamento é imediato.',
    howItWorks: [
      {
        step: 'Mapeamento da jornada',
        detail:
          'Identificamos todos os momentos de alta intenção na jornada do cliente: pós-compra, aniversário de compra, ciclo de reposição, inatividade.',
      },
      {
        step: 'Priorização de fluxos',
        detail:
          'Priorizamos os fluxos com maior potencial de receita incremental para implementar primeiro.',
      },
      {
        step: 'Copywriting e design',
        detail:
          'Criamos os textos e layouts de cada mensagem com foco em conversão.',
      },
      {
        step: 'Configuração técnica',
        detail:
          'Implementamos as automações na plataforma de CRM escolhida com triggers e condições precisas.',
      },
      {
        step: 'Teste e otimização',
        detail: 'Monitoramos a performance de cada fluxo e otimizamos continuamente.',
      },
    ],
    deliverables: [
      'Mapeamento de fluxos prioritários',
      'Copywriting de todas as mensagens',
      'Configuração técnica na plataforma',
      'Teste A/B de subject lines e CTAs',
      'Relatório de receita por automação',
    ],
    results: [
      { metric: 'R$180', label: 'de receita média por novo cliente via fluxo de boas-vindas' },
      { metric: '45%', label: 'de taxa de abertura média nos fluxos' },
      { metric: '+55%', label: 'de recompra com fluxo de ciclo de consumo' },
      { metric: '80%', label: 'dos clientes têm fluxo de reativação lucrativo em 30 dias' },
    ],
    examples: [
      {
        title: 'Skincare',
        description:
          'Fluxo de reposição disparado 25 dias após a compra de hidratante. Taxa de recompra subiu 48%.',
        highlight: 'Recompra +48%',
      },
      {
        title: 'Pet food',
        description:
          '7 fluxos configurados: boas-vindas, educação, reposição, aniversário, reativação, upsell, indicação. LTV cresceu 2,1x.',
        highlight: 'LTV +110%',
      },
      {
        title: 'Suplementos',
        description:
          'A/B test em subject lines: versão personalizada com nome teve 34% mais abertura e 28% mais conversão.',
        highlight: 'Conversão +28%',
      },
    ],
    faq: [
      {
        q: 'Qual a diferença entre régua de automação e campanha de e-mail?',
        a: 'Campanha é disparada para um segmento em uma data específica — promocional, newsletter, sazonalidade. Régua de automação é disparada por evento do cliente — compra, abandono, inatividade. As duas são complementares, mas as réguas tendem a ter performance muito superior por serem mais relevantes ao momento do cliente.',
      },
      {
        q: 'Quantos fluxos são necessários para começar?',
        a: 'Os 5 fluxos fundamentais são: boas-vindas (pós-cadastro), pós-compra (onboarding do produto), carrinho abandonado, reativação de inativos e reposição/ciclo de consumo. Com esses 5, a maioria dos e-commerces captura 80% do valor das automações.',
      },
      {
        q: 'Com qual frequência devo enviar nas automações?',
        a: 'Depende do fluxo. Boas-vindas pode ter 4-6 e-mails em 14 dias. Reposição, 1-2 e-mails no momento certo. O excesso de mensagens aumenta unsubscribes; a falta perde oportunidade. Testamos a frequência ideal para cada segmento.',
      },
      {
        q: 'A régua pode incluir múltiplos canais?',
        a: 'Sim — e as melhores incluem. Uma régua de reativação pode começar com e-mail, seguir com push notification se não houver abertura, e terminar com WhatsApp. A cobertura multicanal aumenta significativamente a taxa de alcance efetivo.',
      },
    ],
    relatedSlugs: [
      'crm-email-sms-push-whatsapp',
      'reativacao-fidelizacao',
      'programas-indicacao-reviews',
    ],
    seo: {
      title: 'Réguas de Automação para E-commerce | Ciclo E-commerce',
      description:
        'Automações de e-mail, WhatsApp e SMS para e-commerce que aumentam recompra e LTV no piloto automático.',
      keywords: [
        'automação de marketing ecommerce',
        'régua de automação ecommerce',
        'fluxo de email ecommerce',
        'automação crm ecommerce',
        'email automático ecommerce',
      ],
    },
  },
  {
    slug: 'reativacao-fidelizacao',
    parentSlug: 'expansao-de-demanda',
    parentTitle: 'Expansão de Demanda',
    title: 'Reativação e Programas de Fidelização',
    tagline: 'Traga de volta quem parou de comprar. Faça ficar quem ficou.',
    heroHeadline: 'Clientes inativos são receita esperando ser ativada',
    heroDescription:
      'Estratégias de reativação de clientes inativos e programas de fidelização para e-commerce que transformam compradores ocasionais em defensores de marca.',
    what: 'Reativação é a estratégia de trazer de volta clientes que compraram mas pararam de comprar. Fidelização é a estratégia de manter clientes ativos comprando com mais frequência e por mais tempo. As duas estratégias combinadas são o que eleva o LTV e reduz o churn da base.',
    why: 'Reativar um cliente existente custa de 5 a 7 vezes menos do que adquirir um novo. E marcas com programas de fidelização ativas têm taxa de recompra 40-60% maior que marcas sem. Os clientes mais rentáveis de qualquer e-commerce são os recorrentes — e eles precisam ser cultivados.',
    howItWorks: [
      {
        step: 'Análise de churn',
        detail:
          'Identificamos quando os clientes param de comprar e qual é o "ponto de não retorno" da base.',
      },
      {
        step: 'Segmentação de inativos',
        detail:
          'Segmentamos os inativos por tempo de inatividade, valor histórico e probabilidade de reativação.',
      },
      {
        step: 'Campanhas de reativação',
        detail:
          'Criamos campanhas específicas com incentivo calibrado — desconto, brinde, experiência — para cada segmento.',
      },
      {
        step: 'Programa de fidelização',
        detail:
          'Desenhamos e implementamos o programa de benefícios: pontos, cashback, acesso exclusivo.',
      },
      {
        step: 'Mensuração de incremento',
        detail:
          'Acompanhamos taxa de reativação, custo por cliente reativado e LTV pós-reativação.',
      },
    ],
    deliverables: [
      'Análise de churn e segmentação de inativos',
      'Campanhas de reativação por segmento',
      'Design e implementação de programa de fidelização',
      'Comunicação do programa para a base',
      'Relatório de taxa de reativação e LTV incremental',
    ],
    results: [
      { metric: '35%', label: 'de taxa de reativação média em inativos de até 90 dias' },
      { metric: '+60%', label: 'de frequência de compra com programa de fidelização' },
      { metric: '-40%', label: 'de churn com programa ativo' },
      { metric: '2,4x', label: 'de LTV de clientes participantes do programa vs. não participantes' },
    ],
    examples: [
      {
        title: 'Marca de moda',
        description:
          'Campanha de reativação com 3 segmentos por tempo de inatividade. 32% dos inativos de até 6 meses voltaram a comprar.',
        highlight: '32% reativação',
      },
      {
        title: 'Cosméticos DTC',
        description:
          'Programa de pontos simples (R$1 = 1 ponto, 100 pontos = R$10 de desconto). Frequência de compra subiu 48%.',
        highlight: 'Frequência +48%',
      },
      {
        title: 'Pet food premium',
        description:
          'Cashback de 5% para clientes com 3+ compras. Taxa de recompra em 60 dias foi de 18% para 41%.',
        highlight: 'Recompra +128%',
      },
    ],
    faq: [
      {
        q: 'Quando um cliente é considerado inativo?',
        a: 'Depende da categoria e do ciclo de compra do produto. Para beleza (ciclo de 30-45 dias), 90 dias sem comprar é inatividade. Para moda (ciclo de 60-90 dias), 180 dias é um parâmetro mais adequado. O importante é calcular o ciclo médio da sua base e usar isso como referência.',
      },
      {
        q: 'Qual modelo de fidelização funciona melhor para e-commerce?',
        a: 'Pontos acumulativos funcionam bem para e-commerces com frequência alta. Cashback é mais simples de comunicar e tem alta adesão. Benefícios de exclusividade (frete grátis, acesso antecipado, atendimento prioritário) são mais eficazes para segmentos premium. O modelo depende do ticket médio e do perfil do cliente.',
      },
      {
        q: 'Precisa de uma plataforma específica para o programa?',
        a: 'Para programas simples (pontos ou cashback), plataformas integradas ao e-commerce como Smile.io, Rivo ou soluções nativas do Shopify são suficientes. Para programas mais complexos com múltiplos canais, é necessária uma plataforma de fidelização dedicada.',
      },
      {
        q: 'Como comunicar o programa sem parecer spam?',
        a: 'A comunicação do programa deve aparecer em momentos de alta receptividade: pós-compra, aniversário, quando o cliente atinge um nível. A frequência de comunicação sobre o programa deve ser menor que as comunicações de conteúdo e produto.',
      },
    ],
    relatedSlugs: [
      'crm-email-sms-push-whatsapp',
      'reguas-automacao-personalizadas',
      'programas-indicacao-reviews',
    ],
    seo: {
      title: 'Reativação e Fidelização de Clientes para E-commerce | Ciclo',
      description:
        'Reativação de clientes inativos e programas de fidelização para e-commerce que aumentam LTV, frequência e retenção.',
      keywords: [
        'reativação de clientes ecommerce',
        'programa de fidelização ecommerce',
        'churn ecommerce',
        'ltv ecommerce',
        'retenção clientes ecommerce',
      ],
    },
  },
  {
    slug: 'programas-indicacao-reviews',
    parentSlug: 'expansao-de-demanda',
    parentTitle: 'Expansão de Demanda',
    title: 'Programas de Indicação e Reviews',
    tagline: 'Seus clientes são seu melhor canal de aquisição',
    heroHeadline: 'O cliente satisfeito que não indica é uma oportunidade perdida',
    heroDescription:
      'Programas de indicação (referral) e estratégias de reviews para e-commerce: transforme clientes satisfeitos em canal de aquisição com custo muito abaixo do CAC tradicional.',
    what: 'Programas de indicação incentivam clientes satisfeitos a recomendar a marca para amigos e familiares — com recompensa para ambos. Reviews estruturados geram prova social que aumenta a taxa de conversão do site. As duas estratégias usam a satisfação dos clientes existentes como ativo de crescimento.',
    why: 'Clientes indicados convertem 3-5x mais e têm LTV 25% maior que clientes adquiridos por canais pagos. E o custo de aquisição é uma fração do CAC tradicional. Reviews positivos aumentam a taxa de conversão em até 30% — e são ativos permanentes que trabalham por você.',
    howItWorks: [
      {
        step: 'Diagnóstico de NPS e satisfação',
        detail:
          'Avaliamos o NPS atual e identificamos os promotores da base — os mais propensos a indicar.',
      },
      {
        step: 'Design do programa de indicação',
        detail:
          'Definimos a mecânica, o incentivo (desconto, crédito, brinde) e a comunicação do programa.',
      },
      {
        step: 'Implementação técnica',
        detail: 'Configuramos a plataforma de referral integrada ao e-commerce.',
      },
      {
        step: 'Estratégia de reviews',
        detail:
          'Implementamos fluxo de solicitação de avaliação no momento certo pós-compra.',
      },
      {
        step: 'Amplificação e mensuração',
        detail:
          'Comunicamos o programa para a base ativa e monitoramos taxa de indicação, custo por cliente indicado e LTV.',
      },
    ],
    deliverables: [
      'Design e implementação do programa de indicação',
      'Configuração de plataforma de referral',
      'Fluxo de solicitação de reviews pós-compra',
      'Comunicação do programa para a base',
      'Relatório de indicações, reviews e CAC incremental',
    ],
    results: [
      { metric: '3-5x', label: 'mais conversão de clientes indicados' },
      { metric: '+25%', label: 'de LTV de clientes que vieram por indicação' },
      { metric: '-60%', label: 'de CAC via canal de indicação vs. mídia paga' },
      { metric: '+30%', label: 'de conversão com reviews ativos no site' },
    ],
    examples: [
      {
        title: 'Cosméticos DTC',
        description:
          'Programa "Indica e Ganha" com R$30 para quem indica e R$30 de desconto na primeira compra do indicado. 18% dos novos clientes em 3 meses vieram por indicação.',
        highlight: '18% via indicação',
      },
      {
        title: 'Pet food',
        description:
          'Fluxo de review automático 10 dias após a entrega. 42% dos clientes deixaram avaliação. Taxa de conversão do produto subiu 24%.',
        highlight: 'Conversão +24%',
      },
      {
        title: 'Moda feminina',
        description:
          'Programa de indicação com crédito acumulativo. Clientes indicadores compraram 3,2x mais que a base geral.',
        highlight: '3,2x mais compras',
      },
    ],
    faq: [
      {
        q: 'Qual é o melhor incentivo para um programa de indicação?',
        a: 'O incentivo bilateral — benefício tanto para quem indica quanto para o indicado — tem a maior taxa de conversão. Desconto na próxima compra é simples e efetivo. Crédito acumulativo funciona bem para e-commerces com alta frequência. O valor do incentivo deve ser calculado em relação ao CAC: se o CAC é R$80, um incentivo de R$30+R$30 ainda é muito vantajoso.',
      },
      {
        q: 'Como solicitar reviews sem parecer invasivo?',
        a: 'O timing é tudo. O melhor momento é entre 5 e 14 dias após a entrega — quando o cliente já usou o produto mas a experiência ainda está fresca. E-mail personalizado com foto do produto comprado tem 60% mais conversão que e-mail genérico.',
      },
      {
        q: 'Avaliações negativas prejudicam a marca?',
        a: 'Na verdade, avaliações negativas (gerenciadas corretamente) aumentam a credibilidade. Produtos com apenas notas 5 parecem fabricados. O importante é responder às avaliações negativas com empatia e solução — isso demonstra cuidado e converte visitantes céticos.',
      },
      {
        q: 'Como integrar o programa de indicação ao funil de aquisição?',
        a: 'O programa de indicação deve ser tratado como um canal de aquisição — com budget, CAC e LTV mensurados. Os clientes que chegam por indicação entram no mesmo funil de CRM e devem ser incentivados a também se tornarem indicadores.',
      },
    ],
    relatedSlugs: [
      'crm-email-sms-push-whatsapp',
      'reativacao-fidelizacao',
      'reguas-automacao-personalizadas',
    ],
    seo: {
      title: 'Programas de Indicação e Reviews para E-commerce | Ciclo',
      description:
        'Programas de indicação (referral) e estratégias de reviews para e-commerce. Transforme clientes em canal de aquisição.',
      keywords: [
        'programa de indicação ecommerce',
        'referral marketing ecommerce',
        'reviews ecommerce',
        'prova social ecommerce',
        'indicação de clientes',
      ],
    },
  },

  // ── Inteligência & Operação ───────────────────────────────────────────────────
  {
    slug: 'analytics-bi',
    parentSlug: 'inteligencia-e-operacao',
    parentTitle: 'Inteligência & Operação',
    title: 'Analytics & BI para E-commerce',
    tagline: 'Dados que respondem perguntas de negócio — não só dashboards bonitos',
    heroHeadline: 'Pare de tomar decisões no escuro. Comece a crescer por dados.',
    heroDescription:
      'Analytics e Business Intelligence para e-commerce: estruturação de dados, dashboards integrados e análises que transformam números em decisões de crescimento.',
    what: 'Analytics & BI para e-commerce é a estruturação de toda a infraestrutura de dados — coleta, integração, modelagem e visualização — para que as métricas certas estejam sempre disponíveis, confiáveis e acionáveis. Vai muito além do GA4.',
    why: 'Marcas que tomam decisões orientadas por dados crescem 2-3x mais rápido que as que operam no achismo. E a maior parte dos e-commerces tem dados — mas não tem a estrutura para aproveitá-los. A Ciclo transforma dados brutos em inteligência de negócio.',
    howItWorks: [
      {
        step: 'Auditoria de dados',
        detail:
          'Mapeamos todas as fontes de dados: e-commerce, ads, CRM, ERP — e identificamos gaps e inconsistências.',
      },
      {
        step: 'Implementação de tracking',
        detail:
          'Configuramos GA4, pixels de conversão e Conversions API para garantir dados precisos.',
      },
      {
        step: 'Data warehouse e integração',
        detail:
          'Integramos as fontes em um repositório centralizado (BigQuery, Snowflake ou similar).',
      },
      {
        step: 'Dashboards e relatórios',
        detail:
          'Construímos dashboards em Looker Studio, Power BI ou Tableau com os KPIs que importam.',
      },
      {
        step: 'Análises e insights',
        detail:
          'Fornecemos análises periódicas e alertas automáticos para oportunidades e anomalias.',
      },
    ],
    deliverables: [
      'Auditoria de tracking e dados',
      'Configuração de GA4 e pixels de conversão',
      'Dashboard integrado de performance',
      'Relatório mensal de insights e oportunidades',
      'Alertas automáticos de anomalias',
    ],
    results: [
      { metric: '-60%', label: 'de tempo em relatórios manuais com BI automatizado' },
      { metric: '+35%', label: 'de eficiência nas decisões de mídia com dados integrados' },
      { metric: '100%', label: 'de visibilidade do funil completo' },
      { metric: '2x', label: 'mais velocidade de identificação de oportunidades' },
    ],
    examples: [
      {
        title: 'E-commerce de moda',
        description:
          'BI integrado com GA4 + Meta + Google + CRM. Identificamos que mobile tinha 3x mais tráfego mas 0,3x da conversão — e corrigimos.',
        highlight: 'Mobile: conversão +180%',
      },
      {
        title: 'Suplementos',
        description:
          'Dashboard de cohortes de clientes. Identificamos que o canal YouTube trazia o cliente com maior LTV — e dobramos o investimento.',
        highlight: 'LTV YouTube 2,4x',
      },
      {
        title: 'Casa e decoração',
        description:
          'Alertas de anomalia identificaram queda de 40% na conversão de checkout por bug técnico em 2h. Sem o monitoramento, o bug duraria dias.',
        highlight: 'Bug identificado em 2h',
      },
    ],
    faq: [
      {
        q: 'GA4 é suficiente ou preciso de BI?',
        a: 'GA4 é excelente para dados de comportamento no site. Mas não integra com dados de CRM, ERP, marketplace e ads de forma nativa. Para ter uma visão completa do negócio — faturamento, margem, LTV por canal — é necessário um BI integrado.',
      },
      {
        q: 'Quanto tempo leva para implementar um BI?',
        a: 'Uma estrutura básica com dashboard integrado leva de 3 a 6 semanas. Uma estrutura completa com data warehouse, atribuição multicanal e análises avançadas pode levar de 2 a 4 meses.',
      },
      {
        q: 'O que é Conversions API e por que importa?',
        a: 'Conversions API (CAPI) é uma integração server-side que envia dados de conversão diretamente para o Meta e TikTok, sem depender de cookies ou pixels. Com iOS 14 e bloqueadores de anúncios, o CAPI recupera 15-30% das conversões que o pixel não captura.',
      },
      {
        q: 'Quais KPIs um e-commerce deve monitorar diariamente?',
        a: 'Os essenciais: receita, pedidos, ticket médio, taxa de conversão por dispositivo e canal, CAC por canal, ROAS por canal, e sessões vs. dia anterior. Semanalmente: LTV por coorte, churn de base ativa, e performance de CRM.',
      },
    ],
    relatedSlugs: ['processos-playbooks', 'growth-continuo', 'crm-email-sms-push-whatsapp'],
    seo: {
      title: 'Analytics e BI para E-commerce | Ciclo E-commerce',
      description:
        'Analytics & Business Intelligence para e-commerce: dashboards integrados, tracking preciso e dados que orientam decisões de crescimento.',
      keywords: [
        'analytics ecommerce',
        'business intelligence ecommerce',
        'bi para ecommerce',
        'dashboard ecommerce',
        'ga4 ecommerce',
      ],
    },
  },
  {
    slug: 'processos-playbooks',
    parentSlug: 'inteligencia-e-operacao',
    parentTitle: 'Inteligência & Operação',
    title: 'Processos e Playbooks para E-commerce',
    tagline: 'Crescimento que não depende de uma pessoa específica',
    heroHeadline: 'Escale sem o caos. Processe tudo que pode ser repetido.',
    heroDescription:
      'Estruturação de processos e playbooks para e-commerces em crescimento: documentação operacional que permite escalar com consistência, velocidade e sem dependência de conhecimento tácito.',
    what: 'Processos e Playbooks são a documentação dos fluxos operacionais do e-commerce — como lançar uma campanha, responder a uma queda de ROAS, contratar um creator, fazer uma live. Eles transformam conhecimento tácito (na cabeça das pessoas) em conhecimento explícito (documentado e replicável).',
    why: 'A maioria dos e-commerces que não escalam tem o mesmo problema: dependência crítica de 1-2 pessoas. Quando esse conhecimento está apenas na cabeça, a operação não escala, a qualidade é inconsistente e o risco de perda é enorme. Processos resolvem isso.',
    howItWorks: [
      {
        step: 'Mapeamento de processos críticos',
        detail:
          'Identificamos os processos que mais impactam o resultado e que mais dependem de conhecimento tácito.',
      },
      {
        step: 'Documentação estruturada',
        detail:
          'Criamos os playbooks com passo a passo, responsáveis, checklists e materiais de referência.',
      },
      {
        step: 'Revisão e validação',
        detail:
          'Testamos os processos documentados com a equipe para garantir que são claros e executáveis.',
      },
      {
        step: 'Treinamento e implementação',
        detail:
          'Treinamos a equipe no uso dos playbooks e os incorporamos à rotina operacional.',
      },
      {
        step: 'Atualização contínua',
        detail:
          'Revisamos e atualizamos os playbooks periodicamente ou após mudanças significativas.',
      },
    ],
    deliverables: [
      'Mapeamento dos processos críticos',
      'Playbooks documentados por área (mídia, conteúdo, CRM, operação)',
      'Checklists de execução',
      'Onboarding de novos colaboradores',
      'Treinamento da equipe',
    ],
    results: [
      { metric: '-50%', label: 'de tempo de onboarding de novos colaboradores' },
      { metric: '+40%', label: 'de consistência na execução de campanhas' },
      { metric: '3x', label: 'mais velocidade de escala operacional' },
      { metric: '-30%', label: 'de retrabalho com processos documentados' },
    ],
    examples: [
      {
        title: 'Agência de marketing parceira',
        description:
          'Playbooks de gestão de campanha reduziram o tempo de setup de nova conta de 3 semanas para 4 dias.',
        highlight: 'Setup -87%',
      },
      {
        title: 'E-commerce de moda',
        description:
          'Documentação do processo de lançamento de coleção. Time de 3 pessoas passou a executar o mesmo trabalho de uma equipe de 7.',
        highlight: 'Eficiência +133%',
      },
      {
        title: 'Marca de beleza DTC',
        description:
          'Playbook de gestão de creators: briefing, contratação, entrega, métricas. Consistência de campanha subiu drasticamente após implementação.',
        highlight: 'Consistência +200%',
      },
    ],
    faq: [
      {
        q: 'Quanto tempo leva para documentar os processos de um e-commerce?',
        a: 'Para os processos críticos (5-8 áreas), de 4 a 8 semanas. A documentação é iterativa — começamos pelos processos de maior impacto e expandimos ao longo do tempo.',
      },
      {
        q: 'Playbooks ficam desatualizados?',
        a: 'Sim, se não houver um processo de revisão. Recomendamos revisão trimestral dos playbooks de alta frequência e revisão semestral dos demais. A documentação não é um projeto — é uma prática contínua.',
      },
      {
        q: 'Como engajar a equipe na criação dos playbooks?',
        a: 'Os melhores playbooks são criados com a equipe — não para a equipe. Entrevistamos as pessoas que executam os processos, documentamos o que elas já fazem de forma excelente, e depois melhoramos. Isso gera adoção e senso de ownership.',
      },
      {
        q: 'Ferramenta específica para playbooks?',
        a: 'Notion, Confluence e Google Sites são as mais usadas. O importante é que a ferramenta seja acessível para toda a equipe e fácil de manter. Começamos com o que a empresa já usa antes de recomendar uma nova ferramenta.',
      },
    ],
    relatedSlugs: ['analytics-bi', 'growth-continuo', 'anuncios-social-first-conversao'],
    seo: {
      title: 'Processos e Playbooks para E-commerce | Ciclo E-commerce',
      description:
        'Estruturação de processos e playbooks para e-commerces que querem escalar com consistência e sem dependência de pessoas específicas.',
      keywords: [
        'processos ecommerce',
        'playbooks marketing digital',
        'documentação operacional ecommerce',
        'escalar ecommerce',
        'gestão de operação ecommerce',
      ],
    },
  },
  {
    slug: 'growth-continuo',
    parentSlug: 'inteligencia-e-operacao',
    parentTitle: 'Inteligência & Operação',
    title: 'Growth Contínuo',
    tagline: 'Crescimento sistemático por hipóteses, não por intuição',
    heroHeadline: 'Teste rápido, aprenda rápido, cresça de forma consistente',
    heroDescription:
      'Growth Contínuo: metodologia estruturada de experimentos de crescimento em ciclos curtos para e-commerces que querem escalar com previsibilidade.',
    what: 'Growth Contínuo é a prática estruturada de testar hipóteses de crescimento em ciclos curtos — semanas, não trimestres. Cada ciclo tem uma hipótese, um experimento com métricas claras, e uma conclusão que alimenta o próximo ciclo. É o método que separa e-commerces que crescem de forma consistente dos que crescem por sorte.',
    why: 'A maioria dos e-commerces testa pouco e tarda muito para aprender. Uma estrutura de growth com 4-5 testes por mês, ao longo de 12 meses, gera 48-60 aprendizados comprovados — que se acumulam em vantagem competitiva difícil de replicar.',
    howItWorks: [
      {
        step: 'Diagnóstico de gargalos',
        detail:
          'Identificamos os maiores limitantes de crescimento atual: onde o funil perde mais, onde há mais oportunidade.',
      },
      {
        step: 'Backlog de hipóteses',
        detail:
          'Construímos um banco de hipóteses priorizado por potencial de impacto, facilidade de implementação e dados disponíveis.',
      },
      {
        step: 'Sprint de experimentos',
        detail: 'Executamos os experimentos de maior prioridade em ciclos de 2 semanas.',
      },
      {
        step: 'Análise e decisão',
        detail: 'Analisamos os resultados e decidimos: escalar, iterar ou descartar.',
      },
      {
        step: 'Acumulação de aprendizados',
        detail: 'Documentamos os aprendizados para guiar os próximos ciclos.',
      },
    ],
    deliverables: [
      'Diagnóstico de gargalos do funil',
      'Backlog priorizado de hipóteses',
      'Execução de experimentos mensais',
      'Relatório de resultados por ciclo',
      'Base de conhecimento de aprendizados',
    ],
    results: [
      { metric: '4-6', label: 'experimentos por mês em média' },
      { metric: '+35%', label: 'de eficiência operacional após 6 meses' },
      { metric: '70%', label: 'das hipóteses validadas geram melhoria mensurável' },
      { metric: '2x', label: 'mais velocidade de crescimento vs. operações sem growth' },
    ],
    examples: [
      {
        title: 'E-commerce de fitness',
        description:
          '18 experimentos em 3 meses: checkout, criativos, landing pages, CRM. Conversão geral subiu 38%.',
        highlight: 'Conversão +38%',
      },
      {
        title: 'Marca de beleza',
        description:
          'Hipótese: adicionar chat no checkout reduz abandono. Teste de 2 semanas: taxa de abandono caiu 22%.',
        highlight: 'Abandono -22%',
      },
      {
        title: 'Alimentos DTC',
        description:
          'Teste de preço com 3 variações. Versão com preço 15% maior e descrição mais detalhada converteu 8% mais.',
        highlight: 'Receita +23%',
      },
    ],
    faq: [
      {
        q: 'O que é um "experimento de growth"?',
        a: 'É um teste controlado de uma hipótese de crescimento. Tem hipótese clara ("se fizermos X, Y vai melhorar em Z%"), grupo de controle, grupo de teste, métrica primária e duração definida. Ao final, você tem um resultado comprovado — não uma opinião.',
      },
      {
        q: 'Quanto tempo leva para ver resultados com growth?',
        a: 'Os primeiros resultados aparecem nos primeiros 30-45 dias, com os experimentos de maior impacto e menor complexidade. O valor acumulado fica evidente a partir de 3-6 meses, quando os aprendizados se somam.',
      },
      {
        q: 'Growth funciona para e-commerces pequenos?',
        a: 'Sim, mas a escala é diferente. E-commerces menores têm menos volume para testes estatisticamente significativos, então priorizamos experimentos de maior magnitude e aceitamos resultados com menor significância estatística.',
      },
      {
        q: 'A Ciclo faz growth junto com o time do cliente?',
        a: 'Sim. Growth Contínuo é sempre um trabalho conjunto: a Ciclo traz a metodologia, os dados e a análise; o time do cliente traz o conhecimento do produto, do cliente e da operação. O resultado é melhor quando as duas partes estão envolvidas.',
      },
    ],
    relatedSlugs: ['analytics-bi', 'processos-playbooks', 'anuncios-social-first-conversao'],
    seo: {
      title: 'Growth Contínuo para E-commerce | Ciclo E-commerce',
      description:
        'Metodologia de growth para e-commerce: experimentos em ciclos curtos que geram aprendizados e crescimento consistente.',
      keywords: [
        'growth hacking ecommerce',
        'growth contínuo ecommerce',
        'experimentos crescimento ecommerce',
        'metodologia growth ecommerce',
        'crescimento ecommerce',
      ],
    },
  },
]

export function getServicoBySlug(slug: string): Servico | undefined {
  return servicos.find((s) => s.slug === slug)
}

export function getAllServicoDados(): Servico[] {
  return servicos
}

export function getAllServicoSlugs(): string[] {
  return servicos.map((s) => s.slug)
}

export function getRelatedServicos(slugs: string[]): Servico[] {
  return slugs.map((slug) => servicos.find((s) => s.slug === slug)).filter(Boolean) as Servico[]
}
