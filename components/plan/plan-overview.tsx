"use client"

import type { WorkoutPlan, FitnessGoal, WorkoutLog } from "@/lib/types"
import { WorkoutDayCard } from "@/components/workout/workout-day-card"
import { PlanFeedbackDrawer } from "@/components/plan/plan-feedback-drawer"

interface PlanOverviewProps {
  plan: WorkoutPlan
  goal: FitnessGoal | null
  recentLogs: WorkoutLog[]
}

export function PlanOverview({ plan, goal, recentLogs }: PlanOverviewProps) {
  return (
    <div className="flex flex-col gap-3 px-4 pb-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {plan.plan_data.days.length} days per week &middot; Week {plan.week_number}
        </p>
      </div>

      {plan.plan_data.days.map((day, index) => (
        <WorkoutDayCard key={index} day={day} dayIndex={index} />
      ))}

      <PlanFeedbackDrawer plan={plan} goal={goal} recentLogs={recentLogs} />
    </div>
  )
}
