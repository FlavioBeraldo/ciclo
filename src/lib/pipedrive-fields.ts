// Campos personalizados de Negócio (Deal) usados na atribuição GA4 <-> Pipedrive.
//
// Os campos foram criados na conta (que tem limite de 30 campos de Deal), por isso
// o esquema é CONSOLIDADO: 7 campos varchar diretos + 1 campo text que recebe um
// JSON com o restante da atribuição ({term, content, fbclid, referrer, first_visit}).
//
// As chaves hash abaixo são as retornadas pela API do Pipedrive — nunca chutadas.
// O campo "Objetivo" (34b57523aeb4efdfe90674f07fc548ccd3da2769) é pré-existente e
// permanece fora deste mapa.

export const ATTRIBUTION_FIELD_NAMES = {
  source: 'Origem (GA)',
  medium: 'Mídia (GA)',
  campaign: 'Campanha (GA)',
  ga_client_id: 'GA Client ID',
  ga_session_id: 'GA Session ID',
  landing_page: 'Landing Page',
  gclid: 'gclid',
  extra: 'Atribuição extra (GA)',
} as const

export type AttributionFieldKey = keyof typeof ATTRIBUTION_FIELD_NAMES

export const ATTRIBUTION_FIELD_KEYS: Record<AttributionFieldKey, string> = {
  source: '308abcb1e691a74448516e2aa0e47627707c5d03', // Origem (GA) [varchar]
  medium: 'd8b3af3c093a3ee1e0bbd66084f4cc15672d5789', // Mídia (GA) [varchar]
  campaign: '97e93aa5129c31beb3180fc43c61567f1e7dc427', // Campanha (GA) [varchar]
  ga_client_id: 'f1be9c93fa7a0d8c092e25b3ec924e69e458e0b3', // GA Client ID [varchar]
  ga_session_id: 'ffe34e9a1b798b607fb3f937e219cb3a3d0506ca', // GA Session ID [varchar]
  landing_page: 'ff38db9997ba5fca25f1e176d5733b0b57dbb4ac', // Landing Page [varchar]
  gclid: '9a5237229b3c4f35d8ccd24b35fc373acae8a93b', // gclid [varchar]
  extra: '344f9e4ae525229bb3f275c1429ac7841c379da3', // Atribuição extra (GA) [text] — JSON
}

// Chaves do payload de atribuição que vão consolidadas no JSON do campo "extra"
export const EXTRA_ATTRIBUTION_KEYS = ['term', 'content', 'fbclid', 'referrer', 'first_visit'] as const
