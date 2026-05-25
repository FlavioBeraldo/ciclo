'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { CheckCircle, ChevronRight } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const inputClass =
  'w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#A100FF] focus:ring-1 focus:ring-[#A100FF] transition-all'

const pillars = [
  'BP (Plano de Negócios)',
  'Sistema de Gestão (ERP)',
  'Meios de Pagamento',
  'Análise de Custo',
  'Seleção de Plataforma',
  'Parceiro Logístico',
  'Análise dos Vetores de Crescimento',
  'Plano de Canais de Vendas',
  'Plano para Mídias de Aquisição',
  'Plano para Aumento da Recompra',
  'Plano para Geração de Demanda',
  'Construção do Ecossistema do E-commerce',
]

const audiences = [
  'Marca consolidada no físico e quer expandir para o digital',
  'Indústria que deseja criar um canal direto com o consumidor final',
  'Já vende online mas sente que sua operação poderia performar melhor',
]

export default function ConsultoriaInteractive() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (_: FormData) => {
    await new Promise((r) => setTimeout(r, 1000))
    reset()
    setSubmitted(true)
  }

  return (
    <>
      {/* HERO */}
      <section className="relative bg-[#050505] pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#A100FF]/8 blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#A100FF]/5 blur-[100px]" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-4">Consultoria para E-commerce</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Cresça sua Operação de Forma{' '}
              <span className="text-[#A100FF]">Estratégica e Sustentável</span>
            </h1>
            <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto mb-10">
              Com mais de 9 anos de experiência, a Ciclo cria um plano personalizado para escalar seu e-commerce com previsibilidade e sem desperdícios.
            </p>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#A100FF] text-white font-semibold text-base hover:bg-[#8800DD] transition-colors"
            >
              Quero uma consultoria estratégica
            </a>
          </motion.div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-3">Para quem é</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Nossa consultoria é para você que…</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {audiences.map((a, i) => (
              <motion.div
                key={a}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/3 border border-white/8 rounded-2xl p-6 flex gap-4 items-start"
              >
                <div className="w-8 h-8 rounded-full bg-[#A100FF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ChevronRight className="w-4 h-4 text-[#A100FF]" />
                </div>
                <p className="text-[#D4D4D8] text-sm leading-relaxed">{a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* METODOLOGIA */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-3">Nosso método</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Framework validado em centenas de operações</h2>
            <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
              Passamos por cada um dos principais pilares que garantem um crescimento sustentável.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pillars.map((p, i) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.05 }}
                className="bg-white/3 border border-white/8 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-[#A100FF]/30 transition-all"
              >
                <span className="text-[#A100FF] font-bold text-xs w-6 flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[#D4D4D8] text-sm">{p}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTADO */}
      <section className="py-20 bg-[#010101]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#A100FF]/15 to-[#A100FF]/5 border border-[#A100FF]/20 rounded-2xl p-8 sm:p-12"
          >
            <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-4">Caso real</p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              Crescimento de <span className="text-[#A100FF]">230%</span> em 3 anos de parceria
            </h2>
            <blockquote className="border-l-4 border-[#A100FF] pl-6 mb-8">
              <p className="text-[#D4D4D8] text-base sm:text-lg leading-relaxed italic">
                "A parceria com a Ciclo E-commerce transformou nossa trajetória. Antes, enfrentávamos altos e baixos constantes. Com a Ciclo, conquistamos consistência e superamos nossas metas. A dedicação e expertise da equipe nos permitiram focar em outras áreas críticas do negócio."
              </p>
              <footer className="mt-3 text-sm text-[#A1A1AA]">— Lucas Gomez, Gerente de Marketing, Danki</footer>
            </blockquote>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { value: '+300', label: 'marcas atendidas' },
                { value: '+12MM', label: 'em receita gerada' },
                { value: '-35%', label: 'de CAC em média' },
              ].map((m) => (
                <div key={m.label} className="text-center">
                  <p className="text-3xl font-bold text-[#A100FF]">{m.value}</p>
                  <p className="text-xs text-[#A1A1AA] mt-1">{m.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FORM */}
      <section id="contato" className="py-20 lg:py-28 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#A100FF]/5 blur-[100px]" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-3">Vamos conversar</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Fale com um especialista</h2>
            <p className="text-[#A1A1AA] text-lg">
              Preencha o formulário e nossa equipe entra em contato para entender como podemos acelerar sua operação.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/3 border border-white/8 rounded-2xl p-8"
          >
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#A100FF]/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-[#A100FF]" />
                </div>
                <h3 className="text-xl font-bold text-white">Mensagem enviada!</h3>
                <p className="text-[#A1A1AA]">Nossa equipe entrará em contato em breve.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-[#A1A1AA] mb-1.5">Nome *</label>
                    <input {...register('name')} placeholder="Seu nome completo" className={inputClass} />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-[#A1A1AA] mb-1.5">E-mail *</label>
                    <input {...register('email')} type="email" placeholder="seu@email.com" className={inputClass} />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-[#A1A1AA] mb-1.5">Telefone / WhatsApp</label>
                    <input {...register('phone')} type="tel" placeholder="(11) 99999-9999" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm text-[#A1A1AA] mb-1.5">Empresa</label>
                    <input {...register('company')} placeholder="Nome da sua empresa" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#A1A1AA] mb-1.5">Como podemos ajudar?</label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    placeholder="Conte sobre seu negócio e seu principal desafio..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#A100FF] text-white font-semibold text-base hover:bg-[#8800DD] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Enviando...' : 'Quero uma consultoria estratégica'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}
