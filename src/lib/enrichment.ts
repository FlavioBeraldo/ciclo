// Enriquecimento de leads com a API da Anthropic (Claude + web search).
// Roda em background após o webhook added.deal; nunca derruba o webhook.
import Anthropic from '@anthropic-ai/sdk'
import { pipedriveUrl } from './pipedrive-server'
import {
  DEAL_FIELD_CARGO,
  DEAL_FIELD_LINKEDIN,
  DEAL_FIELD_SEGMENTO,
  DEAL_FIELD_SITE,
} from './pipedrive-fields'

const MODEL = () => process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5'
const ENRICH_TAG = '[Enriquecimento automático]'

const GENERIC_EMAIL_PROVIDERS = ['gmail', 'hotmail', 'outlook', 'yahoo', 'icloud', 'uol', 'bol', 'terra', 'live']

export function isGenericEmailDomain(email: string | undefined): boolean {
  const domain = email?.split('@')[1]?.toLowerCase() ?? ''
  return GENERIC_EMAIL_PROVIDERS.some((p) => domain === `${p}.com` || domain.startsWith(`${p}.com.`) || domain.startsWith(`${p}.`))
}

// ── Detecção determinística de plataforma (prevalece sobre o modelo) ──────────

const PLATFORM_SIGNATURES: [string, string[]][] = [
  ['VTEX', ['vtex']],
  ['Shopify', ['cdn.shopify', 'shopify']],
  ['Nuvemshop', ['nuvemshop', 'tiendanube', 'nuvem shop']],
  ['Magento', ['magento', 'mage/']],
  ['WooCommerce', ['woocommerce']],
  ['Tray', ['tray.com.br', 'traycorp']],
  ['Loja Integrada', ['lojaintegrada', 'loja integrada']],
  ['Wake', ['wake.tech', 'fbits']],
  ['Linx', ['linximpulse', 'linx.com', 'linx-']],
  ['Bagy', ['bagy']],
  ['Yampi', ['yampi']],
  ['Shoppub', ['shoppub']],
  ['Vnda', ['vnda']],
]

export async function detectPlatform(siteUrl: string | undefined): Promise<string | undefined> {
  if (!siteUrl) return undefined
  const url = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CicloBot/1.0)' },
      redirect: 'follow',
    })
    clearTimeout(timer)
    if (!res.ok) return undefined
    const html = (await res.text()).slice(0, 500_000).toLowerCase()
    for (const [platform, signatures] of PLATFORM_SIGNATURES) {
      if (signatures.some((s) => html.includes(s))) return platform
    }
  } catch {
    // site fora do ar / timeout — sem detecção
  }
  return undefined
}

// ── Chamada ao Claude com web search e parse tolerante de JSON ────────────────

export function extractJson(text: string): Record<string, unknown> | null {
  const start = text.indexOf('{')
  if (start === -1) return null
  let depth = 0
  let inString = false
  let escaped = false
  for (let i = start; i < text.length; i++) {
    const ch = text[i]
    if (escaped) {
      escaped = false
      continue
    }
    if (ch === '\\') {
      escaped = true
      continue
    }
    if (ch === '"') inString = !inString
    if (inString) continue
    if (ch === '{') depth++
    if (ch === '}') {
      depth--
      if (depth === 0) {
        try {
          return JSON.parse(text.slice(start, i + 1))
        } catch {
          return null
        }
      }
    }
  }
  return null
}

async function askClaude(prompt: string): Promise<Record<string, unknown> | null> {
  const client = new Anthropic()
  const msg = await client.messages.create({
    model: MODEL(),
    max_tokens: 4000,
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 8 }],
    messages: [{ role: 'user', content: prompt }],
  })
  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
  return extractJson(text)
}

function companyPrompt(input: { orgName?: string; emailDomain?: string; site?: string }): string {
  return `Você é um analista de inteligência comercial da Ciclo E-commerce (agência brasileira de marketing para e-commerce). Pesquise na web a empresa abaixo e responda APENAS com um bloco JSON válido, sem texto antes ou depois.

Empresa: ${input.orgName ?? '(desconhecida)'}
Domínio do e-mail corporativo: ${input.emailDomain ?? '(n/d)'}
Site/URL da loja: ${input.site ?? '(n/d)'}

Formato exato:
{"razao_social": string|null, "cnpj": string|null, "site": string|null, "plataforma_ecommerce": string|null, "segmento": string|null, "porte_estimado": string|null, "cidade_uf": string|null, "redes_sociais": {"instagram": string|null, "tiktok": string|null, "linkedin": string|null, "youtube": string|null, "seguidores_estimados": string|null}, "marketplaces": string[], "sinais_de_midia_paga": string|null, "noticias_recentes": [{"titulo": string, "url": string, "data": string}], "oportunidades_para_a_ciclo": [string, string, string], "fontes": [string]}

Regras: use null quando não encontrar com confiança; oportunidades_para_a_ciclo são 3 itens curtos e acionáveis sob a ótica de Full Funnel Marketing/Social Commerce; fontes são as URLs efetivamente consultadas.`
}

function personPrompt(input: { name: string; orgName?: string; cargo?: string }): string {
  return `Você é um analista de inteligência comercial da Ciclo E-commerce. Pesquise SOMENTE fontes profissionais públicas (LinkedIn público, site da empresa, imprensa de negócios, palestras/podcasts) sobre a pessoa abaixo e responda APENAS com um bloco JSON válido, sem texto antes ou depois.

Pessoa: ${input.name}
Empresa: ${input.orgName ?? '(n/d)'}
Cargo informado: ${input.cargo ?? '(n/d)'}

Formato exato:
{"cargo_provavel": string|null, "linkedin_url": string|null, "tempo_na_empresa": string|null, "temas_de_interesse": string[], "conteudos_recentes": [{"titulo": string, "url": string}], "sugestao_de_abordagem": string|null, "confianca": "alta"|"media"|"baixa", "motivo_confianca": string|null, "fontes": [string]}

Regras OBRIGATÓRIAS de privacidade: NUNCA infira ou reporte dados pessoais (idade, família, endereço, telefone, redes sociais pessoais como Instagram/Facebook pessoais). Somente informação profissional pública. Se houver homônimos e você não tiver certeza de que é a pessoa desta empresa, use confianca "baixa" e explique em motivo_confianca. linkedin_url só se tiver alta certeza de que é o perfil correto.`
}

// ── Helpers Pipedrive ─────────────────────────────────────────────────────────

async function pd(path: string): Promise<Record<string, unknown> | null> {
  const res = await fetch(pipedriveUrl(path))
  const data = await res.json()
  return data.success ? (data.data as Record<string, unknown>) : null
}

function relatedId(value: unknown): number | undefined {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'value' in value) return Number((value as { value: unknown }).value) || undefined
  return undefined
}

async function dealHasEnrichmentNote(dealId: number): Promise<boolean> {
  try {
    const res = await fetch(pipedriveUrl('/notes', { deal_id: String(dealId), limit: '100' }))
    const data = await res.json()
    if (!data.success || !Array.isArray(data.data)) return false
    return (data.data as { content?: string }[]).some((n) => n.content?.includes(ENRICH_TAG))
  } catch {
    return false
  }
}

const esc = (v: unknown): string =>
  String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const linkList = (urls: unknown): string =>
  Array.isArray(urls)
    ? urls
        .filter((u): u is string => typeof u === 'string')
        .map((u) => `<a href="${esc(u)}">${esc(u)}</a>`)
        .join('<br>')
    : ''

function companyNoteHtml(c: Record<string, unknown>): string {
  const redes = (c.redes_sociais ?? {}) as Record<string, unknown>
  const noticias = Array.isArray(c.noticias_recentes) ? (c.noticias_recentes as Record<string, unknown>[]) : []
  const ops = Array.isArray(c.oportunidades_para_a_ciclo) ? c.oportunidades_para_a_ciclo : []
  const lines = [
    `<b>${ENRICH_TAG} Empresa</b>`,
    c.razao_social ? `Razão social: ${esc(c.razao_social)}` : null,
    c.cnpj ? `CNPJ: ${esc(c.cnpj)}` : null,
    c.site ? `Site: ${esc(c.site)}` : null,
    c.plataforma_ecommerce ? `Plataforma: ${esc(c.plataforma_ecommerce)}` : null,
    c.segmento ? `Segmento: ${esc(c.segmento)}` : null,
    c.porte_estimado ? `Porte estimado: ${esc(c.porte_estimado)}` : null,
    c.cidade_uf ? `Cidade/UF: ${esc(c.cidade_uf)}` : null,
    Object.values(redes).some(Boolean)
      ? `Redes: ${['instagram', 'tiktok', 'linkedin', 'youtube']
          .filter((k) => redes[k])
          .map((k) => `${k}: ${esc(redes[k])}`)
          .join(' | ')}${redes.seguidores_estimados ? ` (${esc(redes.seguidores_estimados)})` : ''}`
      : null,
    Array.isArray(c.marketplaces) && c.marketplaces.length ? `Marketplaces: ${esc((c.marketplaces as string[]).join(', '))}` : null,
    c.sinais_de_midia_paga ? `Mídia paga: ${esc(c.sinais_de_midia_paga)}` : null,
    noticias.length
      ? `<b>Notícias recentes:</b><br>${noticias
          .map((n) => `• <a href="${esc(n.url)}">${esc(n.titulo)}</a>${n.data ? ` (${esc(n.data)})` : ''}`)
          .join('<br>')}`
      : null,
    ops.length ? `<b>Oportunidades para a Ciclo:</b><br>${ops.map((o) => `• ${esc(o)}`).join('<br>')}` : null,
    `<b>Fontes:</b><br>${linkList(c.fontes)}`,
  ]
  return lines.filter(Boolean).join('<br>')
}

function personNoteHtml(p: Record<string, unknown>): string {
  const conteudos = Array.isArray(p.conteudos_recentes) ? (p.conteudos_recentes as Record<string, unknown>[]) : []
  const temas = Array.isArray(p.temas_de_interesse) ? (p.temas_de_interesse as string[]) : []
  const lines = [
    `<b>${ENRICH_TAG} Pessoa</b>`,
    '<i>Gerado automaticamente — confira as fontes antes de usar.</i>',
    p.cargo_provavel ? `Cargo provável: ${esc(p.cargo_provavel)}` : null,
    p.linkedin_url ? `LinkedIn: <a href="${esc(p.linkedin_url)}">${esc(p.linkedin_url)}</a>` : null,
    p.tempo_na_empresa ? `Tempo na empresa: ${esc(p.tempo_na_empresa)}` : null,
    temas.length ? `Temas de interesse: ${esc(temas.join(', '))}` : null,
    conteudos.length
      ? `<b>Conteúdos recentes:</b><br>${conteudos.map((n) => `• <a href="${esc(n.url)}">${esc(n.titulo)}</a>`).join('<br>')}`
      : null,
    p.sugestao_de_abordagem ? `<b>Sugestão de abordagem:</b> ${esc(p.sugestao_de_abordagem)}` : null,
    `Confiança: ${esc(p.confianca ?? 'baixa')}${p.motivo_confianca ? ` — ${esc(p.motivo_confianca)}` : ''}`,
    `<b>Fontes:</b><br>${linkList(p.fontes)}`,
  ]
  return lines.filter(Boolean).join('<br>')
}

async function postNote(dealId: number, content: string): Promise<void> {
  const res = await fetch(pipedriveUrl('/notes'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deal_id: dealId, content }),
  })
  const data = await res.json()
  if (!data.success) console.error('[Enrich] Falha ao criar note:', data?.error ?? data)
}

let cachedOrgWebsiteKey: string | null | undefined
async function orgWebsiteFieldKey(): Promise<string | null> {
  if (cachedOrgWebsiteKey !== undefined) return cachedOrgWebsiteKey
  try {
    const res = await fetch(pipedriveUrl('/organizationFields', { limit: '500' }))
    const data = await res.json()
    const field = Array.isArray(data.data)
      ? (data.data as { key: string; name: string }[]).find((f) => /^(web)?site$/i.test(f.name.trim()))
      : undefined
    cachedOrgWebsiteKey = field?.key ?? null
  } catch {
    cachedOrgWebsiteKey = null
  }
  return cachedOrgWebsiteKey
}

// ── Orquestração ──────────────────────────────────────────────────────────────

export interface EnrichmentResult {
  skipped?: string
  company?: Record<string, unknown> | null
  person?: Record<string, unknown> | null
  platform_detected?: string | null
}

export async function runEnrichment(dealId: number, opts: { force?: boolean } = {}): Promise<EnrichmentResult> {
  if (!process.env.PIPEDRIVE_API_TOKEN) return { skipped: 'pipedrive_env_missing' }
  if (!process.env.ANTHROPIC_API_KEY) return { skipped: 'anthropic_env_missing' }

  if (!opts.force && (await dealHasEnrichmentNote(dealId))) {
    return { skipped: 'already_enriched' }
  }

  const deal = await pd(`/deals/${dealId}`)
  if (!deal) return { skipped: 'deal_not_found' }

  const personId = relatedId(deal.person_id)
  const orgId = relatedId(deal.org_id)
  const person = personId ? await pd(`/persons/${personId}`) : null
  const org = orgId ? await pd(`/organizations/${orgId}`) : null

  const email =
    Array.isArray(person?.email) && person.email[0] && typeof person.email[0] === 'object'
      ? String((person.email[0] as { value?: unknown }).value ?? '')
      : ''
  const emailDomain = email.split('@')[1]
  const siteField = typeof deal[DEAL_FIELD_SITE] === 'string' ? (deal[DEAL_FIELD_SITE] as string) : undefined
  const orgName = typeof org?.name === 'string' ? org.name : undefined
  const personName = typeof person?.name === 'string' ? person.name : undefined
  const cargoField = typeof deal[DEAL_FIELD_CARGO] === 'string' ? (deal[DEAL_FIELD_CARGO] as string) : undefined

  // C4: e-mail genérico sem organização -> só a análise de pessoa
  const genericOnly = isGenericEmailDomain(email) && !org

  const result: EnrichmentResult = {}

  // EMPRESA
  if (!genericOnly) {
    try {
      const site = siteField ?? (emailDomain && !isGenericEmailDomain(email) ? emailDomain : undefined)
      const [company, platform] = await Promise.all([
        askClaude(companyPrompt({ orgName, emailDomain: isGenericEmailDomain(email) ? undefined : emailDomain, site })),
        detectPlatform(site),
      ])
      result.platform_detected = platform ?? null
      if (company) {
        if (platform) company.plataforma_ecommerce = platform // determinístico prevalece
        result.company = company
        await postNote(dealId, companyNoteHtml(company))

        // Campos do deal — SOMENTE se vazios
        const dealPatch: Record<string, string> = {}
        if (!deal[DEAL_FIELD_SEGMENTO] && typeof company.segmento === 'string' && company.segmento) {
          dealPatch[DEAL_FIELD_SEGMENTO] = company.segmento.slice(0, 255)
        }
        if (!deal[DEAL_FIELD_SITE] && typeof company.site === 'string' && company.site) {
          dealPatch[DEAL_FIELD_SITE] = company.site.slice(0, 255)
        }
        if (Object.keys(dealPatch).length > 0) {
          await fetch(pipedriveUrl(`/deals/${dealId}`), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dealPatch),
          })
        }

        // Organization: website/address se vazios
        if (org && orgId) {
          const orgPatch: Record<string, string> = {}
          const websiteKey = await orgWebsiteFieldKey()
          if (websiteKey && !org[websiteKey] && typeof company.site === 'string' && company.site) {
            orgPatch[websiteKey] = company.site.slice(0, 255)
          }
          if (!org.address && typeof company.cidade_uf === 'string' && company.cidade_uf) {
            orgPatch.address = company.cidade_uf.slice(0, 255)
          }
          if (Object.keys(orgPatch).length > 0) {
            await fetch(pipedriveUrl(`/organizations/${orgId}`), {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(orgPatch),
            })
          }
        }
      }
    } catch (err) {
      console.error('[Enrich] Falha na análise de empresa (deal', dealId, '):', err)
    }
  }

  // PESSOA
  if (personName) {
    try {
      const personJson = await askClaude(personPrompt({ name: personName, orgName, cargo: cargoField }))
      if (personJson) {
        if (genericOnly) personJson.confianca = 'baixa'
        result.person = personJson
        await postNote(dealId, personNoteHtml(personJson))

        // Cargo/Linkedin no deal — só vazios, e Linkedin/Cargo só com confiança alta
        if (personJson.confianca === 'alta') {
          const patch: Record<string, string> = {}
          if (!deal[DEAL_FIELD_CARGO] && typeof personJson.cargo_provavel === 'string' && personJson.cargo_provavel) {
            patch[DEAL_FIELD_CARGO] = personJson.cargo_provavel.slice(0, 255)
          }
          if (!deal[DEAL_FIELD_LINKEDIN] && typeof personJson.linkedin_url === 'string' && personJson.linkedin_url) {
            patch[DEAL_FIELD_LINKEDIN] = personJson.linkedin_url.slice(0, 255)
          }
          if (Object.keys(patch).length > 0) {
            await fetch(pipedriveUrl(`/deals/${dealId}`), {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(patch),
            })
          }
        }
      }
    } catch (err) {
      console.error('[Enrich] Falha na análise de pessoa (deal', dealId, '):', err)
    }
  }

  console.log('[Enrich] Deal', dealId, 'concluído:', {
    company: !!result.company,
    person: !!result.person,
    platform: result.platform_detected,
  })
  return result
}
