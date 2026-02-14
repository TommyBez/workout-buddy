"use client"

import type { WorkoutPlanOutput } from "@/lib/schemas"
import { Badge } from "@/components/ui/badge"
import { Dumbbell } from "lucide-react"

interface PlanPreviewProps {
  plan: WorkoutPlanOutput
}

export function PlanPreview({ plan }: PlanPreviewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="animate-fade-up delay-0 space-y-1">
        <h2 className="font-display text-3xl uppercase tracking-wide">{plan.name}</h2>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </div>

      <div className="flex flex-col gap-3">
        {plan.days.map((day, index) => (
          <div
            key={index}
            className="animate-fade-up forge-card rounded-xl border border-border bg-card p-4"
            style={{ animationDelay: `${100 + index * 75}ms` }}
          >
            <div className="relative flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{day.name}</p>
                <p className="text-xs text-muted-foreground">{day.focus}</p>
              </div>
              <Badge variant="secondary" className="border-0 bg-secondary/80 text-xs">
                {day.exercises.length} exercises
              </Badge>
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              {day.exercises.map((ex, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Dumbbell className="h-3.5 w-3.5 shrink-0 text-primary/50" />
                  <span className="text-foreground">{ex.name}</span>
                  <span className="ml-auto font-mono text-xs text-foreground/60">
                    {ex.sets}×{ex.reps}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
