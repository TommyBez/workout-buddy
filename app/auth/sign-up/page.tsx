'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Dumbbell, ArrowRight } from 'lucide-react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden p-6">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="auth-glow absolute inset-0" />
        <div className="grain-subtle absolute inset-0 overflow-hidden" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(hsl(0 0% 100% / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex flex-col items-center gap-10">
          {/* Logo */}
          <div className="animate-fade-in delay-0 flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
              <div className="absolute -inset-1 -z-10 rounded-xl bg-primary/20 blur-md" />
            </div>
            <span className="font-display text-3xl uppercase tracking-wide text-foreground">
              FitForge
            </span>
          </div>

          {/* Card */}
          <div className="animate-fade-up delay-100 forge-card w-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm">
            <div className="relative px-6 pb-2 pt-8 text-center">
              <h1 className="font-display text-3xl uppercase tracking-wide text-card-foreground">
                Create your account
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Start your fitness journey today
              </p>
            </div>
            <div className="relative px-6 pb-8 pt-4">
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 border-border bg-background/50 text-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password" className="text-xs uppercase tracking-wider text-muted-foreground">
                      Confirm Password
                    </Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      className="h-12 border-border bg-background/50 text-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    />
                  </div>
                  {error && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="group relative mt-2 h-12 w-full overflow-hidden text-base font-semibold shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/25"
                    disabled={isLoading}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? 'Creating account...' : 'Create Account'}
                      {!isLoading && (
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      )}
                    </span>
                    <div className="btn-shimmer absolute inset-0" />
                  </Button>
                </div>
                <div className="mt-8 text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
