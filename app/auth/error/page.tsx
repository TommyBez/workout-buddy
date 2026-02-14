import { Suspense } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

async function AuthErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 50% 40% at 50% 45%, hsl(0 72% 51% / 0.06) 0%, transparent 70%)',
        }} />
        <div className="grain-subtle absolute inset-0 overflow-hidden" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="animate-scale-in delay-0 forge-card rounded-2xl border border-border bg-card/80 p-8 text-center backdrop-blur-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-destructive/10 ring-1 ring-destructive/20">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-card-foreground">
            Something went wrong
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {params?.error ? `Error: ${params.error}` : 'An unspecified error occurred.'}
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

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  return (
    <Suspense fallback={
      <div className="relative flex min-h-svh w-full items-center justify-center p-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="grain-subtle absolute inset-0 overflow-hidden" />
        </div>
        <div className="relative z-10 w-full max-w-sm">
          <div className="forge-card rounded-2xl border border-border bg-card/80 p-8 text-center backdrop-blur-sm">
            <div className="mx-auto mb-5 h-14 w-14 animate-pulse rounded-xl bg-muted" />
            <h1 className="font-display text-3xl uppercase tracking-wide text-card-foreground">Loading...</h1>
          </div>
        </div>
      </div>
    }>
      <AuthErrorContent searchParams={searchParams} />
    </Suspense>
  )
}
