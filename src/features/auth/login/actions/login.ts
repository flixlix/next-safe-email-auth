"use server"

import { type User } from "@/drizzle/schema"
import { get2FARedirect } from "@/features/auth/lib/server/2fa"
import { verifyEmailInput } from "@/features/auth/lib/server/email"
import { verifyPasswordHash } from "@/features/auth/lib/server/password"
import { RefillingTokenBucket, Throttler } from "@/features/auth/lib/server/rate-limit"
import { globalPOSTRateLimit } from "@/features/auth/lib/server/request"
import type { SessionFlags } from "@/features/auth/lib/server/session"
import { createSession, generateSessionToken, setSessionTokenCookie } from "@/features/auth/lib/server/session"
import { getUserFromEmail, getUserPasswordHash } from "@/features/auth/lib/server/user"
import { headers as nextHeaders } from "next/headers"
import { redirect } from "next/navigation"

const throttler = new Throttler<User["id"]>([1, 2, 4, 8, 16, 30, 60, 180, 300])
const ipBucket = new RefillingTokenBucket<string>(20, 1)

export async function loginAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const headers = await nextHeaders()
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "Too many requests",
    }
  }
  // TODO: Assumes X-Forwarded-For is always included.
  const clientIP = headers.get("X-Forwarded-For")
  if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
    return {
      message: "Too many requests",
    }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  if (typeof email !== "string" || typeof password !== "string") {
    return {
      message: "Invalid or missing fields",
    }
  }
  if (email === "" || password === "") {
    return {
      message: "Please enter your email and password.",
    }
  }
  if (!verifyEmailInput(email)) {
    return {
      message: "Invalid email",
    }
  }
  const user = await getUserFromEmail(email)
  if (user === null) {
    return {
      message: "Account does not exist",
    }
  }
  if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
    return {
      message: "Too many requests",
    }
  }
  if (!throttler.consume(user.id)) {
    return {
      message: "Too many requests",
    }
  }
  const passwordHash = await getUserPasswordHash(user.id)
  const validPassword = await verifyPasswordHash(passwordHash, password)
  if (!validPassword) {
    return {
      message: "Invalid password",
    }
  }
  throttler.reset(user.id)
  const sessionFlags: SessionFlags = {
    twoFactorVerified: false,
  }
  const sessionToken = generateSessionToken()
  const session = await createSession(sessionToken, user.id, sessionFlags)
  await setSessionTokenCookie(sessionToken, session.expiresAt)

  if (!user.emailVerified) {
    redirect("/verify-email")
  }
  if (!user.registered2FA) {
    redirect("/2fa/totp/setup")
  }
  redirect(get2FARedirect(user))
}
interface ActionResult {
  message: string
}
