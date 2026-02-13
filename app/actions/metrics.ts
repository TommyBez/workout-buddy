"use server"

import { createClient } from "@/lib/supabase/server"
import type { BodyMetricFormValues } from "@/lib/schemas"

export async function saveBodyMetric(values: BodyMetricFormValues) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("body_metrics")
    .insert({
      user_id: user.id,
      weight_kg: values.weight_kg || null,
      body_fat_pct: values.body_fat_pct || null,
      chest_cm: values.chest_cm || null,
      waist_cm: values.waist_cm || null,
      hips_cm: values.hips_cm || null,
      bicep_cm: values.bicep_cm || null,
      thigh_cm: values.thigh_cm || null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}
