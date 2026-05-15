# Pre-Adjudication Integrity Protocol (PAIP)

A structured recovery-accountability web app for adult men navigating serious consequences before final legal resolution. Two roles: Participant and Clinician. Sober, professional, non-gamified design.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env for authenticated app use: `DATABASE_URL` — Postgres connection string. Replit Auth also requires Replit-provided OIDC environment such as `REPL_ID`. AI mentor feedback is optional at startup; set `AI_INTEGRATIONS_OPENAI_BASE_URL` and `AI_INTEGRATIONS_OPENAI_API_KEY` to enable generated feedback instead of the fallback message.


## Replit preview and deployment notes

- The default Replit Run button starts the integrated Express app on port 8080 after running the workspace build. The Express app serves both `/api/*` routes and the built Vite frontend from `artifacts/paip/dist/public`.
- The only externally exposed port is local port 8080 mapped to external port 80. This matches Replit Autoscale requirements and keeps the preview/deployment URL pointed at the same integrated app.
- `DATABASE_URL` is required for authenticated application flows. Provision the Replit Postgres module or set `DATABASE_URL` in Replit Secrets before expecting login, onboarding, check-ins, modules, or clinician screens to work. Missing AI integration secrets should no longer prevent the preview server from starting; weekly submissions will use the existing fallback feedback message until those secrets are set.
- After pulling from GitHub, if no preview appears, click Run and check that the `Project` workflow is selected. If it fails immediately with `DATABASE_URL must be set`, provision Postgres or add the `DATABASE_URL` secret, then rerun the workflow.
- The `Web App` workflow is retained only for frontend-only Vite development. The normal Replit preview should use `Project`, not `Web App`.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 (`artifacts/api-server`)
- Frontend: React + Vite + Tailwind + shadcn/ui (`artifacts/paip`)
- DB: PostgreSQL + Drizzle ORM (`lib/db`)
- Auth: Replit Auth (OIDC) — `lib/replit-auth-web` for frontend hook
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec in `lib/api-spec`)
- AI: OpenAI via Replit AI Integrations (`artifacts/api-server/src/lib/ai-feedback.ts`)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for API contract
- `lib/api-zod/src/generated/api.ts` — generated Zod schemas (server-side validation)
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks (frontend)
- `lib/db/src/schema/` — Drizzle ORM schema (auth.ts, participants.ts, checkins.ts, submissions.ts, summaries.ts)
- `artifacts/api-server/src/routes/` — all API route handlers
- `artifacts/api-server/src/lib/modules.ts` — static Week 1–4 curriculum content
- `artifacts/api-server/src/lib/ai-feedback.ts` — OpenAI feedback generation with guardrails
- `artifacts/paip/src/pages/` — all frontend pages
- `artifacts/paip/src/components/layout.tsx` — shared sidebar layout

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → typed hooks + Zod schemas. Never edit generated files.
- Auth upsert intentionally does NOT overwrite `role` on login — role is set post-login by the user once, then preserved.
- AI feedback uses `gpt-5-mini` with strict system prompt guardrails. Generated in background on submission creation, also triggerable via POST.
- "Needs Attention" flag (7+ days inactivity) is clinician-only — never exposed in participant API responses or UI.
- Participation summaries contain only factual activity data — no narratives, no clinical language. Required DISCLAIMER string prepended to every generated summary.
- Weeks 5–24 are not in the MVP. Modules endpoint returns only weeks 1–4.

## Product

- **Participants**: Onboarding with 6 required acknowledgments → daily check-ins → 4 weekly modules with reflection + integrity commitment submissions → AI mentor feedback on each submission.
- **Clinicians**: Dashboard of assigned participants with activity data, Needs Attention flag, check-in history, submission review, and one-click participation summary generation.

## User preferences

- Sober, professional, non-gamified design throughout
- No scores, risk labels, percentages, or compliance meters anywhere in participant views
- "Needs Attention" language only in clinician views
- No emojis in the UI
- The word "risk" must not appear in participant-facing UI
- AI feedback disclaimer: "This feedback is for reflective purposes only and is not for court use." — shown below every feedback block

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after editing `lib/api-spec/openapi.yaml`
- Mutations from Orval wrap body args in `{ data: BodyType<T> }` — call as `mutate({ data: { field: value } })`
- Query hooks from Orval require `queryKey` in options when passing custom options
- `pnpm --filter @workspace/db run push` must be run after schema changes before the API server will work
- API server bundles with esbuild — restart workflow after code changes

## Seed data (fictional)

- Clinician: `dr.morgan@paip-demo.local` (id: `clinician-seed-001`)
- Participants: James Calloway (active, weeks 1–3 done), Marcus Ellison (needs attention, weeks 1–2 done), Thomas Brennan (just started)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
