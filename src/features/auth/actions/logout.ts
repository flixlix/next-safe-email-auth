"use server"

import { deleteSessionTokenCookie, invalidateSession } from "@/auth"
import { globalPOSTRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { redirect } from "next/navigation"

export async function logoutAction(): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "Too many requests",
    }
  }

  const { session } = await getCurrentSession()
  if (session === null) {
    return {
      message: "Not authenticated",
    }
  }
  await invalidateSession(session.id)
  await deleteSessionTokenCookie()
  redirect("/login")
}

interface ActionResult {
  message: string
}
