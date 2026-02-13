import { createClient } from "@/lib/supabase/server"
import { AppHeader } from "@/components/layout/app-header"
import { ProfileContent } from "@/components/profile/profile-content"
import type { Profile, FitnessGoal } from "@/lib/types"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const [profileRes, goalRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("fitness_goals")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ])

  const profile = profileRes.data as Profile | null
  const activeGoal = goalRes.data as FitnessGoal | null

  return (
    <div>
      <AppHeader title="Profile" />
      <ProfileContent
        email={user.email ?? ""}
        profile={profile}
        activeGoal={activeGoal}
      />
    </div>
  )
}
