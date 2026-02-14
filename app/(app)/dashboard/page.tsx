import { Suspense } from "react"
import { connection } from "next/server"
import { AppHeader } from "@/components/layout/app-header"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton"
import { getDashboardData } from "@/lib/data/dashboard"

async function DashboardGreeting() {
  // Defer to request time so Date.now() is fresh (required for PPR)
  await connection()
  const weekStartIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const data = await getDashboardData(weekStartIso)
  if (!data) return null

  const displayName = data.user.user_metadata?.display_name
  return (
    <AppHeader
      title={`Hey${displayName ? `, ${displayName}` : ""}`}
      subtitle={new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })}
    />
  )
}

async function DashboardData() {
  await connection()
  const weekStartIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const data = await getDashboardData(weekStartIso)
  if (!data) return null

  return (
    <DashboardContent
      activePlan={data.activePlan}
      latestMetric={data.latestMetric}
      weeklyLogs={data.weeklyLogs}
    />
  )
}

export default function DashboardPage() {
  return (
    <div>
      {/* Personalized greeting - streams in quickly from cache */}
      <Suspense fallback={<AppHeader title="Hey" subtitle="Loading..." />}>
        <DashboardGreeting />
      </Suspense>

      {/* Dashboard cards - streams in with cached data */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData />
      </Suspense>
    </div>
  )
}
