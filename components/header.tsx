import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="container flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full border-2 border-orange-500"></div>
        <span className="font-bold text-lg">ACME</span>
      </div>
      <div className="flex items-center gap-4">
        <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Pricing
        </Link>
        <Button className="rounded-full">Sign Up</Button>
      </div>
    </header>
  )
}

