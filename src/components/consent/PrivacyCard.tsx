'use client'

import { useEffect, useRef, useState } from 'react'
import { LockKeyhole, SlidersHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { choiceCookie, choiceLifetime, decodeChoice, encodeChoice, googleChoices, necessaryOnly, policyVersion, type Choice } from '@/lib/privacy-choice'
import styles from './PrivacyCard.module.css'

function currentChoice() {
  return decodeChoice(document.cookie.split('; ').find(pair => pair.startsWith(choiceCookie + '='))?.slice(choiceCookie.length + 1))
}

function applyChoice(choice: Choice) {
  const w = window as Window & { cicloPerfilPermissoes?: () => object; dataLayer?: unknown[] }
  w.cicloPerfilPermissoes = () => ({ marketing: choice.marketing, ...googleChoices(choice) })
  w.dataLayer ||= []
  // Somente a prévia consome o contrato. A integração global do GTM tem publicação própria.
  w.dataLayer.push({ event: choice.marketing ? 'pa_pagina_autorizada' : 'pa_consentimento_revogado', ...googleChoices(choice) })
  if (!choice.marketing) {
    for (const name of ['ciclo_perfil', 'ciclo_perfil_origem']) document.cookie = name + '=; Path=/; Max-Age=0; Secure; SameSite=Lax'
    try { localStorage.removeItem('ciclo_pa_sessao_v1') } catch {}
  }
}

function persist(choice: Choice) {
  document.cookie = choiceCookie + '=' + encodeChoice(choice) + '; Path=/; SameSite=Lax; Secure; Max-Age=' + choiceLifetime
  applyChoice(choice)
  try { localStorage.setItem('ciclo_privacidade_atualizada', crypto.randomUUID()) } catch {}
}

export default function PrivacyCard() {
  const pathname = usePathname()
  const [view, setView] = useState<'summary' | 'settings' | 'hidden'>('hidden')
  const [draft, setDraft] = useState<Choice>(necessaryOnly)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const footer = useRef<HTMLButtonElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const focusAfterOpen = useRef(false)
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    function sync() {
      const choice = currentChoice()
      applyChoice(choice || necessaryOnly)
      setDraft(choice || necessaryOnly)
      setView(choice ? 'hidden' : 'summary')
    }
    sync()
    function onStorage(event: StorageEvent) {
      if (event.key === 'ciclo_privacidade_atualizada') sync()
    }
    function onRestore(event: PageTransitionEvent) { if (event.persisted) sync() }
    window.addEventListener('storage', onStorage)
    window.addEventListener('pageshow', onRestore)
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('pageshow', onRestore) }
  }, [])
  useEffect(() => {
    if (lastPath.current && lastPath.current !== pathname) applyChoice(currentChoice() || necessaryOnly)
    lastPath.current = pathname
  }, [pathname])
  useEffect(() => {
    if (focusAfterOpen.current) { heading.current?.focus(); focusAfterOpen.current = false }
  }, [view])

  function settings() {
    opener.current = document.activeElement as HTMLElement
    focusAfterOpen.current = true
    setError('')
    setDraft(currentChoice() || necessaryOnly)
    setView('settings')
  }
  function back() {
    if (pending) return
    setView(currentChoice() ? 'hidden' : 'summary')
    requestAnimationFrame(() => {
      if (opener.current?.isConnected) opener.current.focus()
      else footer.current?.focus({ preventScroll: true })
    })
  }
  async function save(choice: Choice) {
    if (pending) return
    setPending(true)
    setError('')
    const previous = currentChoice() || necessaryOnly
    // Uma retirada vale imediatamente, inclusive durante indisponibilidade do servidor.
    if ((previous.analytics && !choice.analytics) || (previous.marketing && !choice.marketing)) {
      persist({ analytics: previous.analytics && choice.analytics, marketing: previous.marketing && choice.marketing })
    }
    try {
      const res = await fetch('/api/privacidade/preferencias', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(8000), body: JSON.stringify({ ...choice, version: policyVersion }) })
      if (!res.ok) throw Error()
      persist(choice)
      setDraft(choice)
      setView('hidden')
      if (opener.current === footer.current) footer.current?.focus({ preventScroll: true })
    } catch { setError('Não foi possível registrar sua escolha. Tente novamente.') }
    finally { setPending(false) }
  }
  return <>
    <div className={styles.footer}><button ref={footer} type="button" onClick={settings}><SlidersHorizontal size={15} aria-hidden />Preferências de cookies</button></div>
    {view !== 'hidden' && <section className={view === 'summary' ? styles.card + ' ' + styles.compactCard : styles.card} aria-labelledby="ciclo-privacy-title"
      onKeyDown={e => { if (e.key === 'Escape' && view === 'settings') back() }}>
      <header className={styles.header}>
        {view === 'settings' && <span className={styles.icon}><LockKeyhole size={19} strokeWidth={1.7} aria-hidden /></span>}
        <h2 ref={heading} tabIndex={-1} id="ciclo-privacy-title">{view === 'summary' ? 'Permitir cookies opcionais?' : 'Preferências de cookies'}</h2>
        <img src="/logo-ciclo-black.png" width="46" height="12" alt="Ciclo" />
      </header>
      {view === 'summary' ?
        <p>Para analisar visitas e medir anúncios. <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer">Saiba mais</a></p>
      : <>
        <p>Escolha quais cookies permitir neste navegador.</p>
        <div className={styles.row}><span><strong>Essenciais</strong><small>Fazem o site funcionar e guardam sua escolha.</small></span><span className={styles.always}>Sempre ativos</span></div>
        {(['analytics', 'marketing'] as const).map(key => <label key={key} className={styles.row}>
          <span><strong>{key === 'analytics' ? 'Análise de visitas' : 'Publicidade'}</strong>
            <small>{key === 'analytics' ? 'Ajuda a entender como o site é usado.' : 'Permite medir campanhas e personalizar anúncios.'}</small></span>
          <input type="checkbox" role="switch" aria-label={key === 'analytics' ? 'Análise de visitas' : 'Publicidade'} checked={draft[key]} disabled={pending} onChange={e => setDraft({ ...draft, [key]: e.target.checked })} />
        </label>)}
        <div className={styles.links}><button type="button" disabled={pending} onClick={back}>Voltar</button><a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</a></div>
      </>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      <div className={styles.actions}>
        <button type="button" disabled={pending} onClick={() => save(necessaryOnly)}>{view === 'summary' ? 'Não aceitar' : 'Rejeitar opcionais'}</button>
        <button type="button" disabled={pending} onClick={() => save(view === 'summary' ? { analytics: true, marketing: true } : draft)}>
          {pending ? 'Salvando…' : view === 'summary' ? 'Aceitar' : 'Salvar escolhas'}
        </button>
      </div>
    </section>}
  </>
}
