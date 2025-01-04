"use client"

import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground hover:data-[state=off]:bg-muted/50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:data-[state=off]:bg-accent/50",
      },
      size: {
        default: "h-10 min-w-10 px-3",
        sm: "h-9 min-w-9 px-2.5",
        lg: "h-11 min-w-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = ({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) => (
  <TogglePrimitive.Root className={cn(toggleVariants({ variant, size, className }))} {...props} />
)

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
