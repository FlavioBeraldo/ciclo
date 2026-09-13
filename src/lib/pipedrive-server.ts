// Helpers de servidor para a API do Pipedrive (usados pelas API routes).
import {
  ATTRIBUTION_FIELD_KEYS,
  EXTRA_ATTRIBUTION_KEYS,
  DEAL_FIELD_LINKEDIN,
  DEAL_FIELD_OBJETIVO,
  type AttributionFieldKey,
} from './pipedrive-fields'
import type { LinkedInProfile } from './linkedin-session'

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
 * `extraMerge` acrescenta pares ao JSON extra (ex.: linkedin_verified/sub).
 */
export function attributionDealProps(
  attribution: unknown,
  extraMerge?: Record<string, string | boolean>
): Record<string, string> {
  const attr =
    typeof attribution === 'object' && attribution !== null
      ? (attribution as Record<string, unknown>)
      : {}
  const props: Record<string, string> = {}

  for (const key of DIRECT_KEYS) {
    const value = attr[key]
    if (typeof value === 'string' && value.trim() !== '') {
      props[ATTRIBUTION_FIELD_KEYS[key]] = value.slice(0, 255)
    }
  }

  const extra: Record<string, string | boolean> = {}
  for (const key of EXTRA_ATTRIBUTION_KEYS) {
    const value = attr[key]
    if (typeof value === 'string' && value.trim() !== '') {
      extra[key] = value.slice(0, 1000)
    }
  }
  for (const [k, v] of Object.entries(extraMerge ?? {})) {
    if (v !== '' && v !== undefined && v !== null) extra[k] = v
  }
  if (Object.keys(extra).length > 0) {
    props[ATTRIBUTION_FIELD_KEYS.extra] = JSON.stringify(extra)
  }

  return props
}

// ── Criação de lead compartilhada (form /api/pipedrive e callback do LinkedIn) ─

// Busca o stage_id: hint por nome (ex.: "Playbook" -> primeira etapa do funil),
// senão env PIPEDRIVE_STAGE_ID, senão pipeline site/whats + etapa "entrada".
export async function findStageId(pipelineHint?: string): Promise<number | undefined> {
  if (!pipelineHint && process.env.PIPEDRIVE_STAGE_ID) {
    return Number(process.env.PIPEDRIVE_STAGE_ID)
  }

  const [pipelinesRes, stagesRes] = await Promise.all([
    fetch(pipedriveUrl('/pipelines')),
    fetch(pipedriveUrl('/stages')),
  ])
  const [pipelines, stages] = await Promise.all([pipelinesRes.json(), stagesRes.json()])
  if (!pipelines.success || !stages.success) {
    console.error('[Pipedrive] Falha ao buscar pipelines/stages')
    return undefined
  }

  const allPipelines = pipelines.data as { id: number; name: string }[]
  const allStages = stages.data as { id: number; name: string; pipeline_id: number; order_nr: number }[]

  if (pipelineHint) {
    const target = allPipelines.find((p) => p.name.toLowerCase().includes(pipelineHint.toLowerCase()))
    if (target) {
      const first = allStages
        .filter((s) => s.pipeline_id === target.id)
        .sort((a, b) => a.order_nr - b.order_nr)[0]
      if (first) {
        console.log(`[Pipedrive] Pipeline: "${target.name}" (${target.id}) | Primeira etapa: "${first.name}" (${first.id})`)
        return first.id
      }
      console.error('[Pipedrive] Pipeline', target.name, 'não tem etapas')
    } else {
      console.error(`[Pipedrive] Pipeline "${pipelineHint}" não encontrado — usando fluxo padrão. Pipelines:`, allPipelines.map((p) => p.name))
    }
    if (process.env.PIPEDRIVE_STAGE_ID) return Number(process.env.PIPEDRIVE_STAGE_ID)
  }

  const pipelineName = process.env.PIPEDRIVE_PIPELINE_NAME ?? ''
  const pipeline = pipelineName
    ? allPipelines.find((p) => p.name.toLowerCase().includes(pipelineName.toLowerCase()))
    : allPipelines.find((p) => /site|whats/i.test(p.name))
  if (!pipeline) {
    console.error('[Pipedrive] Pipeline não encontrado. Pipelines disponíveis:', allPipelines.map((p) => p.name))
    return undefined
  }

  const stageName = process.env.PIPEDRIVE_STAGE_NAME ?? ''
  const stage = stageName
    ? allStages.find((s) => s.pipeline_id === pipeline.id && s.name.toLowerCase().includes(stageName.toLowerCase()))
    : allStages.find((s) => s.pipeline_id === pipeline.id && /entrada/i.test(s.name))
  if (!stage) {
    console.error('[Pipedrive] Estágio não encontrado no pipeline', pipeline.name, '— Estágios:', allStages.filter((s) => s.pipeline_id === pipeline.id).map((s) => s.name))
    return undefined
  }

  console.log(`[Pipedrive] Pipeline: "${pipeline.name}" (${pipeline.id}) | Estágio: "${stage.name}" (${stage.id})`)
  return stage.id
}

export async function findUserId(name: string): Promise<number | undefined> {
  const res = await fetch(pipedriveUrl('/users'))
  const data = await res.json()
  if (!data.success || !data.data) return undefined
  const user = (data.data as { id: number; name: string }[]).find((u) =>
    u.name.toLowerCase().includes(name.toLowerCase())
  )
  if (!user) console.error('[Pipedrive] Usuário não encontrado:', name)
  return user?.id
}

export async function findOrCreateOrg(company: string): Promise<number | undefined> {
  const searchRes = await fetch(pipedriveUrl('/organizations/search', { term: company, fields: 'name', limit: '1' }))
  const searchData = await searchRes.json()
  if (searchData.success && searchData.data?.items?.length > 0) {
    return searchData.data.items[0].item.id
  }
  const createRes = await fetch(pipedriveUrl('/organizations'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: company }),
  })
  const createData = await createRes.json()
  return createData.data?.id
}

export async function findOrCreatePerson(
  name: string,
  email: string,
  phone: string,
  orgId?: number
): Promise<number | undefined> {
  const searchRes = await fetch(pipedriveUrl('/persons/search', { term: email, fields: 'email', limit: '1' }))
  const searchData = await searchRes.json()

  if (searchData.success && searchData.data?.items?.length > 0) {
    const existingId = searchData.data.items[0].item.id
    if (phone || orgId) {
      await fetch(pipedriveUrl(`/persons/${existingId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(phone ? { phone: [{ value: phone, primary: true }] } : {}),
          ...(orgId ? { org_id: orgId } : {}),
        }),
      })
    }
    return existingId
  }

  const createRes = await fetch(pipedriveUrl('/persons'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email: [{ value: email, primary: true }],
      phone: phone ? [{ value: phone, primary: true }] : [],
      org_id: orgId,
    }),
  })
  const createData = await createRes.json()
  return createData.data?.id
}

export interface LeadInput {
  name: string
  email: string
  phone?: string
  company?: string
  objetivo?: string
  pipelineHint?: string
  attribution?: unknown
  linkedin?: LinkedInProfile | null
}

/**
 * Cria o lead completo no Pipedrive: Person (+Organization quando houver empresa),
 * Deal no funil indicado com Objetivo, campos GA e dados do LinkedIn, e a Note de
 * verificação quando o cadastro veio do botão do LinkedIn.
 */
export async function createPipedriveLead(
  input: LeadInput
): Promise<{ success: boolean; dealId?: number; personId?: number }> {
  const { name, email, phone = '', company, objetivo = '', pipelineHint, attribution, linkedin } = input

  const [stageId, orgId, ownerId] = await Promise.all([
    findStageId(pipelineHint),
    company ? findOrCreateOrg(company) : Promise.resolve(undefined),
    findUserId('Felipe'),
  ])
  if (!stageId) {
    console.error('[Pipedrive] stage_id não encontrado — deal não será criado no funil correto')
  }

  const personId = await findOrCreatePerson(name, email, phone, orgId)

  const dealRes = await fetch(pipedriveUrl('/deals'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: name,
      person_id: personId,
      org_id: orgId,
      user_id: ownerId,
      stage_id: stageId,
      status: 'open',
      [DEAL_FIELD_OBJETIVO]: objetivo,
      // Cadastro via LinkedIn (OIDC não entrega URL do perfil nem cargo).
      // TODO: com acesso futuro ao scope r_basicprofile, mapear
      //   headline -> DEAL_FIELD_CARGO e vanityName -> DEAL_FIELD_LINKEDIN como URL
      ...(linkedin ? { [DEAL_FIELD_LINKEDIN]: `linkedin-id:${linkedin.sub}`.slice(0, 255) } : {}),
      ...attributionDealProps(
        attribution,
        linkedin
          ? {
              linkedin_verified: true,
              linkedin_sub: linkedin.sub,
              ...(linkedin.picture ? { linkedin_picture: linkedin.picture } : {}),
            }
          : undefined
      ),
    }),
  })
  const dealData = await dealRes.json()
  if (!dealData.success) {
    console.error('[Pipedrive] Erro ao criar deal:', dealData)
    return { success: false }
  }
  const dealId = dealData.data.id as number

  if (linkedin) {
    try {
      await fetch(pipedriveUrl('/notes'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deal_id: dealId,
          content: `Cadastro via LinkedIn (verificado): ${linkedin.name} ${linkedin.email}`,
        }),
      })
    } catch (err) {
      console.error('[Pipedrive] Falha ao criar note do LinkedIn:', err)
    }
  }

  console.log('[Pipedrive] Deal criado:', dealId, '| Stage:', stageId, linkedin ? '| via LinkedIn' : '')
  return { success: true, dealId, personId }
}

// ── Atribuição lida server-side dos cookies da requisição ─────────────────────
// Espelha a lógica de src/lib/attribution.ts para uso no callback do LinkedIn,
// onde não há JavaScript do cliente para montar o payload.

interface CookieStore {
  get(name: string): { value: string } | undefined
  getAll(): { name: string; value: string }[]
}

export function attributionFromRequestCookies(cookies: CookieStore): Record<string, string> {
  let base: Record<string, string> = {}
  const raw = cookies.get('ciclo_attr')?.value
  if (raw) {
    try {
      base = JSON.parse(decodeURIComponent(raw))
    } catch {
      try {
        base = JSON.parse(raw)
      } catch {
        // cookie ilegível — segue só com os cookies do GA
      }
    }
  }

  // _ga = "GA1.1.AAAA.BBBB" -> client_id "AAAA.BBBB"
  const ga = cookies.get('_ga')?.value
  if (ga) {
    const parts = ga.split('.')
    if (parts.length >= 4) base.ga_client_id = parts.slice(-2).join('.')
  }

  // Primeiro _ga_XXXX: "GS1.1.<session>...." ou "GS2.1.s<session>$o..."
  const gaSession = cookies.getAll().find((c) => c.name.startsWith('_ga_'))
  if (gaSession) {
    const third = gaSession.value.split('.')[2]
    if (third) {
      const session = third.startsWith('s') ? third.slice(1).split('$')[0] : third
      if (session) base.ga_session_id = session
    }
  }

  return base
}
