# phew

Tailored med-kit shopping lists for your specific adventure. Answer a few questions about
your trip — activity, duration, group, how far from help you'll be — and get a kit list
built from published wilderness-medicine guidance instead of a generic store-bought box.

**phewbag.com** · Not medical advice — a checklist to review, and a starting point for
your own judgment and training.

## Stack

- **API:** TypeScript + [Hono](https://hono.dev) running on Node
- **Database:** Postgres (managed on Railway)
- **Hosting:** Railway, fronted by Cloudflare
- **Frontend:** React SPA (coming) + server-rendered share pages

## Develop

```sh
npm install
npm run dev        # tsx watch — restarts on save
curl localhost:3000/health
```

## Deploy

Push to `main` → Railway builds and deploys automatically.

## Conventions

- Secrets live in environment variables, never in git. Copy `.env.example` → `.env` for
  local values; production values are set in the Railway dashboard.
- The rules engine is deterministic data + code — no LLM at request time.
