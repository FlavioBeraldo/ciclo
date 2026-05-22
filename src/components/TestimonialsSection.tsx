'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X } from 'lucide-react'
import Button from './ui/Button'
import Section from './ui/Section'

const testimonials = [
  { id: 'djykk9EFghg', brand: 'Líquido', role: 'CEO – Líquido' },
  { id: 'xVdqhprwKWw', brand: 'KVRA', role: 'Head de Marketing – KVRA' },
  { id: '6B2XYATbK3Q', brand: 'DANKI', role: 'Fundador – DANKI' },
  { id: 'EhnxUiDMMRg', brand: 'Mamô Brasil', role: 'CEO – Mamô Brasil' },
]

export default function TestimonialsSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  return (
    <Section className="bg-[#050505] py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">Quem vive, recomenda</h2>
          <Button href="/depoimentos" variant="outline" arrow>
            Ver todos os depoimentos
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl overflow-hidden cursor-pointer group border border-white/8 hover:border-[#A100FF]/40 transition-colors"
              onClick={() => setActiveVideo(t.id)}
            >
              {/* Thumbnail */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${t.id}/hqdefault.jpg`}
                alt={`Depoimento ${t.brand}`}
                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#A100FF] flex items-center justify-center shadow-[0_0_30px_rgba(161,0,255,0.6)] group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-bold text-white text-sm">{t.brand}</p>
                <p className="text-xs text-[#A1A1AA]">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-3xl aspect-video"
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
    </Section>
  )
}
