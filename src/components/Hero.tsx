'use client'

import { motion } from 'framer-motion'
import Button from './ui/Button'
import Section from './ui/Section'

export default function Hero() {
  return (
    <Section id="home" className="min-h-screen flex items-center bg-[#050505] pt-20">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-[#A100FF]/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#A100FF]/5 blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <p className="text-[#A100FF] text-sm font-semibold tracking-wide uppercase mb-6">
              Somos seu Parceiro Full Funnel Marketing
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Obcecados por{' '}
              <span className="text-[#A100FF] glow-text">crescimento.</span>
              <br />
              Inimigos do
              <br />
              desperdício.
            </h1>

            <p className="text-[#A1A1AA] text-lg leading-relaxed mb-8 max-w-xl">
              A Ciclo E-commerce é uma agência especializada em marcas que querem crescer com eficiência e previsibilidade.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="#contato" arrow size="lg">
                Fale com especialista
              </Button>
              <Button href="#servicos" variant="outline" size="lg">
                Conheça quem faz isso →
              </Button>
            </div>
          </motion.div>

          {/* Visual - Ciclo symbol */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[480px] lg:h-[480px]">
              {/* Outer rings */}
              <div className="absolute inset-0 rounded-full border border-white/5" />
              <div className="absolute inset-8 rounded-full border border-white/5" />
              <div className="absolute inset-16 rounded-full border border-white/8" />

              {/* Main C symbol */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                  {/* Outer circle arc */}
                  <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
                    <defs>
                      <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#A100FF" stopOpacity="1" />
                        <stop offset="100%" stopColor="#A100FF" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="url(#arcGrad)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="480 80"
                      strokeDashoffset="60"
                    />
                    {/* Inner filled circle */}
                    <circle cx="100" cy="100" r="60" fill="#A100FF" opacity="0.15" />
                    <circle cx="100" cy="100" r="50" fill="#A100FF" opacity="0.25" />
                    {/* Center dot */}
                    <circle cx="100" cy="100" r="20" fill="#A100FF" />
                    {/* Gap indicator */}
                    <circle cx="175" cy="60" r="10" fill="#050505" />
                    <circle cx="175" cy="60" r="6" fill="#ffffff" />
                  </svg>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-16 rounded-full bg-[#A100FF]/20 blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  )
}
