# Future Agent Handoff v1

## Purpose of This Document

This handoff document is for a future coding agent or reviewer who has not worked on this repository before. It summarizes the current MVP state, the approved guardrails, known temporary testing decisions, recent changes, and the recommended remaining work.

The project is **The Pre-Adjudication Integrity Protocol**. It is a structured recovery-accountability web app for adult men facing serious sexual behavior consequences before adjudication. The app is intended to support structure, self-attestation, bounded reflection, clinician review, and factual participation summaries. It is not a treatment replacement, forensic tool, court-preparation tool, monitoring system, or legal aid system.

## Non-Negotiable Guardrails

Future work must preserve all of these boundaries:

- no offense-detail collection;
- no victim names or victim information;
- no investigative facts;
- no police facts;
- no illegal content descriptions;
- no legal strategy;
- no legal advice;
- no therapy replacement;
- no forensic evaluation;
- no psychosexual evaluation;
- no risk scoring;
- no relapse prediction;
- no compliance percentages or success/failure scoring;
- no court-outcome promises;
- no court-performance framing;
- no spouse/partner portal;
- no spouse/partner pressure for reassurance, forgiveness, monitoring, or proof of change;
- no messaging;
- no notifications;
- no automated escalation;
- no automated accusations or safety conclusions.

Use this rule when uncertain: **the app holds structure; people hold meaning**. The app may collect bounded self-attestation and activity facts. It must not interpret clinical significance, legal significance, risk, rehabilitation, or safety.

## Current High-Level Architecture

The repository is a pnpm workspace with the main runnable app split into:

- `artifacts/api-server` — Express API server, auth, database-backed routes, clinician endpoints, static module content, AI feedback integration, and static frontend serving after build.
- `artifacts/paip` — Vite/React frontend for participant and clinician flows.
- `lib/db` — Drizzle schema.
- `lib/api-spec`, `lib/api-zod`, `lib/api-client-react` — OpenAPI contract, generated validation schemas, and generated React Query hooks.
- `docs` — governing product, clinical, legal, QA, launch, and build documentation.

Do not edit generated API client/Zod files directly. If the OpenAPI spec changes, regenerate through the existing API-spec workflow.

## Current MVP User Flows

### Participant Flow

Implemented participant flow includes:

1. login through Replit Auth;
2. role selection;
3. onboarding acknowledgments and relationship-status intake;
4. participant dashboard;
5. structured daily check-in;
6. weekly modules list;
7. module detail screen;
8. structured weekly module submission;
9. submissions/history view;
10. AI-generated reflective feedback after weekly submission.

Participant routes currently use simplified MVP paths:

- `/dashboard`
- `/checkin`
- `/modules`
- `/modules/:weekNumber`
- `/modules/:weekNumber/submit`
- `/submissions`

### Clinician Flow

Implemented clinician flow includes:

1. clinician participant dashboard;
2. participant detail screen;
3. Needs Attention display and guidance;
4. check-in/submission review;
5. participation-summary generation and display.

Clinician routes currently use simplified MVP paths:

- `/clinician`
- `/clinician/:participantId`

### Clinical Admin Test View

`clinical_admin` is currently treated as a **development/testing-only shortcut**. It must not become production admin access in Phase 1. Clinical admin test behavior should route to clinician-style demo data and should not expose real participant records.

Current intended behavior:

- Clinical Admin Test View is explicitly labeled as development/testing only.
- It routes through the clinician-style dashboard.
- It shows fictional demo participants.
- Clinical admin test users must not access real participant detail or real participation summaries.

## Current Phase 1 Curriculum State

Phase 1 is currently exposed as Weeks 1-4 only. The latest accelerated structure is:

1. **Week 1: Orientation Intensive: The First 7 Days**
   - seriousness of the moment;
   - stabilization;
   - legal/recovery separation;
   - role clarity;
   - support boundaries;
   - relationship responsibility;
   - first concrete action plan.

2. **Week 2: Thinking Patterns and Daily Honesty**
   - thinking errors;
   - minimization;
   - blame;
   - secrecy;
   - entitlement;
   - self-protective narratives;
   - thought-journal practice.

3. **Week 3: Before You Act: Choice Points and Self-Control**
   - vulnerability chains;
   - choice points;
   - pause/name/choose practice;
   - support without outsourcing responsibility;
   - environment/routine changes;
   - self-control practice.

4. **Week 4: Boundaries, Sexual Health, and Support Team**
   - healthy behavioral boundaries;
   - non-explicit sexual health reflection;
   - privacy versus secrecy;
   - containment team roles;
   - spouse/partner/family/household boundaries;
   - concrete safeguards without scoring or prediction.

The weekly module standard requires at least 30 minutes of focused work and separate response fields. Weekly modules should avoid one-paragraph reflection-only experiences.

## Current Structured Daily Check-In State

The daily check-in has been converted from one free-text prompt into a structured self-attestation flow. It currently includes:

- emotions-present checklist;
- emotional-stability slider;
- physical-stability slider;
- body-needs checklist;
- connection-versus-isolation slider;
- Boundary for today written field;
- Support action written field;
- Next-right action written field;
- completion attestation.

Attorney/clinical redirect language is intentionally present as boundary reminder text only, not as a daily checklist item or daily response field.

The daily check-in still stores one formatted text payload in the existing `reflectionResponse` column. This avoids a database migration for the MVP. A later version may move daily check-ins to structured JSON or dedicated columns.

## Current Weekly Submission State

Weekly submissions use multiple separate response fields in the frontend, then compose those fields into labeled structured text for `reflectionResponse` storage. This was chosen to preserve prompt/answer readability without adding schema changes during MVP stabilization.

Week 1 also includes a self-inventory area. Self-inventory is self-attestation only. It must not be scored or interpreted as risk, relapse prediction, clinical conclusion, or success/failure.

## Current Participation Summary State

Participation summaries should include factual activity data only. They may include things like enrollment date, module availability/completion, daily check-in counts, last activity, and generation date. They must not include:

- reflection answers;
- daily check-in answers;
- AI feedback;
- offense details;
- victim information;
- investigative facts;
- clinical opinions;
- diagnostic impressions;
- risk opinions;
- relapse predictions;
- claims of rehabilitation;
- statements of safety or low risk;
- legal recommendations;
- sentencing/court/custody recommendations.

A required disclaimer must remain visible with summaries.

## Temporary MVP Testing Decisions

These are intentional temporary testing choices, not final production decisions:

1. **All Phase 1 modules are currently unlocked.**
   - This is for MVP testing and content review only.
   - The 7-day pacing/locking logic can be restored later.

2. **Clinical Admin Test View is a shortcut, not production admin.**
   - It should stay clearly labeled as development/testing only.
   - Do not build production admin features under this label.

3. **Structured responses are stored as formatted text.**
   - This is acceptable for MVP.
   - A later schema pass may introduce structured JSON fields.

4. **Replit workflows/config were adjusted for preview and deployment.**
   - If preview breaks again, check `.replit`, `artifacts/paip/vite.config.ts`, and API static serving in `artifacts/api-server/src/app.ts` before changing product code.

## Known Issues and Technical Debt

### 1. Sidebar nested anchor warning

The sidebar layout currently uses Wouter `Link` with a nested `<a>` element. This may produce a hydration warning in the browser console. It is not a known hard crash, but should be cleaned up.

Recommended fix:

- Update sidebar nav rendering to avoid nested anchors while preserving styling and Wouter navigation.
- Run typecheck/build.
- Manually confirm sidebar navigation still works.

### 2. Daily check-in data model is still text-based

The structured daily check-in stores a composed text string in `reflectionResponse`. This is acceptable for MVP, but later work should consider structured storage.

Possible future approach:

- Add a JSON column or dedicated fields for slider/checklist/text responses.
- Update OpenAPI schema.
- Regenerate API client/Zod outputs.
- Update clinician display to render structured values without parsing text.

Do not do this until the product owner confirms the current daily check-in structure is stable.

### 3. Weekly submission data model is still text-based

Weekly module responses are also composed into one formatted text field. This preserves clinician readability but is not ideal long term.

Possible future approach:

- Add structured response storage for weekly prompt answers.
- Keep clinician display prompt-by-prompt.
- Preserve no-interpretation/no-scoring constraints.

### 4. Module unlocking must be restored before production

The current all-unlocked state is for MVP review. Before production or broader testing, decide whether to restore:

- 7-day unlock timing;
- clinician-controlled release;
- all-at-once access;
- or a different non-punitive pacing model.

Whatever is chosen must not imply punishment, compliance scoring, or court performance.

### 5. Route map divergence

The implemented MVP routes are simplified compared with the original route-map docs. Decide later whether to keep simplified routes or align paths with the original `/participant/...` and `/clinician/dashboard` style route map.

Do not change routing casually. Route changes can break Replit preview, auth redirects, and user testing notes.

### 6. Clinician dashboard sorting

The clinician dashboard spec has previously indicated that Needs Attention participants should sort first. Verify whether that is currently implemented. If not, add a small clinician-only sorting fix.

Do not add alerts, notifications, automated escalation, or risk labels while doing this.

### 7. AI feedback review

AI feedback must remain reflective and bounded. It must not provide legal advice, clinical interpretation, risk assessment, relapse prediction, offense/victim discussion, or court-facing summaries.

Future agents should review AI output against `qa/ai-output-review-checklist-v1.md` and `qa/guardrail-test-cases-v1.md` after prompt or content changes.

## Recommended Next PRs

### PR 1 — Stabilize Navigation and Console Warnings

Suggested branch:

`fix/sidebar-link-hydration-warning`

Scope:

- Fix nested anchor warning in sidebar layout.
- Confirm participant and clinician navigation still works.
- Do not change curriculum, auth, or data model.

Testing:

- `pnpm run typecheck`
- `pnpm run build`
- manual Replit navigation smoke test

### PR 2 — Review Structured Daily Check-In in Replit

Suggested branch:

`fix/daily-checkin-review-adjustments`

Scope:

- Adjust daily check-in labels/options after product-owner review.
- Keep attorney/clinical redirect as boundary text only unless explicitly changed.
- Keep sliders self-attestation only.
- Do not add scoring, automated escalation, alerts, notifications, or risk conclusions.

Testing:

- submit a daily check-in in Replit;
- review saved display on the participant side;
- review clinician detail display if available;
- run `pnpm run typecheck` and `pnpm run build`.

### PR 3 — Clinician Readability Pass

Suggested branch:

`fix/clinician-structured-response-readability`

Scope:

- Review how daily check-ins and weekly submissions render in clinician participant detail.
- Improve spacing, headings, or preformatted display only.
- Do not summarize, score, interpret, or classify content.

Testing:

- submit sample daily check-in and weekly module;
- view clinician participant detail;
- generate participation summary and confirm it does not include response content.

### PR 4 — Re-enable or Redesign Module Pacing

Suggested branch:

`feature/module-pacing-decision`

Prerequisite:

- Product owner decides desired pacing.

Scope options:

- restore 7-day unlock;
- keep all unlocked for beta;
- use clinician-initiated release;
- use phase-based release.

Constraints:

- no punishment language;
- no compliance scoring;
- no automated escalation;
- no court-performance implications.

### PR 5 — Structured Storage Design, Not Immediate Build

Suggested branch:

`docs/structured-response-data-design`

Scope:

- Write a design doc for structured daily/weekly response storage.
- Include migration strategy, API contract changes, clinician display requirements, and guardrails.
- Do not implement schema changes until reviewed.

## How to Work Safely in This Repo

1. Read relevant docs before coding:
   - `docs/app-build-spec-v1.md`
   - `docs/week-module-standard-v1.md`
   - `docs/clinician-dashboard-spec-v1.md`
   - `docs/participation-summary-rules-v1.md`
   - `docs/ai-feedback-guardrails-v1.md`
   - `qa/guardrail-test-cases-v1.md`

2. Keep PRs small.

3. Do not mix product content changes, Replit infrastructure changes, database migrations, and clinician workflow changes in one PR unless the user explicitly asks.

4. Run checks before handoff:
   - `git diff --check`
   - `pnpm run typecheck`
   - `pnpm run build`

5. If changing OpenAPI:
   - edit `lib/api-spec/openapi.yaml`;
   - regenerate clients/schemas using the repo workflow;
   - do not hand-edit generated files.

6. If changing database schema:
   - update Drizzle schema;
   - check migration/push expectations;
   - document any Replit database steps;
   - avoid schema changes for small UX-only PRs.

7. If Replit preview breaks:
   - first inspect browser console and Vite runtime overlay;
   - check missing imports in changed components;
   - check `.replit` workflow status;
   - check API server logs for `/api` calls;
   - verify Vite proxy and API port alignment;
   - avoid broad rewrites.

## Manual Smoke Test Checklist

Use this checklist after future PRs:

### Participant

- Login works.
- Role selection works.
- Onboarding works for a new participant.
- Dashboard loads.
- Daily check-in screen loads.
- Daily check-in can be submitted once.
- Submitted daily check-in displays clearly.
- Weekly Modules screen loads.
- Week 1 module detail loads.
- Week 1 structured submission can be completed.
- My Submissions displays structured response text.
- Return to Main Menu / Back buttons work without relying on browser back.

### Clinician

- Clinician dashboard loads.
- Demo participants display when expected.
- Participant detail loads.
- Daily check-ins and weekly submissions are readable.
- Needs Attention guidance displays only where appropriate.
- Participation summary generation displays a summary card.
- Participation summary includes required disclaimer.
- Participation summary does not include participant answers, AI feedback, offense details, clinical conclusions, risk opinions, legal recommendations, or safety/rehabilitation claims.

### Clinical Admin Test View

- Button is clearly labeled Clinical Admin Test View.
- Helper text says it is development/testing only.
- It routes to clinician-style dashboard/demo participants.
- It does not expose real participant records.

## Current Definition of Done for MVP Stabilization

The MVP should not be considered stable until all of the following are true:

- Replit preview renders without runtime errors.
- Root build and typecheck pass.
- Participant daily check-in, weekly module, and submissions flows are manually tested.
- Clinician participant detail and participation summary flows are manually tested.
- Clinical Admin Test View remains demo-only.
- The all-unlocked module decision is either documented as ongoing beta behavior or replaced with the chosen pacing model.
- Guardrail QA test cases pass by manual review.
- Any browser console warnings are reviewed and either fixed or documented as non-blocking.

## Suggested Immediate Next Action

The next agent should **not** start with new curriculum expansion. The safest next action is:

1. Pull the latest GitHub/Replit state.
2. Confirm Replit preview has no runtime errors.
3. Fix the sidebar nested-anchor warning if still present.
4. Smoke test the new structured daily check-in.
5. Make only small label/option adjustments requested by the product owner.

Do not add new portals, messaging, notifications, scoring, analytics, spouse/partner functionality, legal tools, or automated escalation.
