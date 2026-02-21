# Sanbad

**Sanbad** (Wednesday Badminton Group) is a monorepo app with a Next.js frontend, Go (Gin) API, and Supabase for auth and data.

## Stack

| Layer      | Tech |
|-----------|------|
| Frontend  | Next.js 16, React 19, next-intl, Tailwind CSS, TanStack Query |
| Backend   | Go, Gin, JWT auth via Supabase |
| Auth/DB   | Supabase (local dev with CLI) |
| Tooling   | Turborepo, Taskfile, Playwright (e2e) |

## Repo structure

```
sanbad/
├── apps/
│   ├── web/          # Next.js app (port 1412)
│   └── server/       # Go API (port 8080)
├── supabase/         # Local Supabase (migrations, config, seed)
├── package.json      # Root workspace
├── turbo.json
└── Taskfile.yml      # Dev / DB tasks
```

## Prerequisites

- Node.js 18+
- Go 1.21+
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for local DB)
- [Task](https://taskfile.dev/) (optional, for `task` commands)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

Create env files from placeholders (do not commit real values).

**`apps/server/.env`**

- `SUPABASE_JWT_SECRET` – from `supabase start` output (JWT secret)
- Optional: other server env vars

**`apps/web/.env.local`**

- `NEXT_PUBLIC_SUPABASE_URL` – Supabase project URL (e.g. `http://127.0.0.1:54321` for local)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon key (from `supabase start`)
- `NEXT_PUBLIC_API_URL` – API base URL (e.g. `http://localhost:8080`)

### 3. Start local Supabase

```bash
supabase start
```

Use the printed URLs and anon key in `apps/web/.env.local`. Copy the JWT secret into `apps/server/.env` as `SUPABASE_JWT_SECRET`.

### 4. Run the app

**Option A – Task (recommended)**

```bash
task db-start   # once, then:
task dev        # runs web + api
```

**Option B – Manual**

```bash
# Terminal 1 – API
cd apps/server && air

# Terminal 2 – Web
npx turbo dev
```

- Web: http://localhost:1412  
- API: http://localhost:8080 (e.g. `GET /ping`, `GET /api/v1/me` with auth)

## Tasks (Taskfile)

| Task       | Description                |
|-----------|----------------------------|
| `task dev`      | Start Next.js + Go API (Turbo + Air) |
| `task web`      | Start Next.js only         |
| `task api`      | Start Go API with Air      |
| `task db-start` | Start local Supabase       |
| `task db-stop`  | Stop local Supabase        |
| `task db-reset` | Reset DB and run seed      |

## Testing

```bash
cd apps/web
npm run test:e2e
```

Uses Playwright; config in `apps/web/playwright.config.ts`.

## Security (public repo)

- **Never commit** `.env`, `.env.local`, `.env.production`, or any file with real secrets.
- Root and app `.gitignore` entries include:
  - `.env`, `.env.*` (with optional `!.env.example` for safe examples)
  - `.cursor/`, `.kiro/`, `.turbo/`, `test-results/`, `playwright-report/`
- Use `.env.example` (or docs) to list required variable names only; keep values local or in a secrets manager.

## License

Private / unlicensed unless stated otherwise.
