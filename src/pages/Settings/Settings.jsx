import { useState } from 'react'
import { usePreferences } from '../../context/PreferencesContext'
import './Settings.css'

const INITIAL_ACCOUNT = { firstName: '', lastName: '', email: '' }

function AccountSection() {
  const [editMode, setEditMode]   = useState(false)
  const [form, setForm]           = useState(INITIAL_ACCOUNT)
  const [draft, setDraft]         = useState(INITIAL_ACCOUNT)
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' })
  const [passwordError, setPasswordError] = useState('')

  function handleEdit() {
    setDraft({ ...form })
    setPasswords({ newPassword: '', confirmPassword: '' })
    setPasswordError('')
    setEditMode(true)
  }

  function handleCancel() {
    setEditMode(false)
    setPasswordError('')
  }

  function handleSave() {
    if (passwords.newPassword || passwords.confirmPassword) {
      if (passwords.newPassword !== passwords.confirmPassword) {
        setPasswordError('Passwords do not match.')
        return
      }
      if (passwords.newPassword.length < 8) {
        setPasswordError('Password must be at least 8 characters.')
        return
      }
    }
    // TODO: persist to backend
    setForm({ ...draft })
    setEditMode(false)
    setPasswordError('')
  }

  function handleDraft(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  function handlePassword(field, value) {
    setPasswords((prev) => ({ ...prev, [field]: value }))
    setPasswordError('')
  }

  return (
    <section className="settings__section" aria-labelledby="account-heading">
      <div className="settings__section-header">
        <div>
          <h2 id="account-heading" className="settings__section-title">Account</h2>
          <p className="settings__section-desc">Manage your account information.</p>
        </div>
        {!editMode && (
          <button className="settings__edit-btn" onClick={handleEdit}>Edit</button>
        )}
      </div>

      <div className="settings__section-body">
        <div className="settings__fields">
          <div className="settings__field">
            <span className="settings__field-label">First name</span>
            <input className="settings__field-input" value={editMode ? draft.firstName : form.firstName} onChange={(e) => handleDraft('firstName', e.target.value)} placeholder="First name" disabled={!editMode} />
          </div>

          <div className="settings__field">
            <span className="settings__field-label">Last name</span>
            <input className="settings__field-input" value={editMode ? draft.lastName : form.lastName} onChange={(e) => handleDraft('lastName', e.target.value)} placeholder="Last name" disabled={!editMode} />
          </div>

          <div className="settings__field">
            <span className="settings__field-label">Email</span>
            <input className="settings__field-input" type="email" value={editMode ? draft.email : form.email} onChange={(e) => handleDraft('email', e.target.value)} placeholder="Email address" disabled={!editMode} />
          </div>

          <div className="settings__field">
            <span className="settings__field-label">Password</span>
            <input className="settings__field-input" type="password" value={editMode ? passwords.newPassword : 'placeholder'} onChange={(e) => handlePassword('newPassword', e.target.value)} placeholder="New password" disabled={!editMode} />
          </div>

          {editMode && (
            <div className="settings__field">
              <span className="settings__field-label">Confirm password</span>
              <input
                className={`settings__field-input${passwordError ? ' settings__field-input--error' : ''}`}
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => handlePassword('confirmPassword', e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          )}
        </div>

        {editMode && (
          <div className="settings__actions">
            {passwordError && <p className="settings__error">{passwordError}</p>}
            <div className="settings__action-btns">
              <button className="settings__cancel-btn" onClick={handleCancel}>Cancel</button>
              <button className="settings__save-btn" onClick={handleSave}>Save changes</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function PreferencesSection() {
  const { darkMode, toggleDarkMode } = usePreferences()
  const [zipInput, setZipInput] = useState(() => localStorage.getItem('daiflo_zip') || '')

  function handleZipSave(e) {
    e.preventDefault()
    const trimmed = zipInput.trim()
    if (!trimmed) return
    localStorage.setItem('daiflo_zip', trimmed)
  }

  return (
    <section className="settings__section" aria-labelledby="preferences-heading">
      <div className="settings__section-header">
        <div>
          <h2 id="preferences-heading" className="settings__section-title">General Preferences</h2>
          <p className="settings__section-desc">Customise how Daiflo looks and behaves.</p>
        </div>
      </div>

      <div className="settings__section-body">
        <div className="settings__fields">

          <div className="settings__field">
            <span className="settings__field-label">Dark mode</span>
            <label className="settings__toggle">
              <input
                type="checkbox"
                className="settings__toggle-input"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <span className="settings__toggle-track" />
            </label>
          </div>

          <div className="settings__field">
            <span className="settings__field-label">Zip code</span>
            <form className="settings__zip-form" onSubmit={handleZipSave}>
              <input
                className="settings__field-input"
                value={zipInput}
                onChange={(e) => setZipInput(e.target.value)}
                placeholder="Enter zip code"
                maxLength={10}
              />
              <button className="settings__save-btn" type="submit">Update</button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}

function Settings() {
  return (
    <div className="settings">
      <h1 className="settings__page-title">Settings</h1>
      <div className="settings__sections">
        <AccountSection />
        <PreferencesSection />
      </div>
    </div>
  )
}

export default Settings
