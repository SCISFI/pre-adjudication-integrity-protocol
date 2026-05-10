import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, participantsTable, weeklySubmissionsTable, aiFeedbackTable } from "@workspace/db";
import {
  ListMySubmissionsResponse,
  CreateSubmissionBody,
  GetSubmissionParams,
  GetSubmissionFeedbackParams,
  GenerateSubmissionFeedbackParams,
} from "@workspace/api-zod";
import { generateFeedback } from "../lib/ai-feedback";
import { logger } from "../lib/logger";

const router: IRouter = Router();

async function getParticipantId(userId: string): Promise<number | null> {
  const [p] = await db.select().from(participantsTable).where(eq(participantsTable.userId, userId));
  return p?.id ?? null;
}

async function attachFeedback(submission: typeof weeklySubmissionsTable.$inferSelect) {
  const [feedback] = await db
    .select()
    .from(aiFeedbackTable)
    .where(eq(aiFeedbackTable.submissionId, submission.id));

  return { ...submission, feedback: feedback ?? null };
}

router.get("/submissions", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const participantId = await getParticipantId(req.user.id);
  if (!participantId) {
    res.json([]);
    return;
  }

  const submissions = await db
    .select()
    .from(weeklySubmissionsTable)
    .where(eq(weeklySubmissionsTable.participantId, participantId))
    .orderBy(weeklySubmissionsTable.weekNumber);

  const withFeedback = await Promise.all(submissions.map(attachFeedback));
  res.json(ListMySubmissionsResponse.parse(withFeedback));
});

router.post("/submissions", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (!parsed.data.attestationChecked) {
    res.status(400).json({ error: "You must check the completion attestation to submit" });
    return;
  }

  const participantId = await getParticipantId(req.user.id);
  if (!participantId) {
    res.status(403).json({ error: "Participant profile not found" });
    return;
  }

  const [existing] = await db
    .select()
    .from(weeklySubmissionsTable)
    .where(
      and(
        eq(weeklySubmissionsTable.participantId, participantId),
        eq(weeklySubmissionsTable.weekNumber, parsed.data.weekNumber),
      ),
    );

  if (existing) {
    res.status(400).json({ error: `Week ${parsed.data.weekNumber} has already been submitted` });
    return;
  }

  const [created] = await db
    .insert(weeklySubmissionsTable)
    .values({
      participantId,
      weekNumber: parsed.data.weekNumber,
      reflectionResponse: parsed.data.reflectionResponse,
      integrityCommitment: parsed.data.integrityCommitment,
      attestationChecked: parsed.data.attestationChecked,
    })
    .returning();

  // Auto-generate AI feedback in background
  try {
    const feedback = await generateFeedback(created.weekNumber, created.reflectionResponse, created.integrityCommitment);
    await db.insert(aiFeedbackTable).values({ submissionId: created.id, feedbackText: feedback });
  } catch (err) {
    logger.warn({ err }, "AI feedback generation failed on submission creation");
  }

  const withFeedback = await attachFeedback(created);
  res.status(201).json(withFeedback);
});

router.get("/submissions/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = GetSubmissionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const participantId = await getParticipantId(req.user.id);
  const [submission] = await db
    .select()
    .from(weeklySubmissionsTable)
    .where(eq(weeklySubmissionsTable.id, params.data.id));

  if (!submission || (participantId && submission.participantId !== participantId)) {
    res.status(404).json({ error: "Submission not found" });
    return;
  }

  const withFeedback = await attachFeedback(submission);
  res.json(withFeedback);
});

router.get("/submissions/:id/feedback", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = GetSubmissionFeedbackParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [feedback] = await db
    .select()
    .from(aiFeedbackTable)
    .where(eq(aiFeedbackTable.submissionId, params.data.id));

  if (!feedback) {
    res.status(404).json({ error: "No feedback generated yet" });
    return;
  }

  res.json(feedback);
});

router.post("/submissions/:id/feedback", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = GenerateSubmissionFeedbackParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [submission] = await db
    .select()
    .from(weeklySubmissionsTable)
    .where(eq(weeklySubmissionsTable.id, params.data.id));

  if (!submission) {
    res.status(404).json({ error: "Submission not found" });
    return;
  }

  const [existingFeedback] = await db
    .select()
    .from(aiFeedbackTable)
    .where(eq(aiFeedbackTable.submissionId, params.data.id));

  if (existingFeedback) {
    res.json(existingFeedback);
    return;
  }

  const feedbackText = await generateFeedback(submission.weekNumber, submission.reflectionResponse, submission.integrityCommitment);
  const [created] = await db
    .insert(aiFeedbackTable)
    .values({ submissionId: submission.id, feedbackText })
    .returning();

  res.json(created);
});

export default router;
