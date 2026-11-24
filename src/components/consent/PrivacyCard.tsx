'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { choiceCookie, choiceLifetime, decodeChoice, encodeChoice, policyVersion } from '@/lib/privacy-choice'
import styles from './PrivacyCard.module.css'

const policyLink = '/politica-de-privacidade#dados-de-campanhas'
const syncKey = 'ciclo_pa_preferencia_atualizada'

const openSettingsEvent = 'ciclo:abrir-preferencias-de-campanhas'

export function CampaignPreferencesButton() {
  return <button type="button" className={styles.settingsButton} onClick={event => {
    event.currentTarget.dispatchEvent(new Event(openSettingsEvent, { bubbles: true }))
  }}>Rever preferência de campanhas</button>
}

function currentChoice() {
  return decodeChoice(document.cookie.split('; ').find(pair => pair.startsWith(choiceCookie + '='))?.slice(choiceCookie.length + 1))
}

// Esta escolha pertence exclusivamente à medição adicional de Perfil A.
function persist(allowed: boolean) {
  document.cookie = choiceCookie + '=' + encodeChoice(allowed) + '; Path=/; SameSite=Lax; Secure; Max-Age=' + choiceLifetime
  if (!allowed) {
    for (const name of ['ciclo_perfil', 'ciclo_perfil_origem']) document.cookie = name + '=; Path=/; Max-Age=0; SameSite=Lax; Secure'
    try { localStorage.removeItem('ciclo_pa_sessao_v1') } catch {}
  }
  window.dispatchEvent(new Event(syncKey))
  try { localStorage.setItem(syncKey, crypto.randomUUID()) } catch {}
}

export default function PrivacyCard() {
  const [view, setView] = useState<'summary' | 'settings' | 'hidden'>('hidden')
  const [saved, setSaved] = useState<boolean | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const pathname = usePathname()
  // A autorização é exclusiva do Perfil A e não atualiza o consentimento global.
  useEffect(() => {
    function permissions() {
      const marketing = currentChoice() === true
      const signal = marketing ? 'granted' : 'denied'
      return { marketing, analytics_storage: signal, ad_storage: signal, ad_user_data: signal, ad_personalization: signal }
    }
    const w = window as Window & { cicloPerfilPermissoes?: typeof permissions; dataLayer?: unknown[] }
    w.cicloPerfilPermissoes = permissions
    function evaluate() {
      if (!permissions().marketing) return
      if (pathname === '/politica-de-privacidade' && new URLSearchParams(location.search).get('optout') === '1') {
        persist(false)
        void fetch('/api/privacidade/preferencias', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ perfil_a: false, version: policyVersion }) }).catch(() => {})
        return
      }
      w.dataLayer = w.dataLayer || []
      w.dataLayer.push({ event: 'pa_pagina_autorizada' })
    }
    const storage = (e: StorageEvent) => { if (e.key === syncKey) evaluate() }
    const restored = (e: PageTransitionEvent) => { if (e.persisted) evaluate() }
    evaluate()
    window.addEventListener(syncKey, evaluate)
    window.addEventListener('storage', storage)
    window.addEventListener('pageshow', restored)
    return () => {
      window.removeEventListener(syncKey, evaluate)
      window.removeEventListener('storage', storage)
      window.removeEventListener('pageshow', restored)
      delete w.cicloPerfilPermissoes
    }
  }, [pathname])
  const settingsOpener = useRef<HTMLButtonElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    function sync() {
      const choice = currentChoice()
      setSaved(choice)
      setView(choice === null ? 'summary' : 'hidden')
    }
    function openSettings(event: Event) {
      if (!(event.target instanceof HTMLButtonElement)) return
      settingsOpener.current = event.target
      setSaved(currentChoice())
      setError('')
      setView('settings')
    }
    sync()
    document.addEventListener(openSettingsEvent, openSettings)
    function onStorage(event: StorageEvent) { if (event.key === syncKey) sync() }
    function onRestore(event: PageTransitionEvent) { if (event.persisted) sync() }
    window.addEventListener('storage', onStorage)
    window.addEventListener('pageshow', onRestore)
    return () => {
      document.removeEventListener(openSettingsEvent, openSettings)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('pageshow', onRestore)
    }
  }, [])
  useEffect(() => { if (view === 'settings') heading.current?.focus({ preventScroll: true }) }, [view])

  function closeSettings() {
    if (pending) return
    setView(currentChoice() === null ? 'summary' : 'hidden')
    settingsOpener.current?.focus({ preventScroll: true })
  }

  async function save(allowed: boolean) {
    if (pending) return
    setPending(true)
    setError('')
    // Uma revogação vale no navegador mesmo se o registro estiver temporariamente indisponível.
    if (!allowed && currentChoice() === true) { persist(false); setSaved(false) }
    try {
      const res = await fetch('/api/privacidade/preferencias', { method: 'POST',
        headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(8000),
        body: JSON.stringify({ perfil_a: allowed, version: policyVersion }) })
      if (!res.ok) throw Error()
      persist(allowed)
      setSaved(allowed)
      setView('hidden')
      if (view === 'settings') settingsOpener.current?.focus({ preventScroll: true })
    } catch { setError('Não foi possível registrar sua escolha. Tente novamente.') }
    finally { setPending(false) }
  }

  if (view === 'hidden') return null
  return (
    <section className={styles.card + ' ' + styles.compactCard} aria-labelledby="ciclo-privacy-title"
      onKeyDown={event => { if (event.key === 'Escape' && view === 'settings') closeSettings() }}>
      <header className={styles.header}>
        <h2 ref={heading} tabIndex={-1} id="ciclo-privacy-title">Dados de campanhas</h2>
        <img src="/logo-ciclo-black.png" width="46" height="12" alt="Ciclo" />
      </header>
      <p>Permitir cookies opcionais para medir visitas e leads de campanhas? <a href={policyLink} target="_blank" rel="noopener noreferrer">Saiba mais</a></p>
      {view === 'settings' && <div className={styles.links}>
        <span>{saved === null ? 'Escolha pendente' : saved ? 'Você aceitou' : 'Você recusou'}</span>
        <button type="button" disabled={pending} onClick={closeSettings}>Voltar</button>
      </div>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      <div className={styles.actions} aria-busy={pending}>
        <button type="button" disabled={pending} onClick={() => save(false)}>Não aceitar</button>
        <button type="button" disabled={pending} onClick={() => save(true)}>Aceitar</button>
      </div>
    </section>
  )
}
