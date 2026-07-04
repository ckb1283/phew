// Model integrity — the referential checks a database would give us for free,
// run at server boot (and in tests). A content typo becomes a failed deploy,
// never a runtime 500 waiting for the first user whose answers fire the rule.

import { CONTAINER_BY_ID, CONTAINERS, ITEM_BY_ID, ITEMS } from './catalog.js'
import { BAG_RULES, FLAG_RULES, KIT_RULES, NUDGE_RULES, SECTIONS } from './rules.js'
import { ACTIVITIES, PHILOSOPHIES, type Qty } from './types.js'

export function validateModel(): void {
  const errors: string[] = []

  // Catalog ids unique (Maps silently keep the last duplicate)
  if (ITEM_BY_ID.size !== ITEMS.length) errors.push('duplicate item ids in catalog')
  if (CONTAINER_BY_ID.size !== CONTAINERS.length) errors.push('duplicate container ids in catalog')

  // Every rule references a real item
  KIT_RULES.forEach((r, i) => {
    if (!ITEM_BY_ID.has(r.itemId)) errors.push(`KIT_RULES[${i}] references unknown item: ${r.itemId}`)
    errors.push(...ladderErrors(r.qty, `KIT_RULES[${i}] (${r.itemId})`))
  })

  // Ladders: quantities positive, thresholds strictly ascending, exactly one
  // open-ended terminal step
  function ladderErrors(qty: Qty, where: string): string[] {
    if (qty.kind !== 'ladder') return []
    const errs: string[] = []
    if (qty.steps.length === 0) errs.push(`${where}: empty ladder`)
    qty.steps.forEach((s, i) => {
      const last = i === qty.steps.length - 1
      if (s.qty <= 0) errs.push(`${where}: step ${i} has non-positive qty`)
      if (last && s.upToPersonDays !== undefined) errs.push(`${where}: terminal step must be open-ended (no upToPersonDays)`)
      if (!last && s.upToPersonDays === undefined) errs.push(`${where}: only the terminal step may omit upToPersonDays`)
      if (i > 0 && s.upToPersonDays !== undefined && qty.steps[i - 1].upToPersonDays! >= s.upToPersonDays) {
        errs.push(`${where}: ladder thresholds must be strictly ascending`)
      }
    })
    return errs
  }

  // Flag/nudge ids unique (they are API identity)
  for (const [name, list] of [['FLAG_RULES', FLAG_RULES], ['NUDGE_RULES', NUDGE_RULES]] as const) {
    const ids = new Set(list.map((r) => r.id))
    if (ids.size !== list.length) errors.push(`duplicate ids in ${name}`)
  }

  // Bag rules: one per activity, all container refs resolve, preselects come
  // from that activity's own menu
  for (const activity of ACTIVITIES) {
    const rules = BAG_RULES.filter((b) => b.activity === activity)
    if (rules.length !== 1) {
      errors.push(`expected exactly 1 bag rule for ${activity}, found ${rules.length}`)
      continue
    }
    const rule = rules[0]
    for (const id of rule.optionIds) {
      if (!CONTAINER_BY_ID.has(id)) errors.push(`bag rule ${activity} references unknown container: ${id}`)
    }
    for (const phil of PHILOSOPHIES) {
      if (!rule.optionIds.includes(rule.preselect[phil])) {
        errors.push(`bag rule ${activity}: preselect for ${phil} (${rule.preselect[phil]}) not in optionIds`)
      }
    }
  }

  // Section order values unique (ties would make section order ambiguous)
  const orders = Object.values(SECTIONS).map((s) => s.order)
  if (new Set(orders).size !== orders.length) errors.push('SECTIONS order values must be unique')

  if (errors.length > 0) {
    throw new Error(`model integrity check failed:\n  - ${errors.join('\n  - ')}`)
  }
}
