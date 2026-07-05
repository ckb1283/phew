// Phew seed catalog — v0, ~40 items.
// Sources: seed taxonomy Part 2 (research-grounded) + the rows designed into
// design/mocks/03-results.html (the mock is the fixture — names, application
// copy, weights, and prices match it).
// Sourcing notes (T1 guideline / T2 industry / T3 community) live in comments
// only — per Kellock 2026-07-03, community-consensus picks ship silently.
// purchaseUrl is a placeholder search link until retailer/affiliate decisions.

import type { Container, Item } from './types.js'

const buy = (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}`

export const ITEMS: Item[] = [
  // --- Bandages & wound care ---
  {
    id: 'adhesive-bandages', name: 'Fabric adhesive bandages, 1"×3"',
    application: 'Minor cuts and abrasions.',
    category: 'bandages', unit: 'bandage', weightOz: 0.05, priceCents: 400,
    retailer: 'Band-Aid', purchaseUrl: buy('fabric adhesive bandages 1x3'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'knuckle-bandages', name: 'Knuckle & fingertip bandages',
    application: 'Cuts on joints and fingertips where flat bandages fail.',
    category: 'bandages', unit: 'bandage', weightOz: 0.05, priceCents: 500,
    retailer: 'Coverlet', purchaseUrl: buy('knuckle fingertip bandages'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'closure-strips', name: 'Wound closure strips, ¼"×4"',
    application: 'Closure of lacerations too wide for adhesive bandages.',
    category: 'bandages', unit: 'strip', weightOz: 0.017, priceCents: 600,
    retailer: 'Steri-Strip', purchaseUrl: buy('steri-strip wound closure'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'gauze-pads', name: 'Sterile gauze pads, 3"×3"',
    application: 'Absorbent layer over bleeding wounds.',
    category: 'bandages', unit: 'pad', weightOz: 0.15, priceCents: 400,
    retailer: 'Curad', purchaseUrl: buy('sterile gauze pads 3x3'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'non-adherent-dressings', name: 'Non-adherent dressings, 3"×4"',
    application: 'Covering burns and abraded skin without sticking.',
    category: 'bandages', unit: 'dressing', weightOz: 0.15, priceCents: 500,
    retailer: 'Telfa', purchaseUrl: buy('telfa non-adherent dressing'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'conforming-gauze', name: 'Conforming gauze roll, 3"',
    application: 'Securing dressings; wrapping joints and awkward placements.',
    category: 'bandages', unit: 'roll', weightOz: 0.7, priceCents: 400,
    retailer: 'REI', purchaseUrl: buy('conforming gauze roll 3 inch'),
    imageUrl: null, imageAlt: null,
  },
  {
    // T1 unanimous: irrigation is THE key field wound intervention. Copy
    // nuance: irrigate with potable water; antiseptics are for surrounding skin.
    id: 'irrigation-syringe', name: 'Irrigation syringe, 12 cc',
    application: 'Pressurized cleaning of contaminated wounds.',
    category: 'bandages', unit: 'syringe', weightOz: 0.5, priceCents: 300,
    retailer: 'NOLS', purchaseUrl: buy('wound irrigation syringe 12cc 18ga'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'antiseptic-wipes', name: 'Antiseptic wipes',
    application: 'Cleaning intact skin around a wound.',
    category: 'bandages', unit: 'wipe', weightOz: 0.05, priceCents: 300,
    retailer: 'Dynarex', purchaseUrl: buy('antiseptic wipes bzk'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'antibiotic-ointment', name: 'Triple antibiotic ointment, single-use',
    application: 'Infection prevention on minor wounds.',
    category: 'bandages', unit: 'packet', weightOz: 0.05, priceCents: 500,
    retailer: 'Neosporin', purchaseUrl: buy('triple antibiotic ointment single use packets'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'burn-gel', name: 'Burn gel, single-use',
    application: 'First treatment of stove and fire burns.',
    category: 'bandages', unit: 'packet', weightOz: 0.1, priceCents: 400,
    retailer: 'Water-Jel', purchaseUrl: buy('water-jel burn gel packets'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'elastic-bandage', name: 'Elastic bandage, 3"',
    application: 'Compression for sprains; securing splints.',
    category: 'bandages', unit: 'roll', weightOz: 1.4, priceCents: 600,
    retailer: 'ACE', purchaseUrl: buy('elastic bandage 3 inch'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Cycling module: road-rash coverage (taxonomy §2)
    id: 'film-dressings-large', name: 'Transparent film dressings, 4"×4¾"',
    application: 'Covering road rash and large abrasions; stays on while riding.',
    category: 'bandages', unit: 'dressing', weightOz: 0.1, priceCents: 900,
    retailer: 'Tegaderm', purchaseUrl: buy('tegaderm 4x4.75'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'hydrocortisone', name: 'Hydrocortisone 1%, single-use',
    application: 'Itchy rashes and contact dermatitis.',
    category: 'bandages', unit: 'packet', weightOz: 0.05, priceCents: 400,
    retailer: 'Cortizone', purchaseUrl: buy('hydrocortisone 1% single use packets'),
    imageUrl: null, imageAlt: null,
  },
  {
    // T3 favorite; T1-consistent for low-tension wounds (taxonomy §1)
    id: 'liquid-bandage', name: 'Liquid bandage',
    application: 'Sealing small clean cuts and cracked fingertips; stays on wet hands.',
    category: 'bandages', unit: 'tube', weightOz: 0.3, priceCents: 800,
    retailer: 'New-Skin', purchaseUrl: buy('liquid bandage new skin'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Taxonomy §5 lists cloth tape as CORE — missing from v0 seed
    id: 'cloth-tape', name: 'Cloth medical tape, 1"',
    application: 'Securing dressings; general splint and repair taping.',
    category: 'bandages', unit: 'roll', weightOz: 0.9, priceCents: 400,
    retailer: 'Durapore', purchaseUrl: buy('cloth medical tape 1 inch'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Remote water quality (taxonomy §3)
    id: 'povidone-iodine', name: 'Povidone-iodine wipes',
    application: 'Antisepsis when clean water is uncertain; skin prep around wounds.',
    category: 'bandages', unit: 'wipe', weightOz: 0.05, priceCents: 500,
    retailer: 'Dynarex', purchaseUrl: buy('povidone iodine prep pads'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'trauma-pad-5x9', name: 'Trauma pad, 5"×9"',
    application: 'High-absorbency layer for heavily bleeding wounds.',
    category: 'bandages', unit: 'pad', weightOz: 0.9, priceCents: 500,
    retailer: 'Curad', purchaseUrl: buy('abd trauma pad 5x9'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'trauma-pad-8x10', name: 'Trauma pad, 8"×10"',
    application: 'Maximum-absorbency dressing for large wounds at group scale.',
    category: 'bandages', unit: 'pad', weightOz: 1.6, priceCents: 700,
    retailer: 'Dynarex', purchaseUrl: buy('abd trauma pad 8x10'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Search-only (r/bicycletouring favorite; distinct device from strips)
    id: 'zip-closure', name: 'Zip-type wound closure',
    application: 'Non-invasive closure of longer lacerations; stronger hold than strips.',
    category: 'bandages', unit: 'device', weightOz: 0.3, priceCents: 3000,
    retailer: 'ZipStitch', purchaseUrl: buy('zipstitch wound closure'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Search-only: the WFR-instructor alternative (no neomycin — allergy risk)
    id: 'bacitracin', name: 'Bacitracin ointment, single-use',
    application: 'Antibiotic ointment without neomycin — lower allergy risk.',
    category: 'bandages', unit: 'packet', weightOz: 0.05, priceCents: 500,
    retailer: 'any', purchaseUrl: buy('bacitracin ointment single use packets'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Search-only (CDC: long-trip personal kit)
    id: 'antifungal-cream', name: 'Antifungal cream, single-use',
    application: "Athlete's foot and fungal rashes on long trips.",
    category: 'bandages', unit: 'packet', weightOz: 0.05, priceCents: 600,
    retailer: 'Lotrimin', purchaseUrl: buy('antifungal cream single use packets'),
    imageUrl: null, imageAlt: null,
  },

  // --- Blister & foot care ---
  {
    // T3 consensus pick over moleskin (Skurka doctrine); ships silently
    id: 'leukotape', name: 'Leukotape P, pre-cut strips',
    application: 'Taping hotspots before blisters form; heavy-duty dressing tape.',
    category: 'blister', unit: 'strip', weightOz: 0.06, priceCents: 900,
    retailer: 'BSN', purchaseUrl: buy('leukotape p precut strips'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'hydrogel-dressings', name: 'Hydrogel blister dressings',
    application: 'Covering formed blisters to keep moving.',
    category: 'blister', unit: 'dressing', weightOz: 0.15, priceCents: 700,
    retailer: 'Compeed', purchaseUrl: buy('compeed blister cushions'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Search-only: the T2 default; Leukotape is Phew's pick, this is the alternative
    id: 'moleskin', name: 'Moleskin sheet',
    application: 'Blister padding; the traditional alternative to tape.',
    category: 'blister', unit: 'sheet', weightOz: 0.4, priceCents: 400,
    retailer: "Dr. Scholl's", purchaseUrl: buy('moleskin blister sheet'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Search-only (T3: adhesion prep)
    id: 'benzoin', name: 'Tincture of benzoin swabs',
    application: 'Adhesion prep so tape and dressings stick to sweaty skin.',
    category: 'blister', unit: 'swab', weightOz: 0.05, priceCents: 700,
    retailer: 'Dynarex', purchaseUrl: buy('tincture of benzoin swabsticks'),
    imageUrl: null, imageAlt: null,
  },

  // --- Medications (all OTC, unit-dose — never bottles; Rx = flags only) ---
  {
    id: 'ibuprofen', name: 'Ibuprofen 200 mg, 2-packs',
    application: 'Pain, inflammation, fever.',
    category: 'meds', unit: '2-pack', weightOz: 0.033, priceCents: 500,
    retailer: 'Advil', purchaseUrl: buy('ibuprofen unit dose packets'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'acetaminophen', name: 'Acetaminophen 500 mg, 2-packs',
    application: 'Pain and fever; can alternate with ibuprofen.',
    category: 'meds', unit: '2-pack', weightOz: 0.038, priceCents: 400,
    retailer: 'Tylenol', purchaseUrl: buy('acetaminophen unit dose packets'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Kids get their own liquid formulations — the dosing syringe now has something to
    // dose. Weight-based dosing still routes to the pediatric-dosing flag.
    id: 'childrens-acetaminophen', name: "Children's acetaminophen, liquid",
    application: 'Fever and pain in children; dose by weight — see the pediatric-dosing note.',
    category: 'meds', unit: 'bottle', weightOz: 4.5, priceCents: 800,
    retailer: "Children's Tylenol", purchaseUrl: buy("children's acetaminophen liquid"),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'childrens-ibuprofen', name: "Children's ibuprofen, liquid",
    application: 'Fever, pain, and inflammation in children over 6 months; dose by weight.',
    category: 'meds', unit: 'bottle', weightOz: 4.5, priceCents: 900,
    retailer: "Children's Motrin", purchaseUrl: buy("children's ibuprofen liquid"),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'diphenhydramine', name: 'Diphenhydramine 25 mg',
    application: 'Allergic reactions; sting and bite swelling.',
    category: 'meds', unit: 'tablet', weightOz: 0.017, priceCents: 400,
    retailer: 'Benadryl', purchaseUrl: buy('diphenhydramine 25mg unit dose'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'loperamide', name: 'Loperamide 2 mg',
    application: 'Acute diarrhea.',
    category: 'meds', unit: 'tablet', weightOz: 0.025, priceCents: 500,
    retailer: 'Imodium', purchaseUrl: buy('loperamide 2mg caplets'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'aspirin', name: 'Aspirin 325 mg',
    // Copy broadened per Kellock 2026-07-03: multi-use analgesic, cardiac case
    // stated descriptively (the reason it earns its multi-day slot)
    application: 'Pain, inflammation, fever; standard first response to suspected heart attack.',
    category: 'meds', unit: 'tablet', weightOz: 0.025, priceCents: 300,
    retailer: 'Bayer', purchaseUrl: buy('aspirin 325mg unit dose'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'ors', name: 'Oral rehydration salts',
    application: 'Dehydration and heat exhaustion.',
    category: 'meds', unit: 'packet', weightOz: 0.55, priceCents: 800,
    retailer: 'Liquid I.V.', purchaseUrl: buy('oral rehydration salts packets'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'aloe-packets', name: 'Aloe / sunburn relief packets',
    application: 'Sunburn.',
    category: 'meds', unit: 'packet', weightOz: 0.1, priceCents: 400,
    retailer: "Burt's Bees", purchaseUrl: buy('aloe sunburn relief packets'),
    imageUrl: null, imageAlt: null,
  },
  {
    // T2 marine signature item; river module
    id: 'meclizine', name: 'Meclizine 25 mg',
    application: 'Motion sickness and nausea.',
    category: 'meds', unit: 'tablet', weightOz: 0.017, priceCents: 500,
    retailer: 'Bonine', purchaseUrl: buy('meclizine 25mg'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Week-plus gut risk (taxonomy §7: antacid at week+ / gut-risk)
    id: 'antacid', name: 'Antacid tablets',
    application: 'Heartburn and indigestion.',
    category: 'meds', unit: 'tablet', weightOz: 0.05, priceCents: 300,
    retailer: 'Tums', purchaseUrl: buy('antacid tablets rolls'),
    imageUrl: null, imageAlt: null,
  },
  {
    // T3 river doctrine: hypothermia sugar
    id: 'honey-packets', name: 'Honey packets',
    application: 'Fast sugar for hypothermia and low blood sugar.',
    category: 'meds', unit: 'packet', weightOz: 0.35, priceCents: 300,
    retailer: 'any', purchaseUrl: buy('honey packets single serve'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Search-only: ORS covers the hot-sun module; these are the exertion alternative
    id: 'electrolyte-tablets', name: 'Electrolyte tablets',
    application: 'Cramping and electrolyte replacement on sustained exertion.',
    category: 'meds', unit: 'tablet', weightOz: 0.05, priceCents: 700,
    retailer: 'Nuun', purchaseUrl: buy('electrolyte tablets nuun'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Search-only
    id: 'cold-flu', name: 'Cold & flu tablets',
    application: 'Congestion, cough, sore throat.',
    category: 'meds', unit: 'tablet', weightOz: 0.05, priceCents: 600,
    retailer: 'DayQuil', purchaseUrl: buy('cold and flu tablets unit dose'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Search-only: daytime antihistamine (diphenhydramine sedates)
    id: 'loratadine', name: 'Loratadine 10 mg',
    application: 'Non-drowsy antihistamine for daytime allergy coverage.',
    category: 'meds', unit: 'tablet', weightOz: 0.017, priceCents: 500,
    retailer: 'Claritin', purchaseUrl: buy('loratadine 10mg'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Search-only (MyMedic med module; bikepacking community staple)
    id: 'bismuth', name: 'Bismuth subsalicylate tablets',
    application: 'Upset stomach, nausea, mild diarrhea.',
    category: 'meds', unit: 'tablet', weightOz: 0.1, priceCents: 400,
    retailer: 'Pepto-Bismol', purchaseUrl: buy('bismuth subsalicylate chewable tablets'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Search-only (Red Cross / CDC general list)
    id: 'throat-lozenges', name: 'Throat lozenges',
    application: 'Sore throat and cough.',
    category: 'meds', unit: 'lozenge', weightOz: 0.1, priceCents: 300,
    retailer: 'Halls', purchaseUrl: buy('throat lozenges'),
    imageUrl: null, imageAlt: null,
  },

  // --- Tools & instruments (qty 1 — tools never scale with group) ---
  {
    id: 'tweezers', name: 'Fine-point tweezers',
    application: 'Splinter, thorn, and debris removal.',
    category: 'tools', unit: 'tool', weightOz: 0.2, priceCents: 700,
    retailer: "Uncle Bill's", purchaseUrl: buy('fine point splinter tweezers'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'tick-tool', name: 'Tick removal tool',
    application: 'Tick removal without crushing the body.',
    category: 'tools', unit: 'tool', weightOz: 0.1, priceCents: 800,
    retailer: 'Tick Key', purchaseUrl: buy('tick removal key'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'sting-relief', name: 'Sting relief wipes',
    application: 'Itch relief from bites and stings.',
    category: 'tools', unit: 'wipe', weightOz: 0.025, priceCents: 400,
    retailer: 'After Bite', purchaseUrl: buy('sting relief wipes'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'trauma-shears', name: 'Trauma shears, 4"',
    application: 'Cutting tape, dressings, and clothing.',
    category: 'tools', unit: 'tool', weightOz: 1.0, priceCents: 600,
    retailer: 'Madison', purchaseUrl: buy('trauma shears 4 inch'),
    imageUrl: null, imageAlt: null,
  },
  {
    // The item T3 says everyone forgets
    id: 'nitrile-gloves', name: 'Nitrile gloves',
    application: 'Barrier protection when treating wounds.',
    category: 'tools', unit: 'pair', weightOz: 0.2, priceCents: 300,
    retailer: 'REI', purchaseUrl: buy('nitrile gloves pairs first aid'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'safety-pins', name: 'Safety pins',
    application: 'Securing slings and wraps.',
    category: 'tools', unit: 'pin', weightOz: 0.033, priceCents: 200,
    retailer: 'any', purchaseUrl: buy('safety pins assorted'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'duct-tape', name: 'Duct tape, flat-wrapped',
    application: 'Dressing reinforcement; gear and improvised repairs.',
    category: 'tools', unit: 'inch', weightOz: 0.0115, priceCents: 300,
    retailer: 'Gorilla', purchaseUrl: buy('duct tape flat wrapped travel'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'accident-form', name: 'Accident report form + pencil',
    application: 'Recording vitals and events for handoff to medical care.',
    category: 'tools', unit: 'set', weightOz: 0.2, priceCents: 200,
    retailer: 'NOLS', purchaseUrl: buy('SOAP note accident report form wilderness'),
    imageUrl: null, imageAlt: null,
  },
  {
    // River module: works wet (T2); also the pet sub-module's anchor item
    id: 'vet-wrap', name: 'Self-adherent wrap, 2"',
    application: 'Securing dressings in wet conditions; flexible self-adherent wrap.',
    category: 'tools', unit: 'roll', weightOz: 1.0, priceCents: 500,
    retailer: 'Coban', purchaseUrl: buy('self adherent wrap 2 inch vet wrap'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'cpr-mask', name: 'CPR barrier mask, flat-fold',
    application: 'Rescue breathing with barrier protection.',
    category: 'tools', unit: 'mask', weightOz: 0.6, priceCents: 800,
    retailer: 'Laerdal', purchaseUrl: buy('cpr barrier mask flat fold keychain'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Cold module: T1 Red Cross carries multiple
    id: 'emergency-blanket', name: 'Emergency blanket',
    application: 'Hypothermia prevention; shock management.',
    category: 'tools', unit: 'blanket', weightOz: 1.8, priceCents: 400,
    retailer: 'SOL', purchaseUrl: buy('emergency mylar blanket sol'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Wildfire module (T3, from incident report)
    id: 'n95-mask', name: 'N95 respirator',
    application: 'Smoke inhalation reduction during wildfire exposure.',
    category: 'tools', unit: 'mask', weightOz: 0.4, priceCents: 600,
    retailer: '3M', purchaseUrl: buy('n95 respirator niosh'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Poison oak/ivy module
    id: 'tecnu', name: 'Poison oak & ivy scrub, single-use',
    application: 'Removing urushiol oil after contact, before the rash sets.',
    category: 'tools', unit: 'packet', weightOz: 0.4, priceCents: 800,
    retailer: 'Tecnu', purchaseUrl: buy('tecnu poison oak ivy scrub packets'),
    imageUrl: null, imageAlt: null,
  },
  {
    // T2 ships a book at every tier ≥4 days; Red Cross puts the manual in core
    id: 'reference-guide', name: 'Wilderness first-aid field guide',
    application: 'Step-by-step reference when memory fails under stress.',
    category: 'tools', unit: 'book', weightOz: 2.4, priceCents: 1000,
    retailer: 'NOLS', purchaseUrl: buy('NOLS wilderness medicine field guide'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Search-only: gear line (Kellock 2026-07-04 — prevention gear stays out of auto-kits)
    id: 'repellent', name: 'Insect repellent, picaridin',
    application: 'Bite prevention; mosquitoes and ticks.',
    category: 'tools', unit: 'bottle', weightOz: 1.0, priceCents: 800,
    retailer: 'Sawyer', purchaseUrl: buy('picaridin insect repellent sawyer'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Search-only: gear line
    id: 'headlamp', name: 'Micro headlamp',
    application: 'Hands-free light for treatment after dark.',
    category: 'tools', unit: 'lamp', weightOz: 1.2, priceCents: 2000,
    retailer: 'Nitecore', purchaseUrl: buy('micro headlamp nitecore'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Search-only: gear line
    id: 'thermometer', name: 'Digital thermometer',
    application: 'Fever confirmation and trend tracking on long trips.',
    category: 'tools', unit: 'unit', weightOz: 0.5, priceCents: 800,
    retailer: 'Vicks', purchaseUrl: buy('compact digital thermometer'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Search-only: gear line
    id: 'pulse-oximeter', name: 'Pulse oximeter',
    application: 'Blood-oxygen check at sleeping altitude.',
    category: 'tools', unit: 'unit', weightOz: 1.8, priceCents: 2500,
    retailer: 'Zacurate', purchaseUrl: buy('fingertip pulse oximeter'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Stationed-kit staple (Red Cross home baseline, ANSI Class A, NOLS
    // sprain module) — car rule; search-only elsewhere (nothing frozen in a trunk)
    id: 'cold-pack', name: 'Instant cold pack',
    application: 'Cold therapy for sprains and strains where nothing is frozen.',
    category: 'tools', unit: 'pack', weightOz: 4.0, priceCents: 300,
    retailer: 'Dynarex', purchaseUrl: buy('instant cold pack single use'),
    imageUrl: null, imageAlt: null,
  },
  {
    // CDC pediatric handling — the kids answer produces an item, not just a flag
    id: 'dosing-syringe', name: 'Medicine dosing syringe',
    application: 'Accurate liquid-medication dosing for children.',
    category: 'tools', unit: 'syringe', weightOz: 0.2, priceCents: 300,
    retailer: 'any', purchaseUrl: buy('oral medicine dosing syringe'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Search-only (Red Cross tools list; hygiene before treatment)
    id: 'hand-sanitizer', name: 'Hand sanitizer, mini',
    application: "Hand hygiene before wound care when washing isn't possible.",
    category: 'tools', unit: 'bottle', weightOz: 1.0, priceCents: 200,
    retailer: 'Purell', purchaseUrl: buy('mini hand sanitizer'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Search-only (overlanding doctrine: mark tourniquet time)
    id: 'mini-marker', name: 'Permanent mini marker',
    application: 'Marking tourniquet time; labeling doses and notes.',
    category: 'tools', unit: 'marker', weightOz: 0.3, priceCents: 300,
    retailer: 'Sharpie', purchaseUrl: buy('sharpie mini permanent marker'),
    imageUrl: null, imageAlt: null,
  },

  // --- Trauma layer (always offered per Kellock 2026-07-03; copy gated by training) ---
  {
    // T1-EB: first line for life-threatening extremity bleeding.
    // SWAT-T over CAT for v0: multi-use, no counterfeit problem (T3 warning).
    id: 'tourniquet', name: 'SWAT-T tourniquet',
    application: 'Life-threatening limb bleeding.',
    category: 'trauma', unit: 'tourniquet', weightOz: 4.0, priceCents: 1200,
    retailer: 'SWAT-T', purchaseUrl: buy('swat-t tourniquet'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'triangular-bandage', name: 'Triangular bandage',
    application: 'Arm slings; securing splints.',
    category: 'trauma', unit: 'bandage', weightOz: 0.9, priceCents: 300,
    retailer: 'Dynarex', purchaseUrl: buy('triangular bandage'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'hemostatic-gauze', name: 'Hemostatic gauze',
    application: 'Packing wounds where a tourniquet cannot work — junctions, torso.',
    category: 'trauma', unit: 'pack', weightOz: 0.8, priceCents: 2000,
    retailer: 'QuikClot', purchaseUrl: buy('quikclot hemostatic gauze'),
    imageUrl: null, imageAlt: null,
  },
  {
    id: 'pressure-bandage', name: 'Compression trauma bandage, 4"',
    application: 'Direct-pressure dressing for heavy or arterial bleeding.',
    category: 'trauma', unit: 'bandage', weightOz: 2.6, priceCents: 900,
    retailer: 'Israeli Bandage', purchaseUrl: buy('israeli compression bandage 4 inch'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Severity tier (taxonomy §6): deep remoteness + wilderness training
    id: 'chest-seals', name: 'Vented chest seals, pair',
    application: 'Sealing penetrating chest wounds.',
    category: 'trauma', unit: 'pair', weightOz: 1.5, priceCents: 1600,
    retailer: 'Hyfin', purchaseUrl: buy('hyfin vented chest seal twin pack'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Contested (T1 recommends, T3 improvises) — comprehensive-only per Kellock
    // 2026-07-04; also the seed of a future "worth considering" section
    id: 'sam-splint', name: 'SAM splint, 36"',
    application: 'Moldable splint for limb fractures and sprains.',
    category: 'trauma', unit: 'splint', weightOz: 4.0, priceCents: 1400,
    retailer: 'SAM Medical', purchaseUrl: buy('sam splint 36'),
    imageUrl: null, imageAlt: null,
  },
  {
    // Mid-tier commercial staple (AMK Backpacker/Marine, MyMedic Standard)
    id: 'finger-splint', name: 'Finger splint',
    application: 'Immobilizing jammed and fractured fingers.',
    // Tools, not the training-gated Trauma layer — splinting a finger needs no training.
    category: 'tools', unit: 'splint', weightOz: 0.4, priceCents: 500,
    retailer: 'any', purchaseUrl: buy('foam aluminum finger splint'),
    imageUrl: null, imageAlt: null,
  },
]

// --- Containers (bag options; per-activity suggestion rules live in rules.ts) ---
export const CONTAINERS: Container[] = [
  { id: 'own-bag', name: 'Use my own bag', desc: 'Contents only', weightOz: null, priceCents: null, imageUrl: null },
  { id: 'ziplock', name: 'Ziplock bag', desc: 'Free; the ultralight standard', weightOz: null, priceCents: null, imageUrl: null },
  { id: 'ul-zip-sack', name: 'Ultralight zip sack', desc: 'Transparent zip closure; no internal structure', weightOz: 1.1, priceCents: 1400, imageUrl: null },
  { id: 'organizer-pouch', name: 'Organizer pouch', desc: 'Internal compartments by category; opens flat', weightOz: 4.6, priceCents: 2800, imageUrl: null },
  { id: 'dry-pouch', name: 'Waterproof dry pouch', desc: 'Roll-top seal; submersion-rated', weightOz: 3.2, priceCents: 2400, imageUrl: null },
  { id: 'ammo-can', name: 'Ammo can', desc: 'Rigid, waterproof, crush-proof; rides strapped in', weightOz: 52, priceCents: 2500, imageUrl: null },
  { id: 'frame-bag', name: 'Top-tube pouch', desc: 'Rides on the bike; zip access without stopping', weightOz: 2.5, priceCents: 2200, imageUrl: null },
  { id: 'trunk-case', name: 'Rigid trunk case', desc: 'Latched hard case; visible and always in the car', weightOz: 28, priceCents: 3200, imageUrl: null },
]

export const ITEM_BY_ID: ReadonlyMap<string, Item> = new Map(ITEMS.map((i) => [i.id, i]))
export const CONTAINER_BY_ID: ReadonlyMap<string, Container> = new Map(CONTAINERS.map((c) => [c.id, c]))
