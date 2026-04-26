const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

function nextFriday() {
  const d = new Date()
  const day = d.getDay() // 0 Sun … 6 Sat
  const daysUntilFri = (5 - day + 7) % 7 || 7
  d.setDate(d.getDate() + daysUntilFri)
  return d.toISOString().slice(0, 10).replace(/-/g, '')
}

function buildCalendarUrl() {
  const fri = nextFriday()
  const start = `${fri}T170000`
  const end = `${fri}T171000`
  const params = new URLSearchParams({
    text: 'brag book — registro semanal',
    details: '10 minutos para registrar as conquistas da semana.',
    dates: `${start}/${end}`,
    recur: 'RRULE:FREQ=WEEKLY;BYDAY=FR',
  })
  return `https://calendar.google.com/calendar/r/eventedit?${params}`
}

export default function StepFrequency({ onNext }) {
  function handleCalendar() {
    window.open(buildCalendarUrl(), '_blank', 'noopener')
  }

  return (
    <div className="onboarding-step">
      <div className="onboarding-step-inner">
        <h1 className="onboarding-title">
          memória é ruim.{' '}
          <em style={{ color: 'var(--red)', fontStyle: 'italic' }}>anote toda semana.</em>
        </h1>

        <p className="onboarding-subtitle">
          Reserve 10 minutos no fim da semana para registrar uma a três entradas.
          O valor do arquivo vem da consistência, não da escala de cada entrada.
        </p>

        <div className="onboarding-editorial">
          <span className="onboarding-editorial-text">
            sexta às 17h, antes de fechar o laptop. funciona.
          </span>
        </div>

        <div className="gcal-widget">
          <div className="gcal-info">
            <span className="gcal-icon"><CalendarIcon /></span>
            <div>
              <div className="gcal-label">Google Agenda</div>
              <div className="gcal-desc">evento recorrente toda sexta às 17h</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleCalendar}>
            criar evento
          </button>
        </div>

        <div className="onboarding-actions onboarding-actions--center">
          <button className="btn btn-primary btn-lg" onClick={onNext}>
            combinado
          </button>
        </div>
      </div>
    </div>
  )
}
