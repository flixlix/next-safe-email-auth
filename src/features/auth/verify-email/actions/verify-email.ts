"use server"

import { type User } from "@/drizzle/schema"
import {
  createEmailVerificationRequest,
  deleteEmailVerificationRequestCookie,
  deleteUserEmailVerificationRequest,
  getCurrentUserEmailVerificationRequest,
  sendVerificationEmail,
} from "@/features/auth/lib/server/email-verification"
import { invalidateUserPasswordResetSessions } from "@/features/auth/lib/server/password-reset"
import { ExpiringTokenBucket } from "@/features/auth/lib/server/rate-limit"
import { globalPOSTRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { updateUserEmailAndSetEmailAsVerified } from "@/features/auth/lib/server/user"
import { redirect } from "next/navigation"

const bucket = new ExpiringTokenBucket<User["id"]>(5, 60 * 30)

export async function verifyEmailAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
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
  if (!bucket.check(user.id, 1)) {
    return {
      message: "Too many requests",
    }
  }

  let verificationRequest = await getCurrentUserEmailVerificationRequest()
  if (verificationRequest === null) {
    return {
      message: "Not authenticated",
    }
  }
  const code = formData.get("code")
  if (typeof code !== "string") {
    return {
      message: "Invalid or missing fields",
    }
  }
  if (code === "") {
    return {
      message: "Enter your code",
    }
  }
  if (!bucket.consume(user.id, 1)) {
    return {
      message: "Too many requests",
    }
  }
  if (Date.now() >= verificationRequest.expiresAt.getTime()) {
    verificationRequest = await createEmailVerificationRequest(verificationRequest.userId, verificationRequest.email)
    await sendVerificationEmail(verificationRequest.email, verificationRequest.code)
    return {
      message: "The verification code was expired. We sent another code to your inbox.",
    }
  }
  if (verificationRequest.code !== code) {
    return {
      message: "Incorrect code.",
    }
  }
  await deleteUserEmailVerificationRequest(user.id)
  await invalidateUserPasswordResetSessions(user.id)
  await updateUserEmailAndSetEmailAsVerified(user.id, verificationRequest.email)
  await deleteEmailVerificationRequestCookie()
  if (!user.registered2FA) {
    return redirect("/2fa/setup")
  }
  return redirect("/")
}

interface ActionResult {
  message: string
}
