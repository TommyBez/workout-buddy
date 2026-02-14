import { Skeleton } from "@/components/ui/skeleton"

export function ProgressSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-32 rounded-xl" />
    </div>
  )
}
