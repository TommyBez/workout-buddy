import { cacheLife, cacheTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { BodyMetric, WorkoutLog } from "@/lib/types"

export async function getProgressData() {
  "use cache: private"
  cacheLife("minutes")
  cacheTag("progress", "body-metrics", "workout-logs")

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

  return {
    metrics: (metricsRes.data ?? []) as BodyMetric[],
    logs: (logsRes.data ?? []) as WorkoutLog[],
  }
}
