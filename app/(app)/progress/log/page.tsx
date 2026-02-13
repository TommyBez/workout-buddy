import { createClient } from "@/lib/supabase/server"
import { AppHeader } from "@/components/layout/app-header"
import { WorkoutLogForm } from "@/components/workout/workout-log-form"
import type { WorkoutPlan } from "@/lib/types"

export default async function WorkoutLogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from("workout_plans")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const activePlan = data as WorkoutPlan | null

  const { data: logsData } = await supabase
    .from("workout_logs")
    .select("*")
    .eq("user_id", user.id)
    .gte("completed_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  const weeklyLogCount = logsData?.length ?? 0

  return (
    <div>
      <AppHeader title="Log Workout" subtitle="Record your sets and reps" />
      <WorkoutLogForm activePlan={activePlan} weeklyLogCount={weeklyLogCount} />
    </div>
  )
}
