import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import SmallModeSwitcher from "../../sm-mode-switcher"
import MadeWith from "./made-with"

export default async function Footer() {
  "use cache"
  return (
    <footer className="flex min-h-32 flex-col items-start gap-6 px-4 pb-10 pt-10 text-sm text-muted-foreground">
      <Separator />
      <div className="flex w-full flex-col items-start justify-between gap-x-6 gap-y-2 px-1 lg:flex-row lg:px-4">
        <MadeWith />
        <SmallModeSwitcher />
      </div>
      <div className="grid w-full grid-cols-2 gap-3 px-2 md:grid-cols-3 lg:flex lg:items-center lg:justify-end lg:px-4 lg:ps-2">
        <Button variant="link" size="sm" className="-ms-3 me-auto justify-start text-inherit lg:ms-0" asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button variant="link" size="sm" className="-ms-3 justify-start text-inherit lg:ms-0 lg:justify-end" asChild>
          <Link href="/builder">Builder</Link>
        </Button>
        <Button variant="link" size="sm" className="-ms-3 justify-start text-inherit lg:ms-0 lg:justify-end" asChild>
          <Link href="/support">Help</Link>
        </Button>
        <Button variant="link" size="sm" className="-ms-3 justify-start text-inherit lg:ms-0" asChild>
          <Link href="/feedback">Feedback</Link>
        </Button>
        <Button variant="link" size="sm" className="-ms-3 justify-start text-inherit lg:ms-0" asChild>
          <Link href="/blog">Blog</Link>
        </Button>
        <DropdownMenu>
          <Button
            variant="link"
            size="sm"
            className="-ms-3 justify-start text-inherit focus-visible:ring-0 lg:ms-0"
            asChild
          >
            <DropdownMenuTrigger>
              Legal <ChevronDown />
            </DropdownMenuTrigger>
          </Button>
          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Link href="/cookie-policy">Cookie policy</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/privacy-policy">Privacy policy</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/terms-of-service">Terms of service</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <p className="mt-4 lg:mt-0">&copy; {new Date().getFullYear()} </p>
      </div>
    </footer>
  )
}
