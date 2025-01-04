"use client"

import { Button } from "@/components/ui/button"
import { HelperText } from "@/components/ui/helper-text"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useActionState } from "react"
import { signupAction } from "../actioons/signup"

const initialState = {
  message: "",
}

export default function SignUpForm() {
  const [state, action, pending] = useActionState(signupAction, initialState)

  return (
    <form action={action}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start text-start">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-balance text-muted-foreground">Sign up to start your journey with us.</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="form-signup.username">Username</Label>
          <Input id="form-signup.username" name="username" required minLength={4} maxLength={31} />
          <HelperText>Username must be at least 3 characters long</HelperText>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="form-signup.email">Email</Label>
          <Input type="email" id="form-signup.email" name="email" autoComplete="username" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="form-signup.password">Password</Label>
          <Input type="password" id="form-signup.password" name="password" autoComplete="new-password" required />
          <HelperText>Password must be at least 8 characters long</HelperText>
        </div>
        <Button disabled={pending} type="submit" className="w-full">
          Continue
        </Button>
        <p className="text-sm font-medium text-destructive">{state.message}</p>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </div>
    </form>
  )
}
