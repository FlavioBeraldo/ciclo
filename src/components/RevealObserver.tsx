'use client'

import { useEffect } from 'react'

// Observa elementos .reveal e adiciona .in-view quando entram na viewport,
// replicando o whileInView/viewport={{once:true}} do framer-motion com CSS
// puro (ver globals.css). Também cobre elementos adicionados depois do mount
// (ex.: vídeos do PodcastSection carregados via fetch).
export default function RevealObserver() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    document.documentElement.classList.add('reveal-on')

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in-view')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    )

    const observe = (root: ParentNode) =>
      root.querySelectorAll('.reveal:not(.in-view)').forEach((el) => io.observe(el))

    observe(document)

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n instanceof Element) {
            if (n.classList?.contains('reveal')) io.observe(n)
            observe(n)
          }
        })
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
      document.documentElement.classList.remove('reveal-on')
    }
  }, [])

  return null
}
