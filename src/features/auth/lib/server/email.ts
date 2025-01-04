import { db } from "@/drizzle/db"
import { userTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

export function verifyEmailInput(email: string): boolean {
  //   return /^.+@.+\..+$/.test(email) && email.length < 256
  return z.string().email().max(255).safeParse(email).success
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
  const result = await db
    .select({
      count: db.$count(userTable.id),
    })
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1)

  const row = result[0]
  if (row === null || row === undefined) {
    throw new Error()
  }
  return row.count === 0
}
