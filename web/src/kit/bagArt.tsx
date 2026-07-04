// Two-tone line thumbnails for bag options, keyed by container id.
// The first five are ports of mock 03; ammo-can / frame-bag / trunk-case are
// new in the same drawing style (their activities never got a results mock).

import type { ReactNode } from 'react'

const ART: Record<string, ReactNode> = {
  'own-bag': (
    <svg viewBox="0 0 44 40" aria-hidden="true">
      <path className="ico-line" d="M8 13h28v18a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3z" strokeDasharray="3 3" />
    </svg>
  ),
  ziplock: (
    <svg viewBox="0 0 44 40" aria-hidden="true">
      <path className="ico-fill" d="M9 12h26v20a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2z" opacity="0.5" />
      <path className="ico-line" d="M9 12h26v20a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2zM9 12V9a1 1 0 0 1 1-1h24a1 1 0 0 1 1 1v3M11 10.5h22" />
    </svg>
  ),
  'ul-zip-sack': (
    <svg viewBox="0 0 44 40" aria-hidden="true">
      <path className="ico-fill" d="M8 14h28v18a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3z" opacity="0.5" />
      <path className="ico-line" d="M8 14h28v18a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3zM8 14l3-6h22l3 6M14 14v-3M30 14v-3" />
      <path className="ico-line" d="M12 20h20" strokeDasharray="2 3" />
    </svg>
  ),
  'organizer-pouch': (
    <svg viewBox="0 0 44 40" aria-hidden="true">
      <path className="ico-fill" d="M6 12h32v20a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" opacity="0.5" />
      <path className="ico-line" d="M6 12h32v20a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3zM6 12c0-3 2-5 5-5h22c3 0 5 2 5 5M17 7v-2h10v2" />
      <path className="ico-line" d="M6 22h32M15 12v23M29 12v23" />
    </svg>
  ),
  'dry-pouch': (
    <svg viewBox="0 0 44 40" aria-hidden="true">
      <path className="ico-fill" d="M10 16h24v16a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4z" opacity="0.5" />
      <path className="ico-line" d="M10 16h24v16a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4zM10 16c-2-2-2-5 1-6l3-1c2-.7 14-.7 16 0l3 1c3 1 3 4 1 6M8 10l-3 3M36 10l3 3" />
    </svg>
  ),
  'ammo-can': (
    <svg viewBox="0 0 44 40" aria-hidden="true">
      <path className="ico-fill" d="M7 15h30v17a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z" opacity="0.5" />
      <path className="ico-line" d="M7 15h30v17a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2zM7 15v-3a2 2 0 0 1 2-2h26a2 2 0 0 1 2 2v3M16 10V7h12v3" />
      <path className="ico-line" d="M7 21h30M11 15v-3M33 15v-3" />
    </svg>
  ),
  'frame-bag': (
    <svg viewBox="0 0 44 40" aria-hidden="true">
      <path className="ico-fill" d="M8 18h26l-5 12H12z" opacity="0.5" />
      <path className="ico-line" d="M8 18h26l-5 12H12zM8 18l4-6h20M14 24h14" strokeDasharray="0" />
      <path className="ico-line" d="M15 21h12" strokeDasharray="2 3" />
    </svg>
  ),
  'trunk-case': (
    <svg viewBox="0 0 44 40" aria-hidden="true">
      <path className="ico-fill" d="M6 14h32v18a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" opacity="0.5" />
      <path className="ico-line" d="M6 14h32v18a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3zM6 20h32M13 14v-4h18v4M13 20v4M31 20v4" />
    </svg>
  ),
}

const FALLBACK = (
  <svg viewBox="0 0 44 40" aria-hidden="true">
    <path className="ico-fill" d="M8 13h28v18a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3z" opacity="0.5" />
    <path className="ico-line" d="M8 13h28v18a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3z" />
  </svg>
)

export function bagArt(containerId: string): ReactNode {
  return ART[containerId] ?? FALLBACK
}
