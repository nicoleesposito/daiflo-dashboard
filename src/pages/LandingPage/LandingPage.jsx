import { useState } from 'react'
import productivityImg from '../../assets/images/Productivity.jpg'
import './LandingPage.css'

// ─── Data ──────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: '🌤',
    title: 'Weather',
    description: 'Real-time forecasts for your location, always at a glance.',
    accent: '#ffe342',
  },
  {
    icon: '✅',
    title: 'Tasks',
    description: 'A clean to-do list to keep your day on track.',
    accent: '#88e036',
  },
  {
    icon: '📝',
    title: 'Notes',
    description: 'Capture ideas and thoughts instantly with a built-in notepad.',
    accent: '#88e036',
  },
  {
    icon: '📰',
    title: 'News',
    description: 'Curated headlines from your favourite RSS feeds in one place.',
    accent: '#ffe342',
  },
]

const FAQS = [
  {
    question: 'What is Daiflo?',
    answer:
      'Daiflo is a personal dashboard that brings your daily essentials — weather, tasks, notes, and news — into one clean, customisable interface.',
  },
  {
    question: 'Is Daiflo free to use?',
    answer: 'Yes, Daiflo is completely free.',
  },
  {
    question: 'Can I customise my dashboard?',
    answer:
      'Absolutely. You can choose which widgets to display and adjust your preferences to suit your workflow.',
  },
  {
    question: 'Does Daiflo work on mobile?',
    answer:
      'Yes — Daiflo is fully responsive and works great on any screen size.',
  },
]

// ─── Sub-components ─────────────────────────────────────────────────────────

const SUN_RAYS = Array.from({ length: 8 }, (_, i) => {
  const rad = ((i * 45) * Math.PI) / 180
  return {
    x1: +(40 + 22 * Math.cos(rad)).toFixed(2),
    y1: +(40 + 22 * Math.sin(rad)).toFixed(2),
    x2: +(40 + 30 * Math.cos(rad)).toFixed(2),
    y2: +(40 + 30 * Math.sin(rad)).toFixed(2),
  }
})

function SunIcon() {
  return (
    <svg
      className="hero__sun"
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Daiflo sun logo placeholder"
      role="img"
    >
      {SUN_RAYS.map(({ x1, y1, x2, y2 }, i) => (
        <line
          key={i}
          x1={x1} y1={y1}
          x2={x2} y2={y2}
          stroke="#ffe342"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
      <circle cx="40" cy="40" r="16" fill="#ffe342" />
    </svg>
  )
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`faq-item${open ? ' faq-item--open' : ''}`}>
      <button
        className="faq-item__question"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <span className="faq-item__chevron" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>
      <div className="faq-item__body" aria-hidden={!open}>
        <p>{answer}</p>
      </div>
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────

function LandingPage({ onEnter }) {
  return (
    <div className="landing">

      <main>

        {/* ── Hero ── */}
        <section className="hero" aria-labelledby="hero-heading">
          <SunIcon />
          <h1 id="hero-heading" className="hero__heading">Daiflo</h1>
          <p className="hero__tagline">Your Daily Flow, Simplified</p>
          <button className="hero__cta" onClick={onEnter}>
            Get Started
          </button>
        </section>

        {/* ── About ── */}
        <section className="about" aria-labelledby="about-heading">
          <div className="about__content">
            <span className="about__label">About Daiflo</span>
            <h2 id="about-heading" className="about__heading">
              Built for the way you start your day
            </h2>
            <p className="about__body">
              Daiflo is a personal dashboard designed to cut through the noise.
              Instead of jumping between apps and tabs every morning, everything
              you rely on lives in one clean, distraction-free space — your
              weather, your tasks, your notes, and your news, all in one flow.
            </p>
          </div>
          <div className="about__image">
            <img src={productivityImg} alt="Daiflo dashboard preview" className="about__img" />
          </div>
        </section>

        {/* ── Features ── */}
        <section className="features" aria-labelledby="features-heading">
          <h2 id="features-heading" className="features__heading">
            Everything you need, in one place
          </h2>
          <div className="features__list">
            {FEATURES.map(({ icon, title, description, accent }) => (
              <div key={title} className="feature-row">
                <div
                  className="feature-row__icon-wrap"
                  style={{ background: accent + '30' }}
                >
                  <span className="feature-row__icon" aria-hidden="true">
                    {icon}
                  </span>
                </div>
                <div className="feature-row__content">
                  <h3 className="feature-row__title">{title}</h3>
                  <p className="feature-row__description">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="faq" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="faq__heading">
            Frequently asked questions
          </h2>
          <div className="faq__list">
            {FAQS.map(({ question, answer }) => (
              <FAQItem key={question} question={question} answer={answer} />
            ))}
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <p className="footer__brand">
          Dai<span className="footer__brand-accent">flo</span>
        </p>
        <p className="footer__copy">© {new Date().getFullYear()} Daiflo. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default LandingPage
