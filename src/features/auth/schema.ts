import { userTable } from "@/drizzle/schema"
import { pgTable } from "@/drizzle/table-creator"
import { boolean, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { type z } from "zod"

/* -- EMAIL VERIFICATION REQUEST -- */

export const emailVerificationRequestTable = pgTable("email_verification_request", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  email: text().notNull(),
  code: text().notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
})

export const insertEmailVerificationRequestSchema = createInsertSchema(emailVerificationRequestTable)
export const emailVerificationRequestSchema = createSelectSchema(emailVerificationRequestTable)

export type InsertEmailVerificationRequest = z.infer<typeof insertEmailVerificationRequestSchema>
export type EmailVerificationRequest = z.infer<typeof emailVerificationRequestSchema>

/* -- PASSWORD RESET SESSION -- */

export const passwordResetSessionTable = pgTable("password_reset_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  email: text().notNull(),
  code: text().notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  twoFactorVerified: boolean("two_factor_verified").notNull().default(false),
})

export const insertPasswordResetSessionSchema = createInsertSchema(passwordResetSessionTable)
export const passwordResetSessionSchema = createSelectSchema(passwordResetSessionTable)

export type InsertPasswordResetSession = z.infer<typeof insertPasswordResetSessionSchema>
export type PasswordResetSession = z.infer<typeof passwordResetSessionSchema>

/* -- TOTP CREDENTIAL -- */

export const totpCredentialTable = pgTable("totp_credential", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  key: text().notNull(),
})

export const insertTotpCredentialSchema = createInsertSchema(totpCredentialTable)
export const totpCredentialSchema = createSelectSchema(totpCredentialTable)

export type InsertTotpCredential = z.infer<typeof insertTotpCredentialSchema>
export type TotpCredential = z.infer<typeof totpCredentialSchema>
