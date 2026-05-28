'use client'

import { m, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { CheckCircle2, ArrowRight, Users, TrendingUp, Zap, BarChart3, Target, RefreshCw } from 'lucide-react'
import YouTubeFacade from '@/components/ui/YouTubeFacade'

const PAYMENT_URL = 'https://pay.hub.la/4JzioLT4Af7962CGf2by'
const PRICE = 'R$ 37,90'

const modules = [
  {
    number: '01',
    title: 'O Novo Cenário do E-commerce',
    desc: 'A mudança brutal do mercado e por que quem não se adapta ao Full Funnel fica para trás.',
    icon: TrendingUp,
  },
  {
    number: '02',
    title: 'O Funil Ampulheta',
    desc: 'Da atração à expansão: Reconhecimento, Consideração, Compra, Recompra, Fidelização e Conquista.',
    icon: BarChart3,
  },
  {
    number: '03',
    title: 'Reconhecimento & Atenção',
    desc: 'Como construir alcance real com frequência e relevância para sua marca no digital.',
    icon: Target,
  },
  {
    number: '04',
    title: 'Consideração com Provas',
    desc: 'Creators, UGC e prova social como motor de consideração e intenção de compra.',
    icon: Users,
  },
  {
    number: '05',
    title: 'Canais Transacionais',
    desc: 'Marketplaces, loja própria, WhatsApp, social commerce e IA no checkout.',
    icon: Zap,
  },
  {
    number: '06',
    title: 'Fidelização & Expansão',
    desc: 'Transforme compradores em fãs e expanda via boca a boca, conquista e novos mercados.',
    icon: RefreshCw,
  },
]

const forWhom = [
  'Gestores de marketing de e-commerce que querem sair do operacional e pensar estrategicamente',
  'Donos e sócios de lojas virtuais que precisam entender e dominar o marketing da operação',
  'Profissionais de performance que querem construir um ecossistema de crescimento sustentável',
  'Empreendedores que sentem que o negócio está no teto e precisam destravar o próximo nível',
]

const proofPoints = [
  { number: '+250', label: 'gestores formados' },
  { number: '+14', label: 'anos de experiência' },
  { number: '+300', label: 'projetos liderados' },
  { number: 'R$350M+', label: 'em receita gerada' },
]

const brands = ['Danki', 'Liquido', 'GoPro', 'Shiseido', 'Motorola', 'NARS', 'TVZ', 'Eico', 'DaBelle', 'Universal Assistance']

function CTAButton({ className = '' }: { className?: string }) {
  return (
    <a
      href={PAYMENT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 bg-[#A100FF] hover:bg-[#8800DD] text-white font-bold rounded-full px-8 py-4 text-base transition-all duration-300 hover:shadow-[0_0_40px_rgba(161,0,255,0.6)] active:scale-95 ${className}`}
    >
      Quero acessar por {PRICE}
      <ArrowRight className="w-5 h-5" />
    </a>
  )
}

export default function EcomShiftInteractive() {
  const [stickyVisible, setStickyVisible] = useState(false)
  const finalCtaRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setStickyVisible(true)
        else setStickyVisible(false)
      },
      { threshold: 0 }
    )

    const finalObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStickyVisible(false)
      },
      { threshold: 0.3 }
    )

    if (heroRef.current) heroObserver.observe(heroRef.current)
    if (finalCtaRef.current) finalObserver.observe(finalCtaRef.current)

    return () => {
      heroObserver.disconnect()
      finalObserver.disconnect()
    }
  }, [])

  return (
    <>
      {/* Sticky CTA — floating bottom-right */}
      <AnimatePresence>
        {stickyVisible && (
          <m.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2"
          >
            <div className="bg-[#0A0A0A]/95 backdrop-blur-md border border-white/15 rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-white font-bold text-sm leading-none">ECOM Shift</p>
                <p className="text-[#A1A1AA] text-xs mt-0.5">{PRICE}</p>
              </div>
              <a
                href={PAYMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#A100FF] hover:bg-[#8800DD] text-white font-bold rounded-full px-5 py-2.5 text-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(161,0,255,0.5)] active:scale-95 whitespace-nowrap"
              >
                Quero acessar
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section ref={heroRef} className="relative bg-[#050505] pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#A100FF]/10 blur-[120px] rounded-full" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-6">
                <Image
                  src="/logo-ecomshift.png"
                  alt="ECOM Shift"
                  width={240}
                  height={240}
                  className="h-20 w-auto"
                  priority
                />
              </div>
              <p className="text-[#A100FF] font-bold uppercase tracking-widest text-sm mb-4">
                Treinamento intensivo
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] mb-6 text-white">
                Marketing que<br />
                <span className="text-[#A100FF]">vende de verdade.</span>
              </h1>
              <p className="text-lg text-[#A1A1AA] mb-8 leading-relaxed">
                O método Full Funnel que +250 gestores de marketing e e-commerce já usam para escalar marcas no digital. Do reconhecimento à fidelização — uma estratégia completa.
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <CTAButton />
                <div className="text-[#A1A1AA] text-sm">
                  <span className="line-through text-[#666]">R$ 197,00</span>
                  <span className="ml-2 text-white font-bold text-lg">{PRICE}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-[#A1A1AA]">
                {['Acesso imediato', 'Online e no seu ritmo', 'Método testado em +300 marcas'].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#A100FF]" />
                    {t}
                  </div>
                ))}
              </div>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10 max-w-sm mx-auto lg:mx-0 lg:ml-auto">
                <Image
                  src="/foto-flavio-ecomshift.webp"
                  alt="Flávio Beraldo — Professor do ECOM Shift"
                  width={480}
                  height={540}
                  className="w-full object-cover grayscale"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-bold text-lg">Flávio Beraldo</p>
                  <p className="text-[#A1A1AA] text-sm">Diretor de Marketing da Ciclo E-commerce · +14 anos</p>
                </div>
              </div>
            </m.div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="bg-[#0A0A0A] border-y border-white/5 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {proofPoints.map(({ number, label }, i) => (
              <m.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <p className="text-3xl sm:text-4xl font-black text-[#A100FF] mb-1">{number}</p>
                <p className="text-sm text-[#A1A1AA]">{label}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Whom */}
      <section className="bg-[#050505] py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#A100FF] font-bold uppercase tracking-widest text-sm mb-3">Para quem é</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Este treinamento foi feito para você?
            </h2>
          </m.div>
          <div className="grid sm:grid-cols-2 gap-4">
            {forWhom.map((item, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 bg-[#0D0D0D] rounded-xl border border-white/8 p-5 hover:border-[#A100FF]/30 transition-colors"
              >
                <CheckCircle2 className="w-5 h-5 text-[#A100FF] shrink-0 mt-0.5" />
                <p className="text-[#E0E0E0] text-sm leading-relaxed">{item}</p>
              </m.div>
            ))}
          </div>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <CTAButton />
          </m.div>
        </div>
      </section>

      {/* Video 1 — Event */}
      <section className="bg-[#080808] py-20 lg:py-28 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-[#A100FF] font-bold uppercase tracking-widest text-sm mb-3">Assista</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Veja como foi a <span className="text-[#A100FF]">primeira edição presencial</span>
            </h2>
            <p className="text-[#A1A1AA] mt-4 max-w-xl mx-auto">
              Mais de 250 gestores reunidos para aprender o método Full Funnel Marketing ao vivo.
            </p>
          </m.div>
          <m.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-white/10 aspect-video"
          >
            <YouTubeFacade videoId="oJBr4hIaW8k" title="ECOM Shift — Primeira Edição Presencial" />
          </m.div>
        </div>
      </section>

      {/* Modules */}
      <section className="bg-[#050505] py-20 lg:py-28 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#A100FF] font-bold uppercase tracking-widest text-sm mb-3">Conteúdo</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              O que você vai <span className="text-[#A100FF]">aprender</span>
            </h2>
            <p className="text-[#A1A1AA] mt-4 max-w-xl mx-auto">
              6 módulos que cobrem o método Full Funnel Marketing da captação à expansão.
            </p>
          </m.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod, i) => {
              const Icon = mod.icon
              return (
                <m.div
                  key={mod.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-[#0D0D0D] rounded-xl border border-white/8 p-6 hover:border-[#A100FF]/30 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-[#A100FF] uppercase tracking-widest">Módulo {mod.number}</span>
                    <Icon className="w-5 h-5 text-[#A100FF]/60 group-hover:text-[#A100FF] transition-colors" />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{mod.title}</h3>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">{mod.desc}</p>
                </m.div>
              )
            })}
          </div>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <CTAButton />
          </m.div>
        </div>
      </section>

      {/* Video 2 — Felipe's class */}
      <section className="bg-[#080808] py-20 lg:py-28 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-[#A100FF] font-bold uppercase tracking-widest text-sm mb-3">Aula aberta</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Como construir um{' '}
              <span className="text-[#A100FF]">ecossistema de aquisição</span>
            </h2>
            <p className="text-[#A1A1AA] mt-4 max-w-xl mx-auto">
              Felipe Beraldo, CEO da Ciclo E-commerce, explica o método completo de aquisição de clientes.
            </p>
          </m.div>
          <m.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-white/10 aspect-video"
          >
            <YouTubeFacade videoId="3Hxo0Y2PhAI" title="ECOM Shift — Como Construir um Ecossistema de Aquisição de Clientes com Felipe Beraldo"
              className="w-full h-full"
            />
          </m.div>
        </div>
      </section>

      {/* Mentor */}
      <section className="bg-[#050505] py-20 lg:py-28 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <m.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative max-w-xs mx-auto lg:mx-0"
            >
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/foto-flavio-ecomshift.webp"
                  alt="Flávio Beraldo"
                  width={400}
                  height={450}
                  className="w-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 to-transparent" />
              </div>
            </m.div>
            <m.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[#A100FF] font-bold uppercase tracking-widest text-sm mb-4">Seu professor</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Flávio Beraldo
              </h2>
              <p className="text-[#A1A1AA] leading-relaxed mb-6">
                Diretor de Marketing da Ciclo E-commerce com +14 anos de experiência no mercado digital. Já liderou mais de 300 projetos de marketing e e-commerce, gerando mais de R$350 milhões em receita para marcas nacionais e internacionais.
              </p>
              <p className="text-[#A1A1AA] leading-relaxed mb-8">
                Seu objetivo no ECOM Shift é direto: <strong className="text-white">fazer você vender mais e de forma inteligente.</strong> 100% voltado para marketing e vendas com método comprovado.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {brands.map((brand) => (
                  <span
                    key={brand}
                    className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-[#A1A1AA]"
                  >
                    {brand}
                  </span>
                ))}
              </div>
              <CTAButton />
            </m.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section ref={finalCtaRef} className="bg-[#080808] py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <Image
                src="/logo-ecomshift.png"
                alt="ECOM Shift"
                width={160}
                height={160}
                className="h-14 w-auto mx-auto"
              />
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
              Pronto para dominar o{' '}
              <span className="text-[#A100FF]">Full Funnel Marketing?</span>
            </h2>
            <p className="text-[#A1A1AA] text-lg mb-8 max-w-xl mx-auto">
              +250 gestores já transformaram suas operações. Por apenas {PRICE}, acesse o método completo que a Ciclo E-commerce usa com as maiores marcas do Brasil.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAButton className="text-lg px-10 py-5" />
            </div>
            <p className="text-[#666] text-sm mt-6">
              Acesso imediato · Método Full Funnel completo · Online, no seu ritmo
            </p>
          </m.div>
        </div>
      </section>
    </>
  )
}
