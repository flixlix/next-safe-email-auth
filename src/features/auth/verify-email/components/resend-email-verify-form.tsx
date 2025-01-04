"use client"

import { HelperText } from "@/components/ui/helper-text"
import { useActionState } from "react"
import { resendEmailVerificationCodeAction } from "../actions/resend-email-verify-code"

const resendEmailInitialState = {
  message: "",
}

export default function ResendEmailVerificationCodeForm() {
  const [state, action] = useActionState(resendEmailVerificationCodeAction, resendEmailInitialState)
  return (
    <form action={action}>
      <div className="text-sm">
        Didn&apos;t receive the code?{" "}
        <button type="submit" className="underline underline-offset-4">
          Resend code
        </button>
      </div>
      <HelperText>{state.message}</HelperText>
    </form>
  )
}
