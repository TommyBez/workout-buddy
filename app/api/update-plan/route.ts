import { generateText, Output } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { workoutPlanUpdateOutputSchema } from "@/lib/schemas"

const LOOKBACK_MONTHS = 2

const updatePlanRequestSchema = z.object({
  feedback: z.string().trim().max(1000).optional(),
})

const goalDescriptions: Record<string, string> = {
  lose_weight: "fat loss with higher rep ranges, supersets, and metabolic conditioning",
  build_muscle: "hypertrophy with moderate-heavy weights, 8-12 rep ranges, and volume",
  get_stronger: "strength with heavy compounds, 3-6 rep ranges, and longer rest periods",
  general_fitness: "balanced training with a mix of compound and isolation movements",
}

interface GoalRow {
  id: string
  goal_type: string
  target_weight_kg: number | string | null
  days_per_week: number | null
  session_duration_min?: number | null
  preferred_duration_min?: number | null
  equipment_access: string[] | null
  focus_areas: string[] | null
}

interface ProfileRow {
  experience_level: string | null
  height_cm: number | string | null
}

interface ActivePlanRow {
  id: string
  name: string
  description: string | null
  week_number: number | null
  plan_data: unknown
}

interface WorkoutLogRow {
  workout_day: string | null
  completed_at: string
  duration_min: number | null
  difficulty_rating: number | null
  notes: string | null
  exercises: unknown
}

interface BodyMetricRow {
  recorded_at: string
  weight_kg: number | string | null
  body_fat_pct: number | string | null
  chest_cm: number | string | null
  waist_cm: number | string | null
  hips_cm: number | string | null
  bicep_cm: number | string | null
  thigh_cm: number | string | null
}

interface BodyMetricChanges {
  weight_kg: number | null
  body_fat_pct: number | null
  waist_cm: number | null
  chest_cm: number | null
  bicep_cm: number | null
  thigh_cm: number | null
}

interface PhaseReadinessSummary {
  ready_for_next_phase: boolean
  reasons: string[]
  adherence_ratio: number | null
  average_difficulty: number | null
  difficulty_trend: "up" | "down" | "flat" | "unknown"
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function round(value: number, digits = 1): number {
  const multiplier = 10 ** digits
  return Math.round(value * multiplier) / multiplier
}

function average(values: number[]): number | null {
  if (values.length === 0) return null
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function trendDirection(start: number | null, end: number | null): "up" | "down" | "flat" | "unknown" {
  if (start === null || end === null) return "unknown"
  const delta = end - start
  if (delta >= 0.25) return "up"
  if (delta <= -0.25) return "down"
  return "flat"
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
}

function extractExerciseNames(exercises: unknown): string[] {
  if (!Array.isArray(exercises)) return []

  return exercises
    .map((exercise) => {
      if (typeof exercise !== "object" || exercise === null) return null
      const name = (exercise as { name?: unknown }).name
      return typeof name === "string" ? name : null
    })
    .filter((name): name is string => Boolean(name))
}

function summarizeWorkoutLogs(logs: WorkoutLogRow[], daysPerWeek: number) {
  const durationValues = logs
    .map((log) => toNumber(log.duration_min))
    .filter((value): value is number => value !== null)

  const difficultyValues = logs
    .map((log) => toNumber(log.difficulty_rating))
    .filter((value): value is number => value !== null)

  const dayCounts = new Map<string, number>()
  for (const log of logs) {
    const day = log.workout_day?.trim()
    if (!day) continue
    dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1)
  }

  const noteHighlights = logs
    .filter((log) => typeof log.notes === "string" && log.notes.trim().length > 0)
    .slice(-6)
    .map((log) => ({
      completed_at: log.completed_at,
      note: log.notes as string,
    }))

  const expectedWorkouts = daysPerWeek * LOOKBACK_MONTHS * 4
  const adherenceRatio = expectedWorkouts > 0 ? logs.length / expectedWorkouts : null

  const firstHalfDifficulties = difficultyValues.slice(0, Math.floor(difficultyValues.length / 2))
  const secondHalfDifficulties = difficultyValues.slice(Math.floor(difficultyValues.length / 2))
  const firstHalfDifficultyAvg = average(firstHalfDifficulties)
  const secondHalfDifficultyAvg = average(secondHalfDifficulties)
  const difficultyTrend = trendDirection(firstHalfDifficultyAvg, secondHalfDifficultyAvg)

  return {
    total_workouts: logs.length,
    expected_workouts: expectedWorkouts,
    adherence_ratio: adherenceRatio === null ? null : round(adherenceRatio, 2),
    average_duration_min:
      durationValues.length === 0
        ? null
        : round(durationValues.reduce((sum, value) => sum + value, 0) / durationValues.length),
    average_difficulty:
      difficultyValues.length === 0
        ? null
        : round(difficultyValues.reduce((sum, value) => sum + value, 0) / difficultyValues.length),
    first_half_avg_difficulty:
      firstHalfDifficultyAvg === null ? null : round(firstHalfDifficultyAvg, 2),
    second_half_avg_difficulty:
      secondHalfDifficultyAvg === null ? null : round(secondHalfDifficultyAvg, 2),
    difficulty_trend: difficultyTrend,
    top_logged_days: Array.from(dayCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([day, count]) => ({ day, count })),
    note_highlights: noteHighlights,
  }
}

function summarizeBodyMetrics(metrics: BodyMetricRow[]) {
  if (metrics.length === 0) {
    return {
      entries: 0,
      first_recorded_at: null,
      latest_recorded_at: null,
      latest: null,
      changes: null,
    }
  }

  const first = metrics[0]
  const latest = metrics[metrics.length - 1]

  const firstWeight = toNumber(first.weight_kg)
  const latestWeight = toNumber(latest.weight_kg)
  const firstBodyFat = toNumber(first.body_fat_pct)
  const latestBodyFat = toNumber(latest.body_fat_pct)
  const firstWaist = toNumber(first.waist_cm)
  const latestWaist = toNumber(latest.waist_cm)
  const firstChest = toNumber(first.chest_cm)
  const latestChest = toNumber(latest.chest_cm)
  const firstBicep = toNumber(first.bicep_cm)
  const latestBicep = toNumber(latest.bicep_cm)
  const firstThigh = toNumber(first.thigh_cm)
  const latestThigh = toNumber(latest.thigh_cm)

  return {
    entries: metrics.length,
    first_recorded_at: first.recorded_at,
    latest_recorded_at: latest.recorded_at,
    latest: {
      weight_kg: latestWeight,
      body_fat_pct: latestBodyFat,
      chest_cm: toNumber(latest.chest_cm),
      waist_cm: latestWaist,
      hips_cm: toNumber(latest.hips_cm),
      bicep_cm: toNumber(latest.bicep_cm),
      thigh_cm: toNumber(latest.thigh_cm),
    },
    changes: {
      weight_kg:
        firstWeight !== null && latestWeight !== null
          ? round(latestWeight - firstWeight, 2)
          : null,
      body_fat_pct:
        firstBodyFat !== null && latestBodyFat !== null
          ? round(latestBodyFat - firstBodyFat, 2)
          : null,
      waist_cm:
        firstWaist !== null && latestWaist !== null
          ? round(latestWaist - firstWaist, 2)
          : null,
      chest_cm:
        firstChest !== null && latestChest !== null
          ? round(latestChest - firstChest, 2)
          : null,
      bicep_cm:
        firstBicep !== null && latestBicep !== null
          ? round(latestBicep - firstBicep, 2)
          : null,
      thigh_cm:
        firstThigh !== null && latestThigh !== null
          ? round(latestThigh - firstThigh, 2)
          : null,
    },
  }
}

function getExperienceLevel(value: string | null): "beginner" | "intermediate" | "advanced" {
  if (value === "beginner" || value === "intermediate" || value === "advanced") {
    return value
  }
  return "intermediate"
}

function assessPhaseReadiness(params: {
  goalType: string
  workoutSummary: {
    total_workouts: number
    adherence_ratio: number | null
    average_difficulty: number | null
    difficulty_trend: "up" | "down" | "flat" | "unknown"
  }
  bodyChanges: BodyMetricChanges | null
  daysPerWeek: number
}): PhaseReadinessSummary {
  const { goalType, workoutSummary, bodyChanges, daysPerWeek } = params
  const reasons: string[] = []

  const expectedMinimumWorkouts = Math.max(6, daysPerWeek * 4)
  const consistentTraining =
    workoutSummary.total_workouts >= expectedMinimumWorkouts &&
    (workoutSummary.adherence_ratio ?? 0) >= 0.7
  const manageableDifficulty =
    workoutSummary.average_difficulty !== null && workoutSummary.average_difficulty <= 3.2
  const adaptingWell =
    workoutSummary.difficulty_trend === "down" ||
    (workoutSummary.average_difficulty !== null && workoutSummary.average_difficulty <= 2.8)

  let progressTowardGoal = false

  if (goalType === "lose_weight") {
    progressTowardGoal =
      (bodyChanges?.weight_kg ?? 0) <= -1 ||
      (bodyChanges?.waist_cm ?? 0) <= -1 ||
      (bodyChanges?.body_fat_pct ?? 0) <= -0.8
  } else if (goalType === "build_muscle") {
    progressTowardGoal =
      (bodyChanges?.weight_kg ?? 0) >= 0.8 ||
      (bodyChanges?.chest_cm ?? 0) >= 0.8 ||
      (bodyChanges?.bicep_cm ?? 0) >= 0.5 ||
      (bodyChanges?.thigh_cm ?? 0) >= 0.8
  } else if (goalType === "get_stronger") {
    progressTowardGoal = consistentTraining && adaptingWell
  } else {
    progressTowardGoal =
      consistentTraining &&
      ((bodyChanges?.body_fat_pct ?? 0) <= -0.5 ||
        (workoutSummary.average_difficulty !== null && workoutSummary.average_difficulty <= 3))
  }

  if (consistentTraining) reasons.push("Consistent adherence over recent weeks.")
  if (manageableDifficulty) reasons.push("Average session difficulty is manageable.")
  if (adaptingWell) reasons.push("Difficulty trend suggests adaptation to the current phase.")
  if (progressTowardGoal) reasons.push("Body/performance trends show progress toward the goal.")

  const readyForNextPhase =
    consistentTraining &&
    manageableDifficulty &&
    (progressTowardGoal || adaptingWell)

  return {
    ready_for_next_phase: readyForNextPhase,
    reasons,
    adherence_ratio: workoutSummary.adherence_ratio,
    average_difficulty: workoutSummary.average_difficulty,
    difficulty_trend: workoutSummary.difficulty_trend,
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsedBody = updatePlanRequestSchema.safeParse(body)

    if (!parsedBody.success) {
      return Response.json(
        { error: "Invalid request payload", details: parsedBody.error.flatten() },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 })
    }

    const lookbackDate = new Date()
    lookbackDate.setMonth(lookbackDate.getMonth() - LOOKBACK_MONTHS)
    const lookbackIso = lookbackDate.toISOString()
    const lookbackDateOnly = lookbackIso.slice(0, 10)

    const [goalRes, activePlanRes, profileRes, logsRes, metricsRes, latestMetricRes] =
      await Promise.all([
        supabase
          .from("fitness_goals")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("workout_plans")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("profiles")
          .select("experience_level, height_cm")
          .eq("id", user.id)
          .maybeSingle(),
        supabase
          .from("workout_logs")
          .select("workout_day, completed_at, duration_min, difficulty_rating, notes, exercises")
          .eq("user_id", user.id)
          .gte("completed_at", lookbackIso)
          .order("completed_at", { ascending: true })
          .limit(120),
        supabase
          .from("body_metrics")
          .select(
            "recorded_at, weight_kg, body_fat_pct, chest_cm, waist_cm, hips_cm, bicep_cm, thigh_cm"
          )
          .eq("user_id", user.id)
          .gte("recorded_at", lookbackDateOnly)
          .order("recorded_at", { ascending: true })
          .limit(90),
        supabase
          .from("body_metrics")
          .select("weight_kg")
          .eq("user_id", user.id)
          .order("recorded_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])

    if (goalRes.error) {
      return Response.json({ error: goalRes.error.message }, { status: 500 })
    }
    if (activePlanRes.error) {
      return Response.json({ error: activePlanRes.error.message }, { status: 500 })
    }
    if (profileRes.error) {
      return Response.json({ error: profileRes.error.message }, { status: 500 })
    }
    if (logsRes.error) {
      return Response.json({ error: logsRes.error.message }, { status: 500 })
    }
    if (metricsRes.error) {
      return Response.json({ error: metricsRes.error.message }, { status: 500 })
    }
    if (latestMetricRes.error) {
      return Response.json({ error: latestMetricRes.error.message }, { status: 500 })
    }

    const activeGoal = goalRes.data as GoalRow | null
    const activePlan = activePlanRes.data as ActivePlanRow | null
    const profile = profileRes.data as ProfileRow | null
    const workoutLogs = (logsRes.data ?? []) as WorkoutLogRow[]
    const bodyMetrics = (metricsRes.data ?? []) as BodyMetricRow[]

    if (!activeGoal || !activePlan) {
      return Response.json(
        { error: "An active goal and active plan are required before updating a plan." },
        { status: 400 }
      )
    }

    const feedback = parsedBody.data.feedback
    const equipmentAccess = toStringArray(activeGoal.equipment_access)
    const focusAreas = toStringArray(activeGoal.focus_areas)
    const targetWeight = toNumber(activeGoal.target_weight_kg)
    const targetDaysPerWeek = Math.max(2, Math.min(6, toNumber(activeGoal.days_per_week) ?? 3))
    const targetSessionDuration = Math.max(
      30,
      Math.min(
        120,
        toNumber(activeGoal.session_duration_min ?? activeGoal.preferred_duration_min) ?? 60
      )
    )

    const latestLookbackWeight = toNumber(bodyMetrics.at(-1)?.weight_kg ?? null)
    const latestStoredWeight = toNumber(
      (latestMetricRes.data as { weight_kg?: number | string | null } | null)?.weight_kg ?? null
    )
    const currentWeightKg = latestLookbackWeight ?? latestStoredWeight ?? 75
    const heightCm = toNumber(profile?.height_cm ?? null)
    const experienceLevel = getExperienceLevel(profile?.experience_level ?? null)
    const goalType = activeGoal.goal_type || "general_fitness"
    const goalDescription = goalDescriptions[goalType] ?? "general fitness"

    const workoutSummary = summarizeWorkoutLogs(workoutLogs, targetDaysPerWeek)
    const bodyMetricSummary = summarizeBodyMetrics(bodyMetrics)
    const phaseReadiness = assessPhaseReadiness({
      goalType,
      workoutSummary: {
        total_workouts: workoutSummary.total_workouts,
        adherence_ratio: workoutSummary.adherence_ratio,
        average_difficulty: workoutSummary.average_difficulty,
        difficulty_trend: workoutSummary.difficulty_trend,
      },
      bodyChanges: bodyMetricSummary.changes as BodyMetricChanges | null,
      daysPerWeek: targetDaysPerWeek,
    })
    const forceNewPhase = phaseReadiness.ready_for_next_phase

    const strategyHint =
      forceNewPhase
        ? "generate_new_plan"
        : workoutSummary.adherence_ratio !== null && workoutSummary.adherence_ratio < 0.45
        ? "generate_new_plan"
        : "update_current_plan"

    const workoutSamples = workoutLogs.slice(-12).map((log) => ({
      completed_at: log.completed_at,
      workout_day: log.workout_day,
      duration_min: toNumber(log.duration_min),
      difficulty_rating: toNumber(log.difficulty_rating),
      notes: log.notes,
      exercise_names: extractExerciseNames(log.exercises),
    }))

    const metricSamples = bodyMetrics.slice(-8).map((metric) => ({
      recorded_at: metric.recorded_at,
      weight_kg: toNumber(metric.weight_kg),
      body_fat_pct: toNumber(metric.body_fat_pct),
      waist_cm: toNumber(metric.waist_cm),
      chest_cm: toNumber(metric.chest_cm),
      hips_cm: toNumber(metric.hips_cm),
      bicep_cm: toNumber(metric.bicep_cm),
      thigh_cm: toNumber(metric.thigh_cm),
    }))
    const phaseDirective = forceNewPhase
      ? 'Phase readiness is TRUE, so action MUST be "generate_new_plan" and the plan should represent a clear step-up to the next training phase.'
      : ""

    const systemPrompt = `You are an expert personal trainer updating an active workout plan.

Your job is to decide whether to:
1) "update_current_plan" with targeted adjustments, or
2) "generate_new_plan" with a fresh structure.

Decision requirements:
- Use the user's goal, current active plan, last ${LOOKBACK_MONTHS} months of workout logs, and last ${LOOKBACK_MONTHS} months of body metrics.
- Favor "update_current_plan" when adherence is good and only moderate tweaks are needed.
- Favor "generate_new_plan" when adherence is poor, constraints changed, or progress data suggests the plan structure is not working.
- Also choose "generate_new_plan" when progress indicates the athlete is ready to step up into a new training phase.
- Keep recommendations realistic and specific.

Plan construction rules:
- Sessions must fit ~${targetSessionDuration} minutes.
- Use only available equipment: ${equipmentAccess.join(", ") || "bodyweight"}.
- Prioritize these focus areas: ${focusAreas.join(", ") || "balanced full body"}.
- Match difficulty to a ${experienceLevel} lifter weighing ${currentWeightKg}kg.
- Include exactly one week plan with clear day names.
- Each exercise needs sets, rep ranges, rest in seconds, and 1-2 alternatives.
- Include warmup and cooldown text for every day.`

    const prompt = `Update this user's plan for ${goalDescription}.

User goal:
${JSON.stringify(
  {
    goal_type: goalType,
    target_weight_kg: targetWeight,
    days_per_week: targetDaysPerWeek,
    session_duration_min: targetSessionDuration,
    equipment_access: equipmentAccess,
    focus_areas: focusAreas,
  },
  null,
  2
)}

User metrics:
${JSON.stringify(
  {
    weight_kg: currentWeightKg,
    height_cm: heightCm,
    experience_level: experienceLevel,
  },
  null,
  2
)}

Current active plan:
${JSON.stringify(
  {
    id: activePlan.id,
    name: activePlan.name,
    description: activePlan.description,
    week_number: activePlan.week_number,
    plan_data: activePlan.plan_data,
  },
  null,
  2
)}

Workout log summary (past ${LOOKBACK_MONTHS} months):
${JSON.stringify(workoutSummary, null, 2)}

Workout log samples (past ${LOOKBACK_MONTHS} months):
${JSON.stringify(workoutSamples, null, 2)}

Body metric summary (past ${LOOKBACK_MONTHS} months):
${JSON.stringify(bodyMetricSummary, null, 2)}

Body metric samples (past ${LOOKBACK_MONTHS} months):
${JSON.stringify(metricSamples, null, 2)}

User feedback:
${feedback && feedback.length > 0 ? feedback : "No additional feedback provided."}

Initial strategy hint from adherence data: ${strategyHint}. You may override this hint if data supports another decision.

Phase readiness assessment:
${JSON.stringify(phaseReadiness, null, 2)}
${phaseDirective}

Return:
- action: "update_current_plan" or "generate_new_plan"
- rationale: concise explanation
- plan: the updated/generated weekly plan`

    const { output } = await generateText({
      model: "google/gemini-3-flash",
      output: Output.object({ schema: workoutPlanUpdateOutputSchema }),
      system: systemPrompt,
      prompt,
    })

    const finalAction =
      forceNewPhase && output.action !== "generate_new_plan"
        ? "generate_new_plan"
        : output.action
    const finalRationale =
      forceNewPhase && output.action !== "generate_new_plan"
        ? `${output.rationale} Switched to a new phase because readiness signals indicate the athlete has adapted and should progress.`
        : output.rationale

    return Response.json({
      action: finalAction,
      rationale: finalRationale,
      plan: output.plan,
      lookback_months: LOOKBACK_MONTHS,
      phase_readiness: phaseReadiness,
    })
  } catch {
    return Response.json({ error: "Failed to update plan" }, { status: 500 })
  }
}
