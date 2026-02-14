"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dumbbell, BarChart3, User, CalendarCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Today", icon: CalendarCheck },
  { href: "/plan", label: "Plan", icon: Dumbbell },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/90 backdrop-blur-md supports-backdrop-filter:bg-card/75"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-all duration-300",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <span className="absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_8px_hsl(38_92%_50%/0.5)]" />
              )}
              <item.icon className={cn("h-5 w-5 transition-all duration-300", isActive && "stroke-[2.5] drop-shadow-[0_0_6px_hsl(38_92%_50%/0.4)]")} />
              <span className={cn("font-medium transition-all duration-300", isActive && "text-primary")}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
