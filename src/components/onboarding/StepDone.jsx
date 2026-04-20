export default function StepDone({ savedEntry, onFinish }) {
  return (
    <div className="onboarding-step onboarding-done">
      <div className="onboarding-step-inner">
        <h1 className="onboarding-done-title">pronto.</h1>

        <p className="onboarding-subtitle">
          {savedEntry
            ? 'sua primeira entrada já está no arquivo. adicione a próxima quando fizer sentido.'
            : 'você ainda não tem entrada. registre a primeira quando quiser.'}
        </p>

        <div className="onboarding-actions onboarding-actions--center">
          <button className="btn btn-primary btn-lg" onClick={onFinish}>
            ver meu arquivo
          </button>
        </div>
      </div>
    </div>
  )
}
