import { muscuSeances, demoUrl } from '../data/plan'

// Affiche le détail exact des exercices d'une séance de muscu (A ou B),
// avec consigne technique + lien vers une démo vidéo.
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
        {s.main.cue && <span className="ex-note">{s.main.cue}</span>}
        {s.main.video && (
          <a className="demo-link" href={demoUrl(s.main.video)} target="_blank" rel="noreferrer">
            ▶ Voir la démo
          </a>
        )}
      </div>

      {s.accessories.map((a) => (
        <div className="ex" key={a.name}>
          <div className="ex-line">
            <span className="ex-name">{a.name}</span>
            {a.scheme && <span className="ex-scheme">{a.scheme}</span>}
          </div>
          {a.cue && <span className="ex-note">{a.cue}</span>}
          {a.video && (
            <a className="demo-link" href={demoUrl(a.video)} target="_blank" rel="noreferrer">
              ▶ Voir la démo
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
