export const CATEGORIES = [
  { id: 'conquista', label: 'Conquista', color: '#D63830', emoji: '🏆' },
  { id: 'projeto', label: 'Projeto', color: '#5C6B4F', emoji: '🚀' },
  { id: 'feedback', label: 'Feedback', color: '#7A2E3A', emoji: '💬' },
  { id: 'metrica', label: 'Métrica', color: '#8B6F4E', emoji: '📊' },
  { id: 'aprendizado', label: 'Aprendizado', color: '#C27547', emoji: '✨' },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]))
