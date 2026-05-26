'use client'

import { m } from 'framer-motion'
import Button from './ui/Button'
import Section from './ui/Section'

const proofs = [
  { value: '+300', label: 'marcas atendidas' },
  { value: '+R$ 350MM', label: 'em receita gerada' },
  { value: '-35%', label: 'de CAC em média' },
]

export default function Hero() {
  return (
    <Section id="home" className="min-h-screen flex items-center bg-[#050505] pt-20">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[700px] h-[700px] rounded-full bg-[#A100FF]/10 blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#A100FF]/5 blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Positioning — prominent, not a small tag */}
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <p className="text-[#A100FF] text-base sm:text-lg font-bold tracking-wide uppercase leading-tight">
                Somos seu Parceiro
              </p>
              <p className="text-white text-2xl sm:text-3xl font-bold leading-tight">
                Full Funnel Marketing
              </p>
            </m.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Obcecados por{' '}
              <span className="text-[#A100FF] glow-text">crescimento.</span>
              <br />
              Inimigos do
              <br />
              desperdício.
            </h1>

            {/* Clearer description of what Ciclo actually does */}
            <div className="mb-8 space-y-3 max-w-xl">
              <p className="text-white/90 text-lg leading-relaxed font-medium">
                A Ciclo E-commerce conecta sua marca do primeiro impacto até a recompra.
              </p>
              <p className="text-[#A1A1AA] text-base leading-relaxed">
                Geração, captação e expansão de demanda integradas — para e-commerces que querem crescer com eficiência, previsibilidade e margem.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button href="#contato" arrow size="lg">
                Fale com especialista
              </Button>
              <Button href="#servicos" variant="outline" size="lg">
                Ver nossas soluções →
              </Button>
            </div>

            {/* Social proof strip */}
            <div className="flex flex-wrap gap-6 pt-6 border-t border-white/8">
              {proofs.map((p) => (
                <div key={p.label}>
                  <p className="text-[#A100FF] text-2xl font-bold">{p.value}</p>
                  <p className="text-[#A1A1AA] text-xs">{p.label}</p>
                </div>
              ))}
            </div>
          </m.div>

          {/* Visual - Ciclo symbol */}
          <m.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[480px] lg:h-[480px]">
              <div className="absolute inset-0 rounded-full border border-white/5" />
              <div className="absolute inset-8 rounded-full border border-white/5" />
              <div className="absolute inset-16 rounded-full border border-white/8" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                  <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
                    <defs>
                      <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#A100FF" stopOpacity="1" />
                        <stop offset="100%" stopColor="#A100FF" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="100" cy="100" r="90" fill="none"
                      stroke="url(#arcGrad)" strokeWidth="4"
                      strokeLinecap="round" strokeDasharray="480 80" strokeDashoffset="60"
                    />
                    <circle cx="100" cy="100" r="60" fill="#A100FF" opacity="0.15" />
                    <circle cx="100" cy="100" r="50" fill="#A100FF" opacity="0.25" />
                    <circle cx="100" cy="100" r="20" fill="#A100FF" />
                    <circle cx="175" cy="60" r="10" fill="#050505" />
                    <circle cx="175" cy="60" r="6" fill="#ffffff" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-16 rounded-full bg-[#A100FF]/20 blur-3xl" />
            </div>
          </m.div>
        </div>
      </div>
    </Section>
  )
}
