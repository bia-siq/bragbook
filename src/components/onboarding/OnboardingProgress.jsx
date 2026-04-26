export default function OnboardingProgress({ step }) {
  // step 1–5 → 5 dots (welcome step 0 doesn't count)
  return (
    <div className="onboarding-dots" role="progressbar" aria-valuenow={step} aria-valuemax={5}>
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className={
            'onboarding-dot' +
            (i === step ? ' onboarding-dot--active' : '') +
            (i < step ? ' onboarding-dot--done' : '')
          }
        />
      ))}
    </div>
  )
}
