import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEntries } from '../hooks/useEntries'
import { useProfile } from '../hooks/useProfile'

// ── Icons ────────────────────────────────────────────────────
const IconFileText = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
const IconLinkedin = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
const IconList = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
const IconStar = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const IconRefresh = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
const IconLink = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
const IconCheck = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
const IconArrowLeft = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
const IconDownload = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
const IconClock = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconHistory = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
const IconPrint = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>

// ── Constants ────────────────────────────────────────────────
const COMP_OPTIONS = [
  { id: 'lideranca',    label: 'Liderança e influência' },
  { id: 'estrategia',  label: 'Visão estratégica de produto' },
  { id: 'impacto',     label: 'Impacto quantificável' },
  { id: 'execucao',    label: 'Execução técnica' },
  { id: 'colaboracao', label: 'Colaboração interfuncional' },
]

// Maps entry categories to competency IDs
const CATEGORY_TO_COMPS = {
  conquista:   ['impacto', 'lideranca'],
  projeto:     ['estrategia', 'execucao'],
  feedback:    ['lideranca', 'colaboracao'],
  metrica:     ['impacto'],
  aprendizado: ['execucao', 'colaboracao'],
}

const LOADING_MSGS = [
  'Lendo suas entradas...',
  'Agrupando por competência...',
  'Selecionando métricas de maior impacto...',
  'Escrevendo a primeira versão...',
  'Revisando tom editorial...',
]

const HISTORY_KEY = 'bb_dossiers'

// ── Helpers ──────────────────────────────────────────────────
function getPeriodCutoff(period, customStart, customEnd) {
  const now = new Date()
  if (period === '3m')     return { start: new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()), end: now }
  if (period === '6m')     return { start: new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()), end: now }
  if (period === '12m')    return { start: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()), end: now }
  if (period === 'custom') return { start: new Date(customStart), end: new Date(customEnd) }
  return { start: new Date(0), end: now }
}

function filterEntriesByPeriod(entries, period, customStart, customEnd) {
  const { start, end } = getPeriodCutoff(period, customStart, customEnd)
  return entries.filter(e => {
    const d = new Date(e.date)
    return d >= start && d <= end
  })
}

function formatPeriodLabel(period, customStart, customEnd) {
  const fmt = (d) => d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
  const { start, end } = getPeriodCutoff(period, customStart, customEnd)
  return `${fmt(start)} – ${fmt(end)}`
}

function getEntriesForComp(entries, compId) {
  return entries.filter(e => {
    const comps = CATEGORY_TO_COMPS[e.category] || []
    return comps.includes(compId)
  })
}

function buildBullet(entry) {
  let text = entry.title
  if (entry.metric) text += ` — ${entry.metric}`
  return text
}

function extractTopMetrics(entries) {
  const metricEntries = entries.filter(e => e.metric && e.metric.trim())
  return metricEntries.slice(0, 3).map(e => ({
    valor: extractMetricValue(e.metric),
    label: e.title.toLowerCase(),
  }))
}

function extractMetricValue(metric) {
  const match = metric.match(/([+\-±]?\d+[%xX]?[\d.,]*\s*[%xXkKmMkMr$€R]*)/)
  return match ? match[0].trim() : metric.split(' ').slice(0, 2).join(' ')
}

function buildSummary(entries, nome, periodoLabel, objetivo, selComps) {
  const total = entries.length
  const metricCount = entries.filter(e => e.category === 'metrica' || e.metric).length
  const goalLabel = {
    promocao: 'promoção de cargo',
    troca:    'transição de área',
    emprego:  'nova oportunidade',
    outro:    objetivo,
  }
  const compLabels = selComps.map(id => COMP_OPTIONS.find(c => c.id === id)?.label?.toLowerCase()).filter(Boolean)
  const compsText = compLabels.length > 1
    ? compLabels.slice(0, -1).join(', ') + ' e ' + compLabels.at(-1)
    : compLabels[0] || 'competências-chave'

  const firstNames = nome ? nome.split(' ')[0] : 'A profissional'
  return `${firstNames} registrou ${total} entrada${total !== 1 ? 's' : ''} no período de ${periodoLabel}${metricCount > 0 ? `, com ${metricCount} resultado${metricCount !== 1 ? 's' : ''} quantificável${metricCount !== 1 ? 'is' : ''}` : ''}. Este dossiê organiza os destaques em torno de ${compsText}, construindo o caso para ${goalLabel[objetivo] || objetivo || 'o próximo passo na carreira'}.`
}

function buildProximosPassos(entries, nome) {
  const aprendizados = entries.filter(e => e.category === 'aprendizado')
  const firstName = nome ? nome.split(' ')[0] : 'A profissional'
  if (aprendizados.length > 0) {
    const latest = aprendizados[0]
    return `Com base nos aprendizados registrados — especialmente "${latest.title}" — o próximo ciclo aponta para expansão de ownership e aplicação direta das competências desenvolvidas em contextos de maior impacto.`
  }
  return `Com base nos registros do período e na consistência das entregas documentadas, o próximo ciclo aponta para expansão de ownership em decisões estratégicas — área onde a experiência acumulada é diretamente transferível.`
}

function generateDossie(entries, profile, config) {
  const { period, customStart, customEnd, objetivo, objCustom, selectedComps } = config
  const periodoLabel = formatPeriodLabel(period, customStart, customEnd)
  const filtered = filterEntriesByPeriod(entries, period, customStart, customEnd)

  const nome = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Profissional'
    : 'Profissional'

  const selCompIds = Object.entries(selectedComps).filter(([,v]) => v).map(([k]) => k)

  const competencias = selCompIds.map(compId => {
    const compEntries = getEntriesForComp(filtered, compId)
    const compDef = COMP_OPTIONS.find(c => c.id === compId)
    return {
      id: compId,
      titulo: compDef?.label || compId,
      registros: compEntries.length,
      bullets: compEntries.slice(0, 4).map(buildBullet),
    }
  }).filter(c => c.registros > 0)

  const metricas = extractTopMetrics(filtered)
  const resumo = buildSummary(filtered, nome, periodoLabel, objetivo, selCompIds)
  const proximosPassos = buildProximosPassos(filtered, nome)

  const goalLabel = { promocao: 'promoção', troca: 'transição de área', emprego: 'novo emprego', outro: objCustom || 'objetivo' }

  return {
    nome,
    cargo: profile?.current_role || 'Cargo atual',
    objetivo: goalLabel[objetivo] || objetivo,
    periodo: periodoLabel,
    resumo,
    metricas,
    competencias,
    proximosPassos,
    totalEntradas: filtered.length,
    excluidas: entries.length - filtered.length,
  }
}

// ── Hub ──────────────────────────────────────────────────────
function ExportHub({ entryCount, onStart, onHistory }) {
  const isEmpty = entryCount === 0

  const cards = [
    {
      id: 'dossie',
      icon: <IconFileText />,
      badge: 'Destaque',
      titulo: 'dossiê de promoção',
      desc: 'Um documento pronto para levar ao 1:1 de promoção, com métricas em destaque e impacto organizado por competência.',
      meta: `~2 min · baseado em ${entryCount} entrada${entryCount !== 1 ? 's' : ''}`,
      active: !isEmpty,
    },
    {
      id: 'linkedin',
      icon: <IconLinkedin />,
      titulo: 'post de LinkedIn',
      desc: 'Um post profissional baseado nas suas últimas conquistas. Direto, sem autoelogio.',
      meta: '~1 min · baseado nas últimas 3 entradas',
      active: false,
      coming: true,
    },
    {
      id: 'curriculo',
      icon: <IconList />,
      titulo: 'bullets de currículo',
      desc: 'Transforme suas conquistas no formato XYZ, prontos para o currículo.',
      coming: true,
    },
    {
      id: 'star',
      icon: <IconStar />,
      titulo: 'respostas STAR',
      desc: 'Respostas completas para perguntas comportamentais de entrevista.',
      coming: true,
    },
  ]

  return (
    <div className="export-hub">
      <div className="hub-eyebrow">exportar</div>
      <h1 className="hub-title">o que você quer gerar?</h1>
      <p className="hub-subtitle">suas conquistas viram dossiê, post e currículo — prontos para usar.</p>

      {isEmpty ? (
        <div className="hub-empty">
          <p>antes de exportar, registre sua primeira conquista.</p>
        </div>
      ) : (
        <>
          <div className="hub-grid">
            {cards.map(card => (
              <div
                key={card.id}
                className={[
                  'hub-card',
                  card.coming   ? 'hub-card-coming'   : '',
                  card.disabled ? 'hub-card-disabled' : '',
                  card.active   ? 'hub-card-active'   : '',
                ].join(' ')}
                onClick={card.active && !card.disabled ? () => onStart(card.id) : undefined}
                title={card.disabled ? card.disabledTip : undefined}
              >
                <div className="hub-card-top">
                  <div className="hub-card-icon">{card.icon}</div>
                  {card.badge  && <span className="hub-badge">{card.badge}</span>}
                  {card.coming && <span className="hub-badge hub-badge-muted">em breve</span>}
                </div>
                <div className="hub-card-titulo">{card.titulo}</div>
                <div className="hub-card-desc">{card.desc}</div>
                {(card.meta || card.coming) && (
                  <div className="hub-card-meta">
                    {!card.coming && <IconClock />}
                    {card.meta || 'em breve'}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="hub-history-link" onClick={onHistory}>
            <IconHistory /> ver dossiês anteriores
          </button>
        </>
      )}
    </div>
  )
}

// ── Wizard ───────────────────────────────────────────────────
function WizardScreen({ step, entries, onNext, onBack }) {
  const [period, setPeriod]         = useState('6m')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd]   = useState('')
  const [objetivo, setObjetivo]     = useState('promocao')
  const [objCustom, setObjCustom]   = useState('')
  const [selectedComps, setSelectedComps] = useState({ lideranca: true, estrategia: true, impacto: true, execucao: false, colaboracao: false })

  const selCount = Object.values(selectedComps).filter(Boolean).length

  const compCounts = COMP_OPTIONS.reduce((acc, c) => {
    const filtered = filterEntriesByPeriod(entries, period, customStart, customEnd)
    acc[c.id] = getEntriesForComp(filtered, c.id).length
    return acc
  }, {})

  function toggleComp(id) {
    setSelectedComps(prev => {
      const on = prev[id]
      if (!on && selCount >= 5) return prev
      return { ...prev, [id]: !on }
    })
  }

  function handleNext() {
    onNext({ period, customStart, customEnd, objetivo, objCustom, selectedComps })
  }

  return (
    <div className="wizard-wrap">
      <div className="wizard-progress">
        {[1, 2, 3].map(n => (
          <span key={n} style={{ display: 'contents' }}>
            <div className={`wizard-dot ${n === step ? 'active' : ''} ${n < step ? 'done' : ''}`}>
              {n < step ? <IconCheck /> : n}
            </div>
            {n < 3 && <div className={`wizard-line ${n < step ? 'done' : ''}`} />}
          </span>
        ))}
      </div>

      {step === 1 && (
        <div>
          <div className="wizard-step-num">passo 1 de 3</div>
          <h2 className="wizard-question">qual período entrar no dossiê?</h2>
          <div className="wizard-pills">
            {[
              { id: '3m',     label: 'últimos 3 meses' },
              { id: '6m',     label: 'últimos 6 meses' },
              { id: '12m',    label: 'últimos 12 meses' },
              { id: 'custom', label: 'personalizado' },
            ].map(p => (
              <button key={p.id} className={`wizard-pill ${period === p.id ? 'active' : ''}`} onClick={() => setPeriod(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
          {period === 'custom' && (
            <div className="wizard-date-range">
              <input type="date" className="wizard-date-input" value={customStart} onChange={e => setCustomStart(e.target.value)} />
              <span className="wizard-date-sep">até</span>
              <input type="date" className="wizard-date-input" value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="wizard-step-num">passo 2 de 3</div>
          <h2 className="wizard-question">qual o seu objetivo?</h2>
          <div className="wizard-pills">
            {[
              { id: 'promocao', label: 'promoção de cargo' },
              { id: 'troca',    label: 'troca de área' },
              { id: 'emprego',  label: 'novo emprego' },
              { id: 'outro',    label: 'outro' },
            ].map(o => (
              <button key={o.id} className={`wizard-pill ${objetivo === o.id ? 'active' : ''}`} onClick={() => setObjetivo(o.id)}>
                {o.label}
              </button>
            ))}
          </div>
          {objetivo === 'outro' && (
            <input
              type="text"
              className="wizard-text-input"
              placeholder="descreva em uma frase..."
              value={objCustom}
              onChange={e => setObjCustom(e.target.value)}
            />
          )}
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="wizard-step-num">passo 3 de 3</div>
          <h2 className="wizard-question">quais competências destacar?</h2>
          <p className="wizard-sub">sugestões baseadas nas suas entradas. selecione até 5.</p>
          <div className="wizard-comps">
            {COMP_OPTIONS.map(c => {
              const on  = selectedComps[c.id]
              const dis = !on && selCount >= 5
              const count = compCounts[c.id] || 0
              return (
                <button
                  key={c.id}
                  className={`comp-item ${on ? 'active' : ''} ${dis ? 'comp-disabled' : ''}`}
                  onClick={() => !dis && toggleComp(c.id)}
                  disabled={dis}
                >
                  <div className="comp-check">{on && <IconCheck />}</div>
                  <span className="comp-label">{c.label}</span>
                  <span className="comp-count">{count} registro{count !== 1 ? 's' : ''}</span>
                </button>
              )
            })}
          </div>
          <div className="comp-note">{selCount} de 5 selecionadas</div>
        </div>
      )}

      <div className="wizard-nav">
        <button className="btn btn-ghost" onClick={onBack}>
          {step === 1
            ? 'cancelar'
            : <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconArrowLeft /> voltar</span>
          }
        </button>
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={step === 1 && period === 'custom' && (!customStart || !customEnd)}
        >
          {step < 3 ? 'continuar' : 'gerar dossiê'}
        </button>
      </div>
    </div>
  )
}

// ── Loading ──────────────────────────────────────────────────
function LoadingScreen({ onSkip }) {
  const [idx, setIdx] = useState(0)
  const [pct, setPct] = useState(8)

  useEffect(() => {
    const t = setInterval(() => {
      setIdx(i => Math.min(i + 1, LOADING_MSGS.length - 1))
      setPct(p => Math.min(p + 18, 92))
    }, 1600)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="export-loading-screen">
      <div className="export-loading-inner">
        <div className="export-loading-spinner" />
        <div className="export-loading-msg">{LOADING_MSGS[idx]}</div>
        <div className="export-loading-bar-wrap">
          <div className="export-loading-bar" style={{ width: `${pct}%` }} />
        </div>
        <button
          className="btn btn-ghost"
          style={{ marginTop: 24, fontSize: '0.8125rem' }}
          onClick={onSkip}
        >
          ver resultado agora
        </button>
      </div>
    </div>
  )
}

// ── Preview ──────────────────────────────────────────────────
function PreviewScreen({ dossie, onBack, onSave }) {
  const [hovered, setHovered]     = useState(null)
  const [editing, setEditing]     = useState(null)
  const [editValues, setEditValues] = useState({})
  const [linkCopied, setLinkCopied] = useState(false)
  const [exported, setExported]   = useState(false)

  function getValue(id, fallback) {
    return editValues[id] !== undefined ? editValues[id] : fallback
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  function handlePrint() {
    window.print()
    setExported(true)
    onSave?.()
  }

  function EditablePara({ id, text, className, style }) {
    if (editing === id) {
      return (
        <textarea
          className={className}
          autoFocus
          defaultValue={getValue(id, text)}
          onBlur={e => { setEditValues(v => ({ ...v, [id]: e.target.value })); setEditing(null) }}
          style={{
            ...style, width: '100%', background: 'transparent',
            border: '1.5px dashed var(--red)', borderRadius: 4, padding: '4px 6px',
            fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit',
            color: 'inherit', resize: 'vertical', outline: 'none',
          }}
        />
      )
    }
    return (
      <p
        className={`editable-text ${className || ''}`}
        style={style}
        onClick={() => setEditing(id)}
        title="clique para editar"
      >
        {getValue(id, text)}
      </p>
    )
  }

  function EditableLi({ id, text }) {
    if (editing === id) {
      return (
        <li>
          <textarea
            autoFocus
            defaultValue={getValue(id, text)}
            onBlur={e => { setEditValues(v => ({ ...v, [id]: e.target.value })); setEditing(null) }}
            style={{
              width: '100%', background: 'transparent',
              border: '1.5px dashed var(--red)', borderRadius: 4, padding: '4px 6px',
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', lineHeight: 1.6,
              color: 'var(--text)', resize: 'vertical', outline: 'none',
            }}
          />
        </li>
      )
    }
    return (
      <li className="editable-text" onClick={() => setEditing(id)} title="clique para editar">
        {getValue(id, text)}
      </li>
    )
  }

  return (
    <div className="preview-layout">
      {/* Document */}
      <div className="preview-doc-wrap" id="print-area">
        <div className="preview-doc">
          {/* Cover */}
          <div className="doc-capa">
            <div className="doc-nome">{dossie.nome}</div>
            <div className="doc-subtitulo">dossiê de progresso · {dossie.periodo}</div>
            <div className="doc-tagline">{dossie.nome} · candidatura a {dossie.objetivo}</div>
            <div className="doc-linha" />
          </div>

          {/* Summary */}
          <div className="doc-section" onMouseEnter={() => setHovered('resumo')} onMouseLeave={() => setHovered(null)}>
            <div className="doc-sec-header">
              <h2 className="doc-h2">resumo executivo</h2>
              <button className={`regen-btn ${hovered === 'resumo' ? 'visible' : ''}`} disabled>
                <IconRefresh /> regenerar
              </button>
            </div>
            <EditablePara id="resumo" text={dossie.resumo} className="doc-body" />
          </div>

          {/* Metrics */}
          {dossie.metricas.length > 0 && (
            <div className="doc-section doc-section-metrics">
              {dossie.metricas.map((m, i) => (
                <div key={i} className="doc-metric-tile">
                  <div className="doc-metric-valor">{m.valor}</div>
                  <div className="doc-metric-label">{m.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Competencies */}
          {dossie.competencias.length > 0 && (
            <div className="doc-section">
              <h2 className="doc-h2" style={{ marginBottom: 24 }}>impacto por competência</h2>
              {dossie.competencias.map(c => (
                <div key={c.id} className="doc-comp" onMouseEnter={() => setHovered(c.id)} onMouseLeave={() => setHovered(null)}>
                  <div className="doc-sec-header">
                    <h3 className="doc-h3">
                      {c.titulo} <span className="doc-h3-count">({c.registros} registro{c.registros !== 1 ? 's' : ''})</span>
                    </h3>
                    <button className={`regen-btn ${hovered === c.id ? 'visible' : ''}`} disabled>
                      <IconRefresh /> regenerar
                    </button>
                  </div>
                  {c.bullets.length > 0 ? (
                    <ul className="doc-bullets">
                      {c.bullets.map((b, bi) => (
                        <EditableLi key={bi} id={`${c.id}-${bi}`} text={b} />
                      ))}
                    </ul>
                  ) : (
                    <p className="doc-body" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Nenhuma entrada desta competência no período selecionado.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Next steps */}
          <div className="doc-section" onMouseEnter={() => setHovered('proximos')} onMouseLeave={() => setHovered(null)}>
            <div className="doc-sec-header">
              <h2 className="doc-h2">o que vem a seguir</h2>
              <button className={`regen-btn ${hovered === 'proximos' ? 'visible' : ''}`} disabled>
                <IconRefresh /> regenerar
              </button>
            </div>
            <EditablePara id="proximos" text={dossie.proximosPassos} className="doc-body" />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="preview-sidebar">
        <button className="sidebar-back-btn" onClick={onBack}>
          <IconArrowLeft /> voltar
        </button>

        {exported ? (
          <div className="sidebar-block sidebar-success">
            <div className="sidebar-success-label">Pronto. Boa conversa.</div>
            <button className="btn btn-ghost sidebar-full-btn" onClick={copyLink}>
              <IconLink /> {linkCopied ? 'link copiado.' : 'copiar link'}
            </button>
            <button className="btn btn-ghost sidebar-full-btn" onClick={onBack}>
              voltar ao arquivo
            </button>
          </div>
        ) : (
          <>
            <div className="sidebar-block">
              <div className="sidebar-block-label">exportar</div>
              <button className="btn btn-primary sidebar-full-btn" onClick={handlePrint}>
                <IconPrint /> imprimir / salvar PDF
              </button>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  className="btn btn-ghost"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.8125rem' }}
                  onClick={copyLink}
                >
                  <IconLink /> {linkCopied ? 'copiado.' : 'copiar link'}
                </button>
              </div>
            </div>

            <div className="sidebar-block">
              <div className="sidebar-block-label">detalhes</div>
              <div className="sidebar-row"><span>período</span><span>{dossie.periodo}</span></div>
              <div className="sidebar-row"><span>entradas usadas</span><span>{dossie.totalEntradas}</span></div>
              <div className="sidebar-row"><span>competências</span><span>{dossie.competencias.length}</span></div>
              <div className="sidebar-row"><span>objetivo</span><span>{dossie.objetivo}</span></div>
            </div>

            {dossie.excluidas > 0 && (
              <div className="sidebar-block sidebar-warning">
                <div className="sidebar-warning-title">{dossie.excluidas} entrada{dossie.excluidas !== 1 ? 's' : ''} não entrou{dossie.excluidas !== 1 ? 'ram' : ''}</div>
                <p className="sidebar-warning-text">período fora da janela selecionada.</p>
              </div>
            )}

            <div className="sidebar-block">
              <div className="sidebar-block-label">edição</div>
              <p className="sidebar-hint">clique em qualquer texto do documento para editar. passe o mouse sobre uma seção para ver opções.</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── History ──────────────────────────────────────────────────
function HistoryScreen({ onBack, onOpen }) {
  const [items] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
  })

  return (
    <div className="export-hub">
      <button className="sidebar-back-btn" style={{ marginBottom: 20 }} onClick={onBack}>
        <IconArrowLeft /> voltar
      </button>
      <h2 className="hub-title" style={{ marginBottom: 4 }}>dossiês anteriores</h2>
      <p className="hub-subtitle" style={{ marginBottom: 28 }}>
        compare progressos ou gere uma nova versão a partir de um rascunho.
      </p>

      {items.length === 0 ? (
        <div className="hub-empty">
          <p>nenhum dossiê gerado ainda.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[...items].reverse().map(item => (
            <div key={item.id} className="history-item">
              <div className="history-thumb" />
              <div className="history-info">
                <div className="history-titulo">{item.titulo}</div>
                <div className="history-meta">{item.periodo}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span className={`history-status ${item.status}`}>{item.status}</span>
                  <span className="history-meta">{item.data}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  className="btn btn-ghost"
                  style={{ fontSize: '0.8125rem', padding: '6px 14px' }}
                  onClick={() => onOpen(item.content)}
                >
                  abrir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Root ─────────────────────────────────────────────────────
export default function ExportPage() {
  const navigate = useNavigate()
  const { entries, loading: entriesLoading } = useEntries()
  const { profile } = useProfile()

  const [screen, setScreen]   = useState('hub')
  const [step,   setStep]     = useState(1)
  const [config, setConfig]   = useState(null)
  const [dossie, setDossie]   = useState(null)

  const saveDossieToHistory = useCallback((d, cfg) => {
    const item = {
      id: Date.now(),
      titulo: `${d.objetivo} — ${d.nome}`,
      periodo: d.periodo,
      status: 'exportado',
      data: new Date().toLocaleDateString('pt-BR'),
      config: cfg,
      content: d,
    }
    try {
      const existing = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
      localStorage.setItem(HISTORY_KEY, JSON.stringify([...existing, item]))
    } catch { /* noop */ }
  }, [])

  function goHub()    { setScreen('hub'); setStep(1) }
  function goPreview(d) { setDossie(d); setScreen('preview') }

  function handleWizardNext(cfg) {
    if (step < 3) {
      setConfig(prev => ({ ...prev, ...cfg }))
      setStep(s => s + 1)
    } else {
      const finalConfig = { ...config, ...cfg }
      setConfig(finalConfig)
      setScreen('loading')
      setTimeout(() => {
        const generated = generateDossie(entries, profile, finalConfig)
        goPreview(generated)
      }, 8000)
    }
  }

  function handleWizardBack() {
    if (step === 1) goHub()
    else setStep(s => s - 1)
  }

  if (entriesLoading) {
    return <div className="loading-screen"><div className="loading-spinner" /></div>
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner" style={{ maxWidth: screen === 'preview' ? 'none' : undefined }}>
          <div className="header-brand">
            <h1 className="wordmark">
              <span className="wordmark-brag">brag</span> <span className="wordmark-book">book</span>
            </h1>
          </div>
          <nav className="export-header-nav">
            <button className="export-nav-btn" onClick={() => navigate('/')}>arquivo</button>
            <button className="export-nav-btn active">exportar</button>
          </nav>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => navigate('/')} style={{ fontSize: '0.8125rem' }}>
              + nova entrada
            </button>
          </div>
        </div>
      </header>

      <main className="main" style={screen === 'preview' ? { maxWidth: 'none', padding: 0 } : {}}>
        {screen === 'hub' && (
          <ExportHub
            entryCount={entries.length}
            onStart={id => { if (id === 'dossie') { setStep(1); setScreen('wizard') } }}
            onHistory={() => setScreen('history')}
          />
        )}
        {screen === 'wizard' && (
          <WizardScreen
            step={step}
            entries={entries}
            onNext={handleWizardNext}
            onBack={handleWizardBack}
          />
        )}
        {screen === 'loading' && (
          <LoadingScreen
            onSkip={() => {
              const generated = generateDossie(entries, profile, config)
              goPreview(generated)
            }}
          />
        )}
        {screen === 'preview' && dossie && (
          <PreviewScreen
            dossie={dossie}
            onBack={goHub}
            onSave={() => saveDossieToHistory(dossie, config)}
          />
        )}
        {screen === 'history' && (
          <HistoryScreen
            onBack={goHub}
            onOpen={d => { setDossie(d); setScreen('preview') }}
          />
        )}
      </main>
    </div>
  )
}
