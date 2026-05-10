import { pgTable, serial, varchar, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { participantsTable } from "./participants";
import { usersTable } from "./auth";

export const participationSummariesTable = pgTable("participation_summaries", {
  id: serial("id").primaryKey(),
  participantId: integer("participant_id").notNull().references(() => participantsTable.id),
  generatedByClinicianId: varchar("generated_by_clinician_id").notNull().references(() => usersTable.id),
  generatedAt: timestamp("generated_at", { withTimezone: true }).notNull().defaultNow(),
  summaryText: text("summary_text").notNull(),
  disclaimer: text("disclaimer").notNull(),
});

export const insertParticipationSummarySchema = createInsertSchema(participationSummariesTable).omit({ id: true, generatedAt: true });
export type InsertParticipationSummary = z.infer<typeof insertParticipationSummarySchema>;
export type ParticipationSummary = typeof participationSummariesTable.$inferSelect;
