import { cacheLife, cacheTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { WorkoutPlan, FitnessGoal, WorkoutLog } from "@/lib/types"

export async function getPlanData() {
  "use cache: private"
  cacheLife("hours")
  cacheTag("plan", "workout-plans", "fitness-goals", "workout-logs")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [planRes, goalRes, logsRes] = await Promise.all([
    supabase
      .from("workout_plans")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("fitness_goals")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("workout_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(20),
  ])

  return {
    user,
    activePlan: planRes.data as WorkoutPlan | null,
    activeGoal: goalRes.data as FitnessGoal | null,
    recentLogs: (logsRes.data ?? []) as WorkoutLog[],
  }
}
