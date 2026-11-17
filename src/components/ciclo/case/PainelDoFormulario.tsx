'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

// Coluna do formulário nas páginas de case.
//
// O painel nunca rola por dentro. Ele acompanha a leitura (sticky) só quando
// cabe INTEIRO entre o cabeçalho e a borda de baixo da janela. Se não cabe —
// janela baixa, ou mensagens de validação que aumentaram o formulário —, a
// classe `sem-sticky` desliga o sticky e o formulário passa a rolar junto com
// a página, com todos os campos alcançáveis.
//
// Só lê medidas e troca uma classe: não toca no formulário nem nos eventos.

const FOLGA = 24 // 12px acima e 12px abaixo do painel

export default function PainelDoFormulario({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const [semSticky, setSemSticky] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const medir = () => {
      const header = document.querySelector<HTMLElement>('.ciclo2026 .header')
      const alturaHeader = header ? header.getBoundingClientRect().height : 84
      const disponivel = window.innerHeight - alturaHeader - FOLGA
      setSemSticky(el.offsetHeight > disponivel)
    }

    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(el)
    window.addEventListener('resize', medir)
    return () => {
      observador.disconnect()
      window.removeEventListener('resize', medir)
    }
  }, [])

  return (
    <aside ref={ref} className={`case-aside${semSticky ? ' sem-sticky' : ''}`}>
      {children}
    </aside>
  )
}
