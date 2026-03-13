import { useState, useEffect } from 'react'
import { updateEmail, updatePassword } from 'firebase/auth'
import { useAuth } from '../../context/AuthContext'
import { usePreferences } from '../../context/PreferencesContext'
import { getUserProfile, updateUserProfile } from '../../services/userService'
import { useStoredData } from '../../hooks/useStoredData'
import './Settings.css'

function AccountSection() {
  const { user, isGuest } = useAuth()

  const [editMode, setEditMode]   = useState(false)
  const [form, setForm]           = useState({ firstName: '', lastName: '', email: '' })
  const [draft, setDraft]         = useState({ firstName: '', lastName: '', email: '' })
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' })
  const [passwordError, setPasswordError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving]       = useState(false)

  useEffect(() => {
    if (!user) return
    async function loadProfile() {
      const profile = await getUserProfile(user.uid)
      const data = {
        firstName: profile.firstName || '',
        lastName:  profile.lastName  || '',
        email:     user.email        || '',
      }
      setForm(data)
    }
    loadProfile()
  }, [user])

  function handleEdit() {
    setDraft({ ...form })
    setPasswords({ newPassword: '', confirmPassword: '' })
    setPasswordError('')
    setSaveError('')
    setEditMode(true)
  }

  function handleCancel() {
    setEditMode(false)
    setPasswordError('')
    setSaveError('')
  }

  async function handleSave() {
    if (passwords.newPassword || passwords.confirmPassword) {
      if (passwords.newPassword !== passwords.confirmPassword) {
        setPasswordError('Passwords do not match.')
        return
      }
      if (passwords.newPassword.length < 6) {
        setPasswordError('Password must be at least 6 characters.')
        return
      }
    }

    setSaving(true)
    setSaveError('')

    try {
      await updateUserProfile(user.uid, {
        firstName: draft.firstName,
        lastName:  draft.lastName,
      })

      if (draft.email !== form.email) {
        await updateEmail(user, draft.email)
      }

      if (passwords.newPassword) {
        await updatePassword(user, passwords.newPassword)
      }

      setForm({ ...draft })
      setEditMode(false)
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        setSaveError('Please sign out and sign back in before making this change.')
      } else if (err.code === 'auth/email-already-in-use') {
        setSaveError('This email is already in use.')
      } else {
        setSaveError('Failed to save changes. Please try again.')
      }
    } finally {
      setSaving(false)
    }
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
        {!editMode && !isGuest && (
          <button className="settings__edit-btn" onClick={handleEdit}>Edit</button>
        )}
      </div>

      <div className="settings__section-body">
        {isGuest ? (
          <p className="settings__guest-note">Sign in to manage your account details.</p>
        ) : (
          <>
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
                {(passwordError || saveError) && (
                  <p className="settings__error">{passwordError || saveError}</p>
                )}
                <div className="settings__action-btns">
                  <button className="settings__cancel-btn" onClick={handleCancel} disabled={saving}>Cancel</button>
                  <button className="settings__save-btn" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

function PreferencesSection() {
  const { darkMode, toggleDarkMode } = usePreferences()
  const [zip, persistZip] = useStoredData('daiflo_zip', 'zip', '')
  const [zipInput, setZipInput] = useState('')

  // Keep the input in sync when the stored zip loads
  useEffect(() => { setZipInput(zip) }, [zip])

  function handleZipSave(e) {
    e.preventDefault()
    const trimmed = zipInput.trim()
    if (!trimmed) return
    persistZip(trimmed)
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

function Settings({ onLogout }) {
  const { logout } = useAuth()

  async function handleLogout() {
    await logout()
    onLogout()
  }

  return (
    <div className="settings">
      <h1 className="settings__page-title">Settings</h1>
      <div className="settings__sections">
        <AccountSection />
        <PreferencesSection />
      </div>
      <div className="settings__footer">
        <button className="settings__logout-btn" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </div>
  )
}

export default Settings
