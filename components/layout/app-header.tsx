interface AppHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function AppHeader({ title, subtitle, action }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 pb-2 pt-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </header>
  )
}
