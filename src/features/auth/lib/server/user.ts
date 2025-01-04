import { generateIdFromEntropySize } from "@/auth"
import { db } from "@/drizzle/db"
import {
  passkeyCredentialTable,
  securityKeyCredentialTable,
  totpCredentialTable,
  userTable,
  type User as DBUser,
} from "@/drizzle/schema"
import { and, eq, sql } from "drizzle-orm"
import { encryptString } from "./encryption"
import { hashPassword } from "./password"
import { generateRandomRecoveryCode } from "./utils"

export function verifyUsernameInput(username: string): boolean {
  return username.length > 3 && username.length < 32 && username.trim() === username
}

export async function createUser(email: string, username: string, password: string): Promise<User> {
  const passwordHash = await hashPassword(password)
  const recoveryCode = generateRandomRecoveryCode()
  const encryptedRecoveryCode = encryptString(recoveryCode)

  const userId = generateIdFromEntropySize(10)
  const result = await db
    .insert(userTable)
    .values({
      id: userId,
      email,
      username,
      passwordHash,
      recoveryCode: encryptedRecoveryCode.toString(),
    })
    .returning({
      id: userTable.id,
    })
  const row = result[0]
  if (row === null || row === undefined) {
    throw new Error("Unexpected error")
  }
  const user: User = {
    id: row.id,
    username,
    email,
    emailVerified: false,
    registeredTOTP: false,
    registeredPasskey: false,
    registeredSecurityKey: false,
    registered2FA: false,
  }
  return user
}

export async function updateUserPassword(userId: User["id"], password: string): Promise<void> {
  const passwordHash = await hashPassword(password)
  await db.update(userTable).set({ passwordHash }).where(eq(userTable.id, userId))
}

export async function updateUserEmailAndSetEmailAsVerified(userId: User["id"], email: string): Promise<void> {
  await db.update(userTable).set({ email, emailVerified: true }).where(eq(userTable.id, userId))
}

export async function setUserAsEmailVerifiedIfEmailMatches(userId: User["id"], email: string): Promise<boolean> {
  const result = await db
    .update(userTable)
    .set({ emailVerified: true })
    .where(and(eq(userTable.id, userId), eq(userTable.email, email)))
    .returning()
  return result.length > 0
}

export async function getUserPasswordHash(userId: User["id"]): Promise<string> {
  const result = await db.select().from(userTable).where(eq(userTable.id, userId)).limit(1)
  const row = result[0]
  if (row === null || row === undefined) {
    throw new Error("Invalid user ID")
  }
  return row.passwordHash
}

export async function getUserRecoverCode(userId: User["id"]): Promise<string> {
  try {
    const result = await db.select().from(userTable).where(eq(userTable.id, userId))

    if (!result || result.length === 0) {
      throw new Error("Invalid user ID or recovery code not found")
    }

    console.log(result[0]) // Log the full result
    console.log(result[0].recoveryCode) // Log the recoveryCode specifically

    // Assuming you want to return the recoveryCode as a string
    return result[0].recoveryCode.toString() // Ensure it's converted if necessary
  } catch (error) {
    console.error("Error fetching recovery code:", error)
    return ""
  }
}

export async function resetUserRecoveryCode(userId: User["id"]): Promise<string> {
  const recoveryCode = generateRandomRecoveryCode()
  const encrypted = encryptString(recoveryCode)
  await db.update(userTable).set({ recoveryCode: encrypted.toString() }).where(eq(userTable.id, userId))
  return recoveryCode
}

export async function getUserFromEmail(email: string): Promise<User | null> {
  const result = await db
    .select({
      id: userTable.id,
      email: userTable.email,
      username: userTable.username,
      emailVerified: userTable.emailVerified,
      hasTOTP: sql`CASE WHEN ${totpCredentialTable.id} IS NOT NULL THEN 1 ELSE 0 END`.as("hasTOTP"),
      hasPasskey: sql`CASE WHEN ${passkeyCredentialTable.id} IS NOT NULL THEN 1 ELSE 0 END`.as("hasPasskey"),
      hasSecurityKey: sql`CASE WHEN ${securityKeyCredentialTable.id} IS NOT NULL THEN 1 ELSE 0 END`.as(
        "hasSecurityKey"
      ),
    })
    .from(userTable)
    .leftJoin(totpCredentialTable, eq(userTable.id, totpCredentialTable.userId))
    .leftJoin(passkeyCredentialTable, eq(userTable.id, passkeyCredentialTable.userId))
    .leftJoin(securityKeyCredentialTable, eq(userTable.id, securityKeyCredentialTable.userId))
    .where(eq(userTable.email, email))
    .execute()
  const row = result[0]
  if (row === null || row === undefined) {
    return null
  }
  const user: User = {
    id: row.id,
    email: row.email,
    username: row.username,
    emailVerified: row.emailVerified,
    registeredTOTP: Boolean(row.hasTOTP),
    registeredPasskey: Boolean(row.hasPasskey),
    registeredSecurityKey: Boolean(row.hasSecurityKey),
    registered2FA: Boolean(row.hasTOTP || row.hasPasskey || row.hasSecurityKey),
  }

  return user
}

export interface User extends Omit<DBUser, "recoveryCode" | "passwordHash"> {
  registeredTOTP: boolean
  registeredSecurityKey: boolean
  registeredPasskey: boolean
  registered2FA: boolean
}
