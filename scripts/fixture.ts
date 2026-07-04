// Fixture check: run the engine on the exact scenario of
// design/mocks/03-results.html (backpacking · 2 people · 5 days · 12+ hrs ·
// hot & sun + ticks · WFA · balanced) and print the kit for comparison.
// The mock is the spec — divergences are engine bugs or logged content calls.
// Run: npm run fixture

import { buildKit } from '../src/engine.js'
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

const kit = buildKit(MOCK_SCENARIO)

console.log(`\n${kit.defaultName}`)
console.log(`${kit.stats.itemCount} items · ${kit.stats.totalWeightOz} oz · ~$${kit.stats.estCost}`)
if (kit.stats.ultralightSavingsOz !== null) {
  console.log(`ultralight cut would drop ~${kit.stats.ultralightSavingsOz} oz`)
}

console.log(`\nBAG (${kit.bag.note})`)
for (const b of kit.bag.options) {
  console.log(`  ${b.preselected ? '▶' : ' '} ${b.name} — ${b.desc}`)
}

for (const s of kit.sections) {
  console.log(`\n${s.title.toUpperCase()}${s.note ? ` — ${s.note}` : ''}`)
  for (const i of s.items) {
    const chips = i.chips.length ? `  [${i.chips.join(', ')}]` : ''
    console.log(`  ${i.name}  ×${i.qty}  ${i.weightOz} oz  ${i.retailer} · $${i.price}${chips}`)
  }
}

console.log('\nTALK TO YOUR DOCTOR')
for (const f of kit.flags) console.log(`  ${f.name} — ${f.why}`)

console.log('\nBEFORE YOU GO')
for (const n of kit.nudges) console.log(`  ${n.title} — ${n.desc}`)

if (kit.checkIn.length) console.log(`\nCHECK-IN NEEDED: ${kit.checkIn.join(', ')}`)
