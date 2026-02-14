"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, Plus, Trash2, Dumbbell } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LoggedSet, PlannedExercise } from "@/lib/types"

interface ExerciseLogFormProps {
  exercise: PlannedExercise
  sets: LoggedSet[]
  onSetsChange: (sets: LoggedSet[]) => void
}

export function ExerciseLogForm({ exercise, sets, onSetsChange }: ExerciseLogFormProps) {
  function addSet() {
    const lastSet = sets[sets.length - 1]
    onSetsChange([
      ...sets,
      { weight_kg: lastSet?.weight_kg ?? 0, reps: lastSet?.reps ?? 0, completed: false },
    ])
  }

  function removeSet(index: number) {
    onSetsChange(sets.filter((_, i) => i !== index))
  }

  function updateSet(index: number, field: keyof LoggedSet, value: number | boolean) {
    onSetsChange(
      sets.map((set, i) => (i === index ? { ...set, [field]: value } : set))
    )
  }

  function toggleComplete(index: number) {
    updateSet(index, "completed", !sets[index].completed)
  }

  const completedCount = sets.filter((s) => s.completed).length

  return (
    <div className="forge-card rounded-xl border border-border bg-card">
      <div className="relative flex items-center justify-between p-3.5">
        <div className="flex items-center gap-2.5">
          <Dumbbell className="h-4 w-4 text-primary/50" />
          <div>
            <p className="text-sm font-semibold text-foreground">{exercise.name}</p>
            <p className="text-xs text-muted-foreground">
              Target: {exercise.sets} × {exercise.reps} &middot; {exercise.rest_sec}s rest
            </p>
          </div>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {completedCount}/{sets.length}
        </span>
      </div>

      <div className="border-t border-border/60">
        {/* Column headers */}
        <div className="grid grid-cols-[2.5rem_1fr_1fr_2.5rem_2.5rem] gap-1 px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/70">
          <span className="text-center">Set</span>
          <span className="text-center">kg</span>
          <span className="text-center">Reps</span>
          <span className="sr-only">Complete</span>
          <span className="sr-only">Delete</span>
        </div>

        {sets.map((set, i) => (
          <div
            key={i}
            className={cn(
              "grid grid-cols-[2.5rem_1fr_1fr_2.5rem_2.5rem] items-center gap-1 px-3 py-1 transition-all duration-300",
              set.completed && "bg-success/5"
            )}
          >
            <span className="text-center font-mono text-sm text-muted-foreground">
              {i + 1}
            </span>
            <Input
              type="number"
              inputMode="decimal"
              value={set.weight_kg || ""}
              onChange={(e) => updateSet(i, "weight_kg", parseFloat(e.target.value) || 0)}
              className="h-9 bg-background/50 text-center font-mono text-sm focus-visible:border-primary/50 focus-visible:ring-primary/20"
              placeholder="0"
            />
            <Input
              type="number"
              inputMode="numeric"
              value={set.reps || ""}
              onChange={(e) => updateSet(i, "reps", parseInt(e.target.value) || 0)}
              className="h-9 bg-background/50 text-center font-mono text-sm focus-visible:border-primary/50 focus-visible:ring-primary/20"
              placeholder="0"
            />
            <button
              type="button"
              onClick={() => toggleComplete(i)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-md border transition-all duration-300",
                set.completed
                  ? "border-success bg-success text-success-foreground shadow-sm shadow-success/20"
                  : "border-border text-muted-foreground hover:border-muted-foreground"
              )}
              aria-label={`Mark set ${i + 1} as ${set.completed ? "incomplete" : "complete"}`}
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => removeSet(i)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-300 hover:text-destructive"
              aria-label={`Remove set ${i + 1}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="relative p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-muted-foreground transition-colors duration-300 hover:text-primary"
          onClick={addSet}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Set
        </Button>
      </div>
    </div>
  )
}
