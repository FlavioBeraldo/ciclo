// O experimento usa o ambiente que já possui o banco isolado do Playbook.
export const consentPreview = process.env.VERCEL_ENV === 'preview' &&
  process.env.VERCEL_GIT_COMMIT_REF === 'feat/perfil-comercial-playbook'
