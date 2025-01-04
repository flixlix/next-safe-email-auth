import { bytea } from "@/drizzle/custom-types"
import { userTable } from "@/drizzle/schema"
import { pgTable } from "@/drizzle/table-creator"
import { boolean, integer, text, timestamp } from "drizzle-orm/pg-core"
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
  key: bytea().notNull(),
})

export const insertTotpCredentialSchema = createInsertSchema(totpCredentialTable)
export const totpCredentialSchema = createSelectSchema(totpCredentialTable)

export type InsertTotpCredential = z.infer<typeof insertTotpCredentialSchema>
export type TotpCredential = z.infer<typeof totpCredentialSchema>

/* -- PASSKEY CREDENTIAL -- */

export const passkeyCredentialTable = pgTable("passkey_credential", {
  id: bytea("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  name: text().notNull(),
  algorithm: integer().notNull(),
  publicKey: bytea("public_key").notNull(),
})

export const insertPasskeyCredentialSchema = createInsertSchema(passkeyCredentialTable)
export const passkeyCredentialSchema = createSelectSchema(passkeyCredentialTable)

export type InsertPasskeyCredential = z.infer<typeof insertPasskeyCredentialSchema>
export type PasskeyCredential = z.infer<typeof passkeyCredentialSchema>

/* -- SECURITY KEY CREDENTIAL -- */

export const securityKeyCredentialTable = pgTable("security_key_credential", {
  id: bytea("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  name: text().notNull(),
  algorithm: integer().notNull(),
  publicKey: bytea("public_key").notNull(),
})

export const insertSecurityKeyCredentialSchema = createInsertSchema(securityKeyCredentialTable)
export const securityKeyCredentialSchema = createSelectSchema(securityKeyCredentialTable)

export type InsertSecurityKeyCredential = z.infer<typeof insertSecurityKeyCredentialSchema>
export type SecurityKeyCredential = z.infer<typeof securityKeyCredentialSchema>
