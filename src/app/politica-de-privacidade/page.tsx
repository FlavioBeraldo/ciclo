import type { Metadata } from 'next'
import Link from 'next/link'
import OptOutNotice from './OptOutNotice'
import CicloHeader from '@/components/ciclo/CicloHeader'
import CicloFooter from '@/components/ciclo/CicloFooter'
import Breadcrumb from '@/components/ciclo/interior/Breadcrumb'
import { playfair2026 } from '@/components/ciclo/fonts'
import '@/components/ciclo/base.css'
import '@/components/ciclo/interiors.css'

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
      'Google LLC (Google Tag Manager, Google Analytics, Google Ads): para análise de desempenho e otimização de campanhas. Quando você envia um formulário, o seu e-mail e telefone são transmitidos ao Google Analytics e ao Google Ads de forma criptografada com hash (SHA-256), de modo irreversível, para medição de conversões e reconhecimento do mesmo usuário entre dispositivos (recurso "dados fornecidos pelo usuário"). O Google não recebe esses dados em texto legível.',
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
  {
    id: 'cookies-identificacao',
    title: '12. Cookies de identificação e registro de navegação',
    content: [
      'Utilizamos três cookies próprios para entender sua jornada no site: ciclo_uid (um identificador aleatório e anônimo do seu navegador), ciclo_attr (a origem da sua primeira visita — por exemplo, campanha, rede social ou busca) e ciclo_ga4_uid (descrito abaixo).',
      'Finalidade: registrar as páginas visitadas e interações (como downloads de materiais) para personalizar o atendimento comercial no nosso CRM. A associação entre a sua navegação e os seus dados pessoais (nome, e-mail) só acontece quando você envia um formulário e aceita expressamente esta Política.',
      'ciclo_ga4_uid: gravado somente depois que você envia um formulário. Contém um código derivado do seu e-mail por hash criptográfico (SHA-256), que não permite reconstruir o e-mail original. Esse código é usado como identificador de usuário (User-ID) no Google Analytics para reconhecer as suas visitas em sessões e dispositivos diferentes, e é armazenado também no localStorage do navegador. Validade: até 13 meses.',
      'Retenção: os registros de navegação são mantidos por até 12 meses.',
    ],
    cta: {
      href: '/api/track/optout',
      label: 'Desativar o registro de navegação neste navegador',
    },
    extra: [
      'Ao desativar, os cookies ciclo_uid, ciclo_attr e ciclo_ga4_uid são apagados (inclusive a cópia em localStorage) e o seu identificador é marcado para não registrar novos eventos. Também respeitamos o sinal "Do Not Track" do navegador.',
    ],
  },
  {
    id: 'transferencia-internacional',
    title: '13. Transferência internacional de dados',
    content: [
      'Alguns dos fornecedores listados na seção 5 estão sediados fora do Brasil, principalmente nos Estados Unidos. Por isso, dados pessoais e de navegação podem ser transferidos e armazenados em servidores no exterior pelas seguintes empresas:',
    ],
    list: [
      'Google LLC (Google Analytics, Google Ads, Google Tag Manager) — Estados Unidos',
      'Meta Platforms Inc. (Meta Pixel) — Estados Unidos',
      'Pipedrive Inc. (CRM) — Estados Unidos e União Europeia',
      'Vercel Inc. (hospedagem do site) — Estados Unidos',
    ],
    extra: [
      'Essas transferências ocorrem com fundamento no art. 33 da LGPD, mediante cláusulas contratuais padrão e compromissos de proteção de dados assumidos por cada fornecedor em nível equivalente ao exigido pela legislação brasileira. Sempre que possível, os dados são transmitidos de forma minimizada ou criptografada com hash, como descrito nas seções 5 e 12.',
      'Você pode solicitar mais informações sobre essas transferências pelo e-mail privacidade@cicloecommerce.com.br.',
    ],
  },
]

// Política de privacidade no design 2026.
//
// O array `sections` acima, que é o texto legal inteiro, não foi tocado: nem
// uma vírgula. O que muda é a casca e a tipografia, agora a mesma do corpo de
// artigo. Os ids das seções continuam os mesmos, então o índice e qualquer
// link externo que aponte para uma âncora seguem funcionando.
export default function PoliticaDePrivacidade() {
  return (
    <div className={`ciclo2026 ${playfair2026.variable}`}>
      <div className="inner legal-page">
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>

        <CicloHeader />

        <main id="conteudo">
          <section className="inner-hero">
            <div className="wrap narrow">
              <Breadcrumb
                etapas={[{ rotulo: 'Início', href: '/' }, { rotulo: 'Política de Privacidade' }]}
              />
            </div>
          </section>

          <section className="inner-section">
            <div className="wrap narrow">
              <OptOutNotice />

              <h1>
                {/* Exceção à regra do h1: aqui o rótulo pequeno continua sendo
                    "Conformidade Legal", que era o texto que já estava na
                    página. Trocá-lo pelo título apagaria copy existente, e o
                    nome da página já vem logo em seguida, dentro do mesmo h1. */}
                <span className="eyebrow h1-kicker">
                  <span />
                  Conformidade Legal
                </span>
                Política de Privacidade
              </h1>

              <p className="inner-lead">
                Em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº
                13.709/2018).
              </p>

              <p className="legal-data">Última atualização: setembro de 2026</p>

              <nav className="legal-indice" aria-label="Índice da política">
                <h2>Índice</h2>
                <ol>
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`}>{s.title}</a>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className="article-body legal-body">
                {sections.map((s) => (
                  <section key={s.id} id={s.id}>
                    <h2>{s.title}</h2>

                    {s.content.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}

                    {s.list && (
                      <ul>
                        {s.list.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}

                    {'cta' in s && s.cta && (
                      <p>
                        <a href={s.cta.href}>{s.cta.label}</a>
                      </p>
                    )}

                    {s.extra?.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </section>
                ))}
              </div>

              <div className="tts-cta">
                <h2>Dúvidas sobre privacidade? Fale com nosso time.</h2>
                <Link className="button" href="/#contato">
                  <span>Entrar em contato</span>
                  <b aria-hidden="true">↗</b>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <CicloFooter />
      </div>
    </div>
  )
}
