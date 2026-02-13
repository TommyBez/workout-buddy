export interface Profile {
  id: string
  display_name: string | null
  gender: string | null
  date_of_birth: string | null
  height_cm: number | null
  experience_level: string
  created_at: string
  updated_at: string
}

export interface FitnessGoal {
  id: string
  user_id: string
  goal_type: string
  target_weight_kg: number | null
  days_per_week: number
  session_duration_min: number
  focus_areas: string[]
  equipment_access: string[]
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BodyMetric {
  id: string
  user_id: string
  recorded_at: string
  weight_kg: number | null
  body_fat_pct: number | null
  chest_cm: number | null
  waist_cm: number | null
  hips_cm: number | null
  bicep_cm: number | null
  thigh_cm: number | null
  notes: string | null
  created_at: string
}

export interface WorkoutPlan {
  id: string
  user_id: string
  goal_id: string | null
  name: string
  description: string | null
  plan_data: PlanData
  week_number: number
  is_active: boolean
  feedback: string | null
  difficulty_rating: number | null
  created_at: string
  updated_at: string
}

export interface PlanData {
  days: WorkoutDay[]
}

export interface WorkoutDay {
  name: string
  focus: string
  warmup: string
  exercises: PlannedExercise[]
  cooldown: string
}

export interface PlannedExercise {
  name: string
  sets: number
  reps: string
  rest_sec: number
  notes: string | null
  alternatives: string[]
}

export interface WorkoutLog {
  id: string
  user_id: string
  plan_id: string | null
  workout_day: string
  exercises: LoggedExercise[]
  duration_min: number | null
  notes: string | null
  completed_at: string
  created_at: string
}

export interface LoggedExercise {
  name: string
  sets: LoggedSet[]
}

export interface LoggedSet {
  weight_kg: number
  reps: number
  completed: boolean
}
