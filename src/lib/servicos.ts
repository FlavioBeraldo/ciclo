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
        q: 'Como estruturar o investimento no canal?',
        a: 'A operação combina conteúdo e Lives com Shop Ads desde o início. O canal orgânico sustenta a descoberta, e a mídia escala o que já provou tração — essa combinação é o que transforma o TikTok Shop em canal de receita previsível, e não em ação pontual.',
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
      'gestao-creators-influenciadores',
      'meta-ads',
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
      'tiktok-shop-social-commerce',
      'meta-ads',
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

  // ── Captação de Demanda ───────────────────────────────────────────────────────
  {
    slug: 'creative-strategy',
    parentSlug: 'captacao-de-demanda',
    parentTitle: 'Captação de Demanda',
    title: 'Creative Strategy para E-commerce',
    tagline: 'Criamos anúncios vencedores para campanhas de performance',
    heroHeadline: 'Quando o algoritmo faz a segmentação, o criativo vira a segmentação',
    heroDescription:
      'Creative Strategy é a disciplina que planeja, produz e itera criativos com método e dados. Pesquisa de ângulos, matriz de teste, volume com consistência e leitura no nível do criativo — o motor que sustenta performance em campanhas automatizadas.',
    what: 'Creative Strategy é a operação que transforma criativo em alavanca de performance: ângulos nascidos de pesquisa real com clientes, produção em esteira contínua, testes isolados por variável e diagnóstico por hook rate e hold rate. Não é "arte que chega pronta para subir na conta" — é a variável que o anunciante ainda controla.',
    why: 'Advantage+ Shopping, Performance Max e GMV Max absorveram a segmentação, o lance e o posicionamento. O que sobrou sob controle direto da marca foi o criativo — e cada ângulo funciona como um filtro de audiência: o algoritmo observa quem responde e busca mais pessoas parecidas. Contas com criativos parecidos entre si segmentam para um único bolso de público, por maior que seja o alcance teórico da campanha.',
    howItWorks: [
      {
        step: 'Pesquisa antes da produção',
        detail:
          'Garimpamos avaliações de produto, conversas de SAC e WhatsApp, perguntas em anúncios e motivos de devolução para montar um banco vivo de ângulos em linguagem de cliente.',
      },
      {
        step: 'Diversificação de ângulos',
        detail:
          'Sustentamos de 4 a 6 teses de venda simultâneas no ar — dor resolvida, prova social, comparação, bastidor, autoridade e oferta —, não variações de cor e trilha.',
      },
      {
        step: 'Matriz de teste ângulo × formato × hook',
        detail:
          'Cada teste isola uma variável e tem critério de sucesso definido antes de subir. Primeiro validamos ângulos, depois formatos dentro dos vencedores, por último hooks.',
      },
      {
        step: 'Esteira de produção com volume',
        detail:
          'Pesquisa, roteirização em lote, produção social first com creators e UGC, edição em 3 a 5 variações e publicação com nomenclatura padronizada em dia fixo.',
      },
      {
        step: 'Diagnóstico e escala',
        detail:
          'Lemos hook rate, hold rate e conversão pós-clique para saber onde o criativo quebra, escalamos os vencedores e reciclamos os perdedores com aprendizado registrado.',
      },
    ],
    deliverables: [
      'Banco de ângulos alimentado por pesquisa da operação',
      'Matriz de teste ângulo × formato × hook preenchida',
      'Criativos social first: vídeo, UGC roteirizado, estáticos e carrosséis',
      'Esteira de produção com cadência semanal e nomenclatura padronizada',
      'Diagnóstico semanal por criativo (hook rate, hold rate, CPA por ângulo)',
    ],
    results: [
      { metric: '60-70%', label: 'do resultado de mídia paga explicado pelo criativo' },
      { metric: '2,3x', label: 'de ROAS com social first vs. peça adaptada' },
      { metric: '-40%', label: 'de CPM com formatos nativos' },
      { metric: '10-20%', label: 'do investimento reservado para teste estruturado' },
    ],
    examples: [
      {
        title: 'Marca de cosméticos',
        description:
          'O ângulo vencedor saiu das avaliações de produto: a recompra acontecia pela textura, não pelo resultado prometido. Substituímos banners por UGC roteirizado sobre esse insight.',
        highlight: 'ROAS +128%',
      },
      {
        title: 'E-commerce de moda',
        description:
          'Seis ângulos simultâneos no ar com matriz de teste semanal. A diversidade real de mensagem permitiu ao algoritmo expandir alcance sem degradar o custo.',
        highlight: 'CPA -44%',
      },
      {
        title: 'Suplementos',
        description:
          'Diagnóstico por hook rate revelou que 97% das pessoas não passavam de 3 segundos. Reescrevemos apenas as aberturas, mantendo o corpo dos vídeos.',
        highlight: '70% das conversões em 1 criativo',
      },
    ],
    faq: [
      {
        q: 'O que é creative strategy?',
        a: 'É a disciplina de planejar, produzir e otimizar criativos de anúncio com método e dados, tratando o criativo como principal alavanca de performance. Em campanhas automatizadas, em que a segmentação é feita pelo algoritmo a partir da resposta do público, é a mensagem que define quem será impactado.',
      },
      {
        q: 'Creative strategy substitui o gestor de tráfego?',
        a: 'Não — muda o foco do trabalho. A gestão de estrutura de conta, orçamento e leitura de dados continua existindo, mas a alavanca de crescimento migrou da configuração de públicos para a qualidade e a diversidade dos criativos. As duas frentes operam juntas.',
      },
      {
        q: 'Quantos criativos novos por mês a operação exige?',
        a: 'A referência varia com o investimento: de 8 a 12 criativos novos por mês em verbas até R$ 50 mil, de 15 a 25 entre R$ 50 e 150 mil, e de 30 a 40 ou mais acima disso. Quanto maior a verba, mais rápido a conta consome audiência e o estoque criativo envelhece.',
      },
      {
        q: 'Como vocês medem se um criativo funciona?',
        a: 'Antes do ROAS, lemos hook rate (quem assiste aos 3 primeiros segundos, referência acima de 25%), hold rate (quem fica até o fim) e conversão pós-clique. Essas três métricas mostram onde o criativo quebra — abertura, miolo ou página — duas semanas antes do resultado aparecer na receita.',
      },
      {
        q: 'A Ciclo faz a produção ou só a estratégia?',
        a: 'Fazemos os dois: estratégia de ângulos, roteirização, direção criativa e produção completa com creators e UGC. Para marcas com equipe interna de produção, entregamos o banco de ângulos, o briefing por criativo e a supervisão da execução.',
      },
    ],
    relatedSlugs: ['meta-ads', 'tiktok-ads', 'google-ads'],
    seo: {
      title: 'Creative Strategy para E-commerce | Ciclo E-commerce',
      description:
        'Creative Strategy para campanhas de performance: banco de ângulos, matriz de teste, esteira de produção e diagnóstico por hook rate. Criativos que sustentam escala em Meta, TikTok e Google.',
      keywords: [
        'creative strategy ecommerce',
        'criativos para performance',
        'produção de anúncios ecommerce',
        'ugc para anúncios',
        'teste de criativos meta ads',
      ],
    },
  },
  {
    slug: 'google-ads',
    parentSlug: 'captacao-de-demanda',
    parentTitle: 'Captação de Demanda',
    title: 'Google Ads para E-commerce',
    tagline: 'Capture a intenção de compra no momento exato em que ela acontece',
    heroHeadline: 'Seu produto na frente de quem já decidiu comprar',
    heroDescription:
      'Gestão especializada de Google Ads para e-commerce: Search, Shopping, Performance Max e Demand Gen com estrutura de conta, feed otimizado e leitura de incrementalidade que sustenta ROAS em escala.',
    what: 'Google Ads captura demanda existente — pessoas que já estão buscando seu produto ou categoria. Para e-commerce, Search e Shopping são os canais de maior intenção de compra disponíveis. A Ciclo opera a conta inteira: arquitetura de campanhas, feed de produtos, lances, audiências e otimização contínua.',
    why: 'Usuários que chegam via busca convertem de 3 a 5 vezes mais que outras fontes, porque a busca revela intenção ativa. Com a automação do Performance Max, a vantagem competitiva deixou de estar na configuração manual de lances e passou a estar na qualidade do feed, nos sinais de audiência e na disciplina de leitura de dados.',
    howItWorks: [
      {
        step: 'Auditoria e arquitetura de conta',
        detail:
          'Auditamos a conta (ou construímos do zero), corrigindo estrutura, negativas e configurações que drenam budget sem retorno.',
      },
      {
        step: 'Otimização do feed de produtos',
        detail:
          'Tratamos títulos, atributos, imagens e preços no Merchant Center — o feed é o que determina para quais buscas seu produto é elegível.',
      },
      {
        step: 'Search, Shopping e Performance Max',
        detail:
          'Distribuímos as campanhas por papel no funil, com sinais de audiência e exclusões que impedem o PMax de canibalizar a marca.',
      },
      {
        step: 'Otimização contínua',
        detail:
          'Ajustes semanais de lances, termos de busca, negativação e testes de novos segmentos com hipótese registrada.',
      },
      {
        step: 'Atribuição e incrementalidade',
        detail:
          'Configuramos a atribuição correta e separamos receita incremental de receita que viria de qualquer forma.',
      },
    ],
    deliverables: [
      'Auditoria completa da conta e do Merchant Center',
      'Arquitetura Search + Shopping + Performance Max',
      'Feed de produtos otimizado e monitorado',
      'Gestão mensal com otimizações semanais',
      'Relatório de ROAS, CPA e participação de impressões por categoria',
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
          'Reestruturação completa de Shopping + Performance Max com feed reescrito. ROAS foi de 2,1x para 5,3x em 90 dias.',
        highlight: 'ROAS +152%',
      },
      {
        title: 'Moda feminina',
        description:
          'Search segmentado por intenção de compra e negativação agressiva de termos genéricos. CPA caiu 42% mantendo volume.',
        highlight: 'CPA -42%',
      },
      {
        title: 'Casa e decoração',
        description:
          'Performance Max com sinais de audiência de first-party e exclusão de marca. Receita atribuída cresceu 78% em 6 meses.',
        highlight: 'Receita +78%',
      },
    ],
    faq: [
      {
        q: 'Qual a diferença entre Search, Shopping e Performance Max?',
        a: 'Search captura buscas por palavras-chave específicas. Shopping exibe produto, foto e preço direto no resultado. Performance Max usa a IA do Google para distribuir em todos os inventários automaticamente. Para a maioria dos e-commerces, a combinação dos três com papéis complementares é o mais eficiente — o erro comum é deixar o PMax competir com a própria marca.',
      },
      {
        q: 'Por que meu ROAS cai com o tempo?',
        a: 'Por saturação de audiência, aumento de concorrência no leilão, sazonalidade ou deterioração do feed. A manutenção ativa da conta — e não "deixar a IA rodar" — é o que mantém a performance estável.',
      },
      {
        q: 'O feed de produtos impacta mesmo o desempenho?',
        a: 'Enormemente. Um feed sem atributos corretos, com imagens fracas ou preços desatualizados desperdiça entre 30% e 50% do potencial do Shopping. É o primeiro lugar onde mexemos em qualquer conta.',
      },
      {
        q: 'Google Ads ou Meta Ads: qual priorizar?',
        a: 'São complementares. Google captura quem já quer comprar; Meta cria desejo em quem não está buscando. Em operações com CAC alto, normalmente estabilizamos a aquisição no Google antes de escalar o paid social.',
      },
    ],
    relatedSlugs: ['bing-ads', 'meta-ads', 'creative-strategy'],
    seo: {
      title: 'Gestão de Google Ads para E-commerce | Ciclo E-commerce',
      description:
        'Gestão de Google Ads para e-commerce: Search, Shopping, Performance Max e Demand Gen com feed otimizado, atribuição correta e ROAS elevado.',
      keywords: [
        'google ads ecommerce',
        'google shopping ecommerce',
        'performance max ecommerce',
        'gestão google ads',
        'agência google ads ecommerce',
      ],
    },
  },
  {
    slug: 'bing-ads',
    parentSlug: 'captacao-de-demanda',
    parentTitle: 'Captação de Demanda',
    title: 'Bing Ads (Microsoft Advertising) para E-commerce',
    tagline: 'O canal de busca que seus concorrentes esqueceram de disputar',
    heroHeadline: 'Menos disputa no leilão, mesma intenção de compra',
    heroDescription:
      'Gestão de Microsoft Advertising para e-commerce: Search e Shopping na rede Bing, Yahoo e Edge, com CPCs consistentemente abaixo do Google e público de maior poder aquisitivo.',
    what: 'Microsoft Advertising (antigo Bing Ads) é a plataforma de busca paga da rede Microsoft: Bing, Yahoo, DuckDuckGo, AOL e a barra de pesquisa do Windows e do Edge. Opera com a mesma lógica de intenção do Google — Search e Shopping —, mas com uma fração da concorrência no leilão.',
    why: 'O volume é menor, mas a eficiência compensa: CPCs costumam ficar de 30% a 50% abaixo do Google para as mesmas palavras-chave, e o perfil demográfico da rede Microsoft concentra usuários corporativos e de maior renda. Para operações que já saturaram o leilão do Google, é receita incremental com estrutura que pode ser importada em dias.',
    howItWorks: [
      {
        step: 'Importação e limpeza',
        detail:
          'Importamos a estrutura validada do Google Ads e refazemos o que não se traduz bem: negativas, correspondências e extensões próprias da rede Microsoft.',
      },
      {
        step: 'Feed no Microsoft Merchant Center',
        detail:
          'Configuramos e mantemos o feed de produtos para habilitar Shopping, com atributos ajustados às regras da plataforma.',
      },
      {
        step: 'Calibragem de lances',
        detail:
          'Reajustamos lances para o leilão real da rede — copiar o CPC do Google é o erro que faz a conta parecer ineficiente.',
      },
      {
        step: 'Segmentação por dispositivo e audiência',
        detail:
          'Exploramos os diferenciais da plataforma: segmentação por empresa, cargo e setor no LinkedIn, além de audiências de remarketing.',
      },
      {
        step: 'Leitura de incrementalidade',
        detail:
          'Medimos se a receita do canal é adicional ou canibalizada do Google antes de decidir a escala do investimento.',
      },
    ],
    deliverables: [
      'Conta Microsoft Advertising estruturada e importada',
      'Feed configurado no Microsoft Merchant Center',
      'Campanhas Search + Shopping com lances calibrados',
      'Gestão mensal com otimizações quinzenais',
      'Relatório comparativo de eficiência vs. Google Ads',
    ],
    results: [
      { metric: '-38%', label: 'de CPC médio vs. Google nas mesmas keywords' },
      { metric: '+12%', label: 'de receita incremental sem aumentar verba total' },
      { metric: '5,1x', label: 'ROAS médio em Shopping na rede Microsoft' },
      { metric: '48h', label: 'para ter a conta no ar via importação' },
    ],
    examples: [
      {
        title: 'Eletrônicos e informática',
        description:
          'Importação da estrutura de Search com lances recalibrados. O canal passou a responder por 9% da receita de mídia com CPA 34% menor.',
        highlight: 'CPA -34%',
      },
      {
        title: 'Móveis e decoração',
        description:
          'Shopping na rede Microsoft para o catálogo de ticket alto, onde o público corporativo converte melhor.',
        highlight: 'ROAS 6,4x',
      },
      {
        title: 'Suprimentos B2B',
        description:
          'Segmentação por setor e porte de empresa, exclusiva da plataforma, aplicada sobre as keywords de maior margem.',
        highlight: 'Receita +21%',
      },
    ],
    faq: [
      {
        q: 'Vale a pena anunciar no Bing no Brasil?',
        a: 'Vale quando a operação já tem Google Ads maduro e busca receita incremental com eficiência. O volume é menor que o do Google, mas o custo por clique também é — e a estrutura pode ser importada, o que torna o teste barato e rápido.',
      },
      {
        q: 'Preciso recriar as campanhas do zero?',
        a: 'Não. A importação traz a estrutura do Google, mas ela precisa de ajuste: lances calibrados para o leilão da rede, revisão de correspondências e negativas próprias. Importar e deixar rodando é o que faz muita conta concluir, erradamente, que o canal não funciona.',
      },
      {
        q: 'Quanto do budget devo destinar ao canal?',
        a: 'Começamos com um percentual de teste sobre a verba de busca e escalamos conforme a leitura de incrementalidade. O canal costuma se acomodar entre 5% e 15% do investimento em busca, dependendo da categoria.',
      },
      {
        q: 'O público do Bing é diferente do Google?',
        a: 'Sim. A rede Microsoft concentra usuários em ambiente corporativo, faixa etária mais alta e maior renda média — o que favorece categorias de ticket alto, B2B e produtos técnicos.',
      },
    ],
    relatedSlugs: ['google-ads', 'meta-ads', 'creative-strategy'],
    seo: {
      title: 'Gestão de Bing Ads (Microsoft Ads) para E-commerce | Ciclo',
      description:
        'Gestão de Microsoft Advertising para e-commerce: Search e Shopping na rede Bing com CPC menor que o Google e receita incremental comprovada.',
      keywords: [
        'bing ads ecommerce',
        'microsoft advertising brasil',
        'gestão bing ads',
        'bing shopping ecommerce',
        'anunciar no bing',
      ],
    },
  },
  {
    slug: 'meta-ads',
    parentSlug: 'captacao-de-demanda',
    parentTitle: 'Captação de Demanda',
    title: 'Meta Ads para E-commerce',
    tagline: 'A maior máquina de criar demanda do varejo online',
    heroHeadline: 'Facebook e Instagram: onde a demanda nasce antes da busca',
    heroDescription:
      'Gestão de Meta Ads para e-commerce na era do Advantage+: arquitetura de conta enxuta, criativo como segmentação, sinais de first-party e leitura de incrementalidade além do ROAS do gerenciador.',
    what: 'Meta Ads reúne Facebook, Instagram, Messenger e Audience Network — o maior inventário de paid social para e-commerce no Brasil. Diferente da busca, o canal cria demanda: impacta quem não está procurando, mas tem perfil e comportamento de compra. A Ciclo opera estrutura, criativo e mensuração como um sistema único.',
    why: 'Com Advantage+ Shopping, a plataforma absorveu a segmentação e o lance. O que decide o resultado hoje é a qualidade do criativo, a integridade dos sinais enviados (CAPI, eventos, catálogo) e a capacidade de ler incrementalidade — porque o ROAS do gerenciador superestima a contribuição do canal quando o remarketing é agressivo.',
    howItWorks: [
      {
        step: 'Auditoria de conta e sinais',
        detail:
          'Analisamos estrutura, histórico de criativos, qualidade de eventos, CAPI, deduplicação e catálogo antes de mexer em qualquer campanha.',
      },
      {
        step: 'Consolidação da estrutura',
        detail:
          'Reduzimos a fragmentação de campanhas e conjuntos para concentrar aprendizado — contas picotadas nunca saem da fase de aprendizagem.',
      },
      {
        step: 'Criativo como segmentação',
        detail:
          'Sustentamos ângulos diversos no ar em cadência semanal, porque é a mensagem que define o público que o algoritmo vai buscar.',
      },
      {
        step: 'First-party e públicos',
        detail:
          'Alimentamos a conta com listas de clientes, eventos de valor e sinais de audiência para orientar a automação com dado próprio.',
      },
      {
        step: 'Escala com leitura de incrementalidade',
        detail:
          'Escalamos com testes de geo holdout e blended CAC, separando o que é receita nova do que viria de qualquer forma.',
      },
    ],
    deliverables: [
      'Auditoria de conta, pixel, CAPI e catálogo',
      'Arquitetura de campanhas Advantage+ e manuais',
      'Cadência semanal de criativos testados',
      'Públicos first-party e sinais de audiência configurados',
      'Relatório de ROAS, CAC blended, frequência e incrementalidade',
    ],
    results: [
      { metric: '3,8x', label: 'ROAS médio nas contas gerenciadas' },
      { metric: '-32%', label: 'de CAC após reestruturação' },
      { metric: '5x', label: 'de ROAS em campanhas com UGC' },
      { metric: '+40%', label: 'de eventos recuperados com CAPI bem implementada' },
    ],
    examples: [
      {
        title: 'Marca de beleza',
        description:
          'Reestruturação com foco em UGC e lookalike de compradores de alto valor, com CAPI corrigida e deduplicação de eventos.',
        highlight: 'ROAS +121%',
      },
      {
        title: 'Moda feminina',
        description:
          'Consolidação de 14 campanhas fragmentadas em 3 estruturas Advantage+. O aprendizado concentrado derrubou o CPA em 6 semanas.',
        highlight: 'CPA -38%',
      },
      {
        title: 'Casa e utilidades',
        description:
          'Teste de geo holdout revelou que 22% da receita atribuída não era incremental. A verba foi realocada para topo de funil.',
        highlight: 'Receita real +18%',
      },
    ],
    faq: [
      {
        q: 'Devo usar Advantage+ Shopping ou campanhas manuais?',
        a: 'Advantage+ tende a vencer em contas com bom volume de eventos, catálogo saudável e estoque criativo diverso. Campanhas manuais seguem úteis para prospecção de nicho, lançamentos e controle de públicos sensíveis. Na prática, operamos as duas com papéis definidos.',
      },
      {
        q: 'Quantos criativos preciso manter no ar?',
        a: 'Depende da verba: quanto maior o investimento, mais rápido a conta consome audiência e o criativo fadiga. A referência é de 8 a 12 criativos novos por mês em verbas menores, chegando a 30 ou mais acima de R$ 150 mil mensais.',
      },
      {
        q: 'O ROAS do gerenciador é confiável?',
        a: 'É um indicador, não a verdade. O modelo de atribuição da Meta credita ao canal conversões que aconteceriam de qualquer forma, sobretudo em remarketing. Trabalhamos com CAC blended e testes de holdout para calibrar a leitura.',
      },
      {
        q: 'Por que minha conta vive em fase de aprendizagem?',
        a: 'Normalmente por fragmentação: muitos conjuntos dividindo poucos eventos, edições frequentes que reiniciam o aprendizado e orçamento espalhado. Consolidar estrutura costuma resolver mais que trocar de segmentação.',
      },
    ],
    relatedSlugs: ['tiktok-ads', 'creative-strategy', 'google-ads'],
    seo: {
      title: 'Gestão de Meta Ads para E-commerce | Ciclo E-commerce',
      description:
        'Gestão de Meta Ads (Facebook e Instagram) para e-commerce: Advantage+, CAPI, criativo como segmentação e leitura de incrementalidade além do ROAS do gerenciador.',
      keywords: [
        'meta ads ecommerce',
        'gestão de facebook ads',
        'instagram ads ecommerce',
        'advantage+ shopping',
        'agência meta ads ecommerce',
      ],
    },
  },
  {
    slug: 'tiktok-ads',
    parentSlug: 'captacao-de-demanda',
    parentTitle: 'Captação de Demanda',
    title: 'TikTok Ads para E-commerce',
    tagline: 'CPM abaixo da média e a janela de eficiência ainda aberta',
    heroHeadline: 'O canal onde o criativo nativo ainda compra atenção barata',
    heroDescription:
      'Gestão de TikTok Ads para e-commerce: Smart+, GMV Max, Spark Ads com creators e produção nativa. Estrutura, criativo e mensuração para transformar alcance em receita.',
    what: 'TikTok Ads é a plataforma de mídia do maior ambiente de descoberta de produto do país. Opera com vídeo nativo, Spark Ads sobre conteúdo de creators e campanhas automatizadas como Smart+ e GMV Max, que conectam mídia e catálogo dentro do próprio app.',
    why: 'O CPM do TikTok segue abaixo da média de mercado e a competição por inventário ainda é menor que no Meta — mas a plataforma pune o criativo que parece anúncio. Quem produz nativo compra atenção mais barata; quem adapta peça de outro canal paga caro por alcance que não converte.',
    howItWorks: [
      {
        step: 'Diagnóstico de conta e pixel',
        detail:
          'Validamos pixel, Events API e catálogo antes de escalar — sinal quebrado no TikTok degrada a automação mais rápido que em outras plataformas.',
      },
      {
        step: 'Produção nativa e Spark Ads',
        detail:
          'Produzimos vídeo no ritmo do feed e ativamos Spark Ads sobre conteúdo de creators, que carrega prova social e histórico de engajamento.',
      },
      {
        step: 'Estrutura Smart+ e GMV Max',
        detail:
          'Distribuímos verba entre campanhas automatizadas e manuais, com metas de ROI definidas por linha de produto.',
      },
      {
        step: 'Ciclo de teste de hooks',
        detail:
          'Testamos aberturas em série: no TikTok, os 3 primeiros segundos decidem o custo de toda a campanha.',
      },
      {
        step: 'Escala e reciclagem',
        detail:
          'Escalamos vencedores, reciclamos ângulos com novas execuções e monitoramos fadiga por frequência e queda de hook rate.',
      },
    ],
    deliverables: [
      'Conta estruturada com pixel e Events API validados',
      'Produção de vídeo nativo e UGC roteirizado',
      'Spark Ads com creators licenciados',
      'Campanhas Smart+ / GMV Max com metas por linha',
      'Relatório de ROAS, CPM, hook rate e fadiga de criativo',
    ],
    results: [
      { metric: '+197%', label: 'de faturamento com escala no canal' },
      { metric: '-45%', label: 'de CPM vs. média de paid social' },
      { metric: '3,4x', label: 'ROAS médio com Spark Ads de creators' },
      { metric: '25-30%', label: 'de hook rate nos criativos vencedores' },
    ],
    examples: [
      {
        title: 'Marca de suplementos',
        description:
          'Spark Ads sobre conteúdo de 12 creators, com os vídeos de melhor retenção orgânica virando anúncio.',
        highlight: 'ROAS 4,6x',
      },
      {
        title: 'Moda jovem',
        description:
          'Série de hooks testados sobre o mesmo corpo de vídeo. A abertura vencedora reduziu o CPA da conta inteira.',
        highlight: 'CPA -41%',
      },
      {
        title: 'Beleza e skincare',
        description:
          'Migração gradual para GMV Max com meta de ROI por categoria, mantendo campanhas manuais para lançamento.',
        highlight: 'GMV +132%',
      },
    ],
    faq: [
      {
        q: 'TikTok Ads funciona para qualquer categoria?',
        a: 'Funciona melhor em categorias com apelo visual e demonstração: beleza, moda, casa, alimentos e acessórios. Produtos técnicos ou de ticket muito alto costumam usar o canal como topo de funil, direcionando para o site em vez de fechar no app.',
      },
      {
        q: 'Qual a diferença entre TikTok Ads e TikTok Shop?',
        a: 'TikTok Ads é a plataforma de mídia paga, que pode levar tráfego para o seu site ou para a loja no app. TikTok Shop é a operação de venda nativa dentro do TikTok, com checkout, afiliados e Lives — a Ciclo tem uma frente dedicada a ela.',
      },
      {
        q: 'Posso reaproveitar os criativos do Meta?',
        a: 'Pode, mas raramente compensa. O TikTok penaliza a peça que parece anúncio de outra plataforma: marca d’água, ritmo de edição e locução de propaganda derrubam a retenção. Vale reaproveitar o ângulo, não o arquivo.',
      },
      {
        q: 'O que é Spark Ads?',
        a: 'É o formato que transforma uma publicação orgânica de creator em anúncio, mantendo os comentários, os likes e o perfil de origem. Entrega prova social real e costuma render CPM e retenção melhores que o criativo de marca.',
      },
    ],
    relatedSlugs: ['meta-ads', 'tiktok-shop-social-commerce', 'creative-strategy'],
    seo: {
      title: 'Gestão de TikTok Ads para E-commerce | Ciclo E-commerce',
      description:
        'Gestão de TikTok Ads para e-commerce: Smart+, GMV Max, Spark Ads com creators e produção de vídeo nativo com CPM abaixo da média de mercado.',
      keywords: [
        'tiktok ads ecommerce',
        'gestão de tiktok ads',
        'spark ads creators',
        'gmv max tiktok',
        'agência tiktok ads',
      ],
    },
  },
  {
    slug: 'programatica',
    parentSlug: 'captacao-de-demanda',
    parentTitle: 'Captação de Demanda',
    title: 'Mídia Programática para E-commerce',
    tagline: 'Alcance fora do duopólio, com controle de onde sua marca aparece',
    heroHeadline: 'Seu público não vive só dentro de Meta e Google',
    heroDescription:
      'Compra programática via DSP para e-commerce: display, vídeo, CTV e áudio com curadoria de inventário, brand safety e mensuração de incrementalidade real.',
    what: 'Programática é a compra automatizada de inventário publicitário em milhares de sites, apps, TVs conectadas e plataformas de áudio por meio de uma DSP. A operação reúne curadoria de inventário, dados de audiência, controle de frequência e verificação de visibilidade — não é apenas "comprar display barato".',
    why: 'Marcas que dependem exclusivamente de Meta e Google ficam reféns de dois leilões cada vez mais disputados e de um teto de alcance. A programática expande o alcance incremental, reduz o CPM médio da operação e permite comprar atenção em ambientes premium — inclusive CTV, onde o e-commerce brasileiro ainda está subrepresentado.',
    howItWorks: [
      {
        step: 'Estratégia e curadoria de inventário',
        detail:
          'Definimos onde a marca pode e não pode aparecer, com allowlists, blocklists e deals privados com publishers relevantes.',
      },
      {
        step: 'Construção de audiências',
        detail:
          'Combinamos dados first-party, modelagem de lookalike e segmentos contextuais, sem depender de cookies de terceiros.',
      },
      {
        step: 'Ativação multiformato',
        detail:
          'Distribuímos entre display, vídeo, CTV e áudio conforme o papel de cada formato na jornada.',
      },
      {
        step: 'Brand safety e verificação',
        detail:
          'Monitoramos visibilidade, fraude e adjacência de conteúdo com ferramentas de verificação independentes.',
      },
      {
        step: 'Medição de incrementalidade',
        detail:
          'Rodamos testes de holdout para provar quanto da receita é adicional — programática mal medida vira crédito indevido de last click.',
      },
    ],
    deliverables: [
      'Estratégia de canais, formatos e curadoria de inventário',
      'Setup de DSP com audiências e deals privados',
      'Criativos adaptados por formato (display, vídeo, CTV, áudio)',
      'Relatório de visibilidade, frequência e brand safety',
      'Teste de incrementalidade com leitura de receita adicional',
    ],
    results: [
      { metric: '-25%', label: 'de CPM médio vs. Meta e Google' },
      { metric: '+40%', label: 'de alcance incremental com a mesma verba' },
      { metric: '+18%', label: 'de receita incremental atribuída em teste de holdout' },
      { metric: '>70%', label: 'de taxa de visibilidade no inventário curado' },
    ],
    examples: [
      {
        title: 'Casa e decoração',
        description:
          'Display e vídeo em inventário curado de publishers de decoração, com frequência controlada por usuário.',
        highlight: 'CPM -31%',
      },
      {
        title: 'Moda premium',
        description:
          'CTV como topo de funil em lançamento de coleção, medido por lift de busca por marca.',
        highlight: 'Busca por marca +64%',
      },
      {
        title: 'Alimentos e bebidas',
        description:
          'Segmentos contextuais em portais de gastronomia substituindo público baseado em cookie de terceiro.',
        highlight: 'Alcance +52%',
      },
    ],
    faq: [
      {
        q: 'Programática não é só display barato?',
        a: 'Não. Display é um dos formatos; a programática abrange vídeo, CTV e áudio, com curadoria de inventário e verificação. O que separa uma operação séria de "impressão barata" é a decisão sobre onde aparecer, com que frequência e como medir.',
      },
      {
        q: 'Como medir resultado de programática?',
        a: 'Por incrementalidade, não por last click. Rodamos testes de holdout geográfico e acompanhamos lift de busca por marca e de tráfego direto — modelos de último clique sistematicamente subestimam canais de topo de funil.',
      },
      {
        q: 'O fim do cookie de terceiros inviabiliza o canal?',
        a: 'Não, muda a matéria-prima. A operação passou a se apoiar em dados first-party, segmentos contextuais e identificadores próprios das DSPs. Quem já tinha base própria estruturada ganhou vantagem relativa.',
      },
      {
        q: 'Qual verba mínima faz sentido?',
        a: 'Programática exige volume para sair do ruído estatístico e acessar deals relevantes. Trabalhamos o canal como camada complementar de operações que já têm busca e paid social maduros, e não como primeiro canal de mídia.',
      },
    ],
    relatedSlugs: ['pinterest-ads', 'meta-ads', 'google-ads'],
    seo: {
      title: 'Mídia Programática para E-commerce | Ciclo E-commerce',
      description:
        'Mídia programática para e-commerce: display, vídeo, CTV e áudio via DSP com curadoria de inventário, brand safety e medição de incrementalidade.',
      keywords: [
        'mídia programática ecommerce',
        'dsp ecommerce brasil',
        'ctv para ecommerce',
        'programática display vídeo',
        'agência de programática',
      ],
    },
  },
  {
    slug: 'pinterest-ads',
    parentSlug: 'captacao-de-demanda',
    parentTitle: 'Captação de Demanda',
    title: 'Pinterest Ads para E-commerce',
    tagline: 'A plataforma onde a descoberta já nasce com intenção de compra',
    heroHeadline: 'Onde as pessoas planejam o que vão comprar',
    heroDescription:
      'Gestão de Pinterest Ads para e-commerce: catálogo, Pins de produto e campanhas de conversão em uma plataforma de descoberta com janela de decisão longa e CPM baixo.',
    what: 'Pinterest é um buscador visual em que as pessoas salvam ideias para projetos futuros — reforma, casamento, viagem, guarda-roupa. A mídia paga aparece de forma nativa entre os resultados, com catálogo integrado e Pins compráveis, alcançando o usuário na fase de planejamento.',
    why: 'O comportamento do Pinterest é diferente do feed social: o usuário chega buscando inspiração para uma decisão de compra, e o conteúdo salvo continua gerando tráfego meses depois. Isso dá ao canal uma cauda de resultado que nenhuma outra mídia paga entrega, com competição de leilão ainda baixa no Brasil.',
    howItWorks: [
      {
        step: 'Integração de catálogo',
        detail:
          'Conectamos o feed de produtos para habilitar Pins de produto, coleções e campanhas de Shopping.',
      },
      {
        step: 'Pesquisa de termos e tendências',
        detail:
          'Usamos as tendências da própria plataforma para mapear a sazonalidade da categoria com antecedência — o Pinterest antecipa a intenção em semanas.',
      },
      {
        step: 'Criativo vertical e editorial',
        detail:
          'Produzimos Pins no formato e na estética da plataforma: imagem vertical, contexto de uso e texto legível.',
      },
      {
        step: 'Estrutura por etapa de jornada',
        detail:
          'Separamos campanhas de descoberta, consideração e conversão, com métricas próprias para cada etapa.',
      },
      {
        step: 'Otimização e cauda longa',
        detail:
          'Acompanhamos o desempenho pago e o efeito orgânico residual dos Pins salvos, que segue gerando tráfego após a campanha.',
      },
    ],
    deliverables: [
      'Catálogo integrado e Pins de produto ativos',
      'Pesquisa de termos e calendário de sazonalidade da categoria',
      'Produção de Pins verticais no padrão da plataforma',
      'Campanhas por etapa de jornada com metas distintas',
      'Relatório de conversão assistida e tráfego residual',
    ],
    results: [
      { metric: '3x', label: 'de intenção de compra vs. média de social' },
      { metric: '-34%', label: 'de CPM vs. paid social tradicional' },
      { metric: '+28%', label: 'de tráfego residual após o fim da campanha' },
      { metric: '2-4 meses', label: 'de janela de planejamento antecipada pela plataforma' },
    ],
    examples: [
      {
        title: 'Casa e decoração',
        description:
          'Catálogo completo em Pins de produto, ativado com dois meses de antecedência sobre a sazonalidade de reforma.',
        highlight: 'ROAS 5,2x',
      },
      {
        title: 'Moda feminina',
        description:
          'Coleções por ocasião de uso, alinhadas às buscas de guarda-roupa de estação identificadas nas tendências.',
        highlight: 'CPA -29%',
      },
      {
        title: 'Papelaria e presentes',
        description:
          'Campanha de descoberta no período pré-festas, com Pins que continuaram gerando tráfego na temporada seguinte.',
        highlight: 'Tráfego residual +36%',
      },
    ],
    faq: [
      {
        q: 'Pinterest Ads funciona para e-commerce no Brasil?',
        a: 'Funciona especialmente bem em categorias visuais e de projeto: casa, decoração, moda, beleza, festas e papelaria. A base brasileira cresceu de forma consistente e o leilão segue menos disputado que Meta e Google.',
      },
      {
        q: 'Quanto tempo leva para ver resultado?',
        a: 'A conversão direta aparece em semanas, mas a característica do canal é a cauda: Pins salvos continuam entregando tráfego e vendas por meses. Avaliar o Pinterest apenas pela janela de 7 dias subestima o retorno real.',
      },
      {
        q: 'Preciso produzir criativo exclusivo?',
        a: 'Sim, e é barato de fazer. O formato vertical com produto em contexto de uso e texto legível tem desempenho muito superior ao de peças reaproveitadas de outras plataformas.',
      },
      {
        q: 'O canal serve para topo ou fundo de funil?',
        a: 'Para os dois, com papéis distintos. A descoberta alimenta o planejamento de compra; as campanhas de Shopping com catálogo capturam quem já definiu o que quer. A estrutura separa as duas leituras.',
      },
    ],
    relatedSlugs: ['programatica', 'meta-ads', 'creative-strategy'],
    seo: {
      title: 'Gestão de Pinterest Ads para E-commerce | Ciclo E-commerce',
      description:
        'Gestão de Pinterest Ads para e-commerce: catálogo integrado, Pins de produto e campanhas por etapa de jornada com alta intenção de compra e CPM baixo.',
      keywords: [
        'pinterest ads ecommerce',
        'gestão de pinterest ads',
        'pins de produto catálogo',
        'anunciar no pinterest brasil',
        'pinterest para loja virtual',
      ],
    },
  },
  {
    slug: 'mercado-livre-ads',
    parentSlug: 'captacao-de-demanda',
    parentTitle: 'Captação de Demanda',
    title: 'Mercado Livre Ads para E-commerce',
    tagline: 'O maior marketplace da América Latina, disputado no detalhe',
    heroHeadline: 'Quem aparece primeiro no Mercado Livre leva a venda',
    heroDescription:
      'Gestão de Product Ads e Brand Ads no Mercado Livre: estrutura de campanhas por ACoS-alvo, otimização de anúncios, reputação e giro para vencer o leilão e o algoritmo de relevância.',
    what: 'Mercado Livre Ads é a mídia paga dentro do maior marketplace do país: Product Ads na busca e nas páginas de produto, Brand Ads para marcas e display interno. A operação vai além do leilão — posição orgânica, reputação, preço, Mercado Envios Full e giro alimentam o mesmo algoritmo de relevância.',
    why: 'O Mercado Livre concentra a maior fatia das compras online no Brasil, e o usuário chega com o cartão na mão: a intenção é máxima e a jornada termina ali. Não anunciar no canal significa entregar a primeira posição para o concorrente na frente do seu próprio cliente.',
    howItWorks: [
      {
        step: 'Diagnóstico de catálogo e reputação',
        detail:
          'Auditamos títulos, fichas técnicas, fotos, preço, reputação e tipo de anúncio — mídia não corrige listing ruim, só amplifica o problema.',
      },
      {
        step: 'Estrutura de Product Ads por ACoS-alvo',
        detail:
          'Separamos campanhas por margem e estágio do produto, com ACoS-alvo distinto para lançamento, manutenção e liquidação.',
      },
      {
        step: 'Otimização de relevância orgânica',
        detail:
          'Trabalhamos atributos, variações e Mercado Envios Full para melhorar a posição orgânica, que reduz a dependência de mídia.',
      },
      {
        step: 'Gestão de leilão e sazonalidade',
        detail:
          'Ajustamos lances por competitividade real da categoria e preparamos a operação para picos como Hot Sale e Black Friday.',
      },
      {
        step: 'Leitura de rentabilidade',
        detail:
          'Medimos ACoS, TACoS e margem por SKU para separar volume que dá lucro de volume que só queima verba.',
      },
    ],
    deliverables: [
      'Auditoria de listings, reputação e competitividade',
      'Estrutura de Product Ads segmentada por ACoS-alvo',
      'Otimização de títulos, atributos e fichas técnicas',
      'Calendário de campanhas para datas sazonais do canal',
      'Relatório de ACoS, TACoS e rentabilidade por SKU',
    ],
    results: [
      { metric: '+156%', label: 'de GMV no canal após 6 meses' },
      { metric: '-30%', label: 'de ACoS após reestruturação de campanhas' },
      { metric: '1ª posição', label: 'em keywords estratégicas para 80% dos clientes' },
      { metric: '+44%', label: 'de tráfego orgânico com listings otimizados' },
    ],
    examples: [
      {
        title: 'Marca de beleza',
        description:
          'Reestruturação de Product Ads com ACoS-alvo por linha de produto e correção de fichas técnicas.',
        highlight: 'GMV +156%',
      },
      {
        title: 'Utilidades domésticas',
        description:
          'Migração para Mercado Envios Full combinada com mídia nos SKUs de maior giro.',
        highlight: 'ACoS -35%',
      },
      {
        title: 'Ferramentas e construção',
        description:
          'Campanhas específicas para Hot Sale com controle de margem por SKU durante o pico.',
        highlight: 'Receita +92% no período',
      },
    ],
    faq: [
      {
        q: 'O que é ACoS e qual é um bom número?',
        a: 'ACoS é o investimento em mídia dividido pela receita gerada por ela. O número saudável depende da margem do produto: em categorias de margem apertada, um ACoS de 8% a 12% já pressiona o lucro; em margens maiores, 20% pode ser rentável. Por isso trabalhamos com ACoS-alvo por SKU, não com uma meta única.',
      },
      {
        q: 'Anunciar melhora minha posição orgânica?',
        a: 'Indiretamente, sim. Mídia gera visitas, vendas e avaliações, e esses sinais alimentam a relevância orgânica do anúncio. Mas o efeito só se sustenta se o listing, o preço e a logística estiverem competitivos.',
      },
      {
        q: 'Vale a pena usar Mercado Envios Full?',
        a: 'Na maioria das categorias, sim. O selo Full melhora a posição, a conversão e a experiência de prazo, e reduz o custo de mídia necessário para o mesmo volume de vendas.',
      },
      {
        q: 'Retail Media substitui o Google Ads?',
        a: 'Não, complementa. O marketplace captura quem já está decidido a comprar dentro dele; o Google captura a busca aberta e leva tráfego para a sua loja própria, onde a margem e o dado do cliente ficam com você.',
      },
    ],
    relatedSlugs: ['shopee-ads', 'amazon-ads', 'google-ads'],
    seo: {
      title: 'Gestão de Mercado Livre Ads | Ciclo E-commerce',
      description:
        'Gestão de Mercado Livre Ads: Product Ads e Brand Ads com estrutura por ACoS-alvo, otimização de listings e leitura de rentabilidade por SKU.',
      keywords: [
        'mercado livre ads',
        'product ads mercado livre',
        'acos mercado livre',
        'agência mercado livre',
        'anunciar no mercado livre',
      ],
    },
  },
  {
    slug: 'shopee-ads',
    parentSlug: 'captacao-de-demanda',
    parentTitle: 'Captação de Demanda',
    title: 'Shopee Ads para E-commerce',
    tagline: 'Volume, giro e disputa de preço no marketplace que mais cresce',
    heroHeadline: 'Onde o volume se conquista no leilão e na operação',
    heroDescription:
      'Gestão de Shopee Ads: Busca, Descoberta e Loja com estrutura por margem, participação em campanhas da plataforma e controle de rentabilidade em um canal movido a giro.',
    what: 'Shopee Ads reúne os formatos de mídia dentro da Shopee: anúncios de busca por palavra-chave, anúncios de descoberta em vitrines e recomendações, e anúncios de loja. O canal opera em uma lógica própria, em que campanhas da plataforma, cupons e frete grátis influenciam tanto o resultado quanto o lance.',
    why: 'A Shopee consolidou-se como o marketplace de maior crescimento no Brasil, forte em ticket baixo e médio e em compra por impulso. O público é sensível a preço e a promoção, o que exige uma gestão que enxergue mídia, cupom e frete como um único custo de aquisição.',
    howItWorks: [
      {
        step: 'Diagnóstico de catálogo e preço',
        detail:
          'Avaliamos competitividade de preço, avaliações, taxa de resposta e prazo — fatores que a plataforma pondera antes do lance.',
      },
      {
        step: 'Estrutura por formato',
        detail:
          'Separamos Busca (intenção declarada), Descoberta (impulso) e Loja, cada um com meta e leitura próprias.',
      },
      {
        step: 'Calendário de campanhas da plataforma',
        detail:
          'Planejamos participação nas datas duplas e campanhas oficiais, quando o tráfego do canal multiplica.',
      },
      {
        step: 'Gestão integrada de cupom e frete',
        detail:
          'Tratamos mídia, cupom e subsídio de frete como um custo único de aquisição, evitando a ilusão de ACoS baixo com margem negativa.',
      },
      {
        step: 'Controle de rentabilidade',
        detail:
          'Monitoramos margem por SKU e cortamos rapidamente o que gira sem lucro, mesmo com bom volume.',
      },
    ],
    deliverables: [
      'Auditoria de catálogo, preço e indicadores de loja',
      'Campanhas de Busca, Descoberta e Loja estruturadas',
      'Planejamento das datas e campanhas oficiais da plataforma',
      'Gestão integrada de mídia, cupons e frete',
      'Relatório de ACoS, margem por SKU e participação por formato',
    ],
    results: [
      { metric: '+128%', label: 'de GMV em 6 meses de operação estruturada' },
      { metric: '-27%', label: 'de custo de aquisição somando mídia, cupom e frete' },
      { metric: '3,2x', label: 'de tráfego nas datas duplas com planejamento antecipado' },
      { metric: '+38%', label: 'de conversão com listings e avaliações trabalhados' },
    ],
    examples: [
      {
        title: 'Acessórios e bijuterias',
        description:
          'Campanhas de Descoberta para giro de catálogo combinadas com cupom controlado por faixa de margem.',
        highlight: 'GMV +128%',
      },
      {
        title: 'Moda básica',
        description:
          'Preparação antecipada para data dupla com estoque, preço e verba definidos por SKU.',
        highlight: 'Receita 3,2x no período',
      },
      {
        title: 'Casa e organização',
        description:
          'Corte de SKUs que giravam com margem negativa após leitura integrada de mídia e subsídios.',
        highlight: 'Margem +19 p.p.',
      },
    ],
    faq: [
      {
        q: 'Shopee funciona para marca com ticket médio mais alto?',
        a: 'A força do canal está em ticket baixo e médio, onde a compra por impulso é frequente. Marcas de ticket mais alto costumam usar a Shopee para linhas de entrada e giro de catálogo, mantendo o portfólio premium em outros canais.',
      },
      {
        q: 'Como o cupom afeta a leitura de resultado?',
        a: 'Diretamente. Uma campanha pode mostrar ACoS excelente e ainda assim dar prejuízo se o cupom e o subsídio de frete não entrarem na conta. Medimos sempre o custo de aquisição completo, não apenas o gasto de mídia.',
      },
      {
        q: 'Vale participar das campanhas oficiais da plataforma?',
        a: 'Vale quando há preparação: estoque, preço competitivo e verba planejada. Entrar em data dupla sem preparo costuma gerar ruptura de estoque, atraso e queda de reputação, que custam caro depois.',
      },
      {
        q: 'Qual a diferença entre anúncio de Busca e de Descoberta?',
        a: 'Busca atende quem já digitou o que quer, com intenção declarada e conversão maior. Descoberta aparece em vitrines e recomendações, alcança compra por impulso e é o formato que sustenta volume no canal.',
      },
    ],
    relatedSlugs: ['mercado-livre-ads', 'amazon-ads', 'tiktok-shop-social-commerce'],
    seo: {
      title: 'Gestão de Shopee Ads | Ciclo E-commerce',
      description:
        'Gestão de Shopee Ads: campanhas de Busca, Descoberta e Loja com leitura integrada de mídia, cupom e frete e controle de margem por SKU.',
      keywords: [
        'shopee ads',
        'anunciar na shopee',
        'gestão shopee ads',
        'acos shopee',
        'agência shopee marketplace',
      ],
    },
  },
  {
    slug: 'amazon-ads',
    parentSlug: 'captacao-de-demanda',
    parentTitle: 'Captação de Demanda',
    title: 'Amazon Ads para E-commerce',
    tagline: 'Buy Box, conteúdo A+ e o leilão mais técnico do varejo online',
    heroHeadline: 'Na Amazon, quem domina o detalhe domina a categoria',
    heroDescription:
      'Gestão de Amazon Ads: Sponsored Products, Brands e Display com estrutura por match type, conteúdo A+, disputa de Buy Box e leitura de TACoS.',
    what: 'Amazon Ads engloba Sponsored Products, Sponsored Brands e Sponsored Display dentro do marketplace. O canal é o mais técnico entre os retail medias: exige domínio de correspondências de palavra-chave, ASIN targeting, conteúdo da página de produto e a disputa pela Buy Box, que define quem recebe a venda.',
    why: 'A Amazon cresce com força no segmento premium brasileiro e concentra um público fiel, com alta recorrência via Prime. É o canal em que a qualidade da página de produto — títulos, bullets, conteúdo A+ e avaliações — influencia diretamente o custo da mídia, porque a plataforma premia relevância com leilão mais barato.',
    howItWorks: [
      {
        step: 'Auditoria de listing e Buy Box',
        detail:
          'Revisamos títulos, bullets, imagens, conteúdo A+ e as condições que determinam a posse da Buy Box.',
      },
      {
        step: 'Estrutura por correspondência',
        detail:
          'Separamos campanhas automáticas de manuais e organizamos exata, frase e ampla com papéis distintos de descoberta e colheita.',
      },
      {
        step: 'ASIN targeting e defesa de marca',
        detail:
          'Atacamos páginas de concorrentes e defendemos as próprias, evitando que a verba do concorrente converta no seu detalhe de produto.',
      },
      {
        step: 'Sponsored Brands e Display',
        detail:
          'Usamos os formatos de marca para capturar categoria e remarketing dentro e fora do marketplace.',
      },
      {
        step: 'Leitura de TACoS',
        detail:
          'Acompanhamos TACoS — mídia sobre receita total, não só a atribuída — para saber se a mídia está construindo posição orgânica ou apenas sustentando vendas.',
      },
    ],
    deliverables: [
      'Auditoria de listings, conteúdo A+ e Buy Box',
      'Estrutura de Sponsored Products por correspondência',
      'Campanhas de ASIN targeting ofensivas e defensivas',
      'Sponsored Brands e Display ativados por objetivo',
      'Relatório de ACoS, TACoS e participação orgânica por ASIN',
    ],
    results: [
      { metric: '4,7x', label: 'de ROAS médio em Sponsored Products' },
      { metric: '-26%', label: 'de TACoS com ganho de posição orgânica' },
      { metric: '+63%', label: 'de conversão após conteúdo A+ reformulado' },
      { metric: '+41%', label: 'de participação de Buy Box em SKUs disputados' },
    ],
    examples: [
      {
        title: 'Eletrônicos',
        description:
          'Reestruturação por correspondência com colheita de termos das campanhas automáticas para as exatas.',
        highlight: 'ACoS -31%',
      },
      {
        title: 'Suplementos e saúde',
        description:
          'Conteúdo A+ reformulado com foco em objeções de compra, reduzindo o custo do leilão por ganho de relevância.',
        highlight: 'Conversão +63%',
      },
      {
        title: 'Cuidados pessoais',
        description:
          'ASIN targeting defensivo nas páginas próprias para bloquear a mídia do concorrente no momento da decisão.',
        highlight: 'Receita defendida +28%',
      },
    ],
    faq: [
      {
        q: 'Qual a diferença entre ACoS e TACoS?',
        a: 'ACoS mede o investimento sobre a receita gerada pela mídia. TACoS mede o investimento sobre a receita total do produto, incluindo a orgânica. TACoS caindo com vendas subindo é o sinal de que a mídia está construindo posição orgânica sustentável.',
      },
      {
        q: 'O que é a Buy Box e por que ela importa?',
        a: 'É a caixa de compra que define qual vendedor recebe o pedido quando vários ofertam o mesmo produto. Sem a Buy Box, o anúncio perde eficiência drasticamente — por isso preço, prazo, estoque e reputação entram na estratégia de mídia.',
      },
      {
        q: 'Preciso de conteúdo A+?',
        a: 'Para categorias competitivas, sim. O conteúdo A+ melhora a conversão da página, e conversão melhor significa leilão mais barato: a Amazon favorece anúncios que convertem, reduzindo o custo por clique necessário para a mesma posição.',
      },
      {
        q: 'Vale anunciar em páginas de concorrentes?',
        a: 'Vale nos dois sentidos. O ASIN targeting ofensivo captura o cliente comparando alternativas e o defensivo protege suas próprias páginas — em categorias disputadas, a defesa costuma ter retorno maior que o ataque.',
      },
    ],
    relatedSlugs: ['mercado-livre-ads', 'shopee-ads', 'google-ads'],
    seo: {
      title: 'Gestão de Amazon Ads | Ciclo E-commerce',
      description:
        'Gestão de Amazon Ads: Sponsored Products, Brands e Display com estrutura por correspondência, conteúdo A+, Buy Box e leitura de TACoS.',
      keywords: [
        'amazon ads brasil',
        'sponsored products amazon',
        'tacos amazon',
        'buy box amazon',
        'agência amazon ads',
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
    relatedSlugs: ['analytics-bi', 'growth-continuo', 'creative-strategy'],
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
        q: 'Qual volume de operação o Growth Contínuo exige?',
        a: 'O método pressupõe volume suficiente para testes com significância estatística — é por isso que trabalhamos com operações consolidadas, de médio e grande porte. Com tráfego e receita relevantes, o ciclo de experimentação entrega aprendizado acionável a cada sprint.',
      },
      {
        q: 'A Ciclo faz growth junto com o time do cliente?',
        a: 'Sim. Growth Contínuo é sempre um trabalho conjunto: a Ciclo traz a metodologia, os dados e a análise; o time do cliente traz o conhecimento do produto, do cliente e da operação. O resultado é melhor quando as duas partes estão envolvidas.',
      },
    ],
    relatedSlugs: ['analytics-bi', 'processos-playbooks', 'creative-strategy'],
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
