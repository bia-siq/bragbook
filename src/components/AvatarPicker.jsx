import { useRef, useState } from 'react'
import { resizeAndCompressImage } from '../utils/imageUtils'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024

export default function AvatarPicker({ value, onChange }) {
  const fileRef = useRef()
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  async function handleFile(file) {
    setError('')
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('apenas jpeg, png ou webp.')
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('imagem muito grande — máx 5MB.')
      return
    }
    setProcessing(true)
    try {
      const dataUrl = await resizeAndCompressImage(file, 512, 0.85)
      onChange(dataUrl)
    } catch {
      setError('erro ao processar a imagem.')
    }
    setProcessing(false)
  }

  function handleChange(e) {
    if (e.target.files?.[0]) handleFile(e.target.files[0])
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click()
  }

  function handleRemove(e) {
    e.stopPropagation()
    onChange('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="avatar-picker">
      <div
        className={`avatar-picker-circle${value ? ' avatar-picker-circle--filled' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => fileRef.current?.click()}
        onKeyDown={handleKeyDown}
        aria-label="foto de perfil"
      >
        {value ? (
          <>
            <img src={value} alt="foto de perfil" className="avatar-picker-img" />
            <button
              type="button"
              className="avatar-picker-remove"
              onClick={handleRemove}
              aria-label="remover foto"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </>
        ) : (
          <svg className="avatar-picker-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        )}
        {processing && <div className="avatar-picker-overlay">...</div>}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        aria-label="foto de perfil"
        onChange={handleChange}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}
