import { cacheLife, cacheTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getNextWorkoutDayIndex } from "@/lib/data/dashboard"
import type { WorkoutPlan, WorkoutLog } from "@/lib/types"

/**
 * Fetches workout log page data with a per-user private cache.
 */
export async function getWorkoutLogData() {
  "use cache: private"
  cacheLife("minutes")
  cacheTag("workout-log", "workout-plans", "workout-logs")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: planData } = await supabase
    .from("workout_plans")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const activePlan = planData as WorkoutPlan | null
  if (!activePlan) {
    return { activePlan: null, suggestedDayIndex: 0, lastLogsPerDay: {} }
  }

  // Find the most recent log to determine the suggested next workout
  const { data: lastLog } = await supabase
    .from("workout_logs")
    .select("workout_day")
    .eq("user_id", user.id)
    .eq("plan_id", activePlan.id)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  const dayNames = activePlan.plan_data.days.map((d) => d.name)
  const suggestedDayIndex = getNextWorkoutDayIndex(dayNames, lastLog?.workout_day ?? null)

  // Fetch last log for each workout day (for template feature)
  const lastLogsPerDay: Record<string, WorkoutLog> = {}
  const { data: logsForDays } = await supabase
    .from("workout_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("plan_id", activePlan.id)
    .in("workout_day", dayNames)
    .order("completed_at", { ascending: false })

  // Keep only the most recent log per workout day
  for (const log of logsForDays ?? []) {
    if (!lastLogsPerDay[log.workout_day]) {
      lastLogsPerDay[log.workout_day] = log as WorkoutLog
    }
  }

  return {
    activePlan,
    suggestedDayIndex,
    lastLogsPerDay,
  }
}
