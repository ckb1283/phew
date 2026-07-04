// The Phew rules engine — a pure function: same answers in, same kit out.
// No I/O, no randomness, no clock. All medical content lives in model/rules.ts
// and model/catalog.ts; this file only evaluates it.

import { CONTAINER_BY_ID, ITEM_BY_ID } from './model/catalog.js'
import { BAG_RULES, FLAG_RULES, KIT_RULES, NUDGE_RULES } from './model/rules.js'
import {
  HOURS_TO_CARE,
  TRAINING_LEVELS,
  type Activity,
  type Category,
  type Condition,
  type Environment,
  type Kit,
  type KitItem,
  type KitRule,
  type Qty,
  type Trigger,
  type WizardAnswers,
} from './model/types.js'

// --- Trigger evaluation -----------------------------------------------------

function fires(t: Trigger, a: WizardAnswers): boolean {
  switch (t.kind) {
    case 'core':
      return true
    case 'activity':
      return a.activity === t.activity
    case 'environment':
      return a.environments.includes(t.environment)
    case 'condition':
      // "unsure" fires nothing — the check-in handles it, never a silent guess
      return a.conditions.kind === 'known' && a.conditions.conditions.includes(t.condition)
    case 'remoteness':
      return HOURS_TO_CARE.indexOf(a.hoursToCare) >= HOURS_TO_CARE.indexOf(t.min)
    case 'duration':
      return a.days >= t.minDays
    case 'person-days':
      return a.people * a.days >= t.min
    case 'group':
      return a.people >= t.minPeople
    case 'kids':
      return a.kids
    case 'pets':
      return a.pets
    case 'training': {
      const idx = TRAINING_LEVELS.indexOf(a.training)
      const ref = TRAINING_LEVELS.indexOf(t.level)
      return t.op === 'at-least' ? idx >= ref : idx <= ref
    }
  }
}

function ruleFires(rule: { trigger: Trigger; alsoRequires?: Trigger[] }, a: WizardAnswers): boolean {
  return fires(rule.trigger, a) && (rule.alsoRequires ?? []).every((t) => fires(t, a))
}

// --- Quantities ---------------------------------------------------------------

function resolveQty(qty: Qty, a: WizardAnswers): { n: number; scalable: boolean } {
  switch (qty.kind) {
    case 'fixed':
      return { n: qty.n, scalable: false }
    case 'per-person':
      return { n: qty.n * a.people, scalable: false }
    case 'ladder': {
      const personDays = a.people * a.days
      const step = qty.steps.find(([max]) => personDays <= max) ?? qty.steps[qty.steps.length - 1]
      return { n: step[1], scalable: true }
    }
  }
}

// --- Attribution chips --------------------------------------------------------
// Only module triggers chip; core/scaling/tier arrivals stay unlabeled — the
// row not needing an excuse is what "core" means.

const ACTIVITY_LABEL: Record<Activity, string> = {
  backpacking: 'backpacking', river: 'river & paddling', cycling: 'cycling', car: 'car',
}
const ENVIRONMENT_LABEL: Record<Environment, string> = {
  'high-altitude': 'altitude', 'hot-sun': 'hot & sun', 'cold-winter': 'cold',
  'tropical-humid': 'tropical', 'ticks-insects': 'ticks & insects', 'snake-country': 'snakes',
  'poison-oak-ivy': 'poison oak', 'open-water': 'open water', 'wildfire-smoke': 'wildfire smoke',
}
const CONDITION_LABEL: Record<Condition, string> = {
  'severe-allergies': 'allergies', 'adults-60-plus': '60+', 'daily-rx-meds': 'daily meds',
}

function chipLabel(t: Trigger): string | null {
  switch (t.kind) {
    case 'activity': return ACTIVITY_LABEL[t.activity]
    case 'environment': return ENVIRONMENT_LABEL[t.environment]
    case 'condition': return CONDITION_LABEL[t.condition]
    case 'kids': return 'kids'
    case 'pets': return 'pets'
    default: return null
  }
}

// --- Sections -----------------------------------------------------------------

const SECTION_ORDER: { category: Category; title: string; note: string | null }[] = [
  { category: 'bandages', title: 'Bandages & wound care', note: null },
  { category: 'blister', title: 'Blister & foot care', note: null },
  { category: 'meds', title: 'Medications', note: 'all over-the-counter, unit-dose packets' },
  { category: 'tools', title: 'Tools & instruments', note: null },
  { category: 'trauma', title: 'Trauma layer', note: null }, // note set per training below
]

// --- Default kit name -----------------------------------------------------------

function defaultName(a: WizardAnswers): string {
  if (a.activity === 'car') return 'The Car Kit'
  const dur = a.days <= 1 ? 'Day-Trip' : a.days <= 3 ? 'Weekend' : a.days <= 7 ? 'Weekend-Plus' : 'Expedition'
  const noun: Record<Exclude<Activity, 'car'>, string> = {
    backpacking: 'Backpacker', river: 'Paddler', cycling: 'Rider',
  }
  return `The ${dur} ${noun[a.activity]}`
}

const DISCLAIMER =
  'A checklist to review and own — not medical advice, and no substitute for training. ' +
  'Quantities derived from published guidance and industry practice. In an emergency, call 911.'

// --- The engine -----------------------------------------------------------------

export function buildKit(a: WizardAnswers): Kit {
  // 1. Evaluate every rule; group the firing ones by item. An item entering
  //    through several rules (aspirin: multi-day OR 60+) merges into one row:
  //    max quantity, union of chips, cuttable only if every reason says so.
  const fired = new Map<string, { rules: KitRule[]; qty: number; scalable: boolean }>()
  for (const rule of KIT_RULES) {
    if (!ruleFires(rule, a)) continue
    const { n, scalable } = resolveQty(rule.qty, a)
    const prev = fired.get(rule.itemId)
    if (prev) {
      prev.rules.push(rule)
      prev.qty = Math.max(prev.qty, n)
      prev.scalable = prev.scalable || scalable
    } else {
      fired.set(rule.itemId, { rules: [rule], qty: n, scalable })
    }
  }

  // 2. Philosophy. Comprehensive: scalable (ladder) quantities up 25%.
  //    Ultralight: drop rows where every firing rule is cuttable.
  //    The savings figure is computed either way — it powers the re-tune line.
  let ultralightSavingsOz = 0
  for (const [itemId, entry] of fired) {
    if (a.philosophy === 'comprehensive' && entry.scalable) {
      entry.qty = Math.ceil(entry.qty * 1.25)
    }
    const cuttable = entry.rules.every((r) => r.cuttable)
    if (cuttable) {
      const item = ITEM_BY_ID.get(itemId)!
      ultralightSavingsOz += entry.qty * item.weightOz
      if (a.philosophy === 'ultralight') fired.delete(itemId)
    }
  }

  // 3. Materialize rows.
  const rows: KitItem[] = []
  for (const [itemId, entry] of fired) {
    const item = ITEM_BY_ID.get(itemId)
    if (!item) throw new Error(`rule references unknown item: ${itemId}`)
    const chips = [...new Set(entry.rules.map((r) => chipLabel(r.trigger)).filter((c): c is string => c !== null))]
    rows.push({
      itemId: item.id,
      name: item.name,
      application: item.application,
      qty: entry.qty,
      unit: item.unit,
      weightOz: Math.round(entry.qty * item.weightOz * 100) / 100,
      price: item.price,
      retailer: item.retailer,
      purchaseUrl: item.purchaseUrl,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
      chips,
    })
  }

  // 4. Sections, in catalog order within fixed section order.
  const trainedForTrauma = TRAINING_LEVELS.indexOf(a.training) >= TRAINING_LEVELS.indexOf('wfa-wfr')
  const sections = SECTION_ORDER.map(({ category, title, note }) => ({
    category,
    title,
    note:
      category === 'trauma'
        ? trainedForTrauma
          ? 'requires training to use'
          : 'get trained before you carry this — see Before you go'
        : note,
    items: rows.filter((r) => ITEM_BY_ID.get(r.itemId)!.category === category),
  })).filter((s) => s.items.length > 0)

  // 5. Flags and nudges — same trigger algebra, different outputs.
  const flags = FLAG_RULES.filter((f) => ruleFires(f, a)).map(({ name, why }) => ({ name, why }))
  const nudges = NUDGE_RULES.filter((n) => ruleFires(n, a)).map(({ title, desc }) => ({ title, desc }))

  // 6. Bag options.
  const bagRule = BAG_RULES.find((b) => b.activity === a.activity)
  if (!bagRule) throw new Error(`no bag rule for activity: ${a.activity}`)
  const preselectId = bagRule.preselect[a.philosophy]
  const bagOptions = bagRule.optionIds.map((id) => {
    const c = CONTAINER_BY_ID.get(id)
    if (!c) throw new Error(`bag rule references unknown container: ${id}`)
    return { ...c, preselected: id === preselectId }
  })

  // 7. Stats. Cost counts each row's retail listing once — qty tells you how
  //    many to pack, not how many boxes to buy.
  const totalWeightOz = Math.round(rows.reduce((s, r) => s + r.weightOz, 0) * 10) / 10
  const estCost = Math.round(rows.reduce((s, r) => s + r.price, 0))

  return {
    defaultName: defaultName(a),
    bag: {
      note: `suggested for ${ACTIVITY_LABEL[a.activity]} · ${a.philosophy}`,
      options: bagOptions,
    },
    sections,
    flags,
    nudges,
    stats: {
      itemCount: rows.length,
      totalWeightOz,
      estCost,
      ultralightSavingsOz: a.philosophy === 'ultralight' ? null : Math.round(ultralightSavingsOz * 10) / 10,
    },
    checkIn: a.conditions.kind === 'unsure' ? ['conditions'] : [],
    disclaimer: DISCLAIMER,
  }
}
