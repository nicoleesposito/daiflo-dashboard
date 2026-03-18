const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

export async function fetchWeatherByZip(zip) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${API_KEY}&units=imperial`
  )
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `HTTP ${res.status}`)
  }
  return res.json()
}
