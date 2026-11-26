import { z } from 'zod'

// Domínios de caixas pessoais. O provedor que hospeda o e-mail da empresa
// (por exemplo, Google Workspace) não interfere na validação do domínio próprio.
const personalDomains = new Set([
  'gmail.com', 'googlemail.com',
  'hotmail.com', 'hotmail.com.br', 'hotmail.co.uk', 'hotmail.fr', 'hotmail.de',
  'hotmail.it', 'hotmail.es', 'hotmail.com.ar', 'hotmail.com.mx',
  'outlook.com', 'outlook.com.br', 'outlook.pt', 'outlook.es', 'outlook.fr',
  'outlook.de', 'live.com', 'live.com.br', 'live.co.uk', 'live.fr', 'live.it',
  'live.nl', 'msn.com',
  'yahoo.com', 'yahoo.com.br', 'yahoo.co.uk', 'yahoo.com.ar', 'yahoo.com.mx',
  'yahoo.es', 'yahoo.fr', 'yahoo.de', 'yahoo.it', 'yahoo.ca', 'yahoo.co.jp',
  'yahoo.com.au', 'yahoo.co.in', 'ymail.com', 'rocketmail.com',
  'icloud.com', 'me.com', 'mac.com', 'privaterelay.appleid.com',
  'uol.com.br', 'bol.com.br', 'terra.com.br', 'ig.com.br', 'igmail.com.br',
  'globo.com', 'globomail.com', 'r7.com', 'zipmail.com.br', 'pop.com.br',
  'oi.com.br', 'ibest.com.br', 'itelefonica.com.br', 'superig.com.br',
  'proton.me', 'protonmail.com', 'protonmail.ch', 'pm.me', 'aol.com',
  'mail.com', 'email.com', 'gmx.com', 'gmx.net', 'gmx.de', 'fastmail.com',
  'tuta.com', 'tuta.io', 'tutanota.com', 'zoho.com', 'zohomail.com',
  'yandex.com', 'yandex.ru', 'mail.ru', 'qq.com', '163.com', '126.com',
])

export const corporateEmailMessage = 'Use o e-mail da sua empresa para baixar o Playbook.'

export function isPersonalPlaybookEmail(email: string) {
  const parts = email.trim().toLowerCase().split('@')
  return parts.length === 2 && personalDomains.has(parts[1])
}

export const manualPlaybookEmail = z.string().trim().email('E-mail inválido')
  .refine(email => !isPersonalPlaybookEmail(email), corporateEmailMessage)
