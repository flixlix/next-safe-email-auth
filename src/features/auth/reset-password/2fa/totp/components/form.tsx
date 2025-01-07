"use client"

import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import Link from "next/link"
import { useActionState, useRef } from "react"
import { verifyPasswordReset2FAWithTOTPAction } from "../actions/verify-totp"

const initialPasswordResetTOTPState = {
  message: "",
}

export default function PasswordResetTOTPForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action, pending] = useActionState(verifyPasswordReset2FAWithTOTPAction, initialPasswordResetTOTPState)

  return (
    <form action={action} ref={formRef}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start text-start">
          <h1 className="text-2xl font-bold">Authenticate with authenticator app</h1>
          <p className="text-balance text-muted-foreground">Enter the code from your app.</p>
        </div>
        <div className="grid justify-center gap-2">
          <Label htmlFor="form-totp.code">Code</Label>
          <InputOTP
            id="form-totp.code"
            name="code"
            maxLength={6}
            required
            pattern={REGEXP_ONLY_DIGITS}
            onComplete={() => formRef.current?.requestSubmit()}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button disabled={pending} type="submit" className="w-full">
          Verify
        </Button>
        {state.message ? <p className="mb-6 text-sm font-medium text-destructive">{state.message}</p> : null}
        <Link
          href="/reset-password/2fa/recovery-code"
          className="me-auto text-sm font-medium underline underline-offset-4"
        >
          Use recovery code
        </Link>
      </div>
    </form>
  )
}
