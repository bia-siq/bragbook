export default function StepFrequency({ onNext }) {
  return (
    <div className="onboarding-step">
      <div className="onboarding-step-inner">
        <h1 className="onboarding-title">memória é ruim. Anote toda semana.</h1>

        <p className="onboarding-subtitle">
          A recomendação é simples: reserve 10 minutos no fim da semana para registrar uma a três entradas.
          Não precisa ser conquista grande — um elogio, um aprendizado, uma métrica que mexeu.
          O valor do arquivo vem da consistência, não da escala de cada entrada.
        </p>

        <div className="onboarding-editorial">
          <span className="onboarding-editorial-text">
            sexta às 17h, antes de fechar o laptop. funciona.
          </span>
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
