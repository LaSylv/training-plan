import { Link } from 'react-router-dom'
import type { Session } from '../data/plan'
import { useProgress } from '../lib/progress'
import { MuscuDetail } from './MuscuDetail'

export function SessionRow({ session, today }: { session: Session; today?: boolean }) {
  const { done, toggle } = useProgress()
  const isRepos = session.type === 'repos'
  const checked = !!done[session.id]

  return (
    <div className={`srow ${isRepos ? 'repos' : ''} ${checked ? 'done' : ''} ${today ? 'today' : ''}`}>
      {isRepos ? (
        <div className="check" style={{ visibility: 'hidden' }} />
      ) : (
        <button
          className={`check ${checked ? 'on' : ''}`}
          onClick={() => toggle(session.id)}
          aria-label={checked ? 'Marquer non fait' : 'Marquer fait'}
        >
          {checked ? '✓' : ''}
        </button>
      )}
      <div className="body">
        <div className="head">
          <span className="day">{session.day}</span>
          <span className="ttl">{session.title}</span>
          {session.type === 'velo' && <span className="tag velo">vélo</span>}
          {session.type === 'muscu' && <span className="tag muscu">muscu</span>}
          {today && <span className="tag today-tag">aujourd'hui</span>}
        </div>
        {(session.duration || session.tss) && (
          <div className="meta">
            {session.duration}
            {session.duration && session.tss ? ' · ' : ''}
            {session.tss ? `${session.tss} TSS` : ''}
          </div>
        )}
        <div className="detail">{session.detail}</div>
        {session.type === 'velo' && session.id && session.id !== 'w9-sam' && (
          <a
            className="fit-btn"
            href={`${import.meta.env.BASE_URL}workouts/${session.id}.fit`}
            download={`${session.id}.fit`}
          >
            📥 Fichier Garmin .FIT
          </a>
        )}
        {session.type === 'muscu' && session.seance && (
          <>
            <Link className="seance-btn" to={`/seance/${session.id}`}>
              ▶ Faire la séance (guidée + chrono)
            </Link>
            <MuscuDetail seance={session.seance} mainScheme={session.mainScheme} />
          </>
        )}
      </div>
    </div>
  )
}
