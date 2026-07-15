'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import LeadForm from '@/components/LeadForm'
import type { Servico } from '@/lib/servicos'


// ─── FAQ item ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border border-white/8 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/3 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-white text-sm sm:text-base">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#A100FF] flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-[#D4D4D8] text-sm leading-relaxed border-t border-white/5 pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Exported combined interactive component ──────────────────────────────────

export function ServicosInteractive({ servico }: { servico: Servico }) {
  return (
    <>
      {/* FAQ */}
      <section aria-labelledby="faq-heading" id="faq">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-3">
            Dúvidas frequentes
          </p>
          <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold text-white">
            Perguntas frequentes
          </h2>
        </motion.div>

        <div className="space-y-3">
          {servico.faq.map(({ q, a }, i) => (
            <FaqItem key={q} q={q} a={a} index={i} />
          ))}
        </div>
      </section>

      {/* CTA form */}
      <LeadForm />
    </>
  )
}
