import { db } from "@/drizzle/db"
import { userTable } from "@/drizzle/schema"
import { sha256 } from "@oslojs/crypto/sha2"
import { encodeHexLowerCase } from "@oslojs/encoding"
import { eq } from "drizzle-orm"
import { cookies as nextCookies } from "next/headers"
import { cache } from "react"
import {
  passkeyCredentialTable,
  type PasswordResetSession,
  passwordResetSessionTable,
  securityKeyCredentialTable,
  totpCredentialTable,
} from "../../schema"
import type { User } from "./user"
import { generateRandomOTP } from "./utils"

export async function createPasswordResetSession(
  token: string,
  userId: User["id"],
  email: string
): Promise<PasswordResetSession> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const session: PasswordResetSession = {
    id: sessionId,
    userId,
    email,
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    code: generateRandomOTP(),
    emailVerified: false,
    twoFactorVerified: false,
  }
  await db.insert(passwordResetSessionTable).values(session)
  return session
}

export async function validatePasswordResetSessionToken(token: string): Promise<PasswordResetSessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const result = await db
    .select({
      sessionId: passwordResetSessionTable.id,
      sessionUserId: passwordResetSessionTable.userId,
      sessionEmail: passwordResetSessionTable.email,
      sessionCode: passwordResetSessionTable.code,
      sessionExpiresAt: passwordResetSessionTable.expiresAt,
      sessionEmailVerified: passwordResetSessionTable.emailVerified,
      sessionTwoFactorVerified: passwordResetSessionTable.twoFactorVerified,
      userId: userTable.id,
      userEmail: userTable.email,
      userUsername: userTable.username,
      userEmailVerified: userTable.emailVerified,
      registeredTOTP: totpCredentialTable.id,
      registeredPasskey: passkeyCredentialTable.id,
      registeredSecurityKey: securityKeyCredentialTable.id,
    })
    .from(passwordResetSessionTable)
    .innerJoin(userTable, eq(passwordResetSessionTable.userId, userTable.id))
    .leftJoin(totpCredentialTable, eq(userTable.id, totpCredentialTable.userId))
    .leftJoin(passkeyCredentialTable, eq(userTable.id, passkeyCredentialTable.userId))
    .leftJoin(securityKeyCredentialTable, eq(userTable.id, securityKeyCredentialTable.userId))
    .where(eq(passwordResetSessionTable.id, sessionId))
    .limit(1)

  if (result === null) {
    return { session: null, user: null }
  }
  const row = result[0]
  const session: PasswordResetSession = {
    id: row.sessionId,
    userId: row.sessionUserId,
    email: row.sessionEmail,
    code: row.sessionCode,
    expiresAt: new Date(row.sessionExpiresAt),
    emailVerified: Boolean(row.sessionEmailVerified),
    twoFactorVerified: Boolean(row.sessionTwoFactorVerified),
  }

  const user: User = {
    id: row.userId,
    email: row.userEmail,
    username: row.userUsername,
    emailVerified: Boolean(row.userEmailVerified),
    registeredTOTP: Boolean(row.registeredTOTP),
    registeredPasskey: Boolean(row.registeredPasskey),
    registeredSecurityKey: Boolean(row.registeredSecurityKey),
    registered2FA: false,
  }

  if (user.registeredPasskey || user.registeredSecurityKey || user.registeredTOTP) {
    user.registered2FA = true
  }

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(passwordResetSessionTable).where(eq(passwordResetSessionTable.id, session.id))
    return { session: null, user: null }
  }

  return { session, user }
}

export async function setPasswordResetSessionAsEmailVerified(sessionId: string): Promise<void> {
  await db
    .update(passwordResetSessionTable)
    .set({ emailVerified: true })
    .where(eq(passwordResetSessionTable.id, sessionId))
}

export async function setPasswordResetSessionAs2FAVerified(sessionId: string): Promise<void> {
  await db
    .update(passwordResetSessionTable)
    .set({ twoFactorVerified: true })
    .where(eq(passwordResetSessionTable.id, sessionId))
}

export async function invalidateUserPasswordResetSessions(userId: string): Promise<void> {
  await db.delete(passwordResetSessionTable).where(eq(passwordResetSessionTable.userId, userId))
}

export const getCurrentPasswordResetSession = cache(async () => {
  const cookies = await nextCookies()
  const token = cookies.get("password_reset_session")?.value ?? null
  if (token === null) {
    return { session: null, user: null }
  }
  const result = await validatePasswordResetSessionToken(token)
  if (result.session === null) {
    deletePasswordResetSessionTokenCookie()
  }
  return result
})

export async function setPasswordResetSessionTokenCookie(token: string, expiresAt: Date): Promise<void> {
  const cookies = await nextCookies()
  cookies.set("password_reset_session", token, {
    expires: expiresAt,
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  })
}

export async function deletePasswordResetSessionTokenCookie(): Promise<void> {
  const cookies = await nextCookies()
  cookies.set("password_reset_session", "", {
    maxAge: 0,
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  })
}

export async function sendPasswordResetEmail(email: string, code: string): Promise<void> {
  console.log(`To ${email}: Your reset code is ${code}`)
}

export type PasswordResetSessionValidationResult =
  | { session: PasswordResetSession; user: User }
  | { session: null; user: null }
