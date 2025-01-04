"use client"

import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const { back } = useRouter()
  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center">
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-5">
        <p className="text-[200px] font-black text-primary sm:text-[300px] lg:text-[400px]">404</p>
      </div>
      <section className="flex flex-col gap-2 py-8 text-center">
        <h2 className="text-3xl font-semibold text-primary">Page not found</h2>
        <p className="text-muted-foreground">
          We looked everywhere, but couldn't
          <br /> find the page you were looking for.
        </p>
      </section>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 size-5" />
            Return Home
          </Link>
        </Button>
        <Button variant="outline" onClick={back}>
          Go Back
        </Button>
      </div>
    </div>
  )
}
