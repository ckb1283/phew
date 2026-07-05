// Engine tests — node:test via tsx, no dependencies.
// The golden fixture is design/mocks/03-results.html: its scenario must keep
// producing its list. Quantity-ladder edits that break mock parity fail here
// instead of shipping silently (the repo deploys on push).

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildKit } from '../src/engine.js'
import { validateModel } from '../src/model/integrity.js'
import type { WizardAnswers } from '../src/model/types.js'

const MOCK_SCENARIO: WizardAnswers = {
  activity: 'backpacking',
  people: 2,
  kids: false,
  pets: false,
  days: 5,
  hoursToCare: '12-plus',
  conditions: { kind: 'known', conditions: [] },
  environments: ['hot-sun', 'ticks-insects'],
  training: 'wfa-wfr',
  philosophy: 'balanced',
}

const findItem = (kit: ReturnType<typeof buildKit>, itemId: string) =>
  kit.sections.flatMap((s) => s.items).find((i) => i.itemId === itemId)

test('model integrity holds', () => {
  validateModel()
})

test('golden fixture: the 03-results mock scenario, plus the v0.3 research additions', () => {
  const kit = buildKit(MOCK_SCENARIO)

  assert.equal(kit.defaultName, 'The Weekend-Plus Backpacker')
  // 30 rows matched the mock exactly; the 2026-07-04 catalog expansion added
  // 6 research-mandated rows to this scenario (content decision, research >
  // mock parity): liquid bandage + cloth tape (core), povidone-iodine (12+ hrs),
  // trauma pad 5×9 + finger splint (≥4 person-days), reference guide (≥4 days).
  // 37 since 2026-07-04 triage promoted hydrocortisone 1% to a core topical (all lanes).
  assert.equal(kit.stats.itemCount, 37)
  for (const id of ['liquid-bandage', 'cloth-tape', 'povidone-iodine', 'trauma-pad-5x9', 'finger-splint', 'reference-guide', 'hydrocortisone']) {
    assert.ok(findItem(kit, id), `${id} should enter the golden scenario`)
  }
  assert.equal(findItem(kit, 'povidone-iodine')?.qty, 4)
  assert.deepEqual(kit.sections.map((s) => s.title), [
    'Bandages & wound care', 'Blister & foot care', 'Medications', 'Tools & instruments', 'Trauma layer',
  ])

  // Spot-check the mock's quantities across every qty mechanism
  assert.equal(findItem(kit, 'adhesive-bandages')?.qty, 8) // ladder
  assert.equal(findItem(kit, 'ibuprofen')?.qty, 12) // ladder
  assert.equal(findItem(kit, 'leukotape')?.qty, 10) // activity module ladder
  assert.equal(findItem(kit, 'loperamide')?.qty, 4) // duration tier
  assert.equal(findItem(kit, 'aspirin')?.qty, 4) // OR-rule via duration
  assert.equal(findItem(kit, 'tourniquet')?.qty, 1) // fixed
  assert.equal(findItem(kit, 'duct-tape')?.qty, 26) // person-days tier

  // Chips carry stable identity, not just copy
  assert.deepEqual(findItem(kit, 'ors')?.chips, [
    { kind: 'environment', value: 'hot-sun', label: 'hot & sun' },
  ])
  assert.deepEqual(findItem(kit, 'leukotape')?.chips, [
    { kind: 'activity', value: 'backpacking', label: 'hiking & backpacking' },
  ])
  assert.equal(findItem(kit, 'aspirin')?.chips.length, 0) // duration triggers don't chip

  // abx-course now requires week+ (was 5 days); the 5-day golden trip correctly drops it.
  assert.deepEqual(kit.flags.map((f) => f.id), ['personal-rx', 'doxycycline'])
  // permethrin nudge added 2026-07-04 (ticks-insects environment, present in golden)
  assert.deepEqual(kit.nudges.map((n) => n.id), ['keep-cert-current', 'satellite', 'group-medical', 'permethrin'])

  // WFA training → trained trauma copy; organizer pouch preselected for balanced
  assert.equal(kit.sections.find((s) => s.category === 'trauma')?.note, 'requires training to use')
  assert.equal(kit.bag.options.find((o) => o.preselected)?.id, 'organizer-pouch')

  assert.deepEqual(kit.checkIn, [])
})

test('unsure conditions: check-in requested, no condition rules fire, no silent defaults', () => {
  const kit = buildKit({
    ...MOCK_SCENARIO,
    days: 2, // below aspirin's duration tier, so aspirin can only enter via condition
    conditions: { kind: 'unsure' },
  })
  assert.deepEqual(kit.checkIn, ['conditions'])
  assert.equal(findItem(kit, 'aspirin'), undefined)
  assert.ok(!kit.flags.some((f) => f.id === 'epinephrine'))
})

test('daily-rx-meds condition visibly changes the output', () => {
  const without = buildKit(MOCK_SCENARIO)
  const withMeds = buildKit({
    ...MOCK_SCENARIO,
    conditions: { kind: 'known', conditions: ['daily-rx-meds'] },
  })
  assert.ok(!without.flags.some((f) => f.id === 'group-med-plan'))
  assert.ok(withMeds.flags.some((f) => f.id === 'group-med-plan'))
})

test('ultralight drops cuttable items and reports no savings', () => {
  const kit = buildKit({ ...MOCK_SCENARIO, philosophy: 'ultralight' })
  assert.equal(findItem(kit, 'triangular-bandage'), undefined) // cuttable
  assert.ok(findItem(kit, 'tourniquet')) // never cuttable
  assert.equal(kit.stats.ultralightSavingsOz, null)
  assert.ok(kit.stats.itemCount < buildKit(MOCK_SCENARIO).stats.itemCount)
})

test('savings equals the real weight difference vs the ultralight build', () => {
  for (const philosophy of ['balanced', 'comprehensive'] as const) {
    const kit = buildKit({ ...MOCK_SCENARIO, philosophy })
    const ul = buildKit({ ...MOCK_SCENARIO, philosophy: 'ultralight' })
    assert.ok(kit.stats.ultralightSavingsOz !== null)
    assert.equal(
      kit.stats.ultralightSavingsOz,
      Math.round((kit.stats.totalWeightOz - ul.stats.totalWeightOz) * 10) / 10,
      `${philosophy}: savings must be the actual diff`,
    )
  }
})

test('comprehensive scales ladder quantities only', () => {
  const kit = buildKit({ ...MOCK_SCENARIO, philosophy: 'comprehensive' })
  assert.equal(findItem(kit, 'ibuprofen')?.qty, 15) // ceil(12 × 1.25)
  assert.equal(findItem(kit, 'tourniquet')?.qty, 1) // fixed quantities untouched
})

test('remoteness tier: day-plus unlocks the deep trauma items, 12-plus does not', () => {
  const near = buildKit(MOCK_SCENARIO) // 12-plus
  const far = buildKit({ ...MOCK_SCENARIO, hoursToCare: 'day-plus' })
  assert.equal(findItem(near, 'hemostatic-gauze'), undefined)
  assert.ok(findItem(far, 'hemostatic-gauze'))
  assert.ok(findItem(far, 'pressure-bandage'))
})

test('untrained users get the get-trained trauma copy and nudge', () => {
  const kit = buildKit({ ...MOCK_SCENARIO, training: 'none' })
  assert.equal(
    kit.sections.find((s) => s.category === 'trauma')?.note,
    'get trained before you carry this — see Before you go',
  )
  assert.ok(kit.nudges.some((n) => n.id === 'get-trained'))
  assert.ok(!kit.nudges.some((n) => n.id === 'keep-cert-current'))
})

test('SAM splint is comprehensive-only', () => {
  assert.equal(findItem(buildKit(MOCK_SCENARIO), 'sam-splint'), undefined) // balanced
  assert.ok(findItem(buildKit({ ...MOCK_SCENARIO, philosophy: 'comprehensive' }), 'sam-splint'))
  assert.equal(findItem(buildKit({ ...MOCK_SCENARIO, philosophy: 'ultralight' }), 'sam-splint'), undefined)
})

test('chest seals need deep remoteness AND wilderness training', () => {
  const deepTrained = buildKit({ ...MOCK_SCENARIO, hoursToCare: 'day-plus' }) // wfa-wfr
  const deepUntrained = buildKit({ ...MOCK_SCENARIO, hoursToCare: 'day-plus', training: 'basic' })
  const nearTrained = buildKit(MOCK_SCENARIO) // 12-plus
  assert.ok(findItem(deepTrained, 'chest-seals'))
  assert.equal(findItem(deepUntrained, 'chest-seals'), undefined)
  assert.equal(findItem(nearTrained, 'chest-seals'), undefined)
})

test('search-only items are in the catalog but never auto-enter a kit', () => {
  const SEARCH_ONLY = [
    'moleskin', 'benzoin', 'electrolyte-tablets', 'cold-flu', 'repellent', 'headlamp',
    'thermometer', 'pulse-oximeter', 'zip-closure', 'bacitracin',
    'loratadine', 'bismuth', 'throat-lozenges', 'hand-sanitizer', 'mini-marker',
    // antifungal-cream promoted to auto-enter on tropical-humid (2026-07-04 triage)
  ]
  // A maximal scenario: every module and tier that can fire, fires
  const maximal = buildKit({
    activity: 'rafting', people: 8, kids: true, pets: true, days: 30,
    hoursToCare: 'day-plus',
    conditions: { kind: 'known', conditions: ['severe-allergies', 'adults-60-plus', 'daily-rx-meds'] },
    environments: ['high-altitude', 'hot-sun', 'cold-winter', 'tropical-humid', 'ticks-insects', 'snake-country', 'poison-oak-ivy', 'open-water', 'wildfire-smoke'],
    training: 'medical-professional', philosophy: 'comprehensive',
  })
  for (const id of SEARCH_ONLY) {
    assert.equal(findItem(maximal, id), undefined, `${id} must never auto-enter`)
  }
})

test('output is JSON-safe (no Infinity/NaN anywhere)', () => {
  const kit = buildKit({ ...MOCK_SCENARIO, days: 45, people: 12, philosophy: 'comprehensive' })
  const roundTrip = JSON.parse(JSON.stringify(kit))
  assert.deepEqual(roundTrip, kit)
})
