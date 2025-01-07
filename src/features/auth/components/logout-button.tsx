"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useActionState } from "react"
import { logoutAction } from "../actions/logout"

const initialState = {
  message: "",
}

export default function LogoutButton() {
  const [, action, pending] = useActionState(logoutAction, initialState)
  return (
    <form action={action}>
      <Button variant="ghost" disabled={pending}>
        <LogOut />
        Sign out
      </Button>
    </form>
  )
}
