import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden p-6">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="auth-glow absolute inset-0" />
        <div className="grain-subtle absolute inset-0 overflow-hidden" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="animate-scale-in delay-0 forge-card rounded-2xl border border-border bg-card/80 p-8 text-center backdrop-blur-sm">
          <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Mail className="h-7 w-7 text-primary" />
            <div className="absolute -inset-2 -z-10 rounded-2xl bg-primary/5 blur-lg" />
          </div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-card-foreground">
            Check your email
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {"We've sent you a confirmation link. Click it to activate your account and start forging."}
          </p>
          <div className="mt-8">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
