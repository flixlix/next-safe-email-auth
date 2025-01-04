"use server"

import {
  createEmailVerificationRequest,
  getCurrentUserEmailVerificationRequest,
  sendVerificationEmail,
  sendVerificationEmailBucket,
  setEmailVerificationRequestCookie,
} from "@/features/auth/lib/server/email-verification"
import { globalPOSTRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"

export async function resendEmailVerificationCodeAction(): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "Too many requests",
    }
  }

  const { session, user } = await getCurrentSession()
  if (session === null) {
    return {
      message: "Not authenticated",
    }
  }
  if (user.registered2FA && !session.twoFactorVerified) {
    return {
      message: "Forbidden",
    }
  }
  if (!sendVerificationEmailBucket.check(user.id, 1)) {
    return {
      message: "Too many requests",
    }
  }
  let verificationRequest = await getCurrentUserEmailVerificationRequest()
  if (verificationRequest === null) {
    if (user.emailVerified) {
      return {
        message: "Forbidden",
      }
    }
    if (!sendVerificationEmailBucket.consume(user.id, 1)) {
      return {
        message: "Too many requests",
      }
    }
    verificationRequest = await createEmailVerificationRequest(user.id, user.email)
  } else {
    if (!sendVerificationEmailBucket.consume(user.id, 1)) {
      return {
        message: "Too many requests",
      }
    }
    verificationRequest = await createEmailVerificationRequest(user.id, verificationRequest.email)
  }
  await sendVerificationEmail(verificationRequest.email, verificationRequest.code)
  await setEmailVerificationRequestCookie(verificationRequest)
  return {
    message: "A new code was sent to your inbox.",
  }
}

interface ActionResult {
  message: string
}
