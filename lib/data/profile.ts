import { cacheLife, cacheTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { Profile, FitnessGoal } from "@/lib/types"

export async function getProfileData() {
  "use cache: private"
  cacheLife("hours")
  cacheTag("profile", "profiles", "fitness-goals")

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

  return {
    user,
    profile: profileRes.data as Profile | null,
    activeGoal: goalRes.data as FitnessGoal | null,
  }
}
