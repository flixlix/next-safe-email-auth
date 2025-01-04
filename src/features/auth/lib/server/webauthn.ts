import { db } from "@/drizzle/db"
import { type User } from "@/drizzle/schema"
import { encodeHexLowerCase } from "@oslojs/encoding"
import { and, eq } from "drizzle-orm"
import { passkeyCredentialTable, securityKeyCredentialTable } from "../../schema"

const challengeBucket = new Set<string>()

export function createWebAuthnChallenge(): Uint8Array {
  const challenge = new Uint8Array(20)
  crypto.getRandomValues(challenge)
  const encoded = encodeHexLowerCase(challenge)
  challengeBucket.add(encoded)
  return challenge
}

export function verifyWebAuthnChallenge(challenge: Uint8Array): boolean {
  const encoded = encodeHexLowerCase(challenge)
  return challengeBucket.delete(encoded)
}

export async function getUserPasskeyCredentials(userId: User["id"]): Promise<WebAuthnUserCredential[]> {
  const rows = await db.select().from(passkeyCredentialTable).where(eq(passkeyCredentialTable.userId, userId))
  const credentials: WebAuthnUserCredential[] = []
  for (const row of rows) {
    const credential: WebAuthnUserCredential = {
      id: Buffer.from(row.id),
      userId: row.userId,
      name: row.name,
      algorithmId: row.algorithm,
      publicKey: Buffer.from(row.publicKey),
    }
    credentials.push(credential)
  }
  return credentials
}

export async function getPasskeyCredential(credentialId: Uint8Array): Promise<WebAuthnUserCredential | null> {
  const result = await db
    .select()
    .from(passkeyCredentialTable)
    .where(eq(passkeyCredentialTable.id, Buffer.from(credentialId)))
    .limit(1)
  const row = result[0]
  if (row === null || row === undefined) {
    return null
  }
  const credential: WebAuthnUserCredential = {
    id: Buffer.from(row.id),
    userId: row.userId,
    name: row.name,
    algorithmId: row.algorithm,
    publicKey: Buffer.from(row.publicKey),
  }
  return credential
}

export async function getUserPasskeyCredential(
  userId: User["id"],
  credentialId: Uint8Array
): Promise<WebAuthnUserCredential | null> {
  const result = await db
    .select()
    .from(passkeyCredentialTable)
    .where(and(eq(passkeyCredentialTable.id, Buffer.from(credentialId)), eq(passkeyCredentialTable.userId, userId)))
    .limit(1)
  const row = result[0]
  if (row === null || row === undefined) {
    return null
  }
  const credential: WebAuthnUserCredential = {
    id: row.id,
    userId: row.userId,
    name: row.name,
    algorithmId: row.algorithm,
    publicKey: Buffer.from(row.publicKey),
  }
  return credential
}

export async function createPasskeyCredential(credential: WebAuthnUserCredential): Promise<void> {
  await db.insert(passkeyCredentialTable).values({
    id: Buffer.from(credential.id),
    userId: credential.userId,
    name: credential.name,
    algorithm: credential.algorithmId,
    publicKey: Buffer.from(credential.publicKey),
  })
}

export async function deleteUserPasskeyCredential(userId: User["id"], credentialId: Uint8Array): Promise<boolean> {
  const result = await db
    .delete(passkeyCredentialTable)
    .where(and(eq(passkeyCredentialTable.id, Buffer.from(credentialId)), eq(passkeyCredentialTable.userId, userId)))
    .returning()
  return result.length > 0
}

export async function getUserSecurityKeyCredentials(userId: User["id"]): Promise<WebAuthnUserCredential[]> {
  const rows = await db.select().from(securityKeyCredentialTable).where(eq(securityKeyCredentialTable.userId, userId))

  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    name: row.name,
    algorithmId: row.algorithm,
    publicKey: row.publicKey,
  }))
}

export async function getUserSecurityKeyCredential(
  userId: User["id"],
  credentialId: Uint8Array
): Promise<WebAuthnUserCredential | null> {
  const result = await db
    .select()
    .from(securityKeyCredentialTable)
    .where(
      and(eq(securityKeyCredentialTable.id, Buffer.from(credentialId)), eq(securityKeyCredentialTable.userId, userId))
    )
    .limit(1)

  const row = result[0]
  if (!row) {
    return null
  }

  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    algorithmId: row.algorithm,
    publicKey: row.publicKey,
  }
}

export async function createSecurityKeyCredential(credential: WebAuthnUserCredential): Promise<void> {
  await db.insert(securityKeyCredentialTable).values({
    id: Buffer.from(credential.id),
    userId: credential.userId,
    name: credential.name,
    algorithm: credential.algorithmId,
    publicKey: Buffer.from(credential.publicKey),
  })
}

export async function deleteUserSecurityKeyCredential(userId: User["id"], credentialId: Uint8Array): Promise<boolean> {
  const result = await db
    .delete(securityKeyCredentialTable)
    .where(
      and(eq(securityKeyCredentialTable.id, Buffer.from(credentialId)), eq(securityKeyCredentialTable.userId, userId))
    )
    .returning()
  return result.length > 0
}

export interface WebAuthnUserCredential {
  id: Uint8Array
  userId: User["id"]
  name: string
  algorithmId: number
  publicKey: Uint8Array
}
