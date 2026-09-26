import { Link } from 'react-router-dom'
import { strength } from '../data/plan'
import { MuscuDetail } from '../components/MuscuDetail'

export function Strength() {
  return (
    <>
      <section className="card">
        <h2>🏋️ Salle</h2>
        <p>{strength.intro}</p>
      </section>

      <section className="card">
        <h3>Quelle charge ?</h3>
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Période</th>
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
          accessoires gardent toujours le même schéma.
        </p>
      </section>

      <section className="card">
        <h3>Séance A · Force bas du corps</h3>
        <Link className="seance-btn" to="/seance/muscu-a">▶ Faire la séance A (guidée + chrono)</Link>
        <MuscuDetail seance="A" mainScheme="selon la période (tableau ci-dessus)" />
      </section>

      <section className="card">
        <h3>Séance B · Puissance / durabilité</h3>
        <Link className="seance-btn" to="/seance/muscu-b">▶ Faire la séance B (guidée + chrono)</Link>
        <MuscuDetail seance="B" mainScheme="selon la période (tableau ci-dessus)" />
      </section>

      <div className="note">{strength.rules}</div>
    </>
  )
}
