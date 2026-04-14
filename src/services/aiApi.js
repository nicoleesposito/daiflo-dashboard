import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

const MODEL = 'gpt-4o-mini'

/**
 * Streams a concise summary of a note.
 * @yields {string} Text chunks as they arrive
 */
export async function* streamSummary(title, body) {
  const stream = await openai.chat.completions.create({
    model: MODEL,
    stream: true,
    messages: [
      {
        role: 'user',
        content:
          `Summarize the following note concisely in 2–4 sentences. Focus on the key points only.\n\n` +
          `Title: ${title || 'Untitled'}\n\nContent:\n${body}`,
      },
    ],
  })

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content ?? ''
    if (text) yield text
  }
}

/**
 * Extracts the single most important named topic from a note.
 * Returns null if no clear named topic exists.
 * @returns {Promise<string|null>}
 */
export async function extractTopic(title, body) {
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'user',
        content:
          `Identify the single most important named topic in this note — a specific person, place, ` +
          `technology, event, or concept that has a Wikipedia article. ` +
          `If the note is too personal, vague, or contains no clearly nameable topic, respond with exactly: null\n\n` +
          `Note title: ${title || 'Untitled'}\nNote content: ${body}\n\n` +
          `Respond with ONLY the topic name or null. No explanation, no punctuation.`,
      },
    ],
  })

  const text = response.choices[0].message.content.trim()
  if (!text || text.toLowerCase() === 'null') return null
  return text
}
