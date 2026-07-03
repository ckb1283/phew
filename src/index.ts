import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('phew — you found the right kit 🩹'))

app.get('/health', (c) => c.json({ status: 'ok' }))

// Railway injects PORT; 3000 is the local-dev fallback
const port = Number(process.env.PORT ?? 3000)

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`phew listening on http://localhost:${info.port}`)
})
