// Inline add-item search — port of mock 03 iterations 4/5. Each section
// speaks its own vocabulary; the search runs over name AND application copy
// (one field, two jobs). Results found from any section land in the item's
// home category — the chip shows "→ tools" when a hit lives elsewhere.

import { useRef, useState } from 'react'
import type { Category, Item } from '@model/types'

const SECTION_PROMPTS: Record<Category, { word: string; hint: string }> = {
  bandages: { word: 'injury', hint: 'Try “burn” or “gauze”…' },
  blister: { word: 'issue', hint: 'Try “hotspot” or “blister”…' },
  meds: { word: 'symptom', hint: 'Try “nausea” or “diarrhea”…' },
  tools: { word: 'use', hint: 'Try “ticks” or “light”…' },
  trauma: { word: 'injury', hint: 'Try “bleeding” or “splint”…' },
}

export default function AddSearch(props: {
  category: Category
  catalog: Item[]
  inKit: Set<string> // itemIds already in the kit — no duplicate rows
  onAdd: (item: Item) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const prompt = SECTION_PROMPTS[props.category]

  const q = query.trim().toLowerCase()
  const hits = q
    ? props.catalog
        .filter((i) => !props.inKit.has(i.id))
        .filter((i) => i.name.toLowerCase().includes(q) || i.application.toLowerCase().includes(q))
        .slice(0, 5)
    : []

  const close = () => {
    setQuery('')
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        className="add-row"
        onClick={() => {
          setOpen(true)
          setTimeout(() => inputRef.current?.focus(), 0)
        }}
      >
        + Add item — search by name or {prompt.word}
      </button>
    )
  }

  return (
    <div className="add-search">
      <input
        ref={inputRef}
        type="text"
        placeholder={prompt.hint}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => setTimeout(() => { if (!inputRef.current?.value) close() }, 150)}
      />
      {hits.length > 0 && (
        <div className="add-pop">
          {hits.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                props.onAdd(item)
                close()
              }}
            >
              <strong>{item.name}</strong>
              {item.category !== props.category && <span className="chip"> → {item.category}</span>}
              <span className="sugg-app">{item.application}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
