import { generateIdFromEntropySize } from "@/auth"
import { db } from "@/drizzle/db"
import { type User } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { totpCredentialTable } from "../../schema"
import { decrypt, encrypt } from "./encryption"
import { ExpiringTokenBucket, RefillingTokenBucket } from "./rate-limit"

export const totpBucket = new ExpiringTokenBucket<User["id"]>(5, 60 * 30)
export const totpUpdateBucket = new RefillingTokenBucket<User["id"]>(3, 60 * 10)

export async function getUserTOTPKey(userId: User["id"]): Promise<Uint8Array | null> {
  const result = await db.select().from(totpCredentialTable).where(eq(totpCredentialTable.userId, userId)).limit(1)
  const row = result[0]
  if (row === null || row === undefined) {
    throw new Error("Invalid user ID")
  }
  const encrypted = row.key
  if (encrypted === null) {
    return null
  }
  return decrypt(Buffer.from(encrypted))
}

export async function updateUserTOTPKey(userId: User["id"], key: Uint8Array): Promise<boolean> {
  const encrypted = encrypt(key)

  try {
    await db.transaction(async (trx) => {
      await trx.delete(totpCredentialTable).where(eq(totpCredentialTable.userId, userId)).execute()

      const id = generateIdFromEntropySize(10)

      await trx
        .insert(totpCredentialTable)
        .values({ id, userId, key: Buffer.from(encrypted) })
        .execute()
    })

    return true
  } catch (e) {
    console.error("Error updating TOTP key:", e)
    return false
  }
}

export async function deleteUserTOTPKey(userId: User["id"]): Promise<void> {
  await db.delete(totpCredentialTable).where(eq(totpCredentialTable.userId, userId))
}
