"use server"

import { globalPOSTRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { resetUserRecoveryCode } from "@/features/auth/lib/server/user"

export async function regenerateRecoveryCodeAction(): Promise<RegenerateRecoveryCodeActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      error: "Too many requests",
      recoveryCode: null,
    }
  }

  const { session, user } = await getCurrentSession()
  if (session === null || user === null) {
    return {
      error: "Not authenticated",
      recoveryCode: null,
    }
  }
  if (!user.emailVerified) {
    return {
      error: "Forbidden",
      recoveryCode: null,
    }
  }
  if (!session.twoFactorVerified) {
    return {
      error: "Forbidden",
      recoveryCode: null,
    }
  }
  const recoveryCode = await resetUserRecoveryCode(session.userId)
  return {
    error: null,
    recoveryCode,
  }
}

type RegenerateRecoveryCodeActionResult =
  | {
      error: string
      recoveryCode: null
    }
  | {
      error: null
      recoveryCode: string
    }
