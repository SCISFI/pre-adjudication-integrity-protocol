import { pgTable, serial, integer, text, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { participantsTable } from "./participants";

export const dailyCheckinsTable = pgTable("daily_checkins", {
  id: serial("id").primaryKey(),
  participantId: integer("participant_id").notNull().references(() => participantsTable.id),
  checkInDate: date("check_in_date").notNull(),
  reflectionResponse: text("reflection_response").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDailyCheckinSchema = createInsertSchema(dailyCheckinsTable).omit({ id: true, completedAt: true });
export type InsertDailyCheckin = z.infer<typeof insertDailyCheckinSchema>;
export type DailyCheckin = typeof dailyCheckinsTable.$inferSelect;
