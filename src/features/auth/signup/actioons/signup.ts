"use server"

import { checkEmailAvailability, verifyEmailInput } from "@/features/auth/lib/server/email"
import {
  createEmailVerificationRequest,
  sendVerificationEmail,
  setEmailVerificationRequestCookie,
} from "@/features/auth/lib/server/email-verification"
import { verifyPasswordStrength } from "@/features/auth/lib/server/password"
import { RefillingTokenBucket } from "@/features/auth/lib/server/rate-limit"
import { globalPOSTRateLimit } from "@/features/auth/lib/server/request"
import { createSession, generateSessionToken, setSessionTokenCookie } from "@/features/auth/lib/server/session"
import { createUser, verifyUsernameInput } from "@/features/auth/lib/server/user"
import { headers as nextHeaders } from "next/headers"
import { redirect } from "next/navigation"

import type { SessionFlags } from "@/features/auth/lib/server/session"

const ipBucket = new RefillingTokenBucket<string>(3, 10)

export async function signupAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const headers = await nextHeaders()
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "Too many requests",
    }
  }

  // TODO: Assumes X-Forwarded-For is always included.
  const clientIP = headers.get("X-Forwarded-For")
  if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
    return {
      message: "Too many requests",
    }
  }

  const email = formData.get("email")
  const username = formData.get("username")
  const password = formData.get("password")
  if (typeof email !== "string" || typeof username !== "string" || typeof password !== "string") {
    return {
      message: "Invalid or missing fields",
    }
  }
  if (email === "" || password === "" || username === "") {
    return {
      message: "Please enter your username, email, and password",
    }
  }
  if (!verifyEmailInput(email)) {
    return {
      message: "Invalid email",
    }
  }
  const emailAvailable = await checkEmailAvailability(email)
  if (!emailAvailable) {
    return {
      message: "Email is already used",
    }
  }
  if (!verifyUsernameInput(username)) {
    return {
      message: "Invalid username",
    }
  }
  const strongPassword = await verifyPasswordStrength(password)
  if (!strongPassword) {
    return {
      message: "Weak password",
    }
  }
  if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
    return {
      message: "Too many requests",
    }
  }
  const user = await createUser(email, username, password)
  const emailVerificationRequest = await createEmailVerificationRequest(user.id, user.email)
  await sendVerificationEmail(emailVerificationRequest.email, emailVerificationRequest.code)
  await setEmailVerificationRequestCookie(emailVerificationRequest)

  const sessionFlags: SessionFlags = {
    twoFactorVerified: false,
  }
  const sessionToken = generateSessionToken()
  const session = await createSession(sessionToken, user.id, sessionFlags)
  await setSessionTokenCookie(sessionToken, session.expiresAt)
  return redirect("/2fa/setup")
}

interface ActionResult {
  message: string
}
