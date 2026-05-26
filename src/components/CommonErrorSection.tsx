'use client'

import { m } from 'framer-motion'
import {
  Eye,
  ShoppingCart,
  Store,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react'
import Section from './ui/Section'

const steps = [
  {
    icon: Eye,
    title: 'Reconhecimento & consideração',
    description: 'A marca não é lembrada quando o cliente pensa em comprar.',
  },
  {
    icon: ShoppingCart,
    title: 'Performance da primeira compra',
    description: 'Onde seu cliente toma a decisão de adquirir seu produto pela primeira vez.',
    highlight: false,
  },
  {
    icon: Store,
    title: 'Ambiente transacional',
    description: null,
    list: ['Loja Própria', 'Marketplaces', 'WhatsApp', 'Televendas', 'IA Checkout', 'Loja Física', 'Social Commerce'],
    isCenter: true,
  },
  {
    icon: RefreshCw,
    title: 'Recompra & fidelização',
    description: 'Falta de estímulo para voltar a comprar e de programas de retenção.',
  },
  {
    icon: TrendingUp,
    title: 'Expansão de aquisição',
    description: 'Investimento desconectado de escala e novas audiências.',
  },
]

export default function CommonErrorSection() {
  return (
    <Section className="bg-[#050505] py-20 lg:py-32">
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative arc */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path d="M 200 0 Q 150 80 80 120 Q 30 150 0 200" stroke="#A100FF" strokeWidth="2" fill="none" />
          <path d="M 200 40 Q 140 100 70 140 Q 20 170 0 200" stroke="#A100FF" strokeWidth="1" fill="none" strokeOpacity="0.5" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">O erro comum das marcas</h2>
          <p className="text-[#A1A1AA] max-w-xl">
            Investir exclusivamente no momento da conversão e não estar no ambiente transacional correto.
          </p>
        </m.div>

        {/* Connector line */}
        <div className="hidden lg:block absolute top-[calc(50%-40px)] left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#A100FF]/40 to-transparent" />

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <m.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`
                  relative rounded-2xl border p-5 flex flex-col gap-3
                  ${step.isCenter
                    ? 'border-[#A100FF]/50 bg-[#A100FF]/10 shadow-[0_0_40px_rgba(161,0,255,0.2)]'
                    : 'border-white/8 bg-white/3'
                  }
                `}
              >
                {/* Step number */}
                <div className="absolute -top-3 left-5 text-[10px] text-[#A100FF] font-bold bg-[#050505] px-2 py-0.5 rounded-full border border-[#A100FF]/30">
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${step.isCenter ? 'bg-[#A100FF]' : 'bg-[#A100FF]/20'}`}>
                  <Icon className={`w-4 h-4 ${step.isCenter ? 'text-white' : 'text-[#A100FF]'}`} />
                </div>

                <h3 className="text-sm font-semibold leading-tight">{step.title}</h3>

                {step.description && (
                  <p className="text-[#A1A1AA] text-xs leading-relaxed">{step.description}</p>
                )}

                {step.list && (
                  <ul className="flex flex-col gap-1">
                    {step.list.map((item) => (
                      <li key={item} className="text-xs text-[#D4D4D8] flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#A100FF] flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </m.div>
            )
          })}
        </div>

        {/* Alert block */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-start gap-4 bg-[#A100FF]/10 border border-[#A100FF]/30 rounded-2xl p-6"
        >
          <div className="w-10 h-10 rounded-full bg-[#A100FF] flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm sm:text-base text-[#D4D4D8] leading-relaxed">
            <span className="text-white font-semibold">Esse é o problema mais grave que as marcas estão enfrentando:</span>{' '}
            elas não estão conseguindo conectar suas estratégias de marketing de ponta a ponta no e-commerce.
          </p>
        </m.div>
      </div>
    </Section>
  )
}
