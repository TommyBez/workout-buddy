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
      <div className="animate-fade-up delay-0 space-y-1">
        <h2 className="font-display text-3xl uppercase tracking-wide">About You</h2>
        <p className="text-sm text-muted-foreground">
          We use this to personalize your workout intensity.
        </p>
      </div>

      <div className="animate-fade-up delay-100 flex gap-3">
        <div className="flex-1 space-y-2">
          <Label htmlFor="weight" className="text-xs uppercase tracking-wider text-muted-foreground">
            Weight (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            inputMode="decimal"
            placeholder="75"
            value={weightKg}
            onChange={(e) => onWeightChange(e.target.value)}
            className="h-12 border-border bg-card text-lg focus-visible:border-primary/50 focus-visible:ring-primary/20"
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="height" className="text-xs uppercase tracking-wider text-muted-foreground">
            Height (cm)
          </Label>
          <Input
            id="height"
            type="number"
            inputMode="decimal"
            placeholder="175"
            value={heightCm}
            onChange={(e) => onHeightChange(e.target.value)}
            className="h-12 border-border bg-card text-lg focus-visible:border-primary/50 focus-visible:ring-primary/20"
          />
        </div>
      </div>

      <div className="animate-fade-up delay-200 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Experience Level</Label>
        <div className="flex flex-col gap-2">
          {EXPERIENCE_LEVELS.map((level, i) => {
            const isSelected = experienceLevel === level.value
            return (
              <button
                key={level.value}
                type="button"
                onClick={() => onExperienceChange(level.value)}
                className={cn(
                  "animate-fade-up flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all duration-300",
                  isSelected
                    ? "option-selected border-primary bg-primary/10"
                    : "border-border bg-card hover:border-muted-foreground/30"
                )}
                style={{ animationDelay: `${250 + i * 75}ms` }}
              >
                <div>
                  <p className="font-medium text-foreground">{level.label}</p>
                  <p className="text-xs text-muted-foreground">{level.description}</p>
                </div>
                <div
                  className={cn(
                    "h-5 w-5 rounded-full border-2 transition-all duration-300",
                    isSelected ? "border-primary bg-primary shadow-md shadow-primary/25" : "border-muted-foreground/40"
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
