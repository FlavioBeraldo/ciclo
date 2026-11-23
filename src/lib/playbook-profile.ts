// Chaves estáveis usadas pelo formulário, pelo CRM e pelos relatórios.
export const roles = {
  dono: 'Dono, sócio ou fundador', diretor: 'Diretor',
  gestor: 'Gerente ou head', coordenador: 'Coordenador',
  analista: 'Analista ou especialista', outro: 'Outro',
}
export const businesses = {
  marca: 'Marca própria', industria: 'Indústria ou fabricante com marca própria',
  varejo: 'Varejista ou e-commerce', agencia: 'Agência ou consultoria',
  fornecedor: 'Fornecedor de serviços ou tecnologia', outro: 'Outro',
}
export const revenues = {
  abaixo_2mi: 'Menos de R$ 2 milhões', a_partir_2mi: 'R$ 2 milhões ou mais',
}
export const decisions = {
  decido: 'Tomo a decisão final', participo: 'Participo da decisão',
  executo: 'Executo, sem participar da contratação', fora: 'Não atuo nessa contratação',
}
export type Answers = { cargo?: string; negocio?: string; faturamento?: string; decisao?: string }

function option(options: Record<string, string>, value: unknown) {
  return typeof value === 'string' && Object.hasOwn(options, value) ? value : ''
}

export function classify(answers: Answers, email: string) {
  const cargo = option(roles, answers.cargo)
  const tipo_negocio = option(businesses, answers.negocio)
  const gestor = cargo === 'diretor' || cargo === 'gestor'
  const faixa_faturamento = cargo === 'dono' ? option(revenues, answers.faturamento) : ''
  const papel_decisao = gestor ? option(decisions, answers.decisao) : ''
  const elegivel = ['marca', 'industria', 'varejo'].includes(tipo_negocio)
  const qualifica = elegivel && (faixa_faturamento === 'a_partir_2mi' || ['decido', 'participo'].includes(papel_decisao))
  const completa = Boolean(cargo && tipo_negocio && (!elegivel ||
    (cargo === 'dono' ? faixa_faturamento : !gestor || papel_decisao)))
  const domain = email.trim().toLowerCase().split('@')[1] || ''
  const email_corporativo = !!domain && !/^(gmail|hotmail|outlook|yahoo)\.(com|com\.br|co\.uk|[a-z]{2})$/.test(domain)
  return { perfil: qualifica ? 'A' : 'B', completa, cargo, tipo_negocio, faixa_faturamento, papel_decisao, email_corporativo }
}
