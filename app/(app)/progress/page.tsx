import { createClient } from "@/lib/supabase/server"
import { AppHeader } from "@/components/layout/app-header"
import { ProgressContent } from "@/components/progress/progress-content"
import type { BodyMetric, WorkoutLog } from "@/lib/types"

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const [metricsRes, logsRes] = await Promise.all([
    supabase
      .from("body_metrics")
      .select("*")
      .eq("user_id", user.id)
      .order("recorded_at", { ascending: false })
      .limit(30),
    supabase
      .from("workout_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(50),
  ])

  const metrics = (metricsRes.data ?? []) as BodyMetric[]
  const logs = (logsRes.data ?? []) as WorkoutLog[]

  return (
    <div>
      <AppHeader title="Progress" />
      <ProgressContent metrics={metrics} logs={logs} />
    </div>
  )
}
