'use client'

import { m } from 'framer-motion'
import Section from './ui/Section'

const cycles = [
  {
    label: 'Criação de Demanda para marca',
    desc: 'Construa desejo, relevância e preferência.',
    delay: 0,
  },
  {
    label: 'Captação de Demanda',
    desc: 'Converta interesse em primeira compra.',
    delay: 0.15,
  },
  {
    label: 'Expansão de Demanda',
    desc: 'Aumente frequência, ticket e lifetime value.',
    delay: 0.3,
  },
]

export default function ThesisSection() {
  return (
    <Section className="bg-[#080808] py-20 lg:py-32">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#A100FF]/8 blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20 items-start">
          {/* Left title */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold">Nossa<br />tese</h2>
          </m.div>

          {/* Right content */}
          <div>
            <m.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg sm:text-xl text-[#D4D4D8] mb-12 max-w-xl"
            >
              <span className="text-white font-semibold">Crescimento sustentável</span> não é só conversão.
              Uma marca precisa gerar esses <span className="text-[#A100FF]">três ciclos</span> de forma constante.
            </m.p>

            {/* Cycles visual */}
            <div className="flex flex-col lg:flex-row items-center gap-0 lg:gap-0 mb-12">
              {cycles.map((cycle, i) => (
                <div key={cycle.label} className="flex lg:flex-col items-center">
                  <m.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: cycle.delay }}
                    className="relative flex-shrink-0"
                  >
                    <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 border-[#A100FF] bg-[#A100FF]/10 flex flex-col items-center justify-center text-center p-4 shadow-[0_0_40px_rgba(161,0,255,0.3)] relative z-10">
                      <p className="text-sm font-bold text-white leading-tight mb-2">{cycle.label}</p>
                      <p className="text-xs text-[#A1A1AA] leading-tight">{cycle.desc}</p>
                    </div>
                    {/* Overlap for next circle */}
                    {i < cycles.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-[2px] bg-gradient-to-r from-[#A100FF] to-[#A100FF]/30 z-20 -translate-y-1/2" />
                    )}
                  </m.div>

                  {/* Mobile connector */}
                  {i < cycles.length - 1 && (
                    <div className="lg:hidden w-[2px] h-8 bg-gradient-to-b from-[#A100FF] to-[#A100FF]/30" />
                  )}
                </div>
              ))}

              {/* Arrow to result */}
              <div className="hidden lg:flex items-center">
                <div className="w-8 h-[2px] bg-[#A100FF]/50" />
                <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-[#A100FF]/50" />
              </div>

              {/* Result box */}
              <m.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45 }}
                className="mt-8 lg:mt-0 lg:ml-4 bg-[#A100FF]/15 border border-[#A100FF]/40 rounded-2xl px-6 py-5 text-center lg:text-left flex-shrink-0 shadow-[0_0_30px_rgba(161,0,255,0.2)]"
              >
                <p className="text-xs text-[#A1A1AA] mb-1">Receita na operação do e-commerce</p>
                <p className="text-2xl font-bold text-white">+ Lucro</p>
                <p className="text-lg font-semibold text-[#A100FF]">− CAC</p>
              </m.div>
            </div>

            {/* Bottom bar */}
            <m.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 bg-white/3 border border-white/8 rounded-xl px-5 py-4"
            >
              <span className="text-[#A100FF] text-xl flex-shrink-0">✦</span>
              <p className="text-sm text-[#A1A1AA]">
                Alinhados, esses ciclos geram{' '}
                <span className="text-white">crescimento previsível</span>, previsibilidade de caixa e{' '}
                <span className="text-white">vantagem competitiva sustentável</span>.
              </p>
            </m.div>
          </div>
        </div>
      </div>
    </Section>
  )
}
