"use server"

import { type User } from "@/drizzle/schema"
import { verifyEmailInput } from "@/features/auth/lib/server/email"
import {
  createPasswordResetSession,
  invalidateUserPasswordResetSessions,
  sendPasswordResetEmail,
  setPasswordResetSessionTokenCookie,
} from "@/features/auth/lib/server/password-reset"
import { RefillingTokenBucket } from "@/features/auth/lib/server/rate-limit"
import { globalPOSTRateLimit } from "@/features/auth/lib/server/request"
import { generateSessionToken } from "@/features/auth/lib/server/session"
import { getUserFromEmail } from "@/features/auth/lib/server/user"
import { headers as nextHeaders } from "next/headers"
import { redirect } from "next/navigation"

const passwordResetEmailIPBucket = new RefillingTokenBucket<string>(3, 60)
const passwordResetEmailUserBucket = new RefillingTokenBucket<User["id"]>(3, 60)

export async function forgotPasswordAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const headers = await nextHeaders()
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "Too many requests",
    }
  }

  // TODO: Assumes X-Forwarded-For is always included.
  const clientIP = headers.get("X-Forwarded-For")
  if (clientIP !== null && !passwordResetEmailIPBucket.check(clientIP, 1)) {
    return {
      message: "Too many requests",
    }
  }

  const email = formData.get("email")
  if (typeof email !== "string") {
    return {
      message: "Invalid or missing fields",
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
  if (clientIP !== null && !passwordResetEmailIPBucket.consume(clientIP, 1)) {
    return {
      message: "Too many requests",
    }
  }
  if (!passwordResetEmailUserBucket.consume(user.id, 1)) {
    return {
      message: "Too many requests",
    }
  }
  await invalidateUserPasswordResetSessions(user.id)
  const sessionToken = generateSessionToken()
  const session = await createPasswordResetSession(sessionToken, user.id, user.email)

  await sendPasswordResetEmail(session.email, session.code)
  await setPasswordResetSessionTokenCookie(sessionToken, session.expiresAt)
  redirect("/reset-password/verify-email")
}

interface ActionResult {
  message: string
}
