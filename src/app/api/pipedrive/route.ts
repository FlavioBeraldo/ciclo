import { NextRequest, NextResponse } from 'next/server'

const BASE = 'https://api.pipedrive.com/v1'

function url(path: string, params: Record<string, string> = {}) {
  const token = process.env.PIPEDRIVE_API_TOKEN
  const qs = new URLSearchParams({ api_token: token!, ...params })
  return `${BASE}${path}?${qs}`
}

// Busca o stage_id pelo nome exato do pipeline e do estágio
async function findStageId(): Promise<number | undefined> {
  // Se o ID do estágio estiver configurado como env var, usa direto (mais confiável)
  if (process.env.PIPEDRIVE_STAGE_ID) {
    return Number(process.env.PIPEDRIVE_STAGE_ID)
  }

  const [pipelinesRes, stagesRes] = await Promise.all([
    fetch(url('/pipelines')),
    fetch(url('/stages')),
  ])
  const [pipelines, stages] = await Promise.all([
    pipelinesRes.json(),
    stagesRes.json(),
  ])

  if (!pipelines.success || !stages.success) {
    console.error('[Pipedrive] Falha ao buscar pipelines/stages')
    return undefined
  }

  const allPipelines = pipelines.data as { id: number; name: string }[]
  const allStages = stages.data as { id: number; name: string; pipeline_id: number }[]

  // Busca pipeline "1 - Site/Whats" (ou qualquer nome que contenha site ou whats)
  const pipelineName = process.env.PIPEDRIVE_PIPELINE_NAME ?? ''
  const pipeline = pipelineName
    ? allPipelines.find((p) => p.name.toLowerCase().includes(pipelineName.toLowerCase()))
    : allPipelines.find((p) => /site|whats/i.test(p.name))

  if (!pipeline) {
    console.error('[Pipedrive] Pipeline não encontrado. Pipelines disponíveis:', allPipelines.map((p) => p.name))
    return undefined
  }

  // Busca estágio "Entrada de Lead" dentro do pipeline
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

async function findUserId(name: string): Promise<number | undefined> {
  const res = await fetch(url('/users'))
  const data = await res.json()
  if (!data.success || !data.data) return undefined
  const user = (data.data as { id: number; name: string }[]).find((u) =>
    u.name.toLowerCase().includes(name.toLowerCase())
  )
  if (!user) console.error('[Pipedrive] Usuário não encontrado:', name)
  return user?.id
}

async function findOrCreateOrg(company: string): Promise<number | undefined> {
  const searchRes = await fetch(url('/organizations/search', { term: company, fields: 'name', limit: '1' }))
  const searchData = await searchRes.json()
  if (searchData.success && searchData.data?.items?.length > 0) {
    return searchData.data.items[0].item.id
  }
  const createRes = await fetch(url('/organizations'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: company }),
  })
  const createData = await createRes.json()
  return createData.data?.id
}

async function findOrCreatePerson(
  name: string,
  email: string,
  phone: string,
  orgId?: number
): Promise<number | undefined> {
  const searchRes = await fetch(url('/persons/search', { term: email, fields: 'email', limit: '1' }))
  const searchData = await searchRes.json()
  if (searchData.success && searchData.data?.items?.length > 0) {
    return searchData.data.items[0].item.id
  }
  const createRes = await fetch(url('/persons'), {
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

export async function POST(req: NextRequest) {
  if (!process.env.PIPEDRIVE_API_TOKEN) {
    console.error('[Pipedrive] PIPEDRIVE_API_TOKEN não configurado')
    return NextResponse.json({ error: 'Pipedrive não configurado' }, { status: 500 })
  }

  try {
    const { name, email, phone, company, message } = await req.json()

    if (!name || !email) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const [stageId, orgId, ownerId] = await Promise.all([
      findStageId(),
      company ? findOrCreateOrg(company) : Promise.resolve(undefined),
      findUserId('Felipe'),
    ])

    if (!stageId) {
      console.error('[Pipedrive] stage_id não encontrado — deal não será criado no funil correto')
    }

    const personId = await findOrCreatePerson(name, email, phone ?? '', orgId)

    const dealRes = await fetch(url('/deals'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: name,
        person_id: personId,
        org_id: orgId,
        user_id: ownerId,
        stage_id: stageId,
        status: 'open',
        // Campo customizado "Objetivo" (Large text)
        '34b57523aeb4efdfe90674f07fc548ccd3da2769': message ?? '',
      }),
    })
    const dealData = await dealRes.json()

    if (!dealData.success) {
      console.error('[Pipedrive] Erro ao criar deal:', dealData)
      return NextResponse.json({ error: 'Erro ao criar deal' }, { status: 500 })
    }

    const dealId = dealData.data.id

    console.log('[Pipedrive] Deal criado:', dealId, '| Stage:', stageId)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Pipedrive] Erro interno:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
