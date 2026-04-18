import { CATEGORIES } from '../utils/categories'

export default function StatsBar({ entries }) {
  const counts = Object.fromEntries(CATEGORIES.map(c => [c.id, 0]))
  entries.forEach(e => { if (counts[e.category] !== undefined) counts[e.category]++ })

  const lastEntry = entries[0]
  const daysSinceLast = lastEntry
    ? Math.floor((Date.now() - new Date(lastEntry.date)) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="stats-bar">
      {daysSinceLast !== null && daysSinceLast >= 7 && (
        <div className="alert-streak">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {daysSinceLast === 7 ? 'Já faz 7 dias sem um registro!' : `Já fazem ${daysSinceLast} dias sem registro!`}
        </div>
      )}
      <div className="stats-counters">
        {CATEGORIES.map(cat => (
          <div key={cat.id} className="stat-chip" style={{ '--cat-color': cat.color }}>
            <span className="stat-emoji">{cat.emoji}</span>
            <span className="stat-label">{cat.label}</span>
            <span className="stat-count">{counts[cat.id]}</span>
          </div>
        ))}
        <div className="stat-chip stat-total">
          <span className="stat-label">Total</span>
          <span className="stat-count">{entries.length}</span>
        </div>
      </div>
    </div>
  )
}
