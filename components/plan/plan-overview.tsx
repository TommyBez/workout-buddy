"use client"

import type { WorkoutPlan, FitnessGoal } from "@/lib/types"
import { WorkoutDayCard } from "@/components/workout/workout-day-card"
import { PlanFeedbackDrawer } from "@/components/plan/plan-feedback-drawer"

interface PlanOverviewProps {
  plan: WorkoutPlan
  goal: FitnessGoal | null
}

export function PlanOverview({ plan, goal }: PlanOverviewProps) {
  return (
    <div className="flex flex-col gap-3 px-4 pb-4">
      <p className="animate-fade-in delay-50 text-sm text-muted-foreground">
        {plan.plan_data.days.length} days per week &middot; Week {plan.week_number}
      </p>

      {plan.plan_data.days.map((day, index) => (
        <div key={index} className="animate-fade-up" style={{ animationDelay: `${100 + index * 75}ms` }}>
          <WorkoutDayCard day={day} dayIndex={index} />
        </div>
      ))}

      <div className="animate-fade-up" style={{ animationDelay: `${100 + plan.plan_data.days.length * 75 + 50}ms` }}>
        <PlanFeedbackDrawer plan={plan} goal={goal} />
      </div>
    </div>
  )
}
