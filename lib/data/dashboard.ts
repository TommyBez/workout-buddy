import { cacheLife, cacheTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { WorkoutPlan, BodyMetric, WorkoutLog } from "@/lib/types"

/**
 * Given an array of workout day names and the last logged day name,
 * returns the index of the next workout day in the rotation.
 */
export function getNextWorkoutDayIndex(
  dayNames: string[],
  lastLoggedDayName: string | null
): number {
  if (!lastLoggedDayName || dayNames.length === 0) return 0
  const lastIndex = dayNames.indexOf(lastLoggedDayName)
  if (lastIndex === -1) return 0
  return (lastIndex + 1) % dayNames.length
}

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

  const activePlan = planRes.data as WorkoutPlan | null
  const weeklyLogs = (logsRes.data ?? []) as WorkoutLog[]

  // Find the most recent log for this plan to determine next workout day
  let lastLoggedDayName: string | null = null
  if (activePlan) {
    const { data: lastLog } = await supabase
      .from("workout_logs")
      .select("workout_day")
      .eq("user_id", user.id)
      .eq("plan_id", activePlan.id)
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle()
    lastLoggedDayName = lastLog?.workout_day ?? null
  }

  return {
    user,
    activePlan,
    latestMetric: metricsRes.data as BodyMetric | null,
    weeklyLogs,
    lastLoggedDayName,
  }
}
