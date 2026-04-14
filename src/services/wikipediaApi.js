async function fetchSummaryByTitle(title) {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    { headers: { Accept: 'application/json' } }
  )
  if (!res.ok) return null
  const data = await res.json()
  if (data.type === 'disambiguation' || !data.extract) return null
  return {
    title: data.title,
    extract: data.extract,
    url: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
  }
}

async function searchWikipedia(topic) {
  const res = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&origin=*`
  )
  if (!res.ok) return null
  const data = await res.json()
  return data?.query?.search?.[0]?.title ?? null
}

/**
 * Fetches a short Wikipedia summary for a given topic.
 * Falls back to a search query if the direct title lookup returns 404.
 * Returns null if no clear article is found or if it's a disambiguation page.
 * @returns {Promise<{title: string, extract: string, url: string}|null>}
 */
export async function fetchWikipediaSummary(topic) {
  try {
    const direct = await fetchSummaryByTitle(topic)
    if (direct) return direct

    // Direct lookup failed — search for the closest article title
    const searchTitle = await searchWikipedia(topic)
    if (!searchTitle) return null

    return await fetchSummaryByTitle(searchTitle)
  } catch {
    return null
  }
}
