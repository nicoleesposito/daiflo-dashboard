import { createContext, useContext, useState, useEffect } from 'react'

const PreferencesContext = createContext(null)

export function PreferencesProvider({ children }) {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('daiflo_dark_mode') === 'true'
  )

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  function toggleDarkMode() {
    const next = !darkMode
    localStorage.setItem('daiflo_dark_mode', String(next))
    setDarkMode(next)
  }

  return (
    <PreferencesContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  return useContext(PreferencesContext)
}
