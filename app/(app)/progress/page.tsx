import { Suspense } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { ProgressContent } from "@/components/progress/progress-content"
import { ProgressSkeleton } from "@/components/skeletons/progress-skeleton"
import { getProgressData } from "@/lib/data/progress"

async function ProgressData() {
  const data = await getProgressData()
  if (!data) return null

  return <ProgressContent metrics={data.metrics} logs={data.logs} />
}

export default function ProgressPage() {
  return (
    <div>
      {/* Static shell - prerendered instantly */}
      <AppHeader title="Progress" />

      {/* Dynamic - streams in with metrics & logs */}
      <Suspense fallback={<ProgressSkeleton />}>
        <ProgressData />
      </Suspense>
    </div>
  )
}
