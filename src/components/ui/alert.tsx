import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:size-4 [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        warning: "border-amber-500/50 text-muted-foreground [&>h5]:text-amber-500 [&>svg]:text-amber-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = ({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) => (
  <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
)
Alert.displayName = "Alert"

const AlertTitle = ({ className, ...props }: React.ComponentProps<"h5">) => (
  <h5 className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = ({ className, ...props }: React.ComponentProps<"p">) => (
  <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription, AlertTitle }
