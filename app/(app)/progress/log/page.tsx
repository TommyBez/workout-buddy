import { Suspense } from "react"
import { connection } from "next/server"
import { AppHeader } from "@/components/layout/app-header"
import { WorkoutLogForm } from "@/components/workout/workout-log-form"
import { WorkoutLogSkeleton } from "@/components/skeletons/workout-log-skeleton"
import { getWorkoutLogData } from "@/lib/data/workout-log"

async function WorkoutLogData() {
  await connection()
  const data = await getWorkoutLogData()
  if (!data) return null

  return (
    <WorkoutLogForm
      activePlan={data.activePlan}
      suggestedDayIndex={data.suggestedDayIndex}
      lastLogsPerDay={data.lastLogsPerDay}
    />
  )
}

export default function WorkoutLogPage() {
  return (
    <div>
      {/* Static shell - prerendered instantly */}
      <AppHeader title="Log Workout" subtitle="Record your sets and reps" />

      {/* Dynamic - streams in with plan & log count */}
      <Suspense fallback={<WorkoutLogSkeleton />}>
        <WorkoutLogData />
      </Suspense>
    </div>
  )
}
