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
  type: 'paragraph' | 'heading' | 'subheading' | 'list' | 'highlight' | 'divider' | 'ctaCard'
  text?: string
  items?: string[]
  ctaLabel?: string
  ctaHref?: string
}

export const posts: BlogPost[] = [
  // ─── 1. Full Funnel Marketing ────────────────────────────────────────────────
  {
    slug: 'full-funnel-marketing-por-que-sua-marca-perde-dinheiro',
    title: 'Full Funnel Marketing: por que sua marca está perdendo dinheiro sem ele',
    excerpt:
      'A maioria das marcas gasta mais de 80% do budget em conversão e não entende por que o CAC sobe todo trimestre. O problema não é a mídia. É que a marca está tentando colher o que não plantou.',
    category: 'Estratégia',
    author: 'Time Ciclo',
    authorRole: 'Especialistas em Full Funnel Marketing',
    date: '2025-05-10',
    readTime: 12,
    coverGradient: 'from-[#1a0030] via-[#0d0020] to-[#050505]',
    content: [
      { type: 'paragraph', text: 'A maioria das marcas de e-commerce gasta mais de 80% do orçamento de marketing em campanhas de conversão e não entende por que o CAC continua subindo a cada trimestre. O problema não é a mídia. O problema é que a marca está tentando colher o que não plantou.' },
      { type: 'paragraph', text: 'Full Funnel Marketing é a estrutura que resolve esse ciclo. Em vez de tratar geração de demanda, captação e retenção como iniciativas separadas com orçamentos que não se conversam, o Full Funnel conecta cada etapa da jornada do cliente em um sistema único.' },
      { type: 'heading', text: 'O que é Full Funnel Marketing' },
      { type: 'paragraph', text: 'Full Funnel Marketing é a abordagem que acompanha o cliente em todos os estágios da jornada: do primeiro contato com a marca até a décima recompra. Cada etapa tem um papel específico e alimenta a próxima.' },
      { type: 'paragraph', text: 'O oposto é o marketing de conversão isolado, que tenta capturar uma demanda que a própria marca não criou. Funciona por um tempo, mas exige investimento crescente para manter o mesmo resultado. Em algum ponto, o retorno cai mais rápido do que o budget sobe.' },
      { type: 'heading', text: 'Por que a maioria das marcas concentra tudo em conversão' },
      { type: 'paragraph', text: 'Parte do problema é de mensuração. Campanhas de performance têm dashboards claros: ROAS, CPA, conversões por campanha. Construção de marca é mais difuso, o resultado demora mais para aparecer e é mais difícil de atribuir a uma ação específica.' },
      { type: 'paragraph', text: 'O outro fator é pressão de curto prazo. Metas mensais de faturamento forçam decisões que prejudicam o longo prazo. Quando a meta do mês pesa mais do que o custo de aquisição daqui a seis meses, o funil fica sempre desequilibrado.' },
      { type: 'highlight', text: 'Marcas que constroem demanda no topo pagam menos por cada conversão no fundo, porque chegam ao momento da compra como primeira escolha, não como mais uma opção no leilão de cliques.' },
      { type: 'heading', text: 'Os três estágios do funil e o papel de cada um' },
      { type: 'subheading', text: 'Geração de demanda: criar marca antes de criar cliente' },
      { type: 'paragraph', text: 'Geração de demanda é o investimento que faz alguém conhecer sua marca antes de precisar do produto. Conteúdo, vídeo, social media, influência e branding são os principais canais nessa etapa. O objetivo não é vender agora. É construir preferência para quando o cliente estiver pronto para comprar.' },
      { type: 'paragraph', text: 'Sem essa etapa, cada campanha de performance começa do zero em termos de reconhecimento. O usuário nunca viu a marca, não tem referência de qualidade e precisa de muito mais pontos de contato antes de converter. O CPM efetivo sobe e a taxa de conversão cai.' },
      { type: 'subheading', text: 'Captação de demanda: converter quem está pronto para comprar' },
      { type: 'paragraph', text: 'Captação de demanda é a performance tradicional: Google Search, Google Shopping, Meta Ads, retargeting. A diferença é que, quando a marca já gerou demanda no topo, esses canais têm taxa de conversão mais alta e custo por aquisição mais baixo.' },
      { type: 'paragraph', text: 'O cliente que já consumiu conteúdo da marca, leu reviews e assistiu um vídeo de produto converte com muito menos fricção. O investimento no topo não compete com a performance: potencializa cada real investido na captação.' },
      { type: 'subheading', text: 'Expansão de demanda: crescer sem elevar o CAC' },
      { type: 'paragraph', text: 'Expansão de demanda é a área mais negligenciada e a que tem maior potencial de retorno. CRM, fluxos de recompra, upsell, cross-sell, programas de fidelidade. O objetivo é aumentar o LTV do cliente sem gastar mais para adquiri-lo.' },
      { type: 'paragraph', text: 'Um cliente que compra três vezes no primeiro ano custa exatamente o mesmo para adquirir que um cliente que compra uma única vez. A diferença na receita gerada é pura eficiência de funil, obtida sem investimento adicional em mídia.' },
      { type: 'ctaCard', text: 'A Ciclo estrutura a estratégia de Geração de Demanda para marcas de e-commerce que querem crescer com previsibilidade, sem depender apenas de performance de conversão.', ctaLabel: 'Ver nossa abordagem de Geração de Demanda', ctaHref: '/solucoes/geracao-de-demanda' },
      { type: 'heading', text: 'Como saber se seu funil está desequilibrado' },
      { type: 'paragraph', text: 'A distribuição do orçamento é o sinal mais claro. Se mais de 70% dos investimentos de marketing estão concentrados em campanhas de conversão direta, o funil está desequilibrado. Mas há outros indicadores mais concretos.' },
      { type: 'list', items: [
        'CAC subindo de forma consistente ao longo de três ou mais trimestres, sem crescimento equivalente no LTV',
        'Taxa de recompra abaixo de 25% nos primeiros 90 dias após a primeira compra',
        'Receita de clientes recorrentes representando menos de 30% do faturamento total',
        'Audiência de retargeting que se esgota rapidamente, forçando prospecção constante e cara',
        'Crescimento de receita proporcional ao crescimento de investimento em mídia, sem ganhos de eficiência ao longo do tempo',
      ] },
      { type: 'paragraph', text: 'Esses sinais juntos indicam um funil que depende de volume de entrada para crescer. Cada real investido em aquisição precisa pagar o custo integral no primeiro pedido, porque o cliente não volta.' },
      { type: 'highlight', text: 'Nos clientes da Ciclo que implementaram Full Funnel completo, a queda média de CAC foi de 35% em 12 meses, com aumento de 2,7x no LTV do mesmo período.' },
      { type: 'heading', text: 'O que muda quando o funil é equilibrado' },
      { type: 'paragraph', text: 'Com demanda gerada no topo, as campanhas de captação ficam mais eficientes. O mesmo orçamento produz mais conversões porque o cliente já chegou com contexto e familiaridade com a marca. O CPM pode subir no mercado, mas o custo por aquisição cai porque a taxa de conversão é maior.' },
      { type: 'paragraph', text: 'A expansão de demanda fecha o ciclo. Com LTV maior, a marca pode investir mais por cada novo cliente e ainda ser rentável. Isso muda a lógica de quanto é possível gastar na captação e abre espaço para competir em canais que antes pareciam inviáveis.' },
      { type: 'paragraph', text: 'O resultado líquido é crescimento previsível. Em vez de depender de picos de campanha, a receita passa a ter uma base de clientes recorrentes que recompram por hábito e por preferência de marca.' },
      { type: 'heading', text: 'Como equilibrar o funil na prática' },
      { type: 'subheading', text: 'Mapeie onde está o orçamento hoje' },
      { type: 'paragraph', text: 'O primeiro passo é simples: classifique cada real investido em marketing entre geração de demanda, captação de demanda e expansão de demanda. Na maioria das marcas, mais de 80% está concentrado em captação. Isso já é o diagnóstico.' },
      { type: 'subheading', text: 'Calcule o CAC por canal e cruce com o LTV' },
      { type: 'paragraph', text: 'Não basta saber o CAC médio. É necessário saber o CAC por canal e cruzar com o LTV dos clientes que vieram de cada canal. Clientes adquiridos por conteúdo orgânico e influência tendem a ter LTV superior aos de campanhas de remarketing. Esse dado muda onde o investimento deve crescer.' },
      { type: 'subheading', text: 'Inclua LTV e recompra como KPIs do time de marketing' },
      { type: 'paragraph', text: 'Quando o time de marketing tem metas apenas de aquisição, o funil fica desequilibrado por incentivo estrutural. Incluir taxa de recompra e LTV como KPIs do time alinha as decisões com o crescimento sustentável, não só com o volume de pedidos novos.' },
      { type: 'divider' },
      { type: 'heading', text: 'O que fazer a partir de agora' },
      { type: 'list', items: [
        'Calcule a distribuição atual do orçamento de marketing entre geração, captação e expansão de demanda',
        'Meça o LTV médio dos clientes segmentado por canal de aquisição e identifique qual canal traz os clientes mais valiosos',
        'Analise a taxa de recompra nos primeiros 90 dias como indicador de saúde do funil de retenção',
        'Defina um percentual mínimo do orçamento para geração de demanda e mantenha consistente por pelo menos dois trimestres',
        'Avalie o impacto no CAC a cada trimestre após o investimento no topo se tornar regular',
      ] },
      { type: 'paragraph', text: 'Full Funnel Marketing não é tendência nova. É a estrutura que marcas sustentáveis sempre usaram, agora com canais e ferramentas que permitem medir cada etapa com precisão. Quem começa antes colhe os resultados por mais tempo.' },
    ],
  },

  // ─── 2. CAC Alto ─────────────────────────────────────────────────────────────
  {
    slug: 'cac-alto-como-reduzir-custo-aquisicao',
    title: 'CAC alto? Como identificar onde seu funil está sangrando',
    excerpt:
      'CAC alto raramente é um problema de mídia. Na maioria dos casos, é sintoma de um funil mal construído. Veja como diagnosticar a causa real e aplicar o tratamento certo.',
    category: 'Performance',
    author: 'Time Ciclo',
    authorRole: 'Especialistas em Full Funnel Marketing',
    date: '2025-04-28',
    readTime: 10,
    coverGradient: 'from-[#001a10] via-[#000d08] to-[#050505]',
    content: [
      { type: 'paragraph', text: 'Quando o CAC sobe, o reflexo instintivo é cortar budget ou trocar a agência de mídia. Raramente essa é a solução. O CAC alto é quase sempre um sintoma de um problema estrutural mais profundo, e o diagnóstico correto evita repetir o mesmo erro com o próximo parceiro.' },
      { type: 'paragraph', text: 'Este artigo explica as três causas reais de CAC elevado, como identificar qual delas está afetando sua operação e qual tratamento aplicar em cada caso.' },
      { type: 'heading', text: 'O que o CAC alto está sinalizando de verdade' },
      { type: 'paragraph', text: 'O CAC é uma métrica de resultado, não de causa. Ele sobe quando o investimento em mídia cresce mais rápido do que as conversões, mas isso pode acontecer por motivos completamente diferentes: falta de reconhecimento de marca, problema na taxa de conversão do site ou LTV baixo que torna qualquer CAC insustentável.' },
      { type: 'paragraph', text: 'Cada uma dessas causas tem um tratamento diferente. Confundir a causa é o que faz marcas investirem na solução errada por meses.' },
      { type: 'heading', text: 'As três causas reais de CAC elevado' },
      { type: 'subheading', text: 'Marca desconhecida elevando o custo de conversão' },
      { type: 'paragraph', text: 'Se a marca não é conhecida pelo público que está sendo impactado, cada clique de performance começa do zero em termos de confiança. O usuário nunca viu a marca, não tem referência de qualidade e precisa de muito mais pontos de contato antes de converter.' },
      { type: 'paragraph', text: 'Isso eleva o CPM efetivo, reduz a taxa de clique, aumenta o custo por lead e comprime a taxa de conversão final. O problema não está na campanha. Está na ausência de trabalho de construção de marca que deveria ter precedido a campanha.' },
      { type: 'subheading', text: 'Taxa de conversão abaixo do que o canal pode entregar' },
      { type: 'paragraph', text: 'Uma diferença de 1% para 2% na taxa de conversão do site corta o CAC pela metade, sem mudar nenhuma campanha. UX ruim, página lenta, checkout complexo, falta de prova social ou preço percebido como injusto são fatores que desperdiçam o investimento em mídia.' },
      { type: 'paragraph', text: 'Esse tipo de problema é frequentemente invisível nos dashboards de performance, porque as campanhas mostram cliques e visitas normais. O vazamento acontece no site, não no anúncio.' },
      { type: 'highlight', text: 'Se a taxa de conversão do seu site está abaixo de 1,5% para tráfego de performance, o problema provavelmente não está nos criativos da campanha. Está na experiência de compra depois do clique.' },
      { type: 'subheading', text: 'LTV baixo tornando o CAC insustentável' },
      { type: 'paragraph', text: 'Se o cliente compra uma vez e não volta, cada aquisição precisa pagar o custo integral no primeiro pedido. Isso define um teto muito baixo para o quanto a marca pode investir por aquisição e ainda ter margem.' },
      { type: 'paragraph', text: 'Quando o LTV é alto, a marca pode pagar mais por cada cliente novo e ainda ser rentável no médio prazo. Quem não conhece o LTV não sabe quanto pode gastar na captação. Esse é o dado que precede qualquer decisão de budget.' },
      { type: 'highlight', text: 'CAC aceitável = LTV x margem de contribuição. Essa fórmula define o teto de investimento por cliente. Sem ela, qualquer discussão sobre CAC é superficial.' },
      { type: 'heading', text: 'Como diagnosticar qual é o problema da sua operação' },
      { type: 'paragraph', text: 'Cinco perguntas que direcionam o diagnóstico correto.' },
      { type: 'list', items: [
        'Qual é o LTV médio dos seus clientes nos 12 meses após a primeira compra?',
        'Qual é a taxa de conversão do site por canal de entrada: orgânico, performance, social?',
        'Quantos pontos de contato um usuário tem com a marca antes de comprar pela primeira vez?',
        'Qual porcentagem dos clientes faz a segunda compra em até 60 dias?',
        'O CAC está subindo de forma uniforme em todos os canais ou em um canal específico?',
      ] },
      { type: 'ctaCard', text: 'A Ciclo trabalha com diagnóstico e reestruturação de funil de Captação de Demanda para marcas de e-commerce que precisam reduzir o CAC sem cortar crescimento.', ctaLabel: 'Ver nossa abordagem de Captação', ctaHref: '/solucoes/captacao-de-demanda' },
      { type: 'heading', text: 'O que fazer quando o problema é o reconhecimento de marca' },
      { type: 'paragraph', text: 'A solução é investir em geração de demanda antes de aumentar o budget de conversão. Conteúdo, vídeo, influência e social media criam familiaridade que reduz o custo por conversão nas campanhas de performance.' },
      { type: 'paragraph', text: 'Esse investimento leva tempo para aparecer nos números: de 60 a 120 dias em média. Mas o efeito é cumulativo. Cada real investido em marca hoje reduz o custo de cada aquisição nos próximos meses.' },
      { type: 'heading', text: 'O que fazer quando o problema é a conversão do site' },
      { type: 'paragraph', text: 'Aqui o trabalho é de otimização de conversão: CRO, testes A/B, melhora de velocidade, simplificação do checkout, inclusão de prova social e trabalho na apresentação do produto.' },
      { type: 'list', items: [
        'Instale mapas de calor e gravações de sessão para ver onde os usuários abandonam',
        'Teste variações de página de produto com foco em prova social: reviews, fotos de clientes, perguntas respondidas',
        'Meça a velocidade do site no mobile e elimine qualquer carregamento acima de 3 segundos',
        'Simplifique o checkout: remova campos desnecessários e ofereça mais opções de pagamento',
        'Compare a taxa de conversão por canal de tráfego para identificar se o problema é global ou específico',
      ] },
      { type: 'heading', text: 'O que fazer quando o problema é o LTV' },
      { type: 'paragraph', text: 'LTV baixo indica que o cliente compra e não volta. O tratamento é na retenção: CRM, fluxos de recompra, programas de fidelidade e uma experiência pós-compra que justifique voltar.' },
      { type: 'paragraph', text: 'Aumentar o LTV em 30% permite pagar 30% mais por cada cliente novo e ainda manter a rentabilidade. Em alguns casos, aumentar o LTV é mais impactante do que tentar reduzir o CAC diretamente.' },
      { type: 'divider' },
      { type: 'heading', text: 'O que fazer a partir de agora' },
      { type: 'list', items: [
        'Calcule o LTV médio dos seus clientes nos últimos 12 meses e cruze com a margem de contribuição',
        'Meça a taxa de conversão por canal de entrada e compare com benchmarks do seu segmento',
        'Identifique onde está o maior vazamento do funil: no reconhecimento, na conversão ou na retenção',
        'Priorize o investimento no ponto de maior vazamento antes de aumentar budget em canais de captação',
        'Reavalie o CAC aceitável depois de ter o LTV calculado, não antes',
      ] },
      { type: 'paragraph', text: 'CAC alto não se resolve com mais investimento em mídia. Se resolve com diagnóstico correto e tratamento no ponto certo do funil. Atacar o sintoma sem entender a causa gera ciclos de mudança sem resultado.' },
    ],
  },

  // ─── 3. Recompra e Fidelização ───────────────────────────────────────────────
  {
    slug: 'recompra-e-fidelizacao-o-ativo-que-marcas-ignoram',
    title: 'Recompra e fidelização: o ativo que as marcas ignoram',
    excerpt:
      'Adquirir um cliente novo custa em média cinco vezes mais do que reter um existente. Mesmo assim, a maioria das marcas investe mais de 85% do budget em aquisição e trata retenção como projeto secundário.',
    category: 'Retenção',
    author: 'Time Ciclo',
    authorRole: 'Especialistas em Full Funnel Marketing',
    date: '2025-04-14',
    readTime: 11,
    coverGradient: 'from-[#1a001a] via-[#0d000d] to-[#050505]',
    content: [
      { type: 'paragraph', text: 'Toda marca de e-commerce sabe que reter clientes é mais barato do que adquirir novos. Mesmo assim, a maioria investe mais de 85% do orçamento de marketing em captação e menos de 15% em retenção. Essa contradição tem uma explicação, e corrigi-la é uma das maiores alavancas de crescimento disponíveis.' },
      { type: 'paragraph', text: 'Este artigo explica por que o viés de aquisição persiste, quais são as alavancas de recompra que funcionam na prática e como construir uma operação de retenção que gera receita incremental sem aumentar o budget de mídia.' },
      { type: 'heading', text: 'A matemática que justifica investir em retenção' },
      { type: 'paragraph', text: 'Um cliente que compra três vezes custa o mesmo para adquirir que um cliente que compra uma vez. A diferença entre os dois está inteiramente na receita gerada depois da primeira compra, sem nenhum custo adicional de aquisição.' },
      { type: 'paragraph', text: 'Quando se olha para o P&L da operação, a melhora na taxa de retenção costuma ter impacto maior do que a redução do CAC. Reter 5% mais clientes pode aumentar a lucratividade em até 95%, segundo dados da Bain and Company. Mesmo um aumento de 1% já muda o resultado de forma significativa.' },
      { type: 'highlight', text: 'Uma marca com taxa de recompra de 30% nos primeiros 90 dias tem uma base de receita recorrente que financia crescimento sem depender exclusivamente de novos clientes.' },
      { type: 'heading', text: 'Por que a maioria das marcas ainda prioriza aquisição' },
      { type: 'paragraph', text: 'Novos clientes aparecem nos dashboards de mídia com métricas claras: cliques, impressões, conversões, ROAS. A retenção é mais difusa. CRM, fluxos de e-mail, programas de fidelidade têm atribuição mais complexa e resultado menos imediato. O que é difícil de medir tende a ser subestimado.' },
      { type: 'paragraph', text: 'O outro fator é estrutural. Metas mensais de faturamento forçam decisões de curto prazo. Quando a pressão é de fechar o mês, o investimento vai para o canal com resultado mais imediato: performance de aquisição. A retenção fica para o próximo sprint.' },
      { type: 'heading', text: 'As três alavancas de recompra que funcionam' },
      { type: 'subheading', text: 'Fluxo de pós-compra ativado por comportamento' },
      { type: 'paragraph', text: 'O período de 7 a 30 dias após a primeira compra é o momento em que o cliente está mais engajado com a marca. Um fluxo bem construído de e-mail e WhatsApp nesse período tem taxa de abertura significativamente maior do que qualquer campanha genérica.' },
      { type: 'paragraph', text: 'O fluxo ideal inclui confirmação de pedido com contexto de marca, acompanhamento da entrega, conteúdo de uso do produto e uma oferta de segunda compra direcionada para a categoria mais provável, baseada no que foi comprado.' },
      { type: 'subheading', text: 'Campanhas baseadas no ciclo de consumo do produto' },
      { type: 'paragraph', text: 'Para categorias com ciclo de consumo previsível como suplementos, cosméticos, ração pet, alimentos saudáveis e higiene pessoal, o timing ideal de uma campanha de recompra é calculável. Se o produto dura em média 45 dias, uma campanha enviada no dia 40 chega quando o cliente está prestes a precisar de mais.' },
      { type: 'paragraph', text: 'Esse tipo de campanha tem taxa de conversão três a cinco vezes superior às campanhas genéricas de base, porque chega no momento de necessidade real, não de forma arbitrária.' },
      { type: 'subheading', text: 'Cross-sell orientado pelo histórico de compra' },
      { type: 'paragraph', text: 'Clientes que compram um produto específico têm uma probabilidade estatisticamente maior de se interessar por determinados outros produtos da mesma marca. Essa lógica, aplicada em automações de CRM, cria receita incremental sem nenhum custo de aquisição.' },
      { type: 'paragraph', text: 'O cross-sell mais eficiente não é baseado no que a marca quer vender. É baseado no que outros clientes com comportamento similar compraram em seguida. Esse dado existe na base de pedidos e precisa apenas ser ativado.' },
      { type: 'ctaCard', text: 'A Ciclo estrutura programas de reativação e fidelização para marcas de e-commerce que querem transformar compradores únicos em clientes recorrentes.', ctaLabel: 'Ver como trabalhamos Reativação e Fidelização', ctaHref: '/servicos/reativacao-fidelizacao' },
      { type: 'heading', text: 'Como construir um programa de fidelidade que funciona' },
      { type: 'paragraph', text: 'A maioria dos programas de fidelidade falha porque é complexo demais para o cliente entender ou requer muitas compras para gerar algum benefício tangível. O programa que funciona é simples, com recompensa visível desde a segunda compra.' },
      { type: 'paragraph', text: 'Não é necessário um sistema sofisticado de pontos. Um programa com três níveis simples, desconto progressivo ou frete grátis a partir de um número de pedidos já é suficiente para criar o comportamento de retorno que se busca.' },
      { type: 'list', items: [
        'Segmente a base entre compradores únicos, recorrentes e inativos com critérios claros',
        'Calcule o tempo médio entre a primeira e segunda compra para definir o prazo ideal de reativação',
        'Crie um fluxo específico para clientes que passaram o prazo médio sem recomprar',
        'Teste ofertas diferentes para reativação: frete grátis, desconto em categoria adjacente, brinde',
        'Meça o impacto da retenção separado do budget de aquisição, com atribuição clara',
      ] },
      { type: 'heading', text: 'O que medir para saber se a retenção está funcionando' },
      { type: 'paragraph', text: 'Métricas de retenção que indicam saúde real da operação.' },
      { type: 'list', items: [
        'Taxa de recompra nos primeiros 90 dias após a primeira compra: meta acima de 25%',
        'Percentual da receita total gerada por clientes recorrentes: meta acima de 35%',
        'Receita atribuída ao CRM como percentual do faturamento: meta acima de 15%',
        'Taxa de clientes inativos nos últimos 180 dias em relação ao total da base',
        'LTV médio segmentado por canal de aquisição original',
      ] },
      { type: 'divider' },
      { type: 'heading', text: 'O que fazer a partir de agora' },
      { type: 'list', items: [
        'Calcule a taxa de recompra atual nos primeiros 90 dias e compare com o trimestre anterior',
        'Mapeie o ciclo médio de consumo do seu produto principal e crie uma campanha baseada nesse timing',
        'Construa ou revise o fluxo de pós-compra dos primeiros 30 dias para incluir conteúdo e oferta de segunda compra',
        'Identifique os clientes inativos dos últimos 180 dias e teste uma campanha de reativação com oferta específica',
        'Defina taxa de recompra e percentual de receita recorrente como KPIs de negócio, não só como métricas de CRM',
      ] },
      { type: 'paragraph', text: 'Retenção não é o departamento do CRM. É uma estratégia de crescimento que muda a rentabilidade da operação inteira. Quem trata retenção como prioridade cria uma base de receita que financia aquisição, em vez de depender exclusivamente dela.' },
    ],
  },

  // ─── 4. CRM para E-commerce ──────────────────────────────────────────────────
  {
    slug: 'crm-para-ecommerce-alem-do-email-marketing',
    title: 'CRM para e-commerce: além do e-mail marketing',
    excerpt:
      'CRM não é e-mail marketing. É a estratégia completa de relacionamento que transforma compradores ocasionais em clientes fiéis, com impacto direto no LTV e na rentabilidade da operação.',
    category: 'CRM',
    author: 'Time Ciclo',
    authorRole: 'Especialistas em Full Funnel Marketing',
    date: '2025-03-30',
    readTime: 12,
    coverGradient: 'from-[#001020] via-[#00080d] to-[#050505]',
    content: [
      { type: 'paragraph', text: 'Quando se fala em CRM para a maioria das marcas de e-commerce, a resposta automática é "a gente faz e-mail marketing". CRM é muito mais do que isso. É a gestão do relacionamento com o cliente em todos os canais e em todos os momentos da jornada, do pós-primeira compra até a reativação de clientes inativos.' },
      { type: 'paragraph', text: 'Este artigo explica como estruturar um CRM que gera receita real, quais são os pilares de uma operação de alto desempenho e quais métricas indicam que o trabalho está funcionando.' },
      { type: 'heading', text: 'CRM é estratégia, não ferramenta' },
      { type: 'paragraph', text: 'A ferramenta de CRM, seja Klaviyo, HubSpot, ActiveCampaign, RD Station ou qualquer outra, é apenas a execução. A estratégia começa com uma pergunta mais fundamental: o que a marca quer que o cliente sinta, saiba e faça em cada etapa do relacionamento?' },
      { type: 'paragraph', text: 'Sem essa clareza, a ferramenta vira uma plataforma de envio de e-mails em massa com baixa personalização. Com ela, vira um sistema de relacionamento que gera receita previsível a partir da base existente.' },
      { type: 'highlight', text: 'CRM eficaz não é sobre enviar mais e-mails. É sobre enviar a mensagem certa, para a pessoa certa, pelo canal certo, no momento em que ela é mais relevante.' },
      { type: 'heading', text: 'Os quatro pilares de um CRM que gera receita' },
      { type: 'subheading', text: 'Dados unificados como ponto de partida' },
      { type: 'paragraph', text: 'Sem dados consolidados, qualquer estratégia de CRM é cega. O ponto de partida é ter uma visão única do cliente: histórico completo de compras, canais de aquisição, comportamento no site, produtos visualizados, frequência de compra e ticket médio.' },
      { type: 'paragraph', text: 'Essa unificação muitas vezes exige integração entre plataforma de e-commerce, ferramenta de e-mail e canais de atendimento. O investimento no setup inicial de dados é o que viabiliza toda a personalização posterior.' },
      { type: 'subheading', text: 'Segmentação que vai além do RFM' },
      { type: 'paragraph', text: 'RFM (Recência, Frequência, Valor) é um bom ponto de partida, mas segmentar só por RFM deixa oportunidades na mesa. Segmentação por categoria de produto comprada, canal de aquisição, localização, estágio da jornada e propensão de compra gera relevância muito maior nas comunicações.' },
      { type: 'paragraph', text: 'Quanto mais específico o segmento, maior a taxa de abertura, clique e conversão. Uma comunicação enviada para "clientes de beleza que compraram protetor solar nos últimos 60 dias e não voltaram" converte mais do que uma campanha para "toda a base de beleza".' },
      { type: 'subheading', text: 'Automações orientadas por eventos comportamentais' },
      { type: 'paragraph', text: 'Automações de CRM que funcionam são baseadas no comportamento do cliente, não em calendários arbitrários. Comprou, abandonou o carrinho, ficou 45 dias sem acessar o site, atingiu um valor de compras acumulado: cada evento é um gatilho para uma comunicação relevante.' },
      { type: 'paragraph', text: 'Os fluxos mais importantes para qualquer operação de e-commerce são: boas-vindas pós-primeira compra, abandono de carrinho, recompra baseada em ciclo de consumo, reativação de inativo e fluxo de clientes VIP.' },
      { type: 'subheading', text: 'Atribuição correta da receita gerada' },
      { type: 'paragraph', text: 'Sem atribuição correta, é impossível saber quanto o CRM está gerando de receita e quais fluxos estão performando. A meta de qualquer operação de CRM é chegar a pelo menos 15% da receita total atribuída a canais de relacionamento.' },
      { type: 'highlight', text: 'Marcas com CRM bem estruturado geram entre 15% e 30% da receita total a partir de e-mail, WhatsApp e fluxos de automação, sem investimento adicional em mídia paga.' },
      { type: 'ctaCard', text: 'A Ciclo estrutura operações completas de CRM para e-commerce, cobrindo e-mail, SMS, WhatsApp e automações de retenção.', ctaLabel: 'Ver como trabalhamos CRM', ctaHref: '/servicos/crm-email-sms-push-whatsapp' },
      { type: 'heading', text: 'WhatsApp como canal principal de CRM' },
      { type: 'paragraph', text: 'O WhatsApp tem taxa de abertura acima de 95%, contra 20 a 30% do e-mail. Para categorias com alta frequência de compra como beleza, saúde, pet, alimentos e suplementos, o WhatsApp como canal de CRM é uma alavanca de receita subutilizada pela maioria das marcas.' },
      { type: 'paragraph', text: 'A combinação de e-mail para comunicações mais ricas, com texto longo e imagens, e WhatsApp para mensagens curtas e acionáveis cria uma estratégia multicanal que aumenta alcance e conversão sem duplicar o esforço operacional.' },
      { type: 'heading', text: 'E-mail marketing dentro de uma estratégia de CRM' },
      { type: 'paragraph', text: 'E-mail continua sendo o canal de maior ROI médio no e-commerce, especialmente para comunicações que exigem mais contexto: lançamentos de produto, conteúdo editorial, storytelling de marca e ofertas complexas que precisam de mais espaço para explicar o valor.' },
      { type: 'paragraph', text: 'O erro mais comum é usar e-mail como canal de promoção de massa, com a mesma comunicação para toda a base. E-mail performático depende de segmentação: assunto personalizado, oferta relevante para o comportamento recente e horário de envio testado por segmento.' },
      { type: 'heading', text: 'O que monitorar todo mês' },
      { type: 'paragraph', text: 'KPIs que indicam saúde real da operação de CRM.' },
      { type: 'list', items: [
        'Receita atribuída ao CRM como percentual do faturamento total: meta acima de 15%',
        'Taxa de recompra nos primeiros 30, 60 e 90 dias após a primeira compra',
        'Taxa de abertura e clique por segmento de base, não média geral',
        'Receita por e-mail enviado (RPE): indicador de qualidade da segmentação',
        'Percentual da base ativa nos últimos 90 dias versus base total',
      ] },
      { type: 'divider' },
      { type: 'heading', text: 'O que fazer a partir de agora' },
      { type: 'list', items: [
        'Audite os fluxos de automação atuais e identifique quais existem e quais estão faltando',
        'Unifique os dados de cliente entre plataforma de e-commerce, ferramenta de e-mail e canais de atendimento',
        'Revise a segmentação da base: crie ao menos cinco segmentos distintos com comunicações diferentes',
        'Implemente um fluxo de pós-compra para os primeiros 30 dias e meça o impacto na taxa de recompra',
        'Defina receita atribuída ao CRM como KPI mensal e acompanhe a evolução trimestral',
      ] },
      { type: 'paragraph', text: 'CRM bem estruturado é a camada de receita mais previsível que uma marca de e-commerce pode ter. Funciona independente de sazonalidade, dos leilões de mídia paga e de algoritmos de redes sociais. Quem constrói essa base tem menos dependência de aquisição e mais controle sobre o crescimento.' },
    ],
  },

  // ─── 5. Social Commerce ──────────────────────────────────────────────────────
  {
    slug: 'social-commerce-como-integrar-ao-seu-funil',
    title: 'Social Commerce: como integrar ao seu funil de crescimento',
    excerpt:
      'Instagram, TikTok Shop e Pinterest estão mudando onde as decisões de compra acontecem. Uma parte crescente das vendas começa e termina dentro das plataformas sociais, sem que o usuário visite o site da marca.',
    category: 'Social',
    author: 'Time Ciclo',
    authorRole: 'Especialistas em Full Funnel Marketing',
    date: '2025-03-15',
    readTime: 10,
    coverGradient: 'from-[#1a0a00] via-[#0d0500] to-[#050505]',
    content: [
      { type: 'paragraph', text: 'O comportamento de compra mudou. Uma parte crescente das decisões começa e termina dentro das plataformas sociais, sem que o usuário visite o site da marca. Para as marcas que não se adaptaram, isso significa receita que vai para quem já está posicionado nesses canais.' },
      { type: 'paragraph', text: 'Este artigo explica o que é social commerce de fato, como ele opera em cada etapa do funil e como integrá-lo à estratégia de crescimento sem precisar criar uma equipe separada do zero.' },
      { type: 'heading', text: 'O que mudou no comportamento de compra' },
      { type: 'paragraph', text: 'Há cinco anos, a jornada de compra típica era: ver um anúncio, acessar o site, navegar no catálogo, colocar no carrinho, finalizar a compra. Hoje, para categorias como moda, beleza, suplementos e casa, a jornada começa no conteúdo de um criador e termina no checkout dentro da própria plataforma.' },
      { type: 'paragraph', text: 'Esse encurtamento da jornada muda tudo. Reduz a fricção de compra, aumenta a taxa de conversão de impulso e favorece marcas que conseguem criar conteúdo nativo relevante para cada plataforma.' },
      { type: 'highlight', text: 'Marcas que integram social commerce ao funil reportam incremento de 20% a 40% em novos clientes, com custo de aquisição inferior ao de canais de performance tradicionais, especialmente no público abaixo de 35 anos.' },
      { type: 'heading', text: 'Social commerce não é só ter vitrine nas redes' },
      { type: 'paragraph', text: 'Ter o catálogo ativado no Instagram Shopping ou no TikTok Shop é o ponto de partida, não a estratégia. Social commerce é a integração entre conteúdo orgânico, criadores, anúncios e pontos de conversão dentro das plataformas. Cada um desses elementos tem um papel e uma lógica diferentes.' },
      { type: 'paragraph', text: 'Marcas que só ativam a loja sem criar conteúdo relevante na plataforma têm resultados marginais. O conteúdo é o que gera tráfego orgânico para os produtos. Sem ele, o social commerce se reduz a mais um canal de anúncio com custo igual ao dos outros.' },
      { type: 'heading', text: 'Como o social commerce opera em cada etapa do funil' },
      { type: 'subheading', text: 'Topo do funil: descoberta e criação de desejo' },
      { type: 'paragraph', text: 'Reels, TikToks e conteúdo de criadores são o principal motor de descoberta para categorias como moda, beleza e lifestyle. O conteúdo nessa etapa não precisa vender. Precisa criar desejo, gerar contexto e construir a percepção de que o produto faz sentido para a vida do usuário.' },
      { type: 'paragraph', text: 'O algoritmo de descoberta das plataformas sociais distribui conteúdo com base em engajamento e relevância, não em orçamento de anúncio. Marcas que produzem conteúdo nativo de qualidade têm alcance orgânico que reduz o custo efetivo de aquisição.' },
      { type: 'subheading', text: 'Meio do funil: consideração e prova social' },
      { type: 'paragraph', text: 'Reviews de produto, unboxings, comparações e lives de demonstração são o conteúdo que move clientes da consideração para a decisão de compra. A prova social dentro da plataforma funciona melhor do que reviews no site porque o usuário está no contexto social, com o mecanismo de confiança ativo.' },
      { type: 'paragraph', text: 'Comunidade ativa nos comentários, salvamentos e compartilhamentos de posts de produto são sinais de consideração que o algoritmo usa para aumentar a distribuição orgânica. Engajamento real gera alcance real.' },
      { type: 'subheading', text: 'Fundo do funil: conversão dentro da plataforma' },
      { type: 'paragraph', text: 'Instagram Shopping, TikTok Shop e Pinterest Checkout permitem que a compra aconteça sem o usuário sair da plataforma. Esse encurtamento da jornada reduz o abandono causado pela troca de contexto entre plataforma social e site da marca.' },
      { type: 'paragraph', text: 'Para produtos com ticket médio até R$300, a conversão in-app tem taxa consistentemente superior ao redirecionamento para site externo. Para tickets mais altos, o site ainda tem papel importante na conversão final.' },
      { type: 'ctaCard', text: 'A Ciclo tem time especializado em gestão de TikTok Shop e social commerce para marcas de e-commerce que querem escalar nesse canal.', ctaLabel: 'Ver como trabalhamos TikTok Shop', ctaHref: '/servicos/tiktok-shop-social-commerce' },
      { type: 'heading', text: 'TikTok Shop e o social commerce no Brasil' },
      { type: 'paragraph', text: 'O TikTok Shop é o canal de social commerce com maior crescimento no Brasil. A plataforma combina descoberta orgânica por algoritmo, criadores afiliados que vendem por comissão, transmissões ao vivo com carrinho ativo e anúncios com checkout dentro do app.' },
      { type: 'paragraph', text: 'Para marcas de moda, beleza, casa, pet e suplementos, o TikTok Shop já representa uma parcela relevante das vendas de marcas que entraram cedo na plataforma. A janela de vantagem de quem entra antes ainda está aberta.' },
      { type: 'heading', text: 'Como integrar social commerce ao funil sem criar nova equipe' },
      { type: 'paragraph', text: 'A integração mais eficiente começa com o reaproveitamento do conteúdo que a marca já produz, adaptado ao formato nativo de cada plataforma. Um vídeo de produto filmado para o Instagram pode ser editado para TikTok com ajustes de ritmo e legenda.' },
      { type: 'list', items: [
        'Mapeie em quais plataformas seu público-alvo passa mais tempo e priorize a presença nelas',
        'Ative o catálogo de produtos em cada plataforma e configure o checkout integrado',
        'Crie ou selecione criadores para produzir conteúdo nativo de produto, começando com um volume pequeno e testando o que performa',
        'Meça a contribuição do social commerce como canal separado, com atribuição própria, não somado ao e-commerce direto',
      ] },
      { type: 'heading', text: 'O que medir para avaliar o desempenho do social commerce' },
      { type: 'paragraph', text: 'KPIs específicos para acompanhar a operação de social commerce.' },
      { type: 'list', items: [
        'GMV (Volume de Mercadoria Vendido) por plataforma: TikTok Shop, Instagram Shopping, Pinterest',
        'Percentual de clientes novos que tiveram o primeiro contato por canal social',
        'CAC de clientes vindos de social commerce versus canais de performance tradicionais',
        'Taxa de visualização para compra de conteúdos orgânicos de produto',
        'LTV de clientes adquiridos por social commerce em comparação com outros canais',
      ] },
      { type: 'divider' },
      { type: 'heading', text: 'O que fazer a partir de agora' },
      { type: 'list', items: [
        'Ative o catálogo de produtos nas principais plataformas sociais onde seu público está',
        'Teste o TikTok Shop com um grupo de produtos de alta conversão e ciclo curto de decisão',
        'Estabeleça uma produção mínima de conteúdo nativo por semana e meça o engajamento',
        'Identifique criadores do seu nicho para parcerias de conteúdo e afiliados',
        'Defina social commerce como canal com budget, meta e atribuição próprios no seu planejamento',
      ] },
      { type: 'paragraph', text: 'Social commerce não substitui o e-commerce tradicional. Complementa. Marcas que integram os dois canais têm mais pontos de contato, mais oportunidades de descoberta e uma jornada de compra mais fluida para o cliente.' },
    ],
  },

  // ─── 6. Expansão de Demanda ──────────────────────────────────────────────────
  {
    slug: 'expansao-de-demanda-como-aumentar-ltv',
    title: 'Expansão de demanda: como aumentar LTV sem elevar o investimento em mídia',
    excerpt:
      'A terceira etapa do funil é onde marcas maduras concentram parte do crescimento. Frequência, ticket e retenção compõem o LTV, e os três podem ser otimizados sem aumentar o budget de aquisição.',
    category: 'Crescimento',
    author: 'Time Ciclo',
    authorRole: 'Especialistas em Full Funnel Marketing',
    date: '2025-02-28',
    readTime: 11,
    coverGradient: 'from-[#0a1a00] via-[#050d00] to-[#050505]',
    content: [
      { type: 'paragraph', text: 'LTV, ou Lifetime Value, é a métrica que separa marcas que crescem com rentabilidade das que ficam presas num ciclo de aquisição cara e margem apertada. E ao contrário do que parece, aumentar o LTV não exige mais investimento em mídia. Exige trabalho no pós-venda.' },
      { type: 'paragraph', text: 'Expansão de demanda é o nome dado à terceira etapa do funil: tudo que acontece depois que o cliente já comprou. É a área mais negligenciada e, paradoxalmente, a que tem maior potencial de retorno por real investido.' },
      { type: 'heading', text: 'O que é expansão de demanda e por que ela muda o jogo' },
      { type: 'paragraph', text: 'Enquanto geração de demanda cria reconhecimento e captação de demanda converte, expansão de demanda extrai mais valor de cada cliente já conquistado. O custo de aquisição já foi pago. Qualquer compra adicional desse cliente é receita com margem superior.' },
      { type: 'paragraph', text: 'Marcas que estruturam bem a expansão de demanda conseguem crescer o faturamento sem crescer proporcionalmente o budget de mídia. Essa capacidade de desacoplar crescimento de investimento em aquisição é o que diferencia operações escaláveis das que dependem de injeção constante de budget.' },
      { type: 'highlight', text: 'Uma marca com taxa de recompra de 30% tem, a cada 100 clientes adquiridos, 30 que voltam sem custo de aquisição. A diferença de rentabilidade entre essa marca e uma com 10% de recompra é enorme.' },
      { type: 'heading', text: 'A fórmula do LTV e onde atuar' },
      { type: 'highlight', text: 'LTV = Ticket Médio x Frequência de Compra x Tempo de Retenção. Para aumentar o LTV, a marca pode atuar em qualquer uma das três variáveis, individualmente ou em conjunto.' },
      { type: 'paragraph', text: 'A escolha de onde atuar primeiro depende de onde está o maior potencial de melhora. Marcas com ticket baixo devem olhar primeiro para upsell e bundling. Marcas com frequência baixa, para fluxos de recompra. Marcas com alta rotatividade de clientes, para programas de fidelidade e experiência pós-venda.' },
      { type: 'heading', text: 'Como aumentar o ticket médio sem usar desconto' },
      { type: 'subheading', text: 'Upsell no momento da compra' },
      { type: 'paragraph', text: 'O momento mais eficiente para oferecer um produto adicional ou uma versão superior é durante o processo de compra, quando a intenção de compra do cliente está ativa. Um upsell bem posicionado no carrinho ou na página de produto tem taxa de aceitação significativamente maior do que qualquer campanha posterior.' },
      { type: 'paragraph', text: 'O upsell não precisa ser um produto diferente. Pode ser uma quantidade maior do mesmo produto com desconto por volume, uma embalagem maior ou a versão premium com mais benefícios. O importante é que o valor adicional percebido justifique o preço maior.' },
      { type: 'subheading', text: 'Cross-sell no pós-compra imediato' },
      { type: 'paragraph', text: 'O e-mail de confirmação de pedido é um dos conteúdos com maior taxa de abertura em qualquer operação de e-commerce. Incluir uma recomendação relevante de produto complementar nesse e-mail, baseada no que foi comprado, é uma oportunidade de receita incremental que a maioria das marcas não aproveita.' },
      { type: 'paragraph', text: 'A chave é relevância. Quem comprou tênis de corrida provavelmente se interessa por meias de compressão ou palmilha. Quem comprou protetor solar talvez precise de after sun. A recomendação baseada em comportamento converte. A recomendação genérica, não.' },
      { type: 'subheading', text: 'Bundling estratégico de produtos' },
      { type: 'paragraph', text: 'Criar pacotes de produtos com preço abaixo da soma individual aumenta o ticket médio e ao mesmo tempo reduz a percepção de gasto por item. Funciona especialmente bem em categorias com rituais de uso combinado, como skincare, suplementação e alimentação.' },
      { type: 'heading', text: 'Como aumentar a frequência de compra' },
      { type: 'paragraph', text: 'Para produtos com ciclo de consumo previsível, a frequência é uma consequência do lembrete certo no momento certo. Suplementos que duram 30 dias, cosméticos que duram 60 dias, ração pet que dura 45 dias. Cada produto tem um ciclo, e uma campanha enviada antes do produto acabar tem taxa de conversão muito superior à campanha enviada em data aleatória.' },
      { type: 'paragraph', text: 'Para produtos sem ciclo previsível, como moda e decoração, a frequência depende do engajamento contínuo com a marca. Conteúdo regular, novidades de coleção, acesso antecipado para clientes recorrentes e programas de fidelidade criam motivos para o cliente voltar mesmo sem uma necessidade imediata.' },
      { type: 'highlight', text: 'Fluxos de recompra baseados no ciclo de consumo do produto têm taxa de conversão três a cinco vezes maior do que campanhas genéricas de base, com custo de envio praticamente zero.' },
      { type: 'ctaCard', text: 'A Ciclo estrutura estratégias de Expansão de Demanda para marcas de e-commerce que querem crescer o LTV sem aumentar o budget de aquisição.', ctaLabel: 'Ver nossa solução de Expansão de Demanda', ctaHref: '/solucoes/expansao-de-demanda' },
      { type: 'heading', text: 'Como aumentar o tempo de retenção' },
      { type: 'paragraph', text: 'Clientes que se sentem conectados à marca ficam mais tempo. Essa conexão não acontece por acidente. É construída por uma combinação de experiência de produto consistente, atendimento de qualidade, comunicação relevante e percepção de pertencimento.' },
      { type: 'paragraph', text: 'Programas de benefícios para clientes recorrentes não precisam ser complexos para funcionar. Frete grátis permanente, acesso antecipado a lançamentos, desconto progressivo por número de compras ou um canal de atendimento prioritário já criam diferenciação suficiente para reter clientes que de outra forma iriam comprar de um concorrente.' },
      { type: 'list', items: [
        'Mapeie quais produtos têm ciclo de consumo previsível e crie fluxos de recompra específicos para eles',
        'Identifique os produtos mais vendidos juntos na base de pedidos e crie bundles ou recomendações de cross-sell',
        'Crie pelo menos um benefício tangível e exclusivo para clientes que fizeram duas ou mais compras',
        'Implemente um fluxo de reativação para clientes que ultrapassaram o ciclo médio sem recomprar',
        'Meça o LTV segmentado por canal de aquisição para identificar quais canais trazem os clientes mais valiosos',
      ] },
      { type: 'heading', text: 'Por qual alavanca começar' },
      { type: 'paragraph', text: 'A priorização depende do ponto de maior potencial da operação. Para marcas com ticket médio abaixo de R$120, o maior ganho costuma vir de bundling e upsell. Para marcas com ticket acima de R$250 e alta diversidade de produtos, o cross-sell baseado em histórico de compra tem retorno maior. Para qualquer marca com taxa de recompra abaixo de 20%, o fluxo de pós-compra e reativação é o ponto de partida.' },
      { type: 'paragraph', text: 'Não é necessário implementar tudo ao mesmo tempo. Uma alavanca bem executada já muda os números de forma visível em dois ou três meses.' },
      { type: 'divider' },
      { type: 'heading', text: 'O que fazer a partir de agora' },
      { type: 'list', items: [
        'Calcule o LTV atual segmentado por canal de aquisição e identifique onde está o maior potencial de melhora',
        'Mapeie o ciclo médio de consumo do produto principal e crie uma campanha de recompra baseada nesse timing',
        'Implemente ao menos um upsell ou cross-sell automatizado no fluxo de compra ou pós-compra',
        'Crie um benefício simples e concreto para compradores recorrentes que justifique voltar',
        'Defina LTV e taxa de recompra como KPIs de negócio com acompanhamento trimestral',
      ] },
      { type: 'paragraph', text: 'Marcas que tratam expansão de demanda como prioridade conseguem crescer o faturamento sem crescer proporcionalmente o custo de marketing. Esse desacoplamento é o que torna uma operação de e-commerce escalável no longo prazo.' },
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

// Posts antigos (WordPress) substituídos por artigos novos do Keystatic.
// O redirect 301 e a remoção do sitemap só valem quando o artigo novo já
// está publicado (agendamento por data) — antes disso, o antigo segue no ar.
export const supersededWpPosts: Record<string, string> = {
  'pinterest-ads-para-e-commerce-como-vender-mais-na-plataforma':
    'pinterest-ads-ecommerce',
}

const categoryKeywords: Record<string, string[]> = {
  SEO: ['seo', 'busca orgânica', 'ranqueamento', 'palavras-chave', 'google search', 'orgânico'],
  'Mídia Paga': ['google ads', 'facebook ads', 'meta ads', 'tiktok ads', 'mídia paga', 'tráfego pago', 'campanha paga', 'anúncio'],
  'Redes Sociais': ['instagram', 'tiktok', 'facebook', 'social media', 'redes sociais', 'influencer', 'creator', 'reels'],
  'Marketing de Conteúdo': ['marketing de conteúdo', 'copywriting', 'editorial', 'redação', 'pauta'],
  'Gestão do E-commerce': ['e-commerce', 'ecommerce', 'loja virtual', 'plataforma', 'erp', 'operação', 'gestão de loja'],
  Vendas: ['vendas', 'conversão', 'checkout', 'carrinho', 'faturamento', 'ticket médio', 'pedido'],
  Logística: ['entrega', 'frete', 'logística', 'fulfillment', 'prazo de entrega', 'transportadora'],
  'Tecnologia e Inovação': ['inteligência artificial', 'automação', 'tecnologia', 'api', 'integração', 'software', 'ia '],
  'Experiência do cliente': ['experiência do cliente', 'customer experience', 'atendimento', 'satisfação', 'nps', 'jornada'],
  Marketplace: ['marketplace', 'amazon', 'mercado livre', 'magazine luiza', 'americanas', 'shopee'],
  'Métricas e Dados': ['analytics', 'métricas', 'kpi', 'dashboard', 'relatório', 'análise de dados', 'dados'],
  Tendências: ['tendência', 'trend', 'futuro do', 'novo cenário', '2025', '2024'],
  'Marketing Digital': ['marketing digital', 'estratégia digital', 'performance digital'],
}

export function inferCategory(title: string, excerpt: string): string {
  const text = `${title} ${excerpt}`.toLowerCase()
  let best = 'Marketing Digital'
  let bestScore = 0
  for (const [cat, kws] of Object.entries(categoryKeywords)) {
    const score = kws.filter((kw) => text.includes(kw)).length
    if (score > bestScore) { bestScore = score; best = cat }
  }
  return best
}

export function resolveCategory(category: string, title: string, excerpt: string): string {
  if (category && category !== 'Sem categoria') return category
  return inferCategory(title, excerpt)
}
