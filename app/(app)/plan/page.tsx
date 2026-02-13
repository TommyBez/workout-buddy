import { createClient } from "@/lib/supabase/server"
import { AppHeader } from "@/components/layout/app-header"
import { PlanOverview } from "@/components/plan/plan-overview"
import type { WorkoutPlan, FitnessGoal, WorkoutLog } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Dumbbell } from "lucide-react"

export default async function PlanPage() {
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

  const activePlan = planRes.data as WorkoutPlan | null
  const activeGoal = goalRes.data as FitnessGoal | null
  const recentLogs = (logsRes.data ?? []) as WorkoutLog[]

  if (!activePlan) {
    return (
      <div>
        <AppHeader title="Workout Plan" />
        <div className="flex flex-col items-center justify-center gap-4 px-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Dumbbell className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight">No Active Plan</h2>
            <p className="text-sm text-muted-foreground">
              Create a plan tailored to your goals and equipment.
            </p>
          </div>
          <Button asChild size="lg" className="mt-2 h-12 px-8">
            <Link href="/plan/generate">
              <Plus className="mr-2 h-4 w-4" />
              Create My Plan
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AppHeader
        title={activePlan.name}
        subtitle={activePlan.description ?? undefined}
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href="/plan/generate">Adjust</Link>
          </Button>
        }
      />
      <PlanOverview plan={activePlan} goal={activeGoal} recentLogs={recentLogs} />
    </div>
  )
}
