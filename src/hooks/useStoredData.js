import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserProfile, updateUserProfile } from '../services/userService'

/**
 * Unified storage hook — Firestore for authenticated users, localStorage for guests.
 *
 * @param {string} localKey       - localStorage key  (e.g. 'daiflo_todos')
 * @param {string} firestoreField - top-level field in the user's Firestore doc (e.g. 'todos')
 * @param {*}      defaultValue   - value used before data loads or if nothing is stored
 * @param {fn}     parse          - optional: converts localStorage string → value (use JSON.parse for objects)
 * @param {fn}     serialize      - optional: converts value → localStorage string (use JSON.stringify for objects)
 */
export function useStoredData(localKey, firestoreField, defaultValue, parse, serialize) {
  const { user } = useAuth()
  const [value, setValue] = useState(defaultValue)

  // Load whenever the logged-in user changes (login / logout)
  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then((profile) => {
        const stored = profile[firestoreField]
        if (stored !== undefined) setValue(stored)
      })
    } else {
      const raw = localStorage.getItem(localKey)
      if (raw !== null) setValue(parse ? parse(raw) : raw)
    }
  }, [user?.uid]) // eslint-disable-line react-hooks/exhaustive-deps

  async function persist(newValue) {
    setValue(newValue)
    if (user) {
      await updateUserProfile(user.uid, { [firestoreField]: newValue })
    } else {
      localStorage.setItem(localKey, serialize ? serialize(newValue) : newValue)
    }
  }

  return [value, persist]
}
