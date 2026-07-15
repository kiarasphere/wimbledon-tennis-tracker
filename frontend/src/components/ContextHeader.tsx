import type { SeasonContext } from '../api'

interface ContextHeaderProps {
  title: string
  context: SeasonContext | null
  eyebrow?: string
  subtitle?: string
}

export function ContextHeader({ title, context, eyebrow = 'Rankings', subtitle }: ContextHeaderProps) {
  const resolvedSubtitle =
    subtitle ??
    (context
      ? `${context.year} Season · After ${context.tournament_name ?? context.country_name ?? 'latest tournament'}`
      : 'Loading season context...')

  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="subtitle">{resolvedSubtitle}</p>
      </div>
    </header>
  )
}
