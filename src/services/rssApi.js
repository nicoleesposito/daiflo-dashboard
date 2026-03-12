export async function fetchRssFeed(feedUrl) {
  const encoded = encodeURIComponent(feedUrl)
  const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encoded}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (data.status !== 'ok') throw new Error(data.message || 'Feed error')
  return data.items
}
