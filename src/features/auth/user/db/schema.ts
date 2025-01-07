import { pgTable } from "@/drizzle/table-creator"
import { createdAt, updatedAt } from "@/drizzle/utils"
import { boolean, text } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const authPlatformSchema = z.enum(["email", "google"])
export type AuthPlatform = z.infer<typeof authPlatformSchema>

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  email: text().notNull().unique(),
  username: text().notNull(),
  passwordHash: text().notNull(),
  emailVerified: boolean().notNull().default(false),
  recoveryCode: text("recovery_code").notNull(),
  created_at: createdAt,
  updatedAt: updatedAt,
  authPlatform: text("auth_platform").notNull().default("email").$type<AuthPlatform>(),
})

export const insertUserSchema = createInsertSchema(userTable, {
  authPlatform: authPlatformSchema.optional(),
})
export const userSchema = createSelectSchema(userTable, {
  authPlatform: authPlatformSchema,
})

export type InsertUser = z.infer<typeof insertUserSchema>
export type User = z.infer<typeof userSchema>
