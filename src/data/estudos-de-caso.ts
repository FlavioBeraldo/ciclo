// Estudos de caso da Ciclo — as páginas /cases/<slug>.
//
// Fonte de conteúdo das páginas completas de case. O template
// (`@/components/ciclo/case/PaginaDeCase`) é o mesmo para todas: o que muda de
// uma marca para outra está só aqui.
//
// Regras de conteúdo, porque elas valem mais que o layout:
//  · Todo texto e todo número vem de material aprovado pelo cliente ou já
//    publicado no site (`src/lib/cases.ts`, que a home lê). Nada é estimado,
//    projetado ou completado para "fechar" uma seção.
//  · Seções opcionais (vídeo, materiais, depoimentos) só aparecem quando há
//    material real. Sem material, o campo fica de fora e a seção não existe —
//    o template nunca desenha caixa vazia.
//  · O vídeo de case aceita um ID do YouTube. Um case novo ganha vídeo
//    preenchendo `video`; o template já sabe colocá-lo no topo.
//
// `src/lib/cases.ts` continua sendo a fonte dos cartões da home e não muda: o
// arquivo é protegido byte a byte pela verificação do redesign. A ligação
// entre o cartão da home e a página completa fica em `SLUG_POR_MARCA`, abaixo.

export interface IndicadorDeCase {
  valor: string
  rotulo: string
}

export interface FotoDeCase {
  src: string
  alt: string
  largura: number
  altura: number
  /** `object-position` do recorte no quadro do hero */
  posicao?: string
}

export interface VideoDeCase {
  /** ID do vídeo no YouTube. O iframe só é montado depois do clique. */
  youtubeId: string
  titulo: string
  legenda?: string
}

export interface MaterialDeCase {
  src: string
  alt: string
  largura: number
  altura: number
  legenda?: string
}

export interface DepoimentoDeCase {
  citacao: string
  autor: string
  cargo?: string
}

export interface EtapaDeCase {
  titulo: string
  texto: string
}

/** Uma fase do Funil Ampulheta: criar, captar e expandir demanda. */
export interface FaseDoFunil {
  nome: string
  foco: string
  texto: string
  /** Fato do diagnóstico que a fase responde. Aparece destacado na fase. */
  pontoDePartida?: { valor: string; rotulo: string }
}

/** Um ambiente comercial no ecossistema D2C, com o indicador dele. */
export interface AmbienteComercial {
  nome: string
  detalhe: string
  texto: string
  indicador: IndicadorDeCase
}

export type FrameworkDeCase =
  | {
      tipo: 'funil-ampulheta'
      titulo: string
      texto: string
      fases: [FaseDoFunil, FaseDoFunil, FaseDoFunil]
      /** Rótulo do estreitamento entre captar e expandir */
      gargalo: string
      chave: string
    }
  | {
      tipo: 'ciclo-relacionamento'
      titulo: string
      texto: string
      centro: { titulo: string; texto: string }
      etapas: EtapaDeCase[]
      chave: string
    }
  | {
      tipo: 'ecossistema-d2c'
      titulo: string
      texto: string
      origem: { titulo: string; texto: string }
      ambientes: AmbienteComercial[]
      chave: string
    }

/** Comparação entre dois valores medidos, sem série intermediária. */
export interface ComparacaoDeCase {
  titulo: string
  unidade: string
  antes: { rotulo: string; valor: number }
  depois: { rotulo: string; valor: number }
  legenda: string
}

export interface EstudoDeCase {
  slug: string
  marca: string
  nomeCurto: string
  segmento: string
  /** Frente do Full Funnel que o case representa */
  frente: string
  seo: { titulo: string; descricao: string }
  hero: {
    /** Título em partes; a parte com `destaque` sai em Playfair itálica */
    titulo: { texto: string; destaque?: boolean }[]
    resumo: string
    foto: FotoDeCase
  }
  indicadores: IndicadorDeCase[]
  legendaIndicadores?: string
  video?: VideoDeCase
  desafio: { titulo: string; paragrafos: string[] }
  estrategia: { titulo: string; paragrafos: string[]; frameworks: FrameworkDeCase[] }
  execucao: {
    titulo: string
    paragrafos: string[]
    etapas?: EtapaDeCase[]
    /** Leitura da sequência de etapas (lançamento → manutenção → evolução) */
    sequencia?: boolean
    materiais?: MaterialDeCase[]
  }
  resultados: {
    titulo: string
    paragrafos: string[]
    comparacao?: ComparacaoDeCase
    nota?: string
  }
  depoimentos?: DepoimentoDeCase[]
}

export const estudosDeCaso: EstudoDeCase[] = [
  // ── Mamô Brasil ───────────────────────────────────────────────────────────
  {
    slug: 'mamo',
    marca: 'Mamô Brasil',
    nomeCurto: 'Mamô',
    segmento: 'Moda',
    frente: 'Full Funnel',
    seo: {
      titulo: 'Case Mamô Brasil: crescimento em Full Funnel | Ciclo E-commerce',
      descricao:
        'Como a Ciclo conectou awareness, conversão e CRM para a Mamô Brasil criar demanda, captar novos compradores e reativar a base: +200% em vendas YoY e +57% em LTV.',
    },
    hero: {
      titulo: [
        { texto: 'Da consciência de marca ' },
        { texto: 'à recompra', destaque: true },
        { texto: ': o crescimento da Mamô em Full Funnel.' },
      ],
      resumo:
        'Awareness, conversão e CRM conectados para criar demanda, captar novos compradores e fortalecer o relacionamento com quem já conhecia a marca.',
      foto: {
        src: '/cases/mamo.jpg',
        alt: 'Campanha da Mamô Brasil: modelo com vestido vermelho',
        largura: 399,
        altura: 501,
        posicao: 'center top',
      },
    },
    indicadores: [
      { valor: '+200%', rotulo: 'Vendas YoY' },
      { valor: '+57%', rotulo: 'LTV' },
    ],
    legendaIndicadores: 'Indicadores do case',
    video: {
      youtubeId: 'MlDyvGg7rGs',
      titulo: 'Depoimento Mamô Brasil — Ciclo E-commerce',
      legenda: 'Mamô Brasil e sua estratégia de crescimento sustentável.',
    },
    desafio: {
      titulo: 'Pouca presença nas buscas e uma base inteira à espera.',
      paragrafos: [
        'Quando a Ciclo começou a trabalhar com a Mamô Brasil, a marca enfrentava dois problemas ao mesmo tempo. O primeiro era de presença: baixa participação nas buscas da categoria (share of search) e a necessidade de aumentar a demanda a partir da consciência de marca.',
        'O segundo estava dentro de casa. No diagnóstico inicial, a marca tinha uma base de 150 mil clientes inativos: pessoas que já haviam comprado da Mamô, mas não estavam mais comprando.',
        'O desafio não cabia em um único canal. Era preciso fazer mais gente conhecer a marca, transformar esse interesse em compra e reaproximar quem já conhecia a Mamô.',
      ],
    },
    estrategia: {
      titulo: 'Tratar o funil inteiro como um único sistema.',
      paragrafos: [
        'A Ciclo passou a cuidar de praticamente todo o funil de marketing da marca: a estratégia de awareness, a de conversão e a de retenção no CRM.',
        'Em vez de otimizar cada etapa isoladamente, o trabalho foi organizado como um Funil Ampulheta. A demanda criada no topo alimenta a conversão, e quem compra entra numa segunda metade do funil, voltada a relacionamento e recompra. É nessa metade que a base inativa deixa de ser um número parado e vira oportunidade.',
      ],
      frameworks: [
        {
          tipo: 'funil-ampulheta',
          titulo: 'O Funil Ampulheta da Mamô',
          texto:
            'Três movimentos conectados, do primeiro contato com a marca à recompra. Cada fase responde a uma parte do diagnóstico.',
          fases: [
            {
              nome: 'Criação de demanda',
              foco: 'Awareness e consciência de marca',
              texto:
                'Ampliar a presença da Mamô para que mais pessoas conheçam a marca e passem a procurá-la. É a resposta à baixa participação nas buscas.',
            },
            {
              nome: 'Captação de demanda',
              foco: 'Conversão',
              texto:
                'Transformar o interesse gerado em pedidos, captando quem já está buscando ou considerando a marca.',
            },
            {
              nome: 'Expansão de demanda',
              foco: 'Reativação e retenção no CRM',
              texto:
                'Reaproximar clientes inativos e fortalecer o relacionamento com quem já comprou, estimulando a recompra.',
              pontoDePartida: {
                valor: '150 mil',
                rotulo: 'clientes inativos na base, no diagnóstico inicial',
              },
            },
          ],
          gargalo: 'Compra',
          chave: 'Demanda criada no topo, captada na conversão e expandida no relacionamento.',
        },
      ],
    },
    execucao: {
      titulo: 'Awareness, conversão e CRM sob a mesma direção.',
      paragrafos: [
        'A execução seguiu o desenho do funil: aquisição paga integrada ao CRM e a réguas de retenção, com as três frentes lidas em conjunto.',
      ],
      etapas: [
        {
          titulo: 'Awareness',
          texto: 'Comunicação para ampliar o conhecimento da marca e alimentar a demanda que a conversão vai captar depois.',
        },
        {
          titulo: 'Conversão',
          texto: 'Aquisição orientada a transformar o interesse criado em novos compradores.',
        },
        {
          titulo: 'CRM',
          texto: 'Reativação da base inativa e réguas de retenção para manter o relacionamento depois da compra.',
        },
      ],
    },
    resultados: {
      titulo: 'Mais vendas e clientes mais valiosos.',
      paragrafos: [
        'Com as três frentes conectadas, a Mamô registrou crescimento de 200% em vendas na comparação ano contra ano e aumento de 57% no LTV.',
        'O LTV mede o valor que cada cliente gera ao longo do relacionamento com a marca. É o indicador que mostra o efeito de unir aquisição e retenção em vez de tratá-las separadamente.',
      ],
    },
  },

  // ── Gringa ────────────────────────────────────────────────────────────────
  {
    slug: 'gringa',
    marca: 'Gringa',
    nomeCurto: 'Gringa',
    segmento: 'Moda e luxo',
    frente: 'Expansão de Demanda',
    seo: {
      titulo: 'Case Gringa: CRM, recompra e indicação | Ciclo E-commerce',
      descricao:
        'Como a Ciclo fortaleceu o relacionamento da Gringa com seus clientes: taxa de recompra +35% YoY, taxa de indicação +20% YoY e recência de compra de 120 para 55 dias.',
    },
    hero: {
      titulo: [
        { texto: 'Mais proximidade. Mais recompra. ' },
        { texto: 'Mais indicação.', destaque: true },
      ],
      resumo:
        'Como a Ciclo fortaleceu o relacionamento da Gringa com sua base de clientes, com CRM e automações que estimulam a recompra e a recomendação da marca.',
      foto: {
        src: '/cases/gringa.jpg',
        alt: 'Fiorella Mattheis com bolsas e sacola da Gringa',
        largura: 855,
        altura: 481,
        posicao: '46% center',
      },
    },
    indicadores: [
      { valor: '+35%', rotulo: 'Aumento da taxa de recompra · YoY' },
      { valor: '+20%', rotulo: 'Aumento na taxa de indicação · YoY' },
      { valor: '120→55 dias', rotulo: 'Redução na recência de compra · comparação YoY' },
    ],
    legendaIndicadores: 'Indicadores do case',
    desafio: {
      titulo: 'Clientes que demoravam a voltar.',
      paragrafos: [
        'A Ciclo foi contratada pela Gringa, marca da atriz, modelo e empreendedora Fiorella Mattheis, para fortalecer o relacionamento com seus clientes.',
        'O ponto de atenção estava depois do primeiro pedido: os clientes levavam meses para voltar a comprar. O objetivo era gerar mais recompra, mais proximidade com a base e mais estímulo à recomendação da marca.',
      ],
    },
    estrategia: {
      titulo: 'Relacionamento como motor de crescimento.',
      paragrafos: [
        'Numa marca de moda de luxo, a base de clientes é um dos ativos mais valiosos. A estratégia tratou relacionamento, recompra e recomendação como partes de um mesmo ciclo, e não como ações soltas.',
        'Quanto mais próxima a relação, mais natural a volta à loja. Quem volta e se sente bem atendido tem motivo para recomendar. E cada recomendação traz uma nova pessoa para dentro do relacionamento, que recomeça o ciclo com mais força.',
      ],
      frameworks: [
        {
          tipo: 'ciclo-relacionamento',
          titulo: 'O ciclo de relacionamento da Gringa',
          texto:
            'CRM e automações no centro, sustentando quatro movimentos que se alimentam em sequência.',
          centro: {
            titulo: 'CRM e automações',
            texto: 'O que mantém o ciclo girando entre uma compra e outra.',
          },
          etapas: [
            {
              titulo: 'Relacionamento',
              texto: 'A marca presente na rotina do cliente depois do primeiro pedido.',
            },
            {
              titulo: 'Recompra',
              texto: 'Automações que trazem o cliente de volta antes de ele esfriar.',
            },
            {
              titulo: 'Recomendação',
              texto: 'Programa de indicação que transforma clientes em quem apresenta a marca.',
            },
            {
              titulo: 'Fortalecimento do relacionamento',
              texto: 'Fidelização que aprofunda o vínculo e reabre o ciclo.',
            },
          ],
          chave: 'Cada volta do ciclo deixa o relacionamento mais forte que a anterior.',
        },
      ],
    },
    execucao: {
      titulo: 'CRM, automações, fidelização e indicação.',
      paragrafos: [
        'A execução se apoiou em CRM e automações de recompra, combinados a programas de fidelização e de indicação.',
      ],
      etapas: [
        {
          titulo: 'CRM e automações de recompra',
          texto: 'Comunicação com a base organizada para estimular a segunda compra e as seguintes.',
        },
        {
          titulo: 'Programa de fidelização',
          texto: 'Motivos concretos para o cliente continuar comprando da marca.',
        },
        {
          titulo: 'Programa de indicação',
          texto: 'Estímulo para que clientes recomendem a Gringa a novas pessoas.',
        },
      ],
    },
    resultados: {
      titulo: 'Clientes voltando antes e trazendo outros.',
      paragrafos: [
        'Na comparação ano contra ano, a taxa de recompra aumentou 35% e a taxa de indicação aumentou 20%.',
        'A recência de compra caiu de 120 para 55 dias, também na comparação YoY: menos da metade do valor anterior.',
      ],
      comparacao: {
        titulo: 'Recência de compra',
        unidade: 'dias',
        antes: { rotulo: 'Antes', valor: 120 },
        depois: { rotulo: 'Depois', valor: 55 },
        legenda: 'Comparação YoY entre os dois valores medidos. Barras na mesma escala.',
      },
    },
  },

  // ── GoPro Brasil ──────────────────────────────────────────────────────────
  {
    slug: 'gopro',
    marca: 'GoPro Brasil',
    nomeCurto: 'GoPro',
    segmento: 'Tecnologia',
    frente: 'Captação de Demanda',
    seo: {
      titulo: 'Case GoPro Brasil: lançamento D2C e vendas digitais | Ciclo E-commerce',
      descricao:
        'A Ciclo participou do lançamento da operação D2C da GoPro no Brasil e da evolução das estratégias digitais: tráfego do site +350% YoY e vendas D2C, 1P e 2P em alta.',
    },
    hero: {
      titulo: [
        { texto: 'Do lançamento D2C ' },
        { texto: 'à expansão das vendas digitais.', destaque: true },
      ],
      resumo:
        'A Ciclo participou do lançamento da operação D2C da GoPro no Brasil e seguiu na manutenção e evolução das estratégias digitais para sustentar o crescimento da operação.',
      foto: {
        src: '/cases/gopro.jpg',
        alt: 'Imagem de campanha da GoPro: atleta de snowboard filmando com câmera GoPro',
        largura: 1280,
        altura: 720,
        posicao: '86% center',
      },
    },
    indicadores: [
      { valor: '+350%', rotulo: 'Tráfego do site · YoY' },
      { valor: '+120%', rotulo: 'Vendas no site D2C (Flagship) · YoY' },
      { valor: '+270%', rotulo: 'Vendas nos marketplaces 1P (gestão própria) · YoY' },
      { valor: '+320%', rotulo: 'Vendas nos marketplaces 2P (revendedores) · YoY' },
    ],
    legendaIndicadores: 'Indicadores do case',
    desafio: {
      titulo: 'Um novo modelo de venda para a marca no Brasil.',
      paragrafos: [
        'A GoPro estava lançando sua operação D2C (direct-to-consumer) no Brasil. A Ciclo participou desse lançamento, apoiando a entrada da marca nesse novo modelo de venda.',
        'Um lançamento não termina na estreia. Depois da entrada, era preciso sustentar o crescimento da operação, com a demanda pela marca circulando por mais de um ambiente de compra: o site próprio e os marketplaces.',
      ],
    },
    estrategia: {
      titulo: 'Uma marca, três ambientes de venda.',
      paragrafos: [
        'A estratégia digital trabalhou a demanda pela GoPro conectada aos três ambientes comerciais da operação: a flagship D2C, os marketplaces 1P, sob gestão própria, e os marketplaces 2P, operados por revendedores.',
        'Ler os três juntos ajuda a entender o crescimento da operação como um todo, sem tratar cada canal como uma ilha.',
      ],
      frameworks: [
        {
          tipo: 'ecossistema-d2c',
          titulo: 'Demanda conectada aos ambientes de venda',
          texto:
            'A mesma demanda pela marca chega ao consumidor por caminhos diferentes. Cada ambiente tem papel próprio e um indicador próprio.',
          origem: {
            titulo: 'Marca e demanda digital',
            texto: 'Estratégias digitais que levam o consumidor até a GoPro.',
          },
          ambientes: [
            {
              nome: 'Flagship D2C',
              detalhe: 'Site próprio da marca',
              texto: 'Venda direta ao consumidor, no ambiente controlado pela GoPro.',
              indicador: { valor: '+120%', rotulo: 'Vendas no site D2C (Flagship) · YoY' },
            },
            {
              nome: 'Marketplaces 1P',
              detalhe: 'Gestão própria',
              texto: 'Presença da marca nos marketplaces com operação própria.',
              indicador: { valor: '+270%', rotulo: 'Vendas nos marketplaces 1P · YoY' },
            },
            {
              nome: 'Marketplaces 2P',
              detalhe: 'Revendedores',
              texto: 'Vendas da marca nos marketplaces por meio de revendedores.',
              indicador: { valor: '+320%', rotulo: 'Vendas nos marketplaces 2P · YoY' },
            },
          ],
          chave:
            'A estratégia digital é uma das forças por trás desse movimento, lida em conjunto com a operação de cada canal.',
        },
      ],
    },
    execucao: {
      titulo: 'Lançar, manter e evoluir.',
      paragrafos: [
        'A atuação acompanhou a operação desde a entrada no modelo D2C, com mídia paga full funnel e otimização contínua de campanhas e criativos.',
      ],
      sequencia: true,
      etapas: [
        {
          titulo: 'Lançamento',
          texto: 'Apoio à entrada da GoPro no modelo de venda D2C no Brasil.',
        },
        {
          titulo: 'Manutenção',
          texto: 'Continuidade das estratégias digitais depois da entrada da operação.',
        },
        {
          titulo: 'Evolução',
          texto: 'Evolução das estratégias para sustentar o crescimento da operação.',
        },
      ],
    },
    resultados: {
      titulo: 'Crescimento nos três ambientes de venda.',
      paragrafos: [
        'Na comparação ano contra ano, o tráfego do site cresceu 350%. As vendas cresceram 120% no site D2C (Flagship), 270% nos marketplaces 1P, de gestão própria, e 320% nos marketplaces 2P, de revendedores.',
      ],
      nota: 'Cada indicador mede um ambiente diferente, na comparação YoY. Tráfego mede visitas ao site, não receita.',
    },
  },
]

export function getEstudoDeCase(slug: string): EstudoDeCase | undefined {
  return estudosDeCaso.find((c) => c.slug === slug)
}

export function getAllEstudoDeCaseSlugs(): string[] {
  return estudosDeCaso.map((c) => c.slug)
}

/** Marca do cartão da home (`src/lib/cases.ts`) → página completa do case. */
export const SLUG_POR_MARCA: Record<string, string> = Object.fromEntries(
  estudosDeCaso.map((c) => [c.marca, c.slug])
)
