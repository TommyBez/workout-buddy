import { Skeleton } from "@/components/ui/skeleton"

export function WorkoutLogSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-12 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}
