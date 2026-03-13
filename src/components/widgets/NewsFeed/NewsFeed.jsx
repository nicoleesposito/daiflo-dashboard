import { useState, useEffect, useRef } from 'react'
import { fetchRssFeed } from '../../../services/rssApi'
import { useStoredData } from '../../../hooks/useStoredData'
import './NewsFeed.css'

const CATEGORIES = [
  { id: 'technology', label: 'Technology', feed: 'http://feeds.bbci.co.uk/news/technology/rss.xml' },
  { id: 'world',      label: 'World',       feed: 'http://feeds.bbci.co.uk/news/world/rss.xml' },
  { id: 'business',  label: 'Business',    feed: 'http://feeds.bbci.co.uk/news/business/rss.xml' },
  { id: 'science',   label: 'Science',     feed: 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml' },
]

function stripHtml(html) {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

function NewsFeed() {
  const [categoryId, persistCategory] = useStoredData('daiflo_news_category', 'newsCategory', 'technology')

  const [items,     setItems]     = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)
  const [popupOpen, setPopupOpen] = useState(false)

  const popupRef = useRef(null)
  const category = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0]

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchRssFeed(category.feed)
        if (!cancelled) setItems(data)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load feed.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [categoryId])

  useEffect(() => {
    if (!popupOpen) return
    function handleClick(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setPopupOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [popupOpen])

  function selectCategory(id) {
    persistCategory(id)
    setPopupOpen(false)
  }

  return (
    <div className="news">

      <div className="news__header">
        <div className="news__category-wrap" ref={popupRef}>
          <button
            className="news__category-btn"
            onClick={() => setPopupOpen((prev) => !prev)}
            aria-expanded={popupOpen}
            aria-haspopup="listbox"
          >
            <span>{category.label}</span>
            <span className={`news__chevron${popupOpen ? ' news__chevron--open' : ''}`}>▾</span>
          </button>

          {popupOpen && (
            <ul className="news__popup" role="listbox">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <button
                    className={`news__popup-option${c.id === categoryId ? ' news__popup-option--active' : ''}`}
                    onClick={() => selectCategory(c.id)}
                    role="option"
                    aria-selected={c.id === categoryId}
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {loading && <p className="news__state">Loading...</p>}
      {error   && <p className="news__state news__state--error">{error}</p>}

      {!loading && !error && (
        <ul className="news__list" role="list">
          {items.map((item, i) => (
            <li key={i} className="news-item">
              <div className="news-item__thumb">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="news-item__img"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div
                  className="news-item__img-fallback"
                  style={{ display: item.thumbnail ? 'none' : 'flex' }}
                />
              </div>
              <div className="news-item__content">
                <a
                  className="news-item__title"
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.title}
                </a>
                {item.description && (
                  <p className="news-item__summary">{stripHtml(item.description)}</p>
                )}
                <time className="news-item__date">
                  {new Date(item.pubDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}

    </div>
  )
}

export default NewsFeed
