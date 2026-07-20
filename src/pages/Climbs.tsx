import { lyonClimbs } from '../data/plan'

export function Climbs() {
  return (
    <>
      <section className="card">
        <h2>⛰️ Cols autour de Lyon</h2>
        <p className="small muted">
          Où faire chaque type de séance. Pour la spécificité maximale, 1–2 samedis dans le Vercors en S5–S7.
        </p>
      </section>

      {lyonClimbs.map((c) => (
        <section className="card" key={c.cat}>
          <h3 style={{ marginTop: 0 }}>{c.cat}</h3>
          <p className="small muted">{c.detail}</p>
          <div className="pill-list">
            {c.spots.map((s) => (
              <span className="pill" key={s}>
                {s}
              </span>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
