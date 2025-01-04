"use client"

import { type ButtonProps, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import React from "react"

export type LoadingButtonProps = ButtonProps & {
  className?: string
  statusesEl: {
    idle: React.ReactNode
    loading: React.ReactNode
    success: React.ReactNode
    error: React.ReactNode
  }
  status: keyof LoadingButtonProps["statusesEl"]
}

export default function LoadingButton({ className, statusesEl, status, size, ...props }: LoadingButtonProps) {
  return (
    <button
      className={cn(
        buttonVariants({
          variant: status !== "error" ? (props.variant ?? "default") : "destructive",
          size,
        }),
        "overflow-clip disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100",
        status === "success" && "bg-emerald-600 hover:bg-emerald-700",
        className
      )}
      disabled={status !== "idle" && status !== "error" && status !== "success"}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={status}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 25 }}
          className="flex w-full items-center justify-center gap-2"
        >
          {statusesEl[status]}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
