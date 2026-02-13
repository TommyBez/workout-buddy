import { Button } from '@/components/ui/button'
import { Dumbbell, Target, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Dumbbell className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">FitForge</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login" className="text-muted-foreground">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-20 pt-10">
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Smart workout planning
          </div>
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Train smarter, not harder
          </h1>
          <p className="mb-8 text-pretty text-lg leading-relaxed text-muted-foreground">
            Get personalized gym workout plans tailored to your goals, track your progress, and watch your plans evolve as you get stronger.
          </p>
          <Button size="lg" className="h-12 px-8 text-base" asChild>
            <Link href="/auth/sign-up">Start Your Journey</Link>
          </Button>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg gap-4 md:max-w-2xl md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-1 font-semibold text-card-foreground">Set Your Goals</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Define what you want to achieve and get a plan built around your targets.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-1 font-semibold text-card-foreground">Custom Workouts</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Every plan is built for your experience level, available equipment, and schedule.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-1 font-semibold text-card-foreground">Track Progress</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Log workouts and measurements. Your plan adapts as you improve.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
