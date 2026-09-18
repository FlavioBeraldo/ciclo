export interface YouTubeVideo {
  id: string
  title: string
  description: string
  publishedAt: string
  thumbnail: string
  url: string
}

export const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: 'djykk9EFghg',
    title: 'Líquido - Crescimento E-commerce',
    description: 'Como a Líquido escalou seu e-commerce com Full Funnel Marketing.',
    publishedAt: '2024-01-01T00:00:00Z',
    thumbnail: 'https://img.youtube.com/vi/djykk9EFghg/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=djykk9EFghg',
  },
  {
    id: 'xVdqhprwKWw',
    title: 'KVRA - Estratégia de Crescimento',
    description: 'A jornada de crescimento da KVRA com Ciclo E-commerce.',
    publishedAt: '2024-01-01T00:00:00Z',
    thumbnail: 'https://img.youtube.com/vi/xVdqhprwKWw/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=xVdqhprwKWw',
  },
  {
    id: '6B2XYATbK3Q',
    title: 'DANKI - Resultados Full Funnel',
    description: 'DANKI e os resultados de Full Funnel Marketing.',
    publishedAt: '2024-01-01T00:00:00Z',
    thumbnail: 'https://img.youtube.com/vi/6B2XYATbK3Q/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=6B2XYATbK3Q',
  },
  {
    id: 'EhnxUiDMMRg',
    title: 'Mamô Brasil - E-commerce de Sucesso',
    description: 'Mamô Brasil e sua estratégia de crescimento sustentável.',
    publishedAt: '2024-01-01T00:00:00Z',
    thumbnail: 'https://img.youtube.com/vi/EhnxUiDMMRg/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=EhnxUiDMMRg',
  },
]
