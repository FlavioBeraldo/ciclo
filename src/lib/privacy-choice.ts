export const policyVersion = '2026-11-23.1'
export const choiceCookie = 'ciclo_privacidade'
export const choiceLifetime = 180 * 24 * 3600
export type Choice = { analytics: boolean; marketing: boolean }
export const necessaryOnly: Choice = { analytics: false, marketing: false }

export function decodeChoice(value?: string): Choice | null {
  const [version, flags, extra] = (value ?? '').split(':')
  if (version !== policyVersion || !/^[01]{2}$/.test(flags ?? '') || extra !== undefined) return null
  return { analytics: flags[0] === '1', marketing: flags[1] === '1' }
}

export function encodeChoice(choice: Choice) {
  return policyVersion + ':' + Number(choice.analytics) + Number(choice.marketing)
}

export function googleChoices(choice: Choice) {
  const ads = choice.marketing ? 'granted' : 'denied'
  return { analytics_storage: choice.analytics ? 'granted' : 'denied',
    ad_storage: ads, ad_user_data: ads, ad_personalization: ads }
}
