import { z } from "zod"

export const goalStepSchema = z.object({
  goal_type: z.enum(["lose_weight", "build_muscle", "get_stronger", "general_fitness"]),
})

export const metricsStepSchema = z.object({
  weight_kg: z.coerce.number().min(20).max(300),
  height_cm: z.coerce.number().min(100).max(250).optional(),
  experience_level: z.enum(["beginner", "intermediate", "advanced"]),
})

export const preferencesStepSchema = z.object({
  days_per_week: z.coerce.number().min(2).max(6),
  session_duration_min: z.coerce.number().min(30).max(120),
  equipment_access: z.array(z.string()).min(1, "Select at least one"),
  focus_areas: z.array(z.string()).min(1, "Select at least one"),
})

export const plannedExerciseSchema = z.object({
  name: z.string(),
  sets: z.number(),
  reps: z.string(),
  rest_sec: z.number(),
  notes: z.string().nullable(),
  alternatives: z.array(z.string()),
})

export const workoutDaySchema = z.object({
  name: z.string(),
  focus: z.string(),
  warmup: z.string(),
  exercises: z.array(plannedExerciseSchema),
  cooldown: z.string(),
})

export const workoutPlanOutputSchema = z.object({
  name: z.string(),
  description: z.string(),
  days: z.array(workoutDaySchema),
})

export const workoutPlanUpdateOutputSchema = z.object({
  action: z.enum(["update_current_plan", "generate_new_plan"]),
  rationale: z.string(),
  plan: workoutPlanOutputSchema,
})

export const bodyMetricFormSchema = z.object({
  weight_kg: z.coerce.number().min(20).max(300).optional(),
  body_fat_pct: z.coerce.number().min(1).max(60).optional(),
  chest_cm: z.coerce.number().min(50).max(200).optional(),
  waist_cm: z.coerce.number().min(40).max(200).optional(),
  hips_cm: z.coerce.number().min(50).max(200).optional(),
  bicep_cm: z.coerce.number().min(15).max(60).optional(),
  thigh_cm: z.coerce.number().min(30).max(100).optional(),
})

export const workoutFeedbackSchema = z.object({
  difficulty_rating: z.number().min(1).max(5),
  feedback: z.string().max(500).optional(),
})

export type GoalStepValues = z.infer<typeof goalStepSchema>
export type MetricsStepValues = z.infer<typeof metricsStepSchema>
export type PreferencesStepValues = z.infer<typeof preferencesStepSchema>
export type WorkoutPlanOutput = z.infer<typeof workoutPlanOutputSchema>
export type WorkoutPlanUpdateOutput = z.infer<typeof workoutPlanUpdateOutputSchema>
export type BodyMetricFormValues = z.infer<typeof bodyMetricFormSchema>
export type WorkoutFeedbackValues = z.infer<typeof workoutFeedbackSchema>
