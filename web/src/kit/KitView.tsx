// The results screen — port of mock 03, driven by the live Kit payload.
// Client-side edit state only (qty, removed, packed, added items); real
// persistence arrives with shareable lists + Postgres.

import { useEffect, useMemo, useState } from 'react'
import type { Category, Item, Kit, KitItem } from '@model/types'
import AddSearch from './AddSearch'
import Peek from './Peek'
import { bagArt } from './bagArt'

interface RowEdit {
  qty?: number
  removed?: boolean
  got?: boolean
}

interface ClientRow {
  itemId: string
  name: string
  application: string
  qty: number
  unit: string
  unitWeightOz: number
  priceCents: number
  retailer: string
  purchaseUrl: string
  chips: { label: string }[]
  addedByYou: boolean
  removed: boolean
  got: boolean
}

const usd = (cents: number) => `$${Math.round(cents / 100)}`
const oz = (n: number) => `${Math.round(n * 10) / 10} oz`

export default function KitView(props: {
  kit: Kit
  philosophyLabel: string
  tripLines: string[]
  onRetune: (() => void) | null
}) {
  const { kit } = props
  const [name, setName] = useState('')
  const [checklist, setChecklist] = useState(false)
  const [bagId, setBagId] = useState(kit.bag.options.find((o) => o.preselected)?.id ?? kit.bag.options[0]?.id)
  const [edits, setEdits] = useState<Record<string, RowEdit>>({})
  const [added, setAdded] = useState<Item[]>([])
  const [flash, setFlash] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [checkCopied, setCheckCopied] = useState(false)
  const [catalog, setCatalog] = useState<Item[]>([])

  useEffect(() => {
    fetch('/api/catalog')
      .then((r) => r.json())
      .then((d) => setCatalog(d.items))
      .catch(() => setCatalog([])) // add-search degrades to nothing; the kit still works
  }, [])

  const catalogById = useMemo(() => new Map(catalog.map((i) => [i.id, i])), [catalog])
  const edit = (id: string, patch: RowEdit) => setEdits((e) => ({ ...e, [id]: { ...e[id], ...patch } }))

  // --- Rows: engine sections + user-added items, with edits applied ------------

  const toClientRow = (r: KitItem): ClientRow => {
    const e = edits[r.itemId] ?? {}
    return {
      itemId: r.itemId,
      name: r.name,
      application: r.application,
      qty: e.qty ?? r.qty,
      unit: r.unit,
      unitWeightOz: catalogById.get(r.itemId)?.weightOz ?? (r.qty > 0 ? r.weightOz / r.qty : 0),
      priceCents: r.priceCents,
      retailer: r.retailer,
      purchaseUrl: r.purchaseUrl,
      chips: r.chips,
      addedByYou: false,
      removed: e.removed ?? false,
      got: e.got ?? false,
    }
  }
  const addedToClientRow = (i: Item): ClientRow => {
    const e = edits[i.id] ?? {}
    return {
      itemId: i.id,
      name: i.name,
      application: i.application,
      qty: e.qty ?? 1,
      unit: i.unit,
      unitWeightOz: i.weightOz,
      priceCents: i.priceCents,
      retailer: i.retailer,
      purchaseUrl: i.purchaseUrl,
      chips: [],
      addedByYou: true,
      removed: e.removed ?? false,
      got: e.got ?? false,
    }
  }

  const presentCategories = new Set(kit.sections.map((s) => s.category))
  const sections = kit.sections.map((s) => ({
    ...s,
    rows: [
      ...s.items.map(toClientRow),
      ...added.filter((i) => homeCategory(i, s.category, presentCategories) === s.category).map(addedToClientRow),
    ],
  }))

  const inKit = new Set(sections.flatMap((s) => s.rows.map((r) => r.itemId)))
  const liveRows = sections.flatMap((s) => s.rows).filter((r) => !r.removed)
  const totalWeightOz = liveRows.reduce((sum, r) => sum + r.qty * r.unitWeightOz, 0)
  const totalCents = liveRows.reduce((sum, r) => sum + r.priceCents, 0)
  const packed = liveRows.filter((r) => r.got).length

  const addItem = (item: Item) => {
    setAdded((a) => [...a, item])
    setFlash(item.id)
    setTimeout(() => setFlash(null), 1700)
  }

  const copyDoctor = () => {
    const questions = kit.flags.map((f, i) => `${i + 1}. ${f.name} — ${f.why}`)
    const text =
      'Upcoming trip:\n' + props.tripLines.map((l) => `- ${l}`).join('\n') +
      '\n\nQuestions for my visit:\n' + questions.join('\n') +
      '\n\n(Prepared with phewbag.com)'
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Transparency feature: the full inputs + outputs as plain text, formatted to
  // paste into an LLM, email, or SMS for independent verification. Reflects the
  // list AS EDITED — what the user will actually pack.
  const copyDoubleCheck = () => {
    const sectionBlocks = sections
      .map((s) => {
        const live = s.rows.filter((r) => !r.removed)
        if (live.length === 0) return null
        const lines = live.map((r) => `- ${r.name} — ${r.unit === 'inch' ? `${r.qty}"` : `x${r.qty}`}`)
        return `${s.title}:\n${lines.join('\n')}`
      })
      .filter(Boolean)
      .join('\n\n')
    const text =
      'Please double-check this first-aid packing list. It was generated for the trip below. ' +
      'Flag anything missing, anything unnecessary, and any quantity that looks wrong.\n\n' +
      'TRIP\n' + props.tripLines.map((l) => `- ${l}`).join('\n') +
      `\n\nPACKING LIST (${liveRows.length} items · ${oz(totalWeightOz)} · est. ~${usd(totalCents)})\n\n` +
      sectionBlocks +
      (kit.flags.length ? '\n\nDOCTOR-CONSULT ITEMS (not in the list; prescription conversations)\n' + kit.flags.map((f) => `- ${f.name}: ${f.why}`).join('\n') : '') +
      (kit.nudges.length ? '\n\nPREPARATION NOTES\n' + kit.nudges.map((n) => `- ${n.title}: ${n.desc}`).join('\n') : '') +
      `\n\nNote: ${kit.disclaimer}\n(Generated by phewbag.com)`
    navigator.clipboard.writeText(text).then(() => {
      setCheckCopied(true)
      setTimeout(() => setCheckCopied(false), 2000)
    })
  }

  const showRetune = props.onRetune && kit.stats.ultralightSavingsOz !== null && kit.stats.ultralightSavingsOz > 0

  return (
    <div className={`kit${checklist ? ' is-checklist' : ''}`}>
      <header className="kit-header">
        <div className="kit-name-row">
          <input
            className="kit-name"
            value={name}
            placeholder={kit.defaultName}
            aria-label="Kit name"
            onChange={(e) => setName(e.target.value)}
          />
          <button className="kit-name-edit" title="Rename">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3l4 4L8 20l-5 1 1-5L17 3z" />
            </svg>
          </button>
        </div>
        <p className="kit-name-hint">Optional — "Rogue River, June" beats "{kit.defaultName}" when you're looking for it later.</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
          <div className="kit-stats">
            <div className="kit-stat"><div className="stat-value">{liveRows.length}</div><div className="stat-label">items</div></div>
            <div className="kit-stat"><div className="stat-value">{oz(totalWeightOz)}</div><div className="stat-label">total weight</div></div>
            <div className="kit-stat"><div className="stat-value">~{usd(totalCents)}</div><div className="stat-label">est. cost</div></div>
          </div>
          <div className="pack-progress">{packed} of {liveRows.length} packed</div>
          <button className="btn btn-secondary" title="Copy this trip and list as text — paste into an AI, email, or message to verify it" onClick={copyDoubleCheck}>
            {checkCopied ? 'Copied ✓' : '⧉ Double-check'}
          </button>
          <button className={`btn btn-secondary btn-toggle${checklist ? ' is-on' : ''}`} onClick={() => setChecklist(!checklist)}>
            ☑ Checklist
          </button>
        </div>
        {showRetune && (
          <p className="text-caption kit-retune" style={{ marginTop: 'var(--space-3)' }}>
            {props.philosophyLabel} build — an ultralight cut would drop ~{kit.stats.ultralightSavingsOz} oz ·{' '}
            <button className="link-btn" onClick={() => props.onRetune!()}>re-tune</button>
          </p>
        )}
      </header>

      {/* Bag selection */}
      <section className="kit-section" style={{ marginTop: 0 }}>
        <div className="kit-section-head">
          <h2>Pick your bag</h2>
          <span className="kit-section-note">{kit.bag.note}</span>
        </div>
        <div className="bag-list" style={{ marginTop: 'var(--space-3)' }}>
          <div className="bag-pair">
            {kit.bag.options.filter((o) => o.priceCents === null).map((o) => (
              <BagRow key={o.id} option={o} selected={bagId === o.id} onPick={() => setBagId(o.id)} />
            ))}
          </div>
          {kit.bag.options.filter((o) => o.priceCents !== null).map((o) => (
            <BagRow key={o.id} option={o} selected={bagId === o.id} onPick={() => setBagId(o.id)} />
          ))}
        </div>
      </section>

      {/* Shopping sections */}
      {sections.map((s) => {
        const removedCount = s.rows.filter((r) => r.removed).length
        return (
          <section key={s.category} className="kit-section" data-cat={s.category}>
            <div className="kit-section-head">
              <h2>{s.title}</h2>
              {s.note && <span className="kit-section-note">{s.note}</span>}
              {removedCount > 0 && (
                <button
                  className="removed-note is-visible"
                  onClick={() => setEdits((e) => {
                    const next = { ...e }
                    for (const r of s.rows) if (next[r.itemId]?.removed) next[r.itemId] = { ...next[r.itemId], removed: false }
                    return next
                  })}
                >
                  {removedCount} removed · restore
                </button>
              )}
            </div>
            {s.rows.map((r) => (
              <ItemRow
                key={r.itemId}
                row={r}
                flash={flash === r.itemId}
                checklist={checklist}
                onQty={(d) => edit(r.itemId, { qty: Math.max(1, r.qty + d) })}
                onRemove={() => edit(r.itemId, { removed: true })}
                onToggleGot={() => edit(r.itemId, { got: !r.got })}
              />
            ))}
            <AddSearch category={s.category} catalog={catalog} inKit={inKit} onAdd={addItem} />
          </section>
        )
      })}

      {/* Doctor flags */}
      {kit.flags.length > 0 && (
        <section className="kit-section is-nonpack">
          <div className="kit-section-head">
            <h2>Talk to your doctor</h2>
            <span className="kit-section-note">prescription items — consult your physician</span>
          </div>
          {kit.flags.map((f) => (
            <div className="flag-item" key={f.id}>
              <span className="item-name">{f.name}</span>
              <span className="item-why">{f.why}</span>
            </div>
          ))}
          <button className="btn btn-secondary" style={{ marginTop: 'var(--space-3)' }} onClick={copyDoctor}>
            {copied ? 'Copied ✓' : 'Copy for email'}
          </button>
          <span className="text-caption" style={{ marginLeft: 'var(--space-3)' }}>
            Trip details and questions, ready to paste to your doctor.
          </span>
        </section>
      )}

      {/* Before you go */}
      {kit.nudges.length > 0 && (
        <section className="kit-section is-nonpack">
          <div className="kit-section-head">
            <h2>Before you go</h2>
            <span className="kit-section-note">recommended preparation</span>
          </div>
          {kit.nudges.map((n) => (
            <div className="nudge" key={n.id}>
              <div>
                <div className="nudge-title">{n.title}</div>
                <div className="nudge-desc">{n.desc}</div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Interest capture — visual only until the Postgres milestone wires it */}
      <div className="interest-card">
        <h2>Want this exact kit built and shipped?</h2>
        <p>We're gauging interest in hand-assembled Phew kits. Leave an email and we'll tell you when it's real.</p>
        <div className="interest-form">
          <input type="email" placeholder="you@trailhead.com" disabled />
          <button className="btn btn-primary" disabled>Keep me posted</button>
        </div>
        <p className="text-caption" style={{ marginTop: 'var(--space-2)' }}>Coming soon — not accepting emails yet.</p>
      </div>

      <p className="wiz-disclaimer">{kit.disclaimer}</p>
    </div>
  )
}

// An added item lands in its home category's section; if that section doesn't
// exist in this kit, it stays where the search happened (mock 03 fallback).
function homeCategory(item: Item, searchedFrom: Category, present: Set<Category>): Category {
  return present.has(item.category) ? item.category : searchedFrom
}

function BagRow(props: { option: Kit['bag']['options'][number]; selected: boolean; onPick: () => void }) {
  const o = props.option
  return (
    <button className={`bag-row${props.selected ? ' is-selected' : ''}`} onClick={props.onPick}>
      <span className="bag-thumb">{bagArt(o.id)}</span>
      <span>
        <span className="bag-title">{o.name}</span>
        <br />
        <span className="bag-desc">{o.desc}</span>
      </span>
      {o.priceCents !== null && (
        <span className="bag-meta">{o.weightOz} oz · {usd(o.priceCents)} ↗</span>
      )}
    </button>
  )
}

function ItemRow(props: {
  row: ClientRow
  flash: boolean
  checklist: boolean
  onQty: (delta: number) => void
  onRemove: () => void
  onToggleGot: () => void
}) {
  const r = props.row
  return (
    <div
      className={`kit-item${r.removed ? ' is-removed' : ''}${r.got ? ' is-got' : ''}${props.flash ? ' is-new' : ''}`}
      onClick={(e) => {
        if (!props.checklist) return
        if ((e.target as HTMLElement).closest('.item-buy')) return
        props.onToggleGot()
      }}
    >
      <span className="item-check">✓</span>
      <span className="item-name">
        {r.name}
        {r.chips.map((c) => (
          <span key={c.label} className="chip chip-accent"> {c.label}</span>
        ))}
        {r.addedByYou && <span className="chip"> added by you</span>}
        <Peek itemId={r.itemId} itemName={r.name} />
      </span>
      {/* Length-unit items read as 26" (mock), count items as ×26 */}
      <span className="item-qty">{r.unit === 'inch' ? `${r.qty}"` : `×${r.qty}`}</span>
      <span className="item-weight">{oz(r.qty * r.unitWeightOz)}</span>
      <a className="item-buy" href={r.purchaseUrl} target="_blank" rel="noreferrer">
        {r.retailer} · {usd(r.priceCents)} ↗
      </a>
      <span className="item-why">{r.application}</span>
      <span className="item-controls">
        <button className="ctl-btn" title="Fewer" onClick={(e) => { e.stopPropagation(); props.onQty(-1) }}>−</button>
        <button className="ctl-btn" title="More" onClick={(e) => { e.stopPropagation(); props.onQty(1) }}>+</button>
        <span className="ctl-divider"></span>
        <button className="ctl-btn ctl-remove" title="Remove" onClick={(e) => { e.stopPropagation(); props.onRemove() }}>×</button>
      </span>
    </div>
  )
}
