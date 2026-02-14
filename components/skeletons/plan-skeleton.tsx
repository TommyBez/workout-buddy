import { Skeleton } from "@/components/ui/skeleton"

export function PlanSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-4 pb-4">
      <Skeleton className="h-4 w-40" />
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-28 rounded-xl" />
      ))}
    </div>
  )
}
