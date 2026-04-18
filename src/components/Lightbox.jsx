import { useEffect, useCallback } from 'react'

export default function Lightbox({ images, index, onClose, onNav }) {
  const prev = useCallback(() => onNav((index - 1 + images.length) % images.length), [index, images.length, onNav])
  const next = useCallback(() => onNav((index + 1) % images.length), [index, images.length, onNav])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  return (
    <div className="lightbox-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="lightbox">
        <button className="lightbox-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {images.length > 1 && (
          <button className="lightbox-nav lightbox-prev" onClick={prev}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        )}

        <img src={images[index]} alt={`Imagem ${index + 1}`} className="lightbox-img" />

        {images.length > 1 && (
          <button className="lightbox-nav lightbox-next" onClick={next}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        )}

        {images.length > 1 && (
          <div className="lightbox-counter">{index + 1} / {images.length}</div>
        )}

        {images.length > 1 && (
          <div className="lightbox-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`lb-dot ${i === index ? 'active' : ''}`}
                onClick={() => onNav(i)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
