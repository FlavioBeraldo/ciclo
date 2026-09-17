'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import PhoneField from '@/components/ui/PhoneField'
import { getAttributionPayload } from '@/lib/attribution'
import { track } from '@/lib/track'
import { newEventId, pushConversion, splitName } from '@/lib/conversions'

// Mesma experiência do /link-bio: uma pergunta por vez, com rótulo persistente
// acima do campo. O envio, porém, acontece uma única vez no fim — a tela de
// sucesso só aparece depois da resposta real do servidor.

const ROLES = [
  'Dono, sócio ou fundador',
  'C-level (CEO, COO, CMO)',
  'Diretor de Marketing ou E-commerce',
  'Gerente ou coordenador de Marketing ou E-commerce',
  'Supervisor ou analista',
  'Outro',
]

const REVENUE_RANGES = [
  'Até R$ 5 milhões/ano',
  'R$ 5 a R$ 10 milhões/ano',
  'R$ 10 a R$ 30 milhões/ano',
  'R$ 30 a R$ 50 milhões/ano',
  'Acima de R$ 50 milhões/ano',
]

type StepId = 'nome' | 'email' | 'whatsapp' | 'empresa' | 'site' | 'cargo' | 'faturamento' | 'desafio'

interface StepDef {
  id: StepId
  label: string
  question: string
  hint?: string
  placeholder?: string
  type: 'text' | 'email' | 'phone' | 'url' | 'choice' | 'textarea'
  options?: string[]
  optional?: boolean
  validate: (v: string) => string | null
}

const STEPS: StepDef[] = [
  {
    id: 'nome',
    label: 'Nome completo',
    question: 'Para começar, qual é o seu nome?',
    placeholder: 'Nome e sobrenome',
    type: 'text',
    validate: (v) => (v.trim().length >= 2 ? null : 'Digite o seu nome'),
  },
  {
    id: 'email',
    label: 'E-mail corporativo',
    question: 'Qual é o seu e-mail?',
    hint: 'Use o e-mail corporativo — é por ele que retornamos.',
    placeholder: 'nome@empresa.com',
    type: 'email',
    validate: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Digite um e-mail válido'),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    question: 'Qual é o seu WhatsApp?',
    hint: 'É o canal mais rápido para falarmos com você.',
    placeholder: '(11) 99999-9999',
    type: 'phone',
    validate: (v) => (v.replace(/\D/g, '').length >= 12 ? null : 'Digite um número válido com DDD'),
  },
  {
    id: 'empresa',
    label: 'Empresa ou loja',
    question: 'Qual é a sua empresa?',
    placeholder: 'Nome da empresa ou da loja',
    type: 'text',
    validate: (v) => (v.trim().length >= 2 ? null : 'Digite o nome da empresa'),
  },
  {
    id: 'site',
    label: 'Endereço da loja',
    question: 'Onde podemos ver a sua operação?',
    hint: 'Site, marketplace ou perfil da marca. Se preferir, pode seguir sem preencher.',
    placeholder: 'sualoja.com.br',
    type: 'url',
    optional: true,
    validate: (v) => {
      const value = v.trim()
      if (!value) return null
      return /^[^\s]+\.[^\s]{2,}$/.test(value.replace(/^https?:\/\//, ''))
        ? null
        : 'Digite um endereço válido (ex.: sualoja.com.br)'
    },
  },
  {
    id: 'cargo',
    label: 'Cargo',
    question: 'Qual é o seu cargo?',
    type: 'choice',
    options: ROLES,
    validate: (v) => (v ? null : 'Selecione uma opção'),
  },
  {
    id: 'faturamento',
    label: 'Faturamento anual',
    question: 'Qual é o faturamento anual da operação?',
    hint: 'Ajuda a entender o momento do negócio antes da conversa.',
    type: 'choice',
    options: REVENUE_RANGES,
    validate: (v) => (v ? null : 'Selecione uma faixa'),
  },
  {
    id: 'desafio',
    label: 'Principal desafio',
    question: 'Qual é o principal desafio da sua operação hoje?',
    hint: 'Quanto mais contexto, melhor conseguimos avaliar a sua aplicação.',
    placeholder:
      'Ex.: concentração de vendas em um canal, CAC subindo, base de clientes sem recompra, marca pouco lembrada antes da decisão de compra.',
    type: 'textarea',
    validate: (v) => (v.trim().length >= 20 ? null : 'Conte um pouco mais (mínimo de 20 caracteres)'),
  },
]

export default function AplicacaoForm() {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [lgpd, setLgpd] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const eventIdRef = useRef<string>('')

  const { control, watch, setValue: setPhone } = useForm<{ phone: string }>({
    defaultValues: { phone: '+55' },
  })
  const phoneValue = watch('phone')

  const step = STEPS[index]
  const isPhone = step?.type === 'phone'
  const isLast = index === STEPS.length - 1
  const current = isPhone ? (phoneValue ?? '') : value

  useEffect(() => {
    eventIdRef.current = newEventId()
  }, [])

  useEffect(() => {
    if (finished) return
    if (step?.type === 'textarea') textareaRef.current?.focus()
    else if (step?.type !== 'choice') inputRef.current?.focus()
  }, [index, finished, step])

  // Funil de preenchimento (medição — não é conversão)
  useEffect(() => {
    if (finished || !step) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).dataLayer?.push({
      event: 'aplicacao_step_view',
      step: step.id,
      step_number: index + 1,
      form: 'consultoria-ecom-shift',
    })
  }, [index, finished, step])

  const goTo = (nextIndex: number, nextAnswers: Record<string, string>) => {
    setError(null)
    setAnswers(nextAnswers)
    setIndex(nextIndex)
    const nextStep = STEPS[nextIndex]
    const stored = nextAnswers[nextStep.id] ?? ''
    if (nextStep.type === 'phone') setPhone('phone', stored || '+55')
    else setValue(stored)
  }

  const back = () => {
    if (index === 0 || sending) return
    const kept = { ...answers, [step.id]: current }
    goTo(index - 1, kept)
  }

  const submitApplication = async (allAnswers: Record<string, string>) => {
    setSending(true)
    setSendError(null)
    const attribution = getAttributionPayload()

    try {
      const res = await fetch('/api/aplicacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...allAnswers,
          attribution,
          event_id: eventIdRef.current,
          page_url: window.location.href,
        }),
      })

      if (!res.ok) {
        setSendError(
          'Não conseguimos registrar a sua aplicação agora. Tente novamente em instantes.'
        )
        setSending(false)
        return
      }

      // Conversão só depois do retorno real do servidor
      pushConversion('generate_lead', {
        eventId: eventIdRef.current,
        attribution,
        form: 'aplicacao-ecom-shift',
        contentName: 'consultoria-ecom-shift',
        userData: {
          email: allAnswers.email,
          phone_number: allAnswers.whatsapp,
          ...splitName(allAnswers.nome),
        },
        extra: {
          annual_revenue: allAnswers.faturamento,
          lead_type: 'consultoria-ecom-shift',
        },
      })
      track('form_submit', { form: 'aplicacao-ecom-shift' })
      setFinished(true)
    } catch {
      setSendError('Falha de conexão. Verifique a internet e tente novamente.')
    } finally {
      setSending(false)
    }
  }

  const advance = (raw: string) => {
    if (!step || sending) return
    const val = raw.trim()
    const problem = step.validate(val)
    if (problem) {
      setError(problem)
      return
    }

    const nextAnswers = { ...answers, [step.id]: val }

    if (isLast) {
      if (!lgpd) {
        setError('Aceite a política de privacidade para enviar a aplicação.')
        return
      }
      setAnswers(nextAnswers)
      void submitApplication(nextAnswers)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).dataLayer?.push({
      event: 'aplicacao_step_complete',
      step: step.id,
      step_number: index + 1,
      form: 'consultoria-ecom-shift',
    })

    goTo(index + 1, nextAnswers)
  }

  if (finished) {
    return (
      <div>
        <span className="shift-eyebrow shift-eyebrow--purple">Aplicação enviada</span>
        <h2 className="shift-display shift-h2 mt-4">Recebemos a sua aplicação.</h2>
        <p className="shift-lead shift-measure mt-6">
          As informações seguiram para avaliação do time da Ciclo E-commerce. Se fizer sentido para
          o momento da sua operação, entramos em contato pelo WhatsApp ou pelo e-mail que você
          deixou.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/consultoria-ecom-shift" className="shift-cta-ghost">
            Voltar para a consultoria
          </Link>
        </div>
      </div>
    )
  }

  const progress = (index / STEPS.length) * 100

  return (
    <div>
      {/* Progresso */}
      <div className="flex items-center gap-4 mb-10">
        <div
          className="flex-1 h-px relative overflow-hidden"
          style={{ backgroundColor: 'rgba(239,238,237,0.18)' }}
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={index + 1}
          aria-label={`Etapa ${index + 1} de ${STEPS.length}`}
        >
          <div
            className="absolute inset-y-0 left-0 transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%`, backgroundColor: '#9451ff' }}
          />
        </div>
        <span className="shift-eyebrow">
          {String(index + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
        </span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          advance(current)
        }}
      >
        <label className="shift-label" htmlFor={`campo-${step.id}`}>
          {step.label}
          {step.optional ? ' (opcional)' : ''}
        </label>
        <h2 className="shift-display shift-h3 mb-2">{step.question}</h2>
        {step.hint && <p className="shift-body mb-6 shift-measure">{step.hint}</p>}

        {step.type === 'choice' ? (
          <div className="flex flex-col gap-2 max-w-xl" id={`campo-${step.id}`}>
            {step.options!.map((option) => {
              const selected = current === option
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setValue(option)
                    setError(null)
                    if (!isLast) advance(option)
                  }}
                  className="shift-cta-ghost"
                  style={{
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    borderColor: selected ? '#9451ff' : undefined,
                  }}
                  aria-pressed={selected}
                >
                  {option}
                  <span aria-hidden="true">→</span>
                </button>
              )
            })}
          </div>
        ) : step.type === 'textarea' ? (
          <textarea
            id={`campo-${step.id}`}
            ref={textareaRef}
            className="shift-textarea max-w-xl"
            rows={5}
            value={value}
            placeholder={step.placeholder}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError(null)
            }}
          />
        ) : isPhone ? (
          <div className="max-w-xl" id={`campo-${step.id}`}>
            <PhoneField name="phone" control={control} placeholder={step.placeholder} />
          </div>
        ) : (
          <input
            id={`campo-${step.id}`}
            ref={inputRef}
            className="shift-input max-w-xl"
            type={step.type === 'email' ? 'email' : 'text'}
            inputMode={step.type === 'email' ? 'email' : 'text'}
            autoComplete={
              step.id === 'nome'
                ? 'name'
                : step.id === 'email'
                  ? 'email'
                  : step.id === 'empresa'
                    ? 'organization'
                    : step.id === 'site'
                      ? 'url'
                      : 'off'
            }
            value={value}
            placeholder={step.placeholder}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError(null)
            }}
          />
        )}

        {isLast && (
          <label className="shift-check max-w-xl mt-8">
            <input
              type="checkbox"
              checked={lgpd}
              onChange={(e) => {
                setLgpd(e.target.checked)
                if (error) setError(null)
              }}
            />
            <span className="shift-body">
              Aceito a{' '}
              <a
                href="/politica-de-privacidade"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#9451ff', textDecoration: 'underline' }}
              >
                Política de Privacidade
              </a>{' '}
              e autorizo o contato da Ciclo e o registro da minha navegação no site para
              personalizar o atendimento.
            </span>
          </label>
        )}

        {error && (
          <p className="shift-error" role="alert">
            {error}
          </p>
        )}
        {sendError && (
          <p className="shift-error" role="alert">
            {sendError}
          </p>
        )}

        {step.type !== 'choice' && (
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button type="submit" className="shift-cta" disabled={sending}>
              {isLast
                ? sending
                  ? 'Enviando…'
                  : 'Enviar minha aplicação'
                : 'Continuar'}
              <span aria-hidden="true">→</span>
            </button>
            {!isLast && (
              <span className="shift-body hidden sm:inline">ou pressione Enter</span>
            )}
          </div>
        )}

        {index > 0 && (
          <button
            type="button"
            onClick={back}
            disabled={sending}
            className="shift-body mt-6 underline underline-offset-4"
          >
            Voltar para a etapa anterior
          </button>
        )}
      </form>
    </div>
  )
}
