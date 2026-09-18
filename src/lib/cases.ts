// Cases de sucesso da Ciclo — fonte única.
//
// A home (CasesSection) e a landing da Consultoria E-com Shift leem daqui, para
// as duas nunca divergirem: qualquer ajuste de desafio, ação, métrica ou imagem
// aparece nos dois lugares ao mesmo tempo. O layout de cada página é livre; o
// conteúdo é sempre este.

export interface CaseMetric {
  label: string
  value: string
}

export interface CaseStudy {
  brand: string
  category: string
  challenge: string
  action: string
  metrics: CaseMetric[]
  /** Cor de base do gradiente usado nos cards da home */
  color: string
  image: string | null
  /** Enquadramento da foto quando o corte padrão não favorece a marca */
  imagePosition?: string
}

export const cases: CaseStudy[] = [
  {
    brand: 'Mamô Brasil',
    category: 'Fashion',
    challenge: 'Crescer com consistência e transformar compradores de primeira compra em clientes recorrentes.',
    action: 'Full Funnel Marketing: aquisição paga integrada a CRM e réguas de retenção.',
    metrics: [
      { label: 'Vendas YoY', value: '+200%' },
      { label: 'LTV', value: '+57%' },
    ],
    color: '#1a0a1a',
    image: '/cases/mamo.jpg',
    imagePosition: 'object-top',
  },
  {
    brand: 'GoPro Brasil',
    category: 'Tecnologia',
    challenge: 'Escalar as vendas no Brasil sem deixar o custo de aquisição subir junto.',
    action: 'Mídia paga full funnel com otimização contínua de campanhas e criativos.',
    metrics: [
      { label: 'Vendas YoY', value: '+120%' },
      { label: 'CAC', value: '-37%' },
    ],
    color: '#0a1a0a',
    image: '/cases/gopro.jpg',
  },
  {
    brand: 'Jack Links',
    category: 'D2C',
    challenge: 'Construir um canal de vendas D2C no Brasil.',
    action: 'Estruturação e operação de canais como flagship própria e marketplaces.',
    metrics: [
      { label: 'Branded Search YoY', value: '+57%' },
      { label: 'CAC', value: '-46%' },
    ],
    color: '#1a1a0a',
    image: '/cases/jacklinks.jpg',
  },
  {
    brand: 'Gringa',
    category: 'Fashion Luxury',
    challenge: 'Clientes levavam meses para voltar a comprar depois do primeiro pedido.',
    action: 'CRM e automações de recompra, com programas de fidelização e indicação.',
    metrics: [
      { label: 'Taxa de Recompra YoY', value: '+35%' },
      { label: 'Taxa de Indicação YoY', value: '+20%' },
      { label: 'Recência de Compra', value: '120→55 dias' },
    ],
    color: '#0a0a1a',
    image: '/cases/gringa.jpg',
  },
]
