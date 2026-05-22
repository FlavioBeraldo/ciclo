'use client'

import { motion } from 'framer-motion'
import { Zap, Target, Repeat, BarChart3 } from 'lucide-react'
import Button from './ui/Button'
import Section from './ui/Section'

const services = [
  {
    icon: Zap,
    title: 'Criação de Demanda',
    items: ['Social & Branding', 'Conteúdo Estratégico', 'Mídia de Alcance e Vídeo', 'Comunidades e Influência', 'CRM e Relacionamento'],
  },
  {
    icon: Target,
    title: 'Captação de Demanda',
    items: ['Mídia de Performance', 'Landing Pages & CRO', 'Automação e Nutrição', 'IA para Performance'],
  },
  {
    icon: Repeat,
    title: 'Expansão de Demanda',
    items: ['CRM & E-mail & WhatsApp', 'Fidelização e Pós-venda', 'Programas de Recompra', 'Cross & Upsell', 'Retenção e Lifetime Value'],
  },
  {
    icon: BarChart3,
    title: 'Inteligência & Operação',
    items: ['Analytics & BI', 'Estruturação de Time', 'Processos e Playbooks', 'Growth Contínuo'],
  },
]

const metrics = [
  { value: '+300', label: 'marcas impulsionadas' },
  { value: '+12MM', label: 'de receita gerada para clientes' },
  { value: '-35%', label: 'de CAC em média' },
  { value: '2,7x', label: 'aumento médio de LTV dos clientes' },
]

export default function ServicesSection() {
  return (
    <Section id="servicos" className="py-20 lg:py-32 bg-[#050505]">
      {/* Strong background glow for this section */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#A100FF]/5 via-transparent to-[#A100FF]/5" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#A100FF]/10 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[320px_1fr] gap-12 lg:gap-16 items-start mb-16">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-3">Nossos serviços</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Serviços organizados{' '}
              <span className="text-[#A100FF]">Full Funnel Marketing</span>
            </h2>
            <p className="text-[#A1A1AA] text-base mb-8">
              Uma jornada completa para transformar marketing em receita real.
            </p>
            <Button href="#contato" arrow size="lg">
              Fale com especialista
            </Button>
          </motion.div>

          {/* Right - service cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {services.map((service, i) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-[#A100FF]/30 hover:bg-[#A100FF]/5 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#A100FF]/20 flex items-center justify-center mb-4 group-hover:bg-[#A100FF]/30 transition-colors">
                    <Icon className="w-5 h-5 text-[#A100FF]" />
                  </div>
                  <h3 className="font-bold text-white mb-3">{service.title}</h3>
                  <ul className="space-y-2">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                        <span className="w-1 h-1 rounded-full bg-[#A100FF] flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Metrics bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white/3 border border-white/8 rounded-2xl p-6 lg:p-8"
        >
          {metrics.map((m, i) => (
            <div key={m.label} className={`text-center ${i < metrics.length - 1 ? 'lg:border-r lg:border-white/10' : ''}`}>
              <p className="text-3xl sm:text-4xl font-bold text-[#A100FF] mb-1">{m.value}</p>
              <p className="text-xs text-[#A1A1AA] leading-tight">{m.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}
