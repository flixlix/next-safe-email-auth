import { cn } from "@/lib/utils"

const HelperText = ({ className, ...props }: React.ComponentProps<"p">) => {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}
HelperText.displayName = "HelperText"

export { HelperText }
