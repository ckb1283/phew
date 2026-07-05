import type { Condition, Item, Kit, WizardAnswers } from '@model/types'

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

// The full item catalog (also powers add-search). Item pages fetch this and
// find by id — the catalog is small enough that a dedicated endpoint isn't worth it.
export async function fetchCatalog(): Promise<Item[]> {
  const res = await fetch('/api/catalog')
  if (!res.ok) throw new Error(`catalog request failed (${res.status})`)
  const data = (await res.json()) as { items: Item[] }
  return data.items
}
