import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    professional_email: '',
    linkedin_url: '',
    avatar_url: '',
  })

  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          professional_email: data.professional_email || '',
          linkedin_url: data.linkedin_url || '',
          avatar_url: data.avatar_url || '',
        })
        setLoading(false)
      })
  }, [user])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...form, updated_at: new Date().toISOString() })
    setSaving(false)
    if (!error) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  if (loading) return <div className="loading-screen"><div className="loading-spinner" /></div>

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#D63830"/>
              <rect x="7" y="8" width="18" height="2" rx="1" fill="#F5F0EA"/>
              <rect x="7" y="13" width="14" height="2" rx="1" fill="#F5F0EA"/>
              <rect x="7" y="18" width="16" height="2" rx="1" fill="#F5F0EA"/>
              <rect x="7" y="23" width="10" height="2" rx="1" fill="#F5F0EA"/>
            </svg>
            <h1>Brag Book</h1>
          </div>
          <div className="header-actions">
            <button className="btn btn-ghost" onClick={() => navigate('/')}>← Voltar</button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="profile-page">
          <h2 className="profile-title">Meu Perfil</h2>

          <form className="profile-form" onSubmit={handleSave}>
            <div className="form-row">
              <div className="form-group form-group-lg">
                <label>Nome</label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={e => set('first_name', e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              <div className="form-group form-group-lg">
                <label>Sobrenome</label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={e => set('last_name', e.target.value)}
                  placeholder="Seu sobrenome"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Telefone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="+55 11 99999-9999"
              />
            </div>

            <div className="form-group">
              <label>
                Email pessoal
                <span className="star-hint">email de login</span>
              </label>
              <input type="email" value={user.email} disabled />
            </div>

            <div className="form-group">
              <label>Email profissional</label>
              <input
                type="email"
                value={form.professional_email}
                onChange={e => set('professional_email', e.target.value)}
                placeholder="voce@empresa.com"
              />
            </div>

            <div className="form-group">
              <label>LinkedIn</label>
              <input
                type="url"
                value={form.linkedin_url}
                onChange={e => set('linkedin_url', e.target.value)}
                placeholder="https://linkedin.com/in/seu-perfil"
              />
            </div>

            <div className="form-group">
              <label>
                Foto de perfil
                <span className="star-hint">URL da imagem</span>
              </label>
              <input
                type="url"
                value={form.avatar_url}
                onChange={e => set('avatar_url', e.target.value)}
                placeholder="https://..."
              />
              {form.avatar_url && (
                <img src={form.avatar_url} alt="Preview" className="avatar-preview" />
              )}
            </div>

            <div className="profile-actions">
              {success && <span className="save-success">✓ Perfil salvo!</span>}
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar perfil'}
              </button>
            </div>
          </form>

          <div className="profile-danger">
            <button type="button" className="btn btn-ghost" onClick={handleSignOut}>
              Sair da conta
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
