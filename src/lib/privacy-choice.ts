export const policyVersion = 'perfil-a-2026-11-23.1'
export const choiceCookie = 'ciclo_pa_preferencia'
export const choiceLifetime = 180 * 24 * 3600

export function decodeChoice(value?: string): boolean | null {
  if (value === policyVersion + ':1') return true
  if (value === policyVersion + ':0') return false
  return null
}

export function encodeChoice(allowed: boolean) {
  return policyVersion + (allowed ? ':1' : ':0')
}
