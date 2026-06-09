'use client'

import { m } from 'framer-motion'
import { Play } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Button from './ui/Button'
import Section from './ui/Section'
import type { YouTubeVideo } from '@/lib/youtube'
import { FALLBACK_VIDEOS } from '@/lib/youtube'

export default function PodcastSection() {
  const [videos, setVideos] = useState<YouTubeVideo[]>(FALLBACK_VIDEOS)

  useEffect(() => {
    fetch('/api/youtube/latest')
      .then((r) => r.json())
      .then((data: YouTubeVideo[]) => { if (data?.length) setVideos(data) })
      .catch(() => {})
  }, [])

  return (
    <Section id="podcast" className="bg-[#080808] py-20 lg:py-32">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-[#A100FF]/6 blur-[80px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[320px_1fr] gap-12 items-start">
          {/* Left */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Conteúdo que gera{' '}
              <span className="text-[#A100FF]">crescimento de verdade.</span>
            </h2>
            <p className="text-[#A1A1AA] mb-8">
              No nosso podcast, especialistas e líderes do mercado compartilham estratégias práticas para escalar marcas no digital.
            </p>
            <Button href="https://www.youtube.com/@ofatorm?sub_confirmation=1" target="_blank" rel="noopener noreferrer" arrow>
              Descubra o Fator M
            </Button>
          </m.div>

          {/* Right - video cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.slice(0, 6).map((video, i) => (
              <m.a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="group relative rounded-xl overflow-hidden border border-white/8 hover:border-[#A100FF]/40 transition-colors block"
                aria-label={`Assistir: ${video.title}`}
              >
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={480}
                  height={270}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-[#A100FF] flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs text-white font-medium line-clamp-2">{video.title}</p>
                </div>
              </m.a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
