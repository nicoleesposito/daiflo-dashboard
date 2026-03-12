import { useState, useEffect } from 'react'
import './Notepad.css'

const STORAGE_KEY = 'daiflo_notes'

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

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

function Notepad() {
  const [notes, setNotes] = useState(loadNotes)
  const [activeId, setActiveId] = useState(() => loadNotes()[0]?.id || null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const activeNote = notes.find((n) => n.id === activeId) || null

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }, [notes])

  function createNote() {
    const note = { id: Date.now(), title: '', body: '', updatedAt: Date.now() }
    setNotes((prev) => [note, ...prev])
    setActiveId(note.id)
  }

  function deleteNote() {
    const remaining = notes.filter((n) => n.id !== activeId)
    setNotes(remaining)
    setActiveId(remaining[0]?.id || null)
  }

  function updateNote(changes) {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeId ? { ...n, ...changes, updatedAt: Date.now() } : n
      )
    )
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
            <button className="notepad__new-btn" onClick={createNote}>
              + New
            </button>
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
