import { Router, type IRouter } from "express";
import { eq, desc, and } from "drizzle-orm";
import {
  db,
  usersTable,
  participantsTable,
  dailyCheckinsTable,
  weeklySubmissionsTable,
  aiFeedbackTable,
  participationSummariesTable,
} from "@workspace/db";
import {
  GetClinicianParticipantDetailParams,
  GenerateParticipationSummaryParams,
  GetParticipationSummariesParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const NEEDS_ATTENTION_INACTIVITY_DAYS = 7;
const SUMMARY_DISCLAIMER =
  "DISCLAIMER: This summary documents participation only. It is not a forensic evaluation, psychosexual evaluation, risk assessment, legal opinion, clinical treatment summary, treatment discharge summary, or sentencing recommendation. It does not determine guilt or innocence, verify truthfulness, assess safety, establish rehabilitation, or recommend any legal outcome.";

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

const DEMO_PARTICIPANTS = [
  {
    id: -1,
    userId: "demo-active",
    firstName: "James",
    lastName: "Calloway",
    email: "james.calloway@example.com",
    relationshipStatus: "Married/partnered",
    onboardingCompleted: true,
    lastActivityAt: daysAgo(1),
    needsAttention: false,
    totalCheckins: 5,
    weeklyStatus: [
      { weekNumber: 1, submitted: true, submittedAt: daysAgo(6) },
      { weekNumber: 2, submitted: false, submittedAt: null },
      { weekNumber: 3, submitted: false, submittedAt: null },
      { weekNumber: 4, submitted: false, submittedAt: null },
    ],
  },
  {
    id: -2,
    userId: "demo-needs-attention",
    firstName: "Marcus",
    lastName: "Ellison",
    email: "marcus.ellison@example.com",
    relationshipStatus: "Separated/divorcing",
    onboardingCompleted: true,
    lastActivityAt: daysAgo(9),
    needsAttention: true,
    totalCheckins: 2,
    weeklyStatus: [
      { weekNumber: 1, submitted: true, submittedAt: daysAgo(10) },
      { weekNumber: 2, submitted: false, submittedAt: null },
      { weekNumber: 3, submitted: false, submittedAt: null },
      { weekNumber: 4, submitted: false, submittedAt: null },
    ],
  },
  {
    id: -3,
    userId: "demo-completed-week-one",
    firstName: "Thomas",
    lastName: "Brennan",
    email: "thomas.brennan@example.com",
    relationshipStatus: "Single",
    onboardingCompleted: true,
    lastActivityAt: daysAgo(0),
    needsAttention: false,
    totalCheckins: 1,
    weeklyStatus: [
      { weekNumber: 1, submitted: true, submittedAt: daysAgo(0) },
      { weekNumber: 2, submitted: false, submittedAt: null },
      { weekNumber: 3, submitted: false, submittedAt: null },
      { weekNumber: 4, submitted: false, submittedAt: null },
    ],
  },
  {
    id: -4,
    userId: "demo-not-started",
    firstName: "Robert",
    lastName: "Demo",
    email: "robert.demo@example.com",
    relationshipStatus: null,
    onboardingCompleted: false,
    lastActivityAt: null,
    needsAttention: true,
    totalCheckins: 0,
    weeklyStatus: [
      { weekNumber: 1, submitted: false, submittedAt: null },
      { weekNumber: 2, submitted: false, submittedAt: null },
      { weekNumber: 3, submitted: false, submittedAt: null },
      { weekNumber: 4, submitted: false, submittedAt: null },
    ],
  },
];

function calculateNeedsAttention(lastActivityAt: Date | null): boolean {
  if (!lastActivityAt) return true;
  const daysSince = (Date.now() - lastActivityAt.getTime()) / (1000 * 60 * 60 * 24);
  return daysSince >= NEEDS_ATTENTION_INACTIVITY_DAYS;
}

function getWeeklyStatus(submissions: { weekNumber: number; completedAt: Date }[]) {
  return [1, 2, 3, 4].map((weekNumber) => {
    const sub = submissions.find((s) => s.weekNumber === weekNumber);
    return {
      weekNumber,
      submitted: !!sub,
      submittedAt: sub?.completedAt ?? null,
    };
  });
}

function isClinicalRole(role: string | null | undefined) {
  return role === "clinician" || role === "clinical_admin";
}

async function getLastActivity(participantId: number): Promise<Date | null> {
  const [lastCheckin] = await db
    .select({ completedAt: dailyCheckinsTable.completedAt })
    .from(dailyCheckinsTable)
    .where(eq(dailyCheckinsTable.participantId, participantId))
    .orderBy(desc(dailyCheckinsTable.completedAt))
    .limit(1);

  const [lastSubmission] = await db
    .select({ completedAt: weeklySubmissionsTable.completedAt })
    .from(weeklySubmissionsTable)
    .where(eq(weeklySubmissionsTable.participantId, participantId))
    .orderBy(desc(weeklySubmissionsTable.completedAt))
    .limit(1);

  const dates: Date[] = [];
  if (lastCheckin) dates.push(lastCheckin.completedAt);
  if (lastSubmission) dates.push(lastSubmission.completedAt);

  if (dates.length === 0) return null;
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

function getDemoParticipantDetail(participantId: number) {
  const demo = DEMO_PARTICIPANTS.find((p) => p.id === participantId) ?? DEMO_PARTICIPANTS[0];

  return {
    participant: demo,
    checkins:
      demo.totalCheckins > 0
        ? [
            {
              id: -101,
              participantId: demo.id,
              checkInDate: daysAgo(1),
              reflectionResponse:
                "Fictional demo check-in: tired, stressed, and working on not isolating. No offense details included.",
              completedAt: daysAgo(1),
            },
          ]
        : [],
    submissions: demo.weeklyStatus
      .filter((w) => w.submitted)
      .map((w) => ({
        id: -201 - w.weekNumber,
        participantId: demo.id,
        weekNumber: w.weekNumber,
        reflectionResponse:
          "Fictional demo weekly reflection: I am facing secrecy, shame, and the need for structured support. I need to bring the deeper clinical material to therapy and avoid using the app for legal or offense details.",
        integrityCommitment:
          "I will complete my daily check-ins honestly and contact an appropriate support person before isolating.",
        attestationChecked: true,
        completedAt: w.submittedAt ?? daysAgo(1),
        feedback: {
          id: -301 - w.weekNumber,
          submissionId: -201 - w.weekNumber,
          feedbackText:
            "James, your reflection names shame and isolation without turning them into excuses. Keep the next step concrete: honor your boundary, avoid isolation, and bring the deeper clinical material to your licensed therapist or supervised clinical provider.",
          generatedAt: w.submittedAt ?? daysAgo(1),
        },
      })),
    weeklyStatus: demo.weeklyStatus,
    totalCheckins: demo.totalCheckins,
    lastActivityAt: demo.lastActivityAt,
    needsAttention: demo.needsAttention,
  };
}

router.get("/clinician/participants", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [clinician] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));
  if (!clinician || !isClinicalRole(clinician.role)) {
    res.status(403).json({ error: "Not a clinician" });
    return;
  }

  if (clinician.role === "clinical_admin") {
    res.json(DEMO_PARTICIPANTS);
    return;
  }

  const participants = await db
    .select()
    .from(participantsTable)
    .where(eq(participantsTable.clinicianId, req.user.id));

  if (participants.length === 0) {
    res.json(DEMO_PARTICIPANTS);
    return;
  }

  const results = await Promise.all(
    participants.map(async (p) => {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, p.userId));
      const checkins = await db
        .select()
        .from(dailyCheckinsTable)
        .where(eq(dailyCheckinsTable.participantId, p.id));
      const submissions = await db
        .select()
        .from(weeklySubmissionsTable)
        .where(eq(weeklySubmissionsTable.participantId, p.id));
      const lastActivityAt = await getLastActivity(p.id);
      const weeklyStatus = getWeeklyStatus(submissions);

      return {
        id: p.id,
        userId: p.userId,
        firstName: user?.firstName ?? null,
        lastName: user?.lastName ?? null,
        email: user?.email ?? null,
        relationshipStatus: p.relationshipStatus,
        onboardingCompleted: p.onboardingCompleted,
        lastActivityAt,
        needsAttention: calculateNeedsAttention(lastActivityAt),
        totalCheckins: checkins.length,
        weeklyStatus,
      };
    }),
  );

  res.json(results);
});

router.get("/clinician/participants/:participantId", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [clinician] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));
  if (!clinician || !isClinicalRole(clinician.role)) {
    res.status(403).json({ error: "Not a clinician" });
    return;
  }

  const params = GetClinicianParticipantDetailParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  if (params.data.participantId < 0) {
    res.json(getDemoParticipantDetail(params.data.participantId));
    return;
  }

  if (clinician.role === "clinical_admin") {
    res.status(404).json({ error: "Clinical Admin Test View uses fictional demo participants only" });
    return;
  }

  const whereClause = and(
    eq(participantsTable.id, params.data.participantId),
    eq(participantsTable.clinicianId, req.user.id),
  );

  const [participant] = await db.select().from(participantsTable).where(whereClause);

  if (!participant) {
    res.status(404).json({ error: "Participant not found or not assigned to you" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, participant.userId));
  const checkins = await db
    .select()
    .from(dailyCheckinsTable)
    .where(eq(dailyCheckinsTable.participantId, participant.id))
    .orderBy(desc(dailyCheckinsTable.completedAt));

  const submissions = await db
    .select()
    .from(weeklySubmissionsTable)
    .where(eq(weeklySubmissionsTable.participantId, participant.id))
    .orderBy(weeklySubmissionsTable.weekNumber);

  const submissionsWithFeedback = await Promise.all(
    submissions.map(async (s) => {
      const [feedback] = await db
        .select()
        .from(aiFeedbackTable)
        .where(eq(aiFeedbackTable.submissionId, s.id));
      return { ...s, feedback: feedback ?? null };
    }),
  );

  const lastActivityAt = await getLastActivity(participant.id);
  const weeklyStatus = getWeeklyStatus(submissions);

  res.json({
    participant: {
      id: participant.id,
      userId: participant.userId,
      firstName: user?.firstName ?? null,
      lastName: user?.lastName ?? null,
      email: user?.email ?? null,
      relationshipStatus: participant.relationshipStatus,
      onboardingCompleted: participant.onboardingCompleted,
      lastActivityAt,
      needsAttention: calculateNeedsAttention(lastActivityAt),
      totalCheckins: checkins.length,
      weeklyStatus,
    },
    checkins,
    submissions: submissionsWithFeedback,
    weeklyStatus,
    totalCheckins: checkins.length,
    lastActivityAt,
    needsAttention: calculateNeedsAttention(lastActivityAt),
  });
});

router.post("/clinician/participants/:participantId/summary", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [clinician] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));
  if (!clinician || !isClinicalRole(clinician.role)) {
    res.status(403).json({ error: "Not a clinician" });
    return;
  }

  const params = GenerateParticipationSummaryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  if (params.data.participantId < 0) {
    res.json({
      id: -900,
      participantId: params.data.participantId,
      generatedByClinicianId: req.user.id,
      generatedAt: new Date(),
      summaryText:
        "DEMO PARTICIPATION SUMMARY — ACTIVITY FACTS ONLY\n\nThis fictional demo participant has sample activity for testing the summary workflow. No real client information, offense details, legal facts, or clinical opinions are included.",
      disclaimer: SUMMARY_DISCLAIMER,
    });
    return;
  }

  if (clinician.role === "clinical_admin") {
    res.status(404).json({ error: "Clinical Admin Test View uses fictional demo participants only" });
    return;
  }

  const whereClause = and(
    eq(participantsTable.id, params.data.participantId),
    eq(participantsTable.clinicianId, req.user.id),
  );

  const [participant] = await db.select().from(participantsTable).where(whereClause);

  if (!participant) {
    res.status(404).json({ error: "Participant not found or not assigned to you" });
    return;
  }

  const checkins = await db
    .select()
    .from(dailyCheckinsTable)
    .where(eq(dailyCheckinsTable.participantId, participant.id))
    .orderBy(dailyCheckinsTable.checkInDate);

  const submissions = await db
    .select()
    .from(weeklySubmissionsTable)
    .where(eq(weeklySubmissionsTable.participantId, participant.id))
    .orderBy(weeklySubmissionsTable.weekNumber);

  const enrollmentDate = participant.createdAt;
  const totalCheckins = checkins.length;
  const weeklyStatus = getWeeklyStatus(submissions);
  const completedWeeks = weeklyStatus.filter((w) => w.submitted).map((w) => w.weekNumber);
  const lastActivityAt = await getLastActivity(participant.id);

  const summaryText = [
    `PARTICIPATION SUMMARY — ACTIVITY FACTS ONLY`,
    ``,
    `Enrollment date: ${enrollmentDate.toISOString().split("T")[0]}`,
    `Program: Pre-Adjudication Integrity Protocol`,
    `Weeks available in current phase: 1–4`,
    ``,
    `ONBOARDING`,
    `Onboarding completed: ${participant.onboardingCompleted ? "Yes" : "No"}`,
    `Acknowledgments accepted: ${participant.acknowledgmentsAccepted ? "Yes" : "No"}`,
    ``,
    `DAILY CHECK-IN ACTIVITY`,
    `Total daily check-ins submitted: ${totalCheckins}`,
    ``,
    `WEEKLY MODULE SUBMISSIONS`,
    `Weeks completed: ${completedWeeks.length > 0 ? completedWeeks.join(", ") : "None"}`,
    ``,
    `LAST RECORDED ACTIVITY`,
    `Last activity: ${lastActivityAt ? lastActivityAt.toISOString().split("T")[0] : "None recorded"}`,
    ``,
    `Summary generated: ${new Date().toISOString().split("T")[0]}`,
  ].join("\n");

  const [created] = await db
    .insert(participationSummariesTable)
    .values({
      participantId: participant.id,
      generatedByClinicianId: req.user.id,
      summaryText,
      disclaimer: SUMMARY_DISCLAIMER,
    })
    .returning();

  res.json(created);
});

router.get("/clinician/participants/:participantId/summary", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [clinician] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));
  if (!clinician || !isClinicalRole(clinician.role)) {
    res.status(403).json({ error: "Not a clinician" });
    return;
  }

  const params = GetParticipationSummariesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  if (params.data.participantId < 0) {
    res.json([]);
    return;
  }

  if (clinician.role === "clinical_admin") {
    res.status(404).json({ error: "Clinical Admin Test View uses fictional demo participants only" });
    return;
  }

  const summaries = await db
    .select()
    .from(participationSummariesTable)
    .where(eq(participationSummariesTable.participantId, params.data.participantId))
    .orderBy(desc(participationSummariesTable.generatedAt));

  res.json(summaries);
});

export default router;
