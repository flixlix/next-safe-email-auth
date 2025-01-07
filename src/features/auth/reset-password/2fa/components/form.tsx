"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import PasswordInput from "@/features/auth/components/password-input"
import { useActionState, useRef } from "react"
import { resetPasswordAction } from "../actions/reset-password"

const initialPasswordResetState = {
  message: "",
}

export default function PasswordResetForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action, pending] = useActionState(resetPasswordAction, initialPasswordResetState)

  return (
    <form action={action} ref={formRef}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start text-start">
          <h1 className="text-2xl font-bold">New Password</h1>
          <p className="text-balance text-muted-foreground">Enter your new password.</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="form-reset.password">New Password</Label>
          <PasswordInput id="form-reset.password" name="password" autoComplete="new-password" required />
        </div>
        <Button disabled={pending} type="submit" className="w-full">
          Reset password
        </Button>
        {state.message ? <p className="mb-6 text-sm font-medium text-destructive">{state.message}</p> : null}
      </div>
    </form>
  )
}
