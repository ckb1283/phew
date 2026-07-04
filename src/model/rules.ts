// Phew rules — the engine's data. The architecture all three research lanes
// converge on (seed taxonomy Part 1):
//
//   kit = CORE + quantity scaling + capability tiers + modules − philosophy cuts
//
// Every rule is a row of data, not code: WHY an item enters (trigger),
// WHEN the reason applies (alsoRequires), HOW MANY (qty). Changing medical
// content means editing this file — never engine.ts.
//
// Quantity ladders are calibrated against the mock fixture: 2 people × 5 days
// (10 person-days) must reproduce design/mocks/03-results.html quantities.

import type { BagRule, Category, FlagRule, KitRule, NudgeRule, SectionMeta } from './types.js'

export const KIT_RULES: KitRule[] = [
  // --- CORE: wound closure / dressing / cleaning (taxonomy §1–3) ---
  { itemId: 'adhesive-bandages', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 3, qty: 5 }, { upToPersonDays: 10, qty: 8 }, { upToPersonDays: 20, qty: 12 }, { qty: 16 }] } },
  { itemId: 'knuckle-bandages', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 3, qty: 2 }, { upToPersonDays: 10, qty: 4 }, { qty: 6 }] }, cuttable: true },
  { itemId: 'closure-strips', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 3, qty: 3 }, { upToPersonDays: 10, qty: 6 }, { qty: 10 }] } },
  { itemId: 'gauze-pads', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 3, qty: 2 }, { upToPersonDays: 10, qty: 4 }, { qty: 8 }] } },
  { itemId: 'non-adherent-dressings', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 10, qty: 2 }, { qty: 4 }] }, cuttable: true },
  { itemId: 'conforming-gauze', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 10, qty: 1 }, { qty: 2 }] } },
  { itemId: 'antiseptic-wipes', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 3, qty: 4 }, { upToPersonDays: 10, qty: 6 }, { qty: 10 }] } },
  { itemId: 'antibiotic-ointment', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 3, qty: 2 }, { upToPersonDays: 10, qty: 4 }, { qty: 6 }] } },
  { itemId: 'elastic-bandage', trigger: { kind: 'core' }, qty: { kind: 'fixed', n: 1 } },
  // Irrigation unlocks at multi-day (T1 tier: the key field wound intervention)
  { itemId: 'irrigation-syringe', trigger: { kind: 'duration', minDays: 2 }, qty: { kind: 'fixed', n: 1 } },
  // Burn care is CORE for overnight trips — everyone cooks on flame (notes.md it.3)
  { itemId: 'burn-gel', trigger: { kind: 'duration', minDays: 2 }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 10, qty: 3 }, { qty: 4 }] } },

  // --- Blister module: attaches to foot- and saddle-powered activities (taxonomy §4) ---
  { itemId: 'leukotape', trigger: { kind: 'activity', activity: 'backpacking' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 10, qty: 10 }, { qty: 14 }] } },
  { itemId: 'leukotape', trigger: { kind: 'activity', activity: 'cycling' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 10, qty: 6 }, { qty: 10 }] } },
  { itemId: 'hydrogel-dressings', trigger: { kind: 'activity', activity: 'backpacking' }, qty: { kind: 'fixed', n: 2 }, cuttable: true },
  { itemId: 'hydrogel-dressings', trigger: { kind: 'activity', activity: 'cycling' }, qty: { kind: 'fixed', n: 2 }, cuttable: true },
  // Road rash is the cycling signature injury
  { itemId: 'film-dressings-large', trigger: { kind: 'activity', activity: 'cycling' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 10, qty: 4 }, { qty: 6 }] } },

  // --- Medications: breadth scales with days (taxonomy §7 ladder) ---
  { itemId: 'ibuprofen', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 2, qty: 4 }, { upToPersonDays: 6, qty: 8 }, { upToPersonDays: 12, qty: 12 }, { qty: 16 }] } },
  { itemId: 'diphenhydramine', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 3, qty: 4 }, { upToPersonDays: 10, qty: 6 }, { qty: 8 }] } },
  { itemId: 'acetaminophen', trigger: { kind: 'duration', minDays: 2 }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 6, qty: 6 }, { upToPersonDays: 12, qty: 8 }, { qty: 12 }] }, cuttable: true },
  // Exactly the AMK/NOLS tier: loperamide enters at 4 days
  { itemId: 'loperamide', trigger: { kind: 'duration', minDays: 4 }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 12, qty: 4 }, { qty: 6 }] } },
  // Two rules, one item: aspirin enters at multi-day OR any cardiac-age party.
  // The engine merges duplicates — this is how OR is expressed.
  { itemId: 'aspirin', trigger: { kind: 'duration', minDays: 3 }, qty: { kind: 'fixed', n: 4 } },
  { itemId: 'aspirin', trigger: { kind: 'condition', condition: 'adults-60-plus' }, qty: { kind: 'fixed', n: 4 } },
  { itemId: 'ors', trigger: { kind: 'environment', environment: 'hot-sun' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 10, qty: 4 }, { qty: 6 }] } },
  { itemId: 'aloe-packets', trigger: { kind: 'environment', environment: 'hot-sun' }, qty: { kind: 'fixed', n: 2 } },
  { itemId: 'meclizine', trigger: { kind: 'activity', activity: 'river' }, qty: { kind: 'fixed', n: 4 } },
  { itemId: 'hydrocortisone', trigger: { kind: 'environment', environment: 'poison-oak-ivy' }, qty: { kind: 'fixed', n: 4 } },
  { itemId: 'hydrocortisone', trigger: { kind: 'environment', environment: 'tropical-humid' }, qty: { kind: 'fixed', n: 4 } },

  // --- Tools: qty 1, never scaled (one forceps serves any group) ---
  { itemId: 'tweezers', trigger: { kind: 'core' }, qty: { kind: 'fixed', n: 1 } },
  { itemId: 'nitrile-gloves', trigger: { kind: 'core' }, qty: { kind: 'fixed', n: 2 } },
  { itemId: 'safety-pins', trigger: { kind: 'core' }, qty: { kind: 'fixed', n: 3 }, cuttable: true },
  { itemId: 'trauma-shears', trigger: { kind: 'person-days', min: 4 }, qty: { kind: 'fixed', n: 1 }, cuttable: true },
  { itemId: 'duct-tape', trigger: { kind: 'person-days', min: 4 }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 6, qty: 18 }, { qty: 26 }] } },
  // Documentation enters above ~7 person-days (T2 universal; cheap)
  { itemId: 'accident-form', trigger: { kind: 'person-days', min: 7 }, qty: { kind: 'fixed', n: 1 } },
  { itemId: 'tick-tool', trigger: { kind: 'environment', environment: 'ticks-insects' }, qty: { kind: 'fixed', n: 1 } },
  { itemId: 'sting-relief', trigger: { kind: 'environment', environment: 'ticks-insects' }, qty: { kind: 'fixed', n: 4 }, cuttable: true },
  // Vet wrap: river module (works wet) OR pets along
  { itemId: 'vet-wrap', trigger: { kind: 'activity', activity: 'river' }, qty: { kind: 'fixed', n: 1 } },
  { itemId: 'vet-wrap', trigger: { kind: 'pets' }, qty: { kind: 'fixed', n: 1 } },
  // CPR mask: water contexts (T3 river doctrine: it lives in the PFD)
  { itemId: 'cpr-mask', trigger: { kind: 'activity', activity: 'river' }, qty: { kind: 'fixed', n: 1 } },
  { itemId: 'cpr-mask', trigger: { kind: 'environment', environment: 'open-water' }, qty: { kind: 'fixed', n: 1 } },
  { itemId: 'emergency-blanket', trigger: { kind: 'environment', environment: 'cold-winter' }, qty: { kind: 'per-person', n: 1 } },
  { itemId: 'n95-mask', trigger: { kind: 'environment', environment: 'wildfire-smoke' }, qty: { kind: 'per-person', n: 1 } },
  { itemId: 'tecnu', trigger: { kind: 'environment', environment: 'poison-oak-ivy' }, qty: { kind: 'fixed', n: 2 } },

  // --- Trauma layer: ALWAYS OFFERED (Kellock 2026-07-03, overriding the
  // research's remoteness×training gate — a tourniquet is useless in your
  // closet). Training level gates the section copy, not the items. The
  // deeper trauma items still tier with remoteness. ---
  { itemId: 'tourniquet', trigger: { kind: 'core' }, qty: { kind: 'fixed', n: 1 } },
  { itemId: 'triangular-bandage', trigger: { kind: 'core' }, qty: { kind: 'fixed', n: 1 }, cuttable: true },
  { itemId: 'hemostatic-gauze', trigger: { kind: 'remoteness', min: 'day-plus' }, qty: { kind: 'fixed', n: 1 } },
  { itemId: 'pressure-bandage', trigger: { kind: 'remoteness', min: 'day-plus' }, qty: { kind: 'fixed', n: 1 } },
  // Snake country wants the pressure wrap regardless of remoteness
  { itemId: 'pressure-bandage', trigger: { kind: 'environment', environment: 'snake-country' }, qty: { kind: 'fixed', n: 1 } },
]

// --- Prescription flags: consult-your-physician rows, never shopping rows.
// Copy cites the sanctioned pathway (taxonomy §8). ---
export const FLAG_RULES: FlagRule[] = [
  {
    id: 'personal-rx', name: 'Personal prescriptions',
    why: 'Carry in original labeled packaging with 1–2 days extra supply.',
    trigger: { kind: 'core' },
  },
  {
    // The daily-rx-meds wizard answer must visibly change the output
    // (Kellock 2026-07-03); the core flag above stays for everyone
    id: 'group-med-plan', name: 'Group medication plan',
    why: 'Inventory daily meds, dosing schedules, and who carries what; split supplies between bags if the group may separate.',
    trigger: { kind: 'condition', condition: 'daily-rx-meds' },
  },
  {
    id: 'abx-course', name: 'Antibiotic course for skin infections',
    why: 'Indicated by trip length and distance from care. Requires prescription and dosing guidance.',
    trigger: { kind: 'remoteness', min: '12-plus' },
    alsoRequires: [{ kind: 'duration', minDays: 5 }],
  },
  {
    id: 'doxycycline', name: 'Doxycycline (tick-borne illness prophylaxis)',
    why: 'Indicated by tick exposure. Regional guidance varies; increases sun sensitivity.',
    trigger: { kind: 'environment', environment: 'ticks-insects' },
  },
  {
    id: 'epinephrine', name: 'Epinephrine auto-injector',
    why: 'Indicated by severe allergy in the group. Prescription; carry two; train companions on use.',
    trigger: { kind: 'condition', condition: 'severe-allergies' },
  },
  {
    id: 'altitude-meds', name: 'Altitude medications (acetazolamide)',
    why: 'Indicated by sleeping elevation and ascent profile. Prescription and dosing are physician calls.',
    trigger: { kind: 'environment', environment: 'high-altitude' },
  },
  {
    id: 'pediatric-dosing', name: 'Pediatric dosing & children’s formulations',
    why: 'Adult unit-dose meds do not cover kids. Weight-based dosing is a physician conversation.',
    trigger: { kind: 'kids' },
  },
]

// --- Preparedness nudges: always shown as guidance, never sold as safety.
// Without these the product gets flamed in exactly the communities that would
// otherwise evangelize it (taxonomy §12). ---
export const NUDGE_RULES: NudgeRule[] = [
  {
    id: 'get-trained', title: 'Take a wilderness first aid course',
    desc: 'Most of this kit — the trauma layer especially — assumes trained hands. A two-day WFA course covers it.',
    trigger: { kind: 'training', op: 'at-most', level: 'basic' },
  },
  {
    // at-least + at-most compose to "exactly wfa-wfr" — medical professionals
    // don't need recertification reminders from us
    id: 'keep-cert-current', title: 'Keep your WFA certification current',
    desc: 'Recertification window is 2–3 years.',
    trigger: { kind: 'training', op: 'at-least', level: 'wfa-wfr' },
    alsoRequires: [{ kind: 'training', op: 'at-most', level: 'wfa-wfr' }],
  },
  {
    id: 'satellite', title: 'Carry a satellite communicator',
    desc: 'At 12+ hours from help, evacuation is the primary treatment for serious injury.',
    trigger: { kind: 'remoteness', min: '12-plus' },
  },
  {
    id: 'group-medical', title: 'Collect your group’s medical basics',
    desc: 'Allergies, medications, and conditions for each person, before departure.',
    trigger: { kind: 'group', minPeople: 2 },
  },
  {
    // Stationed kits age quietly (taxonomy §13: expiry management replaces weight management)
    id: 'expiry-check', title: 'Calendar a yearly expiration check',
    desc: 'A trunk kit is opened when it’s needed, not before. Meds and adhesives expire.',
    trigger: { kind: 'activity', activity: 'car' },
  },
]

// --- Container suggestions: activity picks the menu, philosophy the preselect
// ("comprehensive could mean an ammo can" — notes.md iteration 3).
// DIY options lead (notes.md results iteration 4). Backpacking matches the
// mock; other activities are first-pass defaults pending their own mock. ---
export const BAG_RULES: BagRule[] = [
  {
    activity: 'backpacking',
    optionIds: ['own-bag', 'ziplock', 'ul-zip-sack', 'organizer-pouch', 'dry-pouch'],
    preselect: { ultralight: 'ziplock', balanced: 'organizer-pouch', comprehensive: 'organizer-pouch' },
  },
  {
    activity: 'river',
    optionIds: ['own-bag', 'ziplock', 'dry-pouch', 'ammo-can'],
    preselect: { ultralight: 'dry-pouch', balanced: 'dry-pouch', comprehensive: 'ammo-can' },
  },
  {
    activity: 'cycling',
    optionIds: ['own-bag', 'ziplock', 'ul-zip-sack', 'frame-bag'],
    preselect: { ultralight: 'ziplock', balanced: 'frame-bag', comprehensive: 'frame-bag' },
  },
  {
    activity: 'car',
    optionIds: ['own-bag', 'organizer-pouch', 'trunk-case'],
    preselect: { ultralight: 'trunk-case', balanced: 'trunk-case', comprehensive: 'trunk-case' },
  },
]

// --- Philosophy semantics — data, honoring the header contract that content
// never lives in engine.ts. Ultralight's meaning is the `cuttable` flags above;
// comprehensive scales ladder (consumable) quantities only.
export const PHILOSOPHY = {
  comprehensiveScale: 1.25,
} as const

// --- Sections: display metadata per category. Record<Category, …> means a new
// category cannot compile without a section — items can never fire rules yet
// render nowhere.
export const SECTIONS: Record<Category, SectionMeta> = {
  bandages: { title: 'Bandages & wound care', order: 1, note: null },
  blister: { title: 'Blister & foot care', order: 2, note: null },
  meds: { title: 'Medications', order: 3, note: 'all over-the-counter, unit-dose packets' },
  tools: { title: 'Tools & instruments', order: 4, note: null },
  trauma: {
    title: 'Trauma layer', order: 5, note: null,
    // Trauma is always offered (Kellock 2026-07-03); training gates the copy
    noteByTraining: {
      trained: 'requires training to use',
      untrained: 'get trained before you carry this — see Before you go',
    },
  },
}
