import { strength } from '../data/plan'
import { MuscuDetail } from '../components/MuscuDetail'

export function Strength() {
  return (
    <>
      <section className="card">
        <h2>🏋️ Muscu</h2>
        <p>{strength.intro}</p>
      </section>

      <section className="card">
        <h3>Progression (s'estompe avant la course)</h3>
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Semaines</th>
                <th>Fréquence</th>
                <th>Charge</th>
                <th>Objectif</th>
              </tr>
            </thead>
            <tbody>
              {strength.progression.map((p) => (
                <tr key={p.weeks}>
                  <td><strong>{p.weeks}</strong></td>
                  <td>{p.freq}</td>
                  <td>{p.load}</td>
                  <td className="small">{p.goal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small muted" style={{ marginTop: 10 }}>
          La charge indiquée concerne l'exercice principal (squat / soulevé de terre). Les exercices
          accessoires gardent le même schéma d'une semaine à l'autre.
        </p>
      </section>

      <section className="card">
        <h3>Séance A · Force bas du corps</h3>
        <MuscuDetail seance="A" mainScheme="selon la semaine (voir le plan)" />
      </section>

      <section className="card">
        <h3>Séance B · Puissance / durabilité</h3>
        <MuscuDetail seance="B" mainScheme="selon la semaine (voir le plan)" />
      </section>

      <div className="note">{strength.rules}</div>
    </>
  )
}
