"use client"

import { useActionState } from "react"
import { verify2FAAction } from "../actions/verify-2fa-action"

const initial2FAVerificationState = {
  message: "",
}

export default function TwoFactorVerificationForm() {
  const [state, action] = useActionState(verify2FAAction, initial2FAVerificationState)
  return (
    <form action={action}>
      <label htmlFor="form-totp.code">Code</label>
      <input id="form-totp.code" name="code" autoComplete="one-time-code" required />
      <br />
      <button>Verify</button>
      <p>{state.message}</p>
    </form>
  )
}
