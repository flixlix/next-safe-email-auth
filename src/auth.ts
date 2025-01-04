import { sha256 } from "@oslojs/crypto/sha2"
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding"
import { eq } from "drizzle-orm"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { cookies } from "next/headers"
import "server-only"
import { db } from "./drizzle/db"
import { type Session, sessionTable, type User, userTable } from "./drizzle/schema"

const dev = process.env.NODE_ENV === "development"

const SESSION_COOKIE_NAME = "auth_session" as const

export const validateRequest = async (): Promise<SessionValidationResult> => {
  const cookieStore = await cookies()

  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null
  if (sessionId === null) {
    return {
      user: null,
      session: null,
    }
  }

  const result = await dbValidateUser(sessionId)
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session) {
      await setSessionTokenCookie(sessionId, result.session.expiresAt)
    }
    if (!result.session) {
      await deleteSessionTokenCookie()
    }
  } catch {}
  return result
}

const dbValidateUser = async (
  sessionId: string
): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
  "use cache"
  const result = await validateSessionToken(sessionId)
  cacheTag("user")
  cacheTag(`user:${result.user?.id}`)

  return result
}

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  const token = encodeBase32LowerCaseNoPadding(bytes)
  return token
}

export async function createSession(token: string, userId: User["id"]): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    twoFactorVerified: false,
  }
  await db.insert(sessionTable).values(session)
  return session
}

export async function setSessionTokenCookie(token: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    secure: !dev,
    sameSite: "lax",
    expires: expiresAt,
  })
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const result = await db
    .select({ user: userTable, session: sessionTable })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId))
  if (result.length < 1) {
    return { session: null, user: null }
  }
  const { user, session } = result[0]
  const sessionExpired = Date.now() >= session.expiresAt.getTime()
  if (sessionExpired) {
    await invalidateSession(session.id)
    return { session: null, user: null }
  }

  const closeToExpireDays = 15
  const closeToExpiration = Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * closeToExpireDays
  if (closeToExpiration) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    await db
      .update(sessionTable)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessionTable.id, session.id))
  }
  return { session, user }
}

export async function invalidateSession(sessionId: Session["id"]): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId))
}

export async function invalidateUserSessions(userId: User["id"]): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.userId, userId))
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies()
  const blankSessionCookie = ""
  cookieStore.set(SESSION_COOKIE_NAME, blankSessionCookie, {
    httpOnly: true,
    path: "/",
    secure: !dev,
    sameSite: "lax",
    maxAge: 0,
  })
}

export function generateIdFromEntropySize(size: number): string {
  const buffer = crypto.getRandomValues(new Uint8Array(size))
  return encodeBase32LowerCaseNoPadding(buffer)
}

export type SessionValidationResult = { session: Session; user: User } | { session: null; user: null }
