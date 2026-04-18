export function exportToMarkdown(entries) {
  const byMonth = {}
  entries.forEach(entry => {
    const d = new Date(entry.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    if (!byMonth[key]) byMonth[key] = { label, items: [] }
    byMonth[key].items.push(entry)
  })

  const sorted = Object.keys(byMonth).sort((a, b) => b.localeCompare(a))
  const lines = ['# Brag Book\n']

  sorted.forEach(key => {
    const { label, items } = byMonth[key]
    lines.push(`## ${label.charAt(0).toUpperCase() + label.slice(1)}\n`)
    items.forEach(e => {
      lines.push(`### ${e.title}`)
      lines.push(`**Categoria:** ${e.category}  `)
      lines.push(`**Data:** ${new Date(e.date).toLocaleDateString('pt-BR')}\n`)
      if (e.situation) lines.push(`**Situação:** ${e.situation}\n`)
      if (e.task) lines.push(`**Tarefa:** ${e.task}\n`)
      if (e.action) lines.push(`**Ação:** ${e.action}\n`)
      if (e.result) lines.push(`**Resultado:** ${e.result}\n`)
      if (e.metric) lines.push(`**Resultado quantificável:** ${e.metric}\n`)
      if (e.tags?.length) lines.push(`**Tags:** ${e.tags.join(', ')}\n`)
      lines.push('---\n')
    })
  })

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bragbook-${new Date().toISOString().slice(0, 10)}.md`
  a.click()
  URL.revokeObjectURL(url)
}
