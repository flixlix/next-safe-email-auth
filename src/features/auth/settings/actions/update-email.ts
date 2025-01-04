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

  const email = formData.get("email")
  if (typeof email !== "string") {
    return { message: "Invalid or missing fields" }
  }
  if (email === "") {
    return {
      message: "Please enter your email",
    }
  }
  if (!verifyEmailInput(email)) {
    return {
      message: "Please enter a valid email",
    }
  }
  const emailAvailable = checkEmailAvailability(email)
  if (!emailAvailable) {
    return {
      message: "This email is already used",
    }
  }
  if (!sendVerificationEmailBucket.consume(user.id, 1)) {
    return {
      message: "Too many requests",
    }
  }
  const verificationRequest = await createEmailVerificationRequest(user.id, email)
  await sendVerificationEmail(verificationRequest.email, verificationRequest.code)
  await setEmailVerificationRequestCookie(verificationRequest)
  return redirect("/verify-email")
}

interface ActionResult {
  message: string
}
