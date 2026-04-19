import { CATEGORIES } from '../utils/categories'

const PERIODS = [
  { value: 'all', label: 'Todos' },
  { value: '30', label: '30 dias' },
  { value: '90', label: '90 dias' },
  { value: '365', label: '1 ano' },
]

export default function Filters({ search, setSearch, category, setCategory, period, setPeriod }) {
  return (
    <div className="filters">
      <div className="search-wrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="search"
          placeholder="Buscar por título, descrição ou tags…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>
      <div className="filter-row">
        <div className="filter-group">
          <button
            className={`filter-btn ${category === '' ? 'active' : ''}`}
            onClick={() => setCategory('')}
          >
            Todas
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`filter-btn ${category === cat.id ? 'active' : ''}`}
              style={category === cat.id ? { '--active-color': cat.color } : {}}
              onClick={() => setCategory(category === cat.id ? '' : cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="filter-group period-group">
          {PERIODS.map(p => (
            <button
              key={p.value}
              className={`filter-btn ${period === p.value ? 'active' : ''}`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
