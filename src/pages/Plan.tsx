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
