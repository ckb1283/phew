// The cascading rail wizard — port of mock 02. Eight questions; answered ones
// collapse to a summary line (click to reopen), the active one is expanded,
// upcoming ones are dimmed stubs. The parent owns the answer state.

import { useState, type ReactNode } from 'react'
import type { Condition, Environment, HoursToCare, Philosophy, Training } from '@model/types'
import {
  ACTIVITY_OPTIONS,
  CONDITION_OPTIONS,
  DURATION_OPTIONS,
  ENVIRONMENT_CLUSTERS,
  HOURS_OPTIONS,
  PHILOSOPHY_OPTIONS,
  TRAINING_OPTIONS,
  type CardOption,
  type DurationBucket,
} from './config'
import type { Activity } from '@model/types'

export interface WizardValues {
  activity: Activity | null
  people: number
  kids: boolean
  pets: boolean
  groupDone: boolean
  duration: { bucket: DurationBucket; days: number } | null
  hoursToCare: HoursToCare | null
  conditions: Condition[] | 'unsure' | null // [] = "None of these"
  environments: Environment[] | null
  training: Training | null
  philosophy: Philosophy | null
}

export const INITIAL_VALUES: WizardValues = {
  activity: null,
  people: 2,
  kids: false,
  pets: false,
  groupDone: false,
  duration: null,
  hoursToCare: null,
  conditions: null,
  environments: null,
  training: null,
  philosophy: null,
}

export function answeredCount(v: WizardValues): number {
  return [
    v.activity !== null,
    v.groupDone,
    v.duration !== null,
    v.hoursToCare !== null,
    v.conditions !== null,
    v.environments !== null,
    v.training !== null,
    v.philosophy !== null,
  ].filter(Boolean).length
}

export const QUESTION_COUNT = 8

// "Label: answer" lines for the doctor-email composer (mock 03 format)
export function summaryLines(v: WizardValues): string[] {
  const labels = ['Activity', 'Your people', 'Duration', 'Distance from help', 'Conditions', 'Environment', 'Training', 'Packing style']
  const values = [
    summarize.activity(v), summarize.group(v), summarize.duration(v), summarize.hours(v),
    summarize.conditions(v), summarize.environments(v), summarize.training(v), summarize.philosophy(v),
  ]
  return labels.map((label, i) => `${label}: ${values[i] ?? '—'}`)
}

// --- Section chrome ----------------------------------------------------------

function QaShell(props: {
  index: number
  label: string
  summary: string | null
  active: boolean
  onReopen: () => void
  children: ReactNode
}) {
  const state = props.active ? 'is-active' : props.summary !== null ? 'is-done' : 'is-upcoming'
  return (
    <section className={`qa ${state}`}>
      <button className="qa-head" onClick={props.onReopen}>
        <span className="qa-num">{props.index + 1}</span>
        <span className="qa-label">{props.label}</span>
        <span className="qa-answer">{props.summary ?? ''}</span>
        <span className="qa-edit">edit</span>
      </button>
      <div className="qa-body">{props.children}</div>
    </section>
  )
}

function OptionCards<V extends string>(props: {
  options: CardOption<V>[]
  selected: V | null
  onPick: (value: V) => void
  grid?: boolean
}) {
  return (
    <div className={`qa-options${props.grid ? ' grid-2' : ''}`}>
      {props.options.map((o) => (
        <button
          key={o.value}
          className={`option-card${o.icon ? ' has-icon' : ''}${props.selected === o.value ? ' is-selected' : ''}`}
          onClick={() => props.onPick(o.value)}
        >
          {o.icon}
          <span className="option-text">
            <span className="option-title">{o.title}</span>
            {o.desc && <span className="option-desc">{o.desc}</span>}
          </span>
        </button>
      ))}
    </div>
  )
}

function OptionRow(props: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button className={`option-row${props.selected ? ' is-selected' : ''}`} onClick={props.onClick}>
      <span className="row-check">✓</span> {props.children}
    </button>
  )
}

function Stepper(props: { value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="stepper">
      <button type="button" onClick={() => props.onChange(Math.max(props.value - 1, props.min))}>−</button>
      <span className="stepper-value">{props.value}</span>
      <button type="button" onClick={() => props.onChange(Math.min(props.value + 1, props.max))}>+</button>
    </div>
  )
}

// --- Summaries ------------------------------------------------------------------

const summarize = {
  activity: (v: WizardValues) =>
    v.activity && (ACTIVITY_OPTIONS.find((o) => o.value === v.activity)?.title ?? null),
  group: (v: WizardValues) => {
    if (!v.groupDone) return null
    const extras = [v.kids && 'kids', v.pets && 'pets'].filter(Boolean)
    return `${v.people} ${v.people === 1 ? 'person' : 'people'}${extras.length ? ' · ' + extras.join(' · ') : ''}`
  },
  duration: (v: WizardValues) => {
    if (!v.duration) return null
    if (v.duration.bucket === 'week-plus') return `${v.duration.days} days`
    return DURATION_OPTIONS.find((o) => o.value === v.duration!.bucket)?.title ?? null
  },
  hours: (v: WizardValues) =>
    v.hoursToCare && (HOURS_OPTIONS.find((o) => o.value === v.hoursToCare)?.title ?? null),
  conditions: (v: WizardValues) => {
    if (v.conditions === null) return null
    if (v.conditions === 'unsure') return "I'm not sure"
    if (v.conditions.length === 0) return 'None'
    if (v.conditions.length === 1)
      return CONDITION_OPTIONS.find((o) => o.value === (v.conditions as Condition[])[0])?.label ?? null
    return `${v.conditions.length} selected`
  },
  environments: (v: WizardValues) => {
    if (v.environments === null) return null
    if (v.environments.length === 0) return 'None'
    if (v.environments.length === 1) {
      const all = ENVIRONMENT_CLUSTERS.flatMap((c) => c.options)
      return all.find((o) => o.value === v.environments![0])?.label ?? null
    }
    return `${v.environments.length} selected`
  },
  training: (v: WizardValues) =>
    v.training && (TRAINING_OPTIONS.find((o) => o.value === v.training)?.title ?? null),
  philosophy: (v: WizardValues) =>
    v.philosophy && (PHILOSOPHY_OPTIONS.find((o) => o.value === v.philosophy)?.title ?? null),
}

// --- The wizard -------------------------------------------------------------------

export default function Wizard(props: {
  values: WizardValues
  onChange: (values: WizardValues) => void
}) {
  const v = props.values

  // Which question is expanded: a manual reopen wins; otherwise the first
  // unanswered. Committing any answer clears the override (mock behavior:
  // advance to the first unanswered).
  const [reopened, setReopened] = useState<number | null>(null)
  const [weekPlusOpen, setWeekPlusOpen] = useState(false)
  // Local staging for multi-selects (committed by Continue)
  const [condDraft, setCondDraft] = useState<Condition[] | 'unsure' | 'none' | null>(null)
  const [envDraft, setEnvDraft] = useState<Environment[]>([])

  const summaries = [
    summarize.activity(v), summarize.group(v), summarize.duration(v), summarize.hours(v),
    summarize.conditions(v), summarize.environments(v), summarize.training(v), summarize.philosophy(v),
  ]
  const firstUnanswered = summaries.findIndex((s) => s === null)
  const active = reopened ?? (firstUnanswered === -1 ? null : firstUnanswered)

  const commit = (patch: Partial<WizardValues>) => {
    props.onChange({ ...v, ...patch })
    setReopened(null)
  }
  const reopen = (i: number) => () => {
    if (summaries[i] !== null && active !== i) setReopened(i)
  }

  const condToggle = (c: Condition) => {
    const cur = Array.isArray(condDraft) ? condDraft : []
    setCondDraft(cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c])
  }
  const envToggle = (e: Environment) => {
    setEnvDraft(envDraft.includes(e) ? envDraft.filter((x) => x !== e) : [...envDraft, e])
  }

  return (
    <div className="cascade">
      <QaShell index={0} label="Activity" summary={summaries[0]} active={active === 0} onReopen={reopen(0)}>
        <h2 className="qa-question">What's this kit for?</h2>
        <p className="qa-help">Different adventures break people in different ways.</p>
        <OptionCards options={ACTIVITY_OPTIONS} grid selected={v.activity} onPick={(a) => commit({ activity: a })} />
      </QaShell>

      <QaShell index={1} label="Your people" summary={summaries[1]} active={active === 1} onReopen={reopen(1)}>
        <h2 className="qa-question">How many people are you covering?</h2>
        <p className="qa-help">Count everyone this kit is responsible for — including you.</p>
        <div className="qa-options">
          <Stepper value={v.people} min={1} max={12} onChange={(n) => props.onChange({ ...v, people: n })} />
          <div className="qa-options grid-2" style={{ marginTop: 'var(--space-1)' }}>
            <OptionRow selected={v.kids} onClick={() => props.onChange({ ...v, kids: !v.kids })}>
              Kids under 12
            </OptionRow>
            <OptionRow selected={v.pets} onClick={() => props.onChange({ ...v, pets: !v.pets })}>
              Pets
            </OptionRow>
          </div>
        </div>
        <button className="btn btn-primary qa-continue" onClick={() => commit({ groupDone: true })}>
          Continue
        </button>
      </QaShell>

      <QaShell index={2} label="Duration" summary={summaries[2]} active={active === 2} onReopen={reopen(2)}>
        <h2 className="qa-question">{v.activity === 'car' ? 'How long are your typical outings?' : 'How long are you out?'}</h2>
        <p className="qa-help">
          {v.activity === 'car'
            ? 'A trunk kit is stocked like a well-provisioned trip no matter the answer — pick whatever fits.'
            : 'Longer trips need more doses and broader medication coverage.'}
        </p>
        <div className="qa-options">
          {DURATION_OPTIONS.map((o) => (
            <button
              key={o.value}
              className={`option-card${v.duration?.bucket === o.value ? ' is-selected' : ''}`}
              onClick={() => {
                if (o.days === null) {
                  setWeekPlusOpen(true)
                  props.onChange({ ...v, duration: null })
                } else {
                  setWeekPlusOpen(false)
                  commit({ duration: { bucket: o.value, days: o.days } })
                }
              }}
            >
              <span className="option-title">{o.title}</span>
            </button>
          ))}
        </div>
        <div className={`qa-followup${weekPlusOpen ? ' is-open' : ''}`}>
          <span className="text-small text-secondary">How many days?</span>
          <WeekPlusDays
            onContinue={(days) => {
              setWeekPlusOpen(false)
              commit({ duration: { bucket: 'week-plus', days } })
            }}
          />
        </div>
      </QaShell>

      <QaShell index={3} label="Distance from help" summary={summaries[3]} active={active === 3} onReopen={reopen(3)}>
        <h2 className="qa-question">If something went wrong, how far is help?</h2>
        <p className="qa-help">
          Time to a road, signal, or ER — not trip length. A one-day canyon can be 12 hours from help.
          This is the single biggest factor in what your kit must handle.
        </p>
        <OptionCards options={HOURS_OPTIONS} selected={v.hoursToCare} onPick={(h) => commit({ hoursToCare: h })} />
      </QaShell>

      <QaShell index={4} label="Conditions" summary={summaries[4]} active={active === 4} onReopen={reopen(4)}>
        <h2 className="qa-question">Anything your group brings with it?</h2>
        <p className="qa-help">Select all that apply — these add targeted items and flags.</p>
        <div className="qa-options">
          {CONDITION_OPTIONS.map((o) => (
            <OptionRow
              key={o.value}
              selected={Array.isArray(condDraft) && condDraft.includes(o.value)}
              onClick={() => condToggle(o.value)}
            >
              {o.label}
            </OptionRow>
          ))}
          <div className="qa-options grid-2">
            {/* "None" and "I'm not sure" are exclusive of everything, including each other */}
            <OptionRow selected={condDraft === 'none'} onClick={() => setCondDraft('none')}>
              None of these
            </OptionRow>
            <OptionRow selected={condDraft === 'unsure'} onClick={() => setCondDraft('unsure')}>
              I'm not sure
            </OptionRow>
          </div>
        </div>
        <button
          className="btn btn-primary qa-continue"
          onClick={() =>
            commit({
              conditions: condDraft === 'unsure' ? 'unsure' : Array.isArray(condDraft) ? condDraft : [],
            })
          }
        >
          Continue
        </button>
      </QaShell>

      <QaShell index={5} label="Environment" summary={summaries[5]} active={active === 5} onReopen={reopen(5)}>
        <h2 className="qa-question">What will you be dealing with?</h2>
        <p className="qa-help">Select all that apply — each adds a small module.</p>
        <div className="qa-options">
          {ENVIRONMENT_CLUSTERS.map((cluster) => (
            <div key={cluster.label}>
              <div className="qa-cluster-label">{cluster.label}</div>
              <div className="qa-options grid-2">
                {cluster.options.map((o) => (
                  <OptionRow key={o.value} selected={envDraft.includes(o.value)} onClick={() => envToggle(o.value)}>
                    {o.label}
                  </OptionRow>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary qa-continue" onClick={() => commit({ environments: envDraft })}>
          Continue
        </button>
      </QaShell>

      <QaShell index={6} label="Training" summary={summaries[6]} active={active === 6} onReopen={reopen(6)}>
        <h2 className="qa-question">What's your first-aid training?</h2>
        <p className="qa-help">
          The rule every guide repeats: never carry what you don't know how to use. Trauma gear
          unlocks with training.
        </p>
        <OptionCards options={TRAINING_OPTIONS} selected={v.training} onPick={(t) => commit({ training: t })} />
      </QaShell>

      <QaShell index={7} label="Packing style" summary={summaries[7]} active={active === 7} onReopen={reopen(7)}>
        <h2 className="qa-question">How do you pack?</h2>
        <p className="qa-help">The honest tension: covering everything vs. carrying it all day.</p>
        <OptionCards options={PHILOSOPHY_OPTIONS} selected={v.philosophy} onPick={(p) => commit({ philosophy: p })} />
      </QaShell>
    </div>
  )
}

function WeekPlusDays(props: { onContinue: (days: number) => void }) {
  const [days, setDays] = useState(10)
  return (
    <>
      <Stepper value={days} min={8} max={60} onChange={setDays} />
      <button className="btn btn-primary" onClick={() => props.onContinue(days)}>
        Continue
      </button>
    </>
  )
}
