export default function StepWelcome({ onNext, onSkip }) {
  return (
    <div className="onboarding-step onboarding-welcome">
      <div className="onboarding-welcome-inner">
        <div className="onboarding-wordmark">
          <span className="wordmark-brag">brag</span> <span className="wordmark-book">book</span>
        </div>

        <h1 className="onboarding-hero">seu arquivo de conquistas começa aqui.</h1>

        <p className="onboarding-subtitle">
          brag book é um portfólio privado da sua carreira. Você registra o que fez,
          com contexto e resultado, e consulta quando precisar — em negociação, promoção ou transição.
        </p>

        <div className="onboarding-welcome-actions">
          <button className="btn btn-primary btn-lg" onClick={onNext}>
            vamos começar
          </button>
          <button className="btn btn-ghost" onClick={onSkip}>
            pular por agora
          </button>
        </div>
      </div>
    </div>
  )
}
