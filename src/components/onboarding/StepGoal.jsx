import { useState, useEffect, useRef } from 'react'
import { GOALS } from '../../utils/goals'

export default function StepGoal({ goal, goalOther, onGoalChange, onGoalOtherChange, onNext, onBack }) {
  const [attempted, setAttempted] = useState(false)
  const otherInputRef = useRef()

  const isOutro = goal === 'outro'
  const otherValid = goalOther.trim().length > 0
  const canContinue = goal && (goal !== 'outro' || otherValid)

  useEffect(() => {
    if (isOutro && otherInputRef.current) {
      otherInputRef.current.focus()
    }
  }, [isOutro])

  function handleNext() {
    setAttempted(true)
    if (canContinue) onNext()
  }

  return (
    <div className="onboarding-step">
      <div className="onboarding-step-inner onboarding-step-inner--wide">
        <h1 className="onboarding-title">por que você está aqui?</h1>
        <p className="onboarding-subtitle">
          isso ajuda a gente a lembrar seu objetivo nas próximas semanas. Pode mudar depois.
        </p>

        <div className="goal-grid">
          {GOALS.map(g => (
            <button
              key={g.id}
              type="button"
              className={`goal-card${goal === g.id ? ' goal-card--selected' : ''}`}
              onClick={() => onGoalChange(g.id)}
            >
              <span className="goal-card-label">{g.label}</span>
              <span className="goal-card-desc">{g.description}</span>
            </button>
          ))}
        </div>

        {isOutro && (
          <div className="goal-other-wrap">
            <div className="form-group">
              <label>em uma frase, qual seu objetivo?</label>
              <div className="goal-other-input-wrap">
                <input
                  ref={otherInputRef}
                  type="text"
                  value={goalOther}
                  onChange={e => onGoalOtherChange(e.target.value)}
                  placeholder="ex: documentar pra trocar de área daqui um ano"
                  maxLength={100}
                  className={attempted && !otherValid ? 'error' : ''}
                />
                {goalOther.length > 0 && (
                  <span className="goal-other-counter">{goalOther.length}/100</span>
                )}
              </div>
              {attempted && !otherValid && (
                <span className="field-error">escreva seu objetivo em uma frase</span>
              )}
            </div>
          </div>
        )}

        <div className="onboarding-actions">
          <button className="btn btn-ghost" onClick={onBack}>voltar</button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!goal}
          >
            continuar
          </button>
        </div>
      </div>
    </div>
  )
}
