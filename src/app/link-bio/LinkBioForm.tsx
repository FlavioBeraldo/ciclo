'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Check } from 'lucide-react'
import PhoneField from '@/components/ui/PhoneField'
import { useForm } from 'react-hook-form'
import { getAttributionPayload } from '@/lib/attribution'
import { track } from '@/lib/track'
import { newEventId, pushConversion } from '@/lib/conversions'

const REVENUE_RANGES = [
  'Até R$ 5 milhões/ano',
  'R$ 5 a R$ 10 milhões/ano',
  'R$ 10 a R$ 30 milhões/ano',
  'R$ 30 a R$ 50 milhões/ano',
  'Acima de R$ 50 milhões/ano',
]

type StepId = 'email' | 'whatsapp' | 'empresa' | 'cargo' | 'faturamento'

interface StepDef {
  id: StepId
  question: string
  hint?: string
  placeholder?: string
  type: 'email' | 'phone' | 'text' | 'choice'
  options?: string[]
  validate: (v: string) => string | null
}

const STEPS: StepDef[] = [
  {
    id: 'email',
    question: 'Qual é o seu e-mail?',
    hint: 'Use o e-mail corporativo — é por ele que retornamos.',
    placeholder: 'nome@empresa.com',
    type: 'email',
    validate: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Digite um e-mail válido'),
  },
  {
    id: 'whatsapp',
    question: 'Qual é o seu WhatsApp?',
    hint: 'É o canal mais rápido para falarmos com você.',
    placeholder: '+55 (11) 99999-9999',
    type: 'phone',
    validate: (v) => (v.replace(/\D/g, '').length >= 10 ? null : 'Digite um número válido com DDD'),
  },
  {
    id: 'empresa',
    question: 'Qual é a sua empresa?',
    placeholder: 'Nome da empresa',
    type: 'text',
    validate: (v) => (v.trim().length >= 2 ? null : 'Digite o nome da empresa'),
  },
  {
    id: 'cargo',
    question: 'Qual é o seu cargo?',
    placeholder: 'Ex.: Head de Marketing',
    type: 'text',
    validate: (v) => (v.trim().length >= 2 ? null : 'Digite o seu cargo'),
  },
  {
    id: 'faturamento',
    question: 'Qual é o faturamento anual?',
    hint: 'Ajuda a entender se temos uma solução que te atenda no momento.',
    type: 'choice',
    options: REVENUE_RANGES,
    validate: (v) => (v ? null : 'Selecione uma faixa'),
  },
]

export default function LinkBioForm() {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [finished, setFinished] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const eventIdRef = useRef<string>('')
  // react-hook-form apenas para reaproveitar o PhoneField (máscara + DDI)
  const { control, watch, setValue: setPhone } = useForm<{ phone: string }>({ defaultValues: { phone: '' } })
  const phoneValue = watch('phone')

  const step = STEPS[index]
  const isPhone = step?.type === 'phone'
  const current = isPhone ? (phoneValue ?? '') : value

  useEffect(() => {
    eventIdRef.current = newEventId()
  }, [])

  useEffect(() => {
    if (!finished) inputRef.current?.focus()
  }, [index, finished])

  // Mede a visualização de cada etapa (funil de preenchimento)
  useEffect(() => {
    if (finished || !step) return
    track('cta_click', { form: 'link-bio', step: step.id, step_number: index + 1 })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).dataLayer?.push({
      event: 'link_bio_step_view',
      step: step.id,
      step_number: index + 1,
    })
  }, [index, finished, step])

  const submitStep = async (raw: string) => {
    if (!step) return
    const val = raw.trim()
    const problem = step.validate(val)
    if (problem) {
      setError(problem)
      return
    }

    setError(null)
    setSaving(true)
    const nextAnswers = { ...answers, [step.id]: val }
    const isLast = index === STEPS.length - 1
    const attribution = getAttributionPayload()

    try {
      // Salvamento progressivo: cada etapa já grava no Pipedrive
      await fetch('/api/link-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: step.id,
          data: nextAnswers,
          attribution,
          complete: isLast,
          event_id: eventIdRef.current,
          page_url: window.location.href,
        }),
      })
    } catch {
      // Falha de rede não pode travar a jornada do lead
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).dataLayer?.push({
      event: 'link_bio_step_complete',
      step: step.id,
      step_number: index + 1,
    })

    if (isLast) {
      pushConversion('generate_lead', {
        eventId: eventIdRef.current,
        attribution,
        form: 'link-bio',
        contentName: 'link-bio',
        userData: { email: nextAnswers.email, phone_number: nextAnswers.whatsapp },
        extra: { annual_revenue: nextAnswers.faturamento, lead_type: 'link-bio' },
      })
      track('form_submit', { form: 'link-bio' })
      setAnswers(nextAnswers)
      setSaving(false)
      setFinished(true)
      return
    }

    setAnswers(nextAnswers)
    setValue('')
    setPhone('phone', '')
    setSaving(false)
    setIndex((i) => i + 1)
  }

  if (finished) {
    return (
      <div className="animate-[fadeIn_.4s_ease]">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-8">
          <Check className="w-6 h-6 text-white" />
        </div>
        <h2 className="font-serif-lb text-4xl sm:text-5xl text-white mb-5">Recebemos sua aplicação.</h2>
        <p className="text-white/50 text-base leading-relaxed max-w-md mb-10">
          Nosso time vai analisar as informações e retorna pelo WhatsApp ou e-mail que você deixou.
          Enquanto isso, você pode conhecer o método que aplicamos em mais de 300 marcas.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/consultoria-para-e-commerce"
            className="inline-flex items-center gap-2 bg-white text-black rounded-full px-6 py-3 text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Conhecer o método <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/ofatorm"
            className="inline-flex items-center gap-2 border border-white/20 text-white rounded-full px-6 py-3 text-sm font-semibold hover:border-white/50 transition-colors"
          >
            Ouvir o Fator M
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Progresso */}
      <div className="flex items-center gap-3 mb-10">
        <div className="flex-1 h-px bg-white/10 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-white/70 transition-all duration-500"
            style={{ width: `${(index / STEPS.length) * 100}%` }}
          />
        </div>
        <span className="text-white/40 text-xs tabular-nums">
          {index + 1}/{STEPS.length}
        </span>
      </div>

      <p className="text-white/60 text-sm mb-2">Olá,</p>
      <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-md">
        Precisamos de algumas informações para termos certeza de que temos uma solução que te atenda no momento.
      </p>

      <div key={step.id} className="animate-[fadeIn_.4s_ease]">
        <h2 className="font-serif-lb text-3xl sm:text-[2.6rem] leading-tight text-white mb-3">
          {step.question}
          <span className="text-white/30">*</span>
        </h2>
        {step.hint && <p className="text-white/40 text-sm mb-8">{step.hint}</p>}

        {step.type === 'choice' ? (
          <div className="flex flex-col gap-2.5 mb-8 max-w-lg">
            {step.options!.map((option) => (
              <button
                key={option}
                type="button"
                disabled={saving}
                onClick={() => submitStep(option)}
                className="text-left border border-white/15 rounded-xl px-5 py-4 text-white/90 text-sm hover:border-white/60 hover:bg-white/5 transition-all disabled:opacity-50"
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submitStep(current)
            }}
            className="max-w-lg"
          >
            {isPhone ? (
              <div className="lb-phone mb-8">
                <PhoneField name="phone" control={control} placeholder={step.placeholder} />
              </div>
            ) : (
              <input
                ref={inputRef}
                type={step.type === 'email' ? 'email' : 'text'}
                inputMode={step.type === 'email' ? 'email' : 'text'}
                autoComplete={step.id === 'email' ? 'email' : step.id === 'empresa' ? 'organization' : 'organization-title'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={step.placeholder}
                className="w-full bg-transparent border-b border-white/25 focus:border-white pb-3 mb-8 text-white text-xl placeholder-white/25 outline-none transition-colors"
              />
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white text-white hover:text-black rounded-md px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
              {saving ? 'Enviando…' : 'Continuar'}
            </button>
          </form>
        )}

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>
    </div>
  )
}
