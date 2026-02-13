"use client"

import { useState } from "react"
import type { WorkoutDay } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, ChevronDown, ChevronUp, Timer } from "lucide-react"
import { cn } from "@/lib/utils"

interface WorkoutDayCardProps {
  day: WorkoutDay
  dayIndex: number
  isToday?: boolean
  defaultExpanded?: boolean
}

export function WorkoutDayCard({
  day,
  dayIndex,
  isToday = false,
  defaultExpanded = false,
}: WorkoutDayCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div
      className={cn(
        "rounded-xl border bg-card transition-all",
        isToday ? "border-primary/50 ring-1 ring-primary/20" : "border-border"
      )}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between p-4 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg font-bold",
              isToday
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            )}
          >
            {dayIndex + 1}
          </div>
          <div>
            <p className="font-semibold text-foreground">{day.name}</p>
            <p className="text-xs text-muted-foreground">{day.focus}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {day.exercises.length}
          </Badge>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          {day.warmup && (
            <p className="mb-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Warmup:</span> {day.warmup}
            </p>
          )}

          <div className="flex flex-col gap-2">
            {day.exercises.map((exercise, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg bg-secondary/50 px-3 py-2.5"
              >
                <Dumbbell className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{exercise.name}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-mono">
                      {exercise.sets} x {exercise.reps}
                    </span>
                    <span className="flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      {exercise.rest_sec}s rest
                    </span>
                  </div>
                  {exercise.notes && (
                    <p className="mt-1 text-xs text-muted-foreground/80">{exercise.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {day.cooldown && (
            <p className="mt-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Cooldown:</span> {day.cooldown}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
