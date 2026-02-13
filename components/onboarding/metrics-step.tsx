"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EXPERIENCE_LEVELS } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface MetricsStepProps {
  weightKg: string
  heightCm: string
  experienceLevel: string
  onWeightChange: (value: string) => void
  onHeightChange: (value: string) => void
  onExperienceChange: (value: string) => void
}

export function MetricsStep({
  weightKg,
  heightCm,
  experienceLevel,
  onWeightChange,
  onHeightChange,
  onExperienceChange,
}: MetricsStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">About You</h2>
        <p className="text-sm text-muted-foreground">
          We use this to personalize your workout intensity.
        </p>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            inputMode="decimal"
            placeholder="75"
            value={weightKg}
            onChange={(e) => onWeightChange(e.target.value)}
            className="h-12 bg-card text-lg"
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            inputMode="decimal"
            placeholder="175"
            value={heightCm}
            onChange={(e) => onHeightChange(e.target.value)}
            className="h-12 bg-card text-lg"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Experience Level</Label>
        <div className="flex flex-col gap-2">
          {EXPERIENCE_LEVELS.map((level) => {
            const isSelected = experienceLevel === level.value
            return (
              <button
                key={level.value}
                type="button"
                onClick={() => onExperienceChange(level.value)}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border bg-card hover:border-muted-foreground/30"
                )}
              >
                <div>
                  <p className="font-medium text-foreground">{level.label}</p>
                  <p className="text-xs text-muted-foreground">{level.description}</p>
                </div>
                <div
                  className={cn(
                    "h-5 w-5 rounded-full border-2 transition-all",
                    isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
                  )}
                >
                  {isSelected && (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
