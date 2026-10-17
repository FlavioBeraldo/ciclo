'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import PhoneField from '@/components/ui/PhoneField'
import { getAttributionPayload } from '@/lib/attribution'
import { track } from '@/lib/track'
import { newEventId, pushConversion, splitName, waitForTags } from '@/lib/conversions'

// Formulário de contato da home no design 2026.
//
// A marcação é a do kit; o envio é exatamente o que já estava no ar: mesmo
// schema, mesmo `generate_lead` no dataLayer antes de qualquer navegação,
// mesmo corpo para /api/pipedrive (com `source: 'Site/WhatsApp'`) e o mesmo
// redirecionamento para /obrigado depois que as tags dispararam. Nada de
// mensuração muda aqui — só a aparência.

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  company: z.string().min(1, 'Empresa é obrigatória'),
  phone: z.string().min(1, 'WhatsApp é obrigatório'),
  annualRevenue: z.string().min(1, 'Selecione a faixa de faturamento'),
  segment: z.string().min(1, 'Selecione o segmento'),
  message: z.string().min(20, 'Descreva melhor o seu desafio (mínimo 20 caracteres)'),
  lgpd: z.boolean().refine((v) => v === true, 'Aceite a política de privacidade para continuar'),
})

type FormData = z.infer<typeof schema>

const FAIXAS = [
  'R$ 5 a R$ 10 milhões/ano',
  'R$ 10 a R$ 30 milhões/ano',
  'R$ 30 a R$ 50 milhões/ano',
  'Acima de R$ 50 milhões/ano',
]

const SEGMENTOS = [
  'Moda e Acessórios',
  'Beleza e Cosméticos',
  'Saúde e Suplementos',
  'Casa e Decoração',
  'Alimentos e Bebidas',
  'Eletrônicos e Tecnologia',
  'Esporte e Lazer',
  'Pet',
  'Infantil',
  'Joias e Semijoias',
  'Outro',
]

export default function Contato() {
  const router = useRouter()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    const attribution = getAttributionPayload()
    // Um único event_id para Pixel (navegador), CAPI (servidor), GA4 e Google Ads
    const eventId = newEventId()

    // 1) Conversão no dataLayer ANTES de qualquer navegação (o GTM hasheia o user_data)
    pushConversion('generate_lead', {
      eventId,
      attribution,
      form: 'contato',
      contentName: 'fale-com-especialista',
      userData: { email: data.email, phone_number: data.phone, ...splitName(data.name) },
      extra: { annual_revenue: data.annualRevenue, segment: data.segment },
    })
    track('form_submit', { form: 'contato' })

    // 2) CRM + CAPI no servidor (mesmo event_id) em paralelo com os tags do GTM
    const crm = fetch('/api/pipedrive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        source: 'Site/WhatsApp',
        attribution,
        event_id: eventId,
        page_url: window.location.href,
      }),
    }).catch(() => {
      // Falha no Pipedrive não bloqueia o redirect
    })
    await Promise.all([crm, waitForTags(eventId)])

    // 3) Só navega depois que Pixel/GA4 dispararam (navegação client-side preserva o GTM)
    router.push('/obrigado')
  }

  return (
    <section className="section dark contact" id="contato">
      <div className="wrap contact-layout">
        <div>
          <div className="eyebrow">
            <span />
            Vamos conversar
          </div>

          <h2>Pronto para crescer de forma previsível?</h2>

          <p className="lead">
            Fale com um especialista e descubra como o Full Funnel Marketing pode transformar
            seu e-commerce.
          </p>

          <div className="contact-motto">
            Obcecados por crescimento.
            <br /> Inimigos do desperdício.
          </div>
        </div>

        <form className="contact-form" id="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="field">
            <label htmlFor="lead-name">Nome completo *</label>
            <input id="lead-name" {...register('name')} type="text" placeholder="Seu nome" />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>

          <div className="field">
            <label htmlFor="lead-email">E-mail corporativo *</label>
            <input
              id="lead-email"
              {...register('email')}
              type="email"
              placeholder="voce@empresa.com.br"
            />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          <div className="field">
            <label htmlFor="lead-company">Empresa *</label>
            <input
              id="lead-company"
              {...register('company')}
              type="text"
              placeholder="Nome da empresa"
            />
            {errors.company && <p className="field-error">{errors.company.message}</p>}
          </div>

          <PhoneField
            name="phone"
            control={control}
            label="WhatsApp"
            required
            error={errors.phone?.message}
            variant="ciclo2026"
          />

          <div className="field">
            <label htmlFor="lead-annual-revenue">Faturamento anual *</label>
            <select id="lead-annual-revenue" {...register('annualRevenue')} defaultValue="">
              <option value="" disabled>
                Selecione
              </option>
              {FAIXAS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            {errors.annualRevenue && <p className="field-error">{errors.annualRevenue.message}</p>}
          </div>

          <div className="field">
            <label htmlFor="lead-segment">Segmento *</label>
            <select id="lead-segment" {...register('segment')} defaultValue="">
              <option value="" disabled>
                Selecione
              </option>
              {SEGMENTOS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.segment && <p className="field-error">{errors.segment.message}</p>}
          </div>

          <div className="field full">
            <label htmlFor="lead-message">Descreva a dor atual da sua empresa *</label>
            <textarea
              id="lead-message"
              {...register('message')}
              placeholder="Conte brevemente qual é o principal gargalo hoje: CAC alto, baixa recompra, tráfego pago sem eficiência, dificuldade em gerar demanda, baixa conversão, pouca previsibilidade de receita ou outro desafio."
            />
            {errors.message && <p className="field-error">{errors.message.message}</p>}
            <span className="hint">
              Quanto mais contexto você trouxer, melhor conseguimos direcionar a conversa
              estratégica.
            </span>
          </div>

          <label className="consent">
            <input type="checkbox" {...register('lgpd')} />
            <span>
              Aceito a{' '}
              <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer">
                Política de Privacidade
              </a>{' '}
              e autorizo o contato da Ciclo e o registro da minha navegação no site para
              personalizar o atendimento.
            </span>
          </label>
          {errors.lgpd && <p className="field-error">{errors.lgpd.message as string}</p>}

          <div className="form-bottom">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando…' : 'Fale com um especialista'} <span>↗</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
