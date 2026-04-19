import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Check if there's already a session (hash already processed by Supabase client)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true)
        return
      }
    })

    // Also listen for the event in case it hasn't fired yet
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setReady(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/'), 2000)
    }
  }

  if (!ready) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#D63830"/>
              <rect x="7" y="8" width="18" height="2" rx="1" fill="#F5F0EA"/>
              <rect x="7" y="13" width="14" height="2" rx="1" fill="#F5F0EA"/>
              <rect x="7" y="18" width="16" height="2" rx="1" fill="#F5F0EA"/>
              <rect x="7" y="23" width="10" height="2" rx="1" fill="#F5F0EA"/>
            </svg>
            <h1 className="auth-app-name">Brag Book</h1>
            <p className="auth-subtitle">Verificando link...</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
            <div className="loading-spinner" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#D63830"/>
            <rect x="7" y="8" width="18" height="2" rx="1" fill="#F5F0EA"/>
            <rect x="7" y="13" width="14" height="2" rx="1" fill="#F5F0EA"/>
            <rect x="7" y="18" width="16" height="2" rx="1" fill="#F5F0EA"/>
            <rect x="7" y="23" width="10" height="2" rx="1" fill="#F5F0EA"/>
          </svg>
          <h1 className="auth-app-name">Brag Book</h1>
          <p className="auth-subtitle">Crie sua nova senha</p>
        </div>

        {success ? (
          <div className="auth-success">
            Senha alterada com sucesso! Redirecionando...
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            <div className="form-group">
              <label>Nova senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                autoFocus
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label>Confirmar senha</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repita a senha"
                required
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
