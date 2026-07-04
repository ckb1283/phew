// Phew data model — designed 2026-07-03 from the seed taxonomy
// (context/research/2026-07-03-seed-taxonomy.md) and the fields accumulated in
// design/notes.md. Lives as TypeScript now; becomes Postgres tables when
// shareable lists arrive. Each interface here maps 1:1 to a future table.

// ---------------------------------------------------------------------------
// Wizard input — the 8 questions of mock 02, as a typed value.
// Option sets mirror the mock's labels exactly; renaming a wizard option means
// changing it here too.
// ---------------------------------------------------------------------------

export type Activity = 'backpacking' | 'river' | 'cycling' | 'car'

// Ordered least→most remote; rules compare by position in this list.
export const HOURS_TO_CARE = ['under-1', 'few', '12-plus', 'day-plus'] as const
export type HoursToCare = (typeof HOURS_TO_CARE)[number]

export type Condition = 'severe-allergies' | 'adults-60-plus' | 'daily-rx-meds'

// "I'm not sure" is a real answer state, not a default: it makes the engine
// emit a pre-generation check-in instead of silently assuming "none".
export type ConditionsAnswer =
  | { kind: 'known'; conditions: Condition[] }
  | { kind: 'unsure' }

export type Environment =
  | 'high-altitude' | 'hot-sun' | 'cold-winter' | 'tropical-humid'
  | 'ticks-insects' | 'snake-country' | 'poison-oak-ivy' | 'open-water' | 'wildfire-smoke'

// Ordered least→most trained; rules compare by position in this list.
export const TRAINING_LEVELS = ['none', 'basic', 'wfa-wfr', 'medical-professional'] as const
export type Training = (typeof TRAINING_LEVELS)[number]

export type Philosophy = 'ultralight' | 'balanced' | 'comprehensive'

export interface WizardAnswers {
  activity: Activity
  people: number // everyone the kit covers, including the user
  kids: boolean
  pets: boolean
  // Always a number of days. The UI maps buckets (day trip → 1, 2–3 → 3,
  // 4–7 → 5) and week-plus sends the user's exact count — the engine never
  // sees a bucket (taxonomy: quantities scale with person-days, not labels).
  days: number
  hoursToCare: HoursToCare
  conditions: ConditionsAnswer
  environments: Environment[]
  training: Training
  philosophy: Philosophy
}

// ---------------------------------------------------------------------------
// Catalog — Item is the CONCEPT of a product (one row shared by every kit).
// Facts about a particular kit's copy of it live on ListItem, never here.
// ---------------------------------------------------------------------------

export type Category = 'bandages' | 'blister' | 'meds' | 'tools' | 'trauma'

export interface Item {
  id: string
  name: string
  // Terse clinical statement ("Closure of lacerations too wide for adhesive
  // bandages."). Product voice ruling applies. Doubles as the add-search
  // index — one field, two jobs.
  application: string
  category: Category // determines section placement — never the search origin
  unit: string // what qty counts: 'strip', '2-pack', 'pair', 'inch', …
  weightOz: number // per unit; row weight = qty × weightOz
  // Price of the retail listing (a box of bandages), counted once per kit row
  // regardless of qty — matches how the buyer actually pays.
  price: number
  retailer: string
  purchaseUrl: string
  imageUrl: string | null // peek feature; null renders "photo pending"
  imageAlt: string | null
}

export interface Container {
  id: string
  name: string
  desc: string
  weightOz: number | null // null = user-supplied (own bag, ziplock)
  price: number | null
  imageUrl: string | null
}

// ---------------------------------------------------------------------------
// Rules — the engine's data. A rule answers: WHY does an item enter a kit,
// WHEN does that reason apply, and HOW MANY. Items know what they are; rules
// know when they matter. An item can have several rules (aspirin enters at
// 3+ days OR when 60+ adults are along) — the engine merges duplicates.
// ---------------------------------------------------------------------------

export type Trigger =
  | { kind: 'core' } // unconditional
  | { kind: 'activity'; activity: Activity }
  | { kind: 'environment'; environment: Environment }
  | { kind: 'condition'; condition: Condition }
  | { kind: 'remoteness'; min: HoursToCare }
  | { kind: 'duration'; minDays: number }
  | { kind: 'person-days'; min: number } // people × days — the scaling currency
  | { kind: 'group'; minPeople: number }
  | { kind: 'kids' }
  | { kind: 'pets' }
  | { kind: 'training'; op: 'at-least' | 'at-most'; level: Training }

// Quantity is either fixed (tools never scale — one forceps serves any group),
// per-person (emergency blankets), or a person-day ladder: ordered
// [maxPersonDays, qty] steps, mirroring how AMK/NOLS actually publish tiers.
// Ladders are sub-linear by construction — the steps grow slower than
// person-days do.
export type Qty =
  | { kind: 'fixed'; n: number }
  | { kind: 'per-person'; n: number }
  | { kind: 'ladder'; steps: [maxPersonDays: number, qty: number][] }

export interface KitRule {
  itemId: string
  trigger: Trigger // the reason — powers the attribution chip on the row
  alsoRequires?: Trigger[] // AND gates (all must hold for the rule to fire)
  qty: Qty
  // Ultralight philosophy drops this item (the T3 "patch it or walk out"
  // doctrine). Removal by philosophy is a cut the user chose; removal by the
  // user is user_removed state — different facts, different owners.
  cuttable?: boolean
}

// Prescription items are NEVER shopping rows — they render as consult flags.
export interface FlagRule {
  id: string
  name: string
  why: string
  trigger: Trigger
  alsoRequires?: Trigger[]
}

// Preparedness nudges (training, beacon, group medical review) — always shown
// as guidance, never sold as safety.
export interface NudgeRule {
  id: string
  title: string
  desc: string
  trigger: Trigger
  alsoRequires?: Trigger[]
}

// Container suggestions per activity; philosophy picks the preselect
// ("comprehensive could mean an ammo can" — notes.md iteration 3).
export interface BagRule {
  activity: Activity
  optionIds: string[] // display order; DIY options first
  preselect: Record<Philosophy, string>
}

// ---------------------------------------------------------------------------
// Engine output — what POST /api/kit returns and what the results screen renders.
// ---------------------------------------------------------------------------

export interface KitItem {
  itemId: string
  name: string
  application: string
  qty: number
  unit: string
  weightOz: number // row total
  price: number
  retailer: string
  purchaseUrl: string
  imageUrl: string | null
  imageAlt: string | null
  chips: string[] // human labels of module triggers ("backpacking", "hot & sun")
}

export interface KitSection {
  category: Category
  title: string
  note: string | null
  items: KitItem[]
}

export interface Kit {
  defaultName: string // "The Weekend-Plus Backpacker" — user renames freely
  bag: {
    note: string // "suggested for backpacking · balanced"
    options: (Container & { preselected: boolean })[]
  }
  sections: KitSection[]
  flags: { name: string; why: string }[]
  nudges: { title: string; desc: string }[]
  stats: {
    itemCount: number
    totalWeightOz: number
    estCost: number
    ultralightSavingsOz: number | null // powers the re-tune line; null when already ultralight
  }
  // Answers the wizard should re-confirm before the list is trusted
  // ("I'm not sure" on conditions). Empty when everything resolved.
  checkIn: string[]
  disclaimer: string
}

// ---------------------------------------------------------------------------
// Persistence shapes (Postgres-bound; arrive with shareable lists).
// Typed now so the catalog/instance split is visible from day one:
// ListItem is Leukotape IN YOUR KIT — qty, packed, removed — while Item
// stays the shared concept.
// ---------------------------------------------------------------------------

export interface List {
  id: string // becomes the share-URL token
  name: string | null // user-given; null falls back to defaultName
  defaultName: string
  answers: WizardAnswers // kept so a list can be re-tuned later
  createdAt: string // ISO timestamp
}

export interface ListItem {
  listId: string
  itemId: string
  qty: number
  userRemoved: boolean // state, not deletion — recommendations are never silently lost
  acquired: boolean // checklist mode; a half-packed list stays half-packed
  addedByUser: boolean // provenance chip: "added by you"
}
