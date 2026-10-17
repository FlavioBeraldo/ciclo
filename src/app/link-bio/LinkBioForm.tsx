'use client'

import { useEffect, useRef, useState } from 'react'
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
    placeholder: '(11) 99999-9999',
    type: 'phone',
    validate: (v) => (v.replace(/\D/g, '').length >= 12 ? null : 'Digite um número válido com DDD'),
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
  const [finished, setFinished] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const eventIdRef = useRef<string>('')
  // Fila de gravação: as etapas avançam na hora, mas os POSTs saem em ordem —
  // a etapa 1 precisa criar a sessão antes de as seguintes atualizarem o deal.
  const queueRef = useRef<Promise<unknown>>(Promise.resolve())
  const { control, watch, setValue: setPhone } = useForm<{ phone: string }>({
    defaultValues: { phone: '+55' },
  })
  const phoneValue = watch('phone')

  const step = STEPS[index]
  const isPhone = step?.type === 'phone'
  const current = isPhone ? (phoneValue ?? '') : value
  const filled = isPhone ? (current?.replace(/\D/g, '').length ?? 0) > 4 : current.trim().length > 0
  const valid = step ? !step.validate(current) : false

  useEffect(() => {
    eventIdRef.current = newEventId()
  }, [])

  useEffect(() => {
    if (!finished) inputRef.current?.focus()
  }, [index, finished])

  // Mede a visualização de cada etapa (funil de preenchimento)
  useEffect(() => {
    if (finished || !step) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).dataLayer?.push({
      event: 'link_bio_step_view',
      step: step.id,
      step_number: index + 1,
    })
  }, [index, finished, step])

  const submitStep = (raw: string) => {
    if (!step) return
    const val = raw.trim()
    const problem = step.validate(val)
    if (problem) {
      setError(problem)
      return
    }

    const nextAnswers = { ...answers, [step.id]: val }
    const isLast = index === STEPS.length - 1
    const attribution = getAttributionPayload()
    const stepId = step.id

    // Gravação em segundo plano, enfileirada para manter a ordem das etapas
    queueRef.current = queueRef.current
      .catch(() => {})
      .then(() =>
        fetch('/api/link-bio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          body: JSON.stringify({
            step: stepId,
            data: nextAnswers,
            attribution,
            complete: isLast,
            event_id: eventIdRef.current,
            page_url: window.location.href,
          }),
        }).catch(() => {
          // Falha de rede não pode travar a jornada do lead
        })
      )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).dataLayer?.push({
      event: 'link_bio_step_complete',
      step: stepId,
      step_number: index + 1,
    })

    // A UI avança imediatamente — sem esperar a rede
    setError(null)
    setAnswers(nextAnswers)

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
      setFinished(true)
      return
    }

    setValue('')
    setPhone('phone', '+55')
    setIndex((i) => i + 1)
  }

  if (finished) {
    return (
      <div>
        <div className="eyebrow">
          <span />
          Aplicação enviada
        </div>
        <h2>Recebemos sua aplicação.</h2>
        <p>
          Nosso time vai analisar as informações e retorna pelo WhatsApp ou e-mail que você deixou.
          Enquanto isso, você pode conhecer o método que aplicamos em mais de 300 marcas.
        </p>
        <div className="application-nav">
          <a href="/consultoria-para-e-commerce" className="semibold action-link">
            Conhecer o método
            <ArrowRight className="module-icon" aria-hidden="true" />
          </a>
          <a href="/ofatorm" className="textlink">
            Ouvir o Fator M
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Progresso */}
      <p className="application-step-label">
        {index + 1} de {STEPS.length}
      </p>
      <div
        className="application-progress"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={STEPS.length}
        aria-valuenow={index + 1}
        aria-label={`Etapa ${index + 1} de ${STEPS.length}`}
      >
        <span style={{ width: `${(index / STEPS.length) * 100}%` }} />
      </div>

      <p className="application-hint">Olá,</p>
      <p className="application-hint">
        Precisamos de algumas informações para termos certeza de que temos uma solução que te atenda no momento.
      </p>

      <div key={step.id}>
        <h2>
          {step.question}
          <span aria-hidden="true">*</span>
        </h2>
        {step.hint && <p className="application-hint">{step.hint}</p>}

        {step.type === 'choice' ? (
          <div className="application-options">
            {step.options!.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => submitStep(option)}
              >
                {option}
                <ArrowRight className="module-icon" aria-hidden="true" />
              </button>
            ))}
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submitStep(current)
            }}
          >
            <div className={`application-field ${filled ? 'is-filled' : ''} ${valid ? 'is-valid' : ''}`}>
              {isPhone ? (
                <PhoneField
                  name="phone"
                  control={control}
                  placeholder={step.placeholder}
                  variant="ciclo2026"
                />
              ) : (
                <input
                  ref={inputRef}
                  type={step.type === 'email' ? 'email' : 'text'}
                  inputMode={step.type === 'email' ? 'email' : 'text'}
                  autoComplete={
                    step.id === 'email' ? 'email' : step.id === 'empresa' ? 'organization' : 'organization-title'
                  }
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value)
                    if (error) setError(null)
                  }}
                  placeholder={step.placeholder}
                />
              )}
              <Check className="application-ok" aria-hidden="true" />
            </div>

            <div className="application-nav">
              <button type="submit" className="next" disabled={!filled}>
                Continuar
                <ArrowRight className="module-icon" aria-hidden="true" />
              </button>
              <span className="application-local-note">ou pressione Enter</span>
            </div>
          </form>
        )}

        {error && (
          <p className="application-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
