import { useState, useMemo } from 'react'
import { useEntries } from '../hooks/useEntries'
import Header from '../components/Header'
import StatsBar from '../components/StatsBar'
import Filters from '../components/Filters'
import EntryList from '../components/EntryList'
import EntryForm from '../components/EntryForm'
import Lightbox from '../components/Lightbox'
import ConfirmDialog from '../components/ConfirmDialog'

export default function MainPage() {
  const { entries, loading, addEntry, updateEntry, removeEntry } = useEntries()
  const [showForm, setShowForm] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [lightbox, setLightbox] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [period, setPeriod] = useState('all')

  const filtered = useMemo(() => {
    let result = entries
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(e =>
        e.title?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.metric?.toLowerCase().includes(q) ||
        e.tags?.some(t => t.toLowerCase().includes(q))
      )
    }
    if (category) result = result.filter(e => e.category === category)
    if (period !== 'all') {
      const cutoff = Date.now() - parseInt(period) * 24 * 60 * 60 * 1000
      result = result.filter(e => new Date(e.date) >= cutoff)
    }
    return result
  }, [entries, search, category, period])

  async function handleSave(data) {
    if (editEntry) await updateEntry(editEntry.id, data)
    else await addEntry(data)
    setShowForm(false)
    setEditEntry(null)
  }

  function handleEdit(entry) {
    setEditEntry(entry)
    setShowForm(true)
  }

  async function confirmDelete() {
    await removeEntry(deleteId)
    setDeleteId(null)
  }

  if (loading) {
    return <div className="loading-screen"><div className="loading-spinner" /></div>
  }

  return (
    <div className="app">
      <Header entries={entries} onNewEntry={() => { setEditEntry(null); setShowForm(true) }} />
      <main className="main">
        <StatsBar entries={entries} />
        <Filters
          search={search} setSearch={setSearch}
          category={category} setCategory={setCategory}
          period={period} setPeriod={setPeriod}
        />
        <EntryList
          entries={filtered}
          onEdit={handleEdit}
          onDelete={setDeleteId}
          onImageClick={(images, index) => setLightbox({ images, index })}
        />
      </main>

      {showForm && (
        <EntryForm
          entry={editEntry}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditEntry(null) }}
        />
      )}

      {deleteId && (
        <ConfirmDialog
          message="Tem certeza que deseja deletar esta entrada? Esta ação não pode ser desfeita."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNav={i => setLightbox(l => ({ ...l, index: i }))}
        />
      )}
    </div>
  )
}
