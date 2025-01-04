"use client"

import { createChallenge } from "@/features/auth/lib/client/webauthn"
import { encodeBase64 } from "@oslojs/encoding"
import { useState } from "react"
import { loginWithPasskeyAction } from "../actions/login"

export default function PasskeyLoginButton() {
  const [message, setMessage] = useState("")
  return (
    <>
      <button
        onClick={async () => {
          const challenge = await createChallenge()

          const credential = await navigator.credentials.get({
            publicKey: {
              challenge,
              userVerification: "required",
            },
          })

          if (!(credential instanceof PublicKeyCredential)) {
            throw new Error("Failed to create public key")
          }
          if (!(credential.response instanceof AuthenticatorAssertionResponse)) {
            throw new Error("Unexpected error")
          }

          const result = await loginWithPasskeyAction({
            credential_id: encodeBase64(new Uint8Array(credential.rawId)),
            signature: encodeBase64(new Uint8Array(credential.response.signature)),
            authenticator_data: encodeBase64(new Uint8Array(credential.response.authenticatorData)),
            client_data_json: encodeBase64(new Uint8Array(credential.response.clientDataJSON)),
          })
          setMessage(result.message)
        }}
      >
        Sign in with passkey
      </button>
      <p>{message}</p>
    </>
  )
}
