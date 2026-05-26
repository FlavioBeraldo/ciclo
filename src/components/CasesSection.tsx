'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './ui/Button'
import Section from './ui/Section'

const cases = [
  {
    brand: 'GoPro Brasil',
    category: 'Esportes',
    metrics: [
      { label: 'Vendas YoY', value: '+120%' },
      { label: 'CAC', value: '-37%' },
    ],
    color: '#0a1a0a',
    image: null as string | null,
  },
  {
    brand: 'Mamô Brasil',
    category: 'Lifestyle',
    metrics: [
      { label: 'Vendas YoY', value: '+200%' },
      { label: 'LTV', value: '+57%' },
    ],
    color: '#1a0a1a',
    image: null as string | null,
  },
  {
    brand: 'Jack Links',
    category: 'Alimentação',
    metrics: [
      { label: 'Branded Search YoY', value: '+57%' },
      { label: 'CAC', value: '-46%' },
    ],
    color: '#1a1a0a',
    image: null as string | null,
  },
  {
    brand: 'Gringa',
    category: 'Fashion',
    metrics: [
      { label: 'Taxa de Recompra YoY', value: '+35%' },
      { label: 'Taxa de Indicação YoY', value: '+20%' },
      { label: 'Recência de Compra', value: '120→55 dias' },
    ],
    color: '#0a0a1a',
    image: null as string | null,
  },
]

export default function CasesSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' })
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
              {/* Image slot */}
              <div className="w-full h-40 overflow-hidden bg-white/5 border-b border-white/8 flex items-center justify-center">
                {c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image} alt={c.brand} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#A1A1AA]/25 text-xs tracking-widest uppercase">Imagem</span>
                )}
              </div>

              <div className="p-6 flex flex-col gap-4">
                <div>
                  <span className="text-xs text-[#A100FF] font-medium uppercase tracking-wider">{c.category}</span>
                  <h3 className="text-xl font-bold text-white mt-1">{c.brand}</h3>
                </div>
                <div className={`grid gap-2 ${c.metrics.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  {c.metrics.map((m) => (
                    <div key={m.label} className="bg-black/30 rounded-xl p-3">
                      <p className="text-xl font-bold text-white leading-tight">{m.value}</p>
                      <p className="text-[10px] text-[#A1A1AA] mt-0.5 leading-tight">{m.label}</p>
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
          <Button href="#depoimentos" variant="outline" arrow>
            Ver mais cases de sucesso
          </Button>
        </motion.div>
      </div>
    </Section>
  )
}
