import Link from 'next/link'
import Image from 'next/image'

// Rodapé do design 2026, conforme o kit de layouts.
// Quatro colunas, marca d'água e linha legal. Os links apontam para as rotas
// reais do projeto; o CSS do kit inverte o logo preto para branco no escuro.

const COLUNAS = [
  {
    titulo: 'Soluções',
    links: [
      { label: 'Geração de Demanda', href: '/solucoes/geracao-de-demanda' },
      { label: 'Captação de Demanda', href: '/solucoes/captacao-de-demanda' },
      { label: 'Expansão de Demanda', href: '/solucoes/expansao-de-demanda' },
      { label: 'Inteligência & Operação', href: '/solucoes/inteligencia-e-operacao' },
    ],
  },
  {
    titulo: 'Serviços',
    links: [
      { label: 'TikTok Shop', href: '/tiktok-shop' },
      { label: 'Consultoria para E-commerce', href: '/consultoria-para-e-commerce' },
      { label: 'Google Ads', href: '/servicos/google-ads' },
      { label: 'Meta Ads', href: '/servicos/meta-ads' },
      { label: 'CRM & Automação', href: '/servicos/crm-email-sms-push-whatsapp' },
      { label: 'Analytics & BI', href: '/servicos/analytics-bi' },
    ],
  },
  {
    titulo: 'Conteúdo',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Cases de Sucesso', href: '/#cases' },
      { label: 'O Fator M · Podcast', href: '/ofatorm' },
      { label: 'ECOM Shift · Treinamento', href: '/ecomshift' },
    ],
  },
]

const CONECTE = [
  { label: 'Instagram', href: 'https://www.instagram.com/cicloecommerce/', externo: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ciclo-ecommerce', externo: true },
  { label: 'YouTube', href: 'https://www.youtube.com/@ofatorm/videos', externo: true },
  { label: 'Mapa do site', href: '/mapa-do-site', externo: false },
  { label: 'Falar com especialista', href: '/#contato', externo: false },
]

export default function CicloFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          {COLUNAS.map((col) => (
            <div className="footer-col" key={col.titulo}>
              <h3>{col.titulo}</h3>
              {col.links.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}

          <div className="footer-col">
            <h3>Conecte-se</h3>
            {CONECTE.map((l) =>
              l.externo ? (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              ) : (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              )
            )}
          </div>
        </div>

        <div className="footer-wordmark">
          <Image
            src="/logo-ciclo-black.png"
            alt="Ciclo E-commerce"
            width={1010}
            height={250}
            loading="lazy"
          />
          <p>
            Agência Full Funnel
            <br />
            para E-commerce.
          </p>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ciclo E-commerce. Todos os direitos reservados.</span>
          <span>
            CNPJ: 23.757.895/0001-09 · Ciclo - Assessoria de Marketing e Inteligencia Digital
            Para E-Commerce LTDA
          </span>
        </div>
      </div>
    </footer>
  )
}
