'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { m } from 'framer-motion'
import Button from './ui/Button'
import Section from './ui/Section'
import PhoneField from './ui/PhoneField'

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  company: z.string().min(1, 'Empresa é obrigatória'),
  phone: z.string().min(1, 'WhatsApp é obrigatório'),
  storeUrl: z.string().optional(),
  message: z.string().min(20, 'Descreva melhor o seu desafio (mínimo 20 caracteres)'),
})

type FormData = z.infer<typeof schema>

const inputClass =
  'w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#A100FF] focus:ring-1 focus:ring-[#A100FF] transition-all'

const labelClass = 'block text-sm text-[#A1A1AA] mb-1.5'
const errorClass = 'text-red-400 text-xs mt-1'

export default function LeadForm() {
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await fetch('/api/pipedrive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'Site/WhatsApp' }),
      })
    } catch {
      // Falha no Pipedrive não bloqueia o redirect
    }
    window.location.href = '/obrigado'
  }

  return (
    <Section id="contato" className="py-20 lg:py-32 bg-[#050505]">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-[#A100FF]/10 via-transparent to-[#A100FF]/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#A100FF]/10 blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Pronto para crescer de forma{' '}
            <span className="text-[#A100FF]">previsível?</span>
          </h2>
          <p className="text-[#A1A1AA]">
            Fale com um especialista e descubra como o Full Funnel Marketing pode transformar seu e-commerce.
          </p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/3 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
        >
          <m.form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Nome completo *</label>
              <input {...register('name')} placeholder="Seu nome" className={inputClass} />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>

            <div>
              <label className={labelClass}>E-mail corporativo *</label>
              <input {...register('email')} type="email" placeholder="seu@email.com" className={inputClass} />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Empresa *</label>
              <input {...register('company')} placeholder="Nome da sua empresa" className={inputClass} />
              {errors.company && <p className={errorClass}>{errors.company.message}</p>}
            </div>

            <PhoneField
              name="phone"
              control={control}
              label="WhatsApp *"
              required
              error={errors.phone?.message}
            />

            <div className="sm:col-span-2">
              <label className={labelClass}>URL da loja</label>
              <input
                {...register('storeUrl')}
                
                placeholder="sualoja.com.br"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Descreva a dor atual da sua empresa *</label>
              <textarea
                {...register('message')}
                rows={5}
                placeholder="Conte brevemente qual é o principal gargalo hoje: CAC alto, baixa recompra, tráfego pago sem eficiência, dificuldade em gerar demanda, baixa conversão, pouca previsibilidade de receita ou outro desafio."
                className={`${inputClass} resize-none`}
              />
              {errors.message && <p className={errorClass}>{errors.message.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs text-[#A1A1AA] mb-4">
                Quanto mais contexto você trouxer, melhor conseguimos direcionar a conversa estratégica.
              </p>
              <Button type="submit" arrow size="lg" disabled={isSubmitting} className="w-full justify-center">
                {isSubmitting ? 'Enviando...' : 'Fale com um especialista'}
              </Button>
            </div>
          </m.form>
        </m.div>
      </div>
    </Section>
  )
}
