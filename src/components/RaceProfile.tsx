import { useEffect, useRef, useState } from 'react'
import { raceDay } from '../data/plan'

// Rampe ordinale bleue (validée : lumière monotone, extrémité claire ≥ 2:1 sur fond clair).
export const EFFORT_COLORS = ['#86b6ef', '#3987e5', '#1c5cab', '#0d366b']
export const badgeStyle = (effort: number) => ({
  background: EFFORT_COLORS[effort],
  color: effort === 0 ? '#1a2230' : '#fff',
})

const M = { l: 44, r: 10, t: 40, b: 28 }
const E_MIN = 200
const E_MAX = 640

export function RaceProfile() {
  const [active, setActive] = useState<number | null>(null)
  // Dessin à la largeur réelle (px) : le texte garde sa taille sur mobile comme sur desktop.
  const box = useRef<HTMLDivElement>(null)
  const [W, setW] = useState(340)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const H = Math.round(Math.min(300, Math.max(230, W * 0.55)))
  const { elev, stepKm } = raceDay.profile
  const segs = raceDay.segments
  const totalKm = (elev.length - 1) * stepKm

  const x = (km: number) => M.l + (km / totalKm) * (W - M.l - M.r)
  const y = (e: number) => M.t + ((E_MAX - e) / (E_MAX - E_MIN)) * (H - M.t - M.b)
  const base = y(E_MIN)
  const idx = (km: number) => Math.min(elev.length - 1, Math.round(km / stepKm))

  const areaPath = (a: number, b: number) => {
    const pts: string[] = []
    for (let i = idx(a); i <= idx(b); i++) pts.push(`${x(i * stepKm).toFixed(1)},${y(elev[i]).toFixed(1)}`)
    return `M${x(a).toFixed(1)},${base} L${pts.join(' L')} L${x(b).toFixed(1)},${base} Z`
  }
  const line = elev.map((e, i) => `${x(i * stepKm).toFixed(1)},${y(e).toFixed(1)}`).join(' ')
  const peak = (a: number, b: number) => Math.max(...elev.slice(idx(a), idx(b) + 1))
  const sel = active !== null ? segs[active] : null

  return (
    <div className="race-profile" ref={box}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Profil de la course, 94 km, découpé en 9 sections numérotées">
        {[300, 400, 500, 600].map((e) => (
          <g key={e}>
            <line x1={M.l} x2={W - M.r} y1={y(e)} y2={y(e)} className="grid" />
            <text x={M.l - 6} y={y(e) + 4} textAnchor="end" className="axis">{e} m</text>
          </g>
        ))}
        {(W < 500 ? [0, 20, 40, 60, 80] : [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]).map((k) => (
          <text key={k} x={x(k)} y={H - 10} textAnchor="middle" className="axis">{k}</text>
        ))}
        <text x={W - M.r} y={H - 10} textAnchor="end" className="axis">km</text>

        {/* Vent : bandeaux au-dessus du profil */}
        {[
          { a: 45.7, b: 69.7, t: '⬆ vent de face' },
          { a: 69.7, b: totalKm, t: W < 500 ? '⬇ dos' : '⬇ vent dans le dos' },
          { a: 15.2, b: 31, t: W < 500 ? '⬇ dos' : '⬇ vent dans le dos' },
        ].map((w) => (
          <g key={w.a}>
            <line x1={x(w.a) + 2} x2={x(w.b) - 2} y1={14} y2={14} className="wind" />
            <text x={(x(w.a) + x(w.b)) / 2} y={10} textAnchor="middle" className="axis">{w.t}</text>
          </g>
        ))}

        {segs.map((s, i) => (
          <path
            key={s.n}
            d={areaPath(s.kmStart, s.kmEnd)}
            fill={EFFORT_COLORS[s.effort]}
            opacity={active === null || active === i ? 1 : 0.3}
          />
        ))}
        {/* 2px d'écart entre sections */}
        {segs.slice(1).map((s) => (
          <line key={s.n} x1={x(s.kmStart)} x2={x(s.kmStart)} y1={M.t - 4} y2={base} stroke="#fff" strokeWidth={2} />
        ))}
        <polyline points={line} fill="none" stroke="#1a2230" strokeWidth={2} strokeLinejoin="round" />
        <line x1={M.l} x2={W - M.r} y1={base} y2={base} className="baseline" />

        {segs.map((s) => {
          const cx = (x(s.kmStart) + x(s.kmEnd)) / 2
          // Pairs en bas, impairs au-dessus du sommet : évite les chevauchements sur mobile.
          const mid = (s.kmStart + s.kmEnd) / 2
          const cy = s.n % 2 === 0 ? base - 16 : y(peak(Math.max(s.kmStart, mid - 1.5), Math.min(s.kmEnd, mid + 1.5))) - 18
          return (
            <g key={s.n}>
              <circle cx={cx} cy={cy} r={10} fill="#fff" stroke="#1a2230" strokeWidth={1.5} />
              <text x={cx} y={cy + 4} textAnchor="middle" className="marker">{s.n}</text>
            </g>
          )
        })}

        {/* Cibles tactiles plus grandes que les marques */}
        {segs.map((s, i) => (
          <rect
            key={s.n}
            x={x(s.kmStart)}
            y={0}
            width={Math.max(1, x(s.kmEnd) - x(s.kmStart))}
            height={base}
            fill="transparent"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onClick={() => setActive(active === i ? null : i)}
          >
            <title>{`${s.n}. ${s.name} — ${s.target}`}</title>
          </rect>
        ))}
      </svg>

      <div className="legend">
        {raceDay.effortLevels.map((l, i) => (
          <span key={l} className="legend-item">
            <span className="swatch" style={{ background: EFFORT_COLORS[i] }} />
            {l}
          </span>
        ))}
      </div>

      <div className="profile-panel">
        {sel ? (
          <>
            <div className="head">
              <span className="num-badge" style={badgeStyle(sel.effort)}>{sel.n}</span>
              <strong>{sel.name}</strong>
              <span className="small muted">km {sel.km}</span>
            </div>
            <div className="small muted">{sel.profile} · {sel.wind}</div>
            <div><strong>🎯 {sel.target}</strong></div>
            <div className="small">{sel.note}</div>
          </>
        ) : (
          <div className="small muted">Touche une section du profil pour voir quoi faire.</div>
        )}
      </div>
    </div>
  )
}
