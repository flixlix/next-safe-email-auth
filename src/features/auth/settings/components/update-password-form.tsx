"use client"

import { useActionState } from "react"
import { updatePasswordAction } from "../actions/update-password"

const initialUpdatePasswordState = {
  message: "",
}

export default function UpdatePasswordForm() {
  const [state, action] = useActionState(updatePasswordAction, initialUpdatePasswordState)

  return (
    <form action={action}>
      <label htmlFor="form-password.password">Current password</label>
      <input type="password" id="form-email.password" name="password" autoComplete="current-password" required />
      <br />
      <label htmlFor="form-password.new-password">New password</label>
      <input type="password" id="form-password.new-password" name="new_password" autoComplete="new-password" required />
      <br />
      <button>Update</button>
      <p>{state.message}</p>
    </form>
  )
}
