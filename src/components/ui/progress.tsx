"use client"

import { cn } from "@/lib/utils"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import * as React from "react"

const Progress = ({ className, value, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) => (
  <ProgressPrimitive.Root
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 rounded-full bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
)
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
