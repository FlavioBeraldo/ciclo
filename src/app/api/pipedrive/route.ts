import { NextRequest, NextResponse } from 'next/server'
import { createPipedriveLead } from '@/lib/pipedrive-server'
import { LI_COOKIE, verifyProfile } from '@/lib/linkedin-session'

export async function POST(req: NextRequest) {
  if (!process.env.PIPEDRIVE_API_TOKEN) {
    console.error('[Pipedrive] PIPEDRIVE_API_TOKEN não configurado')
    return NextResponse.json({ error: 'Pipedrive não configurado' }, { status: 500 })
  }

  try {
    const { name, email, phone, whatsapp, company, message, storeUrl, annualRevenue, segment, pipeline, attribution } = await req.json()

    // Cadastro via LinkedIn: o perfil vem do cookie httpOnly ASSINADO (não do body),
    // então "verificado" é garantido pelo servidor, não pelo cliente.
    const liProfile = verifyProfile(req.cookies.get(LI_COOKIE)?.value)
    const objetivo = [
      annualRevenue ? `Faturamento anual: ${annualRevenue}` : null,
      segment ? `Segmento: ${segment}` : null,
      storeUrl ? `URL da loja: ${storeUrl}` : null,
      message || null,
    ].filter(Boolean).join('\n\n')

    if (!name || !email) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const result = await createPipedriveLead({
      name,
      email,
      phone: phone ?? whatsapp ?? '',
      company,
      objetivo,
      pipelineHint: typeof pipeline === 'string' && pipeline.trim() ? pipeline.trim() : undefined,
      attribution,
      linkedin: liProfile,
    })

    if (!result.success) {
      return NextResponse.json({ error: 'Erro ao criar deal' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Pipedrive] Erro interno:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
