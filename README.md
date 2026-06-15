# Twikka

Twikka monorepo — one vertical project containing all of Twikka's deployments.

## Layout (standard Novansa product layout)

```
apps/
  mobile/     Flutter app (Convex via convex_flutter + Clerk) — includes ci-cd/ (fastlane)
  website/    Next.js marketing site  — folded in from novansa-apps 2026-06-15
  admin/      Next.js admin panel     — folded in from novansa-apps 2026-06-15
convex/       Convex backend (root, shared by all apps)
packages/     vendored shared code (@novansa/ui, config, auth, database, providers, …)
scripts/      Convex seed/data tooling (npx convex import)
docs/         product & migration docs
```

## Status

- **Mobile app**: already on Convex + Clerk.
- **Website + admin**: folded in but **still on Supabase** (`@novansa/auth`, `@novansa/database`).
  To be migrated to Convex/Clerk against the root `convex/` backend, then `supabase-twikka`
  decommissioned. Working now (both build); migration is the next dev task.
- **Mobile CI/CD**: moved into `apps/mobile/ci-cd/` — see
  [`docs/ci-cd-fastlane-migration.md`](docs/ci-cd-fastlane-migration.md). Verify before deploying.

## Develop

```bash
npm install
npm run packages:build      # build vendored packages' dist (runtime; .d.ts has a TS6 wart)
npm run website:dev         # or website:build
npm run admin:dev           # or admin:build
npm run convex:dev          # Convex backend (EU/Ireland deployment)
# mobile:
cd apps/mobile && flutter pub get && flutter run
```

## Known warts (tidy at novansa-kit extraction)

- Vendored `packages/*` `.d.ts` emit fails under TypeScript 6 (`baseUrl` deprecation,
  TS5101). Runtime `dist` builds fine and the web apps compile; types show as `any`.
  Fix by adding `"ignoreDeprecations": "6.0"` to each package tsconfig, or reconcile
  into `novansa-kit`.
- `packages/*` are vendored copies from `novansa-apps` — they exist in CalmerFlow too and
  will be unified into `novansa-kit` once all products are migrated.
