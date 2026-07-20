// ============================================================================
//  Ce module lit src/data/plan.json (la SOURCE DE VÉRITÉ) et l'expose typé.
//  Pour modifier le plan / les stats : édite plan.json, PAS ce fichier.
// ============================================================================
import data from './plan.json'

export type SessionType = 'velo' | 'muscu' | 'repos'

export interface Session {
  id: string
  day: string
  type: SessionType
  title: string
  duration?: string
  tss?: number
  detail: string
  seance?: 'A' | 'B'      // pour les séances de muscu : renvoie vers muscuSeances
  mainScheme?: string     // séries×reps de l'exercice principal cette semaine
}

export interface Week {
  n: number
  dates: string
  phase: string
  focus: string
  tss: number
  longRide: string
  sessions: Session[]
}

export interface ZoneDef {
  key: string
  name: string
  lo: number
  hi: number
  rpe: string
  use: string
}

export interface MuscuExercise {
  name: string
  scheme?: string
  cue?: string
  video?: string
}
export interface MuscuSeance {
  title: string
  warmup: string
  main: { name: string; cue?: string; video?: string }
  accessories: MuscuExercise[]
}

// URL de recherche de démo vidéo pour un exercice.
export function demoUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' technique')}`
}

export const planStart: string = data.planStart

export const athlete = {
  ...data.athlete,
  wkg: +(data.athlete.eftp / data.athlete.weight).toFixed(2),
}

export const event = data.event
export const zoneDefs = data.zoneDefs as ZoneDef[]
export const strength = data.strength
export const muscuSeances = data.muscuSeances as Record<'A' | 'B', MuscuSeance>
export const lyonClimbs = data.lyonClimbs
export const raceDay = data.raceDay
export const weeks = data.weeks as Week[]

export function zoneWatts(z: ZoneDef, ftp: number): string {
  const lo = Math.round((z.lo / 100) * ftp)
  const hi = Math.round((z.hi / 100) * ftp)
  if (z.lo === 0) return `< ${hi} W`
  return `${lo}–${hi} W`
}

// Toutes les séances "cochables" (vélo + muscu, hors repos)
export const allCheckableIds: string[] = weeks.flatMap((w) =>
  w.sessions.filter((s) => s.type !== 'repos').map((s) => s.id)
)

// Retrouve une séance (et sa semaine) par id.
export function findSession(id: string): { session: Session; week: Week } | null {
  for (const week of weeks) {
    const session = week.sessions.find((s) => s.id === id)
    if (session) return { session, week }
  }
  return null
}
