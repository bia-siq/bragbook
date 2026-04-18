import EntryCard from './EntryCard'

export default function EntryList({ entries, onEdit, onDelete, onImageClick }) {
  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        <p>Nenhuma entrada encontrada</p>
        <small>Registre sua primeira conquista!</small>
      </div>
    )
  }

  const byMonth = {}
  entries.forEach(entry => {
    const d = new Date(entry.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    if (!byMonth[key]) byMonth[key] = { label, items: [] }
    byMonth[key].items.push(entry)
  })

  const sorted = Object.keys(byMonth).sort((a, b) => b.localeCompare(a))

  return (
    <div className="entry-list">
      {sorted.map(key => (
        <section key={key} className="month-group">
          <h3 className="month-heading">
            {byMonth[key].label.charAt(0).toUpperCase() + byMonth[key].label.slice(1)}
          </h3>
          <div className="cards-grid">
            {byMonth[key].items.map(entry => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={onEdit}
                onDelete={onDelete}
                onImageClick={onImageClick}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
