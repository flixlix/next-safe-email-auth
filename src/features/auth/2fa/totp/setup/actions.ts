"use server"

import { type User } from "@/drizzle/schema"
import { RefillingTokenBucket } from "@/features/auth/lib/server/rate-limit"
import { globalPOSTRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession, setSessionAs2FAVerified } from "@/features/auth/lib/server/session"
import { updateUserTOTPKey } from "@/features/auth/lib/server/totp"
import { decodeBase64 } from "@oslojs/encoding"
import { verifyTOTP } from "@oslojs/otp"
import { redirect } from "next/navigation"

const totpUpdateBucket = new RefillingTokenBucket<User["id"]>(3, 60 * 10)

export async function setup2FAAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
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
  if (!totpUpdateBucket.check(user.id, 1)) {
    return {
      message: "Too many requests",
    }
  }

  const encodedKey = formData.get("key")
  const code = formData.get("code")
  if (typeof encodedKey !== "string" || typeof code !== "string") {
    return {
      message: "Invalid or missing fields",
    }
  }
  if (code === "") {
    return {
      message: "Please enter your code",
    }
  }
  if (encodedKey.length !== 28) {
    return {
      message: "Please enter your code",
    }
  }
  let key: Uint8Array
  try {
    key = decodeBase64(encodedKey)
  } catch {
    return {
      message: "Invalid key",
    }
  }
  if (key.byteLength !== 20) {
    return {
      message: "Invalid key",
    }
  }
  if (!totpUpdateBucket.consume(user.id, 1)) {
    return {
      message: "Too many requests",
    }
  }
  if (!verifyTOTP(key, 30, 6, code)) {
    return {
      message: "Invalid code",
    }
  }
  await updateUserTOTPKey(session.userId, key)
  await setSessionAs2FAVerified(session.id)
  if (!user.registered2FA) {
    return redirect("/recovery-code")
  }
  return redirect("/")
}

interface ActionResult {
  message: string
}
