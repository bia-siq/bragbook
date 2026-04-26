import { useState } from 'react'
import { saveEntry, generateId } from '../../utils/db'

const CATEGORIES = [
  { id: 'conquista',   label: 'Conquista',   color: '#D63830' },
  { id: 'projeto',     label: 'Projeto',     color: '#5C6B4F' },
  { id: 'feedback',    label: 'Feedback',    color: '#7A2E3A' },
  { id: 'metrica',     label: 'Métrica',     color: '#8B6F4E' },
  { id: 'aprendizado', label: 'Aprendizado', color: '#C27547' },
]

export default function StepFirstEntry({ onNext, onBack }) {
  const [description, setDescription] = useState('')
  const [title, setTitle] = useState('')
  const [impact, setImpact] = useState('')
  const [category, setCategory] = useState('conquista')
  const [titleError, setTitleError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!title.trim()) { setTitleError('campo obrigatório.'); return }
    setSaving(true)
    try {
      await saveEntry({
        id: generateId(),
        title: title.trim(),
        date: new Date().toISOString().slice(0, 10),
        category,
        description: description.trim(),
        metric: impact.trim(),
        tags: [],
        createdAt: new Date().toISOString(),
      })
      onNext(true)
    } catch {
      setSaving(false)
    }
  }

  return (
    <div className="onboarding-step">
      <div className="onboarding-step-inner onboarding-step-inner--entry">
        <h1 className="onboarding-title">
          descreva uma conquista recente.{' '}
          <em style={{ color: 'var(--red)', fontStyle: 'italic' }}>qualquer coisa conta.</em>
        </h1>

        <div className="onboarding-form">
          <div className="form-group">
            <label>descreva o que aconteceu</label>
            <textarea
              className="ai-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ex: liderava um projeto travado. Organizei uma sessão com os líderes, preparei um one-pager com os trade-offs e guiei a decisão. Roadmap destravado em 48h."
              rows={5}
              style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--radius)' }}
            />
            <span className="optional-hint" style={{ fontSize: '0.8rem', marginTop: 4, display: 'block' }}>
              situação → tarefa → ação → resultado. 3–4 frases bastam.
            </span>
          </div>

          <div className="form-group">
            <label>título</label>
            <input
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); setTitleError('') }}
              className={titleError ? 'error' : ''}
              placeholder="ex: destravei roadmap do time em 2 dias"
              maxLength={80}
            />
            {titleError && <span className="field-error">{titleError}</span>}
          </div>

          <div className="form-group">
            <label>
              impacto quantificado{' '}
              <span className="optional-hint">— opcional</span>
            </label>
            <input
              type="text"
              value={impact}
              onChange={e => setImpact(e.target.value)}
              placeholder="ex: 30% de redução no ciclo, R$120k de receita nova"
            />
          </div>

          <div className="category-chips-row">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                type="button"
                className="category-chip"
                style={
                  category === c.id
                    ? { background: c.color, color: '#fff', borderColor: c.color }
                    : {}
                }
                onClick={() => setCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="onboarding-actions onboarding-actions--entry">
          <button className="btn btn-ghost" onClick={onBack}>voltar</button>
          <button className="btn btn-ghost" onClick={() => onNext(false)}>pular por agora</button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'salvando...' : 'salvar primeira entrada'}
          </button>
        </div>
      </div>
    </div>
  )
}
