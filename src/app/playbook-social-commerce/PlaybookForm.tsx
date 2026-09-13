'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { BadgeCheck } from 'lucide-react'

// lucide não distribui mais ícones de marca — logo do LinkedIn inline
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  )
}
import PhoneField from '@/components/ui/PhoneField'
import { getAttributionPayload, isLinkedInTraffic } from '@/lib/attribution'

const LINKEDIN_ENABLED = process.env.NEXT_PUBLIC_LINKEDIN_ENABLED === '1'

const schema = z.object({
  name: z.string().min(2, 'Digite seu nome'),
  email: z.string().email('E-mail inválido'),
  company: z.string().min(2, 'Digite o nome da sua empresa'),
  phone: z.string().min(8, 'WhatsApp é obrigatório'),
  lgpd: z.boolean().refine((v) => v === true, 'Aceite a política de privacidade para continuar'),
})

interface LinkedInProfile {
  name: string
  email: string
  picture?: string
  sub: string
}

type FormData = z.infer<typeof schema>

const PDF_URL = '/downloads/playbook-social-commerce-ciclo.pdf'

const inputClass =
  'w-full bg-white border border-[#1A1917]/15 rounded-xl px-4 py-3.5 text-[#1A1917] placeholder-[#1A1917]/35 text-sm focus:outline-none focus:border-[#1A1917] focus:ring-1 focus:ring-[#1A1917] transition-all'

const errorClass = 'text-[#C0392B] text-xs mt-1'

export default function PlaybookForm() {
  const [sent, setSent] = useState(false)
  const [liProfile, setLiProfile] = useState<LinkedInProfile | null>(null)
  // Botão só para quem veio do LinkedIn (decidido pós-hidratação para não divergir do SSR)
  const [showLiButton, setShowLiButton] = useState(false)

  useEffect(() => {
    if (LINKEDIN_ENABLED) setShowLiButton(isLinkedInTraffic())
  }, [])
  const { register, control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  // Volta do LinkedIn: pré-preenche nome/e-mail (editáveis) a partir do cookie assinado
  useEffect(() => {
    if (!LINKEDIN_ENABLED) return
    if (new URLSearchParams(window.location.search).get('li') !== 'ok') return
    fetch('/api/auth/linkedin/me')
      .then((res) => (res.status === 200 ? res.json() : null))
      .then((profile: LinkedInProfile | null) => {
        if (!profile) return
        setLiProfile(profile)
        if (profile.name) setValue('name', profile.name)
        if (profile.email) setValue('email', profile.email)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).dataLayer?.push({ event: 'linkedin_login_success' })
      })
      .catch(() => {})
  }, [setValue])

  const onSubmit = async (data: FormData) => {
    const attribution = getAttributionPayload()
    try {
      await fetch('/api/pipedrive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company,
          phone: data.phone,
          // Dados do LinkedIn NÃO vão no body: a route lê e verifica o cookie
          // assinado ciclo_li server-side (enviado automaticamente, same-origin)
          message: 'Baixou o Playbook de Social Commerce pela landing page.',
          source: 'LP Playbook Social Commerce',
          pipeline: 'Playbook',
          attribution,
        }),
      })
    } catch {
      // Falha no CRM não pode bloquear a entrega do material
    }
    // Conversão: cadastro concluído para receber o playbook (sem dados pessoais no dataLayer)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).dataLayer?.push({
      event: 'playbook_form_submit',
      lead_source: attribution.source,
      lead_medium: attribution.medium,
      lead_campaign: attribution.campaign,
    })
    setSent(true)
    // Dispara o download imediatamente — recompensa instantânea
    const a = document.createElement('a')
    a.href = PDF_URL
    a.download = 'Playbook-Social-Commerce-Ciclo.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  if (sent) {
    return (
      <div className="text-center py-6">
        <p className="font-serif-lp text-3xl text-[#1A1917] mb-3">Seu playbook está a caminho.</p>
        <p className="text-sm text-[#6E6A60] mb-6 leading-relaxed">
          O download começou automaticamente. Se não iniciou, use o botão abaixo.
        </p>
        <a
          href={PDF_URL}
          download="Playbook-Social-Commerce-Ciclo.pdf"
          className="inline-block w-full bg-[#1A1917] text-[#EDE7DB] rounded-xl px-6 py-4 text-sm font-semibold tracking-wide hover:bg-[#2B6B9B] transition-colors"
        >
          Baixar o playbook (PDF) ↓
        </a>
        <p className="text-xs text-[#6E6A60] mt-5">
          Bom proveito — são 38 páginas direto ao ponto.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {/* Selo sempre aparece após ?li=ok, mesmo com o botão oculto */}
      {LINKEDIN_ENABLED && liProfile && (
        <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#2B6B9B]">
          <BadgeCheck className="w-4 h-4" /> Verificado via LinkedIn
        </p>
      )}
      {LINKEDIN_ENABLED && !liProfile && showLiButton && (
        <>
          <div>
            <a
              href="/api/auth/linkedin"
              className="flex items-center justify-center gap-2 w-full bg-white border border-[#1A1917]/15 rounded-xl px-5 py-3.5 text-sm font-semibold text-[#1A1917] hover:border-[#2B6B9B] hover:text-[#2B6B9B] transition-colors"
            >
              <LinkedinIcon className="w-4 h-4" /> Continuar com LinkedIn
            </a>
            <p className="text-[11px] text-[#6E6A60] text-center mt-1.5">
              Só lemos seu nome e e-mail — nada é publicado no seu perfil.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-[#6E6A60]">
            <span className="flex-1 border-t border-[#1A1917]/10" />
            ou preencha manualmente
            <span className="flex-1 border-t border-[#1A1917]/10" />
          </div>
        </>
      )}

      <div>
        <input {...register('name')} placeholder="Seu nome" autoComplete="name" className={inputClass} />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div>
        <input {...register('email')} type="email" placeholder="Seu melhor e-mail" autoComplete="email" className={inputClass} />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <div>
        <input {...register('company')} placeholder="Nome da sua empresa" autoComplete="organization" className={inputClass} />
        {errors.company && <p className={errorClass}>{errors.company.message}</p>}
      </div>

      <div className="lp-phone-light">
        <PhoneField name="phone" control={control} placeholder="WhatsApp" error={errors.phone?.message} />
      </div>

      <label className="flex items-start gap-2.5 cursor-pointer">
        <input type="checkbox" {...register('lgpd')} className="mt-0.5 w-4 h-4 flex-shrink-0 accent-[#1A1917]" />
        <span className="text-xs text-[#6E6A60] leading-relaxed">
          Aceito a{' '}
          <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="underline text-[#2B6B9B] hover:text-[#1A1917]">
            Política de Privacidade
          </a>{' '}
          e autorizo o contato da Ciclo.
        </span>
      </label>
      {errors.lgpd && <p className={errorClass}>{errors.lgpd.message as string}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#1A1917] text-[#EDE7DB] rounded-xl px-6 py-4 text-sm font-semibold tracking-wide hover:bg-[#2B6B9B] transition-colors disabled:opacity-60 disabled:cursor-wait"
      >
        {isSubmitting ? 'Enviando…' : 'Baixar o playbook gratuito →'}
      </button>

      <p className="text-[11px] text-[#6E6A60] text-center">
        Leva 30 segundos. Sem spam — só o playbook e conteúdo que vale seu tempo.
      </p>
    </form>
  )
}
