"use client"

import Link from "next/link"
import type { WorkoutPlan, BodyMetric, WorkoutLog } from "@/lib/types"
import { WorkoutDayCard } from "@/components/workout/workout-day-card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Scale, Flame, TrendingUp, Plus, ArrowRight } from "lucide-react"

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
      <div className="animate-fade-up delay-200 flex flex-col items-center justify-center gap-5 px-4 py-20 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <Dumbbell className="h-8 w-8 text-primary" />
          <div className="absolute -inset-2 -z-10 rounded-3xl bg-primary/5 blur-xl" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl uppercase tracking-wide">No Plan Yet</h2>
          <p className="text-sm text-muted-foreground">
            Set your goals and get a personalized workout plan built for you.
          </p>
        </div>
        <Button asChild size="lg" className="group relative mt-2 h-13 overflow-hidden px-8 shadow-lg shadow-primary/20">
          <Link href="/plan/generate">
            <span className="relative z-10 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create My Plan
            </span>
            <div className="btn-shimmer absolute inset-0" />
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
      <div className="animate-fade-up delay-100 grid grid-cols-3 gap-2">
        <div className="stat-card rounded-xl border border-border bg-card p-3">
          <Scale className="mb-1.5 h-4 w-4 text-primary/60" />
          <p className="font-display text-2xl text-foreground">
            {latestMetric?.weight_kg ? `${latestMetric.weight_kg}` : "--"}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">kg</p>
        </div>
        <div className="stat-card rounded-xl border border-border bg-card p-3">
          <Flame className="mb-1.5 h-4 w-4 text-primary/60" />
          <p className="font-display text-2xl text-foreground">{weeklyLogs.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">this week</p>
        </div>
        <div className="stat-card rounded-xl border border-border bg-card p-3">
          <TrendingUp className="mb-1.5 h-4 w-4 text-primary/60" />
          <p className="font-display text-2xl text-foreground">Wk {activePlan.week_number}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">of plan</p>
        </div>
      </div>

      {/* Today's Workout */}
      <div className="animate-fade-up delay-200 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {"Today's Workout"}
          </h2>
          <Link
            href="/progress/log"
            className="group flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            Start Logging
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
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
        <div className="animate-fade-up delay-300 space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Up Next
          </h2>
          {planData.days
            .filter((_, i) => i !== todayDayIndex)
            .slice(0, 2)
            .map((day) => {
              const actualIndex = planData.days.indexOf(day)
              return (
                <WorkoutDayCard
                  key={actualIndex}
                  day={day}
                  dayIndex={actualIndex}
                />
              )
            })}
          <Button variant="outline" asChild className="w-full border-border/80 transition-all duration-300 hover:border-primary/20 hover:bg-primary/5">
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
