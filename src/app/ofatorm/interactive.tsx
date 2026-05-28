'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { m, AnimatePresence } from 'framer-motion'
import { Play, MonitorPlay, Headphones, Camera, BookOpen, ExternalLink } from 'lucide-react'
import Button from '@/components/ui/Button'
import type { YouTubeVideo } from '@/lib/youtube'
import { FALLBACK_VIDEOS } from '@/lib/youtube'

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: '+250', label: 'Episódios' },
  { value: '11k', label: 'Seguidores Spotify' },
  { value: '74k', label: 'Views/mês Instagram' },
  { value: '60k', label: 'Views/mês TikTok' },
]

const platforms = [
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@ofatorm',
    icon: MonitorPlay,
    color: 'hover:text-red-500',
    label: 'Assista no YouTube',
  },
  {
    name: 'Spotify',
    href: 'https://open.spotify.com/show/6QIXPnTNJeiNSOzyNPDl7H',
    icon: Headphones,
    color: 'hover:text-green-400',
    label: 'Ouça no Spotify',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/ofatorm',
    icon: Camera,
    color: 'hover:text-pink-400',
    label: 'Siga no Instagram',
  },
  {
    name: 'Newsletter',
    href: 'https://ofatorm.substack.com/',
    icon: BookOpen,
    color: 'hover:text-orange-400',
    label: 'Newsletter no Substack',
  },
]

const presenters = [
  {
    name: 'Felipe Beraldo',
    role: 'Sócio e CEO',
    company: 'Ciclo E-commerce',
    photo: '/foto-felipe-beraldo.webp',
    bio: 'Empreendedor serial e especialista em crescimento de e-commerce. Lidera a Ciclo E-commerce na missão de escalar marcas com estratégia e dados.',
  },
  {
    name: 'Alan Rocumback',
    role: 'Sócio e COO',
    company: 'Ciclo E-commerce',
    photo: '/foto-alan-rocumback.webp',
    bio: 'Especialista em operações e escala de negócios digitais. Co-fundador da Ciclo E-commerce, responsável por estruturar processos que transformam resultados.',
  },
  {
    name: 'Flávio Beraldo',
    role: 'Sócio e Diretor de Marketing',
    company: 'Ciclo E-commerce',
    photo: '/foto-flavio-beraldo.webp',
    bio: 'Estrategista de marketing com foco em Full Funnel para e-commerce. Conecta marca, dados e criatividade para gerar crescimento previsível.',
  },
]

const studioPhotos = [
  { src: '/studio-ofatorm-1.webp', alt: 'Bastidores do O Fator M — apresentadores com convidados antes da gravação' },
  { src: '/studio-ofatorm-2.webp', alt: 'Mesa de operação do estúdio O Fator M com switcher e mixer de áudio profissional' },
  { src: '/studio-ofatorm-3.webp', alt: 'Bastidores — Felipe Beraldo sendo fotografado no estúdio O Fator M' },
  { src: '/studio-ofatorm-4.webp', alt: 'Bastidores — gravação de episódio do O Fator M com convidado' },
]

// ─── Featured episode card ─────────────────────────────────────────────────────

function FeaturedEpisode({ video }: { video: YouTubeVideo }) {
  const date = new Date(video.publishedAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <m.a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative block rounded-2xl overflow-hidden border border-white/10 hover:border-[#A100FF]/50 transition-colors"
    >
      <div className="relative aspect-video">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#A100FF]/80 flex items-center justify-center backdrop-blur-sm group-hover:bg-[#A100FF] group-hover:scale-110 transition-all duration-300">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
        </div>
        {/* Latest badge */}
        <div className="absolute top-4 left-4">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-[#A100FF] text-white px-2.5 py-1 rounded-full">
            Último episódio
          </span>
        </div>
      </div>
      <div className="p-5 bg-white/3">
        <p className="text-xs text-[#71717A] mb-2">{date}</p>
        <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-[#A100FF] transition-colors">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-sm text-[#A1A1AA] mt-2 line-clamp-2">{video.description}</p>
        )}
        <div className="flex items-center gap-1.5 mt-4 text-[#A100FF] text-sm font-semibold">
          <Play className="w-3.5 h-3.5 fill-[#A100FF]" />
          <span>Assistir episódio</span>
        </div>
      </div>
    </m.a>
  )
}

// ─── Episode grid card ─────────────────────────────────────────────────────────

function EpisodeCard({ video, index }: { video: YouTubeVideo; index: number }) {
  return (
    <m.a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="group relative block rounded-xl overflow-hidden border border-white/8 hover:border-[#A100FF]/40 transition-colors"
    >
      <div className="relative aspect-video">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-[#A100FF] flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="text-xs font-medium text-white line-clamp-2 group-hover:text-[#A100FF] transition-colors">
          {video.title}
        </p>
      </div>
    </m.a>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function OFatorMInteractive() {
  const [videos, setVideos] = useState<YouTubeVideo[]>(FALLBACK_VIDEOS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/youtube/latest')
      .then((r) => r.json())
      .then((data: YouTubeVideo[]) => {
        if (Array.isArray(data) && data.length > 0) setVideos(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const featured = videos[0]
  const grid = videos.slice(1, 7)

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#050505] pt-32 pb-20">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-[#A100FF]/8 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] rounded-full bg-[#3D3D3D]/20 blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo */}
            <m.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <Image
                src="/logo-ofatorm-white.png"
                alt="O Fator M"
                width={280}
                height={113}
                className="h-16 sm:h-20 w-auto"
                priority
              />
            </m.div>

            {/* por Ciclo */}
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-xs font-bold uppercase tracking-widest text-[#A100FF] mb-6"
            >
              por Ciclo E-commerce
            </m.p>

            {/* Tagline */}
            <m.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
            >
              Aqui você descobre o lado{' '}
              <span className="text-[#A100FF]">marqueteiro</span>{' '}
              das pessoas e dos negócios.
            </m.h1>

            <m.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-[#A1A1AA] text-lg mb-10"
            >
              Insights, tendências e estratégias de marketing e vendas com os maiores líderes do mercado digital brasileiro.
            </m.p>

            {/* Platform links */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-3 mb-12"
            >
              {platforms.map((p) => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={p.label}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-[#D4D4D8] text-sm font-medium transition-all hover:bg-white/10 hover:border-white/20 ${p.color}`}
                >
                  <p.icon className="w-4 h-4" />
                  {p.name}
                </a>
              ))}
            </m.div>

            {/* Stats */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-white/3 border border-white/8 rounded-2xl p-4 text-center"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-[#71717A] mt-1">{s.label}</p>
                </div>
              ))}
            </m.div>
          </div>
        </div>
      </section>

      {/* ── Spotify embed ───────────────────────────────────────────────────── */}
      <section className="bg-[#080808] py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <iframe
              style={{ borderRadius: '16px' }}
              src="https://open.spotify.com/embed/show/6QlXPnTNJeiNSOzyNPDI7H?utm_source=generator&theme=0"
              width="100%"
              height="232"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="O Fator M no Spotify"
            />
          </m.div>
        </div>
      </section>

      {/* ── Episodes ────────────────────────────────────────────────────────── */}
      <section id="episodios" className="bg-[#080808] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-3">
              Playlist
            </p>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Últimos episódios
              </h2>
              <a
                href="https://www.youtube.com/@ofatorm/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[#A100FF] font-semibold hover:text-[#C040FF] transition-colors"
              >
                Ver todos <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </m.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <m.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid lg:grid-cols-[3fr_2fr] gap-6"
              >
                <div className="rounded-2xl bg-white/5 aspect-video animate-pulse" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-xl bg-white/5 aspect-video animate-pulse" />
                  ))}
                </div>
              </m.div>
            ) : (
              <m.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid lg:grid-cols-[3fr_2fr] gap-6"
              >
                {/* Featured latest episode */}
                {featured && <FeaturedEpisode video={featured} />}

                {/* Side grid */}
                <div className="grid sm:grid-cols-2 gap-4 content-start">
                  {grid.slice(0, 4).map((video, i) => (
                    <EpisodeCard key={video.id} video={video} index={i} />
                  ))}
                </div>
              </m.div>
            )}
          </AnimatePresence>

          {/* Second row of episodes */}
          {!loading && grid.length > 4 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {grid.slice(4).map((video, i) => (
                <EpisodeCard key={video.id} video={video} index={i + 4} />
              ))}
            </div>
          )}

          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Button
              href="https://www.youtube.com/@ofatorm/videos"
              target="_blank"
              rel="noopener noreferrer"
              arrow
              size="lg"
            >
              Ver todos os episódios
            </Button>
          </m.div>
        </div>
      </section>

      {/* ── Presenters ──────────────────────────────────────────────────────── */}
      <section id="apresentadores" className="bg-[#050505] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-3">
              Quem apresenta
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Os apresentadores
            </h2>
            <p className="text-[#A1A1AA] mt-3 max-w-xl mx-auto">
              Líderes da Ciclo E-commerce que trazem visão estratégica, operacional e de marketing para cada episódio.
            </p>
          </m.div>

          {/* Group photos */}
          <div className="grid sm:grid-cols-2 gap-4 mb-12 max-w-4xl mx-auto">
            {[
              { src: '/foto-criadores.webp', alt: 'Os apresentadores do O Fator M gravando episódio no estúdio' },
              { src: '/foto-criadores-2.webp', alt: 'Felipe Beraldo, Alan Rocumback e Flávio Beraldo — apresentadores do O Fator M' },
            ].map((img, i) => (
              <m.div
                key={img.src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative rounded-2xl overflow-hidden aspect-[4/3]"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </m.div>
            ))}
          </div>

          {/* Individual presenter cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {presenters.map((presenter, i) => (
              <m.div
                key={presenter.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden group"
              >
                {/* Photo */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={presenter.photo}
                    alt={presenter.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-bold text-white text-lg">{presenter.name}</h3>
                  <p className="text-[#A100FF] text-sm font-medium mt-0.5">{presenter.role}</p>
                  <p className="text-[#71717A] text-xs mt-0.5">{presenter.company}</p>
                  <p className="text-[#A1A1AA] text-sm mt-3 leading-relaxed">{presenter.bio}</p>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Behind the scenes ───────────────────────────────────────────────── */}
      <section id="bastidores" className="bg-[#080808] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-xs font-bold text-[#A100FF] uppercase tracking-widest mb-3">
              Nossa história
            </p>
            <div className="grid lg:grid-cols-2 gap-8 items-end">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Bastidores do O Fator M
                </h2>
              </div>
              <p className="text-[#A1A1AA] leading-relaxed">
                Nascido dentro da Ciclo E-commerce, o O Fator M se tornou um dos podcasts de referência em marketing e e-commerce do Brasil. Com um estúdio profissional em São Paulo e convidados como gestores da Nestlé, Shiseido, Suvinil e Faber Castell, cada episódio traz a visão de quem está no campo de batalha do mercado digital.
              </p>
            </div>
          </m.div>

          {/* Photo grid — 4 photos: top row wide + square, bottom row square + wide */}
          <div className="grid grid-cols-2 gap-3">
            {/* Row 1: photo 1 (landscape, 3 cols) + photo 2 (portrait, 1 col) */}
            <m.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="relative overflow-hidden rounded-xl col-span-2 lg:col-span-1"
            >
              <div className="relative aspect-[16/10]">
                <Image src={studioPhotos[0].src} alt={studioPhotos[0].alt} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 1024px) 100vw, 50vw" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
            </m.div>
            <m.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.07 }}
              className="relative overflow-hidden rounded-xl col-span-2 lg:col-span-1"
            >
              <div className="relative aspect-[16/10]">
                <Image src={studioPhotos[1].src} alt={studioPhotos[1].alt} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 1024px) 100vw, 50vw" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
            </m.div>
            {/* Row 2: photo 3 + photo 4 */}
            <m.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              className="relative overflow-hidden rounded-xl"
            >
              <div className="relative aspect-[4/3]">
                <Image src={studioPhotos[2].src} alt={studioPhotos[2].alt} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 640px) 50vw, 33vw" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
            </m.div>
            <m.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.21 }}
              className="relative overflow-hidden rounded-xl"
            >
              <div className="relative aspect-[4/3]">
                <Image src={studioPhotos[3].src} alt={studioPhotos[3].alt} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 640px) 50vw, 33vw" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
            </m.div>
          </div>

          {/* Content formats */}
          <div className="grid sm:grid-cols-2 gap-6 mt-12">
            <m.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/3 border border-white/8 rounded-2xl p-6"
            >
              <div className="w-10 h-10 rounded-xl bg-[#A100FF]/15 flex items-center justify-center mb-4">
                <span className="text-[#A100FF] font-bold text-lg">M</span>
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Visão Estratégica</h3>
              <p className="text-[#A1A1AA] text-sm leading-relaxed">
                Entrevistas com Diretores e Gestores de grandes marcas. Compartilhamos os bastidores das estratégias que movem o mercado — o que funciona, o que não funciona e o que está por vir.
              </p>
            </m.div>
            <m.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/3 border border-white/8 rounded-2xl p-6"
            >
              <div className="w-10 h-10 rounded-xl bg-[#A100FF]/15 flex items-center justify-center mb-4">
                <span className="text-[#A100FF] font-bold text-lg">M</span>
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Por Trás da Marca</h3>
              <p className="text-[#A1A1AA] text-sm leading-relaxed">
                Fundadores e empreendedores revelam os bastidores dos seus negócios. As histórias reais de quem construiu marcas do zero e transformou desafios em crescimento.
              </p>
            </m.div>
          </div>
        </div>
      </section>

      {/* ── CTA / Subscribe ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#050505] py-20 lg:py-28">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-[#A100FF]/8 via-transparent to-[#A100FF]/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-[#A100FF]/10 blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Image
              src="/logo-ofatorm-white.png"
              alt="O Fator M"
              width={180}
              height={72}
              className="h-10 w-auto mx-auto mb-6"
              loading="lazy"
            />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Siga e nunca perca um episódio
            </h2>
            <p className="text-[#A1A1AA] text-lg mb-10 max-w-xl mx-auto">
              Acompanhe O Fator M na plataforma que preferir e receba novos episódios toda semana.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10">
              {platforms.map((p, i) => (
                <m.a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex flex-col items-center gap-2.5 px-4 py-5 rounded-2xl border border-white/10 bg-white/3 text-[#D4D4D8] font-medium transition-all hover:bg-white/8 hover:border-white/20 hover:scale-105 ${p.color}`}
                >
                  <p.icon className="w-6 h-6" />
                  <span className="text-sm">{p.name}</span>
                </m.a>
              ))}
            </div>

            <div className="border-t border-white/8 pt-10">
              <p className="text-sm text-[#71717A] mb-4">
                Quer transformar o marketing do seu e-commerce?
              </p>
              <Button href="/#contato" arrow size="lg">
                Fale com a Ciclo E-commerce
              </Button>
            </div>
          </m.div>
        </div>
      </section>
    </>
  )
}
