import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Item as ItemType } from '@model/types'
import { fetchCatalog } from '../lib/api'

const CATEGORY_LABEL: Record<string, string> = {
  bandages: 'Bandages & wound care',
  blister: 'Blister & foot care',
  meds: 'Medications',
  tools: 'Tools & instruments',
  trauma: 'Trauma layer',
}

const usd = (cents: number) => `~$${Math.round(cents / 100)}`

// undefined = loading, null = not found, Item = loaded
export default function Item() {
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<ItemType | null | undefined>(undefined)

  useEffect(() => {
    let live = true
    fetchCatalog()
      .then((items) => live && setItem(items.find((i) => i.id === id) ?? null))
      .catch(() => live && setItem(null))
    return () => {
      live = false
    }
  }, [id])

  if (item === undefined) {
    return (
      <main className="item-page">
        <p className="text-secondary">Loading…</p>
      </main>
    )
  }

  if (item === null) {
    return (
      <main className="item-page">
        <p className="text-secondary">That item isn’t in the catalog.</p>
        <Link className="link-btn" to="/">
          ← Back to phew
        </Link>
      </main>
    )
  }

  return (
    <main className="item-page">
      <Link className="link-btn item-back" to="/build">
        ← Back to your kit
      </Link>

      <article className="item-detail">
        <div className="item-photo" aria-label={item.imageAlt ?? `${item.name} — photo pending`}>
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.imageAlt ?? item.name} />
          ) : (
            <span className="item-photo-pending">photo pending</span>
          )}
        </div>

        <div className="item-body">
          <span className="item-eyebrow">{CATEGORY_LABEL[item.category] ?? item.category}</span>
          <h1 className="item-name">{item.name}</h1>
          <p className="item-application">{item.application}</p>

          <dl className="item-meta">
            <div>
              <dt>Counted in</dt>
              <dd>{item.unit}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{item.weightOz} oz each</dd>
            </div>
            <div>
              <dt>Est. price</dt>
              <dd>{usd(item.priceCents)}</dd>
            </div>
          </dl>

          <section className="item-buy">
            <h2 className="item-buy-head">Where to buy</h2>
            <a className="btn btn-primary" href={item.purchaseUrl} target="_blank" rel="noopener noreferrer">
              Find it at {item.retailer} ↗
            </a>
            <p className="text-caption text-secondary item-buy-note">
              Price is an estimate — the live price is on the retailer’s page.
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
