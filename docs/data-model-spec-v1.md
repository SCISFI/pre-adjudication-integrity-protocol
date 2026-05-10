# Data Model Specification v1

## Design Principle

Collect the minimum data needed to support structured accountability.

Do not collect offense details, victim information, investigative facts, legal strategy, attorney-client privileged information, clinical diagnosis, risk scores, or legal conclusions.

## Participant

Fields:

- participant_id
- first_name
- last_name
- email
- relationship_status
- program_status
- current_week
- created_at
- last_activity_at
- assigned_clinician_id
- assigned_supervisor_id, if applicable

## Clinician

Fields:

- clinician_id
- first_name
- last_name
- email
- role
- license_status
- supervisor_id, if applicable
- active

Allowed clinician roles:

- licensed_clinician
- supervised_intern
- clinical_supervisor
- clinical_admin

## Weekly Progress

Fields:

- progress_id
- participant_id
- week_number
- reflection_answers
- weekly_commitment
- completion_attested
- completion_attested_at
- ai_feedback
- created_at
- updated_at

## Daily Check-In

Fields:

- checkin_id
- participant_id
- checkin_date
- halt_bs_items
- sleep_quality
- movement_status
- isolation_status
- strongest_emotion
- other_emotion_text
- secrecy_escape_vulnerability
- boundary_next_24_hours
- support_contact_status
- therapist_followup_needed
- therapist_followup_topic
- daily_integrity_action
- completion_attested
- completion_attested_at
- ai_feedback
- created_at

## Needs Attention

Fields:

- flag_id
- participant_id
- flag_type
- source
- active
- created_at
- cleared_at

Allowed flag_type:

- needs_attention

Allowed source:

- inactivity
- manual_clinician

## Participation Summary Record

Fields:

- summary_id
- participant_id
- generated_by_user_id
- date_range_start
- date_range_end
- authorized_recipient
- authorization_confirmed
- generated_at

## Data Prohibitions

The database must not include fields for:

- offense narrative
- victim name
- child name
- investigative facts
- police report details
- illegal content description
- search terms for illegal material
- legal strategy
- confession narrative
- risk score
- relapse prediction
- safety rating
- rehabilitation finding
- sentencing recommendation
