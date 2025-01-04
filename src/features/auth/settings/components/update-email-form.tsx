"use client"

import { useActionState } from "react"
import { updateEmailAction } from "../actions/update-email"

const initialUpdateFormState = {
  message: "",
}

export default function UpdateEmailForm() {
  const [state, action] = useActionState(updateEmailAction, initialUpdateFormState)

  return (
    <form action={action}>
      <label htmlFor="form-email.email">New email</label>
      <input type="email" id="form-email.email" name="email" required />
      <br />
      <button>Update</button>
      <p>{state.message}</p>
    </form>
  )
}
