import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

// import oilPainting from "@/assets/painting.jpg"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden shadow-sm md:min-h-[480px]">
            <CardContent className="grid p-0 md:min-h-[480px] md:grid-cols-2">
              <div className="my-auto flex h-full flex-col justify-center p-6 md:p-8">{children}</div>
              <div className="relative hidden bg-muted md:block">
                <Image
                  src="https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  // src={oilPainting}
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale md:min-h-[480px]"
                  alt="nice oil painting"
                  width={383}
                  height={700}
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  )
}
