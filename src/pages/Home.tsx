import { Link } from 'react-router-dom'
import { athlete, event, library } from '../data/plan'
import { daysUntilRace } from '../lib/dates'

export function Home() {
  const days = daysUntilRace()

  return (
    <>
      {days >= 0 && (
        <section className="card hero">
          <div className="count">
            {days}
            <small>{days > 1 ? 'jours avant la course' : days === 1 ? 'jour avant la course — c’est demain' : "c'est aujourd'hui 🏁"}</small>
          </div>
          <div className="event-name">{event.name}</div>
          <div className="event-meta">
            {event.distance} · {event.elevation} · {event.dateLabel}
          </div>
          <p style={{ marginTop: 12 }}>
            <Link to="/jour-j">🏁 Voir le plan de course →</Link>
          </p>
        </section>
      )}

      <section className="card">
        <h2>Ton profil</h2>
        <div className="stats">
          <div className="stat">
            <div className="v">{athlete.ftp}</div>
            <div className="k">FTP (W)</div>
          </div>
          <div className="stat">
            <div className="v">{athlete.wkg}</div>
            <div className="k">W/kg</div>
          </div>
          <div className="stat">
            <div className="v">{athlete.weight}</div>
            <div className="k">kg</div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Qu'est-ce qu'on fait aujourd'hui ?</h2>
        <ul className="clean">
          {library.map((c) => (
            <li key={c.key}>
              <Link to="/seances">{c.title}</Link>{' '}
              <span className="small muted">· {c.workouts.length} séance{c.workouts.length > 1 ? 's' : ''}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="small muted" style={{ textAlign: 'center', marginTop: 20 }}>
        App statique · contenu figé, régénéré à la demande.
      </p>
    </>
  )
}
