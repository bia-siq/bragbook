import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import PhoneInput from '../PhoneInput'
import AvatarPicker from '../AvatarPicker'

export default function StepProfile({ onNext, onBack }) {
  const { user } = useAuth()
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    linkedin_url: '',
    avatar_url: '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (!user) return
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          linkedin_url: data.linkedin_url || '',
          avatar_url: data.avatar_url || '',
        })
      })
  }, [user])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: null }))
  }

  function validate() {
    const e = {}
    if (!form.first_name.trim()) e.first_name = 'nome obrigatório'
    if (!form.last_name.trim()) e.last_name = 'sobrenome obrigatório'
    if (!form.phone) e.phone = 'telefone inválido para o país selecionado'
    return e
  }

  async function handleNext() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    setSaveError('')
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      phone: form.phone,
      linkedin_url: form.linkedin_url.trim(),
      avatar_url: form.avatar_url,
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
    if (error) { setSaveError('erro ao salvar. tente de novo.'); return }
    onNext()
  }

  return (
    <div className="onboarding-step">
      <div className="onboarding-step-inner">
        <h1 className="onboarding-title">quem é você.</h1>
        <p className="onboarding-subtitle">
          três campos pra gente te tratar pelo nome. Os outros dois ajudam o arquivo a viver além do login.
        </p>

        <div className="onboarding-form">
          <div className="avatar-section">
            <AvatarPicker
              value={form.avatar_url}
              onChange={v => set('avatar_url', v)}
            />
          </div>

          <div className="form-row">
            <div className="form-group form-group-lg">
              <label>nome *</label>
              <input
                type="text"
                value={form.first_name}
                onChange={e => set('first_name', e.target.value)}
                placeholder="seu nome"
                className={errors.first_name ? 'error' : ''}
              />
              {errors.first_name && <span className="field-error">{errors.first_name}</span>}
            </div>
            <div className="form-group form-group-lg">
              <label>sobrenome *</label>
              <input
                type="text"
                value={form.last_name}
                onChange={e => set('last_name', e.target.value)}
                placeholder="seu sobrenome"
                className={errors.last_name ? 'error' : ''}
              />
              {errors.last_name && <span className="field-error">{errors.last_name}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>telefone *</label>
            <PhoneInput
              value={form.phone}
              onChange={v => set('phone', v)}
              error={errors.phone}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>linkedin <span className="optional-hint">opcional</span></label>
            <input
              type="url"
              value={form.linkedin_url}
              onChange={e => set('linkedin_url', e.target.value)}
              placeholder="https://linkedin.com/in/seu-perfil"
            />
          </div>

          {saveError && <p className="field-error">{saveError}</p>}

          <div className="onboarding-actions">
            <button className="btn btn-ghost" onClick={onBack}>voltar</button>
            <button className="btn btn-primary" onClick={handleNext} disabled={saving}>
              {saving ? 'salvando...' : 'continuar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
