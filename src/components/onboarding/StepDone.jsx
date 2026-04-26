export default function StepDone({ savedEntry, onFinish, onBack }) {
  return (
    <div className="onboarding-step onboarding-done">
      <div className="onboarding-step-inner">
        <h1 className="onboarding-done-title">
          <em style={{ color: 'var(--red)', fontStyle: 'italic' }}>pronto.</em>
        </h1>

        <p className="onboarding-subtitle">
          {savedEntry
            ? 'sua primeira entrada já está no arquivo. adicione a próxima quando fizer sentido.'
            : 'você ainda não tem entrada. registre a primeira quando quiser.'}
        </p>

        <div className="onboarding-actions onboarding-actions--center" style={{ flexDirection: 'column', gap: 12 }}>
          <button
            className="btn btn-primary btn-lg"
            style={{ maxWidth: 280, width: '100%' }}
            onClick={onFinish}
          >
            ver meu arquivo
          </button>
          <button
            className="btn btn-ghost"
            style={{ textDecoration: 'underline' }}
            onClick={onBack}
          >
            voltar
          </button>
        </div>
      </div>
    </div>
  )
}
