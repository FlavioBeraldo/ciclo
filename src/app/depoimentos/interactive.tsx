'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const testimonials = [
  {
    id: 'djykk9EFghg',
    brand: 'Líquido',
    role: 'CEO – Líquido',
    description: 'Como a Líquido escalou seu e-commerce com Full Funnel Marketing.',
  },
  {
    id: 'xVdqhprwKWw',
    brand: 'KVRA',
    role: 'Head de Marketing – KVRA',
    description: 'A jornada de crescimento da KVRA com Ciclo E-commerce.',
  },
  {
    id: '6B2XYATbK3Q',
    brand: 'DANKI',
    role: 'Fundador – DANKI',
    description: 'DANKI e os resultados de Full Funnel Marketing com a Ciclo.',
  },
  {
    id: 'EhnxUiDMMRg',
    brand: 'Mamô Brasil',
    role: 'CEO – Mamô Brasil',
    description: 'Mamô Brasil e sua estratégia de crescimento sustentável.',
  },
]

export default function DepoimentosInteractive() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors mb-10 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o início
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-[#A100FF] text-sm font-semibold tracking-wide uppercase mb-3">
            Depoimentos
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Quem vive,{' '}
            <span className="text-[#A100FF]">recomenda</span>
          </h1>
          <p className="text-[#A1A1AA] text-lg max-w-xl">
            Veja o que as marcas que cresceram com a Ciclo têm a dizer sobre a parceria.
          </p>
        </motion.div>

        {/* Videos grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              className="group cursor-pointer"
              onClick={() => setActiveVideo(t.id)}
            >
              {/* Thumbnail */}
              <div className="relative rounded-2xl overflow-hidden border border-white/8 hover:border-[#A100FF]/40 transition-colors mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${t.id}/hqdefault.jpg`}
                  alt={`Depoimento ${t.brand}`}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#A100FF] flex items-center justify-center shadow-[0_0_40px_rgba(161,0,255,0.6)] group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div>
                <p className="font-bold text-white text-base">{t.brand}</p>
                <p className="text-sm text-[#A100FF] mb-1">{t.role}</p>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">{t.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center py-12 border-t border-white/8"
        >
          <p className="text-[#A1A1AA] mb-6 text-lg">
            Quer ser o próximo case de sucesso?
          </p>
          <Link
            href="/#contato"
            className="inline-flex items-center gap-2 bg-[#A100FF] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#8800DD] hover:shadow-[0_0_30px_rgba(161,0,255,0.5)] transition-all text-base"
          >
            Fale com um especialista
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </motion.div>
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                aria-label="Fechar vídeo"
                className="absolute -top-10 right-0 text-white hover:text-[#A100FF] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="Depoimento de cliente Ciclo E-commerce"
                className="w-full h-full rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
