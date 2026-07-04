// Boundary validation for POST /api/kit. Everything past this file trusts its
// types; nothing before it does. Hand-rolled while the shape is this small —
// a schema library (zod) is the move when inputs multiply.

import { HOURS_TO_CARE, TRAINING_LEVELS, type Condition, type WizardAnswers } from './model/types.js'

const ACTIVITIES = ['backpacking', 'river', 'cycling', 'car'] as const
const CONDITIONS = ['severe-allergies', 'adults-60-plus', 'daily-rx-meds'] as const
const ENVIRONMENTS = [
  'high-altitude', 'hot-sun', 'cold-winter', 'tropical-humid',
  'ticks-insects', 'snake-country', 'poison-oak-ivy', 'open-water', 'wildfire-smoke',
] as const
const PHILOSOPHIES = ['ultralight', 'balanced', 'comprehensive'] as const

type Result = { ok: true; answers: WizardAnswers } | { ok: false; errors: string[] }

export function parseWizardAnswers(body: unknown): Result {
  const errors: string[] = []
  if (typeof body !== 'object' || body === null) {
    return { ok: false, errors: ['body must be a JSON object'] }
  }
  const b = body as Record<string, unknown>

  const oneOf = <T extends string>(field: string, allowed: readonly T[]): T | undefined => {
    const v = b[field]
    if (typeof v === 'string' && (allowed as readonly string[]).includes(v)) return v as T
    errors.push(`${field} must be one of: ${allowed.join(', ')}`)
    return undefined
  }
  const int = (field: string, min: number, max: number): number | undefined => {
    const v = b[field]
    if (typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max) return v
    errors.push(`${field} must be an integer between ${min} and ${max}`)
    return undefined
  }
  const bool = (field: string): boolean | undefined => {
    const v = b[field]
    if (typeof v === 'boolean') return v
    errors.push(`${field} must be true or false`)
    return undefined
  }

  const activity = oneOf('activity', ACTIVITIES)
  const people = int('people', 1, 20)
  const kids = bool('kids')
  const pets = bool('pets')
  const days = int('days', 1, 60)
  const hoursToCare = oneOf('hoursToCare', HOURS_TO_CARE)
  const training = oneOf('training', TRAINING_LEVELS)
  const philosophy = oneOf('philosophy', PHILOSOPHIES)

  let conditions: WizardAnswers['conditions'] | undefined
  if (b.conditions === 'unsure') {
    conditions = { kind: 'unsure' }
  } else if (Array.isArray(b.conditions) && b.conditions.every((c) => (CONDITIONS as readonly string[]).includes(c))) {
    conditions = { kind: 'known', conditions: b.conditions as Condition[] }
  } else {
    errors.push(`conditions must be "unsure" or an array from: ${CONDITIONS.join(', ')}`)
  }

  let environments: WizardAnswers['environments'] | undefined
  if (Array.isArray(b.environments) && b.environments.every((e) => (ENVIRONMENTS as readonly string[]).includes(e))) {
    environments = b.environments as WizardAnswers['environments']
  } else {
    errors.push(`environments must be an array from: ${ENVIRONMENTS.join(', ')}`)
  }

  if (errors.length > 0) return { ok: false, errors }
  return {
    ok: true,
    answers: {
      activity: activity!, people: people!, kids: kids!, pets: pets!, days: days!,
      hoursToCare: hoursToCare!, conditions: conditions!, environments: environments!,
      training: training!, philosophy: philosophy!,
    },
  }
}
