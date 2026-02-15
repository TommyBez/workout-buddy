import { cacheLife, cacheTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { WorkoutPlan, FitnessGoal } from "@/lib/types"

export async function getPlanData() {
  "use cache: private"
  cacheLife("hours")
  cacheTag("plan", "workout-plans", "fitness-goals")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [planRes, goalRes] = await Promise.all([
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
  ])

  return {
    user,
    activePlan: planRes.data as WorkoutPlan | null,
    activeGoal: goalRes.data as FitnessGoal | null,
  }
}
