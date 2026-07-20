import { useCallback, useEffect, useRef, useState } from 'react'

// Bip sonore (Web Audio) + vibration à la fin du décompte.
function alarm() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const beep = (t: number) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.connect(g)
      g.connect(ctx.destination)
      o.frequency.value = 880
      o.start(t)
      g.gain.setValueAtTime(0.001, t)
      g.gain.exponentialRampToValueAtTime(0.4, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
      o.stop(t + 0.26)
    }
    beep(ctx.currentTime)
    beep(ctx.currentTime + 0.35)
    beep(ctx.currentTime + 0.7)
  } catch {
    /* audio indispo */
  }
  if (navigator.vibrate) navigator.vibrate([250, 120, 250])
}

// Décompte réutilisable : start(sec) démarre, pause/resume, reset.
export function useCountdown() {
  const [total, setTotal] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [running, setRunning] = useState(false)
  const endRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  const tick = useCallback(() => {
    if (endRef.current == null) return
    const rem = Math.max(0, Math.round((endRef.current - performance.now()) / 1000))
    setRemaining(rem)
    if (rem <= 0) {
      setRunning(false)
      endRef.current = null
      alarm()
      return
    }
    rafRef.current = window.setTimeout(tick, 250)
  }, [])

  const start = useCallback(
    (sec: number) => {
      if (rafRef.current) clearTimeout(rafRef.current)
      setTotal(sec)
      setRemaining(sec)
      setRunning(true)
      endRef.current = performance.now() + sec * 1000
      rafRef.current = window.setTimeout(tick, 250)
    },
    [tick]
  )

  const pause = useCallback(() => {
    if (rafRef.current) clearTimeout(rafRef.current)
    setRunning(false)
    if (endRef.current != null) {
      setRemaining(Math.max(0, Math.round((endRef.current - performance.now()) / 1000)))
      endRef.current = null
    }
  }, [])

  const resume = useCallback(() => {
    if (remaining <= 0) return
    setRunning(true)
    endRef.current = performance.now() + remaining * 1000
    rafRef.current = window.setTimeout(tick, 250)
  }, [remaining, tick])

  const reset = useCallback(() => {
    if (rafRef.current) clearTimeout(rafRef.current)
    setRunning(false)
    endRef.current = null
    setRemaining(0)
    setTotal(0)
  }, [])

  useEffect(() => () => { if (rafRef.current) clearTimeout(rafRef.current) }, [])

  return { total, remaining, running, start, pause, resume, reset }
}
