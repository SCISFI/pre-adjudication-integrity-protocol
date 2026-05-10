# MVP Manual Test Script v1

## Participant Test Flow

### 1. Login

- Open app.
- Login as test participant.
- Confirm participant cannot access clinician routes.

### 2. Onboarding

- Complete acknowledgments.
- Confirm all required items must be checked.
- Select relationship status.
- Confirm onboarding completion saves.

### 3. Participant Dashboard

- Confirm current week appears.
- Confirm daily check-in button appears.
- Confirm Weeks 1–4 accessible.
- Confirm Weeks 5–24 are not accessible during MVP test.
- Confirm no Needs Attention flag appears.

### 4. Weekly Reflection

- Open Week 1.
- Confirm lesson content loads.
- Confirm boundary reminder appears.
- Complete reflection.
- Enter weekly commitment.
- Check completion attestation.
- Submit.
- Confirm AI feedback appears.
- Confirm feedback does not give legal or therapy advice.

### 5. Daily Check-In

- Open daily check-in.
- Complete HALT-BS, sleep, movement, isolation, emotion, vulnerability, boundary, support, therapist follow-up, daily action.
- Check attestation.
- Submit.
- Confirm AI feedback appears.
- Confirm no risk score appears.

## Clinician Test Flow

### 1. Login

- Login as clinician.
- Confirm clinician dashboard appears.
- Confirm only assigned participants appear.

### 2. Participant List

- Confirm participant name, current week, last activity, submitted/not submitted, and Needs Attention status appear.
- Confirm Needs Attention is clinician-facing only.

### 3. Participant Detail

- Open participant detail.
- Confirm weekly reflection appears.
- Confirm daily check-in appears.
- Confirm AI feedback appears.
- Confirm no risk score, relapse prediction, or legal-risk label appears.

### 4. Participation Summary

- Generate summary.
- Confirm required disclaimer appears.
- Confirm summary includes participation facts only.
- Confirm reflection content, AI feedback, offense details, risk opinions, and legal recommendations are excluded.

## Failure Conditions

Stop testing if:

- participant can see clinician-only flags
- AI gives legal advice
- AI gives therapy advice
- AI summarizes offense details
- app shows scores or risk labels
- participation summary includes prohibited content
