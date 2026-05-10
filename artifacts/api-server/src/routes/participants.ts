import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, participantsTable, usersTable } from "@workspace/db";
import {
  GetMyParticipantProfileResponse,
  CompleteOnboardingBody,
  CompleteOnboardingResponse,
  UpdateRelationshipStatusBody,
  UpdateRelationshipStatusResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function getOrCreateParticipant(userId: string) {
  const [existing] = await db
    .select()
    .from(participantsTable)
    .where(eq(participantsTable.userId, userId));

  if (existing) return existing;

  const [created] = await db
    .insert(participantsTable)
    .values({ userId })
    .returning();

  return created;
}

router.get("/participants/me", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));
  if (!user || user.role !== "participant") {
    res.status(403).json({ error: "Not a participant" });
    return;
  }

  const participant = await getOrCreateParticipant(req.user.id);
  res.json(GetMyParticipantProfileResponse.parse(participant));
});

router.post("/participants/me/onboarding", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CompleteOnboardingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (!parsed.data.acknowledgmentsAccepted) {
    res.status(400).json({ error: "Acknowledgments must be accepted to proceed" });
    return;
  }

  const participant = await getOrCreateParticipant(req.user.id);
  const now = new Date();

  const [updated] = await db
    .update(participantsTable)
    .set({
      acknowledgmentsAccepted: true,
      acknowledgmentsAcceptedAt: now,
      relationshipStatus: parsed.data.relationshipStatus,
      onboardingCompleted: true,
      onboardingCompletedAt: now,
    })
    .where(eq(participantsTable.id, participant.id))
    .returning();

  res.json(CompleteOnboardingResponse.parse(updated));
});

router.patch("/participants/me/relationship-status", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = UpdateRelationshipStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const participant = await getOrCreateParticipant(req.user.id);

  const [updated] = await db
    .update(participantsTable)
    .set({ relationshipStatus: parsed.data.relationshipStatus })
    .where(eq(participantsTable.id, participant.id))
    .returning();

  res.json(UpdateRelationshipStatusResponse.parse(updated));
});

export default router;
