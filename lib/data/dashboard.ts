import { cacheLife, cacheTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { WorkoutPlan, BodyMetric, WorkoutLog } from "@/lib/types"

/**
 * Fetches dashboard data with a per-user private cache.
 *
 * `weekStartIso` must be computed *outside* the cache boundary
 * because Date.now() is non-deterministic and would be frozen
 * at build/cache time inside `use cache`.
 */
export async function getDashboardData(weekStartIso: string) {
  "use cache: private"
  cacheLife("minutes")
  cacheTag("dashboard")

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
      .gte("completed_at", weekStartIso)
      .order("completed_at", { ascending: false }),
  ])

  return {
    user,
    activePlan: planRes.data as WorkoutPlan | null,
    latestMetric: metricsRes.data as BodyMetric | null,
    weeklyLogs: (logsRes.data ?? []) as WorkoutLog[],
  }
}
