'use client'

import { m } from 'framer-motion'
import { CheckCircle, ChevronRight, Zap, Target, Repeat } from 'lucide-react'
import LeadForm from '@/components/LeadForm'

const frameworkCycles = [
  {
    icon: Zap,
    cycle: 'Geração de Demanda',
    items: [
      'Análise dos Vetores de Crescimento',
      'Plano para Geração de Demanda',
      'Plano de Canais de Vendas',
      'Construção do Ecossistema do E-commerce',
    ],
  },
  {
    icon: Target,
    cycle: 'Captação de Demanda',
    items: [
      'Seleção de Plataforma',
      'Meios de Pagamento',
      'Plano para Mídias de Aquisição',
      'Parceiro Logístico',
    ],
  },
  {
    icon: Repeat,
    cycle: 'Expansão de Demanda',
    items: [
      'BP (Plano de Negócios)',
      'Sistema de Gestão (ERP)',
      'Análise de Custo',
      'Plano para Aumento da Recompra',
    ],
  },
]

const audiences = [
  'Marca consolidada no físico e quer expandir para o digital',
  'Indústria que deseja criar um canal direto com o consumidor final',
  'Já vende online mas sente que sua operação poderia performar melhor',
]

export default function ConsultoriaInteractive() {
  return (
  return (
    <>
      {/* HERO */}
      <section className="relative bg-[#050505] pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#A100FF]/8 blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#A100FF]/5 blur-[100px]" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
          </m.div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-3">Para quem é</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Nossa consultoria é para você que…</h2>
          </m.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {audiences.map((a, i) => (
              <m.div
                key={a}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/3 border border-white/8 rounded-2xl p-6 flex gap-4 items-start"
              >
                <div className="w-8 h-8 rounded-full bg-[#A100FF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ChevronRight className="w-4 h-4 text-[#A100FF]" />
                </div>
                <p className="text-[#D4D4D8] text-sm leading-relaxed">{a}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* METODOLOGIA */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-3">Nosso método</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Framework de análise baseado nos 3 ciclos</h2>
            <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
              Cada pilar é analisado dentro do ciclo ao qual pertence, garantindo um diagnóstico completo e integrado.
            </p>
          </m.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {frameworkCycles.map((cycle, i) => {
              const Icon = cycle.icon
              return (
                <m.div
                  key={cycle.cycle}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-[#A100FF]/30 transition-all"
                >
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/8">
                    <div className="w-9 h-9 rounded-xl bg-[#A100FF]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#A100FF]" />
                    </div>
                    <h3 className="font-bold text-white text-sm leading-tight">{cycle.cycle}</h3>
                  </div>
                  <ul className="space-y-3">
                    {cycle.items.map((item, j) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="text-[#A100FF] font-bold text-xs flex-shrink-0 mt-0.5">
                          {String(i * 4 + j + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[#D4D4D8] text-sm leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </m.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* RESULTADO */}
      <section className="py-20 bg-[#010101]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
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
                { value: '+R$ 350MM', label: 'em receita gerada' },
                { value: '-35%', label: 'de CAC em média' },
              ].map((m) => (
                <div key={m.label} className="text-center">
                  <p className="text-3xl font-bold text-[#A100FF]">{m.value}</p>
                  <p className="text-xs text-[#A1A1AA] mt-1">{m.label}</p>
                </div>
              ))}
            </div>
          </m.div>
        </div>
      </section>

      {/* FORM */}
      <LeadForm />
    </>
  )
}
