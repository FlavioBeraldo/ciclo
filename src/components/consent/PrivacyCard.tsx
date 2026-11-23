'use client'

import { useEffect, useRef, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { choiceCookie, choiceLifetime, decodeChoice, encodeChoice, policyVersion } from '@/lib/privacy-choice'
import styles from './PrivacyCard.module.css'

const policyLink = '/politica-de-privacidade#medicao-perfil-a'
const syncKey = 'ciclo_pa_preferencia_atualizada'

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
  try { localStorage.setItem(syncKey, crypto.randomUUID()) } catch {}
}

export default function PrivacyCard() {
  const [view, setView] = useState<'summary' | 'settings' | 'hidden'>('hidden')
  const [saved, setSaved] = useState<boolean | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const footer = useRef<HTMLButtonElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    function sync() {
      const choice = currentChoice()
      setSaved(choice)
      setView(choice === null ? 'summary' : 'hidden')
    }
    sync()
    function onStorage(event: StorageEvent) { if (event.key === syncKey) sync() }
    function onRestore(event: PageTransitionEvent) { if (event.persisted) sync() }
    window.addEventListener('storage', onStorage)
    window.addEventListener('pageshow', onRestore)
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('pageshow', onRestore) }
  }, [])
  useEffect(() => { if (view === 'settings') heading.current?.focus({ preventScroll: true }) }, [view])

  function closeSettings() {
    if (pending) return
    setView(currentChoice() === null ? 'summary' : 'hidden')
    footer.current?.focus({ preventScroll: true })
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
      if (view === 'settings') footer.current?.focus({ preventScroll: true })
    } catch { setError('Não foi possível registrar sua escolha. Tente novamente.') }
    finally { setPending(false) }
  }

  return <>
    <div className={styles.footer}><button ref={footer} type="button" onClick={() => {
      setSaved(currentChoice()); setError(''); setView('settings')
    }}><SlidersHorizontal size={15} aria-hidden />Preferência de Perfil A</button></div>
    {view !== 'hidden' && <section className={styles.card + ' ' + styles.compactCard} aria-labelledby="ciclo-privacy-title"
      onKeyDown={event => { if (event.key === 'Escape' && view === 'settings') closeSettings() }}>
      <header className={styles.header}>
        <h2 ref={heading} tabIndex={-1} id="ciclo-privacy-title">Medição de Perfil A</h2>
        <img src="/logo-ciclo-black.png" width="46" height="12" alt="Ciclo" />
      </header>
      <p>Permitir cookies só para medir visitas e leads das campanhas de Perfil A? <a href={policyLink} target="_blank" rel="noopener noreferrer">Saiba mais</a></p>
      {view === 'settings' && <div className={styles.links}>
        <span>{saved === null ? 'Escolha pendente' : saved ? 'Você aceitou' : 'Você recusou'}</span>
        <button type="button" disabled={pending} onClick={closeSettings}>Voltar</button>
      </div>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      <div className={styles.actions} aria-busy={pending}>
        <button type="button" disabled={pending} onClick={() => save(false)}>Não aceitar</button>
        <button type="button" disabled={pending} onClick={() => save(true)}>Aceitar</button>
      </div>
    </section>}
  </>
}
