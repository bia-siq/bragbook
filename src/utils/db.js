import { get, set, del, keys } from 'idb-keyval'

const ENTRIES_PREFIX = 'entry:'

export async function saveEntry(entry) {
  await set(`${ENTRIES_PREFIX}${entry.id}`, entry)
}

export async function deleteEntry(id) {
  await del(`${ENTRIES_PREFIX}${id}`)
}

export async function getAllEntries() {
  const allKeys = await keys()
  const entryKeys = allKeys.filter(k => typeof k === 'string' && k.startsWith(ENTRIES_PREFIX))
  const entries = await Promise.all(entryKeys.map(k => get(k)))
  return entries.filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
