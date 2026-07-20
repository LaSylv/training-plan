import { event, raceDay } from '../data/plan'

export function RaceDay() {
  return (
    <>
      <section className="card">
        <h2>🏁 Jour J — {event.name}</h2>
        <p className="event-meta">
          {event.distance} · {event.elevation} · {event.duration}
          <br />
          {event.feedStations}
        </p>
        <p className="small muted">{event.organizer} · samedi 19 septembre 2026</p>
        <a className="small" href={event.url} target="_blank" rel="noreferrer">
          Page officielle de l'événement ↗
        </a>
      </section>

      <section className="card">
        <h3>⛽ Nutrition — ta priorité n°1</h3>
        <ul className="clean small">
          {raceDay.fueling.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>⏱️ Pacing</h3>
        <ul className="clean small">
          {raceDay.pacing.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>Les cols du parcours</h3>
        <div className="tablewrap">
          <table>
            <tbody>
              {event.cols.map((c) => (
                <tr key={c.name}>
                  <td><strong>{c.name}</strong></td>
                  <td className="small muted">{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h3>✅ Checklist</h3>
        <ul className="clean small">
          {raceDay.checklist.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>
    </>
  )
}
