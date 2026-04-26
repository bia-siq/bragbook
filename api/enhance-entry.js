export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { text } = req.body || {}
  if (!text?.trim()) return res.status(400).json({ error: 'text required' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  const prompt = `Você é um assistente que ajuda profissionais brasileiros a documentar conquistas profissionais.

O usuário escreveu o seguinte texto descrevendo uma conquista:

"${text}"

Reescreva esse texto como um parágrafo fluente em português, cobrindo os quatro elementos STAR de forma natural e integrada:
- Situação: qual era o contexto ou desafio
- Tarefa: qual era a responsabilidade do profissional
- Ação: o que a pessoa fez especificamente
- Resultado: qual foi o impacto

O texto deve soar como escrito pela própria pessoa — direto, concreto, sem exagero. Máximo 4 frases.

Retorne APENAS um JSON válido no formato:
{
  "titulo": "título curto e direto (máx 60 chars, minúsculo, sem ponto final)",
  "texto": "o parágrafo reescrito cobrindo STAR de forma fluente",
  "impacto": "resultado quantificado se houver no texto original (ex: '30% de redução no tempo de ciclo'), string vazia se não houver",
  "categoria": "uma de: conquista, projeto, feedback, metrica, aprendizado"
}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return res.status(502).json({ error: 'upstream error', detail: err })
    }

    const data = await response.json()
    const raw = data.content?.[0]?.text || ''

    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return res.status(502).json({ error: 'invalid AI response' })

    const parsed = JSON.parse(jsonMatch[0])
    return res.status(200).json(parsed)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
