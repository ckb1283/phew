// Phew data model — designed 2026-07-03 from the seed taxonomy
// (context/research/2026-07-03-seed-taxonomy.md) and the fields accumulated in
// design/notes.md. Lives as TypeScript now; becomes Postgres tables when
// shareable lists arrive. Each interface here maps 1:1 to a future table.

// ---------------------------------------------------------------------------
// Wizard input — the 8 questions of mock 02, as a typed value.
// Option sets mirror the mock's labels exactly; renaming a wizard option means
// changing it here too.
// ---------------------------------------------------------------------------

// Every enum is a single `as const` array with its type derived from it —
// validate.ts and the engine import THESE, never re-declare. A value added
// here is automatically accepted at the API boundary.
export const ACTIVITIES = ['backpacking', 'river', 'cycling', 'car'] as const
export type Activity = (typeof ACTIVITIES)[number]

// Ordered least→most remote; rules compare by position in this list.
export const HOURS_TO_CARE = ['under-1', 'few', '12-plus', 'day-plus'] as const
export type HoursToCare = (typeof HOURS_TO_CARE)[number]

export const CONDITIONS = ['severe-allergies', 'adults-60-plus', 'daily-rx-meds'] as const
export type Condition = (typeof CONDITIONS)[number]

// "I'm not sure" is a real answer state, not a default: it makes the engine
// emit a pre-generation check-in instead of silently assuming "none".
export type ConditionsAnswer =
  | { kind: 'known'; conditions: Condition[] }
  | { kind: 'unsure' }

export const ENVIRONMENTS = [
  'high-altitude', 'hot-sun', 'cold-winter', 'tropical-humid',
  'ticks-insects', 'snake-country', 'poison-oak-ivy', 'open-water', 'wildfire-smoke',
] as const
export type Environment = (typeof ENVIRONMENTS)[number]

// Ordered least→most trained; rules compare by position in this list.
export const TRAINING_LEVELS = ['none', 'basic', 'wfa-wfr', 'medical-professional'] as const
export type Training = (typeof TRAINING_LEVELS)[number]

export const PHILOSOPHIES = ['ultralight', 'balanced', 'comprehensive'] as const
export type Philosophy = (typeof PHILOSOPHIES)[number]

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
  // Approximate price of the retail listing (a box of bandages), in integer
  // cents — never float dollars. Counted once per kit row regardless of qty.
  // Prices are estimates; clients display "~$". Kept current by hand until
  // retailer work lands.
  priceCents: number
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
  priceCents: number | null // integer cents, approximate; null = user-supplied
  imageUrl: string | null
}

// Section metadata is model data, not engine code. Record<Category, SectionMeta>
// makes a new Category uncompilable until it has a section — items can never
// fire rules yet silently render nowhere.
export interface SectionMeta {
  title: string
  order: number
  note: string | null
  // When set, overrides `note` based on the user's training answer (trauma).
  noteByTraining?: { trained: string; untrained: string }
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
  | { kind: 'philosophy'; is: Philosophy } // comprehensive-only items (SAM splint)

// Quantity is either fixed (tools never scale — one forceps serves any group),
// per-person (emergency blankets), or a person-day ladder mirroring how
// AMK/NOLS actually publish tiers. Steps are named objects, not tuples —
// [[3, 5]] is anonymous the moment it hits JSON or a database. The last step
// omits upToPersonDays (open-ended); no Infinity, which JSON cannot carry.
// Ladders are sub-linear by construction — steps grow slower than person-days.
export interface LadderStep {
  upToPersonDays?: number // absent on the terminal step only
  qty: number
}
export type Qty =
  | { kind: 'fixed'; n: number }
  | { kind: 'per-person'; n: number }
  | { kind: 'ladder'; steps: LadderStep[] }

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

// A chip carries its semantic identity, not just display copy — clients key,
// style, and link on kind/value; label is presentation.
export interface KitChip {
  kind: 'activity' | 'environment' | 'condition' | 'kids' | 'pets'
  value: string // the enum value ('hot-sun'), stable across copy changes
  label: string // display text ('hot & sun')
}

export interface KitItem {
  itemId: string
  name: string
  application: string
  qty: number
  unit: string
  weightOz: number // row total
  priceCents: number // approximate; display as ~$
  retailer: string
  purchaseUrl: string
  imageUrl: string | null
  imageAlt: string | null
  chips: KitChip[]
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
  // ids are stable API identity; name/why/title/desc are copy and may change
  flags: { id: string; name: string; why: string }[]
  nudges: { id: string; title: string; desc: string }[]
  stats: {
    itemCount: number
    totalWeightOz: number
    estCostCents: number // approximate; display as ~$
    ultralightSavingsOz: number | null // powers the re-tune line; null when already ultralight
  }
  // Answers the wizard should re-confirm before the list is trusted
  // ("I'm not sure" on conditions). Empty when everything resolved.
  checkIn: CheckInTopic[]
  disclaimer: string
}

export type CheckInTopic = 'conditions'

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
