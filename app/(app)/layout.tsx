import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Auth gate - checks authentication and redirects if not logged in.
 * Wrapped in Suspense so the static shell renders instantly via PPR.
 */
async function AuthGate({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  return <>{children}</>
}

function ContentSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  )
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Static shell - prerendered at build time */}
      <main className="mx-auto w-full max-w-lg flex-1 pb-20">
        {/* Dynamic auth gate - streams in */}
        <Suspense fallback={<ContentSkeleton />}>
          <AuthGate>{children}</AuthGate>
        </Suspense>
      </main>
      <BottomNav />
    </div>
  )
}
