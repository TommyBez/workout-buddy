import { Button } from '@/components/ui/button'
import { Dumbbell, Flame, Target, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="ember-glow absolute inset-0 animate-ember-pulse" />

        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 40% 35% at 75% 70%, hsl(20 85% 45% / 0.06) 0%, transparent 70%)',
          }}
        />

        <div className="grain absolute inset-0 overflow-hidden" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(hsl(0 0% 100% / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <header className="animate-fade-in delay-0 relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
            <Dumbbell className="h-5 w-5 text-primary-foreground" />
            <div className="absolute -inset-1 -z-10 rounded-xl bg-primary/20 blur-md" />
          </div>
          <span className="font-display text-2xl uppercase tracking-wide text-foreground">
            FitForge
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button size="sm" className="relative overflow-hidden shadow-lg shadow-primary/20" asChild>
            <Link href="/auth/sign-up">
              <span className="relative z-10">Get Started</span>
              <div className="btn-shimmer absolute inset-0" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-8 md:px-10">
        <div className="mx-auto w-full max-w-3xl">
          <div className="animate-fade-up delay-100 mb-8 flex justify-center md:justify-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary backdrop-blur-sm">
              <Flame className="h-3.5 w-3.5" />
              <span className="font-medium">Intelligent workout planning</span>
            </div>
          </div>

          <h1 className="animate-fade-up delay-200 mb-6 text-center font-display text-7xl uppercase leading-[0.9] tracking-tight text-foreground md:text-left md:text-8xl lg:text-9xl">
            Forge
            <br />
            <span className="bg-gradient-to-r from-primary via-amber-400 to-orange-500 bg-clip-text text-transparent">
              your body
            </span>
          </h1>

          <p className="animate-fade-up delay-300 mx-auto mb-10 max-w-md text-center text-lg leading-relaxed text-muted-foreground md:mx-0 md:text-left">
            Personalized gym plans that evolve with you. Set your targets,
            push your limits, and watch your plan adapt as you grow stronger.
          </p>

          <div className="animate-fade-up delay-400 flex flex-col items-center gap-4 sm:flex-row md:justify-start">
            <Button
              size="lg"
              className="group relative h-14 overflow-hidden rounded-xl px-10 text-base font-semibold shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30"
              asChild
            >
              <Link href="/auth/sign-up">
                <span className="relative z-10 flex items-center gap-2">
                  Start forging
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="btn-shimmer absolute inset-0" />
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">
              Free to use &middot; No credit card
            </span>
          </div>
        </div>

        <div className="mx-auto mt-24 grid w-full max-w-3xl gap-4 md:grid-cols-3">
          <div className="card-glow animate-scale-in delay-500 group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm md:row-span-1">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/10" />
            <div className="relative">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 font-display text-xl uppercase tracking-wide text-card-foreground">
                Set Your Goals
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Define what you want to achieve — strength, hypertrophy, endurance — and get a plan built around your targets.
              </p>
            </div>
          </div>

          <div className="card-glow animate-scale-in delay-600 group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/10" />
            <div className="relative">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 font-display text-xl uppercase tracking-wide text-card-foreground">
                Custom Workouts
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every plan is shaped by your experience level, equipment, and schedule. No cookie-cutter routines.
              </p>
            </div>
          </div>

          <div className="card-glow animate-scale-in delay-700 group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/10" />
            <div className="relative">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 font-display text-xl uppercase tracking-wide text-card-foreground">
                Track Progress
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Log workouts and body measurements. Watch your plan evolve as you break through plateaus.
              </p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </main>
    </div>
  )
}
