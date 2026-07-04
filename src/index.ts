import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { buildKit } from './engine.js'
import { parseWizardAnswers } from './validate.js'

const app = new Hono()

app.get('/', (c) => c.text('phew — the right kit for your trip 🩹 (deployed by git push)'))

app.get('/health', (c) => c.json({ status: 'ok', version: '0.0.3' }))

// The engine over HTTP: wizard answers in, kit out. Deterministic and
// stateless — no database until lists become shareable.
app.post('/api/kit', async (c) => {
  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'request body must be valid JSON' }, 400)
  }
  const parsed = parseWizardAnswers(body)
  if (!parsed.ok) {
    return c.json({ error: 'invalid wizard answers', details: parsed.errors }, 400)
  }
  return c.json(buildKit(parsed.answers))
})

// Railway injects PORT; 3000 is the local-dev fallback
const port = Number(process.env.PORT ?? 3000)

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`phew listening on http://localhost:${info.port}`)
})
