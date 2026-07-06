// Phew per-item editorial content — the depth behind each /item/:id page.
// Keyed by Item.id; SPARSE by design (a Partial map). An item with no entry, or
// an entry missing a field, simply renders fewer blocks — never a placeholder or
// invented filler.
//
// Sourcing rule (per Kellock 2026-07-05): "I draft, you vet." overview,
// substitutes, and quantity/expiry notes lean on context/research/ (the three
// lanes + seed taxonomy) plus general first-aid knowledge, and are subject to
// Kellock's medical-accuracy review before they are treated as final. Buy links
// and how-to videos are handled on the page as labeled placeholders until Track C
// (affiliate) and video curation land.
//
// Strings use curly apostrophes/quotes (’ “ ”) deliberately — they match the
// site's typography AND avoid breaking these single-quoted JS string literals.

import type { ItemContent } from './types.js'

export const ITEM_CONTENT: Record<string, ItemContent> = {
  // ===========================================================================
  // Bandages & wound care
  // ===========================================================================

  'adhesive-bandages': {
    overview:
      'The everyday workhorse for minor cuts, scrapes, and small blisters. Fabric flexes and breathes better than plastic, staying put on knuckles and active skin. Clean the wound first — a bandage over dirt just seals in the problem.',
    substitutes: [
      'A folded gauze pad taped down with cloth tape',
      'Cloth tape alone over a small clean cut',
      'Nothing — many small cuts do fine cleaned and left open',
    ],
    quantityNote:
      'Carry a small variety; these are used faster than any other item in the kit. Ultralight hikers cut the count hard — “at the point of using a big bandage, you’re getting off the trail.”',
    expiryNote:
      'The adhesive stiffens and the pad’s sterility lapses over years — refresh a kit’s bandages if they have ridden along unused for a long time.',
  },

  'knuckle-bandages': {
    overview:
      'H-shaped and fingertip-shaped bandages for the spots flat strips will not hold — knuckles, fingertips, the webbing between fingers. The pre-cut shape wraps a joint that keeps bending without peeling off.',
    substitutes: [
      'A flat bandage with the ends snipped into tabs',
      'Cloth tape over a small gauze square, wrapped figure-8',
      'Liquid bandage on a clean fingertip crack',
    ],
    quantityNote: 'A few of each — hands and fingers take the most abuse on any trip.',
  },

  'closure-strips': {
    overview:
      'Thin adhesive strips that pull the edges of a clean, low-tension cut together so it can heal without stitches. Dry the skin, lay them across the wound (not along it), leave a small gap for drainage. Not for dirty, gaping, or high-tension wounds — those need real care.',
    substitutes: [
      'Tincture of benzoin under the strips for grip on sweaty skin',
      'A zip-type wound closure for longer cuts',
      'Superglue on truly clean edges — a common field improvisation, though not medical-grade',
    ],
    quantityNote: 'A pack or two covers a trip; a single laceration can require several strips.',
  },

  'gauze-pads': {
    overview:
      'The absorbent layer that goes directly over a bleeding or draining wound, held down by tape or wrap. The all-purpose dressing — soak up, pad, and protect. Add layers rather than peeling a soaked one off a forming clot.',
    substitutes: [
      'A clean bandana or cloth for larger wounds',
      'A trauma pad when bleeding outpaces a 3×3',
      'A non-adherent dressing if the pad keeps sticking to the wound',
    ],
    quantityNote:
      'Community rule of thumb: carry enough to manage bleeding until you can walk out — scale the count with group size and days, not with “what if.”',
  },

  'non-adherent-dressings': {
    overview:
      'A dressing with a slick face that will not fuse to a wound — the right cover for burns, blisters, and raw abraded skin, where plain gauze would tear the healing surface off at the next change.',
    substitutes: [
      'A gauze pad smeared with antibiotic ointment (improvises a non-stick face)',
      'A hydrogel dressing for a burn or blister',
      'Clean plastic film over burn gel, in a pinch',
    ],
    quantityNote: 'A couple per kit; more if you expect burns or road rash.',
  },

  'conforming-gauze': {
    overview:
      'A stretchy gauze roll that wraps and holds a dressing on the awkward places tape struggles with — joints, heads, hands. It secures, it does not absorb, so place a pad underneath first.',
    substitutes: [
      'Self-adherent wrap (vet wrap), which sticks to itself even when wet',
      'Cloth tape for flat, simple placements',
      'A torn cloth strip or bandana',
    ],
    quantityNote: 'One roll handles most single incidents; add a second for groups or multi-day trips.',
  },

  // Reference item (drafted 2026-07-05, vetted) — T1-unanimous wound intervention.
  'irrigation-syringe': {
    overview:
      'The single most important wound-care tool in the kit. High-pressure irrigation with clean water is what actually prevents infection in a field wound — far more than any ointment or antiseptic. Draw up potable water and flush the wound until it runs clear, then dress it.',
    substitutes: [
      'A zip-lock bag with a pinhole punched in one corner, squeezed hard',
      'The backflush from a Sawyer or squeeze-style water filter',
      'A hydration-bladder hose, pinched at the bite valve to raise the pressure',
    ],
    quantityNote:
      'One 12 cc syringe covers a whole group; large or long parties step up to 20 cc. It is reusable — rinse it and keep it, trip to trip.',
  },

  'antiseptic-wipes': {
    overview:
      'For cleaning the intact skin around a wound and wiping down tools and hands — not the wound itself. Alcohol and harsh antiseptics damage the living tissue inside a wound; clean-water irrigation is what the wound needs.',
    substitutes: [
      'Soap and clean water on the surrounding skin',
      'Povidone-iodine wipes when water quality is uncertain',
      'Hand sanitizer for tools and hands (never in the wound)',
    ],
    quantityNote: 'A handful per kit.',
    expiryNote: 'Sealed alcohol wipes dry out over time — squeeze the packet; if it is not wet, it is spent.',
  },

  'antibiotic-ointment': {
    overview:
      'A dab on a minor, clean wound to keep it moist and lower infection risk before covering it. Single-use packets keep a shared tube from getting contaminated. Skip it on deep or dirty wounds — irrigation and proper care matter far more than ointment.',
    substitutes: [
      'Bacitracin — single-ingredient, lower allergy risk than the neomycin in triple antibiotic',
      'Plain petroleum jelly to keep a wound moist',
      'Nothing — a well-irrigated, covered wound often does fine',
    ],
    quantityNote: 'A few single-use packets; very little is needed per application.',
    expiryNote: 'Check the date — potency fades, and expired ointment on a wound is worse than none.',
  },

  'burn-gel': {
    overview:
      'A water-gel packet for the immediate care of minor stove and campfire burns — it cools, soothes, and holds moisture. Cool the burn with clean water for several minutes first; the gel is the follow-up, not the first move. Large or deep burns need evacuation, not gel.',
    substitutes: [
      'Cool clean water — the real first treatment for any burn',
      'A non-adherent dressing kept moist',
      'Aloe / hydrogel for the after-care',
    ],
    quantityNote:
      'A packet or two; former medics note burns are among the most common and least-prepared-for camp injuries.',
    expiryNote: 'Water-based — it can dry out or degrade; check the date.',
  },

  'elastic-bandage': {
    overview:
      'A reusable compression wrap for sprains and strains, and for holding a splint or bulky dressing in place. Wrap it firm but never so tight it numbs or cools the limb below — loosen it if fingers or toes tingle or go pale.',
    substitutes: [
      'Self-adherent wrap for a lighter, sticks-to-itself version',
      'A triangular bandage folded into a wide cravat',
      'Conforming gauze plus tape',
    ],
    quantityNote: 'One does the job for most parties; it is reusable, so it does not scale with days.',
  },

  'film-dressings-large': {
    overview:
      'A thin transparent film that seals over road rash and large abrasions and stays put while you keep moving — a cyclist and paddler favorite because it survives sweat and water and lets you watch the wound without pulling it off. For shallow, oozing scrapes, not deep or heavily bleeding wounds.',
    substitutes: [
      'A non-adherent dressing taped down',
      'Second-skin / hydrogel over the raw area',
      'Gauze and tape for a wound that needs to drain',
    ],
    quantityNote: 'A couple of large sheets; road rash covers area, so bring size over count.',
  },

  'hydrocortisone': {
    overview:
      'A mild steroid cream for itchy, inflamed skin — contact rashes, poison oak/ivy, insect-bite welts, minor allergic skin reactions. Thin layer on intact skin only; not for open wounds, and not a fix for a spreading infection.',
    substitutes: [
      'Oral diphenhydramine to fight the itch from the inside',
      'Calamine or an after-bite wipe for surface relief',
      'A cool wet compress',
    ],
    quantityNote: 'A single-use packet or small tube covers a lot of itch; poison-oak-prone trips carry more.',
    expiryNote: 'Check the date — it is a medication and potency fades.',
  },

  'liquid-bandage': {
    overview:
      'A brush-on or spray film that seals small, clean cuts and cracked fingertips and — unlike a bandage — stays on wet hands and through hand-washing. A sting on application is normal. Only over clean, closed skin; sealing dirt in invites infection.',
    substitutes: [
      'A knuckle/fingertip bandage where it can stay dry',
      'Closure strips for a slightly larger cut',
      'Superglue on a clean split fingertip (common improvisation)',
    ],
    quantityNote: 'One bottle or applicator lasts a long time — a little seals a lot.',
  },

  'cloth-tape': {
    overview:
      'The general-purpose medical tape — secures dressings, anchors splints, and handles a hundred small repairs. Cloth tears by hand and sticks to skin better than plastic. Tincture of benzoin underneath makes it hold on sweaty skin.',
    substitutes: [
      'Duct tape for anything that is not delicate skin',
      'Self-adherent wrap where nothing needs to stick to skin',
      'Conforming gauze for wrapping',
    ],
    quantityNote: 'One roll covers most trips, and it doubles as gear-repair tape.',
  },

  'povidone-iodine': {
    overview:
      'An antiseptic for prepping the skin around a wound, and a backup when your water source is questionable. Like other antiseptics it belongs on intact skin, not scrubbed into the wound. A brown stain marks where you have prepped.',
    substitutes: [
      'Alcohol antiseptic wipes for skin prep',
      'Clean-water irrigation for the wound itself',
      'Soap and water on the surrounding skin',
    ],
    quantityNote: 'A few wipes per kit; more for remote trips where water quality is uncertain.',
    expiryNote: 'Check the date — the active iodine weakens over time.',
  },

  'trauma-pad-5x9': {
    overview:
      'A thick, high-absorbency pad for wounds that outpace a small gauze square — a deep laceration, a heavy bleed. Press it on with firm direct pressure, and add pads on top rather than lifting a soaked one off a forming clot.',
    substitutes: [
      'Several gauze pads stacked together',
      'A clean folded shirt or bandana for pressure',
      'A compression trauma bandage for a wrap-and-hold',
    ],
    quantityNote: 'One or two; a serious bleed soaks a pad quickly, so groups and remote trips carry more.',
  },

  'trauma-pad-8x10': {
    overview:
      'The largest absorbent dressing — for big wounds or covering a wide area, and sized for group kits where more than one person might be hurt at once. Same rule: firm direct pressure, and layer on top of a soaked pad.',
    substitutes: [
      'Two 5×9 pads side by side',
      'A clean folded garment',
      'A compression trauma bandage plus gauze',
    ],
    quantityNote: 'Group and vehicle kits carry one; solo ultralight kits skip it.',
  },

  'zip-closure': {
    overview:
      'A newer skin-closure device — adhesive anchors on each side of a cut with a lace between them — that draws a longer laceration closed with a stronger, adjustable hold than thin strips, and no needles. For clean, low-tension wounds; dirty or gaping ones still need professional care.',
    substitutes: [
      'Wound closure strips for shorter, lower-tension cuts',
      'Closure strips reinforced with tincture of benzoin',
      'Pressure, a dressing, and evacuation if closure is not safe',
    ],
    quantityNote: 'One or two devices; each closes a single wound.',
  },

  'bacitracin': {
    overview:
      'A single-ingredient antibiotic ointment for minor clean wounds — the lower-allergy alternative to triple antibiotic, which contains neomycin (a common contact allergen). Same use: a thin dab to keep a minor wound moist and lower infection risk.',
    substitutes: [
      'Triple antibiotic ointment (if no neomycin allergy)',
      'Plain petroleum jelly to keep the wound moist',
      'Nothing — clean and cover is often enough',
    ],
    quantityNote: 'A few single-use packets; carry this instead of triple antibiotic if anyone reacts to neomycin.',
    expiryNote: 'Check the date — potency fades.',
  },

  'antifungal-cream': {
    overview:
      'For athlete’s foot and fungal skin rashes that flare on long, sweaty, or humid trips — jock itch, ringworm, macerated skin between the toes. Apply to clean, dry skin, and keep the area as dry as conditions allow — that matters as much as the cream.',
    substitutes: [
      'Keeping skin dry and airing feet — half the battle',
      'Antifungal powder for prevention in humid climates',
      'Hydrocortisone does NOT treat fungus — do not substitute it',
    ],
    quantityNote: 'One tube or packet; mainly a long-trip and tropical/humid item, not a short-trip staple.',
    expiryNote: 'Check the date.',
  },

  // ===========================================================================
  // Medications
  // ===========================================================================

  'ibuprofen': {
    overview:
      'An anti-inflammatory (NSAID) for pain, swelling, and fever — the workhorse for sprains, overuse injuries, and headaches. Take it with food to protect the stomach. Avoid it in anyone who is dehydrated, heat-injured, or has kidney concerns, where an NSAID adds risk — reach for acetaminophen instead.',
    substitutes: [
      'Acetaminophen — the safer choice when dehydration or kidney strain is a concern',
      'Alternating ibuprofen and acetaminophen for stubborn pain or fever',
      'Rest, elevation, and a cold pack for a fresh sprain',
    ],
    quantityNote:
      'The most-used medication in most kits — scales with group size and days, so carry generously on long or large trips.',
    expiryNote: 'Check the date — tablets lose potency past it.',
  },

  'acetaminophen': {
    overview:
      'For pain and fever, and the safer choice when an NSAID like ibuprofen is a poor fit — dehydration, stomach trouble, kidney concerns. It can be alternated with ibuprofen for stubborn pain. Respect the daily maximum: acetaminophen harms the liver in overdose, and it hides inside many combination products such as cold-and-flu tablets.',
    substitutes: [
      'Ibuprofen — better where inflammation is the problem',
      'Alternating the two for stubborn pain or fever',
      'Aspirin for an adult (never a child)',
    ],
    quantityNote: 'A staple; scales with group and trip length.',
    expiryNote: 'Check the date.',
  },

  'childrens-acetaminophen': {
    overview:
      'Liquid acetaminophen for fever and pain in children, dosed by the child’s weight — use the dosing syringe, never a kitchen spoon. When traveling with children, a child’s fever or dehydration warrants a lower threshold to seek care than the same signs would in an adult.',
    substitutes: [
      'Children’s ibuprofen (for children over 6 months) as the alternative or alternating partner',
      'A dosing syringe is essential — the dose is by weight, not by the cap',
    ],
    quantityNote:
      'One bottle per trip when children are along; check the concentration, as pediatric formulations vary.',
    expiryNote: 'Liquids degrade faster than tablets — check the date and discard if discolored.',
  },

  'childrens-ibuprofen': {
    overview:
      'Liquid ibuprofen for fever, pain, and inflammation in children over 6 months, dosed by weight with the dosing syringe. Not for infants under 6 months without medical direction, and — like the adult version — a poor choice for a dehydrated child, where children’s acetaminophen is safer.',
    substitutes: [
      'Children’s acetaminophen — usable from a younger age and safer when dehydration is a concern',
      'Alternating the two, under guidance, for a stubborn fever',
    ],
    quantityNote: 'One bottle per trip when children over 6 months are along.',
    expiryNote: 'Check the date; discard if discolored.',
  },

  'diphenhydramine': {
    overview:
      'A sedating antihistamine for allergic reactions, hives, and the itch and swelling of bites and stings; its drowsiness is sometimes used for sleep. It is NOT a treatment for a severe allergic reaction — anaphylaxis requires epinephrine and evacuation, and an antihistamine must never delay that.',
    substitutes: [
      'Loratadine for daytime allergy relief without the drowsiness',
      'Hydrocortisone cream for a localized skin reaction',
      'For anaphylaxis there is NO substitute for epinephrine — see the medications-to-discuss guidance',
    ],
    quantityNote:
      'A small supply covers most trips; carry more where severe-allergy risk or heavy insect exposure is expected.',
    expiryNote: 'Check the date.',
  },

  'loperamide': {
    overview:
      'Slows the gut to control acute, watery diarrhea — valuable when you must keep moving or ration water. It treats the symptom, not the cause, and rehydration matters more. Do NOT use it with bloody stool or high fever, which point to an infection that trapping in the gut makes worse; that situation needs medical care.',
    substitutes: [
      'Oral rehydration salts — the priority in any diarrheal illness',
      'Bismuth subsalicylate for milder upset (slower and gentler)',
      'Rest and fluids when travel is not forced',
    ],
    quantityNote: 'A modest supply; a common, high-value item on travel and remote trips.',
    expiryNote: 'Check the date.',
  },

  'aspirin': {
    overview:
      'Beyond pain and fever, the key role of aspirin is cardiac: an adult with a suspected heart attack should chew a 325 mg tablet while help is summoned. It thins the blood and so carries a bleeding risk. Never give aspirin to a child or teenager — its link to Reye’s syndrome makes acetaminophen or ibuprofen the choice for the young.',
    substitutes: [
      'Acetaminophen or ibuprofen for ordinary pain and fever in anyone',
      'For chest pain, aspirin plus immediate evacuation — there is no home substitute for emergency care',
    ],
    quantityNote:
      'A small dedicated supply; many kits carry aspirin specifically for the cardiac use, kept separate from general pain relief.',
    expiryNote: 'Aspirin degrades with age and may smell of vinegar when it does — replace it then.',
  },

  'ors': {
    overview:
      'A precise balance of salt and sugar that pulls water back into the body far better than water alone — the real treatment for the dehydration of diarrhea, vomiting, and heat illness. Mix into clean water and sip steadily. For a serious fluid deficit this matters more than any anti-diarrheal or pain reliever.',
    substitutes: [
      'A homemade solution — roughly 6 level teaspoons of sugar and ½ teaspoon of salt per liter of clean water',
      'Electrolyte tablets for exertion (less balanced for illness than true ORS)',
      'Diluted juice with a pinch of salt, in a pinch',
    ],
    quantityNote:
      'A few packets; more for hot climates, travel where diarrheal illness is likely, or long trips.',
    expiryNote: 'Long shelf life if kept dry; discard if clumped or damp.',
  },

  'aloe-packets': {
    overview:
      'Cooling gel for the after-care of sunburn and minor heat-reddened skin — it soothes and moisturizes but does not reverse the burn. Cool the skin first. Prevention (cover, timing, sunscreen) beats treatment, and a blistering or extensive burn is a medical problem, not a cosmetic one.',
    substitutes: [
      'Cool water or a cool wet cloth — the first and best step',
      'Burn gel for a small heat or contact burn',
      'Hydrocortisone for the itch of a healing burn on intact skin',
    ],
    quantityNote: 'A packet or two; a hot-sun and high-altitude item more than a universal one.',
    expiryNote: 'Gel-based — check the date and discard if separated or off-smelling.',
  },

  'meclizine': {
    overview:
      'A once-daily antihistamine for motion sickness and its nausea and vertigo — useful on boats, winding roads, and small aircraft. Take it before travel begins, as it prevents far better than it rescues. It can cause drowsiness.',
    substitutes: [
      'Diphenhydramine, which also blunts motion sickness (more sedating)',
      'Ginger chews or capsules for milder cases',
      'Acupressure bands, and facing forward with eyes on the horizon',
    ],
    quantityNote: 'A small supply for those who are susceptible; a water-activity and travel item.',
    expiryNote: 'Check the date.',
  },

  'antacid': {
    overview:
      'Neutralizes stomach acid for heartburn and indigestion — the ordinary discomfort of trail food and dehydration. Remember that chest discomfort is not always heartburn: pressure, sweating, or pain spreading to the arm or jaw in an at-risk adult is a possible cardiac event and needs aspirin and evacuation, not an antacid.',
    substitutes: [
      'Bismuth subsalicylate for upset stomach with nausea',
      'Smaller meals and steady hydration',
      'Avoiding the trigger food',
    ],
    quantityNote: 'A small supply; more common in vehicle and comfort-oriented kits.',
    expiryNote: 'Check the date.',
  },

  'honey-packets': {
    overview:
      'Fast sugar for a conscious person who is hypoglycemic, hypothermic, or bonking — immediate calories when the body needs them. Only for someone awake and able to swallow; never put sugar in the mouth of an unconscious person. Do NOT give honey to an infant under one year, because of the botulism risk.',
    substitutes: [
      'Any fast sugar — candy, glucose tablets, a sugary drink',
      'Sports or energy gels',
      'A warm, sweet drink for the mildly hypothermic (if fully conscious)',
    ],
    quantityNote: 'A few packets; cheap insurance on cold or high-exertion trips.',
    expiryNote: 'Effectively indefinite; discard if fermented or leaking.',
  },

  'electrolyte-tablets': {
    overview:
      'Replace the salts lost to heavy sweating on sustained exertion, helping prevent cramps and the wooziness of drinking plain water all day. These are for exertion; the more medically balanced oral rehydration salts are the better choice for the dehydration of illness.',
    substitutes: [
      'Oral rehydration salts (better for illness, still fine for exertion)',
      'Salty snacks plus water',
      'A pinch of salt in a water bottle',
    ],
    quantityNote: 'Scales with heat and exertion; a hot-climate and endurance item.',
    expiryNote: 'Long shelf life; keep dry and check for a date.',
  },

  'cold-flu': {
    overview:
      'A combination tablet for the congestion, cough, and sore throat of a cold — symptom relief, not a cure. Because these products usually contain acetaminophen, do NOT also take separate acetaminophen on top, or the combined dose can reach a liver-harmful level. Read the label.',
    substitutes: [
      'Individual remedies — acetaminophen, throat lozenges, rest — for control over each dose',
      'Rest and fluids, which do most of the work',
      'Throat lozenges for the throat alone',
    ],
    quantityNote: 'A small supply; a comfort item that keeps someone functional on a longer trip.',
    expiryNote: 'Check the date.',
  },

  'loratadine': {
    overview:
      'A non-drowsy antihistamine for daytime allergy coverage — pollen, dust, mild environmental reactions — without the sedation of diphenhydramine. Best taken preventively for known seasonal allergies. Like every antihistamine, it is not a treatment for a severe allergic reaction, which requires epinephrine and evacuation.',
    substitutes: [
      'Diphenhydramine when sedation is acceptable, or at night (faster, stronger, drowsy)',
      'Nasal saline for congestion',
      'Avoiding the known allergen',
    ],
    quantityNote: 'A small supply for those with daytime allergy needs.',
    expiryNote: 'Check the date.',
  },

  'bismuth': {
    overview:
      'Bismuth subsalicylate settles an upset stomach, nausea, and mild diarrhea, and helps prevent travelers’ diarrhea. It contains a salicylate (an aspirin relative), so avoid it in anyone allergic to aspirin, and do NOT give it to children or teenagers because of the Reye’s syndrome risk. It harmlessly turns the tongue and stool black — expected, not alarming.',
    substitutes: [
      'Loperamide to stop diarrhea quickly (a different mechanism)',
      'Oral rehydration salts for the fluid loss',
      'Antacid for simple heartburn',
    ],
    quantityNote: 'A modest supply; a travel and comfort item.',
    expiryNote: 'Check the date.',
  },

  'throat-lozenges': {
    overview:
      'Soothe a sore, scratchy throat and quiet a mild cough by coating and moistening the throat — purely symptomatic comfort. Useful for staying functional and sleeping, but a sore throat with high fever or with difficulty swallowing or breathing is a reason to seek care, not to keep sucking lozenges.',
    substitutes: [
      'Hard candy, to keep saliva flowing',
      'Warm water with honey, and salt-water gargles',
      'Cold-and-flu tablets when other symptoms are present',
    ],
    quantityNote: 'A small supply; a low-stakes comfort item.',
    expiryNote: 'Long shelf life; check the date.',
  },

  // ===========================================================================
  // Trauma layer
  // ===========================================================================

  'tourniquet': {
    overview:
      'For life-threatening bleeding from an arm or leg that direct pressure cannot control — apply it high and tight above the wound, note the time, and do not loosen it. A tourniquet is a limb-versus-life decision that buys time to reach surgical care; it is not a first move for ordinary bleeding, and it rewards prior training.',
    substitutes: [
      'Firm, sustained direct pressure and a pressure dressing — the first response for most bleeding',
      'A commercial windlass tourniquet (CAT) for a more definitive hold — beware counterfeits',
      'An improvised tourniquet (a wide strap and a windlass) only as a last resort; narrow cord causes harm',
    ],
    quantityNote:
      'One per person is the trauma-kit standard, since a tourniquet stays on the patient; groups and higher-risk trips carry more.',
    expiryNote: 'The rubber can perish with age and heat — inspect it and replace a stiff or cracked one.',
  },

  'triangular-bandage': {
    overview:
      'A large cloth triangle — the multi-tool of the kit. Folded into a sling it supports an injured arm; folded into a cravat it secures a splint or dressing or serves as a wide pressure wrap. Simple, reusable, and endlessly improvisable.',
    substitutes: [
      'A shirt, bandana, or torn sheet — the classic improvisation, often larger than a store-bought one',
      'Conforming gauze or an elastic wrap for securing',
      'Safety-pinned clothing to rig a sling',
    ],
    quantityNote: 'One or two; cheap, light, and worth carrying for the number of jobs it does.',
  },

  'hemostatic-gauze': {
    overview:
      'Gauze impregnated with a clotting agent, for packing a deep or junctional wound — groin, armpit, neck — where a tourniquet cannot reach. Pack it firmly into the wound and hold direct pressure. This is a serious-bleeding tool that rewards training; used wrong it wastes time a patient may not have.',
    substitutes: [
      'Plain gauze packed firmly with hard direct pressure — the fundamental technique still works',
      'A compression bandage over the packing to hold pressure',
      'No true substitute for the clotting agent itself — technique carries the load',
    ],
    quantityNote:
      'One or two packs in a trauma-oriented kit; a remote, vehicle, or water-trip item more than a day-hike one.',
    expiryNote: 'It expires — check the date; the clotting agent degrades.',
  },

  'pressure-bandage': {
    overview:
      'An all-in-one dressing with a built-in pressure bar that wraps a wound and applies firm, sustained compression to control heavy bleeding — faster and steadier than holding gauze by hand. The workhorse of bleeding control that sits a step below a tourniquet.',
    substitutes: [
      'Gauze pads plus an elastic wrap, cinched firm',
      'A trauma pad held with a cravat from the triangular bandage',
      'Hard direct manual pressure while help is organized',
    ],
    quantityNote: 'One or two; scales up for groups and trauma-oriented kits.',
    expiryNote: 'Sterile — check the date and the seal.',
  },

  'chest-seals': {
    overview:
      'Adhesive seals for a penetrating chest wound, which can let air into the chest and collapse a lung. The vented design lets trapped air escape while blocking it from being drawn back in. This is an evacuation-grade emergency: apply the seal and move the patient to definitive care immediately.',
    substitutes: [
      'An improvised occlusive seal — airtight material taped on three sides — is the recognized field fallback',
      'A gloved hand sealing the wound while a dressing is readied',
      'None of these replace urgent evacuation',
    ],
    quantityNote:
      'A pair (for entry and exit wounds); a trauma-forward, vehicle, or high-risk-activity item, not a standard day kit.',
    expiryNote: 'The adhesive and seal degrade — check the date.',
  },

  // Reference item (drafted 2026-07-05, vetted) — the item sources openly disagree about.
  'sam-splint': {
    overview:
      'A foam-padded aluminum strip that bends into a rigid splint for a fractured or badly sprained limb — mold it to the uninjured side first, then apply. It is the one-tool answer to immobilizing almost any joint, but it is bulky, and it is the item experienced parties most often decide to leave home.',
    substitutes: [
      'A rolled closed-cell sleeping pad',
      'Trekking poles or tent poles laid alongside the limb',
      'A folded jacket or pack padding, lashed with the triangular bandage',
    ],
    quantityNote:
      'One splint serves a group — it can be cut down or shared. Comprehensive and vehicle kits carry it; ultralight kits deliberately improvise instead.',
  },

  // ===========================================================================
  // Blister & foot care
  // ===========================================================================

  'leukotape': {
    overview:
      'An aggressive, stiff cotton tape for taping a hotspot before it becomes a blister — the thru-hiker favorite because it stays stuck for days through sweat and miles where lesser tape peels. Apply it smooth over clean, dry skin at the first sign of rubbing. Prevention, not repair.',
    substitutes: [
      'Cloth medical tape (less durable, but it works)',
      'Moleskin as a padded alternative',
      'Kinesiology tape in a pinch',
    ],
    quantityNote: 'Pre-cut strips or a partial roll; a foot-travel staple, scaled to trip length.',
  },

  'hydrogel-dressings': {
    overview:
      'Cushioned gel dressings for a blister that has already formed or popped — they pad the raw spot and keep it moist so you can keep moving. Best over a clean intact or deroofed blister; secure the edges with tape, as they can slide.',
    substitutes: [
      'A non-adherent dressing taped over the blister',
      'Moleskin cut into a ring to offload the blister',
      'Second-skin or gel pads of any brand',
    ],
    quantityNote: 'A few; a foot-care item for longer hiking and backpacking trips.',
    expiryNote: 'Gel-based — check the date.',
  },

  'moleskin': {
    overview:
      'A padded adhesive felt, the traditional blister tool — cut a ring to surround and offload a blister so pressure falls around it, not on it, or use a patch to pad a hotspot. Cheap, forgiving, and endlessly cuttable to shape.',
    substitutes: [
      'Leukotape for prevention (thinner, stickier, more durable)',
      'Hydrogel dressings for a formed blister',
      'Folded cloth tape as a quick pad',
    ],
    quantityNote: 'A sheet goes a long way; a foot-travel staple.',
  },

  'benzoin': {
    overview:
      'A sticky liquid swabbed on skin so tape and dressings actually hold on sweaty, oily, or hairy places — a prep step, not a treatment. It also toughens skin at recurring hotspots. Let it get tacky before applying tape, and keep it out of the wound itself.',
    substitutes: [
      'Clean, dry skin and firm burnishing of the tape (often enough)',
      'Skin-Tac or a similar medical adhesive prep',
      'Nothing — many tapes hold fine on clean skin',
    ],
    quantityNote: 'A few swabs; pairs with leukotape and closure strips.',
  },

  // ===========================================================================
  // Tools & instruments
  // ===========================================================================

  'tweezers': {
    overview:
      'Fine-point tweezers for pulling out splinters, thorns, cactus glochids, and embedded debris, and for removing a stinger. Precision at the tip matters more than anything else; cheap blunt tweezers frustrate the one job they have.',
    substitutes: [
      'The tweezers on a multi-tool or knife (blunter)',
      'A sterilized needle to tease out a splinter',
      'Tape pressed and peeled for fine cactus hairs',
    ],
    quantityNote: 'One pair serves any group; a reusable tool.',
  },

  'tick-tool': {
    overview:
      'A notched tool that slides under an attached tick and lifts it straight out, body and mouthparts together, without squeezing — squeezing can push infected fluid into the bite. Grasp low, close to the skin, and pull steadily.',
    substitutes: [
      'Fine-point tweezers gripping the tick as close to the skin as possible',
      'A loop of dental floss or thread cinched at the head',
      'A steady hand and patience — do not burn or smother the tick',
    ],
    quantityNote: 'One tool per kit; a tick-country and warm-season item.',
  },

  'sting-relief': {
    overview:
      'Wipes with a topical anesthetic to take the edge off the itch and sting of insect bites and stings. Symptomatic relief only; watch any sting for signs of a spreading allergic reaction, which is a different and more urgent problem.',
    substitutes: [
      'Hydrocortisone cream for the itch of a bite',
      'Oral diphenhydramine for a stronger or widespread reaction',
      'A cold compress, or a paste of baking soda and water',
    ],
    quantityNote: 'A few wipes; an insect-country and warm-season item.',
    expiryNote: 'Check the date; they dry out.',
  },

  'trauma-shears': {
    overview:
      'Blunt-tipped shears that cut through clothing, straps, tape, and dressings without nicking the patient underneath — the fastest way to expose an injury. The bent blade and blunt tip are the point; ordinary scissors are slower and riskier against skin.',
    substitutes: [
      'A knife, used with great care away from the body',
      'Ordinary scissors from a multi-tool',
      'Tearing tape and clothing by hand where possible',
    ],
    quantityNote: 'One pair serves any group.',
  },

  'nitrile-gloves': {
    overview:
      'A barrier between you and a patient’s blood and fluids, protecting both of you from infection during wound care. Nitrile avoids the latex-allergy problem. Put them on before you touch a wound whenever you can, and treat them as single-use.',
    substitutes: [
      'A clean plastic bag over each hand as an improvised barrier',
      'Thorough hand-washing or sanitizer before and after (less protection)',
      'Latex or vinyl gloves if nitrile is unavailable',
    ],
    quantityNote: 'Several pairs — they are single-use and tear; scale with group size.',
    expiryNote: 'Nitrile perishes with age and heat — replace stiff, tacky, or cracked gloves.',
  },

  'safety-pins': {
    overview:
      'Humble but versatile — pin a sling or cravat, close a torn garment, secure a bandage, or serve as an improvised splinter tool. A few weigh nothing and repeatedly prove useful.',
    substitutes: [
      'Tape to secure a sling or dressing',
      'Tweezers or the tick-tool for pin-like jobs',
      'Cordage or a knot',
    ],
    quantityNote: 'A few of assorted sizes; effectively permanent.',
  },

  'duct-tape': {
    overview:
      'The universal repair material — reinforce a dressing, patch a boot or tent, tape a splint, cover a hotspot in a pinch. Flat-wrapped around a card or bottle it packs small. Strong on gear; gentler cloth tape is better against skin.',
    substitutes: [
      'Cloth medical tape for anything touching skin',
      'Tenacious tape or gear tape for equipment',
      'Cordage and improvisation for structural fixes',
    ],
    quantityNote: 'A small flat-wrapped length covers most trips; more for long or remote ones.',
  },

  'accident-form': {
    overview:
      'A patient-assessment (SOAP note) form and pencil for recording vital signs, times, symptoms, and what you did — the record that keeps a long incident straight and hands off cleanly to professional care. Memory fails under stress; paper does not, and a pencil writes when wet and cold.',
    substitutes: [
      'Any waterproof notebook, or the margins of a map',
      'Writing times and vitals on tape stuck to the patient or your arm',
      'A phone note as a backup (batteries and cold permitting)',
    ],
    quantityNote: 'One per kit; more pages for group or expedition trips.',
  },

  'vet-wrap': {
    overview:
      'A stretchy wrap that clings to itself but not to skin or hair — it secures dressings and splints, and cyclists and paddlers favor it because it holds even when wet, where tape gives up. It gives light compression and does not absorb, so pad underneath.',
    substitutes: [
      'Conforming gauze plus tape',
      'An elastic bandage for firmer compression',
      'A cravat from the triangular bandage',
    ],
    quantityNote: 'A roll or two; a wet-environment favorite.',
  },

  'cpr-mask': {
    overview:
      'A barrier with a one-way valve for giving rescue breaths without direct mouth-to-mouth contact, protecting the rescuer during CPR. Effective CPR is a trained skill; the mask removes one hesitation to act. Keep it where it can be reached instantly, not buried in the kit.',
    substitutes: [
      'A compact face shield (lighter, less of a seal)',
      'Hands-only chest compressions, which are effective and need no mask',
      'None for the barrier itself if breaths are given',
    ],
    quantityNote: 'One per kit; group and water kits often keep it in a pocket or PFD, not the bag.',
    expiryNote: 'Check the valve and seal; replace a cracked or perished one.',
  },

  'emergency-blanket': {
    overview:
      'A reflective sheet that traps radiated body heat to fight hypothermia and manage shock — a few grams that can change an outcome in cold or wet conditions. Wrap the patient, head included, ideally with insulation against the ground. It doubles as signaling and shelter material.',
    substitutes: [
      'Dry insulation — a sleeping bag, extra clothing, a foam pad against the ground',
      'A trash bag or tarp as a wind and moisture barrier',
      'Shared body heat and shelter',
    ],
    quantityNote: 'One per person; light, cheap, and single-incident.',
  },

  'n95-mask': {
    overview:
      'A fitted respirator that filters fine particulates — its wilderness use is wildfire smoke, cutting what you breathe when air quality collapses. It must seal to the face to work, so facial hair and a loose fit undermine it, and it does little against gases, only particulates.',
    substitutes: [
      'A KN95 or well-fitted surgical mask (less protection)',
      'A buff or cloth over the nose and mouth (minimal, but better than nothing)',
      'The best defense — leaving or sheltering from the smoke',
    ],
    quantityNote: 'One or two per person on wildfire-season trips; the seal degrades with wear.',
    expiryNote: 'Straps and nose foam perish with age — check an old one’s fit and elastic.',
  },

  'tecnu': {
    overview:
      'A cleanser that removes urushiol — the oil from poison oak, ivy, and sumac — from skin and gear, ideally before the rash sets in. Wash the exposed area as soon as possible after contact; the sooner the oil comes off, the less reaction follows. Once a rash has erupted, its job is limiting further spread, not curing it.',
    substitutes: [
      'Prompt washing with soap (dish soap cuts oil) and plenty of cool water',
      'Rubbing-alcohol wipes on a small exposure',
      'Rinsing gear and clothing that carry the oil',
    ],
    quantityNote: 'A packet or two; a poison-oak and poison-ivy country item.',
    expiryNote: 'Check the date.',
  },

  'reference-guide': {
    overview:
      'A compact wilderness first-aid guide for the moment memory fails under stress — step-by-step reminders for assessment, bleeding, fractures, and evacuation calls. A guide is a backstop for training, not a replacement for it; the time to read it is before the trip, not during the emergency.',
    substitutes: [
      'A downloaded first-aid reference or app on a phone (batteries permitting)',
      'Laminated crib cards for the few high-stakes protocols',
      'Training, which is the real preparation',
    ],
    quantityNote: 'One per group; a longer- and remoter-trip item.',
    expiryNote: 'Editions update — a current one reflects current guidance.',
  },

  'repellent': {
    overview:
      'Skin-applied repellent to prevent the bites that carry disease — mosquitoes, ticks, and biting flies. Picaridin repels comparably to DEET without damaging synthetic gear and with a lighter feel. Reapply per the label, and pair it with permethrin-treated clothing for the strongest protection.',
    substitutes: [
      'A DEET-based repellent (effective, but can degrade plastics and synthetics)',
      'Permethrin on clothing (never skin) for a treated-layer defense',
      'Physical cover — long sleeves, a head net — where bugs are fierce',
    ],
    quantityNote: 'One bottle per trip; scales with duration and insect pressure.',
    expiryNote: 'Check the date; old product loses effectiveness.',
  },

  'headlamp': {
    overview:
      'Hands-free light so you can actually treat a patient after dark — assess a wound, find supplies, manage an evacuation — with both hands free. A small dedicated light means care does not stop at sunset, and a red mode preserves night vision.',
    substitutes: [
      'A phone flashlight (occupies a hand, drains the phone)',
      'Any small flashlight held in the mouth',
      'A larger headlamp already in your pack',
    ],
    quantityNote: 'One in the kit even if you carry another; confirm the batteries are live.',
    expiryNote: 'Test it before each trip; batteries drain and corrode in storage.',
  },

  'thermometer': {
    overview:
      'Confirms and tracks a fever, or monitors for hypothermia — turning a guess into a number you can watch over hours. A trend (rising or falling) often matters more than a single reading, especially on a multi-day trip where it guides the decision to wait or evacuate.',
    substitutes: [
      'Single-use disposable thermometer strips (compact, less precise)',
      'Back-of-hand judgment (crude and unreliable)',
      'A general-purpose digital thermometer from home',
    ],
    quantityNote: 'One per kit; a multi-day and group item.',
    expiryNote: 'Check the battery; replace a drifting or dead unit.',
  },

  'pulse-oximeter': {
    overview:
      'Clips on a fingertip to read blood-oxygen saturation and pulse — its wilderness value is at altitude, where a falling number is an objective warning of altitude illness. Readings are unreliable when fingers are cold, and it is one data point, not a diagnosis; symptoms and the descent decision matter more than the number.',
    substitutes: [
      'Watching symptoms directly — headache, breathlessness, confusion, poor coordination',
      'A smartwatch with an SpO2 feature (less reliable)',
      'None for the objective number — but descent decisions rest on symptoms regardless',
    ],
    quantityNote: 'One per kit; a high-altitude item, otherwise optional.',
    expiryNote: 'Check the battery before an altitude trip.',
  },

  'cold-pack': {
    overview:
      'A chemical pack that turns cold on a squeeze, for a fresh sprain, strain, or bruise where nothing frozen is at hand — cold in the first day eases pain and swelling. Single-use; wrap it in cloth rather than putting it straight on skin, and limit sessions to avoid a cold injury.',
    substitutes: [
      'Cold stream or lake water, or snow, wrapped in cloth',
      'A wet bandana cooled by evaporation',
      'Rest, elevation, and compression, which do most of the work',
    ],
    quantityNote: 'One or two; a vehicle- and comfort-kit item, skipped by weight-counters.',
    expiryNote: 'The chemical pouch expires and can leak — check the date and for damage.',
  },

  'dosing-syringe': {
    overview:
      'An oral syringe for measuring liquid medication accurately — essential with children, where the dose is by weight and a kitchen spoon is guesswork. Draw to the marked volume, not by eye. It is the companion to the children’s liquid medicines in the kit.',
    substitutes: [
      'A marked medicine cup (less precise for small volumes)',
      'The dosing device that comes with the medicine',
      'No safe eyeball substitute for a child’s dose',
    ],
    quantityNote: 'One when children are along; reusable — rinse between uses.',
  },

  'hand-sanitizer': {
    overview:
      'Alcohol-based hand cleaner for hygiene before wound care and after handling waste, when soap and water are not available. It complements gloves rather than replacing them, and it belongs on hands, never in a wound. Choose at least 60% alcohol to be effective.',
    substitutes: [
      'Soap and clean water — the better option when available',
      'Alcohol antiseptic wipes for hands and tools',
      'Nitrile gloves for the barrier function',
    ],
    quantityNote: 'A mini bottle per kit; refresh occasionally.',
    expiryNote: 'The alcohol evaporates over time — replace an old or separated bottle.',
  },

  'mini-marker': {
    overview:
      'A permanent marker for writing the time a tourniquet went on — often directly on the patient’s skin — and for labeling doses and notes. In a bleeding emergency the tourniquet time is critical information for the surgical team, and skin is the surface that cannot get lost.',
    substitutes: [
      'The pencil from the accident form (will not write on skin)',
      'Tape written on and stuck to the patient',
      'Any pen, though permanent ink survives water and sweat',
    ],
    quantityNote: 'One per kit; pairs with the tourniquet and the accident form.',
    expiryNote: 'Markers dry out — check that it writes before a trip.',
  },

  'finger-splint': {
    overview:
      'A small padded aluminum splint for a jammed, dislocated, or fractured finger — bend it to shape and tape it to immobilize the digit. Splint a finger in a slightly bent, natural position; buddy-taping it to the neighboring finger is a fine field alternative.',
    substitutes: [
      'Buddy-taping the injured finger to the one beside it',
      'A trimmed piece of the SAM splint',
      'A small stick or trimmed padding taped on',
    ],
    quantityNote: 'One or two; light enough to carry, and finger injuries are common.',
  },
}
