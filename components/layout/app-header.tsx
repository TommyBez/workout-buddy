interface AppHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function AppHeader({ title, subtitle, action }: AppHeaderProps) {
  return (
    <header className="animate-fade-in delay-0 flex items-center justify-between px-4 pb-3 pt-6">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </header>
  )
}
