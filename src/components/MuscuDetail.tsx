import { muscuSeances } from '../data/plan'

// Affiche le détail exact des exercices d'une séance de muscu (A ou B).
// mainScheme = séries×reps de l'exercice principal pour la semaine concernée.
export function MuscuDetail({ seance, mainScheme }: { seance: 'A' | 'B'; mainScheme?: string }) {
  const s = muscuSeances[seance]
  if (!s) return null

  return (
    <div className="muscu-detail">
      <div className="ex warmup">
        <span className="ex-name">Échauffement</span>
        <span className="ex-note">{s.warmup}</span>
      </div>

      <div className="ex main">
        <div className="ex-line">
          <span className="ex-name">{s.main.name}</span>
          {mainScheme && <span className="ex-scheme">{mainScheme}</span>}
        </div>
        {s.main.note && <span className="ex-note">{s.main.note}</span>}
      </div>

      {s.accessories.map((a) => (
        <div className="ex" key={a.name}>
          <div className="ex-line">
            <span className="ex-name">{a.name}</span>
            {a.scheme && <span className="ex-scheme">{a.scheme}</span>}
          </div>
          {a.note && <span className="ex-note">{a.note}</span>}
        </div>
      ))}
    </div>
  )
}
