// The Phew rules engine — a pure function: same answers in, same kit out.
// No I/O, no randomness, no clock. All medical content lives in model/rules.ts
// and model/catalog.ts; this file only evaluates it.

import { CONTAINER_BY_ID, ITEM_BY_ID, ITEMS } from './model/catalog.js'
import { BAG_RULES, FLAG_RULES, KIT_RULES, NUDGE_RULES, PHILOSOPHY, SECTIONS } from './model/rules.js'
import {
  ACTIVITY_FAMILY,
  HOURS_TO_CARE,
  TRAINING_LEVELS,
  type Activity,
  type ActivityFamily,
  type Category,
  type Condition,
  type Environment,
  type Item,
  type Kit,
  type KitChip,
  type KitItem,
  type KitRule,
  type Philosophy,
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
    case 'activityFamily':
      return ACTIVITY_FAMILY[a.activity] === t.family
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
    case 'philosophy':
      return a.philosophy === t.is
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
      // Integrity guarantees ascending steps with an open-ended terminal step,
      // so the terminal step is the guaranteed fallback.
      const step = qty.steps.find((s) => s.upToPersonDays !== undefined && personDays <= s.upToPersonDays)
        ?? qty.steps[qty.steps.length - 1]
      return { n: step.qty, scalable: true }
    }
  }
}

// --- Rule resolution ------------------------------------------------------------
// The core pipeline, parameterized by philosophy so savings can be computed by
// running it twice (current philosophy vs ultralight) and diffing weight.

interface FiredEntry {
  item: Item
  qty: number
  rules: KitRule[]
}

const CATALOG_INDEX = new Map(ITEMS.map((item, i) => [item.id, i]))

// A car kit is STATIONED, not a trip (taxonomy §13): it doesn't scale by one outing's
// length — it's stocked like a well-provisioned multi-day kit and managed by expiry,
// not weight. Pin its effective trip length here so days/duration/person-days logic
// treats it as generously provisioned regardless of the duration answered.
const STATIONED_DAYS = 14

function fireEntries(base: WizardAnswers, philosophy: Philosophy): FiredEntry[] {
  // The philosophy parameter overrides the answer everywhere — including the
  // philosophy TRIGGER, so a hypothetical ultralight rebuild also drops
  // comprehensive-only items (SAM splint). The savings figure stays honest.
  const a: WizardAnswers = {
    ...base,
    philosophy,
    days: base.activity === 'car' ? STATIONED_DAYS : base.days,
  }

  // 1. Evaluate every rule; merge firing rules by item. An item entering
  //    through several rules (aspirin: multi-day OR 60+) becomes one row:
  //    max quantity, all rules kept (chips union), cuttable only if unanimous.
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

  // 2. Philosophy. Comprehensive scales consumable (ladder) quantities;
  //    ultralight drops rows where every firing rule marked itself cuttable.
  const entries: FiredEntry[] = []
  for (const [itemId, entry] of fired) {
    if (philosophy === 'comprehensive' && entry.scalable) {
      entry.qty = Math.ceil(entry.qty * PHILOSOPHY.comprehensiveScale)
    }
    // Ultralight never trims a car kit — a trunk has no weight budget (taxonomy §13).
    if (philosophy === 'ultralight' && a.activity !== 'car' && entry.rules.every((r) => r.cuttable)) continue
    const item = ITEM_BY_ID.get(itemId)
    if (!item) throw new Error(`rule references unknown item: ${itemId}`) // integrity backstop
    entries.push({ item, qty: entry.qty, rules: entry.rules })
  }

  // 3. Deterministic order: catalog position, never rules-file layout.
  return entries.sort((x, y) => CATALOG_INDEX.get(x.item.id)! - CATALOG_INDEX.get(y.item.id)!)
}

const entriesWeightOz = (entries: FiredEntry[]) =>
  entries.reduce((s, e) => s + e.qty * e.item.weightOz, 0)

// --- Attribution chips --------------------------------------------------------
// Only module triggers chip; core/scaling/tier arrivals stay unlabeled — the
// row not needing an excuse is what "core" means. Chips carry kind+value as
// stable identity; label is presentation.

const ACTIVITY_LABEL: Record<Activity, string> = {
  backpacking: 'hiking & backpacking',
  kayaking: 'kayaking', rafting: 'rafting', canoeing: 'canoeing',
  'road-cycling': 'road cycling', bikepacking: 'bikepacking', car: 'car',
}
const FAMILY_LABEL: Record<ActivityFamily, string> = {
  foot: 'on foot', water: 'paddling', wheel: 'cycling', vehicle: 'car kit',
}
const ENVIRONMENT_LABEL: Record<Environment, string> = {
  'high-altitude': 'altitude', 'hot-sun': 'hot & sun', 'cold-winter': 'cold',
  'tropical-humid': 'tropical', 'ticks-insects': 'ticks & insects', 'snake-country': 'snakes',
  'poison-oak-ivy': 'poison oak', 'open-water': 'open water', 'wildfire-smoke': 'wildfire smoke',
}
const CONDITION_LABEL: Record<Condition, string> = {
  'severe-allergies': 'allergies', 'adults-60-plus': '60+', 'daily-rx-meds': 'daily meds',
}

function chip(t: Trigger): KitChip | null {
  switch (t.kind) {
    case 'activity': return { kind: 'activity', value: t.activity, label: ACTIVITY_LABEL[t.activity] }
    case 'activityFamily': return { kind: 'activity', value: t.family, label: FAMILY_LABEL[t.family] }
    case 'environment': return { kind: 'environment', value: t.environment, label: ENVIRONMENT_LABEL[t.environment] }
    case 'condition': return { kind: 'condition', value: t.condition, label: CONDITION_LABEL[t.condition] }
    case 'kids': return { kind: 'kids', value: 'kids', label: 'kids' }
    case 'pets': return { kind: 'pets', value: 'pets', label: 'pets' }
    default: return null
  }
}

// --- Default kit name -----------------------------------------------------------

function defaultName(a: WizardAnswers): string {
  if (a.activity === 'car') return 'The Car Kit'
  const dur = a.days <= 1 ? 'Day-Trip' : a.days <= 3 ? 'Weekend' : a.days <= 7 ? 'Weekend-Plus' : 'Expedition'
  const noun: Record<Exclude<Activity, 'car'>, string> = {
    backpacking: 'Backpacker',
    kayaking: 'Kayaker', rafting: 'Rafter', canoeing: 'Canoeist',
    'road-cycling': 'Rider', bikepacking: 'Bikepacker',
  }
  return `The ${dur} ${noun[a.activity]}`
}

const DISCLAIMER =
  'A checklist to review and own — not medical advice, and no substitute for training. ' +
  'Quantities derived from published guidance and industry practice. In an emergency, call 911.'

// --- The engine -----------------------------------------------------------------

export function buildKit(a: WizardAnswers): Kit {
  const entries = fireEntries(a, a.philosophy)

  // Materialize rows.
  const rows: KitItem[] = entries.map(({ item, qty, rules }) => {
    const chips: KitChip[] = []
    for (const rule of rules) {
      const c = chip(rule.trigger)
      if (c && !chips.some((x) => x.kind === c.kind && x.value === c.value)) chips.push(c)
    }
    return {
      itemId: item.id,
      name: item.name,
      application: item.application,
      qty,
      unit: item.unit,
      weightOz: Math.round(qty * item.weightOz * 100) / 100,
      priceCents: item.priceCents,
      retailer: item.retailer,
      purchaseUrl: item.purchaseUrl,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
      chips,
    }
  })

  // Sections, ordered by model metadata; row order is catalog order (above).
  const trainedForTrauma = TRAINING_LEVELS.indexOf(a.training) >= TRAINING_LEVELS.indexOf('wfa-wfr')
  const sections = (Object.entries(SECTIONS) as [Category, (typeof SECTIONS)[Category]][])
    .sort(([, x], [, y]) => x.order - y.order)
    .map(([category, meta]) => ({
      category,
      title: meta.title,
      note: meta.noteByTraining
        ? (trainedForTrauma ? meta.noteByTraining.trained : meta.noteByTraining.untrained)
        : meta.note,
      items: rows.filter((r) => ITEM_BY_ID.get(r.itemId)!.category === category),
    }))
    .filter((s) => s.items.length > 0)

  // Flags and nudges — same trigger algebra, different outputs. ids are API identity.
  const flags = FLAG_RULES.filter((f) => ruleFires(f, a)).map(({ id, name, why }) => ({ id, name, why }))
  const nudges = NUDGE_RULES.filter((n) => ruleFires(n, a)).map(({ id, title, desc }) => ({ id, title, desc }))

  // Bag options. Wet environments (open water, tropical humidity) prefer a waterproof
  // dry pouch over the activity's default, when that activity offers one.
  const bagRule = BAG_RULES.find((b) => b.activity === a.activity)
  if (!bagRule) throw new Error(`no bag rule for activity: ${a.activity}`) // integrity backstop
  const wet = a.environments.includes('open-water') || a.environments.includes('tropical-humid')
  const preselectId =
    wet && bagRule.optionIds.includes('dry-pouch') ? 'dry-pouch' : bagRule.preselect[a.philosophy]
  const bagOptions = bagRule.optionIds.map((id) => ({ ...CONTAINER_BY_ID.get(id)!, preselected: id === preselectId }))

  // Stats. Cost counts each row's retail listing once — qty tells you how many
  // to pack, not how many boxes to buy. Savings is honest: the actual weight
  // difference between this kit and the same answers rebuilt as ultralight.
  const totalWeightOz = Math.round(entriesWeightOz(entries) * 10) / 10
  const estCostCents = rows.reduce((s, r) => s + r.priceCents, 0)
  // No weight-cut story for a stationed car kit — weight is no object by design.
  const ultralightSavingsOz =
    a.philosophy === 'ultralight' || a.activity === 'car'
      ? null
      : Math.round((entriesWeightOz(entries) - entriesWeightOz(fireEntries(a, 'ultralight'))) * 10) / 10

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
      estCostCents,
      ultralightSavingsOz,
    },
    checkIn: a.conditions.kind === 'unsure' ? ['conditions'] : [],
    disclaimer: DISCLAIMER,
  }
}
