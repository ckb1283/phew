// Item image peek — port of mock 03 iteration 7. Desktop: hover opens the
// popover; mobile: tap toggles, tap-away closes (document listener). Items
// without an image render an honest "photo pending" frame. When item.image_url
// is populated for real, the drawn samples below retire.

import { useEffect, useRef, useState, type ReactNode } from 'react'

// Hand-drawn two-tone samples, keyed by itemId (four demo items from the mock)
const PREVIEWS: Record<string, ReactNode> = {
  leukotape: (
    <svg viewBox="0 0 140 100">
      <rect className="ico-fill" x="20" y="18" width="100" height="64" rx="4" opacity="0.35" />
      <rect className="ico-line" x="20" y="18" width="100" height="64" rx="4" />
      <rect className="ico-fill" x="30" y="28" width="80" height="10" rx="2" />
      <rect className="ico-fill" x="30" y="45" width="80" height="10" rx="2" />
      <rect className="ico-fill" x="30" y="62" width="80" height="10" rx="2" />
    </svg>
  ),
  'closure-strips': (
    <svg viewBox="0 0 140 100">
      <g transform="rotate(-12 70 50)">
        <rect className="ico-fill" x="30" y="30" width="80" height="7" rx="3" />
        <rect className="ico-line" x="30" y="30" width="80" height="7" rx="3" />
        <rect className="ico-fill" x="30" y="46" width="80" height="7" rx="3" />
        <rect className="ico-line" x="30" y="46" width="80" height="7" rx="3" />
        <rect className="ico-fill" x="30" y="62" width="80" height="7" rx="3" />
        <rect className="ico-line" x="30" y="62" width="80" height="7" rx="3" />
      </g>
    </svg>
  ),
  'irrigation-syringe': (
    <svg viewBox="0 0 140 100">
      <rect className="ico-fill" x="30" y="40" width="60" height="20" rx="3" opacity="0.5" />
      <rect className="ico-line" x="30" y="40" width="60" height="20" rx="3" />
      <path className="ico-line" d="M90 46h14l14 3v2l-14 3H90zM30 50h-8M22 42v16M14 50h8" />
      <path className="ico-line" d="M40 40v-6M55 40v-6M70 40v-6" />
    </svg>
  ),
  tourniquet: (
    <svg viewBox="0 0 140 100">
      <circle className="ico-fill" cx="60" cy="50" r="24" opacity="0.5" />
      <circle className="ico-line" cx="60" cy="50" r="24" />
      <circle className="ico-line" cx="60" cy="50" r="15" />
      <circle className="ico-line" cx="60" cy="50" r="7" />
      <path className="ico-line" d="M84 50c14 0 26 4 34 12" />
      <path className="ico-line" d="M84 56c12 2 22 6 30 12" />
    </svg>
  ),
}

export default function Peek(props: { itemId: string; itemName: string }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLSpanElement>(null)

  // Tap-away close (the mobile path)
  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [open])

  const art = PREVIEWS[props.itemId]

  return (
    <span ref={rootRef} onMouseLeave={() => setOpen(false)} style={{ position: 'relative' }}>
      <button
        className="peek-btn"
        title="What does this look like?"
        onMouseEnter={() => setOpen(true)}
        onClick={(e) => {
          e.stopPropagation()
          setOpen(!open)
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.6" />
          <path d="M21 15l-5-5-6 6-3-3-4 4" />
        </svg>
      </button>
      <span className={`peek-pop${open ? ' is-open' : ''}`} onClick={(e) => e.stopPropagation()}>
        <span className="peek-img">{art ?? <span className="peek-pending">photo pending</span>}</span>
        <span className="peek-cap">{props.itemName}</span>
      </span>
    </span>
  )
}
