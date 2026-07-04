import { useState } from 'react'
import type { Condition, Kit } from '@model/types'
import { fetchKit, type WireAnswers } from '../lib/api'
import Wizard, { answeredCount, INITIAL_VALUES, QUESTION_COUNT, type WizardValues } from '../wizard/Wizard'
import { CONDITION_OPTIONS } from '../wizard/config'

type Phase =
  | { kind: 'answering' }
  | { kind: 'checkin' } // "I'm not sure" on conditions → confirm before building
  | { kind: 'loading' }
  | { kind: 'ready'; kit: Kit }
  | { kind: 'error'; message: string }

function toWire(v: WizardValues, conditions: Condition[]): WireAnswers {
  return {
    activity: v.activity!,
    people: v.people,
    kids: v.kids,
    pets: v.pets,
    days: v.duration!.days,
    hoursToCare: v.hoursToCare!,
    conditions,
    environments: v.environments!,
    training: v.training!,
    philosophy: v.philosophy!,
  }
}

export default function Build() {
  const [values, setValues] = useState<WizardValues>(INITIAL_VALUES)
  const [phase, setPhase] = useState<Phase>({ kind: 'answering' })

  const answered = answeredCount(values)
  const complete = answered === QUESTION_COUNT

  const build = async (conditions: Condition[]) => {
    setPhase({ kind: 'loading' })
    try {
      // Floor the loading state at ~1.2s so the canvas pulse reads as a moment,
      // not a flicker — the engine itself answers in milliseconds.
      const [kit] = await Promise.all([
        fetchKit(toWire(values, conditions)),
        new Promise((r) => setTimeout(r, 1200)),
      ])
      setPhase({ kind: 'ready', kit })
    } catch (e) {
      setPhase({ kind: 'error', message: e instanceof Error ? e.message : 'something went wrong' })
    }
  }

  const onBuildClick = () => {
    // Pre-generation check-in: "I'm not sure" never becomes a silent default —
    // the canvas re-asks before the list exists (design/notes.md iteration 4).
    if (values.conditions === 'unsure') setPhase({ kind: 'checkin' })
    else build(values.conditions === null ? [] : values.conditions)
  }

  return (
    <div className="split">
      <aside className="rail">
        <div className="wiz-brand">
          <span className="brand-mark">PHEW</span>
          <span className="brand-tag">the right kit for your trip</span>
        </div>

        <Wizard values={values} onChange={setValues} />

        {complete && phase.kind === 'answering' && (
          <button className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-6)' }} onClick={onBuildClick}>
            Build my kit
          </button>
        )}

        <p className="wiz-disclaimer" style={{ marginTop: 'auto', paddingTop: 'var(--space-8)' }}>
          A checklist to review and own — not medical advice, and no substitute for training. In an
          emergency, call 911.
        </p>
      </aside>

      <main className={`canvas${phase.kind === 'loading' ? ' is-loading' : ''}`}>
        <CanvasTopo />
        {phase.kind === 'answering' && (
          <div className="card canvas-card">
            <h2>{complete ? 'Ready when you are' : 'Your kit builds here'}</h2>
            <p className="text-muted text-small" style={{ marginTop: 'var(--space-2)' }}>
              {answered} of {QUESTION_COUNT} answered
            </p>
          </div>
        )}
        {phase.kind === 'loading' && (
          <div className="card canvas-card">
            <h2>Assembling your kit…</h2>
            <p className="text-muted text-small" style={{ marginTop: 'var(--space-2)' }}>
              reading your answers
            </p>
          </div>
        )}
        {phase.kind === 'checkin' && (
          <CheckIn
            onConfirm={(conditions) => {
              setValues({ ...values, conditions })
              build(conditions)
            }}
          />
        )}
        {phase.kind === 'error' && (
          <div className="card canvas-card">
            <h2>That didn't work</h2>
            <p className="text-muted text-small" style={{ marginTop: 'var(--space-2)' }}>{phase.message}</p>
            <button className="btn btn-secondary" style={{ marginTop: 'var(--space-4)' }} onClick={onBuildClick}>
              Try again
            </button>
          </div>
        )}
        {phase.kind === 'ready' && (
          /* Placeholder summary — the full results screen (mock 03) is the next milestone */
          <div className="card canvas-card">
            <h2>phew.</h2>
            <p className="text-muted text-small" style={{ marginTop: 'var(--space-2)' }}>
              {phase.kit.defaultName} · {phase.kit.stats.itemCount} items ·{' '}
              {phase.kit.stats.totalWeightOz} oz · ~${Math.round(phase.kit.stats.estCostCents / 100)}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

// The condition question, re-asked on the canvas before the list is built.
// No mock exists for this screen — minimal treatment, flagged for design review.
function CheckIn(props: { onConfirm: (conditions: Condition[]) => void }) {
  const [picked, setPicked] = useState<Condition[]>([])
  const toggle = (c: Condition) =>
    setPicked(picked.includes(c) ? picked.filter((x) => x !== c) : [...picked, c])
  return (
    <div className="card canvas-card" style={{ textAlign: 'left', maxWidth: 440 }}>
      <h2>One check before we build</h2>
      <p className="text-muted text-small" style={{ marginTop: 'var(--space-2)' }}>
        You said you weren't sure about your group's conditions. These change what goes in the
        kit — worth a moment.
      </p>
      <div className="qa-options" style={{ marginTop: 'var(--space-4)' }}>
        {CONDITION_OPTIONS.map((o) => (
          <button
            key={o.value}
            className={`option-row${picked.includes(o.value) ? ' is-selected' : ''}`}
            onClick={() => toggle(o.value)}
          >
            <span className="row-check">✓</span> {o.label}
          </button>
        ))}
      </div>
      <button className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }} onClick={() => props.onConfirm(picked)}>
        {picked.length ? 'Confirm & build' : 'None apply — build'}
      </button>
    </div>
  )
}

function CanvasTopo() {
  return (
    <svg className="canvas-art" viewBox="0 0 900 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="#CDEAE3" strokeWidth="1.5">
        <path d="M-50,120 C150,60 280,180 450,140 S750,40 950,110" />
        <path d="M-50,180 C160,120 300,240 470,200 S760,100 950,170" />
        <path d="M-50,240 C170,180 320,300 490,260 S770,160 950,230" />
        <path d="M-50,300 C180,240 340,360 510,320 S780,220 950,290" />
        <path d="M-50,420 C180,480 340,360 510,410 S780,520 950,440" />
        <path d="M-50,480 C170,540 320,420 490,470 S770,580 950,500" />
        <path d="M-50,540 C160,600 300,480 470,530 S760,640 950,560" />
        <path d="M-50,600 C150,660 280,540 450,590 S750,700 950,620" />
      </g>
      <g fill="none" stroke="#9AD5C8" strokeWidth="1.5" opacity="0.6">
        <path d="M-50,150 C155,90 290,210 460,170 S755,70 950,140" />
        <path d="M-50,510 C165,570 310,450 480,500 S765,610 950,530" />
      </g>
    </svg>
  )
}
