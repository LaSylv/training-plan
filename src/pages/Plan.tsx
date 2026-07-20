import { weeks } from '../data/plan'
import { currentWeekNumber } from '../lib/dates'
import { useProgress } from '../lib/progress'
import { WeekCard } from '../components/WeekCard'

export function Plan() {
  const cw = currentWeekNumber()
  const { reset } = useProgress()

  return (
    <>
      <section className="card">
        <h2>Le plan · 9 semaines</h2>
        <p className="small muted">
          Du lundi 20 juillet au samedi 19 septembre 2026. Coche les séances au fur et à mesure — c'est
          sauvegardé dans ton navigateur.
        </p>
        <details className="fit-help">
          <summary>📥 Charger les séances sur ton Garmin Edge 530</summary>
          <p className="small">
            Chaque séance vélo a un bouton <strong>« Fichier Garmin .FIT »</strong> (cibles en watts).
            Pour l'installer sur l'Edge 530 :
          </p>
          <ol className="clean small">
            <li>Branche l'Edge en USB à l'ordinateur.</li>
            <li>Copie le fichier <code>.fit</code> dans le dossier <code>Garmin/NewFiles/</code> du compteur.</li>
            <li>Débranche : l'Edge importe la séance dans <em>Entraînement → Séances</em>.</li>
          </ol>
          <p className="small muted">
            Les watts sont absolus (indépendants de la FTP réglée sur le compteur).
          </p>
        </details>
        <button
          className="btn danger"
          style={{ marginTop: 8 }}
          onClick={() => {
            if (confirm('Réinitialiser toutes les cases cochées ?')) reset()
          }}
        >
          Réinitialiser ma progression
        </button>
      </section>

      {weeks.map((w) => (
        <WeekCard key={w.n} week={w} isCurrent={w.n === cw} defaultOpen={w.n === cw} />
      ))}
    </>
  )
}
