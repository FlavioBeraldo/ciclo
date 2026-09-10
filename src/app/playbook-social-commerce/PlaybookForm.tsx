'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import PhoneField from '@/components/ui/PhoneField'

const schema = z.object({
  name: z.string().min(2, 'Digite seu nome'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(8, 'WhatsApp é obrigatório'),
  lgpd: z.boolean().refine((v) => v === true, 'Aceite a política de privacidade para continuar'),
})

type FormData = z.infer<typeof schema>

const PDF_URL = '/downloads/playbook-social-commerce-ciclo.pdf'

const inputClass =
  'w-full bg-white border border-[#1A1917]/15 rounded-xl px-4 py-3.5 text-[#1A1917] placeholder-[#1A1917]/35 text-sm focus:outline-none focus:border-[#1A1917] focus:ring-1 focus:ring-[#1A1917] transition-all'

const errorClass = 'text-[#C0392B] text-xs mt-1'

export default function PlaybookForm() {
  const [sent, setSent] = useState(false)
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await fetch('/api/pipedrive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: 'Baixou o Playbook de Social Commerce pela landing page.',
          source: 'LP Playbook Social Commerce',
          pipeline: 'Playbook',
        }),
      })
    } catch {
      // Falha no CRM não pode bloquear a entrega do material
    }
    // Conversão: cadastro concluído para receber o playbook (sem dados pessoais no dataLayer)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).dataLayer?.push({ event: 'playbook_form_submit' })
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
          Bom proveito — são 29 capítulos direto ao ponto.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div>
        <input {...register('name')} placeholder="Seu nome" autoComplete="name" className={inputClass} />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div>
        <input {...register('email')} type="email" placeholder="Seu melhor e-mail" autoComplete="email" className={inputClass} />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
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
