import { event } from '../data/plan'

// Écart en jours calendaires (0 = le jour de la course).
export function daysUntilRace(now = new Date()): number {
  const race = new Date(event.date + 'T00:00:00')
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((race.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}
