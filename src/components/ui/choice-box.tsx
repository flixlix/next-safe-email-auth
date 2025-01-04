"use client"

import { cn } from "@/lib/utils"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import * as React from "react"

const ChoiceBoxGroup = ({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) => {
  return <RadioGroupPrimitive.Root className={cn("grid grid-cols-2 gap-2", className)} {...props} />
}
ChoiceBoxGroup.displayName = RadioGroupPrimitive.Root.displayName

const ChoiceBoxItem = ({ className, children, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) => {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "group/choicebox flex items-center justify-between gap-4 rounded-md border bg-card px-6 py-3 text-foreground ring-offset-background focus:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-primary data-[state=checked]:bg-blue-50 data-[state=checked]:text-primary dark:data-[state=checked]:bg-blue-950/50",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-start gap-1">{children}</div>
      <div className="flex aspect-square h-4 w-4 items-center justify-center rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Circle className="h-2.5 w-2.5 fill-current text-current" />
        </RadioGroupPrimitive.Indicator>
      </div>
    </RadioGroupPrimitive.Item>
  )
}
ChoiceBoxItem.displayName = RadioGroupPrimitive.Item.displayName

const ChoiceBoxItemTitle = ({ className, ...props }: React.ComponentProps<"span">) => {
  return <span className={cn("flex items-center gap-2 text-sm font-medium", className)} {...props} />
}
ChoiceBoxItemTitle.displayName = "ChoiceBoxItemTitle"

const ChoiceBoxItemDescription = ({ className, ...props }: React.ComponentProps<"span">) => {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-start text-xs font-normal text-muted-foreground group-data-[state=checked]/choicebox:text-primary",
        className
      )}
      {...props}
    />
  )
}
ChoiceBoxItemDescription.displayName = "ChoiceBoxItemDescription"

export { ChoiceBoxGroup, ChoiceBoxItem, ChoiceBoxItemDescription, ChoiceBoxItemTitle }
