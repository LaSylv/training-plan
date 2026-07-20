import { event, planStart, weeks } from '../data/plan'

const PLAN_START = new Date(planStart + 'T00:00:00')
const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

export function daysUntilRace(now = new Date()): number {
  const race = new Date(event.date + 'T08:00:00')
  const ms = race.getTime() - now.getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

// Numéro de la semaine en cours (1..N), ou null si hors plan.
export function currentWeekNumber(now = new Date()): number | null {
  const ms = now.getTime() - PLAN_START.getTime()
  if (ms < 0) return null
  const wk = Math.floor(ms / (1000 * 60 * 60 * 24 * 7)) + 1
  if (wk < 1 || wk > weeks.length) return null
  return wk
}

// Abréviation FR du jour courant (Lun..Dim).
export function todayAbbr(now = new Date()): string {
  return DAYS[now.getDay()]
}

// Vrai si (semaine, jour) correspond à aujourd'hui.
export function isToday(weekN: number, day: string, now = new Date()): boolean {
  return currentWeekNumber(now) === weekN && todayAbbr(now) === day
}
