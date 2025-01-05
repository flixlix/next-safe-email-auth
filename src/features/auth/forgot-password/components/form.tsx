"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useActionState } from "react"
import { forgotPasswordAction } from "../actions/forgot-password"

const initialForgotPasswordState = {
  message: "",
}

export default function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, initialForgotPasswordState)
  return (
    <form action={action}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start text-start">
          <h1 className="text-2xl font-bold">Forgot your password?</h1>
          <p className="text-balance text-muted-foreground">We&apos;ll send you a link to reset your password</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="form-forgot.email">Email</Label>
          <Input type="email" id="form-forgot.email" name="email" required />
        </div>
        <Button disabled={pending} type="submit" className="w-full">
          Send
        </Button>
        {state.message ? <p className="text-sm font-medium text-destructive">{state.message}</p> : null}
        <Link href="/login" className="mx-auto text-sm font-medium underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </form>
  )
}
