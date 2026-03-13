import { useState } from 'react'
import { PreferencesProvider } from './context/PreferencesContext'
import Navbar from './components/layout/Navbar'
import LandingPage from './pages/LandingPage/LandingPage'
import Dashboard from './components/layout/Dashboard'
import Settings from './pages/Settings/Settings'

function App() {
  const [view, setView] = useState('landing')

  return (
    <PreferencesProvider>
      <Navbar
        view={view}
        onLogoClick={() => setView('landing')}
        onEnter={() => setView('dashboard')}
        onSettings={() => setView('settings')}
        onDashboard={() => setView('dashboard')}
      />
      {view === 'landing'  && <LandingPage onEnter={() => setView('dashboard')} />}
      {view === 'dashboard' && <Dashboard />}
      {view === 'settings'  && <Settings />}
    </PreferencesProvider>
  )
}

export default App
