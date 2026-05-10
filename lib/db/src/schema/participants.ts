import { pgTable, serial, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./auth";

export const participantsTable = pgTable("participants", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => usersTable.id),
  clinicianId: varchar("clinician_id").references(() => usersTable.id),
  relationshipStatus: text("relationship_status"),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  acknowledgmentsAccepted: boolean("acknowledgments_accepted").notNull().default(false),
  onboardingCompletedAt: timestamp("onboarding_completed_at", { withTimezone: true }),
  acknowledgmentsAcceptedAt: timestamp("acknowledgments_accepted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertParticipantSchema = createInsertSchema(participantsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
export type Participant = typeof participantsTable.$inferSelect;
