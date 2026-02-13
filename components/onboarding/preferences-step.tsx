"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { EQUIPMENT_OPTIONS, FOCUS_AREAS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface PreferencesStepProps {
  daysPerWeek: number
  sessionDuration: number
  equipment: string[]
  focusAreas: string[]
  onDaysChange: (value: number) => void
  onDurationChange: (value: number) => void
  onEquipmentToggle: (value: string) => void
  onFocusToggle: (value: string) => void
}

export function PreferencesStep({
  daysPerWeek,
  sessionDuration,
  equipment,
  focusAreas,
  onDaysChange,
  onDurationChange,
  onEquipmentToggle,
  onFocusToggle,
}: PreferencesStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Preferences</h2>
        <p className="text-sm text-muted-foreground">
          Fine-tune your schedule and equipment access.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Days per Week</Label>
          <span className="text-lg font-bold text-primary">{daysPerWeek}</span>
        </div>
        <Slider
          value={[daysPerWeek]}
          onValueChange={([v]) => onDaysChange(v)}
          min={2}
          max={6}
          step={1}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>2 days</span>
          <span>6 days</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Session Length</Label>
          <span className="text-lg font-bold text-primary">{sessionDuration} min</span>
        </div>
        <Slider
          value={[sessionDuration]}
          onValueChange={([v]) => onDurationChange(v)}
          min={30}
          max={120}
          step={15}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>30 min</span>
          <span>120 min</span>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Available Equipment</Label>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map((item) => {
            const isSelected = equipment.includes(item.value)
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onEquipmentToggle(item.value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-all",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-muted-foreground/50"
                )}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Focus Areas</Label>
        <div className="flex flex-wrap gap-2">
          {FOCUS_AREAS.map((area) => {
            const isSelected = focusAreas.includes(area.value)
            return (
              <button
                key={area.value}
                type="button"
                onClick={() => onFocusToggle(area.value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-all",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-muted-foreground/50"
                )}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
                {area.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
