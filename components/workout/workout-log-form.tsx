"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ExerciseLogForm } from "@/components/workout/exercise-log-form"
import { DifficultyRating } from "@/components/workout/difficulty-rating"
import { saveWorkoutLog } from "@/app/actions/workout-log"
import { Loader2, Check } from "lucide-react"
import { toast } from "sonner"
import type { WorkoutPlan, LoggedExercise, LoggedSet } from "@/lib/types"

interface WorkoutLogFormProps {
  activePlan: WorkoutPlan | null
  weeklyLogCount: number
}

export function WorkoutLogForm({ activePlan, weeklyLogCount }: WorkoutLogFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [difficulty, setDifficulty] = useState(0)
  const [notes, setNotes] = useState("")

  const todayDayIndex = activePlan
    ? weeklyLogCount % activePlan.plan_data.days.length
    : 0
  const todayWorkout = activePlan?.plan_data.days[todayDayIndex]

  const initialSets = useMemo(() => {
    if (!todayWorkout) return {}
    const map: Record<string, LoggedSet[]> = {}
    todayWorkout.exercises.forEach((ex) => {
      map[ex.name] = Array.from({ length: ex.sets }, () => ({
        weight_kg: 0,
        reps: 0,
        completed: false,
      }))
    })
    return map
  }, [todayWorkout])

  const [exerciseSets, setExerciseSets] = useState<Record<string, LoggedSet[]>>(initialSets)

  function handleSetsChange(exerciseName: string, sets: LoggedSet[]) {
    setExerciseSets((prev) => ({ ...prev, [exerciseName]: sets }))
  }

  async function handleSubmit() {
    if (!todayWorkout || !activePlan) return
    setIsSaving(true)

    const exercises: LoggedExercise[] = Object.entries(exerciseSets).map(
      ([name, sets]) => ({ name, sets })
    )

    try {
      await saveWorkoutLog({
        planId: activePlan.id,
        workoutDay: todayWorkout.name,
        exercises,
        durationMin: null,
        difficultyRating: difficulty,
        notes,
      })
      toast.success("Workout logged!")
      router.push("/dashboard")
      router.refresh()
    } catch {
      toast.error("Failed to save workout")
    } finally {
      setIsSaving(false)
    }
  }

  if (!todayWorkout || !activePlan) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-muted-foreground">No active plan. Create a plan first to start logging.</p>
      </div>
    )
  }

  const totalSets = Object.values(exerciseSets).flat()
  const completedSets = totalSets.filter((s) => s.completed).length

  return (
    <div className="flex flex-col gap-4 px-4 pb-24">
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
        <div>
          <p className="font-semibold text-foreground">{todayWorkout.name}</p>
          <p className="text-xs text-muted-foreground">{todayWorkout.focus}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary">
            {completedSets}/{totalSets.length}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">sets done</p>
        </div>
      </div>

      {todayWorkout.exercises.map((exercise) => (
        <ExerciseLogForm
          key={exercise.name}
          exercise={exercise}
          sets={exerciseSets[exercise.name] || []}
          onSetsChange={(sets) => handleSetsChange(exercise.name, sets)}
        />
      ))}

      <DifficultyRating value={difficulty} onChange={setDifficulty} />

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="How did it feel? Any PRs?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-card"
        />
      </div>

      <Button
        size="lg"
        className="h-12"
        onClick={handleSubmit}
        disabled={isSaving || completedSets === 0}
      >
        {isSaving ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Check className="mr-2 h-4 w-4" />
        )}
        {isSaving ? "Saving..." : "Finish Workout"}
      </Button>
    </div>
  )
}
