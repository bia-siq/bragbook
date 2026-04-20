import { useState, useEffect } from 'react'
import { AsYouType, parsePhoneNumber } from 'libphonenumber-js'
import { COUNTRIES } from '../utils/countries'

function formatNational(digits, countryCode) {
  const formatter = new AsYouType(countryCode)
  let result = ''
  for (const ch of digits) result = formatter.input(ch)
  return result
}

export default function PhoneInput({ value, onChange, error }) {
  const defaultCountry = COUNTRIES[0]
  const [country, setCountry] = useState(defaultCountry)
  const [displayValue, setDisplayValue] = useState('')

  useEffect(() => {
    if (!value) return
    try {
      const parsed = parsePhoneNumber(value)
      if (parsed) {
        const found = COUNTRIES.find(c => c.code === parsed.country)
        if (found) setCountry(found)
        setDisplayValue(formatNational(parsed.nationalNumber, parsed.country))
      }
    } catch {}
  }, [])

  function handleCountryChange(e) {
    const found = COUNTRIES.find(c => c.code === e.target.value)
    setCountry(found || defaultCountry)
    setDisplayValue('')
    onChange('')
  }

  function handleInput(e) {
    const digits = e.target.value.replace(/\D/g, '')
    const formatted = formatNational(digits, country.code)
    setDisplayValue(formatted)

    if (!digits) { onChange(''); return }

    try {
      const e164Candidate = '+' + country.dialCode + digits
      const parsed = parsePhoneNumber(e164Candidate)
      if (parsed && parsed.isValid()) {
        onChange(parsed.number)
        return
      }
    } catch {}
    onChange('')
  }

  return (
    <div className={`phone-input${error ? ' phone-input--error' : ''}`}>
      <select
        className="phone-country"
        value={country.code}
        onChange={handleCountryChange}
        aria-label="país"
      >
        {COUNTRIES.map(c => (
          <option key={c.code} value={c.code}>
            {c.flag} +{c.dialCode} {c.name}
          </option>
        ))}
      </select>
      <input
        type="tel"
        className="phone-number"
        value={displayValue}
        onChange={handleInput}
        placeholder={country.placeholder}
        autoComplete="tel-national"
      />
    </div>
  )
}
