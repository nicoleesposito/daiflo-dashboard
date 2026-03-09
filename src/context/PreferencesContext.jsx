import { createContext, useContext, useState } from 'react'

const PreferencesContext = createContext(null)

export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState({
    theme: 'light',
  })

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  return useContext(PreferencesContext)
}
