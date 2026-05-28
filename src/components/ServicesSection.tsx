'use client'

import { m } from 'framer-motion'
import { Zap, Target, Repeat, BarChart3, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Button from './ui/Button'
import Section from './ui/Section'

const services = [
  {
    icon: Zap,
    title: 'Geração de Demanda',
    slug: 'geracao-de-demanda',
    items: [
      { label: 'Produção e roteirização de conteúdo validado para redes sociais', slug: 'producao-conteudo-redes-sociais' },
      { label: 'TikTok Shop (Social Commerce)', slug: 'tiktok-shop-social-commerce', href: '/tiktok-shop' },
      { label: 'Gestão de Creators e Influenciadores', slug: 'gestao-creators-influenciadores' },
      { label: 'OOH Digital', slug: 'ooh-digital' },
    ],
  },
  {
    icon: Target,
    title: 'Captação de Demanda',
    slug: 'captacao-de-demanda',
    items: [
      { label: 'Produção e criação de anúncios social first validado para conversão', slug: 'anuncios-social-first-conversao' },
      { label: 'Google Ads / Bing Ads', slug: 'google-ads-bing-ads' },
      { label: 'Meta Ads / TikTok Ads', slug: 'meta-ads-tiktok-ads' },
      { label: 'Programática / Pinterest Ads', slug: 'programatica-pinterest-ads' },
      { label: 'Retail Media (Mercado/Shopee/Amazon)', slug: 'retail-media' },
    ],
  },
  {
    icon: Repeat,
    title: 'Expansão de Demanda',
    slug: 'expansao-de-demanda',
    items: [
      { label: 'CRM: E-mail, SMS, Push, WhatsApp', slug: 'crm-email-sms-push-whatsapp' },
      { label: 'Réguas de automação personalizadas', slug: 'reguas-automacao-personalizadas' },
      { label: 'Reativação e programas de fidelização', slug: 'reativacao-fidelizacao' },
      { label: 'Programas de indicação / Reviews', slug: 'programas-indicacao-reviews' },
    ],
  },
  {
    icon: BarChart3,
    title: 'Inteligência & Operação',
    slug: 'inteligencia-e-operacao',
    items: [
      { label: 'Analytics & BI', slug: 'analytics-bi' },
      { label: 'Processos e Playbooks', slug: 'processos-playbooks' },
      { label: 'Growth Contínuo', slug: 'growth-continuo' },
    ],
  },
]

const metrics = [
  { value: '+300', label: 'marcas impulsionadas' },
  { value: '+R$ 350MM', label: 'de receita gerada para clientes' },
  { value: '-35%', label: 'de CAC em média' },
  { value: '2,7x', label: 'aumento médio de LTV dos clientes' },
]

export default function ServicesSection() {
  return (
    <Section id="servicos" className="py-20 lg:py-32 bg-[#050505]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#A100FF]/5 via-transparent to-[#A100FF]/5" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#A100FF]/10 blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[320px_1fr] gap-12 lg:gap-16 items-start mb-16">
          {/* Left */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-3">Nossas soluções</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Soluções organizadas em{' '}
              <span className="text-[#A100FF]">Full Funnel Marketing</span>
            </h2>
            <p className="text-[#A1A1AA] text-base mb-8">
              Uma jornada completa para transformar marketing em receita real, do topo ao fundo do funil.
            </p>
            <Button href="#contato" arrow size="lg">
              Fale com especialista
            </Button>
          </m.div>

          {/* Right - service cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {services.map((service, i) => {
              const Icon = service.icon
              return (
                <m.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-[#A100FF]/30 hover:bg-[#A100FF]/5 transition-all duration-300 group flex flex-col"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#A100FF]/20 flex items-center justify-center mb-4 group-hover:bg-[#A100FF]/30 transition-colors">
                    <Icon className="w-5 h-5 text-[#A100FF]" />
                  </div>
                  <h3 className="font-bold text-white mb-3">{service.title}</h3>
                  <ul className="space-y-2 flex-1">
                    {service.items.map((item) => (
                      <li key={item.slug} className="flex items-start gap-2 text-xs text-[#A1A1AA]">
                        <span className="w-1 h-1 rounded-full bg-[#A100FF] flex-shrink-0 mt-1.5" />
                        <Link
                          href={'href' in item && item.href ? item.href : `/servicos/${item.slug}`}
                          className="hover:text-white hover:underline transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/solucoes/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-[#A100FF] font-semibold mt-5 pt-4 border-t border-white/8 hover:gap-2.5 transition-all"
                  >
                    Ver solução completa <ArrowRight className="w-3 h-3" />
                  </Link>
                </m.div>
              )
            })}
          </div>
        </div>

        {/* Metrics bar */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white/3 border border-white/8 rounded-2xl p-6 lg:p-8"
        >
          {metrics.map((m, i) => (
            <div key={m.label} className={`text-center ${i < metrics.length - 1 ? 'lg:border-r lg:border-white/10' : ''}`}>
              <p className="text-3xl sm:text-4xl font-bold text-[#A100FF] mb-1">{m.value}</p>
              <p className="text-xs text-[#A1A1AA] leading-tight">{m.label}</p>
            </div>
          ))}
        </m.div>
      </div>
    </Section>
  )
}
