"use server"

import { globalPOSTRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { deleteUserTOTPKey, totpUpdateBucket } from "@/features/auth/lib/server/totp"

export async function disconnectTOTPAction(): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "Too many requests",
    }
  }

  const { session, user } = await getCurrentSession()
  if (session === null || user === null) {
    return {
      message: "Not authenticated",
    }
  }
  if (!user.emailVerified) {
    return {
      message: "Forbidden",
    }
  }
  if (user.registered2FA && !session.twoFactorVerified) {
    return {
      message: "Forbidden",
    }
  }
  if (!totpUpdateBucket.consume(user.id, 1)) {
    return {
      message: "",
    }
  }
  await deleteUserTOTPKey(user.id)
  return {
    message: "Disconnected authenticator app",
  }
}

interface ActionResult {
  message: string
}
