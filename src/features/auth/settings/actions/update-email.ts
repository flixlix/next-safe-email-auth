"use server"

import { checkEmailAvailability, verifyEmailInput } from "@/features/auth/lib/server/email"
import {
  createEmailVerificationRequest,
  sendVerificationEmail,
  sendVerificationEmailBucket,
  setEmailVerificationRequestCookie,
} from "@/features/auth/lib/server/email-verification"
import { globalPOSTRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { redirect } from "next/navigation"

export async function updateEmailAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
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
  if (!sendVerificationEmailBucket.check(user.id, 1)) {
    return {
      message: "Too many requests",
      error: true,
    }
  }

  const email = formData.get("email")
  if (typeof email !== "string") {
    return { message: "Invalid or missing fields", error: true }
  }
  if (email === "") {
    return {
      message: "Please enter your email",
      error: true,
    }
  }
  if (!verifyEmailInput(email)) {
    return {
      message: "Please enter a valid email",
      error: true,
    }
  }
  const emailAvailable = checkEmailAvailability(email)
  if (!emailAvailable) {
    return {
      message: "This email is already used",
      error: true,
    }
  }
  if (!sendVerificationEmailBucket.consume(user.id, 1)) {
    return {
      message: "Too many requests",
      error: true,
    }
  }
  const verificationRequest = await createEmailVerificationRequest(user.id, email)
  await sendVerificationEmail(verificationRequest.email, verificationRequest.code)
  await setEmailVerificationRequestCookie(verificationRequest)
  redirect("/verify-email")
}

interface ActionResult {
  message: string
  error: boolean
}
