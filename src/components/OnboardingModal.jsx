import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import OnboardingProgress from './onboarding/OnboardingProgress'
import StepWelcome from './onboarding/StepWelcome'
import StepProfile from './onboarding/StepProfile'
import StepGoal from './onboarding/StepGoal'
import StepFirstEntry from './onboarding/StepFirstEntry'
import StepFrequency from './onboarding/StepFrequency'
import StepDone from './onboarding/StepDone'

const TOTAL_STEPS = 6
const FOCUSABLE_SELECTORS = 'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'

export default function OnboardingModal({ profile, onComplete }) {
  const { user } = useAuth()
  const modalRef = useRef(null)
  const [step, setStep] = useState(0)
  const [savedEntry, setSavedEntry] = useState(false)
  const [goal, setGoal] = useState('')
  const [goalOther, setGoalOther] = useState('')

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Block ESC + focus trap
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        return
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = [...modalRef.current.querySelectorAll(FOCUSABLE_SELECTORS)]
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus first element on step change
  useEffect(() => {
    if (!modalRef.current) return
    const focusable = modalRef.current.querySelectorAll(FOCUSABLE_SELECTORS)
    if (focusable.length) focusable[0].focus()
  }, [step])

  function next() { setStep(s => s + 1) }
  function back() { setStep(s => s - 1) }

  async function handleSkip() {
    await supabase.from('profiles').upsert({
      id: user.id,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    onComplete()
  }

  async function handleFinish() {
    await supabase.from('profiles').upsert({
      id: user.id,
      onboarding_completed: true,
      goal: goal || null,
      goal_other: goal === 'outro' ? (goalOther.trim() || null) : null,
      updated_at: new Date().toISOString(),
    })
    onComplete()
  }

  function handleFirstEntry(saved) {
    setSavedEntry(saved)
    next()
  }

  const showProgress = step >= 1 && step <= 4

  return (
    <div className="onboarding-overlay">
      <div
        ref={modalRef}
        className={`onboarding-modal${step === 3 ? ' onboarding-modal--entry' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="configuração inicial"
      >
        {showProgress && (
          <div className="onboarding-progress-wrap">
            <OnboardingProgress step={step} total={TOTAL_STEPS} />
          </div>
        )}

        <div className="onboarding-modal-body">
          {step === 0 && <StepWelcome onNext={next} onSkip={handleSkip} />}
          {step === 1 && <StepProfile onNext={next} onBack={back} />}
          {step === 2 && (
            <StepGoal
              goal={goal}
              goalOther={goalOther}
              onGoalChange={setGoal}
              onGoalOtherChange={setGoalOther}
              onNext={next}
              onBack={back}
            />
          )}
          {step === 3 && <StepFirstEntry onNext={handleFirstEntry} onBack={back} />}
          {step === 4 && <StepFrequency onNext={next} />}
          {step === 5 && <StepDone savedEntry={savedEntry} onFinish={handleFinish} />}
        </div>
      </div>
    </div>
  )
}
