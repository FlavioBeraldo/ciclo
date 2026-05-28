'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Play, X, CheckCircle, Zap, Target, Repeat, BarChart3 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const metrics = [
  { value: '+9', label: 'anos de experiência' },
  { value: '+300', label: 'marcas atendidas' },
  { value: '+R$ 350MM', label: 'em receita gerada' },
  { value: '-35%', label: 'de CAC em média' },
]

const testimonials = [
  { id: 'EhnxUiDMMRg', brand: 'Mamô Brasil', role: 'CEO – Mamô Brasil' },
  { id: 'djykk9EFghg', brand: 'Líquido', role: 'CEO – Líquido' },
  { id: 'xVdqhprwKWw', brand: 'KVRA', role: 'Head de Marketing – KVRA' },
  { id: '6B2XYATbK3Q', brand: 'DANKI', role: 'Fundador – DANKI' },
]

const cycles = [
  {
    title: 'Geração de Demanda',
    icon: Zap,
    desc: 'Construímos desejo e relevância de marca por meio de conteúdo, criadores e canais de mídia que geram audiência qualificada antes da compra.',
    items: ['Conteúdo para redes sociais', 'TikTok Shop / Social Commerce', 'Gestão de Creators e Influenciadores', 'OOH Digital'],
  },
  {
    title: 'Captação de Demanda',
    icon: Target,
    desc: 'Convertemos interesse em primeira compra com anúncios de alta performance em todos os canais pagos — do Meta ao Retail Media.',
    items: ['Meta Ads / TikTok Ads', 'Google Ads / Bing Ads', 'Retail Media (Shopee, Amazon, Mercado)', 'Programática / Pinterest Ads'],
  },
  {
    title: 'Expansão de Demanda',
    icon: Repeat,
    desc: 'Aumentamos a frequência, o ticket médio e o LTV por meio de automações, CRM e programas de fidelização que geram receita recorrente.',
    items: ['CRM: E-mail, SMS, Push, WhatsApp', 'Réguas de automação', 'Reativação e fidelização', 'Programas de indicação'],
  },
  {
    title: 'Inteligência & Operação',
    icon: BarChart3,
    desc: 'Toda decisão é guiada por dados. Analytics, BI e playbooks operacionais garantem previsibilidade e consistência no crescimento.',
    items: ['Analytics & BI', 'Processos e Playbooks', 'Growth Contínuo'],
  },
]

const frameworkCycles = [
  {
    icon: Zap,
    cycle: 'Geração de Demanda',
    items: [
      'Análise dos Vetores de Crescimento',
      'Plano para Geração de Demanda',
      'Plano de Canais de Vendas',
      'Construção do Ecossistema do E-commerce',
    ],
  },
  {
    icon: Target,
    cycle: 'Captação de Demanda',
    items: [
      'Seleção de Plataforma',
      'Meios de Pagamento',
      'Plano para Mídias de Aquisição',
      'Parceiro Logístico',
    ],
  },
  {
    icon: Repeat,
    cycle: 'Expansão de Demanda',
    items: [
      'BP (Plano de Negócios)',
      'Sistema de Gestão (ERP)',
      'Análise de Custo',
      'Plano para Aumento da Recompra',
    ],
  },
]

const cases = [
  { brand: 'Mamô Brasil', category: 'Lifestyle', metrics: ['+200% Vendas YoY', '+57% LTV'] },
  { brand: 'GoPro Brasil', category: 'Esportes', metrics: ['+120% Vendas YoY', '-37% CAC'] },
  { brand: 'Jack Links', category: 'Alimentação', metrics: ['+57% Branded Search', '-46% CAC'] },
  { brand: 'Gringa', category: 'Fashion', metrics: ['+35% Recompra', '120→55 dias recência'] },
]

export default function ObrigadoInteractive() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  return (
    <main className="bg-[#050505] text-white">

      {/* HERO — obrigado */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[#A100FF]/10 blur-[140px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <m.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#A100FF]/20 mb-8">
              <CheckCircle className="w-10 h-10 text-[#A100FF]" />
            </div>
          </m.div>
          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-[#A100FF] text-sm font-bold uppercase tracking-widest mb-4">Mensagem recebida</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Obrigado pelo contato!
            </h1>
            <p className="text-[#A1A1AA] text-xl max-w-2xl mx-auto mb-10">
              Nossa equipe recebeu suas informações e entrará em contato em breve para entender melhor como podemos acelerar o seu e-commerce.
            </p>
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
              <span className="text-2xl">⏱</span>
              <p className="text-sm text-[#A1A1AA]">Tempo médio de resposta: <span className="text-white font-semibold">até 1 dia útil</span></p>
            </div>
          </m.div>
        </div>
      </section>

      {/* NÚMEROS */}
      <section className="py-16 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white/3 border border-white/8 rounded-2xl p-6 lg:p-10"
          >
            {metrics.map((m, i) => (
              <div key={m.label} className={`text-center ${i < metrics.length - 1 ? 'lg:border-r lg:border-white/10' : ''}`}>
                <p className="text-3xl sm:text-4xl font-bold text-[#A100FF] mb-1">{m.value}</p>
                <p className="text-xs text-[#A1A1AA] leading-tight">{m.label}</p>
              </div>
            ))}
          </m.div>
        </div>
      </section>

      {/* NOSSA HISTÓRIA */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-4">Nossa história</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                9 anos construindo<br />
                <span className="text-[#A100FF]">e-commerces de alta performance</span>
              </h2>
              <div className="space-y-4 text-[#A1A1AA] text-base leading-relaxed">
                <p>
                  A Ciclo nasceu da convicção de que <span className="text-white">crescimento sustentável em e-commerce exige uma visão completa do funil</span> — não apenas tráfego pago ou conteúdo isolado, mas uma estratégia integrada que conecta todos os pontos da jornada do consumidor.
                </p>
                <p>
                  Ao longo de 9 anos, desenvolvemos um método próprio que já foi aplicado em <span className="text-white">mais de 300 marcas</span> de diferentes segmentos — de moda e beleza a alimentos, esportes e eletrônicos. Cada operação nos ensinou algo novo, e todo esse conhecimento está consolidado na forma como trabalhamos hoje.
                </p>
                <p>
                  Não somos uma agência de mídia paga. Somos um <span className="text-white">parceiro estratégico de crescimento</span> que entende o seu negócio de ponta a ponta.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '2015', label: 'Fundação da Ciclo' },
                { value: '+300', label: 'Marcas atendidas' },
                { value: '+R$ 350MM', label: 'Receita gerada' },
                { value: '4', label: 'Pilares do método' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/3 border border-white/8 rounded-2xl p-6 text-center hover:border-[#A100FF]/30 transition-colors">
                  <p className="text-2xl font-bold text-[#A100FF] mb-1">{stat.value}</p>
                  <p className="text-xs text-[#A1A1AA]">{stat.label}</p>
                </div>
              ))}
            </div>
          </m.div>
        </div>
      </section>

      {/* NOSSA TESE */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-3">Nossa tese</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Full Funnel Marketing para e-commerce</h2>
            <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
              Crescimento sustentável não é só conversão. Uma marca precisa operar os três ciclos de forma constante e integrada.
            </p>
          </m.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {cycles.map((cycle, i) => {
              const Icon = cycle.icon
              return (
                <m.div
                  key={cycle.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-[#A100FF]/30 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#A100FF]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#A100FF]" />
                    </div>
                    <h3 className="font-bold text-white">{cycle.title}</h3>
                  </div>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed mb-4">{cycle.desc}</p>
                  <ul className="space-y-1.5">
                    {cycle.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                        <span className="w-1 h-1 rounded-full bg-[#A100FF] flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </m.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* MÉTODO DETALHADO */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-3">Nossa metodologia</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Framework de análise baseado nos 3 ciclos</h2>
            <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
              Cada pilar é analisado dentro do ciclo ao qual pertence, garantindo um diagnóstico completo e integrado.
            </p>
          </m.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {frameworkCycles.map((cycle, i) => {
              const Icon = cycle.icon
              return (
                <m.div
                  key={cycle.cycle}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-[#A100FF]/30 transition-all"
                >
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/8">
                    <div className="w-9 h-9 rounded-xl bg-[#A100FF]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#A100FF]" />
                    </div>
                    <h3 className="font-bold text-white text-sm leading-tight">{cycle.cycle}</h3>
                  </div>
                  <ul className="space-y-3">
                    {cycle.items.map((item, j) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="text-[#A100FF] font-bold text-xs flex-shrink-0 mt-0.5">
                          {String(i * 4 + j + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[#D4D4D8] text-sm leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </m.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CASES — métricas */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-3">Cases de sucesso</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Marcas que já transformamos</h2>
          </m.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cases.map((c, i) => (
              <m.div
                key={c.brand}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-[#A100FF]/30 transition-colors"
              >
                <p className="text-xs text-[#A100FF] font-medium uppercase tracking-wider mb-1">{c.category}</p>
                <h3 className="font-bold text-white mb-4">{c.brand}</h3>
                <div className="space-y-2">
                  {c.metrics.map((metric) => (
                    <div key={metric} className="bg-black/30 rounded-xl px-3 py-2">
                      <p className="text-sm font-bold text-white">{metric}</p>
                    </div>
                  ))}
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* VÍDEOS DE DEPOIMENTOS */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#A100FF] text-xs font-bold uppercase tracking-widest mb-3">Depoimentos</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Quem vive, recomenda</h2>
          </m.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((t, i) => (
              <m.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative rounded-2xl overflow-hidden cursor-pointer group border border-white/8 hover:border-[#A100FF]/40 transition-colors"
                onClick={() => setActiveVideo(t.id)}
              >
                <Image
                  src={`https://img.youtube.com/vi/${t.id}/hqdefault.jpg`}
                  alt={`Depoimento ${t.brand}`}
                  width={480}
                  height={270}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#A100FF] flex items-center justify-center shadow-[0_0_30px_rgba(161,0,255,0.6)] group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-bold text-white text-sm">{t.brand}</p>
                  <p className="text-xs text-[#A1A1AA]">{t.role}</p>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Enquanto aguarda,<br />
              <span className="text-[#A100FF]">explore nosso conteúdo</span>
            </h2>
            <p className="text-[#A1A1AA] text-lg mb-10">
              Acesse nosso blog com estratégias de e-commerce, ou acompanhe o Fator M — nosso podcast sobre marketing e crescimento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#A100FF] text-white font-semibold text-base hover:bg-[#8800DD] transition-colors"
              >
                Ler o blog
              </Link>
              <Link
                href="/#podcast"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-base hover:border-[#A100FF] hover:text-[#A100FF] transition-colors"
              >
                Ver o Fator M
              </Link>
            </div>
          </m.div>
        </div>
      </section>

      {/* Video modal */}
      <AnimatePresence>
        {activeVideo && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setActiveVideo(null)}
          >
            <m.div
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
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </main>
  )
}
