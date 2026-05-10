# Implementation Sequence v1

## Phase 1 — App Shell

1. Create app shell and layout.
2. Add routing based on route map.
3. Add basic role-aware navigation.
4. Add sober visual theme.

## Phase 2 — Static Content Loading

1. Load Week 1–4 content from curriculum markdown.
2. Hide Weeks 5–24 in participant navigation.
3. Add boundary reminder component.
4. Add crisis notice component for onboarding, Week 1, and Week 2.

## Phase 3 — Onboarding

1. Build onboarding acknowledgments.
2. Require active attestation.
3. Capture relationship status.
4. Store onboarding completion.

## Phase 4 — Weekly Reflection

1. Build weekly module page.
2. Display lesson.
3. Display reflection questions.
4. Add weekly commitment field.
5. Add completion checkbox.
6. Save submission.
7. Generate AI feedback.

## Phase 5 — Daily Check-In

1. Build daily check-in form.
2. Add HALT-BS checkboxes.
3. Add sleep, movement, isolation, emotion, vulnerability, boundary, support, therapist follow-up, and action fields.
4. Add daily attestation.
5. Save submission.
6. Generate daily AI feedback.

## Phase 6 — Clinician Dashboard

1. Build assigned participant list.
2. Show current week, last activity, status, submitted/not submitted.
3. Add Needs Attention logic based on inactivity.
4. Build participant detail view.
5. Show weekly submissions, daily check-ins, and AI feedback.

## Phase 7 — Participation Summary

1. Build prototype summary view.
2. Include participation facts only.
3. Include required disclaimer.
4. Do not include reflection content or AI feedback.

## Phase 8 — QA

1. Run guardrail tests.
2. Run AI feedback tests.
3. Run role visibility tests.
4. Run no-offense-detail prompt review.
5. Run MVP launch checklist.
