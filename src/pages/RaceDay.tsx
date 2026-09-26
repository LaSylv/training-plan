import { event, raceDay } from '../data/plan'

export function RaceDay() {
  return (
    <>
      <section className="card">
        <h2>🏁 Jour J — {event.name}</h2>
        <p className="event-meta">
          {event.distance} · {event.elevation} · {event.duration}
          <br />
          {event.start}
        </p>
        <p className="small muted">{event.organizer} · {event.dateLabel}</p>
        <a className="small" href={event.url} target="_blank" rel="noreferrer">
          Page officielle de l'événement ↗
        </a>
        <p className="small" style={{ marginTop: 12 }}>{raceDay.summary}</p>
      </section>

      <section className="card">
        <h3>📈 Ta forme (Strava, 26/09)</h3>
        <ul className="clean small">
          {raceDay.form.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>⏱️ Règles de pacing</h3>
        <ul className="clean small">
          {raceDay.pacing.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>🗺️ Plan de course, tronçon par tronçon</h3>
        <p className="small muted">Vent de sud 23–28 km/h prévu · FTP 230 W</p>
        {raceDay.segments.map((s) => (
          <div key={s.km} className="srow">
            <div className="body">
              <div className="head">
                <span className="day">km {s.km}</span>
                <span className="ttl">{s.name}</span>
              </div>
              <div className="meta">
                {s.profile} · {s.wind}
              </div>
              <div className="meta">
                <strong>🎯 {s.target}</strong>
              </div>
              <div className="detail">{s.note}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="card">
        <h3>⛽ Nutrition</h3>
        <ul className="clean small">
          {raceDay.fueling.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="small muted">{event.feedStations}</p>
      </section>

      <section className="card">
        <h3>🕗 Déroulé veille & matin</h3>
        <ul className="clean small">
          {raceDay.timeline.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>Les difficultés</h3>
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
