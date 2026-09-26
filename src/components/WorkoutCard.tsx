import { Link } from 'react-router-dom'
import type { Workout } from '../data/plan'
import { athlete, formatBlocks } from '../data/plan'
import { MuscuDetail } from './MuscuDetail'

export function WorkoutCard({ w }: { w: Workout }) {
  return (
    <details className="wcard">
      <summary>
        <span className="ttl">{w.title}</span>
        <span className="meta">
          {w.duration}
          {w.duration && w.tss ? ' · ' : ''}
          {w.tss ? `${w.tss} TSS` : ''}
        </span>
      </summary>
      <div className="wbody">
        <div>{w.detail}</div>
        {w.where && <div className="small muted" style={{ marginTop: 6 }}>📍 {w.where}</div>}
        {w.steps && w.steps.length > 0 && (
          <ul className="steps-list">
            {formatBlocks(w.steps, athlete.ftp).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        )}
        {w.type === 'velo' && w.steps?.length ? (
          <a className="fit-btn" href={`${import.meta.env.BASE_URL}workouts/${w.id}.fit`} download={`${w.id}.fit`}>
            📥 Fichier Garmin .FIT
          </a>
        ) : null}
        {w.type === 'muscu' && w.seance && (
          <>
            <Link className="seance-btn" to={`/seance/${w.id}`}>
              ▶ Faire la séance (guidée + chrono)
            </Link>
            <MuscuDetail seance={w.seance} mainScheme={w.mainScheme} />
          </>
        )}
      </div>
    </details>
  )
}
