import { NextRequest, NextResponse } from 'next/server'

const BASE = 'https://api.pipedrive.com/v1'

function api(path: string) {
  const token = process.env.PIPEDRIVE_API_TOKEN
  return `${BASE}${path}?api_token=${token}`
}

async function findStageId(name: string): Promise<number | undefined> {
  const res = await fetch(api('/stages'))
  const data = await res.json()
  if (!data.success || !data.data) return undefined
  const stage = (data.data as { id: number; name: string }[]).find((s) =>
    s.name.toLowerCase().includes(name.toLowerCase())
  )
  return stage?.id
}

async function findOrCreatePerson(name: string, email: string, phone: string): Promise<number | undefined> {
  const searchRes = await fetch(
    api(`/persons/search`) + `&term=${encodeURIComponent(email)}&fields=email&limit=1`
  )
  const searchData = await searchRes.json()
  if (searchData.success && searchData.data?.items?.length > 0) {
    return searchData.data.items[0].item.id
  }

  const createRes = await fetch(api('/persons'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email: [{ value: email, primary: true }],
      phone: phone ? [{ value: phone, primary: true }] : [],
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
    const { name, email, phone, company, message, source } = await req.json()

    if (!name || !email) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const [stageId, personId] = await Promise.all([
      findStageId('Entrada de Lead'),
      findOrCreatePerson(name, email, phone ?? ''),
    ])

    const dealTitle = company ? `${name} – ${company}` : name

    const dealRes = await fetch(api('/deals'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: dealTitle,
        person_id: personId,
        stage_id: stageId,
        status: 'open',
      }),
    })
    const dealData = await dealRes.json()

    if (!dealData.success) {
      console.error('Pipedrive deal error:', dealData)
      return NextResponse.json({ error: 'Erro ao criar deal' }, { status: 500 })
    }

    const dealId = dealData.data.id
    const noteLines = [
      source ? `**Origem:** ${source}` : null,
      company ? `**Empresa:** ${company}` : null,
      message ? `**Mensagem:**\n${message}` : null,
    ].filter(Boolean)

    if (noteLines.length > 0) {
      await fetch(api('/notes'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: noteLines.join('\n\n'),
          deal_id: dealId,
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Pipedrive error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
