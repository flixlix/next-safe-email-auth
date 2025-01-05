"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState } from "react"
import { reset2FAAction } from "../actions/reset-2fa"

const initial2FAResetState = {
  message: "",
}

export default function TwoFactorResetForm() {
  const [state, action, pending] = useActionState(reset2FAAction, initial2FAResetState)
  return (
    <form action={action}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start text-start">
          <h1 className="text-2xl font-bold">Recover your account</h1>
          <p className="text-balance text-muted-foreground">
            Enter a recovery code to reset your two-factor authentication.
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="form-totp.code">Recovery code</Label>
          <Input id="form-totp.code" name="code" required />
        </div>

        <Button disabled={pending} type="submit" className="w-full">
          Verify
        </Button>
        {state.message ? <p className="text-sm font-medium text-destructive">{state.message}</p> : null}
      </div>
    </form>
  )
}
