import { useState } from 'react'
import { PreferencesProvider } from './context/PreferencesContext'
import Navbar from './components/layout/Navbar'
import LandingPage from './pages/LandingPage/LandingPage'
import Dashboard from './components/layout/Dashboard'

function App() {
  const [view, setView] = useState('landing')

  return (
    <PreferencesProvider>
      <Navbar
        view={view}
        onLogoClick={() => setView('landing')}
        onEnter={() => setView('dashboard')}
      />
      {view === 'landing' ? (
        <LandingPage onEnter={() => setView('dashboard')} />
      ) : (
        <Dashboard onHome={() => setView('landing')} />
      )}
    </PreferencesProvider>
  )
}

export default App
