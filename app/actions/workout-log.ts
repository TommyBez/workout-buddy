"use server"

import { updateTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { LoggedExercise } from "@/lib/types"

interface SaveWorkoutLogInput {
  planId: string | null
  workoutDay: string
  exercises: LoggedExercise[]
  durationMin: number | null
  difficultyRating: number
  notes: string
}

export async function saveWorkoutLog(input: SaveWorkoutLogInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("workout_logs")
    .insert({
      user_id: user.id,
      plan_id: input.planId,
      workout_day: input.workoutDay,
      exercises: input.exercises,
      duration_min: input.durationMin,
      notes: input.notes || null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Update plan difficulty rating if provided
  if (input.planId && input.difficultyRating) {
    await supabase
      .from("workout_plans")
      .update({ difficulty_rating: input.difficultyRating })
      .eq("id", input.planId)
  }

  // Immediate invalidation so redirected page sees fresh data
  updateTag("dashboard")
  updateTag("progress")
  updateTag("workout-logs")
  updateTag("plan")

  return data
}
