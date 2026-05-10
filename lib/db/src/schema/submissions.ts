import { pgTable, serial, integer, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { participantsTable } from "./participants";

export const weeklySubmissionsTable = pgTable("weekly_submissions", {
  id: serial("id").primaryKey(),
  participantId: integer("participant_id").notNull().references(() => participantsTable.id),
  weekNumber: integer("week_number").notNull(),
  reflectionResponse: text("reflection_response").notNull(),
  integrityCommitment: text("integrity_commitment").notNull(),
  attestationChecked: boolean("attestation_checked").notNull().default(false),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertWeeklySubmissionSchema = createInsertSchema(weeklySubmissionsTable).omit({ id: true, completedAt: true });
export type InsertWeeklySubmission = z.infer<typeof insertWeeklySubmissionSchema>;
export type WeeklySubmission = typeof weeklySubmissionsTable.$inferSelect;

export const aiFeedbackTable = pgTable("ai_feedback", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id").notNull().references(() => weeklySubmissionsTable.id),
  feedbackText: text("feedback_text").notNull(),
  generatedAt: timestamp("generated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAiFeedbackSchema = createInsertSchema(aiFeedbackTable).omit({ id: true, generatedAt: true });
export type InsertAiFeedback = z.infer<typeof insertAiFeedbackSchema>;
export type AiFeedback = typeof aiFeedbackTable.$inferSelect;
