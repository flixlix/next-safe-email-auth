"use server"

import { type User } from "@/drizzle/schema"
import {
  getCurrentPasswordResetSession,
  setPasswordResetSessionAsEmailVerified,
} from "@/features/auth/lib/server/password-reset"
import { ExpiringTokenBucket } from "@/features/auth/lib/server/rate-limit"
import { globalPOSTRateLimit } from "@/features/auth/lib/server/request"
import { setUserAsEmailVerifiedIfEmailMatches } from "@/features/auth/lib/server/user"
import { redirect } from "next/navigation"

const emailVerificationBucket = new ExpiringTokenBucket<User["id"]>(5, 60 * 30)

export async function verifyPasswordResetEmailAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "Too many requests",
    }
  }

  const { session } = await getCurrentPasswordResetSession()
  if (session === null) {
    return {
      message: "Not authenticated",
    }
  }
  if (session.emailVerified) {
    return {
      message: "Forbidden",
    }
  }
  if (!emailVerificationBucket.check(session.userId, 1)) {
    return {
      message: "Too many requests",
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
      message: "Please enter your code",
    }
  }
  if (!emailVerificationBucket.consume(session.userId, 1)) {
    return { message: "Too many requests" }
  }
  if (code !== session.code) {
    return {
      message: "Incorrect code",
    }
  }
  emailVerificationBucket.reset(session.userId)
  await setPasswordResetSessionAsEmailVerified(session.id)
  const emailMatches = await setUserAsEmailVerifiedIfEmailMatches(session.userId, session.email)
  if (!emailMatches) {
    return {
      message: "Please restart the process",
    }
  }
  redirect("/reset-password/2fa")
}

interface ActionResult {
  message: string
}
