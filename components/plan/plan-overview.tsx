"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { WorkoutPlan, FitnessGoal } from "@/lib/types"
import { WorkoutDayCard } from "@/components/workout/workout-day-card"
import { PlanFeedbackDrawer } from "@/components/plan/plan-feedback-drawer"
import { deletePlan } from "@/app/actions/plan"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface PlanOverviewProps {
  plan: WorkoutPlan
  goal: FitnessGoal | null
}

export function PlanOverview({ plan, goal }: PlanOverviewProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  function handleDelete() {
    startTransition(async () => {
      try {
        await deletePlan(plan.id)
        toast.success("Plan deleted successfully")
        setIsOpen(false)
        router.push("/plan")
        router.refresh()
      } catch {
        toast.error("Failed to delete plan")
      }
    })
  }

  return (
    <div className="flex flex-col gap-3 px-4 pb-4">
      <div className="animate-fade-in delay-50 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {plan.plan_data.days.length} days per week &middot; Week {plan.week_number}
        </p>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete plan</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this plan?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete &quot;{plan.name}&quot; and all associated workout sessions. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {plan.plan_data.days.map((day, index) => (
        <div key={index} className="animate-fade-up" style={{ animationDelay: `${100 + index * 75}ms` }}>
          <WorkoutDayCard day={day} dayIndex={index} />
        </div>
      ))}

      <div className="animate-fade-up" style={{ animationDelay: `${100 + plan.plan_data.days.length * 75 + 50}ms` }}>
        <PlanFeedbackDrawer plan={plan} goal={goal} />
      </div>
    </div>
  )
}
