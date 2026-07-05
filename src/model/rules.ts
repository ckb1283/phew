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
  { itemId: 'adhesive-bandages', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 3, qty: 5 }, { upToPersonDays: 10, qty: 8 }, { upToPersonDays: 20, qty: 12 }, { upToPersonDays: 40, qty: 24 }, { qty: 36 }] } },
  { itemId: 'knuckle-bandages', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 3, qty: 2 }, { upToPersonDays: 10, qty: 4 }, { upToPersonDays: 20, qty: 8 }, { upToPersonDays: 40, qty: 12 }, { qty: 18 }] }, cuttable: true },
  { itemId: 'closure-strips', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 3, qty: 3 }, { upToPersonDays: 10, qty: 6 }, { upToPersonDays: 20, qty: 14 }, { upToPersonDays: 40, qty: 22 }, { qty: 32 }] } },
  { itemId: 'gauze-pads', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 3, qty: 2 }, { upToPersonDays: 10, qty: 4 }, { upToPersonDays: 20, qty: 12 }, { upToPersonDays: 40, qty: 18 }, { qty: 26 }] } },
  { itemId: 'non-adherent-dressings', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 10, qty: 2 }, { upToPersonDays: 20, qty: 6 }, { upToPersonDays: 40, qty: 10 }, { qty: 14 }] }, cuttable: true },
  { itemId: 'conforming-gauze', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 10, qty: 1 }, { upToPersonDays: 20, qty: 3 }, { upToPersonDays: 40, qty: 5 }, { qty: 7 }] } },
  { itemId: 'antiseptic-wipes', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 3, qty: 4 }, { upToPersonDays: 10, qty: 6 }, { upToPersonDays: 20, qty: 16 }, { upToPersonDays: 40, qty: 26 }, { qty: 38 }] } },
  { itemId: 'antibiotic-ointment', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 3, qty: 2 }, { upToPersonDays: 10, qty: 4 }, { upToPersonDays: 20, qty: 8 }, { upToPersonDays: 40, qty: 12 }, { qty: 16 }] } },
  { itemId: 'elastic-bandage', trigger: { kind: 'core' }, qty: { kind: 'fixed', n: 1 } },
  // Catalog v0.3 core additions (research pass 2026-07-04)
  { itemId: 'liquid-bandage', trigger: { kind: 'core' }, qty: { kind: 'fixed', n: 1 }, cuttable: true }, // redundant closure — ultralight keeps steri-strips + tape
  { itemId: 'cloth-tape', trigger: { kind: 'core' }, qty: { kind: 'fixed', n: 1 } },
  // Antisepsis backup when clean water is uncertain (remote tier)
  { itemId: 'povidone-iodine', trigger: { kind: 'remoteness', min: '12-plus' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 10, qty: 4 }, { upToPersonDays: 20, qty: 10 }, { upToPersonDays: 40, qty: 16 }, { qty: 24 }] } },
  // Absorbency tiers: 5×9 with any multi-day party, 8×10 at group scale
  { itemId: 'trauma-pad-5x9', trigger: { kind: 'person-days', min: 4 }, qty: { kind: 'fixed', n: 2 } },
  { itemId: 'trauma-pad-8x10', trigger: { kind: 'group', minPeople: 4 }, qty: { kind: 'fixed', n: 2 } },
  // Irrigation is the key field wound intervention — its value IS distance from care.
  // Fires on remoteness (taxonomy §3) OR multi-day duration. Two rules = OR.
  { itemId: 'irrigation-syringe', trigger: { kind: 'remoteness', min: '12-plus' }, qty: { kind: 'fixed', n: 1 } },
  { itemId: 'irrigation-syringe', trigger: { kind: 'duration', minDays: 2 }, qty: { kind: 'fixed', n: 1 } },
  // Burn care is CORE for overnight trips — everyone cooks on flame (notes.md it.3)
  { itemId: 'burn-gel', trigger: { kind: 'duration', minDays: 2 }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 10, qty: 3 }, { upToPersonDays: 20, qty: 6 }, { upToPersonDays: 40, qty: 9 }, { qty: 12 }] } },

  // --- Blister module: attaches to foot- and saddle-powered activities (taxonomy §4) ---
  { itemId: 'leukotape', trigger: { kind: 'activity', activity: 'backpacking' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 10, qty: 10 }, { upToPersonDays: 20, qty: 22 }, { upToPersonDays: 40, qty: 34 }, { qty: 48 }] } },
  { itemId: 'leukotape', trigger: { kind: 'activityFamily', family: 'wheel' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 10, qty: 6 }, { upToPersonDays: 20, qty: 16 }, { upToPersonDays: 40, qty: 24 }, { qty: 36 }] } },
  // Blister TREATMENT scales with foot/saddle mileage like prevention does (was fixed 2)
  { itemId: 'hydrogel-dressings', trigger: { kind: 'activity', activity: 'backpacking' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 10, qty: 2 }, { upToPersonDays: 20, qty: 4 }, { upToPersonDays: 40, qty: 6 }, { qty: 10 }] }, cuttable: true },
  { itemId: 'hydrogel-dressings', trigger: { kind: 'activityFamily', family: 'wheel' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 10, qty: 2 }, { upToPersonDays: 20, qty: 4 }, { upToPersonDays: 40, qty: 6 }, { qty: 10 }] }, cuttable: true },
  // Road rash is the cycling signature injury
  { itemId: 'film-dressings-large', trigger: { kind: 'activityFamily', family: 'wheel' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 10, qty: 4 }, { upToPersonDays: 20, qty: 9 }, { upToPersonDays: 40, qty: 14 }, { qty: 20 }] } },

  // --- Medications: breadth scales with days (taxonomy §7 ladder) ---
  { itemId: 'ibuprofen', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 2, qty: 4 }, { upToPersonDays: 6, qty: 8 }, { upToPersonDays: 12, qty: 12 }, { upToPersonDays: 30, qty: 28 }, { upToPersonDays: 60, qty: 48 }, { qty: 72 }] } },
  { itemId: 'diphenhydramine', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 3, qty: 4 }, { upToPersonDays: 10, qty: 6 }, { upToPersonDays: 20, qty: 12 }, { upToPersonDays: 40, qty: 20 }, { qty: 30 }] } },
  // Declared severe allergies: a single sustained reaction burns ~8-12 tabs (25-50 mg
  // q4-6h for 24-48h) — a per-patient floor, independent of party-day scaling (merged via max).
  { itemId: 'diphenhydramine', trigger: { kind: 'condition', condition: 'severe-allergies' }, qty: { kind: 'fixed', n: 12 } },
  // NOT cuttable: the second analgesic (taxonomy pairs it with ibuprofen) — ultralight
  // should never leave you with only one painkiller.
  { itemId: 'acetaminophen', trigger: { kind: 'duration', minDays: 2 }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 6, qty: 6 }, { upToPersonDays: 12, qty: 8 }, { upToPersonDays: 30, qty: 20 }, { upToPersonDays: 60, qty: 32 }, { qty: 44 }] } },
  // Exactly the AMK/NOLS tier: loperamide enters at 4 days
  { itemId: 'loperamide', trigger: { kind: 'duration', minDays: 4 }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 12, qty: 4 }, { upToPersonDays: 30, qty: 8 }, { upToPersonDays: 60, qty: 12 }, { qty: 16 }] } },
  // Two rules, one item: aspirin enters at multi-day OR any cardiac-age party.
  // The engine merges duplicates — this is how OR is expressed.
  { itemId: 'aspirin', trigger: { kind: 'duration', minDays: 3 }, qty: { kind: 'fixed', n: 4 } },
  // Cardiac-age party: enough for a loading dose plus spares, not a single event's worth
  { itemId: 'aspirin', trigger: { kind: 'condition', condition: 'adults-60-plus' }, qty: { kind: 'fixed', n: 12 } },
  { itemId: 'ors', trigger: { kind: 'environment', environment: 'hot-sun' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 10, qty: 4 }, { upToPersonDays: 20, qty: 10 }, { upToPersonDays: 40, qty: 16 }, { qty: 24 }] } },
  { itemId: 'aloe-packets', trigger: { kind: 'environment', environment: 'hot-sun' }, qty: { kind: 'fixed', n: 2 } },
  { itemId: 'meclizine', trigger: { kind: 'activityFamily', family: 'water' }, qty: { kind: 'fixed', n: 4 } },
  // Core topical (taxonomy: hydrocortisone is core across all lanes) — itch, rash,
  // allergic skin, plant contact, bites, chafing. Poison-oak exposure gets a higher floor.
  { itemId: 'hydrocortisone', trigger: { kind: 'core' }, qty: { kind: 'fixed', n: 4 } },
  { itemId: 'hydrocortisone', trigger: { kind: 'environment', environment: 'poison-oak-ivy' }, qty: { kind: 'fixed', n: 6 } },
  // Fungal skin infection is the tropical-humid signature ailment — promoted from search-only
  { itemId: 'antifungal-cream', trigger: { kind: 'environment', environment: 'tropical-humid' }, qty: { kind: 'fixed', n: 4 } },
  // Week-plus gut coverage (taxonomy §7)
  { itemId: 'antacid', trigger: { kind: 'duration', minDays: 7 }, qty: { kind: 'fixed', n: 6 }, cuttable: true },
  // Hypothermia sugar: river doctrine OR winter (T3)
  { itemId: 'honey-packets', trigger: { kind: 'activityFamily', family: 'water' }, qty: { kind: 'fixed', n: 2 } },
  { itemId: 'honey-packets', trigger: { kind: 'environment', environment: 'cold-winter' }, qty: { kind: 'fixed', n: 2 } },

  // --- Tools: qty 1, never scaled (one forceps serves any group) ---
  { itemId: 'tweezers', trigger: { kind: 'core' }, qty: { kind: 'fixed', n: 1 } },
  // Gloves are the exception to "tools don't scale" — 2 per patient contact, plus spares
  { itemId: 'nitrile-gloves', trigger: { kind: 'core' }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 10, qty: 2 }, { upToPersonDays: 20, qty: 4 }, { upToPersonDays: 40, qty: 6 }, { qty: 8 }] } },
  { itemId: 'safety-pins', trigger: { kind: 'core' }, qty: { kind: 'fixed', n: 3 }, cuttable: true },
  // Proximity trim: splinting / self-evac tools need distance from care (≥ few hrs) —
  // a trip under an hour from the ER splints a fracture by driving there. Bleeding
  // control (tourniquet, trauma pads) is NOT trimmed: hemorrhage kills before evac.
  { itemId: 'trauma-shears', trigger: { kind: 'person-days', min: 4 }, alsoRequires: [{ kind: 'remoteness', min: 'few' }], qty: { kind: 'fixed', n: 1 }, cuttable: true },
  { itemId: 'duct-tape', trigger: { kind: 'person-days', min: 4 }, qty: { kind: 'ladder', steps: [{ upToPersonDays: 6, qty: 18 }, { upToPersonDays: 10, qty: 26 }, { upToPersonDays: 20, qty: 34 }, { upToPersonDays: 40, qty: 48 }, { qty: 64 }] } },
  // Documentation enters above ~7 person-days (T2 universal; cheap)
  { itemId: 'accident-form', trigger: { kind: 'person-days', min: 7 }, qty: { kind: 'fixed', n: 1 } },
  // T2 ships a reference book at every tier ≥4 days
  { itemId: 'reference-guide', trigger: { kind: 'duration', minDays: 4 }, qty: { kind: 'fixed', n: 1 }, cuttable: true },
  { itemId: 'tick-tool', trigger: { kind: 'environment', environment: 'ticks-insects' }, qty: { kind: 'fixed', n: 1 } },
  { itemId: 'sting-relief', trigger: { kind: 'environment', environment: 'ticks-insects' }, qty: { kind: 'fixed', n: 4 }, cuttable: true },
  // Vet wrap: river module (works wet) OR pets along
  { itemId: 'vet-wrap', trigger: { kind: 'activityFamily', family: 'water' }, qty: { kind: 'fixed', n: 1 } },
  { itemId: 'vet-wrap', trigger: { kind: 'pets' }, qty: { kind: 'fixed', n: 1 } },
  // CPR mask: water contexts (T3 river doctrine: it lives in the PFD)
  { itemId: 'cpr-mask', trigger: { kind: 'activityFamily', family: 'water' }, qty: { kind: 'fixed', n: 1 } },
  { itemId: 'cpr-mask', trigger: { kind: 'environment', environment: 'open-water' }, qty: { kind: 'fixed', n: 1 } },
  // Taxonomy §9: CPR barrier tiers on "group OR water" — the group case was missing
  { itemId: 'cpr-mask', trigger: { kind: 'group', minPeople: 4 }, qty: { kind: 'fixed', n: 1 } },
  // Rewarming/shelter isn't cold-only: immersion (open water) and serious injury far
  // from care both call for it. Per-person, merged via max.
  { itemId: 'emergency-blanket', trigger: { kind: 'environment', environment: 'cold-winter' }, qty: { kind: 'per-person', n: 1 } },
  { itemId: 'emergency-blanket', trigger: { kind: 'environment', environment: 'open-water' }, qty: { kind: 'per-person', n: 1 } },
  { itemId: 'emergency-blanket', trigger: { kind: 'remoteness', min: 'day-plus' }, qty: { kind: 'per-person', n: 1 } },
  // Two per person: N95s lose fit/filtration once damp, soiled, or crushed
  { itemId: 'n95-mask', trigger: { kind: 'environment', environment: 'wildfire-smoke' }, qty: { kind: 'per-person', n: 2 } },
  { itemId: 'tecnu', trigger: { kind: 'environment', environment: 'poison-oak-ivy' }, qty: { kind: 'fixed', n: 2 } },

  // --- Trauma layer: ALWAYS OFFERED (Kellock 2026-07-03, overriding the
  // research's remoteness×training gate — a tourniquet is useless in your
  // closet). Training level gates the section copy, not the items. The
  // deeper trauma items still tier with remoteness. ---
  { itemId: 'tourniquet', trigger: { kind: 'core' }, qty: { kind: 'fixed', n: 1 } },
  // Spare tourniquet (taxonomy T1 "carry ≥1 spare") where trauma is most likely and
  // weight allows: deep backcountry and vehicle kits. Merged via max.
  { itemId: 'tourniquet', trigger: { kind: 'remoteness', min: 'day-plus' }, qty: { kind: 'fixed', n: 2 } },
  { itemId: 'tourniquet', trigger: { kind: 'activity', activity: 'car' }, qty: { kind: 'fixed', n: 2 } },
  { itemId: 'triangular-bandage', trigger: { kind: 'core' }, qty: { kind: 'fixed', n: 1 }, cuttable: true },
  // Hemorrhage-control layer: deep remoteness OR vehicle-based (roadside trauma, taxonomy §6)
  { itemId: 'hemostatic-gauze', trigger: { kind: 'remoteness', min: 'day-plus' }, qty: { kind: 'fixed', n: 1 } },
  { itemId: 'hemostatic-gauze', trigger: { kind: 'activity', activity: 'car' }, qty: { kind: 'fixed', n: 1 } },
  { itemId: 'pressure-bandage', trigger: { kind: 'remoteness', min: 'day-plus' }, qty: { kind: 'fixed', n: 1 } },
  { itemId: 'pressure-bandage', trigger: { kind: 'activity', activity: 'car' }, qty: { kind: 'fixed', n: 1 } },
  // Severity tier: deep remoteness AND wilderness training (taxonomy §6)
  { itemId: 'chest-seals', trigger: { kind: 'remoteness', min: 'day-plus' }, alsoRequires: [{ kind: 'training', op: 'at-least', level: 'wfa-wfr' }], qty: { kind: 'fixed', n: 1 } },
  // Contested item, comprehensive-only (Kellock 2026-07-04): T1 recommends
  // carrying it, T3 improvises — "weight be damned" packers get the real one
  { itemId: 'sam-splint', trigger: { kind: 'philosophy', is: 'comprehensive' }, alsoRequires: [{ kind: 'remoteness', min: 'few' }], qty: { kind: 'fixed', n: 1 } },
  { itemId: 'finger-splint', trigger: { kind: 'person-days', min: 4 }, alsoRequires: [{ kind: 'remoteness', min: 'few' }], qty: { kind: 'fixed', n: 1 }, cuttable: true },
  // Stationed kit staples (Red Cross / ANSI baseline): cold pack + a blanket per seat.
  // Burn gel and the multi-day med table arrive automatically via the stationed
  // trip-length baseline (engine STATIONED_DAYS), so they aren't repeated here.
  { itemId: 'cold-pack', trigger: { kind: 'activity', activity: 'car' }, qty: { kind: 'fixed', n: 2 } },
  { itemId: 'emergency-blanket', trigger: { kind: 'activity', activity: 'car' }, qty: { kind: 'per-person', n: 1 } },
  // Kids answer produces an item, not just the pediatric-dosing flag (CDC)
  { itemId: 'dosing-syringe', trigger: { kind: 'kids' }, qty: { kind: 'fixed', n: 1 } },
  // Children's liquid analgesics/antipyretics — the syringe now has something to dose
  { itemId: 'childrens-acetaminophen', trigger: { kind: 'kids' }, qty: { kind: 'fixed', n: 1 } },
  { itemId: 'childrens-ibuprofen', trigger: { kind: 'kids' }, qty: { kind: 'fixed', n: 1 } },
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
    alsoRequires: [{ kind: 'duration', minDays: 7 }], // week+ per taxonomy (was 5)
  },
  {
    id: 'doxycycline', name: 'Doxycycline (tick-borne illness prophylaxis)',
    why: 'Indicated by tick exposure. Regional guidance varies; increases sun sensitivity.',
    trigger: { kind: 'environment', environment: 'ticks-insects' },
  },
  {
    id: 'epinephrine', name: 'Epinephrine auto-injector',
    why: 'Indicated by a severe allergy. Prescription; carry two, keep one accessible on your body, and make sure you — and anyone with you — know to inject, call 911, and re-dose if symptoms return.',
    trigger: { kind: 'condition', condition: 'severe-allergies' },
  },
  {
    // No engine "exclude" trigger yet, so we warn rather than auto-swap the ointment.
    id: 'neomycin-allergy', name: 'Neomycin sensitivity — check the antibiotic ointment',
    why: 'Triple-antibiotic ointment contains neomycin, a common contact allergen. If anyone reacts to it, carry plain bacitracin instead (add it from search).',
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
  {
    id: 'poison-oak-steroid', name: 'Oral steroids for a severe plant reaction',
    why: 'Widespread, facial, or worsening poison-oak/ivy reactions may need a prescription oral-steroid taper. A physician call.',
    trigger: { kind: 'environment', environment: 'poison-oak-ivy' },
  },
  {
    id: 'cardiac-clearance', name: 'Cardiac clearance for hard exertion',
    why: 'Strenuous effort at altitude or in heat carries real cardiac risk after 60. Confirm fitness for the trip with your physician.',
    trigger: { kind: 'condition', condition: 'adults-60-plus' },
  },
  {
    id: 'travel-medicine', name: 'Travel-medicine consult',
    why: 'Tropical destinations may need malaria prophylaxis, vaccinations, or a travel-clinic visit weeks ahead. Region-specific; a physician call.',
    trigger: { kind: 'environment', environment: 'tropical-humid' },
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
    // Past ~60 person-days a single kit stops being the whole answer (finding: ladder
    // quantities are honest across the realistic range, not for a 360-person-day expedition)
    id: 'large-trip-resupply', title: 'Plan resupply or carry more than one kit',
    desc: 'For a large party or a long trip, one first-aid kit is a starting point, not the whole plan — stage resupply, cache duplicates, or split into several kits.',
    trigger: { kind: 'person-days', min: 60 },
  },
  {
    // North American pit-viper guidance — NOT the Australian pressure-immobilization wrap
    id: 'snake-first-aid', title: 'Know the snakebite response',
    desc: 'If bitten: move away from the snake, stay calm, keep the limb still and below heart level, remove rings and watches, mark the swelling edge with the time, and evacuate to antivenom. Do NOT apply a tight wrap or tourniquet, cut, suck, or ice the bite.',
    trigger: { kind: 'environment', environment: 'snake-country' },
  },
  {
    id: 'poison-oak-prep', title: 'Wash off urushiol fast',
    desc: 'Rinse exposed skin with the poison-oak scrub or plenty of water within ~30 minutes of contact, before the oil binds. Wash clothing and gear separately — the oil transfers for days.',
    trigger: { kind: 'environment', environment: 'poison-oak-ivy' },
  },
  {
    id: 'permethrin', title: 'Treat clothing with permethrin',
    desc: 'Permethrin-treated clothing and gear repels and kills ticks; apply before the trip and let it dry fully. It goes on fabric, never skin.',
    trigger: { kind: 'environment', environment: 'ticks-insects' },
  },
  {
    id: 'cold-med-storage', title: 'Keep meds and water from freezing',
    desc: 'In the cold, liquids, gels, and adhesives fail. Carry meds, wipes, and water close to your body during the day and into your sleeping bag at night.',
    trigger: { kind: 'environment', environment: 'cold-winter' },
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
    // Kayak: a dry bag, never an ammo can (Kellock — a day-kayaker isn't strapping one in)
    activity: 'kayaking',
    optionIds: ['own-bag', 'ziplock', 'dry-pouch'],
    preselect: { ultralight: 'dry-pouch', balanced: 'dry-pouch', comprehensive: 'dry-pouch' },
  },
  {
    // Raft: gear is strapped to the frame — the ammo can earns its place
    activity: 'rafting',
    optionIds: ['own-bag', 'ziplock', 'dry-pouch', 'ammo-can'],
    preselect: { ultralight: 'dry-pouch', balanced: 'dry-pouch', comprehensive: 'ammo-can' },
  },
  {
    activity: 'canoeing',
    optionIds: ['own-bag', 'ziplock', 'dry-pouch', 'ammo-can'],
    preselect: { ultralight: 'dry-pouch', balanced: 'dry-pouch', comprehensive: 'ammo-can' },
  },
  {
    activity: 'road-cycling',
    optionIds: ['own-bag', 'ziplock', 'ul-zip-sack', 'frame-bag'],
    preselect: { ultralight: 'ziplock', balanced: 'frame-bag', comprehensive: 'frame-bag' },
  },
  {
    // Bikepacking: multi-day, so a waterproof option belongs alongside the frame bag
    activity: 'bikepacking',
    optionIds: ['own-bag', 'ziplock', 'frame-bag', 'dry-pouch'],
    preselect: { ultralight: 'ziplock', balanced: 'frame-bag', comprehensive: 'dry-pouch' },
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
