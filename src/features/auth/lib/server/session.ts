import { db } from "@/drizzle/db"
import {
  passkeyCredentialTable,
  securityKeyCredentialTable,
  type Session,
  sessionTable,
  totpCredentialTable,
  userTable,
} from "@/drizzle/schema"
import { sha256 } from "@oslojs/crypto/sha2"
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding"
import { eq } from "drizzle-orm"
import { cookies as nextCookies } from "next/headers"
import { cache } from "react"
import { type User } from "./user"

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

  const result = await db
    .select({
      sessionId: sessionTable.id,
      sessionUserId: sessionTable.userId,
      sessionExpiresAt: sessionTable.expiresAt,
      sessionTwoFactorVerified: sessionTable.twoFactorVerified,
      userId: userTable.id,
      userEmail: userTable.email,
      userUsername: userTable.username,
      userEmailVerified: userTable.emailVerified,
      registeredTOTP: totpCredentialTable.id,
      registeredPasskey: passkeyCredentialTable.id,
      registeredSecurityKey: securityKeyCredentialTable.id,
    })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .leftJoin(totpCredentialTable, eq(userTable.id, totpCredentialTable.userId))
    .leftJoin(passkeyCredentialTable, eq(userTable.id, passkeyCredentialTable.userId))
    .leftJoin(securityKeyCredentialTable, eq(userTable.id, securityKeyCredentialTable.userId))
    .where(eq(sessionTable.id, sessionId))
    .limit(1)
  const row = result[0]

  if (row === null || row === undefined) {
    return { session: null, user: null }
  }
  const session: Session = {
    id: row.sessionId,
    userId: row.userId,
    expiresAt: row.sessionExpiresAt,
    twoFactorVerified: row.sessionTwoFactorVerified,
  }
  const user: User = {
    id: row.userId,
    email: row.userEmail,
    username: row.userUsername,
    emailVerified: row.userEmailVerified,
    registeredTOTP: Boolean(row.registeredTOTP),
    registeredPasskey: Boolean(row.registeredPasskey),
    registeredSecurityKey: Boolean(row.registeredSecurityKey),
    registered2FA: false,
  }
  if (user.registeredPasskey || user.registeredSecurityKey || user.registeredTOTP) {
    user.registered2FA = true
  }
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId))
    return { session: null, user: null }
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    await db.update(sessionTable).set({ expiresAt: session.expiresAt }).where(eq(sessionTable.id, sessionId))
  }
  return { session, user }
}

export const getCurrentSession = cache(async (): Promise<SessionValidationResult> => {
  const cookies = await nextCookies()
  const token = cookies.get("session")?.value ?? null
  if (token === null) {
    return { session: null, user: null }
  }
  const result = validateSessionToken(token)
  return result
})

export async function invalidateSession(sessionId: Session["id"]): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId))
}

export async function invalidateUserSessions(userId: User["id"]): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.userId, userId))
}

export async function setSessionTokenCookie(token: string, expiresAt: Date): Promise<void> {
  const cookies = await nextCookies()
  cookies.set("session", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  })
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookies = await nextCookies()
  cookies.set("session", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  })
}

export function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20)
  crypto.getRandomValues(tokenBytes)
  const token = encodeBase32LowerCaseNoPadding(tokenBytes)
  return token
}

export async function createSession(token: string, userId: User["id"], flags: SessionFlags): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    twoFactorVerified: flags.twoFactorVerified,
  }
  await db.insert(sessionTable).values(session)
  return session
}

export async function setSessionAs2FAVerified(sessionId: string): Promise<void> {
  await db.update(sessionTable).set({ twoFactorVerified: true }).where(eq(sessionTable.id, sessionId))
}

export type SessionFlags = Pick<Session, "twoFactorVerified">

export type SessionValidationResult = { session: Session; user: User } | { session: null; user: null }
