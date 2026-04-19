import { supabase } from '../lib/supabase'

function toApp(row) {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    category: row.category,
    description: row.description || '',
    metric: row.metric || '',
    tags: row.tags || [],
    images: row.images || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getAllEntries() {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .order('date', { ascending: false })
  if (error) throw error
  return (data || []).map(toApp)
}

export async function saveEntry(entry) {
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('entries').upsert({
    id: entry.id,
    user_id: user.id,
    title: entry.title,
    date: entry.date,
    category: entry.category,
    description: entry.description || '',
    metric: entry.metric || '',
    tags: entry.tags || [],
    images: entry.images || [],
    created_at: entry.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (error) throw error
}

export async function deleteEntry(id) {
  const { error } = await supabase.from('entries').delete().eq('id', id)
  if (error) throw error
}

export function generateId() {
  return crypto.randomUUID()
}
