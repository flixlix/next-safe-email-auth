import { env } from "@/data/env/server"
import { db } from "@/drizzle/db"
import { type EmailVerificationRequest, emailVerificationRequestTable, type User } from "@/drizzle/schema"
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding"
import { and, eq } from "drizzle-orm"
import { cookies as nextCookies } from "next/headers"
import { cache } from "react"
import { ExpiringTokenBucket } from "./rate-limit"
import { getCurrentSession } from "./session"
import { generateRandomOTP } from "./utils"

export async function getUserEmailVerificationRequest(
  userId: User["id"],
  id: string
): Promise<EmailVerificationRequest | null> {
  const result = await db
    .select()
    .from(emailVerificationRequestTable)
    .where(and(eq(emailVerificationRequestTable.id, id), eq(emailVerificationRequestTable.userId, userId)))
    .limit(1)
  const row = result[0]
  if (row === null || row === undefined) {
    return row
  }
  const request: EmailVerificationRequest = {
    id: row.id,
    userId: row.userId,
    code: row.code,
    email: row.email,
    expiresAt: row.expiresAt,
  }
  return request
}

export async function createEmailVerificationRequest(
  userId: User["id"],
  email: string
): Promise<EmailVerificationRequest> {
  deleteUserEmailVerificationRequest(userId)
  const idBytes = new Uint8Array(20)
  crypto.getRandomValues(idBytes)
  const id = encodeBase32LowerCaseNoPadding(idBytes)

  const code = generateRandomOTP()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10)
  await db.insert(emailVerificationRequestTable).values({
    id,
    userId,
    code,
    email,
    expiresAt,
  })

  const request: EmailVerificationRequest = {
    id,
    userId,
    code,
    email,
    expiresAt,
  }
  return request
}

export async function deleteUserEmailVerificationRequest(userId: User["id"]): Promise<void> {
  await db.delete(emailVerificationRequestTable).where(eq(emailVerificationRequestTable.userId, userId))
}

export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  await fetch(`${env.DOMAIN}/api/verification-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      code,
    }),
  })
}

export async function setEmailVerificationRequestCookie(request: EmailVerificationRequest): Promise<void> {
  const cookies = await nextCookies()
  cookies.set("email_verification", request.id, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: request.expiresAt,
  })
}

export async function deleteEmailVerificationRequestCookie(): Promise<void> {
  const cookies = await nextCookies()
  cookies.set("email_verification", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  })
}

export const getCurrentUserEmailVerificationRequest = cache(async () => {
  const cookies = await nextCookies()
  const { user } = await getCurrentSession()
  if (user === null) {
    return null
  }
  const id = cookies.get("email_verification")?.value ?? null
  if (id === null) {
    return null
  }
  const request = await getUserEmailVerificationRequest(user.id, id)
  if (request === null) {
    await deleteEmailVerificationRequestCookie()
  }
  return request
})

export const sendVerificationEmailBucket = new ExpiringTokenBucket<User["id"]>(3, 60 * 10)
