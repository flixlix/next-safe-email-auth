export function DotBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center bg-background bg-dot-black/[0.7] dark:bg-dot-white/[0.7]">
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  )
}
