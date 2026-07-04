import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { buildKit } from './engine.js'
import { validateModel } from './model/integrity.js'
import { parseWizardAnswers } from './validate.js'

// Content typos fail the deploy, not the user's request. Railway keeps the
// previous release serving if the new one refuses to boot.
validateModel()

const app = new Hono()

app.get('/health', (c) => c.json({ status: 'ok', version: '0.1.0' }))

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

// --- The React app (built by `vite build` into dist/public) -----------------
// Order matters, and this arrangement can't shadow the API: registered routes
// above always win; serveStatic passes through on a miss.
// serveStatic resolves root against process.cwd() — every entry point
// (npm start, npm run dev) runs from the package root, so cwd is app/.

// 1) Hashed assets, fonts, index.html at /
app.use('/*', serveStatic({ root: './dist/public' }))

// 2) Unknown API paths 404 as JSON — never receive index.html
app.all('/api/*', (c) => c.json({ error: 'not found' }, 404))

// 3) SPA fallback: any remaining GET (e.g. a /build deep link or refresh)
//    gets the shell; React Router takes over client-side
app.get('*', serveStatic({ root: './dist/public', path: 'index.html' }))

// Railway injects PORT; 3000 is the local-dev fallback
const port = Number(process.env.PORT ?? 3000)

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`phew listening on http://localhost:${info.port}`)
})
