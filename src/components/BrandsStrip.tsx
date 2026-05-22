'use client'

import { motion } from 'framer-motion'
import {
  Shirt,
  Heart,
  Sparkles,
  Baby,
  Coffee,
  Home,
  PawPrint,
  Dumbbell,
} from 'lucide-react'

const brands = [
  'GoPro', 'NARS', "Jack Link's", 'Shiseido', 'HEAD', 'Motorola', 'MASH', 'TVZ',
  'Mamô', 'Tania Bulhões', 'GiGi', 'Eico', 'DaBelle', 'DutyColor', 'Líquido', 'Vizcaya', 'KVRA', 'DANKI',
]

const segments = [
  { icon: Shirt, label: 'Moda e Acessórios' },
  { icon: Heart, label: 'Saúde e Bem-estar' },
  { icon: Sparkles, label: 'Beleza e Cosméticos' },
  { icon: Baby, label: 'Infantil' },
  { icon: Coffee, label: 'Alimentos e Bebidas' },
  { icon: Home, label: 'Casa e Decoração' },
  { icon: PawPrint, label: 'Pet' },
  { icon: Dumbbell, label: 'Esportes' },
]

export default function BrandsStrip() {
  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-black/60 text-sm font-medium mb-8 tracking-wider uppercase"
        >
          + de 300 marcas atendidas
        </motion.p>

        {/* Brand logos as text */}
        <div className="overflow-hidden mb-8">
          <motion.div
            className="flex gap-12 whitespace-nowrap"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            {[...brands, ...brands].map((brand, i) => (
              <span
                key={i}
                className="text-black/40 font-bold text-lg tracking-widest uppercase flex-shrink-0"
              >
                {brand}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Segments */}
        <div className="flex flex-wrap justify-center gap-6 pt-4 border-t border-black/10">
          {segments.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-black/50 text-xs">
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
