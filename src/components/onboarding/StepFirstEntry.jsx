import { useState } from 'react'
import { saveEntry, generateId } from '../../utils/db'

const CATEGORIES = [
  { id: 'conquista',   label: 'Conquista',   color: '#D63830' },
  { id: 'projeto',     label: 'Projeto',     color: '#5C6B4F' },
  { id: 'feedback',    label: 'Feedback',    color: '#7A2E3A' },
  { id: 'metrica',     label: 'Métrica',     color: '#8B6F4E' },
  { id: 'aprendizado', label: 'Aprendizado', color: '#C27547' },
]

const SpinnerIcon = () => (
  <svg className="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
)

const RefreshIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M8 16H3v5"/>
  </svg>
)

const StarBadgeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

export default function StepFirstEntry({ onNext, onBack }) {
  const [rawText, setRawText] = useState('')
  const [aiState, setAiState] = useState('idle') // 'idle' | 'loading' | 'done'
  const [title, setTitle] = useState('')
  const [impact, setImpact] = useState('')
  const [category, setCategory] = useState('conquista')
  const [titleError, setTitleError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleEnhance() {
    if (!rawText.trim() || aiState === 'loading') return
    setAiState('loading')
    try {
      const res = await fetch('/api/enhance-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setRawText(data.texto || rawText)
      setTitle(data.titulo || '')
      setImpact(data.impacto || '')
      setCategory(data.categoria || 'conquista')
      setAiState('done')
    } catch {
      setAiState('idle')
    }
  }

  async function handleSave() {
    if (!title.trim()) { setTitleError('campo obrigatório.'); return }
    setSaving(true)
    try {
      await saveEntry({
        id: generateId(),
        title: title.trim(),
        date: new Date().toISOString().slice(0, 10),
        category,
        description: rawText.trim(),
        metric: impact.trim(),
        tags: [],
        createdAt: new Date().toISOString(),
      })
      onNext(true)
    } catch {
      setSaving(false)
    }
  }

  const catColor = CATEGORIES.find(c => c.id === category)?.color || '#D63830'

  return (
    <div className="onboarding-step">
      <div className="onboarding-step-inner onboarding-step-inner--entry">
        <h1 className="onboarding-title">
          descreva uma conquista recente.{' '}
          <em style={{ color: 'var(--red)', fontStyle: 'italic' }}>qualquer coisa conta.</em>
        </h1>

        {/* Textarea com toolbar de IA */}
        <div className={`ai-textarea-wrap${aiState === 'done' ? ' ai-textarea-wrap--done' : ''}`}>
          <div className="ai-textarea-container">
            <textarea
              className="ai-textarea"
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder="Ex: liderava um projeto travado. Organizei uma sessão com os líderes, preparei um one-pager com os trade-offs e guiei a decisão. Roadmap destravado em 48h."
              rows={5}
              disabled={aiState === 'loading'}
            />
            {aiState === 'loading' && (
              <div className="ai-loading-overlay">
                <SpinnerIcon />
                <span>aprimorando com IA…</span>
              </div>
            )}
          </div>
          <div className="ai-toolbar">
            <div className="ai-toolbar-badge">
              <StarBadgeIcon />
              <span className="ai-toolbar-label">
                {aiState === 'done'
                  ? 'aprimorado com IA — edite à vontade'
                  : 'aprimora situação, tarefa, ação e resultado'}
              </span>
            </div>
            <div className="ai-toolbar-action">
              {aiState === 'loading' && <SpinnerIcon />}
              {aiState === 'idle' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleEnhance}
                  disabled={!rawText.trim()}
                >
                  aprimorar com IA
                </button>
              )}
              {aiState === 'done' && (
                <button className="btn btn-ghost btn-sm" onClick={() => setAiState('idle')}>
                  <RefreshIcon /> refazer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Campos revelados após IA rodar */}
        {aiState === 'done' && (
          <div className="ai-fields-revealed">
            <div className="form-group">
              <label>título</label>
              <input
                type="text"
                value={title}
                onChange={e => { setTitle(e.target.value); setTitleError('') }}
                className={titleError ? 'error' : ''}
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
          </div>
        )}

        {/* Category chips */}
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

        {/* Ações */}
        <div className="onboarding-actions onboarding-actions--entry">
          <button className="btn btn-ghost" onClick={onBack}>voltar</button>
          <button className="btn btn-ghost" onClick={() => onNext(false)}>pular por agora</button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={aiState !== 'done' || saving}
            style={aiState !== 'done' ? { opacity: 0.38, cursor: 'not-allowed' } : {}}
          >
            {saving ? 'salvando...' : 'salvar primeira entrada'}
          </button>
        </div>
      </div>
    </div>
  )
}
