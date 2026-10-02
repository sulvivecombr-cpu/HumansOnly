# Base44 Development Notes

## Quick start

```bash
docker compose -f docker-compose.base44.yml up -d
```

- Web entry point: host port 3000 (Next.js 14 dev server, live reload via bind mount of `app/`).
- Health endpoint: `/api/health`.
- DB: PostgreSQL 16 (`db` service), credentials wired via compose; 24 Prisma migrations run automatically on container start (`cd src && npx prisma migrate deploy` — the schema lives at `app/src/prisma/schema.prisma`, NOT at the app root).

## Repository layout quirks

- The Next.js app lives in the `app/` subdirectory, not the repo root.
- `npm install` postinstall runs `cd src && npx prisma generate` — run npm scripts from `app/`.
- `predev` regenerates `app/src/version.ts` and `app/version` from `app/package.json` version.
- Env defaults for local dev are in `.env.base44-defaults` (repo-level, git-tracked placeholders); real secrets are delivered to `/run/base44/app.env` which overrides them (compose `env_file` order).

## Clerk auth (external, required for full functionality)

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` come from https://dashboard.clerk.com.
- Without real keys, a format-valid placeholder (`pk_test_` + base64 of `frontendApi$`, see `.env.base44-defaults`) lets the app boot and render in signed-out mode. ClerkJS logs an initialization error against the fake domain — expected; the landing page still renders fully.
- The repo has its own convention for Clerk-less boot: `SKIP_CLERK_CI_BUILD=1` (used by its CI). `app/src/proxy.ts` was extended to honor it: with the flag set, the middleware bypasses `clerkMiddleware` entirely. Do not remove this when refactoring the middleware.
- Auth-gated inner pages (`/home`, `/explore`, etc. in the `(twitter)` route group) require a signed-in Clerk session; they show loading states without one.

## Storage / other integrations

- Uploads default to local mode (`UPLOAD_STORAGE_PROVIDER=local`, files under `app/public/uploads/`) — Supabase is optional.
- Human challenge (Turnstile) runs in dry-run mode by default (`HUMAN_DRY_RUN=true`).
- `NEXT_PUBLIC_HOST_URL` must match the public preview origin; it is set in compose from `BASE44_PUBLIC_HOST_SUFFIX` and also feeds `allowedDevOrigins` in `app/next.config.js`.

## Verify it works

```bash
curl http://localhost:3000/api/health   # {"success":true,"status":"ok",...}
curl -I http://localhost:3000/           # 200
```
