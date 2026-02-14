import { Suspense } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { ProfileContent } from "@/components/profile/profile-content"
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton"
import { getProfileData } from "@/lib/data/profile"

async function ProfileData() {
  const data = await getProfileData()
  if (!data) return null

  return (
    <ProfileContent
      email={data.user.email ?? ""}
      profile={data.profile}
      activeGoal={data.activeGoal}
    />
  )
}

export default function ProfilePage() {
  return (
    <div>
      {/* Static shell - prerendered instantly */}
      <AppHeader title="Profile" />

      {/* Dynamic - streams in with user data */}
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileData />
      </Suspense>
    </div>
  )
}
