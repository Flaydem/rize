import { Link } from '@inertiajs/react'
import { difficultyColor, budgetColor, difficultyLabel, budgetLabel } from '~/lib/utils'
import ScoreBadge from './score_badge'

interface Props {
  idea: any
}

export default function IdeaCard({ idea }: Props) {
  return (
    <Link
      href={`/ideas/${idea.slug}`}
      className="block bg-nb-surface rounded-xl border border-nb-border p-5 hover:border-nb-red/30 hover:bg-nb-surface-hover transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-nb-white truncate group-hover:text-nb-red transition-colors">{idea.title}</h3>
          <p className="text-sm text-nb-gray-400 mt-1 line-clamp-2">{idea.oneLiner}</p>
        </div>
        <ScoreBadge score={idea.viabilityScore} />
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {idea.categoryPrimary && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-nb-red-muted text-nb-red">
            {idea.categoryPrimary}
          </span>
        )}
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${difficultyColor(idea.difficultyLevel)}`}>
          {difficultyLabel(idea.difficultyLevel)}
        </span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${budgetColor(idea.startupBudgetLevel)}`}>
          {budgetLabel(idea.startupBudgetLevel)}
        </span>
        {idea.estimatedLaunchTimeDays && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-nb-blue-muted text-nb-blue">
            {idea.estimatedLaunchTimeDays}j
          </span>
        )}
      </div>

      {idea.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {idea.tags.slice(0, 4).map((tag: string) => (
            <span key={tag} className="text-xs text-nb-gray-500">#{tag}</span>
          ))}
        </div>
      )}
    </Link>
  )
}
