'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ChevronDown } from 'lucide-react'
import Button from '@/components/ui/Button'
import type { Solucao } from '@/lib/solucoes'

// ─── Zod schema ───────────────────────────────────────────────────────────────

const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  company: z.string().min(1, 'Empresa é obrigatória'),
  whatsapp: z.string().min(10, 'WhatsApp inválido'),
  message: z.string().min(20, 'Descreva melhor o seu desafio (mínimo 20 caracteres)'),
})

type FormData = z.infer<typeof formSchema>

const inputClass =
  'w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#A100FF] focus:ring-1 focus:ring-[#A100FF] transition-all'

const errorClass = 'text-red-400 text-xs mt-1'

// ─── FAQ item ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border border-white/8 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/3 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-white text-sm sm:text-base">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#A100FF] flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-[#D4D4D8] text-sm leading-relaxed border-t border-white/5 pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Lead form ────────────────────────────────────────────────────────────────

function InlineLeadForm({ serviceName }: { serviceName: string }) {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await fetch('/api/pipedrive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: `Site/WhatsApp – Solução: ${serviceName}` }),
      })
    } catch {
      // Falha no Pipedrive não bloqueia o redirect
    }
    window.location.href = '/obrigado'
  }

  return (
    <section className="py-20 lg:py-32 bg-[#050505] relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-[#A100FF]/10 via-transparent to-[#A100FF]/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#A100FF]/10 blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-3">
            Fale com um especialista
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Pronto para crescer com{' '}
            <span className="text-[#A100FF]">{serviceName}?</span>
          </h2>
          <p className="text-[#A1A1AA]">
            Agende uma conversa estratégica sem compromisso e descubra o que a Ciclo pode fazer pela sua marca.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/3 border border-white/8 rounded-2xl p-8 backdrop-blur-sm"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#A100FF]/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-[#A100FF]" />
                </div>
                <h3 className="text-xl font-bold">Mensagem recebida!</h3>
                <p className="text-[#A1A1AA] max-w-md">
                  Recebemos suas informações. Em breve nosso time entrará em contato para agendar sua conversa estratégica.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit(onSubmit)}
                className="grid sm:grid-cols-2 gap-5"
              >
                <div>
                  <input
                    {...register('name')}
                    placeholder="Nome completo *"
                    className={inputClass}
                    aria-label="Nome completo"
                  />
                  {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                </div>

                <div>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="E-mail corporativo *"
                    className={inputClass}
                    aria-label="E-mail corporativo"
                  />
                  {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                </div>

                <div>
                  <input
                    {...register('company')}
                    placeholder="Empresa *"
                    className={inputClass}
                    aria-label="Empresa"
                  />
                  {errors.company && <p className={errorClass}>{errors.company.message}</p>}
                </div>

                <div>
                  <input
                    {...register('whatsapp')}
                    type="tel"
                    placeholder="WhatsApp *"
                    className={inputClass}
                    aria-label="WhatsApp"
                  />
                  {errors.whatsapp && <p className={errorClass}>{errors.whatsapp.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <textarea
                    {...register('message')}
                    rows={4}
                    placeholder="Descreva o principal desafio do seu e-commerce hoje *"
                    className={`${inputClass} resize-none`}
                    aria-label="Descreva o principal desafio do seu e-commerce"
                  />
                  {errors.message && <p className={errorClass}>{errors.message.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs text-[#A1A1AA] mb-4">
                    Quanto mais contexto você trouxer, melhor conseguimos direcionar a conversa estratégica.
                  </p>
                  <Button
                    type="submit"
                    arrow
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full justify-center"
                  >
                    {isSubmitting ? 'Enviando...' : 'Fale com um especialista'}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Exported combined component ─────────────────────────────────────────────

export function SolucaoInteractive({ solucao }: { solucao: Solucao }) {
  return (
    <>
      {/* FAQ */}
      <section aria-labelledby="faq-heading">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-3">
            Dúvidas frequentes
          </p>
          <h2
            id="faq-heading"
            className="text-2xl sm:text-3xl font-bold text-white"
          >
            Perguntas frequentes
          </h2>
        </motion.div>

        <div className="space-y-3">
          {solucao.faq.map(({ q, a }, i) => (
            <FaqItem key={q} q={q} a={a} index={i} />
          ))}
        </div>
      </section>

      {/* Lead form */}
      <InlineLeadForm serviceName={solucao.title} />
    </>
  )
}
