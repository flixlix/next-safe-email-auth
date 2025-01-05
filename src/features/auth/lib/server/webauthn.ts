import { type User } from "@/drizzle/schema"
import { encodeHexLowerCase } from "@oslojs/encoding"

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

export interface WebAuthnUserCredential {
  id: Uint8Array
  userId: User["id"]
  name: string
  algorithmId: number
  publicKey: Uint8Array
}
