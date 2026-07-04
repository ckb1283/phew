import type { Condition, Kit, WizardAnswers } from '@model/types'

// The wire shape for POST /api/kit: conditions travel as an array or the
// literal "unsure" (see server validate.ts), not the internal tagged union.
export type WireAnswers = Omit<WizardAnswers, 'conditions'> & {
  conditions: Condition[] | 'unsure'
}

export async function fetchKit(answers: WireAnswers): Promise<Kit> {
  const res = await fetch('/api/kit', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(answers),
  })
  if (!res.ok) throw new Error(`kit request failed (${res.status})`)
  return res.json()
}
