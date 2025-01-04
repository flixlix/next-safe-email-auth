import React from "react"

export default function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className="container flex h-svh max-w-screen-lg flex-col gap-8 px-6 py-8">{children}</div>
}
