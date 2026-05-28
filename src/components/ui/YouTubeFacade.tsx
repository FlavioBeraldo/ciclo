'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import Image from 'next/image'

interface Props {
  videoId: string
  title: string
  className?: string
}

export default function YouTubeFacade({ videoId, title, className = '' }: Props) {
  const [active, setActive] = useState(false)

  if (active) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={`w-full h-full ${className}`}
      />
    )
  }

  return (
    <button
      onClick={() => setActive(true)}
      aria-label={`Assistir: ${title}`}
      className={`group relative w-full h-full bg-black overflow-hidden ${className}`}
    >
      <Image
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt={title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#A100FF] flex items-center justify-center shadow-[0_0_40px_rgba(161,0,255,0.5)] group-hover:scale-110 transition-transform duration-300">
          <Play className="w-7 h-7 text-white fill-white ml-1" />
        </div>
      </div>
    </button>
  )
}
