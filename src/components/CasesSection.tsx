'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './ui/Button'
import Section from './ui/Section'

const cases = [
  {
    brand: 'Pit Bull',
    category: 'Moda e Acessórios',
    metrics: [{ label: 'Faturamento', value: '+104%' }, { label: 'Custo por aquisição', value: '-23%' }],
    color: '#1a0a2e',
  },
  {
    brand: 'GoPro Brasil',
    category: 'Esportes',
    metrics: [{ label: 'Faturamento', value: '+197%' }, { label: 'CAC', value: '-32%' }],
    color: '#0a1a0a',
  },
  {
    brand: 'Essência Di Fiori',
    category: 'Beleza e Cosméticos',
    metrics: [{ label: 'Faturamento', value: '+89%' }, { label: 'LTV', value: '+48%' }],
    color: '#1a0a1a',
  },
  {
    brand: 'Atlético MG',
    category: 'Esportes',
    metrics: [{ label: 'Faturamento', value: '+70%' }, { label: 'Novos clientes', value: '+124%' }],
    color: '#0a0a1a',
  },
]

export default function CasesSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 320
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  const onScroll = () => {
    if (!scrollRef.current) return
    setCanScrollLeft(scrollRef.current.scrollLeft > 0)
    setCanScrollRight(
      scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
    )
  }

  return (
    <Section id="cases" className="bg-[#080808] py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              Cresça seu e-commerce
              <br />
              <span className="text-[#A100FF]">nosso método gera resultados</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Case anterior"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#A100FF] hover:text-[#A100FF] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Próximo case"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#A100FF] hover:text-[#A100FF] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cases.map((c, i) => (
            <motion.div
              key={c.brand}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex-shrink-0 w-72 sm:w-80 rounded-2xl border border-white/8 overflow-hidden hover:border-[#A100FF]/30 transition-colors"
              style={{ background: `linear-gradient(135deg, ${c.color}, #050505)` }}
            >
              <div className="p-6 h-full flex flex-col justify-between min-h-[220px]">
                <div>
                  <span className="text-xs text-[#A100FF] font-medium uppercase tracking-wider">{c.category}</span>
                  <h3 className="text-xl font-bold text-white mt-1 mb-6">{c.brand}</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {c.metrics.map((m) => (
                    <div key={m.label} className="bg-black/30 rounded-xl p-3">
                      <p className="text-2xl font-bold text-white">{m.value}</p>
                      <p className="text-xs text-[#A1A1AA] mt-0.5">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-8"
        >
          <Button href="#contato" variant="outline" arrow>
            Ver mais cases de sucesso
          </Button>
        </motion.div>
      </div>
    </Section>
  )
}
