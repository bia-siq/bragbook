export default function OnboardingProgress({ step, total }) {
  const pct = Math.round((step / (total - 1)) * 100)
  return (
    <div className="onboarding-progress" role="progressbar" aria-valuenow={step + 1} aria-valuemax={total}>
      <div className="onboarding-progress-bar" style={{ width: `${pct}%` }} />
    </div>
  )
}
