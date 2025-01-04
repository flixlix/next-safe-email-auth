"use client"

import { Button } from "@/components/ui/button"
import { useActionState } from "react"
import { logoutAction } from "../actions/logout"

const initialState = {
  message: "",
}

export default function LogoutButton() {
  const [, action, pending] = useActionState(logoutAction, initialState)
  return (
    <form action={action}>
      <Button variant="destructive" disabled={pending}>
        Sign out
      </Button>
    </form>
  )
}
