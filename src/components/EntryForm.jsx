import { useState, useEffect, useRef } from 'react'
import { resizeAndCompressImage } from '../utils/imageUtils'
import EntryFormFields from './EntryFormFields'

const EMPTY = {
  title: '', category: 'conquista', date: new Date().toISOString().slice(0, 10),
  description: '', metric: '', tags: '', images: []
}

export default function EntryForm({ entry, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY)
  const [tagInput, setTagInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState({})
  const fileRef = useRef()

  useEffect(() => {
    if (entry) {
      setForm({ ...EMPTY, ...entry, tags: '' })
      setTagInput(entry.tags?.join(', ') || '')
    } else {
      setForm(EMPTY)
      setTagInput('')
    }
    setErrors({})
  }, [entry])

  function setField(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }))
  }

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Título obrigatório'
    if (!form.date) e.date = 'Data obrigatória'
    return e
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean)
    onSave({ ...form, tags })
  }

  async function handleFiles(files) {
    const arr = [...files].slice(0, 10 - form.images.length)
    if (!arr.length) return
    setUploading(true)
    const results = await Promise.all(arr.map(f => resizeAndCompressImage(f)))
    setForm(f => ({ ...f, images: [...f.images, ...results].slice(0, 10) }))
    setUploading(false)
  }

  function removeImage(idx) {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  function handleDrop(e) {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{entry ? 'Editar entrada' : 'Nova entrada'}</h2>
          <button className="icon-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="entry-form">
          <EntryFormFields
            form={form}
            tagInput={tagInput}
            errors={errors}
            onFieldChange={setField}
            onTagChange={setTagInput}
          />

          <div className="form-group">
            <label>Imagens ({form.images.length}/10)</label>
            <div
              className="drop-zone"
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={e => handleFiles(e.target.files)}
              />
              {uploading ? (
                <span>Processando imagens…</span>
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>Clique ou arraste imagens aqui</span>
                  <small>Máx. {10 - form.images.length} imagem(ns) restante(s) · Redimensionado para 1200px</small>
                </>
              )}
            </div>
            {form.images.length > 0 && (
              <div className="image-previews">
                {form.images.map((img, i) => (
                  <div key={i} className="preview-thumb">
                    <img src={img} alt={`Prévia ${i + 1}`} />
                    <button type="button" className="preview-remove" onClick={() => removeImage(i)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              {entry ? 'Salvar alterações' : 'Adicionar entrada'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
