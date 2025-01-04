import { userTable } from "@/drizzle/schema"
import { pgTable } from "@/drizzle/table-creator"
import { boolean, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { type z } from "zod"

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  twoFactorVerified: boolean("two_factor_verified").notNull().default(false),
})

export const insertSessionSchema = createInsertSchema(sessionTable)
export const sessionSchema = createSelectSchema(sessionTable)

export type InsertSession = z.infer<typeof insertSessionSchema>
export type Session = z.infer<typeof sessionSchema>
