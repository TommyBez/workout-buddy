"use client"

import { GOAL_OPTIONS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Target, Dumbbell, TrendingUp, Heart } from "lucide-react"

const GOAL_ICONS: Record<string, React.ElementType> = {
  lose_weight: Target,
  build_muscle: Dumbbell,
  get_stronger: TrendingUp,
  general_fitness: Heart,
}

interface GoalStepProps {
  value: string
  onChange: (value: string) => void
}

export function GoalStep({ value, onChange }: GoalStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="animate-fade-up delay-0 space-y-1">
        <h2 className="font-display text-3xl uppercase tracking-wide">{"What's your goal?"}</h2>
        <p className="text-sm text-muted-foreground">
          This helps us create the right plan for you.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {GOAL_OPTIONS.map((option, i) => {
          const Icon = GOAL_ICONS[option.value]
          const isSelected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "animate-fade-up flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all duration-300",
                isSelected
                  ? "option-selected border-primary bg-primary/10"
                  : "border-border bg-card hover:border-muted-foreground/30 hover:bg-card/80"
              )}
              style={{ animationDelay: `${100 + i * 75}ms` }}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
