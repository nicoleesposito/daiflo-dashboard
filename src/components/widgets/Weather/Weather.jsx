import { useState, useEffect } from 'react'
import { fetchWeatherByZip } from '../../../services/weatherApi'
import { useStoredData } from '../../../hooks/useStoredData'
import './Weather.css'

function toC(f) { return Math.round((f - 32) * 5 / 9) }

function Weather() {
  const [zip,  persistZip]  = useStoredData('daiflo_zip',       'zip',      '')
  const [unit, persistUnit] = useStoredData('daiflo_temp_unit', 'tempUnit', 'F')

  const [input,   setInput]   = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  function toggleUnit() {
    persistUnit(unit === 'F' ? 'C' : 'F')
  }

  useEffect(() => {
    if (!zip) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchWeatherByZip(zip)
        if (!cancelled) setWeather(data)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load weather.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [zip])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    persistZip(trimmed)
    setInput('')
  }

  if (!zip) {
    return (
      <div className="weather weather--setup">
        <p className="weather__prompt">Where are you?</p>
        <form className="weather__form" onSubmit={handleSubmit}>
          <input
            className="weather__input"
            type="text"
            placeholder="Enter zip code"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={10}
            autoFocus
          />
          <button className="weather__submit" type="submit">Go</button>
        </form>
      </div>
    )
  }

  if (loading) return <div className="weather weather--state">Loading...</div>

  if (error) {
    return (
      <div className="weather weather--state weather--error">
        <p>{error}</p>
      </div>
    )
  }

  if (!weather) return null

  const { name, main, weather: conditions } = weather
  const { icon, description } = conditions[0]
  const displayTemp = unit === 'F' ? Math.round(main.temp) : toC(main.temp)

  return (
    <div className="weather">
      <p className="weather__city">{name}</p>
      <div className="weather__main">
        <img
          className="weather__icon"
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={description}
        />
        <p className="weather__temp">{displayTemp}°{unit}</p>
      </div>
      <p className="weather__desc">{description}</p>
      <div className="weather__unit-toggle">
        <button
          className={`weather__unit-btn${unit === 'F' ? ' weather__unit-btn--active' : ''}`}
          onClick={toggleUnit}
          aria-pressed={unit === 'F'}
        >
          °F
        </button>
        <span className="weather__unit-sep">|</span>
        <button
          className={`weather__unit-btn${unit === 'C' ? ' weather__unit-btn--active' : ''}`}
          onClick={toggleUnit}
          aria-pressed={unit === 'C'}
        >
          °C
        </button>
      </div>
    </div>
  )
}

export default Weather
