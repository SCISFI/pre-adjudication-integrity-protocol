import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, participantsTable, dailyCheckinsTable } from "@workspace/db";
import {
  ListMyCheckinsResponse,
  SubmitCheckinBody,
  GetTodayCheckinResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function getParticipantId(userId: string): Promise<number | null> {
  const [p] = await db.select().from(participantsTable).where(eq(participantsTable.userId, userId));
  return p?.id ?? null;
}

router.get("/checkins", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const participantId = await getParticipantId(req.user.id);
  if (!participantId) {
    res.json([]);
    return;
  }

  const checkins = await db
    .select()
    .from(dailyCheckinsTable)
    .where(eq(dailyCheckinsTable.participantId, participantId))
    .orderBy(desc(dailyCheckinsTable.completedAt));

  res.json(ListMyCheckinsResponse.parse(checkins));
});

router.post("/checkins", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = SubmitCheckinBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const participantId = await getParticipantId(req.user.id);
  if (!participantId) {
    res.status(403).json({ error: "Participant profile not found" });
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  const [existing] = await db
    .select()
    .from(dailyCheckinsTable)
    .where(
      and(
        eq(dailyCheckinsTable.participantId, participantId),
        eq(dailyCheckinsTable.checkInDate, today),
      ),
    );

  if (existing) {
    res.status(400).json({ error: "Today's check-in has already been submitted" });
    return;
  }

  const [created] = await db
    .insert(dailyCheckinsTable)
    .values({
      participantId,
      checkInDate: today,
      reflectionResponse: parsed.data.reflectionResponse,
    })
    .returning();

  res.status(201).json(created);
});

router.get("/checkins/today", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  const participantId = await getParticipantId(req.user.id);

  if (!participantId) {
    res.json(GetTodayCheckinResponse.parse({ submitted: false, checkInDate: today, checkin: null }));
    return;
  }

  const [checkin] = await db
    .select()
    .from(dailyCheckinsTable)
    .where(
      and(
        eq(dailyCheckinsTable.participantId, participantId),
        eq(dailyCheckinsTable.checkInDate, today),
      ),
    );

  res.json(
    GetTodayCheckinResponse.parse({
      submitted: !!checkin,
      checkInDate: today,
      checkin: checkin ?? null,
    }),
  );
});

export default router;
