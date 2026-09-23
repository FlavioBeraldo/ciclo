'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './ui/Button'
import Section from './ui/Section'
import { cases } from '@/lib/cases'


export default function CasesSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' })
  }

  return (
    <Section id="cases" className="bg-[#080808] py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="reveal reveal-up flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
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
              aria-label="Case anterior"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#A100FF] hover:text-[#A100FF] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Próximo case"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#A100FF] hover:text-[#A100FF] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cases.map((c, i) => (
            <div
              key={c.brand}
              className="reveal reveal-up-lg theme-dark flex-shrink-0 w-72 sm:w-80 flex flex-col rounded-2xl border border-white/8 overflow-hidden hover:border-[#A100FF]/30 transition-colors snap-start"
              style={{ background: `linear-gradient(135deg, ${c.color}, #050505)`, transitionDelay: `${i * 0.05}s` }}
            >
              {/* Image slot */}
              <div className="w-full h-40 overflow-hidden bg-white/5 border-b border-white/8 flex items-center justify-center">
                {c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image} alt={c.brand} className={`w-full h-full object-cover ${c.imagePosition ?? 'object-center'}`} loading="lazy" />
                ) : (
                  <span className="text-[#A1A1AA]/25 text-xs tracking-widest uppercase">Imagem</span>
                )}
              </div>

              <div className="p-6 flex flex-col gap-4 flex-1">
                <div>
                  <span className="text-xs text-[#A100FF] font-medium uppercase tracking-wider">{c.category}</span>
                  <h3 className="text-xl font-bold text-white mt-1">{c.brand}</h3>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-1">Desafio</p>
                    <p className="text-[13px] text-[#D4D4D8] leading-snug">{c.challenge}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-1">Ação</p>
                    <p className="text-[13px] text-[#D4D4D8] leading-snug">{c.action}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#A100FF] mb-2">Resultado</p>
                  <div className={`grid gap-2 ${c.metrics.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {c.metrics.map((m) => (
                      <div key={m.label} className="bg-black/30 rounded-xl p-3">
                        <p className="text-xl font-bold text-white leading-tight">{m.value}</p>
                        <p className="text-[10px] text-[#A1A1AA] mt-0.5 leading-tight">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal flex justify-center mt-8">
          <Button href="#depoimentos" variant="outline" arrow>
            Ver mais cases de sucesso
          </Button>
        </div>
      </div>
    </Section>
  )
}
