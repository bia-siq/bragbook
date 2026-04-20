import { CATEGORIES } from '../utils/categories'

export default function EntryFormFields({ form, tagInput, errors = {}, onFieldChange, onTagChange }) {
  return (
    <>
      <div className="form-row">
        <div className="form-group form-group-lg">
          <label>Título *</label>
          <input
            type="text"
            value={form.title}
            onChange={e => onFieldChange('title', e.target.value)}
            placeholder="Ex: Liderei migração do banco de dados"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>
        <div className="form-group">
          <label>Data *</label>
          <input
            type="date"
            value={form.date}
            onChange={e => onFieldChange('date', e.target.value)}
            className={errors.date ? 'error' : ''}
          />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Categoria</label>
        <div className="category-picker">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`cat-option ${form.category === cat.id ? 'selected' : ''}`}
              style={{ '--cat-color': cat.color }}
              onClick={() => onFieldChange('category', cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>
          Descrição
          <span className="star-hint">Formato STAR: Situação · Tarefa · Ação · Resultado</span>
        </label>
        <textarea
          value={form.description}
          onChange={e => onFieldChange('description', e.target.value)}
          placeholder="Descreva sua conquista usando o formato STAR:&#10;• Situação: qual era o contexto ou desafio?&#10;• Tarefa: qual era a sua responsabilidade?&#10;• Ação: o que você fez especificamente?&#10;• Resultado: qual foi o impacto ou desfecho?"
          rows={6}
        />
      </div>

      <div className="form-group">
        <label>Resultado quantificável</label>
        <input
          type="text"
          value={form.metric}
          onChange={e => onFieldChange('metric', e.target.value)}
          placeholder="Ex: Reduziu tempo de deploy em 40%, economizou R$12k/mês"
        />
      </div>

      <div className="form-group">
        <label>Tags</label>
        <input
          type="text"
          value={tagInput}
          onChange={e => onTagChange(e.target.value)}
          placeholder="liderança, backend, performance (separadas por vírgula)"
        />
      </div>
    </>
  )
}
