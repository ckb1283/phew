import type { Condition, Item, ItemContent, Kit, WizardAnswers } from '@model/types'

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

// The full item catalog (also powers add-search).
export async function fetchCatalog(): Promise<Item[]> {
  const res = await fetch('/api/catalog')
  if (!res.ok) throw new Error(`catalog request failed (${res.status})`)
  const data = (await res.json()) as { items: Item[] }
  return data.items
}

// One item + its editorial content for the detail page. null means the id is
// unknown (a real 404), distinct from a thrown network error — the page shows a
// "not in the catalog" state for null and keeps loading/erroring separate.
export type ItemDetail = { item: Item; content: ItemContent | null }

export async function fetchItem(id: string): Promise<ItemDetail | null> {
  const res = await fetch(`/api/item/${encodeURIComponent(id)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`item request failed (${res.status})`)
  return res.json()
}
