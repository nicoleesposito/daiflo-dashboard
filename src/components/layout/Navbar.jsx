import './Navbar.css'

function Navbar({ view, onLogoClick, onEnter }) {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <button className="navbar__brand" onClick={onLogoClick} aria-label="Go to home">
        Dai<span className="navbar__brand-accent">flo</span>
      </button>
      {view === 'landing' && (
        <button className="navbar__cta" onClick={onEnter}>
          Open Dashboard
        </button>
      )}
    </nav>
  )
}

export default Navbar
