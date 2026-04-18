import { useState, useEffect, useCallback } from 'react'
import { getAllEntries, saveEntry, deleteEntry, generateId } from '../utils/db'

export function useEntries() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllEntries().then(data => {
      setEntries(data)
      setLoading(false)
    })
  }, [])

  const addEntry = useCallback(async (entryData) => {
    const entry = { ...entryData, id: generateId(), createdAt: new Date().toISOString() }
    await saveEntry(entry)
    setEntries(prev => [entry, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)))
    return entry
  }, [])

  const updateEntry = useCallback(async (id, entryData) => {
    const updated = { ...entryData, id, updatedAt: new Date().toISOString() }
    await saveEntry(updated)
    setEntries(prev => prev.map(e => e.id === id ? updated : e).sort((a, b) => new Date(b.date) - new Date(a.date)))
    return updated
  }, [])

  const removeEntry = useCallback(async (id) => {
    await deleteEntry(id)
    setEntries(prev => prev.filter(e => e.id !== id))
  }, [])

  return { entries, loading, addEntry, updateEntry, removeEntry }
}
