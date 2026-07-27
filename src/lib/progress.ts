import { useCallback, useEffect, useState } from 'react'
import { weeks } from '../data/plan'

const KEY = 'vercors130.progress.v1'

// Séances RÉALISÉES figées dans plan.json (done: true) = la mémoire du repo.
// Elles sont toujours "faites", indépendamment du localStorage : elles survivent
// au changement de navigateur / vidage du cache, et ne sont jamais écrites en local.
const FROZEN_DONE: Record<string, true> = Object.fromEntries(
  weeks
    .flatMap((w) => w.sessions)
    .filter((s) => s.done && s.id)
    .map((s) => [s.id, true as const]),
)

// Cases cochées par l'utilisateur (localStorage) — uniquement les séances à venir.
function loadStored(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}')
  } catch {
    return {}
  }
}

// État effectif = cases locales, écrasées par les séances figées du repo.
function load(): Record<string, boolean> {
  return { ...loadStored(), ...FROZEN_DONE }
}

// Hook de progression : état des cases cochées, persisté en localStorage,
// synchronisé entre les composants via un événement custom.
export function useProgress() {
  const [done, setDone] = useState<Record<string, boolean>>(load)

  useEffect(() => {
    const sync = () => setDone(load())
    window.addEventListener('vercors130-progress', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('vercors130-progress', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const toggle = useCallback((id: string) => {
    if (FROZEN_DONE[id]) return // séance figée dans le repo : non décochable, jamais en local
    const stored = loadStored()
    stored[id] = !stored[id]
    localStorage.setItem(KEY, JSON.stringify(stored))
    window.dispatchEvent(new Event('vercors130-progress'))
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem(KEY)
    window.dispatchEvent(new Event('vercors130-progress'))
  }, [])

  return { done, toggle, reset }
}
