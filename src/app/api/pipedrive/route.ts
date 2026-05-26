import { NextRequest, NextResponse } from 'next/server'

const BASE = 'https://api.pipedrive.com/v1'

function url(path: string, params: Record<string, string> = {}) {
  const token = process.env.PIPEDRIVE_API_TOKEN
  const qs = new URLSearchParams({ api_token: token!, ...params })
  return `${BASE}${path}?${qs}`
}

async function findPipelineStage(): Promise<{ pipelineId: number; stageId: number } | undefined> {
  const [pipelinesRes, stagesRes] = await Promise.all([
    fetch(url('/pipelines')),
    fetch(url('/stages')),
  ])
  const [pipelines, stages] = await Promise.all([pipelinesRes.json(), stagesRes.json()])

  if (!pipelines.success || !stages.success) return undefined

  // Find pipeline with "Site" or "Whats" in name (e.g. "1 - Site/Whats")
  const pipeline = (pipelines.data as { id: number; name: string }[]).find((p) =>
    /site|whats/i.test(p.name)
  )
  if (!pipeline) return undefined

  // Find "Entrada de Lead" stage within that pipeline
  const stage = (stages.data as { id: number; name: string; pipeline_id: number }[]).find(
    (s) => s.pipeline_id === pipeline.id && /entrada/i.test(s.name)
  )
  if (!stage) return undefined

  return { pipelineId: pipeline.id, stageId: stage.id }
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
    return NextResponse.json({ error: 'Pipedrive não configurado' }, { status: 500 })
  }

  try {
    const { name, email, phone, company, message } = await req.json()

    if (!name || !email) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    // Find pipeline + stage, create org, all in parallel
    const [pipelineStage, orgId] = await Promise.all([
      findPipelineStage(),
      company ? findOrCreateOrg(company) : Promise.resolve(undefined),
    ])

    // Create person (linked to org)
    const personId = await findOrCreatePerson(name, email, phone ?? '', orgId)

    // Create deal: title = person name, org = company, description = mensagem da dor
    const dealRes = await fetch(url('/deals'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: name,
        person_id: personId,
        org_id: orgId,
        stage_id: pipelineStage?.stageId,
        pipeline_id: pipelineStage?.pipelineId,
        status: 'open',
        description: message ?? '',
      }),
    })
    const dealData = await dealRes.json()

    if (!dealData.success) {
      console.error('Pipedrive deal error:', dealData)
      return NextResponse.json({ error: 'Erro ao criar deal' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Pipedrive error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
