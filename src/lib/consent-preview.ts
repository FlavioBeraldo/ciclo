// Só a homologação suprime as tags reais. O site oficial mantém o layout de mensuração de produção.
export const consentPreview = process.env.VERCEL_ENV === 'preview' &&
  process.env.VERCEL_GIT_COMMIT_REF === 'feat/perfil-comercial-playbook'
export const profileNoticeEnabled = consentPreview || process.env.VERCEL_ENV === 'production'
