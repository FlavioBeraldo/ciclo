'use client'

import { useState, useRef } from 'react'
import { m, useInView, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { CheckCircle } from 'lucide-react'
import PhoneField from '@/components/ui/PhoneField'

// ─── Form ─────────────────────────────────────────────────────────────────────

const formSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  company: z.string().optional(),
  storeUrl: z.string().optional(),
  message: z.string().optional(),
  lgpd: z.boolean().refine((v) => v === true, 'Aceite a política de privacidade para continuar'),
})
type FormData = z.infer<typeof formSchema>

const inputClass =
  'w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FE2C55] focus:ring-1 focus:ring-[#FE2C55] transition-all'
const errorClass = 'text-red-400 text-xs mt-1'

// ─── Animated conversion bars ─────────────────────────────────────────────────

function ConversionBars() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div ref={ref} className="space-y-4 mt-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[#D4D4D8]">TikTok Shop</span>
          <strong className="text-[#FE2C55] font-bold">40%</strong>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <m.div
            className="h-full rounded-full bg-gradient-to-r from-[#FE2C55] to-[#ff6b9d]"
            initial={{ width: '0%' }}
            animate={inView ? { width: '40%' } : { width: '0%' }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[#D4D4D8]">E-commerce Brasil (média)</span>
          <strong className="text-[#A1A1AA] font-bold">1,65%</strong>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <m.div
            className="h-full rounded-full bg-white/40"
            initial={{ width: '0%' }}
            animate={inView ? { width: '1.65%' } : { width: '0%' }}
            transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Main page content ────────────────────────────────────────────────────────

export default function TikTokShopContent() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) })

  const onSubmit = async (data: FormData) => {
    try {
      await fetch('/api/pipedrive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'Site/WhatsApp – TikTok Shop' }),
      })
    } catch {
      // Falha no Pipedrive não bloqueia o redirect
    }
    reset()
    window.location.href = '/obrigado'
  }

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative bg-[#010101] pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#FE2C55]/8 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#25F4EE]/5 blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 text-xs text-white/80 mb-8">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <polygon points="2,1 11,6 2,11" fill="currentColor" />
              </svg>
              TikTok Shop — Discovery Commerce
            </div>
          </m.div>

          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          >
            A era do{' '}
            <span className="bg-gradient-to-r from-[#FE2C55] via-[#ff6b9d] to-[#25F4EE] bg-clip-text text-transparent">
              Discovery Commerce
            </span>{' '}
            chegou.
            <br className="hidden sm:block" />
            Sua marca está pronta?
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#A1A1AA] text-lg max-w-2xl mx-auto mb-10"
          >
            A Ciclo E-commerce é o seu parceiro de Full Funnel Marketing no TikTok Shop —
            da configuração à escala, cuidamos de tudo para você vender mais.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <a
              href="#contato"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#FE2C55] text-white font-semibold text-base hover:bg-[#e6254c] transition-colors"
            >
              Quero acelerar minhas vendas
            </a>
            <a
              href="#ecossistema"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-base hover:border-white/40 hover:bg-white/5 transition-all"
            >
              Entender como funciona
            </a>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex flex-wrap items-center justify-center gap-8 sm:gap-12 bg-white/5 border border-white/10 rounded-2xl px-8 py-6"
          >
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-[#FE2C55]">40%</p>
              <p className="text-xs text-[#A1A1AA] mt-1">Taxa de conversão</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-white">R$ 1,2 bi</p>
              <p className="text-xs text-[#A1A1AA] mt-1">GMV em 2025</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-white">R$ 39 bi</p>
              <p className="text-xs text-[#A1A1AA] mt-1">Potencial até 2028</p>
            </div>
          </m.div>
        </div>
      </section>

      {/* ── ECOSSISTEMA ── */}
      <section id="ecossistema" className="py-20 lg:py-28 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-[#FE2C55] text-xs font-bold uppercase tracking-widest mb-3">
              Entenda o ecossistema
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              O TikTok é muito mais do que entretenimento
            </h2>
            <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
              Antes de falar sobre TikTok Shop, é importante conhecer os três pilares da plataforma.
            </p>
          </m.div>

          {/* 3 pillars */}
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {[
              {
                title: 'Plataforma de Entretenimento',
                desc: 'Bilhões de vídeos consumidos diariamente. O conteúdo é rei e gera descoberta orgânica de produtos.',
                icon: (
                  <svg viewBox="0 0 40 40" fill="none" width="40" height="40" aria-hidden="true">
                    <rect width="40" height="40" rx="10" fill="rgba(255,107,107,0.12)" />
                    <rect x="8" y="11" width="24" height="18" rx="3" stroke="#FF6B6B" strokeWidth="2" />
                    <polygon points="17,16 17,24 25,20" fill="#FF6B6B" />
                  </svg>
                ),
              },
              {
                title: 'Plataforma de Anúncios',
                desc: 'TikTok Ads com segmentação avançada e formatos nativos que se integram ao feed sem interromper a experiência.',
                icon: (
                  <svg viewBox="0 0 40 40" fill="none" width="40" height="40" aria-hidden="true">
                    <rect width="40" height="40" rx="10" fill="rgba(108,99,255,0.12)" />
                    <rect x="8" y="24" width="5" height="8" rx="1.5" fill="#6C63FF" />
                    <rect x="17" y="17" width="5" height="15" rx="1.5" fill="#6C63FF" />
                    <rect x="26" y="10" width="5" height="22" rx="1.5" fill="#6C63FF" />
                    <path d="M10.5 19 L19.5 12 L28.5 7" stroke="#6C63FF" strokeWidth="1.5" strokeDasharray="2 2" />
                  </svg>
                ),
              },
              {
                title: 'TikTok Shop',
                desc: 'O marketplace nativo dentro do app. Da descoberta à compra sem sair da plataforma — zero atrito.',
                icon: (
                  <svg viewBox="0 0 40 40" fill="none" width="40" height="40" aria-hidden="true">
                    <rect width="40" height="40" rx="10" fill="rgba(254,44,85,0.1)" />
                    <path d="M13 14h14l-2 10H15L13 14z" stroke="#FE2C55" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M11 11h3" stroke="#FE2C55" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="17" cy="27" r="1.5" fill="#FE2C55" />
                    <circle cx="24" cy="27" r="1.5" fill="#FE2C55" />
                    <path d="M17 18h6" stroke="#FE2C55" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ),
              },
            ].map((pillar, i) => (
              <m.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-[#FE2C55]/30 transition-all"
              >
                <div className="mb-4">{pillar.icon}</div>
                <h3 className="font-bold text-white text-lg mb-2">{pillar.title}</h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed">{pillar.desc}</p>
              </m.div>
            ))}
          </div>

          {/* Conversion differential */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <m.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[#FE2C55] text-xs font-bold uppercase tracking-widest mb-3">
                O que torna o TikTok Shop diferente?
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Conversão até{' '}
                <span className="bg-gradient-to-r from-[#FE2C55] via-[#ff6b9d] to-[#25F4EE] bg-clip-text text-transparent">
                  24x maior
                </span>{' '}
                que o e-commerce tradicional
              </h2>
              <p className="text-[#A1A1AA] text-base leading-relaxed mb-2">
                A taxa de conversão do TikTok Shop pode atingir{' '}
                <strong className="text-white">até 40%</strong>, enquanto o e-commerce brasileiro gira em
                torno de <strong className="text-white">1,65%</strong>. O segredo é a compra sem atrito: o
                usuário descobre, se interessa e compra sem sair do app.
              </p>
              <ConversionBars />
            </m.div>

            {/* Purchase journey */}
            <m.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <p className="text-[#FE2C55] text-xs font-bold uppercase tracking-widest mb-6 text-center">
                Processo de compra no TikTok Shop
              </p>
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                {[
                  { num: '01', label: 'Assiste ao vídeo', final: false },
                  { num: '02', label: 'Descobre o produto', final: false },
                  { num: '03', label: 'Adiciona ao carrinho', final: false },
                  { num: '04', label: null, final: true },
                ].map((step, i) => (
                  <div key={step.num}>
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          step.final
                            ? 'bg-[#FE2C55] text-white'
                            : 'bg-[#FE2C55]/15 text-[#FE2C55]'
                        }`}
                      >
                        {step.num}
                      </div>
                      <p className="text-white text-sm font-medium">
                        {step.final ? (
                          <>
                            Compra <strong>sem sair do app</strong>
                          </>
                        ) : (
                          step.label
                        )}
                      </p>
                    </div>
                    {i < 3 && <div className="ml-5 w-px h-5 bg-[#FE2C55]/20 mt-1 mb-1" />}
                  </div>
                ))}
              </div>
            </m.div>
          </div>
        </div>
      </section>

      {/* ── BIG NUMBERS ── */}
      <section id="numeros" className="py-20 lg:py-28 bg-[#010101] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#25F4EE]/5 blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-[#25F4EE] text-xs font-bold uppercase tracking-widest mb-3">
              Os números não mentem
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Big Numbers do TikTok Shop</h2>
            <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
              Os números que validam o TikTok Shop como meio de alavancar as vendas da sua marca.
            </p>
          </m.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <m.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="sm:col-span-2 bg-gradient-to-br from-[#FE2C55]/15 to-[#25F4EE]/10 border border-[#FE2C55]/20 rounded-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 opacity-40" aria-hidden="true">
                <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
                  <path
                    d="M6 30 L14 20 L20 25 L28 14 L34 10"
                    stroke="#25F4EE"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="34" cy="10" r="3" fill="#25F4EE" />
                </svg>
              </div>
              <p className="text-4xl sm:text-5xl font-bold text-white mb-2">R$ 1,2 bi</p>
              <p className="text-[#A1A1AA] text-base">GMV fechado em 2025 no Brasil</p>
            </m.div>

            {[
              {
                value: 'R$ 39 bi',
                label: 'Potencial movimentado até 2028',
                sub: 'Estudo Santander',
              },
              {
                value: '5% a 9%',
                label: 'Do e-commerce brasileiro nos primeiros 3 anos',
                sub: 'Projeção Santander',
              },
              {
                value: '40%',
                label: 'Taxa de conversão máxima (vs 1,65% do mercado)',
              },
            ].map((card, i) => (
              <m.div
                key={card.value}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i + 1) * 0.1 }}
                className="bg-white/5 border border-white/8 rounded-2xl p-6"
              >
                <p className="text-3xl sm:text-4xl font-bold text-white mb-2">{card.value}</p>
                <p className="text-[#A1A1AA] text-sm leading-relaxed">{card.label}</p>
                {card.sub && (
                  <p className="text-[#25F4EE] text-xs mt-2 font-medium">{card.sub}</p>
                )}
              </m.div>
            ))}
          </div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-[#25F4EE]/10 border border-[#25F4EE]/20 rounded-2xl p-6 flex gap-5 items-start"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#25F4EE]/15 flex items-center justify-center">
              <svg viewBox="0 0 36 36" fill="none" width="24" height="24" aria-hidden="true">
                <circle cx="18" cy="15" r="8" stroke="#25F4EE" strokeWidth="2" />
                <path
                  d="M15 23v3a3 3 0 006 0v-3"
                  stroke="#25F4EE"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M18 8V6M10 10l-1.5-1.5M26 10l1.5-1.5"
                  stroke="#25F4EE"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-1">
                A lógica do TikTok Shop é colaboração e criação de conteúdo
              </h3>
              <p className="text-[#A1A1AA] text-sm leading-relaxed">
                Creators autênticos geram confiança. Confiança gera conversão. E conversão gera escala
                para o seu negócio.
              </p>
            </div>
          </m.div>
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section id="roadmap" className="py-20 lg:py-28 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-[#FE2C55] text-xs font-bold uppercase tracking-widest mb-3">
              Como funciona na prática
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Roadmap do TikTok Shop</h2>
            <p className="text-[#A1A1AA] text-lg">
              Passo a passo para iniciar e escalar as vendas no TikTok Shop.
            </p>
          </m.div>

          <div>
            {[
              {
                num: '01',
                title: 'Cadastro e aprovação',
                desc: 'Fazemos o cadastro completo da sua marca e garantimos a aprovação no TikTok Shop.',
              },
              {
                num: '02',
                title: 'Produtos, ofertas e comissionamento',
                desc: 'Criamos e configuramos seus produtos, ofertas especiais e programa de comissionamento para criadores.',
              },
              {
                num: '03',
                title: 'Integração do catálogo',
                desc: 'Integramos o seu catálogo de produtos via integrador ou ERP de forma rápida e eficiente.',
              },
              {
                num: '04',
                title: 'Start & Ongoing',
                list: [
                  'Gestão de creators',
                  'Live Commerce',
                  'Participação em campanhas',
                  'Criação de conteúdo',
                  'GMV Ads',
                ],
                highlight: true,
              },
            ].map((step, i) => (
              <m.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="flex gap-6"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      step.highlight
                        ? 'bg-[#FE2C55] text-white'
                        : 'bg-[#FE2C55]/15 text-[#FE2C55] border border-[#FE2C55]/30'
                    }`}
                  >
                    {step.num}
                  </div>
                  {i < 3 && (
                    <div className="w-px flex-1 bg-[#FE2C55]/15 mt-2 mb-2 min-h-[40px]" />
                  )}
                </div>
                <div className="pb-8 flex-1">
                  <h3 className="font-bold text-white text-lg mb-2 mt-2">{step.title}</h3>
                  {step.desc && (
                    <p className="text-[#A1A1AA] text-sm leading-relaxed">{step.desc}</p>
                  )}
                  {step.list && (
                    <ul className="space-y-2">
                      {step.list.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FE2C55] flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVIÇOS ── */}
      <section id="servicos" className="py-20 lg:py-28 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-[#FE2C55] text-xs font-bold uppercase tracking-widest mb-3">
              O que a Ciclo entrega
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Como a Ciclo E-commerce pode ajudar sua marca no TikTok Shop?
            </h2>
            <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
              Uma solução completa, da configuração inicial à gestão e escala contínua.
            </p>
          </m.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Wide card */}
            <m.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-[#FE2C55]/30 hover:bg-[#FE2C55]/3 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FE2C55]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FE2C55]/20 transition-colors">
                  <svg viewBox="0 0 36 36" fill="none" width="24" height="24" aria-hidden="true">
                    <path
                      d="M12 18h12M18 12l6 6-6 6"
                      stroke="#FE2C55"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="11" cy="18" r="3" stroke="#FE2C55" strokeWidth="1.8" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-2">
                    Criação e Integração do TikTok Shop
                  </h3>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed mb-4">
                    Configuramos toda a estrutura da sua loja no TikTok Shop e integramos com os
                    principais conectores, ERPs e gerenciadores do mercado.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Conectores', 'ERPs', 'Gerenciadores'].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-[#FE2C55]/10 text-[#FE2C55] border border-[#FE2C55]/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </m.div>

            {[
              {
                icon: (
                  <svg viewBox="0 0 36 36" fill="none" width="24" height="24" aria-hidden="true">
                    <circle cx="13" cy="15" r="4" stroke="#FE2C55" strokeWidth="1.8" />
                    <circle cx="23" cy="15" r="4" stroke="#FE2C55" strokeWidth="1.8" />
                    <path
                      d="M7 27c0-3.3 2.7-6 6-6h10c3.3 0 6 2.7 6 6"
                      stroke="#FE2C55"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
                title: 'Campanhas com Creators',
                desc: 'Selecionamos creators com fit para o seu negócio, cocriamos as campanhas e monitoramos a performance em tempo real.',
                steps: [
                  'Seleção com fit para o negócio',
                  'Monitoramento de performance',
                  'Co-criação das campanhas',
                ],
              },
              {
                icon: (
                  <svg viewBox="0 0 36 36" fill="none" width="24" height="24" aria-hidden="true">
                    <path
                      d="M18 10v16M10 18h16"
                      stroke="#FE2C55"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="18" cy="18" r="9" stroke="#FE2C55" strokeWidth="1.8" />
                    <circle cx="10" cy="18" r="2.5" fill="#FE2C55" />
                    <circle cx="26" cy="18" r="2.5" fill="#FE2C55" />
                    <circle cx="18" cy="10" r="2.5" fill="#FE2C55" />
                    <circle cx="18" cy="26" r="2.5" fill="#FE2C55" />
                  </svg>
                ),
                title: 'Gestão de Programa de Afiliação',
                desc: 'Criamos o plano de afiliação com base nas estratégias do negócio e fazemos a gestão completa do programa.',
                steps: ['Plano estratégico de afiliação', 'Gestão contínua do programa'],
              },
              {
                icon: (
                  <svg viewBox="0 0 36 36" fill="none" width="24" height="24" aria-hidden="true">
                    <path
                      d="M11 11h14a2 2 0 012 2v10a2 2 0 01-2 2H11a2 2 0 01-2-2V13a2 2 0 012-2z"
                      stroke="#FE2C55"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M13 16h10M13 20h6"
                      stroke="#FE2C55"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M23 9v4M13 9v4"
                      stroke="#FE2C55"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
                title: 'Criação e Gestão de Promoções',
                desc: 'Desenvolvemos promoções e campanhas estratégicas para maximizar o GMV e a visibilidade dos seus produtos.',
                steps: ['Criação de promoções', 'Criação de campanhas'],
              },
              {
                icon: (
                  <svg viewBox="0 0 36 36" fill="none" width="24" height="24" aria-hidden="true">
                    <path
                      d="M8 18h4l3-7 5 14 3-7h5"
                      stroke="#FE2C55"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                title: 'Gestão de Anúncios GMV Max',
                desc: 'Anúncios para potencializar a divulgação dos seus produtos — similar a anunciar no Mercado Livre e Shopee, mas dentro do TikTok.',
                tags: ['GMV Max Ads', 'Otimização contínua'],
              },
            ].map((card, i) => (
              <m.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i + 1) * 0.08 }}
                className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-[#FE2C55]/30 hover:bg-[#FE2C55]/3 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FE2C55]/10 flex items-center justify-center mb-4 group-hover:bg-[#FE2C55]/20 transition-colors">
                  {card.icon}
                </div>
                <h3 className="font-bold text-white text-base mb-2">{card.title}</h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed mb-4">{card.desc}</p>
                {'steps' in card && card.steps && (
                  <ul className="space-y-1.5">
                    {card.steps.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                        <span className="w-1 h-1 rounded-full bg-[#FE2C55] flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
                {'tags' in card && card.tags && (
                  <div className="flex flex-wrap gap-2">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-[#FE2C55]/10 text-[#FE2C55] border border-[#FE2C55]/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 lg:py-28 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-[#FE2C55] text-xs font-bold uppercase tracking-widest mb-3">Dúvidas frequentes</p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Perguntas sobre gestão de{' '}
              <span className="bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] bg-clip-text text-transparent">
                TikTok Shop
              </span>
            </h2>
          </m.div>
          <div className="space-y-3">
            {[
              {
                q: 'O que é TikTok Shop e como funciona para e-commerces?',
                a: 'TikTok Shop é o canal de social commerce do TikTok que permite vender diretamente dentro da plataforma. Para e-commerces, funciona como uma loja integrada ao feed de conteúdo: os produtos aparecem em vídeos, lives e vitrine da marca, e o usuário compra sem sair do app. É o modelo de Discovery Commerce — a venda acontece antes que o consumidor perceba que estava comprando.',
              },
              {
                q: 'Quais marcas e e-commerces se beneficiam mais do TikTok Shop?',
                a: 'Marcas de beleza, moda, saúde, casa e alimentação têm os melhores resultados, especialmente as que vendem produtos com apelo visual ou que se beneficiam de demonstração em vídeo. E-commerces com ticket médio entre R$30 e R$300 e que já possuem presença digital tendem a escalar mais rápido.',
              },
              {
                q: 'A Ciclo E-commerce faz toda a gestão do TikTok Shop?',
                a: 'Sim. A Ciclo oferece gestão completa: setup e integração da loja, curadoria e gestão de creators e afiliados, criação de conteúdo otimizado para conversão, campanhas GMV Max, TikTok Ads e análise contínua de performance. A operação é gerenciada de ponta a ponta — seu time não precisa aprender a plataforma do zero.',
              },
              {
                q: 'Qual a diferença entre TikTok Ads e TikTok Shop?',
                a: 'TikTok Ads é a plataforma de mídia paga para anúncios. TikTok Shop é o canal de social commerce nativo onde os produtos são vendidos dentro do app via conteúdo orgânico, lives e creators. A maior potência está na combinação: TikTok Shop como canal de vendas e TikTok Ads (especialmente GMV Max) para escalar o volume de pedidos.',
              },
              {
                q: 'Como funciona a gestão de creators e afiliados no TikTok Shop?',
                a: 'A Ciclo identifica creators alinhados ao seu nicho via TikTok Creator Marketplace, negocia parcerias, orienta a criação de conteúdo e acompanha a performance de cada creator. Para afiliados, estruturamos o programa de comissões, recrutamos os criadores certos e gerenciamos o relacionamento contínuo.',
              },
              {
                q: 'Quanto tempo leva para ter resultados no TikTok Shop?',
                a: 'Os primeiros resultados aparecem nas primeiras 4 a 8 semanas — fase de setup, integração e onboarding de creators. A escala consistente costuma acontecer entre 2 e 4 meses, quando já há dados suficientes de creators, produtos e formatos para otimizar a operação.',
              },
            ].map(({ q, a }, i) => (
              <m.details
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-[#FE2C55]/30 transition-colors"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none select-none">
                  <span className="font-semibold text-white text-sm sm:text-base">{q}</span>
                  <span className="w-6 h-6 rounded-full bg-[#FE2C55]/10 flex items-center justify-center flex-shrink-0 text-[#FE2C55] group-open:rotate-45 transition-transform duration-200 text-lg leading-none">+</span>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">{a}</p>
                </div>
              </m.details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-[#1a0008] via-[#010101] to-[#001a18] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#FE2C55]/15 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-[#25F4EE]/10 blur-[80px]" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 text-xs text-white/80 mb-6">
              <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
                <path
                  d="M8 1l1.8 4.2L14 6l-3 3 .7 4.2L8 11l-3.7 2.2.7-4.2L2 6l4.2-.8z"
                  fill="currentColor"
                />
              </svg>
              Pronto para começar?
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Acelere suas vendas no TikTok Shop{' '}
              <span className="bg-gradient-to-r from-[#FE2C55] via-[#ff6b9d] to-[#25F4EE] bg-clip-text text-transparent">
                agora mesmo
              </span>
            </h2>
            <p className="text-[#A1A1AA] text-lg mb-8">
              Fale com nossos especialistas e descubra como a Ciclo E-commerce pode transformar o TikTok
              Shop em um canal de vendas previsível para a sua marca.
            </p>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#FE2C55] text-white font-semibold text-base hover:bg-[#e6254c] transition-colors"
            >
              Quero uma proposta
            </a>
          </m.div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section id="contato" className="py-20 lg:py-28 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#FE2C55]/5 blur-[100px]" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-[#FE2C55] text-xs font-bold uppercase tracking-widest mb-3">
              Vamos conversar
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Fale com a gente</h2>
            <p className="text-[#A1A1AA] text-lg">
              Preencha o formulário e nossa equipe entra em contato para entender como podemos acelerar
              suas vendas no TikTok Shop.
            </p>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/3 border border-white/8 rounded-2xl p-8"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <m.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 py-8 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#FE2C55]/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-[#FE2C55]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Mensagem enviada!</h3>
                  <p className="text-[#A1A1AA]">Entraremos em contato em breve.</p>
                </m.div>
              ) : (
                <m.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-[#A1A1AA] mb-1.5">Nome</label>
                      <input
                        {...register('name')}
                        placeholder="Seu nome completo"
                        className={inputClass}
                        aria-label="Nome"
                      />
                      {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-[#A1A1AA] mb-1.5">E-mail</label>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="seu@email.com"
                        className={inputClass}
                        aria-label="E-mail"
                      />
                      {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                    </div>
                    <div>
                      <PhoneField
                        name="phone"
                        control={control}
                        label="WhatsApp"
                        error={errors.phone?.message}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#A1A1AA] mb-1.5">Empresa</label>
                      <input
                        {...register('company')}
                        placeholder="Nome da sua empresa"
                        className={inputClass}
                        aria-label="Empresa"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#A1A1AA] mb-1.5">URL da loja</label>
                    <input
                      {...register('storeUrl')}
                      
                      placeholder="sualoja.com.br"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#A1A1AA] mb-1.5">
                      Como podemos ajudar?
                    </label>
                    <textarea
                      {...register('message')}
                      rows={4}
                      placeholder="Conte um pouco sobre seu negócio e o que você precisa..."
                      className={`${inputClass} resize-none`}
                      aria-label="Mensagem"
                    />
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer mb-4">
                    <input type="checkbox" {...register('lgpd')} className="mt-0.5 w-4 h-4 flex-shrink-0 accent-[#FE2C55]" />
                    <span className="text-xs text-[#A1A1AA] leading-relaxed">
                      Li e aceito a{' '}
                      <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="text-[#FE2C55] underline hover:text-[#e6254c]">
                        Política de Privacidade
                      </a>
                      {' '}e autorizo o uso dos meus dados para contato comercial.
                    </span>
                  </label>
                  {errors.lgpd && <p className="text-red-400 text-xs mb-3">{errors.lgpd.message as string}</p>}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#FE2C55] text-white font-semibold text-base hover:bg-[#e6254c] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
                  </button>
                </m.form>
              )}
            </AnimatePresence>
          </m.div>
        </div>
      </section>
    </>
  )
}
