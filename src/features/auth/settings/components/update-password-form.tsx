"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState } from "react"
import { updatePasswordAction } from "../actions/update-password"

const initialUpdatePasswordState = {
  message: "",
}

export default function UpdatePasswordForm() {
  const [state, action, pending] = useActionState(updatePasswordAction, initialUpdatePasswordState)

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor="form-password.password">Current password</Label>
        <Input type="password" id="form-email.password" name="password" autoComplete="current-password" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="form-password.new-password">New password</Label>
        <Input
          type="password"
          id="form-password.new-password"
          name="new_password"
          autoComplete="new-password"
          required
        />
      </div>
      <Button disabled={pending} type="submit" className="me-auto">
        Update
      </Button>
      <p className="text-sm font-medium text-destructive">{state.message}</p>
    </form>
  )
}
