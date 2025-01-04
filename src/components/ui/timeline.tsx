import { cn } from "@/lib/utils"
import { type VariantProps, cva } from "class-variance-authority"
import { Check, Circle, X } from "lucide-react"
import React from "react"

const timelineVariants = cva("grid", {
  variants: {
    positions: {
      left: "[&>li]:grid-cols-[0_min-content_1fr]",
      right: "[&>li]:grid-cols-[1fr_min-content]",
      center: "[&>li]:grid-cols-[1fr_min-content_1fr]",
    },
  },
  defaultVariants: {
    positions: "left",
  },
})

interface TimelineProps extends React.ComponentProps<"ul">, VariantProps<typeof timelineVariants> {}

const Timeline = ({ children, className, positions, ...props }: TimelineProps) => {
  return (
    <ul className={cn(timelineVariants({ positions }), className)} {...props}>
      {children}
    </ul>
  )
}
Timeline.displayName = "Timeline"

const timelineItemVariants = cva("grid items-center gap-x-2", {
  variants: {
    status: {
      done: "text-primary",
      default: "text-muted-foreground",
    },
  },
  defaultVariants: {
    status: "default",
  },
})

interface TimelineItemProps extends React.ComponentProps<"li">, VariantProps<typeof timelineItemVariants> {}

const TimelineItem = ({ className, status, ...props }: TimelineItemProps) => (
  <li className={cn(timelineItemVariants({ status }), className)} {...props} />
)
TimelineItem.displayName = "TimelineItem"

const timelineDotVariants = cva(
  "col-start-2 col-end-3 row-start-1 row-end-1 flex size-4 items-center justify-center rounded-full border border-current",
  {
    variants: {
      status: {
        default: "[&>*]:hidden",
        current: "[&>*:not(.lucide-circle)]:hidden [&>.lucide-circle]:fill-current [&>.lucide-circle]:text-current",
        done: "border-none bg-primary [&>*:not(.lucide-check)]:hidden [&>.lucide-check]:text-background",
        error: "border-destructive bg-destructive [&>*:not(.lucide-x)]:hidden [&>.lucide-x]:text-background",
        custom: "[&>*:not(:nth-child(4))]:hidden [&>*:nth-child(4)]:block",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

interface TimelineDotProps extends React.ComponentProps<"div">, VariantProps<typeof timelineDotVariants> {
  customIcon?: React.ReactNode
}

const TimelineDot = ({ className, status, customIcon, ...props }: TimelineDotProps) => (
  <div role="status" className={cn("timeline-dot", timelineDotVariants({ status }), className)} {...props}>
    <Circle className="size-2.5" />
    <Check className="size-3" />
    <X className="size-3" />
    {customIcon}
  </div>
)
TimelineDot.displayName = "TimelineDot"

const timelineContentVariants = cva("row-start-2 row-end-2 mb-4 text-muted-foreground", {
  variants: {
    side: {
      right: "col-start-3 col-end-4 mr-auto text-left",
      left: "col-start-1 col-end-2 ml-auto text-right",
    },
  },
  defaultVariants: {
    side: "right",
  },
})

interface TimelineContentProps extends React.ComponentProps<"div">, VariantProps<typeof timelineContentVariants> {}

const TimelineContent = ({ className, side, ...props }: TimelineContentProps) => (
  <div className={cn(timelineContentVariants({ side }), className)} {...props} />
)
TimelineContent.displayName = "TimelineContent"

const timelineHeadingVariants = cva("row-start-1 row-end-1 line-clamp-1 max-w-full truncate", {
  variants: {
    side: {
      right: "col-start-3 col-end-4 mr-auto text-left",
      left: "col-start-1 col-end-2 ml-auto text-right",
    },
    variant: {
      primary: "text-base font-medium text-primary",
      secondary: "text-sm font-light text-muted-foreground",
    },
  },
  defaultVariants: {
    side: "right",
    variant: "primary",
  },
})

interface TimelineHeadingProps extends React.ComponentProps<"p">, VariantProps<typeof timelineHeadingVariants> {}

const TimelineHeading = ({ className, side, variant, ...props }: TimelineHeadingProps) => (
  <p
    role="heading"
    aria-level={variant === "primary" ? 2 : 3}
    className={cn(timelineHeadingVariants({ side, variant }), className)}
    {...props}
  />
)
TimelineHeading.displayName = "TimelineHeading"

interface TimelineLineProps extends React.ComponentProps<"hr"> {
  done?: boolean
}

const TimelineLine = ({ className, done = false, ...props }: TimelineLineProps) => {
  return (
    <hr
      role="separator"
      aria-orientation="vertical"
      className={cn(
        "col-start-2 col-end-3 row-start-2 row-end-2 mx-auto flex h-full w-0.5 justify-center rounded-full border",
        done ? "border-primary bg-primary" : "border-muted bg-muted",
        className
      )}
      {...props}
    />
  )
}
TimelineLine.displayName = "TimelineLine"

export { Timeline, TimelineContent, TimelineDot, TimelineHeading, TimelineItem, TimelineLine }
