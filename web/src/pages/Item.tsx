import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchItem, type ItemDetail } from '../lib/api'

const CATEGORY_LABEL: Record<string, string> = {
  bandages: 'Bandages & wound care',
  blister: 'Blister & foot care',
  meds: 'Medications',
  tools: 'Tools & instruments',
  trauma: 'Trauma layer',
}

const usd = (cents: number) => `~$${Math.round(cents / 100)}`

// undefined = loading, null = not found, ItemDetail = loaded
export default function Item() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<ItemDetail | null | undefined>(undefined)

  useEffect(() => {
    let live = true
    if (!id) return
    fetchItem(id)
      .then((d) => live && setData(d))
      .catch(() => live && setData(null))
    return () => {
      live = false
    }
  }, [id])

  if (data === undefined) {
    return (
      <main className="item-page">
        <p className="text-secondary">Loading…</p>
      </main>
    )
  }

  if (data === null) {
    return (
      <main className="item-page">
        <p className="text-secondary">That item isn’t in the catalog.</p>
        <Link className="link-btn" to="/">
          ← Back to phew
        </Link>
      </main>
    )
  }

  const { item, content } = data

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
        </div>
      </article>

      {content?.overview && (
        <section className="item-block">
          <h2 className="item-block-head">What it is & when to use it</h2>
          <p className="item-block-body">{content.overview}</p>
        </section>
      )}

      {content?.substitutes && content.substitutes.length > 0 && (
        <section className="item-block">
          <h2 className="item-block-head">Substitutes & improvisables</h2>
          <p className="item-block-lead text-secondary">
            No “right” product — here’s what works if you’re cutting weight or don’t have it:
          </p>
          <ul className="item-list">
            {content.substitutes.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      )}

      {(content?.quantityNote || content?.expiryNote) && (
        <section className="item-block">
          <h2 className="item-block-head">How much & how long</h2>
          {content.quantityNote && <p className="item-block-body">{content.quantityNote}</p>}
          {content.expiryNote && (
            <p className="item-block-body">
              <strong>Shelf life:</strong> {content.expiryNote}
            </p>
          )}
        </section>
      )}

      <section className="item-block">
        <h2 className="item-block-head">Where to buy</h2>
        <a className="btn btn-primary" href={item.purchaseUrl} target="_blank" rel="noopener noreferrer">
          Find on Amazon ↗
        </a>
        <p className="text-caption text-secondary item-block-note">
          Opens an Amazon search for this item. Price is an estimate — the live price is on
          Amazon.
        </p>
      </section>

      <section className="item-block">
        <h2 className="item-block-head">How to use it</h2>
        <p className="text-caption text-secondary item-block-note">
          A vetted how-to video will live here. We link technique out to trusted sources rather than
          writing medical instructions ourselves.
        </p>
      </section>
    </main>
  )
}
