// ============================================================================
//  Ce module lit src/data/plan.json (la SOURCE DE VÉRITÉ) et l'expose typé.
//  Pour modifier le plan / les stats : édite plan.json, PAS ce fichier.
// ============================================================================
import data from './plan.json'

export type SessionType = 'velo' | 'muscu'

// Bloc d'entraînement vélo. Les intensités sont en % de la FTP (lo/hi, oLo…).
export interface Block {
  k: 'wu' | 'cd' | 'rec' | 'steady' | 'int' | 'ou' | 'open'
  min?: number
  lo?: number
  hi?: number
  label?: string
  reps?: number
  on?: number
  off?: number
  cad?: string
  sets?: number
  onOver?: number
  onUnder?: number
  oLo?: number
  oHi?: number
  uLo?: number
  uHi?: number
  rec?: number
  overName?: string       // nom des pas « over » / « under » sur le Garmin
  underName?: string
}

export interface Workout {
  id: string
  type: SessionType
  title: string
  duration?: string
  tss?: number
  detail: string
  where?: string          // où la faire autour de Lyon
  steps?: Block[]         // structure vélo en % de FTP → watts calculés depuis athlete.ftp
  seance?: 'A' | 'B'      // pour les séances de muscu : renvoie vers muscuSeances
  mainScheme?: string     // séries×reps de l'exercice principal
  homeOption?: boolean    // propose une bascule "sans matériel" dans la séance guidée
}

export interface Category {
  key: string
  title: string
  intro: string
  workouts: Workout[]
}

export interface ZoneDef {
  key: string
  name: string
  lo: number
  hi: number
  rpe: string
  use: string
}

export interface HomeVariant {
  name: string
  scheme?: string
  cue?: string
  video?: string
}
export interface MuscuExercise {
  name: string
  scheme?: string
  cue?: string
  video?: string
  home?: HomeVariant
}
export interface MuscuSeance {
  title: string
  warmup: string
  homeWarmup?: string
  main: { name: string; cue?: string; video?: string; home?: HomeVariant }
  accessories: MuscuExercise[]
}

// URL de recherche de démo vidéo pour un exercice.
export function demoUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' technique')}`
}

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
export const library = data.library as Category[]

export function zoneWatts(z: ZoneDef, ftp: number): string {
  const lo = Math.round((z.lo / 100) * ftp)
  const hi = Math.round((z.hi / 100) * ftp)
  if (z.lo === 0) return `< ${hi} W`
  return `${lo}–${hi} W`
}

// Formate les blocs d'une séance vélo en lignes lisibles, watts calculés depuis la FTP.
export function formatBlocks(steps: Block[], ftp: number): string[] {
  const w = (p?: number) => Math.round(((p ?? 0) / 100) * ftp)
  const range = (lo?: number, hi?: number) => `${w(lo)}–${w(hi)} W`
  // Durées < 1 min affichées en secondes (0.25 → « 15 s »).
  const dur = (m?: number) => (m !== undefined && m < 1 ? `${Math.round(m * 60)} s` : `${m} min`)
  return steps.map((b) => {
    switch (b.k) {
      case 'wu':
        return `Échauffement ${b.min} min`
      case 'cd':
        return `Retour au calme ${b.min} min`
      case 'rec':
        return `Récup ${b.min} min`
      case 'steady':
        return `${b.label} — ${b.min} min · ${range(b.lo, b.hi)}`
      case 'int':
        return `${b.reps} × ${dur(b.on)} · ${range(b.lo, b.hi)} — ${b.label}${b.cad ? ` (${b.cad})` : ''}${b.off ? ` · récup ${dur(b.off)}` : ''}`
      case 'ou': {
        // Série unique : on écrit « 5 × (…) » plutôt que « 1 × [5 × (…)] ».
        const rep = `${b.reps} × (${dur(b.onOver)} ${range(b.oLo, b.oHi)} / ${dur(b.onUnder)} ${range(b.uLo, b.uHi)})`
        const body = b.sets === 1 ? rep : `${b.sets} × [${rep}]`
        return `${body} — ${b.label ?? 'Over-unders'}${b.rec && (b.sets ?? 1) > 1 ? ` · récup ${dur(b.rec)} entre séries` : ''}`
      }
      case 'open':
        return `${b.label} — ${dur(b.min)} · effort libre (donne tout)`
      default:
        return ''
    }
  })
}

// Retrouve une séance de la bibliothèque par id.
export function findWorkout(id: string): Workout | null {
  for (const c of library) {
    const w = c.workouts.find((x) => x.id === id)
    if (w) return w
  }
  return null
}
