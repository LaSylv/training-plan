import { library } from '../data/plan'
import { WorkoutCard } from '../components/WorkoutCard'

export function Seances() {
  return (
    <>
      <section className="card">
        <h2>🚴 Séances à piocher</h2>
        <p className="small muted">
          Pas de programme : choisis selon ton envie et ta fraîcheur. Watts calculés sur ta FTP ; chaque
          séance vélo a son fichier Garmin.
        </p>
        <details className="fit-help">
          <summary>📥 Charger une séance sur ton Garmin Edge 530</summary>
          <ol className="clean small">
            <li>Branche l'Edge en USB à l'ordinateur.</li>
            <li>Copie le fichier <code>.fit</code> dans le dossier <code>Garmin/NewFiles/</code> du compteur.</li>
            <li>Débranche : l'Edge importe la séance dans <em>Entraînement → Séances</em>.</li>
          </ol>
          <p className="small muted">Les watts sont absolus (indépendants de la FTP réglée sur le compteur).</p>
        </details>
      </section>

      {library.map((c) => (
        <section key={c.key} style={{ marginTop: 22 }}>
          <h2 className="section-title">{c.title}</h2>
          <p className="cat-intro">{c.intro}</p>
          {c.workouts.map((w) => (
            <WorkoutCard key={w.id} w={w} />
          ))}
        </section>
      ))}
    </>
  )
}
