import type { LoggedExercise } from "@/lib/types"

type PostgrestErrorLike = {
  code?: string | null
  message?: string | null
}

type SupabaseLike = {
  from(table: string): any
}

export interface WorkoutLogInsertInput {
  userId: string
  planId: string | null
  workoutDay: string
  exercises: LoggedExercise[]
  durationMin: number | null
  difficultyRating: number
  notes: string
}

export interface WorkoutLogRowCompat {
  workout_day: string | null
  completed_at: string
  duration_min: number | null
  difficulty_rating: number | null
  notes: string | null
  exercises: unknown
}

export function isMissingColumnError(
  error: PostgrestErrorLike | null | undefined,
  table: string,
  column: string
) {
  const message = error?.message?.toLowerCase() ?? ""
  const normalizedTable = table.toLowerCase()
  const normalizedColumn = column.toLowerCase()

  const isMissingColumnCode =
    error?.code === "PGRST204" || error?.code === "42703"
  const referencesTable =
    message.includes(`'${normalizedTable}'`) ||
    message.includes(`${normalizedTable}.`) ||
    message.includes(normalizedTable)
  const referencesColumn =
    message.includes(`'${normalizedColumn}'`) ||
    message.includes(`${normalizedTable}.${normalizedColumn}`) ||
    message.includes(normalizedColumn)

  return (
    isMissingColumnCode &&
    referencesTable &&
    referencesColumn
  )
}

function buildWorkoutLogInsertPayload(
  input: WorkoutLogInsertInput,
  includeDifficultyRating: boolean
) {
  const payload: {
    user_id: string
    plan_id: string | null
    workout_day: string
    exercises: LoggedExercise[]
    duration_min: number | null
    notes: string | null
    difficulty_rating?: number | null
  } = {
    user_id: input.userId,
    plan_id: input.planId,
    workout_day: input.workoutDay,
    exercises: input.exercises,
    duration_min: input.durationMin,
    notes: input.notes || null,
  }

  if (includeDifficultyRating && input.difficultyRating > 0) {
    payload.difficulty_rating = input.difficultyRating
  }

  return payload
}

export async function insertWorkoutLogWithCompatibility<T>(
  supabase: SupabaseLike,
  input: WorkoutLogInsertInput
) {
  const insert = async (includeDifficultyRating: boolean) =>
    supabase
      .from("workout_logs")
      .insert(buildWorkoutLogInsertPayload(input, includeDifficultyRating))
      .select()
      .single() as Promise<{ data: T | null; error: PostgrestErrorLike | null }>

  const wantsDifficultyRating = input.difficultyRating > 0
  let result = await insert(wantsDifficultyRating)

  if (
    wantsDifficultyRating &&
    isMissingColumnError(result.error, "workout_logs", "difficulty_rating")
  ) {
    result = await insert(false)
  }

  return result
}

export async function fetchWorkoutLogsForPlanUpdate(
  supabase: SupabaseLike,
  userId: string,
  lookbackIso: string
) {
  const runSelect = async (columns: string) =>
    supabase
      .from("workout_logs")
      .select(columns)
      .eq("user_id", userId)
      .gte("completed_at", lookbackIso)
      .order("completed_at", { ascending: true })
      .limit(120) as Promise<{
        data: WorkoutLogRowCompat[] | null
        error: PostgrestErrorLike | null
      }>

  const withDifficultyColumns =
    "workout_day, completed_at, duration_min, difficulty_rating, notes, exercises"
  const withoutDifficultyColumns =
    "workout_day, completed_at, duration_min, notes, exercises"

  const result = await runSelect(withDifficultyColumns)

  if (!isMissingColumnError(result.error, "workout_logs", "difficulty_rating")) {
    return result
  }

  const fallback = await runSelect(withoutDifficultyColumns)
  if (fallback.error) {
    return fallback
  }

  return {
    data: (fallback.data ?? []).map((log) => ({
      ...log,
      difficulty_rating: null,
    })),
    error: null,
  }
}
