import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidade e LGPD | Ciclo E-commerce',
  description:
    'Saiba como a Ciclo E-commerce coleta, usa e protege seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cicloecommerce.com.br/politica-de-privacidade' },
}

const sections = [
  {
    id: 'controlador',
    title: '1. Quem é o Controlador dos seus dados',
    content: [
      'A Ciclo - Assessoria de Marketing e Inteligencia Digital Para E-Commerce LTDA, inscrita no CNPJ sob nº 23.757.895/0001-09, com sede em São Paulo/SP, é a Controladora dos dados pessoais tratados neste site, nos termos da Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018).',
      'Para exercer seus direitos ou tirar dúvidas sobre o tratamento dos seus dados, entre em contato pelo e-mail: privacidade@cicloecommerce.com.br',
    ],
  },
  {
    id: 'dados-coletados',
    title: '2. Dados pessoais que coletamos',
    content: [
      'Coletamos os seguintes dados pessoais fornecidos voluntariamente através dos formulários de contato do site:',
    ],
    list: [
      'Nome completo',
      'Endereço de e-mail',
      'Número de telefone / WhatsApp (com DDI)',
      'Nome da empresa e URL da loja virtual',
      'Informações sobre desafios e objetivos do negócio (campo de mensagem livre)',
    ],
    extra: [
      'Além disso, coletamos automaticamente dados de navegação por meio de cookies e tecnologias similares, incluindo endereço IP, tipo de navegador, páginas visitadas, duração da visita e origem do acesso (ver seção Cookies).',
    ],
  },
  {
    id: 'finalidade',
    title: '3. Para que usamos seus dados',
    content: ['Seus dados pessoais são utilizados exclusivamente para as seguintes finalidades:'],
    list: [
      'Responder às solicitações de contato e agendar conversas estratégicas',
      'Cadastro e gestão de leads no nosso CRM (Pipedrive)',
      'Envio de comunicações comerciais e conteúdos relevantes sobre e-commerce e marketing digital, quando autorizado',
      'Melhoria contínua dos nossos serviços e da experiência no site',
      'Cumprimento de obrigações legais e regulatórias',
      'Análise de desempenho das campanhas de marketing digital (via Google Tag Manager e ferramentas analíticas)',
    ],
  },
  {
    id: 'base-legal',
    title: '4. Base legal para o tratamento',
    content: ['O tratamento dos seus dados pessoais se baseia nas seguintes hipóteses legais previstas na LGPD:'],
    list: [
      'Consentimento (art. 7º, I): para o envio de comunicações de marketing e uso de cookies não essenciais, mediante aceite expresso no formulário',
      'Legítimo interesse (art. 7º, IX): para responder às suas solicitações de contato e gerenciar o relacionamento comercial',
      'Cumprimento de obrigação legal (art. 7º, II): quando exigido por lei ou regulamentação aplicável',
    ],
  },
  {
    id: 'compartilhamento',
    title: '5. Compartilhamento de dados',
    content: [
      'Seus dados podem ser compartilhados com terceiros apenas nas seguintes situações e sempre com as devidas garantias de segurança:',
    ],
    list: [
      'Pipedrive Inc. (CRM): para gestão e acompanhamento do relacionamento comercial',
      'Google LLC (Google Tag Manager, Google Analytics, Google Ads): para análise de desempenho e otimização de campanhas',
      'Meta Platforms Inc. (Meta Pixel): para análise e veiculação de anúncios',
      'Vercel Inc.: provedor de hospedagem do site, que processa dados de navegação',
      'Autoridades públicas: quando exigido por ordem judicial, regulatória ou legal',
    ],
    extra: [
      'Não vendemos, alugamos ou cedemos seus dados pessoais a terceiros para fins comerciais próprios.',
    ],
  },
  {
    id: 'retencao',
    title: '6. Retenção dos dados',
    content: [
      'Mantemos seus dados pessoais pelo tempo necessário para atingir as finalidades descritas nesta Política ou para cumprir obrigações legais:',
    ],
    list: [
      'Dados de leads e contatos comerciais: pelo período de relacionamento ativo acrescido de até 5 anos',
      'Dados de navegação e cookies analíticos: conforme configuração de cada ferramenta (em geral, 13 meses)',
      'Registros de consentimento: 5 anos a partir da coleta, como prova de conformidade',
    ],
    extra: [
      'Após o prazo aplicável, os dados são excluídos de forma segura ou anonimizados.',
    ],
  },
  {
    id: 'direitos',
    title: '7. Seus direitos como titular',
    content: [
      'Nos termos da LGPD, você tem os seguintes direitos em relação aos seus dados pessoais:',
    ],
    list: [
      'Confirmação e acesso: saber se tratamos seus dados e obter uma cópia',
      'Correção: solicitar a atualização de dados incompletos, inexatos ou desatualizados',
      'Anonimização, bloqueio ou eliminação: de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD',
      'Portabilidade: receber seus dados em formato estruturado e interoperável',
      'Eliminação: solicitar a exclusão dos dados tratados com base no consentimento',
      'Revogação do consentimento: retirar o consentimento a qualquer momento, sem prejuízo à licitude do tratamento anterior',
      'Oposição: opor-se ao tratamento realizado com fundamento em outras bases legais, em caso de descumprimento da LGPD',
      'Informação sobre compartilhamento: saber com quais entidades seus dados são compartilhados',
    ],
    extra: [
      'Para exercer qualquer um desses direitos, envie um e-mail para privacidade@cicloecommerce.com.br. Responderemos em até 15 dias úteis.',
    ],
  },
  {
    id: 'cookies',
    title: '8. Cookies e tecnologias de rastreamento',
    content: [
      'Utilizamos cookies e tecnologias similares para melhorar a experiência de navegação e analisar o desempenho do site. Os cookies são classificados em:',
    ],
    list: [
      'Essenciais: necessários para o funcionamento básico do site (sessão, segurança)',
      'Analíticos: coletam informações agregadas sobre uso do site (Google Analytics)',
      'Marketing: utilizados para mensurar e otimizar campanhas publicitárias (Google Ads, Meta Pixel, TikTok Pixel)',
      'Preferências: armazenam configurações do usuário',
    ],
    extra: [
      'Ao navegar no site e preencher nossos formulários, você consente com o uso de cookies conforme descrito acima. Você pode gerenciar ou desativar cookies nas configurações do seu navegador, o que pode afetar algumas funcionalidades do site.',
    ],
  },
  {
    id: 'seguranca',
    title: '9. Segurança dos dados',
    content: [
      'Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso não autorizado, perda, destruição ou divulgação indevida, incluindo:',
    ],
    list: [
      'Transmissão de dados via protocolo HTTPS (TLS)',
      'Acesso restrito aos dados por colaboradores autorizados',
      'Uso de fornecedores certificados (SOC 2, ISO 27001)',
      'Monitoramento e revisão periódica das práticas de segurança',
    ],
    extra: [
      'Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos titulares, notificaremos a Autoridade Nacional de Proteção de Dados (ANPD) e os titulares afetados nos prazos legais.',
    ],
  },
  {
    id: 'alteracoes',
    title: '10. Alterações nesta Política',
    content: [
      'Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças nas nossas práticas ou na legislação aplicável. A versão mais recente estará sempre disponível nesta página, com a data da última atualização.',
      'Recomendamos que você revise esta Política regularmente. Em caso de alterações significativas, informaremos através dos nossos canais de comunicação.',
    ],
  },
  {
    id: 'contato',
    title: '11. Contato e Encarregado (DPO)',
    content: [
      'Para exercer seus direitos, reportar incidentes ou esclarecer dúvidas sobre o tratamento de dados pessoais, entre em contato com nosso Encarregado de Proteção de Dados (DPO):',
    ],
    list: [
      'E-mail: privacidade@cicloecommerce.com.br',
      'Empresa: Ciclo - Assessoria de Marketing e Inteligencia Digital Para E-Commerce LTDA',
      'CNPJ: 23.757.895/0001-09',
      'Endereço: São Paulo, SP — Brasil',
    ],
    extra: [
      'Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD) pelo site: gov.br/anpd.',
    ],
  },
]

export default function PoliticaDePrivacidade() {
  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-4">
            Conformidade Legal
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Política de Privacidade
          </h1>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto mb-4">
            Em conformidade com a Lei Geral de Proteção de Dados Pessoais
            (LGPD — Lei nº 13.709/2018).
          </p>
          <p className="text-sm text-[#71717A]">
            Última atualização: maio de 2025
          </p>
        </div>

        {/* Index */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#A100FF] mb-4">
            Índice
          </h2>
          <ol className="space-y-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-[#D4D4D8] hover:text-[#A100FF] transition-colors"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-white/8">
                {s.title}
              </h2>
              {s.content.map((p, i) => (
                <p key={i} className="text-[#A1A1AA] text-sm leading-relaxed mb-3">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="space-y-2 my-3 ml-2">
                  {s.list.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A100FF]/60 flex-shrink-0 mt-1.5" />
                      <span className="text-[#D4D4D8] text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.extra?.map((p, i) => (
                <p key={i} className="text-[#A1A1AA] text-sm leading-relaxed mt-3">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center border-t border-white/8 pt-10">
          <p className="text-sm text-[#A1A1AA] mb-6">
            Dúvidas sobre privacidade? Fale com nosso time.
          </p>
          <Link
            href="/#contato"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#A100FF] text-white font-semibold text-sm hover:bg-[#8800DD] transition-colors"
          >
            Entrar em contato
          </Link>
        </div>

      </div>
    </main>
  )
}
