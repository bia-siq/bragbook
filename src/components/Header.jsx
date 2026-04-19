import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { exportToMarkdown } from '../utils/exportMarkdown'

export default function Header({ entries, onNewEntry }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture
  const initials = (user?.email || '??').slice(0, 2).toUpperCase()

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-brand">
          <h1 className="wordmark"><span className="wordmark-brag">brag</span> <span className="wordmark-book">book</span></h1>
        </div>

        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => exportToMarkdown(entries)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exportar
          </button>

          <button className="btn btn-primary" onClick={onNewEntry}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nova entrada
          </button>

          <div className="user-menu-wrap">
            <button className="user-avatar-btn" onClick={() => setMenuOpen(v => !v)} title="Menu do usuário">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="user-avatar-img" />
              ) : (
                <span className="user-avatar-initials">{initials}</span>
              )}
            </button>

            {menuOpen && (
              <>
                <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />
                <div className="user-menu">
                  <div className="user-menu-email">{user?.email}</div>
                  <button
                    className="user-menu-item"
                    onClick={() => { navigate('/perfil'); setMenuOpen(false) }}
                  >
                    Meu perfil
                  </button>
                  <button className="user-menu-item user-menu-item-danger" onClick={handleSignOut}>
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
