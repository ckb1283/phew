import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="split">
      <aside className="rail landing-action">
        <div>
          <div className="landing-brand">PHEW</div>
          <p className="landing-tag" style={{ marginTop: 'var(--space-3)' }}>
            Store-bought first-aid kits are built for nobody in particular.
          </p>
        </div>

        <div>
          <Link className="btn btn-primary btn-lg" to="/build">
            Build yours
          </Link>
        </div>

        <div style={{ marginTop: 'var(--space-10)' }}>
          <p className="text-caption">Free · no account</p>
          <p className="wiz-disclaimer" style={{ textAlign: 'left', marginTop: 'var(--space-2)' }}>
            Phew builds a checklist for you to review, adjust, and own. It isn't medical advice,
            and it's no substitute for first-aid training. In an emergency, call 911.
          </p>
        </div>
      </aside>

      <main className="hero">
        <svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="1200" height="900" fill="#EAF6F3" />
          <g fill="none" stroke="#9AD5C8" strokeWidth="2">
            <path d="M-60,140 C220,60 420,220 640,170 S1020,50 1260,130" />
            <path d="M-60,220 C230,140 440,300 660,250 S1030,130 1260,210" />
            <path d="M-60,300 C240,220 460,380 680,330 S1040,210 1260,290" />
            <path d="M-60,380 C250,300 480,460 700,410 S1050,290 1260,370" />
            <path d="M-60,460 C250,540 480,400 700,460 S1050,570 1260,480" />
            <path d="M-60,540 C240,620 460,480 680,540 S1040,650 1260,560" />
            <path d="M-60,620 C230,700 440,560 660,620 S1030,730 1260,640" />
            <path d="M-60,700 C220,780 420,640 640,700 S1020,810 1260,720" />
            <path d="M-60,780 C210,860 400,720 620,780 S1010,890 1260,800" />
          </g>
          <g fill="none" stroke="#5FBAA7" strokeWidth="2" opacity="0.55">
            <path d="M-60,180 C225,100 430,260 650,210 S1025,90 1260,170" />
            <path d="M-60,580 C235,660 450,520 670,580 S1035,690 1260,600" />
          </g>
          {/* trail marker: circled cross, first-aid meets signage.
              Fill is Fog paper — the mock predated the re-skin (was #FAF9F7). */}
          <g transform="translate(870,270)">
            <circle r="64" fill="#F4F6F5" stroke="#15866F" strokeWidth="3" />
            <path d="M-14,-38 h28 v24 h24 v28 h-24 v24 h-28 v-24 h-24 v-28 h24 z" fill="#E8602C" />
          </g>
        </svg>
      </main>
    </div>
  )
}
