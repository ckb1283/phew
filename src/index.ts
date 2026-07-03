import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('phew — the right kit for your trip 🩹 (deployed by git push)'))

app.get('/health', (c) => c.json({ status: 'ok', version: '0.0.2' }))

// Railway injects PORT; 3000 is the local-dev fallback
const port = Number(process.env.PORT ?? 3000)

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`phew listening on http://localhost:${info.port}`)
})
