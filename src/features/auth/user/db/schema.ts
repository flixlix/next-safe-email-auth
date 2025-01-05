import { pgTable } from "@/drizzle/table-creator"
import { boolean, text } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { type z } from "zod"

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  email: text().notNull().unique(),
  username: text().notNull(),
  passwordHash: text().notNull(),
  emailVerified: boolean().notNull().default(false),
  recoveryCode: text("recovery_code").notNull(),
})

export const insertUserSchema = createInsertSchema(userTable)
export const userSchema = createSelectSchema(userTable)

export type InsertUser = z.infer<typeof insertUserSchema>
export type User = z.infer<typeof userSchema>
