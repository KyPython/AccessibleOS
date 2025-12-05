# AccessibleOS - Backend (development notes)

This README documents a few development and test flags used by the backend.

Environment flags

- `NODE_ENV` - standard Node environment. The demo auto-seeding is disabled when `NODE_ENV=production` unless `ENABLE_DEMO_SEED` is explicitly set.
- `AUTH_STUB` - when `true` the backend uses a stubbed auth flow for local development (e.g., `Authorization: Bearer demo-...`).
- `USE_IN_MEMORY_DB` - when `true` the backend will use in-memory stores for tasks instead of Postgres (convenient for quick UI dev).
- `ENABLE_DEMO_SEED` - when `true` forces demo seeding even in production-like environments. Use with caution.

Demo seeding behavior

- When a new user is created through the dev auth stub and their `firebaseUid` starts with `demo`, the backend will populate the database with two demo categories, two demo tasks, default accessibility settings, and initial game progress.
- Demo seeding will only run when either `NODE_ENV !== 'production'` or when `ENABLE_DEMO_SEED=true`.

Resetting Postgres migrations

If you need to re-run migrations (the compose setup executes migrations on DB init), remove the postgres volume and restart:

```sh
# from repo root
docker compose down --volumes
docker compose up -d postgres
# wait for postgres to initialize and run migrations, then start backend
docker compose up -d backend
```

Running tests

- Backend tests are run with `pnpm --filter ./packages/backend test` from the monorepo root (or `pnpm -w test` to run all package tests).

CI

- A small CI workflow (typecheck + backend tests + quick smoke test) is added under `.github/workflows/ci.yml`.

Contact

If you want the demo seeding behavior changed (e.g., only on explicit environment variables), open a PR or request me to update the guard logic.
