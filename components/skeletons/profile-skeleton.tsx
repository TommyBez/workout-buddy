import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6 px-4 pb-24">
      <div className="space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-36 rounded-xl" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  )
}
