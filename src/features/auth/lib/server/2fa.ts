import { db } from "@/drizzle/db"
import {
  passkeyCredentialTable,
  securityKeyCredentialTable,
  sessionTable,
  totpCredentialTable,
  userTable,
} from "@/drizzle/schema"
import { and, eq, sql } from "drizzle-orm"
import { decryptToString, encryptString } from "./encryption"
import { ExpiringTokenBucket } from "./rate-limit"
import { type User } from "./user"
import { generateRandomRecoveryCode } from "./utils"

export const recoveryCodeBucket = new ExpiringTokenBucket<User["id"]>(3, 60 * 60)

export async function resetUser2FAWithRecoveryCode(userId: User["id"], recoveryCode: string): Promise<boolean> {
  const trx = await db
    .transaction(async (trx) => {
      const userResult = await trx.execute(sql`SELECT recovery_code FROM user WHERE id = ${userId} FOR UPDATE`)

      const userRow = userResult.rows as { recoveryCode: Buffer<ArrayBufferLike> }[]
      if (userRow.length === 0) {
        return false
      }

      const encryptedRecoveryCode = Buffer.from(userRow[0].recoveryCode)
      const userRecoveryCode = decryptToString(encryptedRecoveryCode)

      if (recoveryCode !== userRecoveryCode) {
        return false
      }

      const newRecoveryCode = generateRandomRecoveryCode()
      const encryptedNewRecoveryCode = encryptString(newRecoveryCode)

      const updateResult = await trx
        .update(userTable)
        .set({
          recoveryCode: encryptedNewRecoveryCode.toString(),
        })
        .where(and(eq(userTable.id, userId), eq(userTable.recoveryCode, encryptedRecoveryCode.toString())))
        .execute()

      const updateRows = updateResult.rows

      if (updateRows.length === 0) {
        trx.rollback()
        return false
      }

      await trx.update(sessionTable).set({ twoFactorVerified: false }).where(eq(sessionTable.userId, userId)).execute()

      await trx.delete(totpCredentialTable).where(eq(totpCredentialTable.userId, userId)).execute()
      await trx.delete(passkeyCredentialTable).where(eq(passkeyCredentialTable.userId, userId)).execute()
      await trx.delete(securityKeyCredentialTable).where(eq(securityKeyCredentialTable.userId, userId)).execute()

      return true
    })
    .catch((e) => {
      console.error("Transaction failed", e)
      return false
    })

  return trx
}

export function get2FARedirect(user: User): string {
  if (user.registeredPasskey) {
    return "/2fa/passkey"
  }
  if (user.registeredSecurityKey) {
    return "/2fa/security-key"
  }
  if (user.registeredTOTP) {
    return "/2fa/totp"
  }
  return "/2fa/setup"
}

export function getPasswordReset2FARedirect(user: User): string {
  if (user.registeredPasskey) {
    return "/reset-password/2fa/passkey"
  }
  if (user.registeredSecurityKey) {
    return "/reset-password/2fa/security-key"
  }
  if (user.registeredTOTP) {
    return "/reset-password/2fa/totp"
  }
  return "/2fa/setup"
}
