"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useActionState } from "react"
import { loginAction } from "../actions/login"

const initialState = {
  message: "",
}

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState)

  return (
    <form action={action}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start text-start">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-balance text-muted-foreground">Login to your account</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="form-login.email">Email</Label>
          <Input type="email" id="form-login.email" name="email" autoComplete="username" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Label className="flex-1" htmlFor="form-login.password">
              Password
            </Label>
            <Link href="/forgot-password" className="ml-auto text-sm underline-offset-2 hover:underline">
              Forgot your password?
            </Link>
          </div>
          <Input type="password" id="form-login.password" name="password" autoComplete="current-password" required />
        </div>
        <Button disabled={pending} type="submit" className="w-full">
          Login
        </Button>
        <p className="text-sm font-medium text-destructive">{state.message}</p>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </div>
    </form>
  )
}
