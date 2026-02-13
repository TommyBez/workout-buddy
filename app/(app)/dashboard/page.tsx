import { createClient } from "@/lib/supabase/server"
import { AppHeader } from "@/components/layout/app-header"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import type { WorkoutPlan, BodyMetric, WorkoutLog } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const [planRes, metricsRes, logsRes] = await Promise.all([
    supabase
      .from("workout_plans")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("body_metrics")
      .select("*")
      .eq("user_id", user.id)
      .order("recorded_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("workout_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("completed_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order("completed_at", { ascending: false }),
  ])

  const activePlan = planRes.data as WorkoutPlan | null
  const latestMetric = metricsRes.data as BodyMetric | null
  const weeklyLogs = (logsRes.data ?? []) as WorkoutLog[]

  return (
    <div>
      <AppHeader
        title={`Hey${user.user_metadata?.display_name ? `, ${user.user_metadata.display_name}` : ""}`}
        subtitle={new Date().toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      />
      <DashboardContent
        activePlan={activePlan}
        latestMetric={latestMetric}
        weeklyLogs={weeklyLogs}
      />
    </div>
  )
}
