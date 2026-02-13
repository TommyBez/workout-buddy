"use client"

import Link from "next/link"
import type { WorkoutPlan, BodyMetric, WorkoutLog } from "@/lib/types"
import { WorkoutDayCard } from "@/components/workout/workout-day-card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Scale, Flame, TrendingUp, Plus } from "lucide-react"

interface DashboardContentProps {
  activePlan: WorkoutPlan | null
  latestMetric: BodyMetric | null
  weeklyLogs: WorkoutLog[]
}

export function DashboardContent({
  activePlan,
  latestMetric,
  weeklyLogs,
}: DashboardContentProps) {
  if (!activePlan) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Dumbbell className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight">No Plan Yet</h2>
          <p className="text-sm text-muted-foreground">
            Set your goals and get a personalized workout plan built for you.
          </p>
        </div>
        <Button asChild size="lg" className="mt-2 h-12 px-8">
          <Link href="/plan/generate">
            <Plus className="mr-2 h-4 w-4" />
            Create My Plan
          </Link>
        </Button>
      </div>
    )
  }

  const planData = activePlan.plan_data
  const todayDayIndex = getTodayWorkoutIndex(planData.days.length, weeklyLogs.length)
  const todayWorkout = planData.days[todayDayIndex]

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-border bg-card p-3">
          <Scale className="mb-1 h-4 w-4 text-muted-foreground" />
          <p className="text-lg font-bold text-foreground">
            {latestMetric?.weight_kg ? `${latestMetric.weight_kg}` : "--"}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">kg</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <Flame className="mb-1 h-4 w-4 text-muted-foreground" />
          <p className="text-lg font-bold text-foreground">{weeklyLogs.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">this week</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <TrendingUp className="mb-1 h-4 w-4 text-muted-foreground" />
          <p className="text-lg font-bold text-foreground">Wk {activePlan.week_number}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">of plan</p>
        </div>
      </div>

      {/* Today's Workout */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {"Today's Workout"}
          </h2>
          <Link href="/progress/log" className="text-xs font-medium text-primary">
            Start Logging
          </Link>
        </div>
        <WorkoutDayCard
          day={todayWorkout}
          dayIndex={todayDayIndex}
          isToday
          defaultExpanded
        />
      </div>

      {/* Up Next */}
      {planData.days.length > 1 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Up Next
          </h2>
          {planData.days
            .filter((_, i) => i !== todayDayIndex)
            .slice(0, 2)
            .map((day, i) => {
              const actualIndex = planData.days.indexOf(day)
              return (
                <WorkoutDayCard
                  key={actualIndex}
                  day={day}
                  dayIndex={actualIndex}
                />
              )
            })}
          <Button variant="outline" asChild className="w-full">
            <Link href="/plan">View Full Plan</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

function getTodayWorkoutIndex(totalDays: number, logsThisWeek: number): number {
  return logsThisWeek % totalDays
}
