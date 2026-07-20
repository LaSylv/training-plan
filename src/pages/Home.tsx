import { Link } from 'react-router-dom'
import { athlete, event, weeks, allCheckableIds } from '../data/plan'
import { currentWeekNumber, daysUntilRace } from '../lib/dates'
import { useProgress } from '../lib/progress'
import { ProgressBar } from '../components/ProgressBar'
import { WeekCard } from '../components/WeekCard'

export function Home() {
  const { done } = useProgress()
  const days = daysUntilRace()
  const cw = currentWeekNumber()
  const current = weeks.find((w) => w.n === cw)
  const doneTotal = allCheckableIds.filter((id) => done[id]).length

  return (
    <>
      <section className="card hero">
        <div className="count">
          {days > 0 ? days : days === 0 ? '0' : '—'}
          <small>{days > 0 ? 'jours avant la course' : days === 0 ? "c'est aujourd'hui 🏁" : 'course passée'}</small>
        </div>
        <div className="event-name">{event.name}</div>
        <div className="event-meta">
          {event.distance} · {event.elevation} · samedi 19 sept. 2026
        </div>
      </section>

      <section className="card">
        <h2>Ton snapshot</h2>
        <div className="small muted" style={{ marginBottom: 12 }}>
          Intervals.icu · figé le {athlete.snapshotDate}
        </div>
        <div className="stats">
          <div className="stat">
            <div className="v">{athlete.ctl}</div>
            <div className="k">CTL (forme)</div>
          </div>
          <div className="stat">
            <div className="v">{athlete.eftp}</div>
            <div className="k">eFTP (W)</div>
          </div>
          <div className="stat">
            <div className="v">{athlete.wkg}</div>
            <div className="k">W/kg</div>
          </div>
        </div>
        <p className="small muted" style={{ marginTop: 12 }}>
          {athlete.summary}
        </p>
      </section>

      <section className="card">
        <h2>Progression globale</h2>
        <div style={{ marginTop: 10 }}>
          <ProgressBar value={doneTotal} total={allCheckableIds.length} />
        </div>
      </section>

      {current ? (
        <section>
          <h2 className="section-title">Cette semaine</h2>
          <WeekCard week={current} isCurrent defaultOpen />
        </section>
      ) : (
        <section className="card">
          <p className="muted">
            Le plan démarre le lundi 20 juillet 2026.{' '}
            <Link to="/plan">Voir tout le plan →</Link>
          </p>
        </section>
      )}

      <p className="small muted" style={{ textAlign: 'center', marginTop: 20 }}>
        App statique · contenu figé, régénéré à la demande.
      </p>
    </>
  )
}
