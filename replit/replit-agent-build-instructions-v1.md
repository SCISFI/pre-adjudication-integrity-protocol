# Replit Agent Build Instructions v1
## The Pre-Adjudication Integrity Protocol

## Build Goal

Build a secure MVP web app for The Pre-Adjudication Integrity Protocol using the approved repo documents as the governing source of truth.

The MVP should support:

- participant onboarding
- daily check-ins
- weekly module access for Weeks 1–4 only
- weekly reflection submission
- weekly integrity commitment
- completion attestation checkbox
- AI feedback after daily and weekly submissions
- clinician dashboard
- participant detail view
- Needs Attention flag
- participation summary prototype

Weeks 5–24 may remain in the repository but must not be exposed to initial test users.

## Governing Documents

Before building, read:

- `docs/track-charter-v1.md`
- `docs/app-build-spec-v1.md`
- `docs/data-model-spec-v1.md`
- `docs/route-map-v1.md`
- `docs/component-inventory-v1.md`
- `docs/daily-check-in-spec-v1.md`
- `docs/weekly-content-template-v1.md`
- `docs/participant-dashboard-spec-v1.md`
- `docs/clinician-dashboard-spec-v1.md`
- `docs/ai-feedback-guardrails-v1.md`
- `docs/participation-summary-rules-v1.md`
- `docs/onboarding-acknowledgments-v1.md`
- `docs/crisis-language-v1.md`

## Non-Negotiable Guardrails

Do not implement:

- messaging
- notifications
- push alerts
- risk scoring
- relapse prediction
- compliance percentages
- legal-risk labels
- clinical-risk labels
- spouse/partner access
- attorney portal
- court portal
- automated escalation
- automated intervention
- AI-generated legal advice
- AI-generated counseling advice
- AI-generated court summaries
- offense-detail prompts
- relapse detection
- surveillance behavior

## Required MVP Roles

Implement these roles:

- participant
- clinician
- supervised_intern
- clinical_supervisor
- clinical_admin

For the MVP, role switching may be simplified if authentication is not yet production-ready, but the user interface and data model should honor these roles.

## Participant Experience

A participant should be able to:

1. complete onboarding acknowledgments
2. select relationship status
3. view the participant dashboard
4. complete the daily check-in
5. view Week 1–4 modules
6. submit weekly reflection answers
7. enter weekly integrity commitment
8. check completion attestation
9. receive AI feedback after submission
10. view previous completed weeks and own check-ins

The participant must never see:

- Needs Attention flag
- clinician notes
- clinician review labels
- participation summary generation controls
- risk labels
- scores
- court-facing language

## Clinician Experience

A clinician should be able to:

1. view assigned participants
2. see participant current week
3. see submitted/not submitted status
4. see last activity date
5. see daily check-in entries
6. see weekly submissions
7. see AI feedback
8. see Needs Attention status
9. generate participation summary prototype

The clinician dashboard must present daily check-ins and weekly submissions as self-attested information only.

## Needs Attention Logic

Needs Attention may be triggered after 7 days of inactivity.

Meaning:

- clinician curiosity
- not participant failure
- not risk
- not relapse
- not noncompliance
- not legal concern

It must not notify participants.

## AI Feedback

Use approved prompts only.

AI feedback must:

- be mentor-style
- direct but non-shaming
- redirect legal matters to attorney
- redirect clinical matters to licensed therapist/supervised provider
- include crisis redirect when needed

AI feedback must not:

- diagnose
- provide counseling
- provide legal advice
- assess risk
- predict relapse
- summarize offense details
- create court-facing language

## Participation Summary Prototype

Generate a participation summary using `docs/participation-summary-template-v1.md`.

Include participation facts only.

Do not include:

- reflection answers
- daily check-in answers
- AI feedback
- offense details
- clinical interpretations
- risk opinions
- legal recommendations

## Visual Tone

Use a sober, calm, professional visual style.

Avoid playful gamification, badges, rewards, streaks, success/failure colors, or celebratory completion graphics.

## Initial Test Scope

Release only:

- onboarding
- daily check-in
- Weeks 1–4
- AI feedback
- participant dashboard
- clinician dashboard
- participation summary prototype

Do not expose Weeks 5–24 in test user navigation yet.
