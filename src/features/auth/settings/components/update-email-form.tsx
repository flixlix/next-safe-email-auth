"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useActionState } from "react"
import { updateEmailAction } from "../actions/update-email"

const initialUpdateFormState = {
  message: "",
  error: true,
}

export default function UpdateEmailForm() {
  const [state, action, pending] = useActionState(updateEmailAction, initialUpdateFormState)

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor="form-email.email">New email</Label>
        <Input type="email" id="form-email.email" name="email" required />
      </div>
      <Button disabled={pending} type="submit" className="me-auto">
        Update
      </Button>
      {state.message ? (
        <p className={cn("text-sm font-medium", state.error && "text-destructive")}>{state.message}</p>
      ) : null}
    </form>
  )
}
