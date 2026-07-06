// Wizard option lists — UI labels mapped to the model's enum values.
// The enums come from @model/types (single source); only the copy lives here.

import type { ReactNode } from 'react'
import type { Activity, Condition, Environment, HoursToCare, Philosophy, Training } from '@model/types'

export interface CardOption<V extends string> {
  value: V
  title: string
  desc?: string
  icon?: ReactNode
}

// Activity glyphs. Four are Tabler Icons (MIT, no attribution) — one sharp
// stroke family: 24px, fill:none, stroke:currentColor, stroke-width 2, round
// caps/joins. Rafting has no line-icon match in any open set, so it's a custom
// glyph drawn to the same Tabler spec (a pill-tube raft with thwarts on a
// waterline) so it reads native to the set. Color/selected-state via CSS.
const svgProps = {
  className: 'option-icon-svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}
// Tabler `backpack`
const backpackIcon = (
  <svg {...svgProps}>
    <path d="M5 18v-6a6 6 0 0 1 6 -6h2a6 6 0 0 1 6 6v6a3 3 0 0 1 -3 3h-8a3 3 0 0 1 -3 -3" />
    <path d="M10 6v-1a2 2 0 1 1 4 0v1" />
    <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
    <path d="M11 10h2" />
  </svg>
)
// Tabler `kayak`
const kayakIcon = (
  <svg {...svgProps}>
    <path d="M6.414 6.414a2 2 0 0 0 0 -2.828l-1.414 -1.414l-2.828 2.828l1.414 1.414a2 2 0 0 0 2.828 0" />
    <path d="M17.586 17.586a2 2 0 0 0 0 2.828l1.414 1.414l2.828 -2.828l-1.414 -1.414a2 2 0 0 0 -2.828 0" />
    <path d="M6.5 6.5l11 11" />
    <path d="M22 2.5c-9.983 2.601 -17.627 7.952 -20 19.5c9.983 -2.601 17.627 -7.952 20 -19.5" />
    <path d="M6.5 12.5l5 5" />
    <path d="M12.5 6.5l5 5" />
  </svg>
)
// Custom raft in Tabler spec: pill-tube hull + two thwarts, on a waterline
const raftIcon = (
  <svg {...svgProps}>
    <path d="M7 7h10a4 4 0 0 1 0 8h-10a4 4 0 0 1 0 -8z" />
    <path d="M9.5 8v6M14.5 8v6" />
    <path d="M3 19a2 2 0 0 0 2 1a2 2 0 0 0 2 -1a2 2 0 0 1 2 -1a2 2 0 0 1 2 1a2 2 0 0 0 2 1a2 2 0 0 0 2 -1a2 2 0 0 1 2 -1a2 2 0 0 1 2 1" />
  </svg>
)
// Tabler `bike`
const bikeIcon = (
  <svg {...svgProps}>
    <path d="M2 18a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    <path d="M16 18a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    <path d="M12 19v-4l-3 -3l5 -4l2 3h3" />
    <path d="M13.007 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </svg>
)
// Tabler `car`
const carIcon = (
  <svg {...svgProps}>
    <path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
  </svg>
)

export const ACTIVITY_OPTIONS: CardOption<Activity>[] = [
  { value: 'backpacking', title: 'Backpacking', icon: backpackIcon },
  { value: 'kayaking', title: 'Kayaking', icon: kayakIcon },
  { value: 'rafting', title: 'Rafting', icon: raftIcon },
  { value: 'cycle-touring', title: 'Cycle touring', icon: bikeIcon },
  { value: 'car', title: 'Car kit', icon: carIcon },
]

export type DurationBucket = 'day' | '2-3' | '4-7' | 'week-plus'

export const DURATION_OPTIONS: { value: DurationBucket; title: string; days: number | null }[] = [
  { value: 'day', title: 'Day trip', days: 1 },
  { value: '2-3', title: '2–3 days', days: 3 },
  { value: '4-7', title: '4–7 days', days: 5 },
  { value: 'week-plus', title: 'Week-plus', days: null }, // exact count via follow-up
]

export const HOURS_OPTIONS: CardOption<HoursToCare>[] = [
  { value: 'under-1', title: 'Under an hour', desc: 'Frontcountry — help is close' },
  { value: 'few', title: 'A few hours', desc: 'A rough afternoon' },
  { value: '12-plus', title: '12+ hours', desc: "You're the first responder" },
  { value: 'day-plus', title: 'A day or more', desc: 'Deep backcountry' },
]

export const CONDITION_OPTIONS: { value: Condition; label: string }[] = [
  { value: 'severe-allergies', label: 'Severe allergies (bees, foods, meds)' },
  { value: 'adults-60-plus', label: 'Adults 60+ along' },
  { value: 'daily-rx-meds', label: 'Daily prescription meds in group' },
]

export const ENVIRONMENT_CLUSTERS: { label: string; options: { value: Environment; label: string }[] }[] = [
  {
    label: 'Climate & terrain',
    options: [
      { value: 'high-altitude', label: 'High altitude' },
      { value: 'hot-sun', label: 'Hot & sun-exposed' },
      { value: 'cold-winter', label: 'Cold & winter' },
      { value: 'tropical-humid', label: 'Tropical & humid' },
    ],
  },
  {
    label: 'Hazards present',
    options: [
      { value: 'ticks-insects', label: 'Ticks & insects' },
      { value: 'snake-country', label: 'Snake country' },
      { value: 'poison-oak-ivy', label: 'Poison oak & ivy' },
      { value: 'open-water', label: 'Open water' },
      { value: 'wildfire-smoke', label: 'Wildfire smoke' },
    ],
  },
]

export const TRAINING_OPTIONS: CardOption<Training>[] = [
  { value: 'none', title: 'None yet', desc: "We'll keep it intuitive" },
  { value: 'basic', title: 'Basic first aid / CPR' },
  { value: 'wfa-wfr', title: 'WFA / WFR', desc: 'Wilderness-specific training' },
  { value: 'medical-professional', title: 'Medical professional' },
]

export const PHILOSOPHY_OPTIONS: CardOption<Philosophy>[] = [
  { value: 'ultralight', title: 'Ultralight', desc: 'Patch it or walk out — every gram argued with' },
  { value: 'balanced', title: 'Balanced', desc: 'Cover the likely without hauling a pharmacy' },
  { value: 'comprehensive', title: 'Comprehensive', desc: 'Prepared for the group, weight be damned' },
]
