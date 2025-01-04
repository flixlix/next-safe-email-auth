import { db } from "@/drizzle/db"
import { userTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

export function verifyEmailInput(email: string): boolean {
  return z.string().email().max(255).safeParse(email).success
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
  const result = await db.select().from(userTable).where(eq(userTable.email, email))

  return result.length === 0
}
