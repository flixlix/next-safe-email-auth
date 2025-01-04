"use client"

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"
import { Suspense } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <Suspense fallback={children}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </Suspense>
  )
}
