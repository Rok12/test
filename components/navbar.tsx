"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AuthButton } from "@/components/auth-button"
import { ShoppingCart, Calendar } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">FurniConfig</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
          <Link
            href="/"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/" ? "text-foreground" : "text-foreground/60",
            )}
          >
            Shop for furniture
          </Link>
          <Link
            href="/builder"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/builder") ? "text-foreground" : "text-foreground/60",
            )}
          >
            Design your own
          </Link>
          <Link
            href="/help"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/help") ? "text-foreground" : "text-foreground/60",
            )}
          >
            Services & Help
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <AuthButton />
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Appointment
          </Button>
        </div>
      </div>
    </header>
  )
}
