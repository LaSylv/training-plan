import { Link } from 'react-router-dom'
import type { Session } from '../data/plan'
import { athlete, formatBlocks } from '../data/plan'
import { useProgress } from '../lib/progress'
import { MuscuDetail } from './MuscuDetail'

export function SessionRow({ session, today }: { session: Session; today?: boolean }) {
  const { done, toggle } = useProgress()
  const isRepos = session.type === 'repos'
  const checked = !!done[session.id]
  const frozen = !!session.done // séance réalisée figée dans plan.json (mémoire du repo)

  return (
    <div className={`srow ${isRepos ? 'repos' : ''} ${checked ? 'done' : ''} ${today ? 'today' : ''}`}>
      {isRepos ? (
        <div className="check" style={{ visibility: 'hidden' }} />
      ) : (
        <button
          className={`check ${checked ? 'on' : ''}`}
          onClick={() => toggle(session.id)}
          disabled={frozen}
          title={frozen ? 'Séance réalisée — figée dans le plan' : undefined}
          aria-label={frozen ? 'Séance réalisée (figée)' : checked ? 'Marquer non fait' : 'Marquer fait'}
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
          {session.type === 'course' && <span className="tag course">course</span>}
          {today && <span className="tag today-tag">aujourd'hui</span>}
          {frozen && <span className="tag done-tag">✓ réalisé</span>}
        </div>
        {(session.duration || session.tss) && (
          <div className="meta">
            {session.duration}
            {session.duration && session.tss ? ' · ' : ''}
            {session.tss ? `${session.tss} TSS` : ''}
          </div>
        )}
        <div className="detail">{session.detail}</div>
        {session.steps && session.steps.length > 0 && (
          <ul className="steps-list">
            {formatBlocks(session.steps, athlete.ftp).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        )}
        {/* Un .FIT n'existe que pour les séances vélo structurées (mêmes règles que
            scripts/gen_workouts.py) : pas de fichier pour les séances déjà réalisées
            ou libres, qui n'ont pas de blocs `steps`. */}
        {session.type === 'velo' && session.id && session.steps?.length && session.id !== 'w9-sam' ? (
          <a
            className="fit-btn"
            href={`${import.meta.env.BASE_URL}workouts/${session.id}.fit`}
            download={`${session.id}.fit`}
          >
            📥 Fichier Garmin .FIT
          </a>
        ) : null}
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
