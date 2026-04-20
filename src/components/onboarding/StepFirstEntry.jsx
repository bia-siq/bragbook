import { useState } from 'react'
import { saveEntry, generateId } from '../../utils/db'
import EntryFormFields from '../EntryFormFields'

const today = new Date().toISOString().slice(0, 10)

const EXAMPLE = {
  title: 'destravei roadmap do time em 2 dias',
  category: 'projeto',
  date: today,
  description:
    'O time estava há 3 semanas travado em uma decisão de arquitetura.\n' +
    'Como PM, convoquei uma sessão fechada com eng lead e design lead,\n' +
    'preparei um one-pager com os três caminhos possíveis e os trade-offs,\n' +
    'e guiei a conversa até uma decisão. Roadmap destravou em 48h.',
  metric: 'ciclo de decisão reduzido de 3 semanas para 48h',
  images: [],
}
const EXAMPLE_TAGS = 'liderança, roadmap, decisão'

export default function StepFirstEntry({ onNext, onBack }) {
  const [form, setForm] = useState(EXAMPLE)
  const [tagInput, setTagInput] = useState(EXAMPLE_TAGS)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  function setField(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: null }))
  }

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Título obrigatório'
    if (!form.date) e.date = 'Data obrigatória'
    return e
  }

  async function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean)
    try {
      await saveEntry({
        id: generateId(),
        ...form,
        tags,
        createdAt: new Date().toISOString(),
      })
      onNext(true)
    } catch {
      setSaving(false)
    }
  }

  function handleSkip() {
    onNext(false)
  }

  return (
    <div className="onboarding-step">
      <div className="onboarding-step-inner onboarding-step-inner--wide">
        <div className="onboarding-two-col">
          <div className="star-explanation">
            <h2 className="onboarding-title">o formato STAR.</h2>
            <p className="onboarding-star-intro">
              Toda entrada no brag book segue quatro perguntas. Você não precisa responder cada uma
              como campo separado — elas só te guiam pra escrever algo que serviria numa conversa
              de promoção ou entrevista.
            </p>
            <ul className="star-list">
              <li><strong>Situação</strong> — qual era o contexto ou desafio?</li>
              <li><strong>Tarefa</strong> — qual era sua responsabilidade?</li>
              <li><strong>Ação</strong> — o que você fez, especificamente?</li>
              <li><strong>Resultado</strong> — qual foi o impacto?</li>
            </ul>
            <p className="onboarding-star-note">
              Três a cinco frases bastam. O objetivo é ter o suficiente pra você lembrar em seis meses.
            </p>
          </div>

          <div className="onboarding-entry-col">
            <p className="onboarding-entry-hint">
              substitua pelo seu — use essa entrada como molde.
            </p>
            <EntryFormFields
              form={form}
              tagInput={tagInput}
              errors={errors}
              onFieldChange={setField}
              onTagChange={setTagInput}
            />
            <div className="onboarding-actions onboarding-actions--entry">
              <button className="btn btn-ghost" onClick={onBack}>voltar</button>
              <button className="btn btn-ghost" onClick={handleSkip}>pular — crio depois</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'salvando...' : 'salvar primeira entrada'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
