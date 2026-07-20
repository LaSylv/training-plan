import { useState } from 'react'
import type { Week } from '../data/plan'
import { useProgress } from '../lib/progress'
import { isToday } from '../lib/dates'
import { SessionRow } from './SessionRow'
import { ProgressBar } from './ProgressBar'

export function WeekCard({ week, isCurrent, defaultOpen }: { week: Week; isCurrent: boolean; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen)
  const { done } = useProgress()

  const checkable = week.sessions.filter((s) => s.type !== 'repos')
  const doneCount = checkable.filter((s) => done[s.id]).length

  return (
    <div className="week">
      <button className={`week-head ${isCurrent ? 'is-current' : ''}`} onClick={() => setOpen((o) => !o)}>
        <span className="week-num">S{week.n}</span>
        <span className="week-title">
          <div className="t">
            {week.phase} {isCurrent && '· en cours'}
          </div>
          <div className="d">
            {week.dates} — {week.focus}
          </div>
          <div className="week-badges">
            <span className="badge">{week.tss} TSS</span>
            <span className="badge">Sortie longue : {week.longRide}</span>
            <span className="badge">
              {doneCount}/{checkable.length} fait
            </span>
          </div>
        </span>
        <span className={`chev ${open ? 'open' : ''}`}>›</span>
      </button>
      {open && (
        <div className="sessions">
          <div style={{ padding: '8px 4px' }}>
            <ProgressBar value={doneCount} total={checkable.length} />
          </div>
          {week.sessions.map((s, i) => (
            <SessionRow key={s.id || `${week.n}-repos-${i}`} session={s} today={isToday(week.n, s.day)} />
          ))}
        </div>
      )}
    </div>
  )
}
