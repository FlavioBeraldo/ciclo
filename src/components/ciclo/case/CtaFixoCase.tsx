'use client'

import { useEffect, useState } from 'react'

// CTA fixo no rodapé das páginas de case, só abaixo de 1024px.
//
// Mesmo comportamento do botão fixo do /playbook-social-commerce — âncora para
// o formulário da própria página, fundo com leve desfoque e borda, respeito à
// safe-area — com duas regras a mais:
//  · some enquanto o formulário (#contato) está na tela;
//  · some enquanto qualquer campo está em foco, porque no celular é quando o
//    teclado está aberto e a barra ficaria por cima do campo.
//
// É só um link de âncora: não abre formulário nenhum e não dispara evento de
// conversão. O espaço que ele ocupa é reservado no CSS (`.case-page`).

export default function CtaFixoCase({ alvo = 'contato', texto }: { alvo?: string; texto: string }) {
  const [formVisivel, setFormVisivel] = useState(true)
  const [campoEmFoco, setCampoEmFoco] = useState(false)

  useEffect(() => {
    const form = document.getElementById(alvo)
    if (!form) return
    const observer = new IntersectionObserver(([entry]) => setFormVisivel(entry.isIntersecting), {
      threshold: 0.05,
    })
    observer.observe(form)

    const ehCampo = (el: EventTarget | null) =>
      el instanceof HTMLElement && el.matches('input, select, textarea, [contenteditable="true"]')
    const aoFocar = (e: FocusEvent) => {
      if (ehCampo(e.target)) setCampoEmFoco(true)
    }
    const aoDesfocar = () => {
      // O foco pode estar só mudando de um campo para o outro
      requestAnimationFrame(() => setCampoEmFoco(ehCampo(document.activeElement)))
    }
    document.addEventListener('focusin', aoFocar)
    document.addEventListener('focusout', aoDesfocar)

    return () => {
      observer.disconnect()
      document.removeEventListener('focusin', aoFocar)
      document.removeEventListener('focusout', aoDesfocar)
    }
  }, [alvo])

  const oculto = formVisivel || campoEmFoco

  return (
    <div className={`case-cta-fixo${oculto ? ' oculto' : ''}`} aria-hidden={oculto || undefined}>
      <a href={`#${alvo}`} tabIndex={oculto ? -1 : undefined}>
        {texto} <span aria-hidden="true">↓</span>
      </a>
    </div>
  )
}
