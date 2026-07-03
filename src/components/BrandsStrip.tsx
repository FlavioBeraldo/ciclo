import Image from 'next/image'
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
  { name: 'Vizcaya',        logo: '/brands/vizcaya.png' },
  { name: 'DaBelle',        logo: '/brands/dabelle.png' },
  { name: 'Davene',         logo: '/brands/davene.png' },
  { name: 'DANKI',          logo: '/brands/danki.png' },
  { name: 'Eico',           logo: '/brands/eico.png' },
  { name: 'Surya',          logo: '/brands/surya.png' },
  { name: 'GoPro',          logo: '/brands/gopro.png' },
  { name: 'Gringa',         logo: '/brands/gringa.png' },
  { name: "Jack Link's",    logo: '/brands/jacklinks.png' },
  { name: 'Laura Mercier',  logo: '/brands/laura-mercier.png' },
  { name: 'Líquido',        logo: '/brands/liquido.png' },
  { name: 'Água de Cheiro', logo: '/brands/agua-de-cheiro.png' },
  { name: 'Mamô',           logo: '/brands/mamo.png' },
  { name: 'Mash',           logo: '/brands/mash.png' },
  { name: 'Motorola',       logo: '/brands/motorola.png' },
  { name: 'NARS',           logo: '/brands/nars.png' },
  { name: 'She',            logo: '/brands/she.png' },
  { name: 'Shiseido',       logo: '/brands/shiseido.png' },
  { name: 'TVZ',            logo: '/brands/tvz.png' },
  { name: 'Valid',          logo: '/brands/valid.png' },
]

const segments = [
  { icon: Shirt,    label: 'Moda e Acessórios' },
  { icon: Heart,    label: 'Saúde e Bem-estar' },
  { icon: Sparkles, label: 'Beleza e Cosméticos' },
  { icon: Baby,     label: 'Infantil' },
  { icon: Coffee,   label: 'Alimentos e Bebidas' },
  { icon: Home,     label: 'Casa e Decoração' },
  { icon: PawPrint, label: 'Pet' },
  { icon: Dumbbell, label: 'Esportes' },
]

const allBrands = [...brands, ...brands]

export default function BrandsStrip() {
  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-black/60 text-sm font-medium mb-8 tracking-wider uppercase">
          + de 300 marcas atendidas
        </p>

        {/* CSS marquee — zero JS, GPU composited */}
        <div className="overflow-hidden mb-8">
          <div className="flex gap-12 whitespace-nowrap animate-marquee">
            {allBrands.map((brand, i) => (
              <div key={i} className="flex-shrink-0 flex items-center justify-center h-10 w-28">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain grayscale opacity-50 hover:opacity-80 hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
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
