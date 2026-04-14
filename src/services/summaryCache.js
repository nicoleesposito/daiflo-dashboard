import { getUserProfile, updateUserProfile } from './userService'

const LOCAL_KEY = 'daiflo_summary_cache'
const TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

/** Deterministic djb2 hash of a string, returned as a base-36 string. */
function hashContent(str) {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i)
  }
  return 'v2_' + (hash >>> 0).toString(36)
}

/**
 * Returns a cached summary+topic entry for the given note body, or null if
 * no valid (non-expired) entry exists.
 * @param {object|null} user  Firebase user object (or null for guests)
 * @param {string} noteBody
 * @returns {Promise<{summary: string, topic: object|null}|null>}
 */
export async function getCachedSummary(user, noteBody) {
  const key = hashContent(noteBody)

  if (user) {
    const profile = await getUserProfile(user.uid)
    const entry = (profile.summaryCache ?? {})[key]
    if (entry && Date.now() - entry.cachedAt < TTL_MS) return entry
  } else {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (raw) {
      const entry = JSON.parse(raw)[key]
      if (entry && Date.now() - entry.cachedAt < TTL_MS) return entry
    }
  }

  return null
}

/**
 * Writes a summary+topic result to the cache.
 * @param {object|null} user
 * @param {string} noteBody
 * @param {string} summary
 * @param {object|null} topic  Wikipedia result or null
 */
export async function setCachedSummary(user, noteBody, summary, topic) {
  const key = hashContent(noteBody)
  const entry = { summary, topic, cachedAt: Date.now() }

  if (user) {
    const profile = await getUserProfile(user.uid)
    const cache = { ...(profile.summaryCache ?? {}), [key]: entry }
    await updateUserProfile(user.uid, { summaryCache: cache })
  } else {
    const raw = localStorage.getItem(LOCAL_KEY)
    const cache = raw ? JSON.parse(raw) : {}
    cache[key] = entry
    localStorage.setItem(LOCAL_KEY, JSON.stringify(cache))
  }
}
