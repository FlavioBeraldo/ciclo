// Helpers de servidor para a API do Pipedrive (usados pelas API routes).
import {
  ATTRIBUTION_FIELD_KEYS,
  EXTRA_ATTRIBUTION_KEYS,
  type AttributionFieldKey,
} from './pipedrive-fields'

const BASE = 'https://api.pipedrive.com/v1'

export function pipedriveUrl(path: string, params: Record<string, string> = {}) {
  const token = process.env.PIPEDRIVE_API_TOKEN
  const qs = new URLSearchParams({ api_token: token!, ...params })
  return `${BASE}${path}?${qs}`
}

export function attributionFieldKeys(): Record<AttributionFieldKey, string> {
  return ATTRIBUTION_FIELD_KEYS
}

// Campos varchar gravados diretamente (o restante vai no JSON de "extra")
const DIRECT_KEYS: AttributionFieldKey[] = [
  'source',
  'medium',
  'campaign',
  'ga_client_id',
  'ga_session_id',
  'landing_page',
  'gclid',
]

/**
 * Monta as propriedades extras do Deal a partir do payload de atribuição do site:
 * campos diretos como varchar e {term, content, fbclid, referrer, first_visit}
 * consolidados como JSON no campo "Atribuição extra (GA)". Ignora vazios.
 */
export function attributionDealProps(attribution: unknown): Record<string, string> {
  if (typeof attribution !== 'object' || attribution === null) return {}
  const attr = attribution as Record<string, unknown>
  const props: Record<string, string> = {}

  for (const key of DIRECT_KEYS) {
    const value = attr[key]
    if (typeof value === 'string' && value.trim() !== '') {
      props[ATTRIBUTION_FIELD_KEYS[key]] = value.slice(0, 255)
    }
  }

  const extra: Record<string, string> = {}
  for (const key of EXTRA_ATTRIBUTION_KEYS) {
    const value = attr[key]
    if (typeof value === 'string' && value.trim() !== '') {
      extra[key] = value.slice(0, 1000)
    }
  }
  if (Object.keys(extra).length > 0) {
    props[ATTRIBUTION_FIELD_KEYS.extra] = JSON.stringify(extra)
  }

  return props
}
