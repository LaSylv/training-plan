import { useCallback, useEffect, useState } from 'react'

const KEY = 'vercors130.progress.v1'

function load(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}')
  } catch {
    return {}
  }
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
    const next = { ...load(), [id]: !load()[id] }
    localStorage.setItem(KEY, JSON.stringify(next))
    window.dispatchEvent(new Event('vercors130-progress'))
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem(KEY)
    window.dispatchEvent(new Event('vercors130-progress'))
  }, [])

  return { done, toggle, reset }
}
