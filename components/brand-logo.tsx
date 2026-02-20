import Image from "next/image"
import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  compact?: boolean
  onDark?: boolean
  large?: boolean
}

export function BrandLogo({ className, compact = false, onDark = false, large = false }: BrandLogoProps) {
  const width = compact ? 54 : large ? 220 : 190
  const height = compact ? 36 : large ? 146 : 126
  return (
    <div
      className={cn(
        "inline-flex items-center",
        onDark && "rounded-xl bg-white px-2 py-1.5 shadow-[0_4px_18px_rgba(7,16,45,0.3)]",
        className,
      )}
    >
      <Image
        src="/Utour-logo.svg"
        alt="Utour"
        width={width}
        height={height}
        className={cn(compact ? "h-8 w-auto" : large ? "h-14 w-auto" : "h-12 w-auto")}
        priority
      />
    </div>
  )
}
