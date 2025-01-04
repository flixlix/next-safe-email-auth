import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AsteriskSquare, Globe, KeyRound } from "lucide-react"

export default function ButtonGroup({
  value,
  ...props
}: Omit<React.ComponentProps<typeof ToggleGroup>, "value" | "defaultValue" | "onValueChange" | "type"> & {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
}) {
  return (
    <ToggleGroup type="single" variant="outline" className="[&>*]:flex-1" value={value} {...props}>
      <ToggleGroupItem
        value="public"
        aria-label="Set visibility to public"
        className="rounded-e-none data-[state=on]:pointer-events-none"
      >
        <Globe className="h-4 w-4" />
        Public
      </ToggleGroupItem>
      <ToggleGroupItem
        value="private-password"
        aria-label="Toggle italic"
        className="rounded-none border-x-0 data-[state=on]:pointer-events-none"
      >
        <KeyRound className="h-4 w-4" />
        Private (password)
      </ToggleGroupItem>
      <ToggleGroupItem
        value="private-token"
        aria-label="Toggle underline"
        className="rounded-s-none data-[state=on]:pointer-events-none"
      >
        <AsteriskSquare className="h-4 w-4" />
        Private (token)
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
