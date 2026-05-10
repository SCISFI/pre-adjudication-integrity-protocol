# Route Map v1

## Public Routes

### `/`
Landing / login orientation page.

Must not promise legal benefit.

### `/login`
Participant and clinician login.

### `/onboarding`
Required acknowledgments before program access.

## Participant Routes

### `/participant/dashboard`
Participant home view.

Shows current week, daily check-in access, weekly module access, previous completed weeks, and boundary reminders.

### `/participant/week/:weekNumber`
Weekly lesson and reflection form.

### `/participant/daily-check-in`
Daily check-in form.

### `/participant/history`
Participant view of his own completed weeks and daily check-ins.

Must not show clinician notes, Needs Attention status, or administrative labels.

## Clinician Routes

### `/clinician/dashboard`
Assigned participant list.

### `/clinician/participants/:participantId`
Participant detail view.

Shows weekly submissions, daily check-ins, AI feedback, last activity, Needs Attention status, and participation summary controls.

### `/clinician/participants/:participantId/summary`
Participation Summary generation screen.

## Admin Routes

### `/admin/users`
Manage participants and clinician assignments.

### `/admin/program`
Program configuration. Restricted.

## Forbidden Routes / Features

Do not add:

- spouse/partner portal
- attorney portal
- court portal
- messaging routes
- notification center
- risk analytics page
- relapse dashboard
- compliance score page
