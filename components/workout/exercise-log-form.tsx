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
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-4 w-4 text-primary/70" />
          <div>
            <p className="text-sm font-semibold text-foreground">{exercise.name}</p>
            <p className="text-xs text-muted-foreground">
              Target: {exercise.sets} x {exercise.reps} &middot; {exercise.rest_sec}s rest
            </p>
          </div>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {completedCount}/{sets.length}
        </span>
      </div>

      <div className="border-t border-border">
        {/* Column headers */}
        <div className="grid grid-cols-[2.5rem_1fr_1fr_2.5rem_2.5rem] gap-1 px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
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
              "grid grid-cols-[2.5rem_1fr_1fr_2.5rem_2.5rem] items-center gap-1 px-3 py-1 transition-colors",
              set.completed && "bg-success/5"
            )}
          >
            <span className="text-center text-sm font-medium text-muted-foreground">
              {i + 1}
            </span>
            <Input
              type="number"
              inputMode="decimal"
              value={set.weight_kg || ""}
              onChange={(e) => updateSet(i, "weight_kg", parseFloat(e.target.value) || 0)}
              className="h-9 bg-background text-center font-mono text-sm"
              placeholder="0"
            />
            <Input
              type="number"
              inputMode="numeric"
              value={set.reps || ""}
              onChange={(e) => updateSet(i, "reps", parseInt(e.target.value) || 0)}
              className="h-9 bg-background text-center font-mono text-sm"
              placeholder="0"
            />
            <button
              type="button"
              onClick={() => toggleComplete(i)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-md border transition-all",
                set.completed
                  ? "border-success bg-success text-success-foreground"
                  : "border-border text-muted-foreground hover:border-muted-foreground"
              )}
              aria-label={`Mark set ${i + 1} as ${set.completed ? "incomplete" : "complete"}`}
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => removeSet(i)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-destructive"
              aria-label={`Remove set ${i + 1}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-muted-foreground"
          onClick={addSet}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Set
        </Button>
      </div>
    </div>
  )
}
