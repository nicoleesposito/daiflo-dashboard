import { useState, useRef, useEffect } from 'react'
import { useStoredData } from '../../../hooks/useStoredData'
import { useAuth } from '../../../context/AuthContext'
import { streamSummary, extractTopic } from '../../../services/aiApi'
import { fetchWikipediaSummary } from '../../../services/wikipediaApi'
import { getCachedSummary, setCachedSummary } from '../../../services/summaryCache'
import './Notepad.css'

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.8 5.4L19 10.5l-5.2 3 1.8 5.5L12 16l-3.6 3-1.4-5.5L2 10.5l5.2-1.1z" />
      <path d="M5 3l.6 1.8L7.5 5.5 5.6 6.5 6.2 8.3 5 7.2 3.8 8.3 4.4 6.5 2.5 5.5 4.4 4.8z" />
      <path d="M19 15l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z" />
    </svg>
  )
}

function Notepad() {
  const { user } = useAuth()
  const [notes, persistNotes] = useStoredData(
    'daiflo_notes', 'notes', [], JSON.parse, JSON.stringify
  )
  const [activeId,     setActiveId]     = useState(() => notes[0]?.id || null)
  const [sidebarOpen,  setSidebarOpen]  = useState(true)

  // AI summary state
  const [summary,       setSummary]       = useState('')
  const [topic,         setTopic]         = useState(null)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [summaryError,  setSummaryError]  = useState(null)
  const [showSummary,   setShowSummary]   = useState(false)
  const abortRef = useRef(false)

  const activeNote = notes.find((n) => n.id === activeId) || null

  // Reset summary panel when switching notes
  useEffect(() => {
    abortRef.current = true
    setSummary('')
    setTopic(null)
    setSummaryError(null)
    setIsSummarizing(false)
    setShowSummary(false)

    const body = activeNote?.body?.trim()
    if (!body) return

    getCachedSummary(user, body).then((cached) => {
      if (cached?.summary) {
        setSummary(cached.summary)
        setTopic(cached.topic)
        setShowSummary(true)
      }
    }).catch(() => {})
  }, [activeId]) // eslint-disable-line react-hooks/exhaustive-deps

  function createNote() {
    const note = { id: Date.now(), title: '', body: '', updatedAt: Date.now() }
    persistNotes([note, ...notes])
    setActiveId(note.id)
  }

  function deleteNote() {
    const remaining = notes.filter((n) => n.id !== activeId)
    persistNotes(remaining)
    setActiveId(remaining[0]?.id || null)
  }

  function updateNote(changes) {
    persistNotes(
      notes.map((n) => (n.id === activeId ? { ...n, ...changes, updatedAt: Date.now() } : n))
    )
  }

  async function handleSummarize() {
    if (!activeNote?.body.trim()) {
      setSummaryError('Write something first.')
      setShowSummary(true)
      return
    }

    abortRef.current = false
    setIsSummarizing(true)
    setSummary('')
    setTopic(null)
    setSummaryError(null)
    setShowSummary(true)

    // Check cache first
    try {
      const cached = await getCachedSummary(user, activeNote.body)
      if (cached) {
        if (abortRef.current) return
        setSummary(cached.summary)
        setTopic(cached.topic)
        setIsSummarizing(false)
        return
      }
    } catch {
      // Cache read failure is non-fatal — proceed to generate
    }

    // Stream summary from Gemini
    let fullSummary = ''
    try {
      for await (const chunk of streamSummary(activeNote.title, activeNote.body)) {
        if (abortRef.current) return
        fullSummary += chunk
        setSummary(fullSummary)
      }
    } catch (err) {
      // If we received no content at all, surface the error and stop
      if (!fullSummary) {
        if (!abortRef.current) {
          setSummaryError(err?.message ?? 'Failed to generate summary.')
          setIsSummarizing(false)
        }
        return
      }
      // Stream ended with a benign error after content was received — continue to Wikipedia
    }

    if (abortRef.current) return

    // Extract topic and fetch Wikipedia in parallel with a timeout guard
    let wikiResult = null
    try {
      const topicName = await extractTopic(activeNote.title, activeNote.body)
      if (topicName && !abortRef.current) {
        wikiResult = await fetchWikipediaSummary(topicName)
      }
    } catch {
      // Wikipedia failure is silent
    }

    if (abortRef.current) return

    setTopic(wikiResult)
    setIsSummarizing(false)

    // Persist to cache (fire-and-forget)
    setCachedSummary(user, activeNote.body, fullSummary, wikiResult).catch(() => {})
  }

  return (
    <div className="notepad">

      {/* ── Sidebar ── */}
      <aside className={`notepad__sidebar${sidebarOpen ? '' : ' notepad__sidebar--closed'}`}>
        <button
          className="notepad__toggle"
          onClick={() => setSidebarOpen((p) => !p)}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? '‹' : '›'}
        </button>

        {sidebarOpen && (
          <div className="notepad__sidebar-content">
            <button className="notepad__new-btn" onClick={createNote}>+ New</button>
            <ul className="notepad__note-list" role="list">
              {notes.length === 0 && (
                <li className="notepad__note-empty">No notes yet</li>
              )}
              {notes.map((note) => (
                <li key={note.id}>
                  <button
                    className={`notepad__note-item${note.id === activeId ? ' notepad__note-item--active' : ''}`}
                    onClick={() => setActiveId(note.id)}
                  >
                    {note.title || 'Untitled'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* ── Editor ── */}
      <div className="notepad__editor">
        {activeNote ? (
          <>
            <div className="notepad__editor-header">
              <input
                className="notepad__title"
                type="text"
                placeholder="Untitled"
                value={activeNote.title}
                onChange={(e) => updateNote({ title: e.target.value })}
              />
              <button
                className="notepad__summarize-btn"
                onClick={handleSummarize}
                disabled={isSummarizing}
                aria-label="Summarize note"
                title="Summarize with AI"
              >
                <SparkleIcon />
                {isSummarizing ? 'Summarizing…' : 'Summarize'}
              </button>
              <button
                className="notepad__delete-btn"
                onClick={deleteNote}
                aria-label="Delete note"
                title="Delete note"
              >
                <TrashIcon />
              </button>
            </div>
            <hr className="notepad__divider" />
            <textarea
              className="notepad__body"
              placeholder="Start writing..."
              value={activeNote.body}
              onChange={(e) => updateNote({ body: e.target.value })}
            />

            {/* ── Summary Panel ── */}
            {showSummary && (
              <div className="notepad__summary-panel">
                <div className="notepad__summary-header">
                  <span className="notepad__summary-label">AI Summary</span>
                  <button
                    className="notepad__summary-close"
                    onClick={() => setShowSummary(false)}
                    aria-label="Close summary"
                  >
                    ×
                  </button>
                </div>

                {summaryError ? (
                  <p className="notepad__summary-error">{summaryError}</p>
                ) : (
                  <p className="notepad__summary-text">
                    {summary}
                    {isSummarizing && <span className="notepad__summary-cursor" />}
                  </p>
                )}

                {topic && !isSummarizing && (
                  <div className="notepad__wiki-card">
                    <span className="notepad__wiki-label">Wikipedia</span>
                    <a
                      className="notepad__wiki-title"
                      href={topic.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {topic.title}
                    </a>
                    <p className="notepad__wiki-extract">{topic.extract}</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="notepad__no-note">
            <p>No note selected</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default Notepad
