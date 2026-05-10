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
import { logger } from "../lib/logger";

const router: IRouter = Router();

const NEEDS_ATTENTION_INACTIVITY_DAYS = 7;
const SUMMARY_DISCLAIMER =
  "DISCLAIMER: This document is an automated summary of recorded program participation activity. It documents dates of check-in submissions, weekly module completions, and program engagement only. It contains no clinical assessment, risk evaluation, therapeutic interpretation, legal opinion, forensic analysis, or outcome prediction. It must not be interpreted as such by any party. This summary was generated for program monitoring purposes only and does not represent a professional evaluation of any kind.";

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

async function requireClinician(req: { isAuthenticated: () => boolean; user?: { id: string } }, res: { status: (n: number) => { json: (o: unknown) => void } }): Promise<boolean> {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.id));
  if (!user || user.role !== "clinician") {
    res.status(403).json({ error: "Not a clinician" });
    return false;
  }
  return true;
}

router.get("/clinician/participants", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [clinician] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));
  if (!clinician || clinician.role !== "clinician") {
    res.status(403).json({ error: "Not a clinician" });
    return;
  }

  const participants = await db
    .select()
    .from(participantsTable)
    .where(eq(participantsTable.clinicianId, req.user.id));

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
  if (!clinician || clinician.role !== "clinician") {
    res.status(403).json({ error: "Not a clinician" });
    return;
  }

  const params = GetClinicianParticipantDetailParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [participant] = await db
    .select()
    .from(participantsTable)
    .where(
      and(
        eq(participantsTable.id, params.data.participantId),
        eq(participantsTable.clinicianId, req.user.id),
      ),
    );

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
  if (!clinician || clinician.role !== "clinician") {
    res.status(403).json({ error: "Not a clinician" });
    return;
  }

  const params = GenerateParticipationSummaryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [participant] = await db
    .select()
    .from(participantsTable)
    .where(
      and(
        eq(participantsTable.id, params.data.participantId),
        eq(participantsTable.clinicianId, req.user.id),
      ),
    );

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

  const checkinDates = checkins.map((c) => c.checkInDate).join(", ");
  const submissionDetails = weeklyStatus
    .map((w) =>
      w.submitted
        ? `Week ${w.weekNumber}: submitted on ${w.submittedAt?.toISOString().split("T")[0]}`
        : `Week ${w.weekNumber}: not submitted`,
    )
    .join("; ");

  const summaryText = [
    `PARTICIPATION SUMMARY — ACTIVITY FACTS ONLY`,
    ``,
    `Enrollment date: ${enrollmentDate.toISOString().split("T")[0]}`,
    `Program: Pre-Adjudication Integrity Protocol`,
    `Weeks available in current phase: 1–4`,
    ``,
    `ONBOARDING`,
    `Onboarding completed: ${participant.onboardingCompleted ? `Yes, on ${participant.onboardingCompletedAt?.toISOString().split("T")[0]}` : "No"}`,
    `Acknowledgments accepted: ${participant.acknowledgmentsAccepted ? `Yes, on ${participant.acknowledgmentsAcceptedAt?.toISOString().split("T")[0]}` : "No"}`,
    ``,
    `DAILY CHECK-IN ACTIVITY`,
    `Total daily check-ins submitted: ${totalCheckins}`,
    checkinDates ? `Check-in dates: ${checkinDates}` : `Check-in dates: None recorded`,
    ``,
    `WEEKLY MODULE SUBMISSIONS`,
    submissionDetails,
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
  if (!clinician || clinician.role !== "clinician") {
    res.status(403).json({ error: "Not a clinician" });
    return;
  }

  const params = GetParticipationSummariesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
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
