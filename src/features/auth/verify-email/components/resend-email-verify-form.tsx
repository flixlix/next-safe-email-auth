"use client"

import { useActionState } from "react"
import { resendEmailVerificationCodeAction } from "../actions/resend-email-verify-code"

const resendEmailInitialState = {
  message: "",
}

export default function ResendEmailVerificationCodeForm() {
  const [state, action] = useActionState(resendEmailVerificationCodeAction, resendEmailInitialState)
  return (
    <form action={action}>
      <button>Resend code</button>
      <p>{state.message}</p>
    </form>
  )
}
