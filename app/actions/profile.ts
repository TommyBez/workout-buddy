"use server"

import { updateTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function updateProfile(formData: {
  display_name: string
  gender?: string
  height_cm?: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: formData.display_name,
      gender: formData.gender || null,
      height_cm: formData.height_cm || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) throw new Error(error.message)

  // Immediate invalidation so the profile page reflects changes
  updateTag("profile")
  updateTag("profiles")
  updateTag("dashboard") // Display name shows on dashboard greeting
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}
