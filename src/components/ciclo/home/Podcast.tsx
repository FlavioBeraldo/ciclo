'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { YouTubeVideo } from '@/lib/youtube'
import { FALLBACK_VIDEOS } from '@/lib/youtube'

// O Fator M na home. Mesma busca de sempre: a lista chega de /api/youtube/latest
// e o fallback local cobre a primeira pintura e qualquer falha da API.

export default function Podcast() {
  const [videos, setVideos] = useState<YouTubeVideo[]>(FALLBACK_VIDEOS)

  useEffect(() => {
    fetch('/api/youtube/latest')
      .then((r) => r.json())
      .then((data: YouTubeVideo[]) => {
        if (data?.length) setVideos(data)
      })
      .catch(() => {})
  }, [])

  return (
    <section className="section podcast" id="podcast">
      <div className="wrap">
        <div className="eyebrow">
          <span />O podcast da Ciclo
        </div>

        <div className="podcast-heading">
          <div>
            <h2>O Fator M.</h2>
            <div className="podcast-tagline">Conteúdo que gera crescimento de verdade.</div>
          </div>

          <div>
            <p>
              No nosso podcast, especialistas e líderes do mercado compartilham estratégias
              práticas para escalar marcas no digital.
            </p>

            <a
              className="button"
              href="https://www.youtube.com/@ofatorm?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Descubra o Fator M</span>
              <b aria-hidden="true">↗</b>
            </a>
          </div>
        </div>

        <div className="episodes">
          {videos.slice(0, 6).map((v) => (
            <a
              className="episode"
              key={v.id}
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="episode-picture">
                <Image src={v.thumbnail} alt={v.title} width={480} height={270} loading="lazy" />
                <span className="play" aria-hidden="true">
                  ▶
                </span>
              </div>
              <small>O FATOR M · ASSISTA AO EPISÓDIO ↗</small>
              <h3>{v.title}</h3>
            </a>
          ))}
        </div>

        <div className="training">
          <div>
            <h3>ECOM Shift</h3>
            <p>Aprenda nosso método.</p>
          </div>

          <Link className="button" href="/ecomshift">
            <span>Conheça o treinamento</span>
            <b aria-hidden="true">↗</b>
          </Link>
        </div>
      </div>
    </section>
  )
}
