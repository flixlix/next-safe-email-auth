import { Button } from "@/components/ui/button"
import { Home, LogIn } from "lucide-react"
import Link from "next/link"

export default function Forbidden() {
  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center">
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-5">
        <p className="text-[200px] font-black text-primary sm:text-[300px] lg:text-[400px]">403</p>
      </div>
      <section className="flex flex-col gap-2 py-8 text-center">
        <h2 className="text-3xl font-semibold text-primary">Forbidden</h2>
        <p className="text-muted-foreground">
          You don't have permission to access this resource. Please log in with an account that has the necessary
          permissions.
        </p>
      </section>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/login">
            <LogIn />
            Login
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="mr-2 size-5" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
