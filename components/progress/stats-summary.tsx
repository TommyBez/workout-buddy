import type { WorkoutLog, BodyMetric } from "@/lib/types"
import { Flame, TrendingDown, TrendingUp, Dumbbell } from "lucide-react"

interface StatsSummaryProps {
  logs: WorkoutLog[]
  metrics: BodyMetric[]
}

export function StatsSummary({ logs, metrics }: StatsSummaryProps) {
  const totalWorkouts = logs.length

  const weightData = metrics.filter((m) => m.weight_kg !== null)
  const latestWeight = weightData.length > 0 ? Number(weightData[0].weight_kg) : null
  const firstWeight = weightData.length > 1 ? Number(weightData[weightData.length - 1].weight_kg) : null
  const weightChange = latestWeight && firstWeight ? latestWeight - firstWeight : null

  const avgDifficulty = logs.length > 0
    ? logs.reduce((sum, l) => {
        const exercises = Array.isArray(l.exercises) ? l.exercises : []
        const totalSets = exercises.reduce((s, e) => s + (e.sets?.length || 0), 0)
        return sum + totalSets
      }, 0)
    : 0

  const stats = [
    {
      label: "Total Workouts",
      value: totalWorkouts.toString(),
      icon: Dumbbell,
    },
    {
      label: "Total Sets Logged",
      value: avgDifficulty.toString(),
      icon: Flame,
    },
    {
      label: "Current Weight",
      value: latestWeight ? `${latestWeight} kg` : "--",
      icon: latestWeight ? TrendingDown : TrendingUp,
    },
    {
      label: "Weight Change",
      value: weightChange !== null ? `${weightChange > 0 ? "+" : ""}${weightChange.toFixed(1)} kg` : "--",
      icon: weightChange && weightChange < 0 ? TrendingDown : TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-border bg-card p-3">
          <stat.icon className="mb-1 h-4 w-4 text-muted-foreground" />
          <p className="text-lg font-bold text-foreground">{stat.value}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  )
}
