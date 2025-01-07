"use client"

import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { useActionState, useRef, useState } from "react"
import { verifyPasswordReset2FAWithRecoveryCodeAction } from "../actions/verify-code"

const initialPasswordResetRecoveryCodeState = {
  message: "",
}

export default function PasswordResetRecoveryCodeForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action, pending] = useActionState(
    verifyPasswordReset2FAWithRecoveryCodeAction,
    initialPasswordResetRecoveryCodeState
  )
  const [code, setCode] = useState("")

  return (
    <form action={action} ref={formRef}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start text-start">
          <h1 className="text-2xl font-bold">Use your recovery code</h1>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="form-recovery-code.code">Recovery code</Label>
          <InputOTP
            id="form-recovery-code.code"
            name="code"
            containerClassName="flex flex-col"
            maxLength={16}
            required
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            onComplete={() => formRef.current?.requestSubmit()}
            value={code}
            onChange={(value) => setCode(value.toUpperCase())}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
              <InputOTPSlot index={6} />
              <InputOTPSlot index={7} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={8} />
              <InputOTPSlot index={9} />
              <InputOTPSlot index={10} />
              <InputOTPSlot index={11} />
              <InputOTPSlot index={12} />
              <InputOTPSlot index={13} />
              <InputOTPSlot index={14} />
              <InputOTPSlot index={15} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button disabled={pending} type="submit" className="w-full">
          Reset password
        </Button>
        {state.message ? <p className="mb-6 text-sm font-medium text-destructive">{state.message}</p> : null}
      </div>
    </form>
  )
}
