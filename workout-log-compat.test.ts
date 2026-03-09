import { test } from "node:test"
import * as assert from "node:assert/strict"
import {
  fetchWorkoutLogsForPlanUpdate,
  insertWorkoutLogWithCompatibility,
  isMissingColumnError,
} from "./lib/workout-log-compat.js"

const missingDifficultyError = {
  code: "PGRST204",
  message:
    "Could not find the 'difficulty_rating' column of 'workout_logs' in the schema cache",
}

test("isMissingColumnError matches PostgREST missing column responses", () => {
  assert.equal(isMissingColumnError(missingDifficultyError, "workout_logs", "difficulty_rating"), true)
  assert.equal(
    isMissingColumnError(
      {
        code: "42703",
        message: "column workout_logs.difficulty_rating does not exist",
      },
      "workout_logs",
      "difficulty_rating"
    ),
    true
  )
  assert.equal(
    isMissingColumnError(
      { code: "PGRST204", message: "Could not find the 'notes' column of 'workout_logs' in the schema cache" },
      "workout_logs",
      "difficulty_rating"
    ),
    false
  )
})

test("insertWorkoutLogWithCompatibility retries without difficulty_rating", async () => {
  const insertPayloads: Array<Record<string, unknown>> = []
  const responses = [
    { data: null, error: missingDifficultyError },
    { data: { id: "workout-1" }, error: null },
  ]

  const supabase = {
    from(table: string) {
      assert.equal(table, "workout_logs")
      return {
        insert(payload: Record<string, unknown>) {
          insertPayloads.push(payload)
          return {
            select() {
              return {
                single() {
                  return Promise.resolve(responses.shift())
                },
              }
            },
          }
        },
      }
    },
  }

  const result = await insertWorkoutLogWithCompatibility<{ id: string }>(supabase, {
    userId: "user-1",
    planId: "plan-1",
    workoutDay: "Day 1",
    exercises: [{ name: "Bench Press", sets: [{ weight_kg: 20, reps: 8, completed: true }] }],
    durationMin: null,
    difficultyRating: 4,
    notes: "",
  })

  assert.deepEqual(result, { data: { id: "workout-1" }, error: null })
  assert.equal(insertPayloads.length, 2)
  assert.equal(insertPayloads[0].difficulty_rating, 4)
  assert.equal("difficulty_rating" in insertPayloads[1], false)
})

test("insertWorkoutLogWithCompatibility omits difficulty_rating when unset", async () => {
  const insertPayloads: Array<Record<string, unknown>> = []

  const supabase = {
    from() {
      return {
        insert(payload: Record<string, unknown>) {
          insertPayloads.push(payload)
          return {
            select() {
              return {
                single() {
                  return Promise.resolve({ data: { id: "workout-2" }, error: null })
                },
              }
            },
          }
        },
      }
    },
  }

  await insertWorkoutLogWithCompatibility<{ id: string }>(supabase, {
    userId: "user-1",
    planId: "plan-1",
    workoutDay: "Day 1",
    exercises: [{ name: "Bench Press", sets: [{ weight_kg: 20, reps: 8, completed: true }] }],
    durationMin: null,
    difficultyRating: 0,
    notes: "solid session",
  })

  assert.equal(insertPayloads.length, 1)
  assert.equal("difficulty_rating" in insertPayloads[0], false)
})

test("fetchWorkoutLogsForPlanUpdate retries without difficulty_rating and fills nulls", async () => {
  const selectColumns: string[] = []
  const responses = [
    { data: null, error: missingDifficultyError },
    {
      data: [
        {
          workout_day: "Day 1",
          completed_at: "2026-03-09T20:00:00.000Z",
          duration_min: 45,
          notes: null,
          exercises: [],
        },
      ],
      error: null,
    },
  ]

  const supabase = {
    from(table: string) {
      assert.equal(table, "workout_logs")
      return {
        select(columns: string) {
          selectColumns.push(columns)
          return {
            eq() {
              return this
            },
            gte() {
              return this
            },
            order() {
              return this
            },
            limit() {
              return Promise.resolve(responses.shift())
            },
          }
        },
      }
    },
  }

  const result = await fetchWorkoutLogsForPlanUpdate(supabase, "user-1", "2026-01-01T00:00:00.000Z")

  assert.deepEqual(selectColumns, [
    "workout_day, completed_at, duration_min, difficulty_rating, notes, exercises",
    "workout_day, completed_at, duration_min, notes, exercises",
  ])
  assert.deepEqual(result, {
    data: [
      {
        workout_day: "Day 1",
        completed_at: "2026-03-09T20:00:00.000Z",
        duration_min: 45,
        difficulty_rating: null,
        notes: null,
        exercises: [],
      },
    ],
    error: null,
  })
})
