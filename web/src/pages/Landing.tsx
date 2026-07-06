import { Link } from 'react-router-dom'
import heroImg from '../assets/hero.jpg'

export default function Landing() {
  return (
    <div className="split">
      <aside className="rail landing-action">
        <div>
          <div className="landing-brand">PHEW!</div>
          <p className="landing-tag" style={{ marginTop: 'var(--space-3)' }}>
            Most first-aid kits are generic averages. When things happen, you’re going to want
            something better.
          </p>
        </div>

        <div>
          <Link className="btn btn-primary btn-lg" to="/build">
            Build yours
          </Link>
        </div>

        <div style={{ marginTop: 'var(--space-10)' }}>
          <p className="wiz-disclaimer" style={{ textAlign: 'left' }}>
            Phew builds a shopping list for you to review, adjust, and own. It isn’t medical advice,
            and it’s no substitute for first-aid training. In an emergency, call 911.
          </p>
        </div>
      </aside>

      <main className="hero">
        <img
          className="hero-img"
          src={heroImg}
          alt="A raft and an inflatable kayak on a river winding through a steep mountain canyon"
        />
      </main>
    </div>
  )
}
