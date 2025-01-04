"use client"

import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { type EmailVerificationRequest } from "@/drizzle/schema"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { useActionState } from "react"
import { type User } from "../../lib/server/user"
import { verifyEmailAction } from "../actions/verify-email"

const emailVerificationInitialState = {
  message: "",
}

export default function EmailVerificationForm({
  verificationRequest,
  user,
}: {
  verificationRequest: EmailVerificationRequest | null
  user: User
}) {
  const [state, action, pending] = useActionState(verifyEmailAction, emailVerificationInitialState)
  return (
    <form action={action}>
      <div className="mb-4 flex flex-col gap-6">
        <div className="flex flex-col items-start text-start">
          <h1 className="text-2xl font-bold">Verify your email address</h1>
          <p className="text-balance text-muted-foreground">
            We sent an 8-digit code to {verificationRequest?.email ?? user.email}.
          </p>
        </div>
        <div className="grid justify-center gap-2">
          <Label htmlFor="form-verify.code">Code</Label>

          <InputOTP id="form-verify.code" name="code" maxLength={8} required pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
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
          </InputOTP>
        </div>
        <Button disabled={pending} type="submit" className="w-full">
          Verify
        </Button>
        <p className="text-sm font-medium text-destructive">{state.message}</p>
      </div>
    </form>
  )
}
