export const GOAL_OPTIONS = [
  { value: "lose_weight", label: "Lose Weight", description: "Burn fat and get leaner" },
  { value: "build_muscle", label: "Build Muscle", description: "Gain size and definition" },
  { value: "get_stronger", label: "Get Stronger", description: "Increase your lifts" },
  { value: "general_fitness", label: "General Fitness", description: "Improve overall health" },
] as const

export const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner", description: "Less than 6 months" },
  { value: "intermediate", label: "Intermediate", description: "6 months to 2 years" },
  { value: "advanced", label: "Advanced", description: "2+ years consistent" },
] as const

export const EQUIPMENT_OPTIONS = [
  { value: "barbell", label: "Barbell" },
  { value: "dumbbells", label: "Dumbbells" },
  { value: "cables", label: "Cable Machine" },
  { value: "machines", label: "Gym Machines" },
  { value: "pullup_bar", label: "Pull-up Bar" },
  { value: "bench", label: "Flat/Incline Bench" },
  { value: "squat_rack", label: "Squat Rack" },
  { value: "kettlebells", label: "Kettlebells" },
] as const

export const FOCUS_AREAS = [
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "shoulders", label: "Shoulders" },
  { value: "legs", label: "Legs" },
  { value: "arms", label: "Arms" },
  { value: "core", label: "Core" },
] as const

export const MUSCLE_GROUP_COLORS: Record<string, string> = {
  chest: "hsl(38 92% 50%)",
  back: "hsl(160 60% 45%)",
  shoulders: "hsl(200 70% 50%)",
  legs: "hsl(280 65% 60%)",
  arms: "hsl(340 75% 55%)",
  core: "hsl(60 60% 50%)",
}

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Too Easy",
  2: "Easy",
  3: "Just Right",
  4: "Hard",
  5: "Too Hard",
}
