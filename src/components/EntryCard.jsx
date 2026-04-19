import { useState } from 'react'
import { CATEGORY_MAP } from '../utils/categories'

export default function EntryCard({ entry, onEdit, onDelete, onImageClick }) {
  const [expanded, setExpanded] = useState(false)
  const cat = CATEGORY_MAP[entry.category] || CATEGORY_MAP.conquista
  const date = new Date(entry.date).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  const hasDetails = entry.description || entry.metric

  return (
    <article className="entry-card" style={{ '--border-color': cat.color }}>
      <div className="card-header">
        <div className="card-meta">
          <span className="card-category" style={{ color: cat.color }}>
            {cat.label}
          </span>
          <time className="card-date">{date}</time>
        </div>
        <div className="card-actions">
          <button className="icon-btn" onClick={() => onEdit(entry)} title="Editar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button className="icon-btn icon-btn-danger" onClick={() => onDelete(entry.id)} title="Deletar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>

      <h2 className="card-title">{entry.title}</h2>

      {hasDetails && (
        <div className={`card-star ${expanded ? 'expanded' : ''}`}>
          {entry.description && (
            <div className="star-item">
              <p style={{ whiteSpace: 'pre-wrap' }}>{entry.description}</p>
            </div>
          )}
          {entry.metric && (
            <div className="star-item metric-item">
              <span className="star-label">Resultado quantificável</span>
              <p className="metric-value">{entry.metric}</p>
            </div>
          )}
        </div>
      )}

      {hasDetails && (
        <button className="expand-btn" onClick={() => setExpanded(v => !v)}>
          {expanded ? 'Recolher' : 'Ver descrição'}
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      )}

      {entry.images?.length > 0 && (
        <div className="card-gallery">
          {entry.images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              className="gallery-thumb"
              onClick={() => onImageClick(entry.images, i)}
              style={{ backgroundImage: `url(${img})` }}
            >
              {i === 3 && entry.images.length > 4 && (
                <span className="gallery-more">+{entry.images.length - 4}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {entry.tags?.length > 0 && (
        <div className="card-tags">
          {entry.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </article>
  )
}
