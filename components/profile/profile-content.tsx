"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Profile, FitnessGoal } from "@/lib/types"
import { GOAL_OPTIONS, EXPERIENCE_LEVELS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { updateProfile, signOut } from "@/app/actions/profile"
import { toast } from "sonner"
import {
  User,
  Target,
  Calendar,
  Dumbbell,
  Clock,
  LogOut,
  Loader2,
  RefreshCw,
} from "lucide-react"

interface ProfileContentProps {
  email: string
  profile: Profile | null
  activeGoal: FitnessGoal | null
}

export function ProfileContent({ email, profile, activeGoal }: ProfileContentProps) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "")
  const [isSaving, setIsSaving] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const goalLabel = activeGoal
    ? GOAL_OPTIONS.find((g) => g.value === activeGoal.goal_type)?.label ?? activeGoal.goal_type
    : null
  const expLabel = profile
    ? EXPERIENCE_LEVELS.find((e) => e.value === profile.experience_level)?.label ?? profile.experience_level
    : null

  async function handleSave() {
    setIsSaving(true)
    try {
      await updateProfile({
        display_name: displayName,
        height_cm: profile?.height_cm ? Number(profile.height_cm) : undefined,
      })
      toast.success("Profile updated!")
      router.refresh()
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleSignOut() {
    setIsSigningOut(true)
    await signOut()
  }

  return (
    <div className="flex flex-col gap-6 px-4 pb-24">
      {/* Account */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <User className="h-4 w-4" />
          Account
        </h2>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
              <p id="email" className="text-sm text-foreground">{email}</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs">Display Name</Label>
              <Input
                id="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-11 bg-background"
                placeholder="Your name"
              />
            </div>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving || displayName === (profile?.display_name ?? "")}
            >
              {isSaving && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </section>

      {/* Current Goal */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <Target className="h-4 w-4" />
          Current Goal
        </h2>
        {activeGoal ? (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">{goalLabel}</span>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/plan/generate">
                    <RefreshCw className="mr-1 h-3.5 w-3.5" />
                    Change
                  </Link>
                </Button>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{activeGoal.days_per_week} days/week</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{activeGoal.session_duration_min} min</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Dumbbell className="h-4 w-4" />
                  <span>{activeGoal.equipment_access?.length ?? 0} equipment</span>
                </div>
                {expLabel && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <span>{expLabel}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="mb-2 text-sm text-muted-foreground">No active goal</p>
            <Button asChild size="sm">
              <Link href="/plan/generate">Set a Goal</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Sign Out */}
      <Button
        variant="outline"
        className="mt-4 h-12 w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={handleSignOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        {isSigningOut ? "Signing out..." : "Sign Out"}
      </Button>
    </div>
  )
}
