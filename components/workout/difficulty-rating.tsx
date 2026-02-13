"use client"

import { cn } from "@/lib/utils"
import { DIFFICULTY_LABELS } from "@/lib/constants"

interface DifficultyRatingProps {
  value: number
  onChange: (value: number) => void
}

export function DifficultyRating({ value, onChange }: DifficultyRatingProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">How was that workout?</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={cn(
              "flex h-12 flex-1 flex-col items-center justify-center rounded-xl border text-xs transition-all",
              value === rating
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-muted-foreground/50"
            )}
          >
            <span className="text-base font-bold">{rating}</span>
          </button>
        ))}
      </div>
      {value > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          {DIFFICULTY_LABELS[value]}
        </p>
      )}
    </div>
  )
}
