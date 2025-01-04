"use client"

import { useIsMounted } from "@/hooks/use-mounted"
import { cn } from "@/lib/utils"
import { Computer, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Skeleton } from "./ui/skeleton"

export default function SmallModeSwitcher() {
  const { setTheme, theme } = useTheme()

  const isMounted = useIsMounted()

  if (!isMounted) return <Skeleton className="h-6 w-[72px]" />
  return (
    <div className="hidden h-6 items-center justify-center rounded-full border lg:flex">
      <button
        onClick={() => setTheme("system")}
        className={cn(
          "-ml-px flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground",
          theme === "system" && "border text-foreground"
        )}
      >
        <Computer className="h-4 w-4" />
        <span className="sr-only">System theme</span>
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground",
          theme === "dark" && "border text-foreground"
        )}
      >
        <Moon className="h-4 w-4" />
        <span className="sr-only">Dark theme</span>
      </button>
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "-mr-px flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground",
          theme === "light" && "border text-foreground"
        )}
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Light theme</span>
      </button>
    </div>
  )
}
