import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { findSession, muscuSeances, demoUrl } from '../data/plan'
import { useProgress } from '../lib/progress'
import { useCountdown } from '../lib/useCountdown'

interface Item {
  key: string
  name: string
  scheme?: string
  cue?: string
  video?: string
  hold?: number // secondes pour les exos chronométrés (gainage)
}

function parseHold(scheme?: string): number | undefined {
  if (!scheme) return undefined
  const m = scheme.match(/(\d+)\s*s\b/)
  return m ? parseInt(m[1], 10) : undefined
}

function mmss(s: number): string {
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, '0')}`
}

const PRESETS = [30, 45, 60, 90, 120, 180]

export function SeanceGuidee() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { toggle, done } = useProgress()
  const timer = useCountdown()

  const found = findSession(id)
  const session = found?.session
  const seance = session?.seance ? muscuSeances[session.seance] : null

  const items: Item[] = useMemo(() => {
    if (!seance) return []
    const list: Item[] = [
      { key: 'wu', name: 'Échauffement', cue: seance.warmup, hold: 600 },
      {
        key: 'main',
        name: seance.main.name,
        scheme: session?.mainScheme,
        cue: seance.main.cue,
        video: seance.main.video,
      },
      ...seance.accessories.map((a) => ({
        key: a.name,
        name: a.name,
        scheme: a.scheme,
        cue: a.cue,
        video: a.video,
        hold: parseHold(a.scheme),
      })),
    ]
    return list
  }, [seance, session])

  const runKey = `vercors130.run.${id}`
  const [checks, setChecks] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(runKey) || '{}')
    } catch {
      return {}
    }
  })
  useEffect(() => {
    localStorage.setItem(runKey, JSON.stringify(checks))
  }, [checks, runKey])

  if (!session || session.type !== 'muscu' || !seance) {
    return (
      <section className="card">
        <p>Séance introuvable.</p>
        <Link className="btn" to="/plan">← Retour au plan</Link>
      </section>
    )
  }

  const doneCount = items.filter((i) => checks[i.key]).length
  const pct = Math.round((doneCount / items.length) * 100)

  const finish = () => {
    if (!done[id]) toggle(id) // coche la séance dans le plan
    localStorage.removeItem(runKey)
    navigate('/plan')
  }

  return (
    <>
      <section className="card">
        <Link className="small" to="/plan">← Plan</Link>
        <h2 style={{ marginTop: 8 }}>{seance.title}</h2>
        <p className="small muted">
          {found?.week.phase} · S{found?.week.n} — {session.title}
        </p>
        <div className="pbar" style={{ marginTop: 10 }}>
          <span style={{ width: `${pct}%` }} />
        </div>
        <div className="small muted" style={{ marginTop: 4 }}>
          {doneCount}/{items.length} exercices · {pct}%
        </div>
      </section>

      {/* Chrono collant */}
      <section className="timer-box">
        <div className={`timer-display ${timer.running ? 'run' : ''}`}>
          {timer.remaining > 0 || timer.running ? mmss(timer.remaining) : '—:—'}
        </div>
        <div className="timer-presets">
          {PRESETS.map((p) => (
            <button key={p} className="chip" onClick={() => timer.start(p)}>
              {mmss(p)}
            </button>
          ))}
        </div>
        <div className="timer-ctrls">
          {timer.running ? (
            <button className="btn" onClick={timer.pause}>⏸ Pause</button>
          ) : (
            <button className="btn" onClick={timer.resume} disabled={timer.remaining <= 0}>▶ Reprendre</button>
          )}
          <button className="btn" onClick={timer.reset}>↺ Reset</button>
        </div>
      </section>

      {items.map((it) => {
        const checked = !!checks[it.key]
        return (
          <div className={`card exo-card ${checked ? 'done' : ''}`} key={it.key}>
            <div className="exo-top">
              <button
                className={`check ${checked ? 'on' : ''}`}
                onClick={() => setChecks((c) => ({ ...c, [it.key]: !c[it.key] }))}
                aria-label="Cocher l'exercice"
              >
                {checked ? '✓' : ''}
              </button>
              <div style={{ flex: 1 }}>
                <div className="ex-line">
                  <span className="exo-name">{it.name}</span>
                  {it.scheme && <span className="ex-scheme">{it.scheme}</span>}
                </div>
                {it.cue && <p className="exo-cue">{it.cue}</p>}
                <div className="exo-actions">
                  {it.hold ? (
                    <button className="btn small" onClick={() => timer.start(it.hold!)}>
                      ⏱ Lancer {mmss(it.hold)}
                    </button>
                  ) : (
                    <button className="btn small" onClick={() => timer.start(120)}>
                      ⏱ Repos 2:00
                    </button>
                  )}
                  {it.video && (
                    <a className="demo-link" href={demoUrl(it.video)} target="_blank" rel="noreferrer">
                      ▶ Voir la démo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}

      <button className="btn finish-btn" onClick={finish}>
        ✅ Terminer la séance
      </button>
    </>
  )
}
