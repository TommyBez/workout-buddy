import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

async function AuthErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-card-foreground">Something went wrong</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              {params?.error ? `Error: ${params.error}` : 'An unspecified error occurred.'}
            </p>
            <Link href="/auth/login" className="text-sm text-primary underline-offset-4 hover:underline">
              Back to sign in
            </Link>
          </CardContent>
        </Card>
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
      <div className="flex min-h-svh w-full items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Card className="border-border bg-card">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted animate-pulse" />
              <CardTitle className="text-xl font-bold tracking-tight text-card-foreground">Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    }>
      <AuthErrorContent searchParams={searchParams} />
    </Suspense>
  )
}
