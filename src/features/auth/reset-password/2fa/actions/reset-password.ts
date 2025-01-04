"use server"

import { verifyPasswordStrength } from "@/features/auth/lib/server/password"
import {
  deletePasswordResetSessionTokenCookie,
  getCurrentPasswordResetSession,
  invalidateUserPasswordResetSessions,
} from "@/features/auth/lib/server/password-reset"
import { globalPOSTRateLimit } from "@/features/auth/lib/server/request"
import {
  createSession,
  generateSessionToken,
  invalidateUserSessions,
  setSessionTokenCookie,
} from "@/features/auth/lib/server/session"
import { updateUserPassword } from "@/features/auth/lib/server/user"
import { redirect } from "next/navigation"

import type { SessionFlags } from "@/features/auth/lib/server/session"

export async function resetPasswordAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "Too many requests",
    }
  }

  const { session: passwordResetSession, user } = await getCurrentPasswordResetSession()
  if (passwordResetSession === null) {
    return {
      message: "Not authenticated",
    }
  }
  if (!passwordResetSession.emailVerified) {
    return {
      message: "Forbidden",
    }
  }
  if (user.registered2FA && !passwordResetSession.twoFactorVerified) {
    return {
      message: "Forbidden",
    }
  }

  const password = formData.get("password")
  if (typeof password !== "string") {
    return {
      message: "Invalid or missing fields",
    }
  }

  const strongPassword = await verifyPasswordStrength(password)
  if (!strongPassword) {
    return {
      message: "Weak password",
    }
  }
  await invalidateUserPasswordResetSessions(passwordResetSession.userId)
  await invalidateUserSessions(passwordResetSession.userId)
  await updateUserPassword(passwordResetSession.userId, password)

  const sessionFlags: SessionFlags = {
    twoFactorVerified: passwordResetSession.twoFactorVerified,
  }
  const sessionToken = generateSessionToken()
  const session = await createSession(sessionToken, user.id, sessionFlags)
  await setSessionTokenCookie(sessionToken, session.expiresAt)
  await deletePasswordResetSessionTokenCookie()
  redirect("/")
}

interface ActionResult {
  message: string
}
