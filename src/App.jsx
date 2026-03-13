import { useState, useEffect } from 'react'
import { PreferencesProvider } from './context/PreferencesContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import LandingPage from './pages/LandingPage/LandingPage'
import Dashboard from './components/layout/Dashboard'
import Settings from './pages/Settings/Settings'
import AuthModal from './pages/Auth/AuthModal'

function AppContent() {
  const [view, setView]         = useState('landing')
  const [authOpen, setAuthOpen] = useState(false)
  const { user, loading, continueAsGuest } = useAuth()

  // Auto-route already authenticated users to the dashboard
  useEffect(() => {
    if (!loading && user) {
      setView('dashboard')
    }
  }, [user, loading])

  function handleOpenDashboard() {
    if (user) {
      setView('dashboard')
    } else {
      setAuthOpen(true)
    }
  }

  function handleAuthSuccess() {
    setAuthOpen(false)
    setView('dashboard')
  }

  function handleGuest() {
    continueAsGuest()
    setAuthOpen(false)
    setView('dashboard')
  }

  function handleLogoClick() {
    setView('landing')
  }

  if (loading) return null

  return (
    <PreferencesProvider>
      <Navbar
        view={view}
        onLogoClick={handleLogoClick}
        onEnter={handleOpenDashboard}
        onSettings={() => setView('settings')}
        onDashboard={() => setView('dashboard')}
      />
      {view === 'landing'   && <LandingPage onEnter={handleOpenDashboard} />}
      {view === 'dashboard' && <Dashboard />}
      {view === 'settings'  && <Settings onLogout={() => setView('landing')} />}
      {authOpen && <AuthModal onSuccess={handleAuthSuccess} onGuest={handleGuest} />}
    </PreferencesProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
