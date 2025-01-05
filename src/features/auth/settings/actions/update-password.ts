"use server"

import { verifyPasswordHash, verifyPasswordStrength } from "@/features/auth/lib/server/password"
import { ExpiringTokenBucket } from "@/features/auth/lib/server/rate-limit"
import { globalPOSTRateLimit } from "@/features/auth/lib/server/request"
import type { SessionFlags } from "@/features/auth/lib/server/session"
import {
  createSession,
  generateSessionToken,
  getCurrentSession,
  invalidateUserSessions,
  setSessionTokenCookie,
} from "@/features/auth/lib/server/session"
import { getUserPasswordHash, updateUserPassword } from "@/features/auth/lib/server/user"

const passwordUpdateBucket = new ExpiringTokenBucket<string>(5, 60 * 30)

export async function updatePasswordAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  if (!globalPOSTRateLimit()) {
    return {
      message: "Too many requests",
      error: true,
    }
  }

  const { session, user } = await getCurrentSession()
  if (session === null) {
    return {
      message: "Not authenticated",
      error: true,
    }
  }
  if (user.registered2FA && !session.twoFactorVerified) {
    return {
      message: "Forbidden",
      error: true,
    }
  }
  if (!passwordUpdateBucket.check(session.id, 1)) {
    return {
      message: "Too many requests",
      error: true,
    }
  }

  const password = formData.get("password")
  const newPassword = formData.get("new_password")
  const newPasswordConfirm = formData.get("confirm_password")
  if (typeof password !== "string" || typeof newPassword !== "string" || typeof newPasswordConfirm !== "string") {
    return {
      message: "Invalid or missing fields",
      error: true,
    }
  }
  if (newPassword !== newPasswordConfirm) {
    return {
      message: "Passwords do not match",
      error: true,
    }
  }
  const strongPassword = await verifyPasswordStrength(newPassword)
  if (!strongPassword) {
    return {
      message: "Weak password",
      error: true,
    }
  }
  if (!passwordUpdateBucket.consume(session.id, 1)) {
    return {
      message: "Too many requests",
      error: true,
    }
  }
  const passwordHash = await getUserPasswordHash(user.id)
  const validPassword = await verifyPasswordHash(passwordHash, password)
  if (!validPassword) {
    return {
      message: "Incorrect password",
      error: true,
    }
  }
  passwordUpdateBucket.reset(session.id)
  await invalidateUserSessions(user.id)
  await updateUserPassword(user.id, newPassword)

  const sessionToken = generateSessionToken()
  const sessionFlags: SessionFlags = {
    twoFactorVerified: session.twoFactorVerified,
  }
  const newSession = await createSession(sessionToken, user.id, sessionFlags)
  await setSessionTokenCookie(sessionToken, newSession.expiresAt)
  return {
    message: "Updated password",
    error: false,
  }
}

interface ActionResult {
  message: string
  error: boolean
}
