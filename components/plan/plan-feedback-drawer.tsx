"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer"
import { MessageSquare, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { savePlan } from "@/app/actions/plan"
import type { FitnessGoal, WorkoutPlan, WorkoutLog } from "@/lib/types"

const QUICK_FEEDBACK = [
  "Too easy overall",
  "Too hard overall",
  "Need more rest days",
  "Want more leg work",
  "Want more upper body",
  "Sessions are too long",
] as const

interface PlanFeedbackDrawerProps {
  plan: WorkoutPlan
  goal: FitnessGoal | null
  recentLogs: WorkoutLog[]
}

export function PlanFeedbackDrawer({ plan, goal, recentLogs }: PlanFeedbackDrawerProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [selectedQuick, setSelectedQuick] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  function toggleQuick(item: string) {
    setSelectedQuick((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }

  async function handleSubmit() {
    const combined = [...selectedQuick, feedback].filter(Boolean).join(". ")
    if (!combined) return

    setIsSubmitting(true)
    try {
      const avgDifficulty = recentLogs.length > 0
        ? recentLogs.reduce((sum, l) => sum + (plan.difficulty_rating || 3), 0) / recentLogs.length
        : 3

      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: { goal_type: goal?.goal_type ?? "general_fitness" },
          metrics: {
            weight_kg: 75,
            experience_level: "intermediate",
          },
          preferences: {
            days_per_week: goal?.days_per_week ?? plan.plan_data.days.length,
            session_duration_min: goal?.session_duration_min ?? 60,
            equipment_access: goal?.equipment_access ?? ["barbell", "dumbbells", "machines"],
            focus_areas: goal?.focus_areas ?? ["chest", "back", "legs"],
          },
          feedback: combined,
          recentLogs: {
            count: recentLogs.length,
            avgDifficulty,
          },
        }),
      })

      if (!response.ok) throw new Error("Failed")

      const data = await response.json()

      await savePlan({
        goalId: goal?.id ?? plan.goal_id ?? "",
        planOutput: data.plan,
        weekNumber: plan.week_number + 1,
      })

      toast.success("Plan updated based on your feedback!")
      setIsOpen(false)
      setFeedback("")
      setSelectedQuick([])
      router.refresh()
    } catch {
      toast.error("Something went wrong. Try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="mt-2 w-full gap-2">
          <MessageSquare className="h-4 w-4" />
          Adjust Plan
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-card">
        <DrawerHeader>
          <DrawerTitle>How should we adjust your plan?</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-4 px-4">
          <div className="flex flex-wrap gap-2">
            {QUICK_FEEDBACK.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleQuick(item)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-all",
                  selectedQuick.includes(item)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-muted-foreground/50"
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="feedback">Additional details</Label>
            <Textarea
              id="feedback"
              placeholder="Tell us what to change..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[80px] bg-background"
            />
          </div>
        </div>
        <DrawerFooter>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (!feedback && selectedQuick.length === 0)}
            className="h-12"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isSubmitting ? "Adjusting..." : "Update My Plan"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
