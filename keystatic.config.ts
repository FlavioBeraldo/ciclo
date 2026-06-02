import { config, fields, collection } from '@keystatic/core'

const CATEGORIES = [
  'Estratégia', 'Performance', 'Retenção', 'CRM', 'Social', 'Crescimento',
  'SEO', 'Mídia Paga', 'Redes Sociais', 'Marketing Digital', 'Marketing de Conteúdo',
  'Gestão do E-commerce', 'Vendas', 'Logística', 'Tecnologia e Inovação',
  'Experiência do cliente', 'Marketplace', 'Métricas e Dados', 'Tendências',
  'Noticias', 'Pesquisas de Mercado',
] as const

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Ciclo Blog' },
    navigation: { posts: ['posts'] },
  },
  collections: {
    posts: collection({
      label: 'Artigos do Blog',
      slugField: 'title',
      path: 'content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        excerpt: fields.text({
          label: 'Resumo',
          multiline: true,
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: 'Categoria',
          options: CATEGORIES.map((c) => ({ label: c, value: c })),
          defaultValue: 'Estratégia',
        }),
        date: fields.date({
          label: 'Data de publicação',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        author: fields.text({
          label: 'Autor',
          defaultValue: 'Time Ciclo',
        }),
        authorRole: fields.text({
          label: 'Cargo do Autor',
          defaultValue: 'Especialistas em Full Funnel Marketing',
        }),
        readTime: fields.integer({
          label: 'Tempo de leitura (minutos)',
          defaultValue: 5,
          validation: { min: 1 },
        }),
        content: fields.markdoc({ label: 'Conteúdo' }),
      },
    }),
  },
})
