"use client"

import { useActionState } from "react"
import { verifyEmailAction } from "../actions/verify-email"

const emailVerificationInitialState = {
  message: "",
}

export default function EmailVerificationForm() {
  const [state, action] = useActionState(verifyEmailAction, emailVerificationInitialState)
  return (
    <form action={action}>
      <label htmlFor="form-verify.code">Code</label>
      <input id="form-verify.code" name="code" required />
      <button>Verify</button>
      <p>{state.message}</p>
    </form>
  )
}
