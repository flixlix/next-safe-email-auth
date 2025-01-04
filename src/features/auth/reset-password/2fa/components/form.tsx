"use client"

import { useActionState } from "react"
import { resetPasswordAction } from "../actions/reset-password"

const initialPasswordResetState = {
  message: "",
}

export default function PasswordResetForm() {
  const [state, action] = useActionState(resetPasswordAction, initialPasswordResetState)
  return (
    <form action={action}>
      <label htmlFor="form-reset.password">Password</label>
      <input type="password" id="form-reset.password" name="password" autoComplete="new-password" required />
      <br />
      <button>Reset password</button>
      <p>{state.message}</p>
    </form>
  )
}
