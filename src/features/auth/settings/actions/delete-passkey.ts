"use server"

import { globalPOSTRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { deleteUserPasskeyCredential } from "@/features/auth/lib/server/webauthn"
import { decodeBase64 } from "@oslojs/encoding"

export async function deletePasskeyAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
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
  const encodedCredentialId = formData.get("credential_id")
  if (typeof encodedCredentialId !== "string") {
    return {
      message: "Invalid or missing fields",
    }
  }
  let credentialId: Uint8Array
  try {
    credentialId = decodeBase64(encodedCredentialId)
  } catch {
    return {
      message: "Invalid or missing fields",
    }
  }
  const deleted = await deleteUserPasskeyCredential(user.id, credentialId)
  if (!deleted) {
    return {
      message: "Invalid credential ID",
    }
  }
  return {
    message: "Removed credential",
  }
}

interface ActionResult {
  message: string
}
