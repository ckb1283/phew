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

// Icon glyphs, factored so activities in a family can share one (water → paddle,
// wheel → bike). Visual refinement is a later design pass.
const footIcon = (
  <svg className="option-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
    <path className="ico-fill" d="M3 16.5h18V19H3z" />
    <path className="ico-line" d="M4 16.5V8c0-.8.7-1.3 1.5-1.3H9l1.6 3.2h4.9c2.6 0 4.6 1.6 5.5 3.8v2.8M4 16.5h17M8 6.7V5.2" />
  </svg>
)
const paddleIcon = (
  <svg className="option-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
    <ellipse className="ico-fill" cx="12" cy="17.5" rx="3" ry="4.5" />
    <path className="ico-line" d="M12 3.5V13M9.5 3.5h5M12 13c-1.7 0-3 2-3 4.5S10.3 22 12 22s3-2 3-4.5-1.3-4.5-3-4.5z" />
  </svg>
)
const bikeIcon = (
  <svg className="option-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="ico-fill" cx="5.5" cy="16.5" r="1.4" />
    <circle className="ico-fill" cx="18.5" cy="16.5" r="1.4" />
    <path className="ico-line" d="M5.5 16.5a4 4 0 1 0 0 .01M18.5 16.5a4 4 0 1 0 0 .01M5.5 16.5 9.5 9h5.2M9.5 9l4.3 7.5M14.7 9l3.8 7.5M13.5 6.8h2.6M8.3 6.8h2.4" />
  </svg>
)
const carIcon = (
  <svg className="option-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
    <path className="ico-fill" d="M7 9.8 5.8 12.5h5.4V9.8z" />
    <path className="ico-line" d="M3 16.5v-2.7c0-.6.4-1 1-1l1.5-3.4c.3-.7 1-1.1 1.8-1.1h7c.8 0 1.5.4 2 1l2.2 3.5h1.5c.6 0 1 .4 1 1v2.7M3 16.5h3M9 16.5h6M19 16.5h2" />
    <circle className="ico-line" cx="7.5" cy="16.5" r="1.8" />
    <circle className="ico-line" cx="17" cy="16.5" r="1.8" />
  </svg>
)

export const ACTIVITY_OPTIONS: CardOption<Activity>[] = [
  { value: 'backpacking', title: 'Backpacking', icon: footIcon },
  { value: 'kayaking', title: 'Kayaking', icon: paddleIcon },
  { value: 'rafting', title: 'Rafting', icon: paddleIcon },
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
